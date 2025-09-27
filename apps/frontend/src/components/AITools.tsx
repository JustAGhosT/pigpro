import React, { useState } from 'react';
import { 
  Upload, 
  Camera, 
  Brain, 
  Target, 
  TrendingUp, 
  Award,
  Zap,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface AnalysisResult {
  breed: string;
  confidence: number;
  healthScore: number;
  recommendations: string[];
  estimatedValue: number;
}

const OptimizationCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'available' | 'processing' | 'completed';
  onClick: () => void;
}> = ({ title, description, icon, status, onClick }) => (
  <div 
    onClick={onClick}
    className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
      status === 'available' ? 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50' :
      status === 'processing' ? 'border-yellow-300 bg-yellow-50' :
      'border-green-300 bg-green-50'
    }`}
  >
    <div className="flex items-center space-x-3 mb-3">
      <div className={`p-2 rounded-lg ${
        status === 'available' ? 'bg-gray-100 text-gray-600' :
        status === 'processing' ? 'bg-yellow-100 text-yellow-600' :
        'bg-green-100 text-green-600'
      }`}>
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900">{title}</h3>
      {status === 'processing' && (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-600 border-t-transparent"></div>
      )}
      {status === 'completed' && (
        <CheckCircle className="h-4 w-4 text-green-600" />
      )}
    </div>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

export const AITools: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysisResult({
        breed: 'Large White',
        confidence: 94,
        healthScore: 87,
        recommendations: [
          'Increase protein content by 2% for optimal growth',
          'Consider breeding with Duroc for improved meat quality',
          'Monitor for respiratory issues due to current conditions'
        ],
        estimatedValue: 2850
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Optimization Tools</h1>
        <p className="text-gray-600 mt-1">Leverage artificial intelligence to maximize your farm's potential</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Breed Analysis & Health Scoring</h2>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-emerald-50 rounded-full">
              <Camera className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Upload Pig Photos</h3>
              <p className="text-sm text-gray-600 mt-1">Get instant breed identification and health assessment</p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer">
                <Upload className="h-4 w-4 inline mr-2" />
                Choose Files
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  multiple
                />
              </label>
              <span className="text-sm text-gray-500">or drag and drop</span>
            </div>
          </div>
        </div>

        {/* Analysis Results */}
        {(isAnalyzing || analysisResult) && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            {isAnalyzing ? (
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-600 border-t-transparent"></div>
                <span className="text-sm text-gray-700">Analyzing image with AI...</span>
              </div>
            ) : analysisResult && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Analysis Complete</h4>
                  <span className="text-sm text-green-600">✓ Processed</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Breed Identified</div>
                    <div className="font-semibold text-gray-900">{analysisResult.breed}</div>
                    <div className="text-sm text-emerald-600">{analysisResult.confidence}% confidence</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Health Score</div>
                    <div className="font-semibold text-gray-900">{analysisResult.healthScore}/100</div>
                    <div className="text-sm text-blue-600">Good condition</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Est. Value</div>
                    <div className="font-semibold text-gray-900">R{analysisResult.estimatedValue.toLocaleString()}</div>
                    <div className="text-sm text-green-600">+15% vs average</div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2">AI Recommendations</h5>
                  <ul className="space-y-2">
                    {analysisResult.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                        <span className="text-sm text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Optimization Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OptimizationCard
          title="Breeding Optimization"
          description="Get AI-powered recommendations for optimal breeding pairs to maximize desired traits"
          icon={<Target className="h-5 w-5" />}
          status="available"
          onClick={() => {}}
        />
        <OptimizationCard
          title="Feed Efficiency Analysis"
          description="Optimize feeding schedules and nutrition plans based on breed and growth stage"
          icon={<TrendingUp className="h-5 w-5" />}
          status="available"
          onClick={() => {}}
        />
        <OptimizationCard
          title="Butchery Optimization"
          description="Maximize meat value with AI-suggested cutting patterns and byproduct utilization"
          icon={<Award className="h-5 w-5" />}
          status="available"
          onClick={() => {}}
        />
        <OptimizationCard
          title="Market Timing"
          description="Predict optimal slaughter timing based on market trends and pig development"
          icon={<Zap className="h-5 w-5" />}
          status="available"
          onClick={() => {}}
        />
      </div>

      {/* Recent Optimizations */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Optimizations</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Brain className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Breeding Plan Generated</p>
                <p className="text-xs text-gray-600">Sow #247 × Boar #156 - Expected yield: +12%</p>
              </div>
            </div>
            <span className="text-xs text-gray-500">2 days ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Feed Plan Optimized</p>
                <p className="text-xs text-gray-600">Batch A - Reduced costs by R245 per pig</p>
              </div>
            </div>
            <span className="text-xs text-gray-500">5 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};