import { Button } from '@/components/ui/button';
import React, { useState } from 'react';

/**
 * Test component to verify ErrorBoundary functionality
 * This component can be used to test error handling
 */
export const ErrorTest: React.FC = () => {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('This is a test error to verify ErrorBoundary is working!');
  }

  return (
    <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
      <h3 className="text-lg font-semibold text-yellow-800 mb-2">
        Error Boundary Test
      </h3>
      <p className="text-yellow-700 mb-4">
        Click the button below to test the error boundary functionality.
      </p>
      <Button
        onClick={() => setShouldThrow(true)}
        className="bg-yellow-600 hover:bg-yellow-700 text-white"
      >
        Throw Test Error
      </Button>
    </div>
  );
};
