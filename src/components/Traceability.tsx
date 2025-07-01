import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  MapPin, 
  User, 
  Activity,
  CheckCircle,
  AlertTriangle,
  Plus,
  Search
} from 'lucide-react';

interface TraceabilityRecord {
  id: string;
  pigId: string;
  event: string;
  date: string;
  location: string;
  performer: string;
  details: string;
  status: 'completed' | 'pending' | 'overdue';
  documents: string[];
}

interface ComplianceDocument {
  id: string;
  title: string;
  type: string;
  status: 'current' | 'expiring' | 'expired';
  expiryDate: string;
  lastUpdated: string;
}

const traceabilityRecords: TraceabilityRecord[] = [
  {
    id: '1',
    pigId: 'PIG-2024-001',
    event: 'Birth Registration',
    date: '2024-01-15',
    location: 'Farrowing House A',
    performer: 'Maria Santos',
    details: 'Born to sow #247, weight 1.2kg',
    status: 'completed',
    documents: ['Birth Certificate', 'Health Record']
  },
  {
    id: '2',
    pigId: 'PIG-2024-001',
    event: 'Vaccination',
    date: '2024-02-01',
    location: 'Treatment Area',
    performer: 'Maria Santos',
    details: 'PRRS vaccine administered',
    status: 'completed',
    documents: ['Vaccination Record']
  },
  {
    id: '3',
    pigId: 'PIG-2024-001',
    event: 'Weight Check',
    date: '2024-02-15',
    location: 'Weighing Station',
    performer: 'Johan van der Merwe',
    details: 'Current weight: 15.5kg',
    status: 'completed',
    documents: ['Growth Record']
  },
  {
    id: '4',
    pigId: 'PIG-2024-001',
    event: 'Health Inspection',
    date: '2024-03-01',
    location: 'Main Facility',
    performer: 'Maria Santos',
    details: 'Routine health check scheduled',
    status: 'pending',
    documents: []
  }
];

const complianceDocuments: ComplianceDocument[] = [
  {
    id: '1',
    title: 'Farm Registration Certificate',
    type: 'Legal',
    status: 'current',
    expiryDate: '2025-12-31',
    lastUpdated: '2024-01-15'
  },
  {
    id: '2',
    title: 'Veterinary Health Certificate',
    type: 'Health',
    status: 'expiring',
    expiryDate: '2024-04-15',
    lastUpdated: '2024-01-15'
  },
  {
    id: '3',
    title: 'Organic Certification',
    type: 'Quality',
    status: 'current',
    expiryDate: '2025-06-30',
    lastUpdated: '2024-02-01'
  },
  {
    id: '4',
    title: 'Feed Safety Certificate',
    type: 'Safety',
    status: 'expired',
    expiryDate: '2024-01-31',
    lastUpdated: '2023-12-01'
  }
];

const RecordCard: React.FC<{ record: TraceabilityRecord }> = ({ record }) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-3">
      <div>
        <h4 className="font-medium text-gray-900">{record.event}</h4>
        <p className="text-sm text-gray-600">Pig ID: {record.pigId}</p>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        record.status === 'completed' ? 'bg-green-100 text-green-700' :
        record.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
        'bg-red-100 text-red-700'
      }`}>
        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
      </span>
    </div>

    <div className="space-y-2 text-sm">
      <div className="flex items-center space-x-2">
        <Calendar className="h-4 w-4 text-gray-400" />
        <span className="text-gray-600">{new Date(record.date).toLocaleDateString()}</span>
      </div>
      <div className="flex items-center space-x-2">
        <MapPin className="h-4 w-4 text-gray-400" />
        <span className="text-gray-600">{record.location}</span>
      </div>
      <div className="flex items-center space-x-2">
        <User className="h-4 w-4 text-gray-400" />
        <span className="text-gray-600">{record.performer}</span>
      </div>
    </div>

    <p className="text-sm text-gray-700 mt-3">{record.details}</p>

    {record.documents.length > 0 && (
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex flex-wrap gap-2">
          {record.documents.map((doc, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
            >
              {doc}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
);

const DocumentCard: React.FC<{ document: ComplianceDocument }> = ({ document }) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-3">
      <div>
        <h4 className="font-medium text-gray-900">{document.title}</h4>
        <p className="text-sm text-gray-600">{document.type}</p>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        document.status === 'current' ? 'bg-green-100 text-green-700' :
        document.status === 'expiring' ? 'bg-yellow-100 text-yellow-700' :
        'bg-red-100 text-red-700'
      }`}>
        {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
      </span>
    </div>

    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600">Expires:</span>
        <span className="font-medium">{new Date(document.expiryDate).toLocaleDateString()}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Last Updated:</span>
        <span className="font-medium">{new Date(document.lastUpdated).toLocaleDateString()}</span>
      </div>
    </div>

    <div className="mt-4 flex space-x-2">
      <button className="flex-1 bg-emerald-600 text-white px-3 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm">
        <Download className="h-4 w-4 inline mr-1" />
        Download
      </button>
      <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
        Renew
      </button>
    </div>
  </div>
);

export const Traceability: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'records' | 'documents'>('records');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = traceabilityRecords.filter(record =>
    record.pigId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.event.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Traceability & Compliance</h1>
        <p className="text-gray-600 mt-1">Track animal records and maintain regulatory compliance</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">Total Records</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">1,247</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-gray-900">Compliant</span>
          </div>
          <div className="text-2xl font-bold text-green-600">98.5%</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-medium text-gray-900">Expiring Soon</span>
          </div>
          <div className="text-2xl font-bold text-yellow-600">3</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <FileText className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-900">Documents</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">24</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('records')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'records'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Activity className="h-4 w-4 inline mr-2" />
          Animal Records
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'documents'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText className="h-4 w-4 inline mr-2" />
          Compliance Docs
        </button>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={activeTab === 'records' ? 'Search records...' : 'Search documents...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Add Record</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export All</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'records' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Animal Traceability Records</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredRecords.map((record) => (
              <RecordCard key={record.id} record={record} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Compliance Documents</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {complianceDocuments.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};