import React, { useState } from 'react';
import { FileText, Download, BookOpen, Video, ExternalLink, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'guide' | 'standard' | 'form';
  category: string;
  url: string;
  downloadUrl?: string;
  size?: string;
  lastUpdated: Date;
}

// Mock data for resources
const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Poultry Show Standards 2024',
    description: 'Official standards and judging criteria for all recognized poultry breeds.',
    type: 'standard',
    category: 'Standards',
    url: '/resources/show-standards-2024.pdf',
    downloadUrl: '/downloads/show-standards-2024.pdf',
    size: '2.4 MB',
    lastUpdated: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Beginner\'s Guide to Poultry Breeding',
    description: 'Comprehensive guide for newcomers to poultry breeding and showing.',
    type: 'guide',
    category: 'Education',
    url: '/resources/beginners-guide.pdf',
    downloadUrl: '/downloads/beginners-guide.pdf',
    size: '1.8 MB',
    lastUpdated: new Date('2024-02-10')
  },
  {
    id: '3',
    title: 'Membership Application Form',
    description: 'Official form to apply for Poultry Club SA membership.',
    type: 'form',
    category: 'Membership',
    url: '/resources/membership-form.pdf',
    downloadUrl: '/downloads/membership-form.pdf',
    size: '156 KB',
    lastUpdated: new Date('2024-03-01')
  },
  {
    id: '4',
    title: 'Breed Standards Video Series',
    description: 'Educational video series covering breed characteristics and standards.',
    type: 'video',
    category: 'Education',
    url: 'https://youtube.com/poultryclub-sa',
    lastUpdated: new Date('2024-02-20')
  },
  {
    id: '5',
    title: 'Disease Prevention Guidelines',
    description: 'Best practices for maintaining poultry health and preventing diseases.',
    type: 'document',
    category: 'Health',
    url: '/resources/disease-prevention.pdf',
    downloadUrl: '/downloads/disease-prevention.pdf',
    size: '892 KB',
    lastUpdated: new Date('2024-01-30')
  },
  {
    id: '6',
    title: 'Show Entry Form',
    description: 'Standard entry form for poultry shows and competitions.',
    type: 'form',
    category: 'Shows',
    url: '/resources/show-entry-form.pdf',
    downloadUrl: '/downloads/show-entry-form.pdf',
    size: '234 KB',
    lastUpdated: new Date('2024-02-15')
  }
];

const ResourceCard: React.FC<{
  resource: Resource;
  onDownload: (resource: Resource) => void;
  onView: (resource: Resource) => void;
}> = ({ resource, onDownload, onView }) => {
  const getTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'document': return <FileText className="h-5 w-5" />;
      case 'video': return <Video className="h-5 w-5" />;
      case 'guide': return <BookOpen className="h-5 w-5" />;
      case 'standard': return <FileText className="h-5 w-5" />;
      case 'form': return <FileText className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: Resource['type']) => {
    switch (type) {
      case 'document': return 'bg-blue-100 text-blue-700';
      case 'video': return 'bg-red-100 text-red-700';
      case 'guide': return 'bg-green-100 text-green-700';
      case 'standard': return 'bg-purple-100 text-purple-700';
      case 'form': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-lg ${getTypeColor(resource.type).split(' ')[0]}`}>
              {getTypeIcon(resource.type)}
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold">{resource.title}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={`text-xs ${getTypeColor(resource.type)}`}>
                  {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                </Badge>
                <span className="text-xs text-gray-500">{resource.category}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4">{resource.description}</CardDescription>

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {resource.size && <span>{resource.size} • </span>}
            Updated {resource.lastUpdated.toLocaleDateString('en-ZA')}
          </div>

          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onView(resource)}
            >
              {resource.type === 'video' ? (
                <>
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Watch
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View
                </>
              )}
            </Button>
            {resource.downloadUrl && (
              <Button
                size="sm"
                onClick={() => onDownload(resource)}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const Resources: React.FC = () => {
  const [resources] = useState<Resource[]>(mockResources);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const categories = Array.from(new Set(resources.map(r => r.category)));
  const types = Array.from(new Set(resources.map(r => r.type)));

  const filteredResources = resources.filter(resource => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const handleDownload = (resource: Resource) => {
    if (resource.downloadUrl) {
      // In a real app, this would trigger a download
      alert(`Downloading ${resource.title}...`);
    }
  };

  const handleView = (resource: Resource) => {
    // In a real app, this would open the resource
    if (resource.type === 'video') {
      alert(`Opening video: ${resource.title}`);
    } else {
      alert(`Viewing: ${resource.title}`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Educational Resources</h1>
        <p className="text-gray-600 mt-1">
          Access standards, guides, forms, and educational materials for successful poultry breeding
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="lg:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-9 px-3 py-1 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-700"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="lg:w-48">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full h-9 px-3 py-1 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-700"
              >
                <option value="all">All Types</option>
                {types.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Access Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center hover:bg-green-50 cursor-pointer transition-colors">
            <CardContent className="pt-6">
              <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="font-medium text-gray-900">Standards</div>
              <div className="text-sm text-gray-600">Official breed standards</div>
            </CardContent>
          </Card>
          <Card className="text-center hover:bg-blue-50 cursor-pointer transition-colors">
            <CardContent className="pt-6">
              <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="font-medium text-gray-900">Guides</div>
              <div className="text-sm text-gray-600">Educational guides</div>
            </CardContent>
          </Card>
          <Card className="text-center hover:bg-yellow-50 cursor-pointer transition-colors">
            <CardContent className="pt-6">
              <FileText className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="font-medium text-gray-900">Forms</div>
              <div className="text-sm text-gray-600">Membership & entries</div>
            </CardContent>
          </Card>
          <Card className="text-center hover:bg-red-50 cursor-pointer transition-colors">
            <CardContent className="pt-6">
              <Video className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="font-medium text-gray-900">Videos</div>
              <div className="text-sm text-gray-600">Educational content</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedCategory !== 'all' || selectedType !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'No resources available at the moment.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredResources.map(resource => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onDownload={handleDownload}
              onView={handleView}
            />
          ))}
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {resources.filter(r => r.type === 'document').length}
            </div>
            <div className="text-sm text-gray-600">Documents</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {resources.filter(r => r.type === 'guide').length}
            </div>
            <div className="text-sm text-gray-600">Guides</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {resources.filter(r => r.type === 'form').length}
            </div>
            <div className="text-sm text-gray-600">Forms</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {resources.filter(r => r.type === 'video').length}
            </div>
            <div className="text-sm text-gray-600">Videos</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};