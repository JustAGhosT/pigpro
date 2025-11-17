import { app, InvocationContext, Timer } from "@azure/functions";
import Papa from "papaparse";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { query } from "../lib/db/client";
import { fileContentStore } from "./imports"; // To get the CSV content

// Validation function for production records
function validateProductionRecord(record: any, rowNumber: number): {
  isValid: boolean;
  sanitizedRecord?: any;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Normalize inputs - trim string fields and treat empty strings as missing
  const normalizedRecord = {
    species_id: record.species_id ? String(record.species_id).trim() : '',
    event_type: record.event_type ? String(record.event_type).trim() : '',
    date: record.date ? String(record.date).trim() : '',
    quantity: record.quantity ? String(record.quantity).trim() : '',
    notes: record.notes ? String(record.notes).trim() : ''
  };
  
  // Validate species_id (required, must be valid UUID format)
  if (!normalizedRecord.species_id) {
    errors.push('species_id is required and must be a string');
  } else if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(normalizedRecord.species_id)) {
    errors.push('species_id must be a valid UUID format');
  }
  
  // Validate event_type (required, must be one of allowed values)
  const allowedEventTypes = ['birth', 'death', 'milk_volume', 'egg_count', 'weight', 'vaccination', 'treatment', 'breeding'];
  if (!normalizedRecord.event_type) {
    errors.push('event_type is required and must be a string');
  } else if (!allowedEventTypes.includes(normalizedRecord.event_type.toLowerCase())) {
    errors.push(`event_type must be one of: ${allowedEventTypes.join(', ')}`);
  }
  
  // Validate date (required, must be valid ISO date)
  if (!normalizedRecord.date) {
    errors.push('date is required and must be a string');
  } else {
    const dateObj = new Date(normalizedRecord.date);
    if (isNaN(dateObj.getTime())) {
      errors.push('date must be a valid ISO date string');
    } else {
      // Check if date is not too far in the future (within 1 year)
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
      if (dateObj > oneYearFromNow) {
        errors.push('date cannot be more than 1 year in the future');
      }
      
      // Check if date is not too far in the past (within 10 years)
      const tenYearsAgo = new Date();
      tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
      if (dateObj < tenYearsAgo) {
        errors.push('date cannot be more than 10 years in the past');
      }
    }
  }
  
  // Validate quantity (optional, but if provided must be positive number)
  let quantity = null;
  if (normalizedRecord.quantity) {
    const numQuantity = Number(normalizedRecord.quantity);
    if (isNaN(numQuantity)) {
      errors.push('quantity must be a valid number');
    } else if (numQuantity < 0) {
      errors.push('quantity must be a positive number');
    } else if (numQuantity > 10000) {
      errors.push('quantity cannot exceed 10,000');
    } else {
      quantity = numQuantity;
    }
  }
  
  // Validate notes (optional, but if provided must be reasonable length)
  let notes = null;
  if (normalizedRecord.notes) {
    if (normalizedRecord.notes.length > 1000) {
      errors.push('notes cannot exceed 1000 characters');
    } else {
      notes = normalizedRecord.notes;
    }
  }
  
  if (errors.length > 0) {
    return {
      isValid: false,
      errors: errors.map(error => `Row ${rowNumber}: ${error}`)
    };
  }
  
  return {
    isValid: true,
    sanitizedRecord: {
      species_id: normalizedRecord.species_id,
      event_type: normalizedRecord.event_type.toLowerCase(),
      date: new Date(normalizedRecord.date).toISOString(),
      quantity,
      notes
    },
    errors: []
  };
}

// This function simulates a background worker processing one job at a time.
export async function processJobQueue(myTimer: Timer, context: InvocationContext): Promise<void> {
    context.log('Timer function processed request.');

    // 1. Find a pending job
    const pendingJobResult = await query(
        `SELECT * FROM report_jobs WHERE status = 'pending' ORDER BY created_at ASC LIMIT 1`
    );

    if (pendingJobResult.rowCount === 0) {
        context.log('No pending jobs to process.');
        return;
    }
    const job = pendingJobResult.rows[0];

    // 2. Set job status to 'running'
    await query(`UPDATE report_jobs SET status = 'running' WHERE id = $1`, [job.id]);
    context.log(`Processing job ${job.id} of type ${job.type}`);

    try {
        // 3. Execute the job based on its type
        if (job.type === 'production_import') {
            const csvString = fileContentStore[job.id];
            if (!csvString) throw new Error('File content not found for job.');

            const { data, errors } = Papa.parse(csvString, { header: true, skipEmptyLines: true });
            
            // Validate CSV parsing results
            if (errors && errors.length > 0) {
                throw new Error(`CSV parsing errors: ${errors.map(e => e.message).join(', ')}`);
            }
            
            if (!Array.isArray(data)) {
                throw new Error('CSV data is not in expected array format');
            }
            
            if (data.length === 0) {
                context.log('No data rows found in CSV file');
                // Update job status to completed (no-op) instead of leaving it running
-               await query(
-                   'UPDATE job_queue SET status = $1, completed_at = NOW(), error_message = $2 WHERE id = $3',
-                   ['completed', 'No data rows in CSV', job.id]
               await query(
                   'UPDATE report_jobs SET status = $1, completed_at = NOW(), error_message = $2 WHERE id = $3',
                   ['completed', 'No data rows in CSV', job.id]
               );
                return;
            }
            }

            // Validate and process each record
            const validRecords = [];
            const invalidRecords = [];
            
            for (let i = 0; i < data.length; i++) {
                const record = data[i];
                const validationResult = validateProductionRecord(record, i + 1);
                
                if (validationResult.isValid) {
                    validRecords.push(validationResult.sanitizedRecord);
                } else {
                    invalidRecords.push({ row: i + 1, errors: validationResult.errors, record });
                }
            }
            
            if (invalidRecords.length > 0) {
                context.log(`Found ${invalidRecords.length} invalid records out of ${data.length} total`);
                invalidRecords.forEach(invalid => {
                    context.log(`Row ${invalid.row}: ${invalid.errors.join(', ')}`);
                });
                
                // Decide whether to proceed with valid records or fail entirely
                if (validRecords.length === 0) {
                    throw new Error('No valid records found in CSV file');
                }
                
                context.log(`Proceeding with ${validRecords.length} valid records`);
            }

            // Insert valid records in a transaction
            await query('BEGIN');
            try {
                for (const record of validRecords) {
                await query(
                        `INSERT INTO production_records (species_id, event_type, date, quantity, notes) VALUES ($1, $2, $3, $4, $5)`,
                        [record.species_id, record.event_type, record.date, record.quantity, record.notes]
                    );
                }
                await query('COMMIT');
                context.log(`Successfully imported ${validRecords.length} production records`);
            } catch (dbError) {
                await query('ROLLBACK');
                throw new Error(`Database error during import: ${dbError.message}`);
            }
            delete fileContentStore[job.id]; // Clean up
        }
        else if (job.type === 'investor_report') {
            // The actual PDF generation logic from the old synchronous endpoint
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage();
            page.drawText('This is your asynchronously generated report!', { x: 50, y: 700, font: await pdfDoc.embedFont(StandardFonts.Helvetica), size: 16 });
            await pdfDoc.save();

            // In a real app, you would upload `pdfBytes` to blob storage and get a URL.
            // Here, we'll just simulate it.
            const reportUri = `/api/v1/reports/download/${job.id}`; // A fake download link
            await query(`UPDATE report_jobs SET uri = $1 WHERE id = $2`, [reportUri, job.id]);
        }

        // 4. Set job status to 'completed'
        await query(`UPDATE report_jobs SET status = 'completed' WHERE id = $1`, [job.id]);
        context.log(`Job ${job.id} completed successfully.`);

    } catch (error) {
        context.log(`Error processing job ${job.id}:`, error);
        // 5. Set job status to 'failed'
        await query(`UPDATE report_jobs SET status = 'failed' WHERE id = $1`, [job.id]);
    }
}

// Run this worker every 30 seconds
app.timer('processJobQueue', {
    schedule: '*/30 * * * * *',
    handler: processJobQueue
});
