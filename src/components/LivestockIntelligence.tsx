import React, { useState } from 'react';
import {
  Brain,
  Target,
  TrendingUp,
  BarChart3,
  Award,
  Camera,
  Upload,
  Download,
  Zap,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface LivestockAnalysisData {
  id: string;
  species: string;
  breed: string;
  confidence: number;
  healthScore: number;
  breedingPotential: number;
  marketValue: string;
  recommendations: string[];
  traits: {
    name: string;
    score: number;
    description: string;
  }[];
}

interface ComplianceAlert {
  id: string;
  type: 'mandatory' | 'recommended' | 'warning';
  title: string;
  description: string;
  species: string[];
  dueDate?: string;
  status: 'pending' | 'completed' | 'overdue';
}

const MOCK_ANALYSIS_DATA: LivestockAnalysisData[] = [
  {
    id: '1',
    species: 'Pig',
    breed: 'Large White',
    confidence: 94,
    healthScore: 87,
    breedingPotential: 92,
    marketValue: 'R3,200-R3,800',
    recommendations: [
      'Excellent breeding candidate due to size and conformation',
      'Monitor feed conversion ratio for optimal growth',
      'Consider crossbreeding with Landrace for hybrid vigor',
      'Schedule health check in 2 weeks'
    ],
    traits: [
      { name: 'Size & Weight', score: 95, description: 'Excellent body size for age group' },
      { name: 'Muscle Definition', score: 88, description: 'Good lean muscle development' },
      { name: 'Bone Structure', score: 90, description: 'Strong skeletal frame' },
      { name: 'Overall Health', score: 87, description: 'No visible health concerns' }
    ]
  },
  {
    id: '2',
    species: 'Goat',
    breed: 'Boer Goat',
    confidence: 91,
    healthScore: 93,
    breedingPotential: 89,
    marketValue: 'R2,800-R3,400',
    recommendations: [
      'High-quality meat goat with excellent conformation',
      'Strong breeding potential for commercial operations',
      'Monitor for internal parasites in wet season',
      'Consider supplemental feeding during dry season'
    ],
    traits: [
      { name: 'Body Conformation', score: 92, description: 'Classic Boer goat structure' },
      { name: 'Coat Quality', score: 89, description: 'Healthy coat with good coloring' },
      { name: 'Muscularity', score: 94, description: 'Excellent muscle development' },
      { name: 'Temperament', score: 85, description: 'Calm and manageable' }
    ]
  }
];

const COMPLIANCE_ALERTS: ComplianceAlert[] = [
  {
    id: '1',
    type: 'mandatory',
    title: 'ND Vaccination Due',
    description: 'Newcastle Disease vaccination required for poultry flock',
    species: ['chicken', 'duck', 'turkey'],
    dueDate: '2025-10-15',
    status: 'pending'
  },
  {
    id: '2',
    type: 'recommended',
    title: 'Health Certificate Renewal',
    description: 'Annual health certificates should be renewed for breeding stock',
    species: ['pig', 'goat', 'rabbit'],
    dueDate: '2025-11-30',
    status: 'pending'
  },
  {
    id: '3',
    type: 'warning',
    title: 'Feed Quality Assessment',
    description: 'Recent feed batch may not meet quality standards',
    species: ['pig', 'goat', 'rabbit', 'chicken'],
    status: 'overdue'
  }
];

const AnalysisCard: React.FC<{ data: LivestockAnalysisData }> = ({ data }) => {
  const getConfidenceBadgeColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-100 text-green-800';
    if (confidence >= 80) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{data.species} - {data.breed}</CardTitle>
            <CardDescription>AI Analysis Results</CardDescription>
          </div>
          <Badge className={getConfidenceBadgeColor(data.confidence)}>
            {data.confidence}% confidence
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">Health Score</span>
                <span className="font-bold text-blue-900">{data.healthScore}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2 mt-1">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${data.healthScore}%` }}
                />
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">Breeding Potential</span>
                <span className="font-bold text-green-900">{data.breedingPotential}%</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2 mt-1">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${data.breedingPotential}%` }}
                />
              </div>
            </div>
          </div>

          {/* Market Value */}
          <div className="bg-purple-50 p-3 rounded-lg">
            <span className="text-sm text-purple-700">Estimated Market Value</span>
            <div className="font-bold text-purple-900 text-lg">{data.marketValue}</div>
          </div>

          {/* Traits Analysis */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Trait Analysis</h4>
            <div className="space-y-2">
              {data.traits.map((trait, index) => (
                <div key={index} className="flex items-center justify-between py-1">
                  <span className="text-sm text-gray-700">{trait.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-green-600 h-1.5 rounded-full"
                        style={{ width: `${trait.score}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{trait.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">AI Recommendations</h4>
            <ul className="space-y-1">
              {data.recommendations.slice(0, 2).map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-2 pt-2">
            <Button size="sm" variant="outline" className="flex-1">
              <BarChart3 className="h-4 w-4 mr-1" />
              View Details
            </Button>
            <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4 mr-1" />
              Export Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ComplianceAlertCard: React.FC<{ alert: ComplianceAlert }> = ({ alert }) => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'mandatory': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getAlertColor = (type: string, status: string) => {
    if (status === 'overdue') return 'border-red-200 bg-red-50';
    switch (type) {
      case 'mandatory': return 'border-red-200 bg-red-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <div className={`p-4 border rounded-lg ${getAlertColor(alert.type, alert.status)}`}>
      <div className="flex items-start gap-3">
        {getAlertIcon(alert.type)}
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{alert.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {alert.species.join(', ')}
            </Badge>
            {alert.dueDate && (
              <span className="text-xs text-gray-500">Due: {alert.dueDate}</span>
            )}
          </div>
        </div>
        <Button size="sm" variant="outline">
          Resolve
        </Button>
      </div>
    </div>
  );
};

export const LivestockIntelligence: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'upload' | 'reports' | 'compliance'>('analysis');
  const [analysisData] = useState(MOCK_ANALYSIS_DATA);
  const [complianceAlerts] = useState(COMPLIANCE_ALERTS);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Brain className="h-8 w-8 text-green-600" />
          Livestock Intelligence Hub
        </h1>
        <p className="text-gray-600 mt-1">
          AI-powered livestock analysis, breeding insights, and compliance management
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">247</p>
                <p className="text-sm text-gray-600">Animals Analyzed</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">89%</p>
                <p className="text-sm text-gray-600">Avg Health Score</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-600">32</p>
                <p className="text-sm text-gray-600">Breeding Candidates</p>
              </div>
              <Award className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-yellow-600">5</p>
                <p className="text-sm text-gray-600">Pending Alerts</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'analysis', label: 'AI Analysis', icon: Brain },
              { id: 'upload', label: 'Upload & Scan', icon: Camera },
              { id: 'reports', label: 'Reports', icon: BarChart3 },
              { id: 'compliance', label: 'Compliance Alerts', icon: AlertTriangle }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'analysis' | 'upload' | 'reports' | 'compliance')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'analysis' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Recent AI Analysis Results</h3>
                <Button>
                  <Zap className="h-4 w-4 mr-2" />
                  New Analysis
                </Button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {analysisData.map((data) => (
                  <AnalysisCard key={data.id} data={data} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Upload Images for AI Analysis</h3>
                <p className="text-gray-600 mb-6">
                  Upload clear photos of your livestock for breed identification and health assessment
                </p>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-green-400 transition-colors">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Drop your images here</h4>
                <p className="text-gray-600 mb-4">or click to browse files</p>
                <Button className="bg-green-600 hover:bg-green-700">
                  Choose Files
                </Button>
                <p className="text-xs text-gray-500 mt-4">
                  Supports JPG, PNG, WebP up to 10MB each. Best results with clear, well-lit photos.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <Camera className="h-6 w-6 text-blue-600 mb-2" />
                  <h4 className="font-medium text-gray-900 mb-1">Photo Guidelines</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Full body shots work best</li>
                    <li>• Good lighting conditions</li>
                    <li>• Multiple angles if possible</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <Brain className="h-6 w-6 text-green-600 mb-2" />
                  <h4 className="font-medium text-gray-900 mb-1">AI Analysis</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Breed identification</li>
                    <li>• Health assessment</li>
                    <li>• Breeding recommendations</li>
                  </ul>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <Award className="h-6 w-6 text-purple-600 mb-2" />
                  <h4 className="font-medium text-gray-900 mb-1">Get Results</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Detailed analysis report</li>
                    <li>• Breeding potential score</li>
                    <li>• Market value estimates</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Analysis Reports & Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: 'Monthly Breeding Report', date: '2025-09-01', type: 'PDF', size: '2.3 MB' },
                  { title: 'Health Assessment Summary', date: '2025-09-15', type: 'PDF', size: '1.8 MB' },
                  { title: 'Market Value Analysis', date: '2025-09-20', type: 'Excel', size: '890 KB' },
                  { title: 'Compliance Checklist', date: '2025-09-22', type: 'PDF', size: '1.2 MB' },
                ].map((report, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{report.title}</h4>
                          <p className="text-sm text-gray-600">{report.date}</p>
                        </div>
                        <Badge variant="outline">{report.type}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{report.size}</span>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Compliance Alerts & Reminders</h3>
                <Button variant="outline">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark All Read
                </Button>
              </div>
              <div className="space-y-4">
                {complianceAlerts.map((alert) => (
                  <ComplianceAlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};