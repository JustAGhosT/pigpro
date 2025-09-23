import React, { useState, useMemo } from 'react';
import {
  Shield,
  FileText,
  Download,
  Filter,
  CheckCircle,
  AlertTriangle,
  Search,
  Circle,
  Bird,
  Target
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface CompliancePermit {
  id: string;
  name: string;
  applies_to: string[];
  activity: string[];
  issuing_authority: string;
  who: string;
  roles: string[];
  core: string;
  docs: string;
  refs: string[];
  category: 'forward-looking' | 'conservative';
  compliance_level: 'mandatory' | 'recommended' | 'optional';
}

interface ComplianceSOP {
  id: string;
  title: string;
  description: string;
  category: string;
  animal_types: string[];
  steps: string[];
  requirements: string[];
  references: string[];
}

const LIVESTOCK_TYPES = [
  { id: 'chickens', label: 'Chickens', icon: Bird, color: 'bg-orange-100 text-orange-800' },
  { id: 'pigs', label: 'Pigs', icon: Circle, color: 'bg-pink-100 text-pink-800' },
  { id: 'goats', label: 'Goats', icon: Target, color: 'bg-amber-100 text-amber-800' },
  { id: 'rabbits', label: 'Rabbits', icon: Circle, color: 'bg-gray-100 text-gray-800' }
];

const ACTIVITIES = [
  { id: 'breeding', label: 'Breeding Operations' },
  { id: 'live_sale', label: 'Live Animal Sales' },
  { id: 'meat_sale', label: 'Meat Production & Sales' },
  { id: 'transport', label: 'Animal Transport' },
  { id: 'export', label: 'Export Operations' },
  { id: 'vaccination', label: 'Vaccination Programs' },
  { id: 'feed_production', label: 'Feed Production' },
  { id: 'waste_management', label: 'Waste Management' }
];

const SAMPLE_PERMITS: CompliancePermit[] = [
  {
    id: 'pdma-reg',
    name: 'PDMA Live Animal Trade Registration',
    applies_to: ['chickens', 'pigs', 'goats', 'rabbits'],
    activity: ['live_sale', 'transport'],
    issuing_authority: 'PDMA (authorised by DALRRD/Director: Animal Health)',
    who: 'Commercial farms and live-animal traders buying/selling livestock for commercial purposes',
    roles: ['aht', 'private_vet', 'state_vet', 'authority'],
    core: 'Both seller and buyer must be registered. Monthly Sales Reconciliation by traders. Only sell to registered buyers. Removal Permit/Health Declaration per batch.',
    docs: 'Registration forms; Buyer/Seller registers; Monthly Sales Reconciliation; Batch Removal Permit.',
    refs: [
      'https://www.elsenburg.com/regulatory-framework/',
      'https://www.dalrrd.gov.za/livestock-regulations'
    ],
    category: 'conservative',
    compliance_level: 'mandatory'
  },
  {
    id: 'meat-safety',
    name: 'Meat Safety Act Registration',
    applies_to: ['chickens', 'pigs', 'goats', 'rabbits'],
    activity: ['meat_sale'],
    issuing_authority: 'Department of Health / Provincial Health Departments',
    who: 'Abattoirs, meat processing facilities, and meat retailers',
    roles: ['meat_inspector', 'facility_manager', 'authority'],
    core: 'Registration required for all meat processing facilities. Regular inspections and HACCP implementation mandatory.',
    docs: 'Facility registration; HACCP plans; Inspection reports; Staff training certificates.',
    refs: [
      'https://www.health.gov.za/meat-safety-act/'
    ],
    category: 'conservative',
    compliance_level: 'mandatory'
  },
  {
    id: 'environmental-impact',
    name: 'Environmental Impact Assessment',
    applies_to: ['pigs', 'chickens'],
    activity: ['breeding', 'waste_management'],
    issuing_authority: 'Department of Environmental Affairs / Provincial Environmental Departments',
    who: 'Large-scale livestock operations exceeding specified thresholds',
    roles: ['environmental_consultant', 'facility_manager', 'authority'],
    core: 'EIA required for operations above specified livestock numbers. Waste management plans mandatory.',
    docs: 'EIA reports; Waste management plans; Water use licenses; Air quality permits.',
    refs: [
      'https://www.environment.gov.za/eia-regulations'
    ],
    category: 'forward-looking',
    compliance_level: 'mandatory'
  },
  {
    id: 'feed-production-permit',
    name: 'Feed Production & Storage Permit',
    applies_to: ['chickens', 'pigs', 'goats', 'rabbits'],
    activity: ['feed_production'],
    issuing_authority: 'Department of Agriculture / Animal Feed Manufacturers Association',
    who: 'Feed producers, mixers, and storage facility operators',
    roles: ['feed_technologist', 'quality_controller', 'authority'],
    core: 'Registration and quality certification for all animal feed production. Regular testing and labeling requirements.',
    docs: 'Feed registration certificates; Quality test reports; Facility inspection certificates; Labeling compliance.',
    refs: [
      'https://www.dalrrd.gov.za/feed-regulations',
      'https://www.afma.co.za/guidelines'
    ],
    category: 'conservative',
    compliance_level: 'mandatory'
  },
  {
    id: 'transport-permit',
    name: 'Animal Transport Welfare Permit',
    applies_to: ['chickens', 'pigs', 'goats', 'rabbits'],
    activity: ['transport'],
    issuing_authority: 'Department of Agriculture / Provincial Veterinary Services',
    who: 'Commercial livestock transporters and farmers transporting animals',
    roles: ['transport_operator', 'driver', 'state_vet'],
    core: 'Proper vehicle certification, driver training, and animal welfare compliance during transport.',
    docs: 'Vehicle fitness certificates; Driver training certificates; Route permits; Animal welfare protocols.',
    refs: [
      'https://www.nspca.co.za/transport-guidelines'
    ],
    category: 'forward-looking',
    compliance_level: 'recommended'
  },
  {
    id: 'water-use-license',
    name: 'Water Use License for Livestock',
    applies_to: ['pigs', 'goats'],
    activity: ['breeding', 'waste_management'],
    issuing_authority: 'Department of Water and Sanitation / Provincial Water Boards',
    who: 'Large livestock operations with significant water consumption',
    roles: ['water_engineer', 'facility_manager', 'authority'],
    core: 'License required for water abstraction above specified limits. Water quality monitoring and reporting.',
    docs: 'Water use license; Monitoring reports; Water quality certificates; Usage log books.',
    refs: [
      'https://www.dws.gov.za/water-use-licensing'
    ],
    category: 'forward-looking',
    compliance_level: 'mandatory'
  }
];

const SAMPLE_SOPS: ComplianceSOP[] = [
  {
    id: 'animal-welfare',
    title: 'Animal Welfare Standards',
    description: 'Standard operating procedures for ensuring animal welfare across all livestock types',
    category: 'welfare',
    animal_types: ['chickens', 'pigs', 'goats', 'rabbits'],
    steps: [
      'Daily health monitoring and record keeping',
      'Appropriate housing density and space requirements',
      'Feed and water quality management',
      'Veterinary care protocols',
      'Transport welfare procedures'
    ],
    requirements: [
      'Trained personnel for animal handling',
      'Regular veterinary assessments',
      'Proper record keeping systems',
      'Emergency response procedures'
    ],
    references: [
      'Animal Protection Act 71 of 1962',
      'South African Animal Welfare Standards'
    ]
  },
  {
    id: 'biosecurity',
    title: 'Biosecurity Protocols',
    description: 'Comprehensive biosecurity measures to prevent disease outbreaks',
    category: 'health',
    animal_types: ['chickens', 'pigs', 'goats', 'rabbits'],
    steps: [
      'Visitor control and hygiene protocols',
      'Quarantine procedures for new animals',
      'Cleaning and disinfection schedules',
      'Feed and water source protection',
      'Dead animal disposal procedures'
    ],
    requirements: [
      'Designated quarantine facilities',
      'Approved disinfectants and protocols',
      'Staff training on biosecurity measures',
      'Regular health monitoring'
    ],
    references: [
      'State Veterinary Services Guidelines',
      'OIE Terrestrial Animal Health Code'
    ]
  },
  {
    id: 'feed-management',
    title: 'Feed Quality Management',
    description: 'Standard procedures for feed storage, quality control, and nutritional management',
    category: 'nutrition',
    animal_types: ['chickens', 'pigs', 'goats', 'rabbits'],
    steps: [
      'Feed quality inspection upon delivery',
      'Proper storage in dry, ventilated areas',
      'Regular testing for mycotoxins and contaminants',
      'Feed rotation and inventory management',
      'Nutritional requirement calculations per species'
    ],
    requirements: [
      'Temperature and humidity monitoring systems',
      'Feed testing laboratory access',
      'Qualified nutritionist consultation',
      'Proper storage facilities'
    ],
    references: [
      'Animal Feed Manufacturers Association Guidelines',
      'Department of Agriculture Feed Regulations'
    ]
  },
  {
    id: 'waste-management',
    title: 'Livestock Waste Management',
    description: 'Environmental compliance procedures for waste handling and disposal',
    category: 'environment',
    animal_types: ['pigs', 'chickens', 'goats'],
    steps: [
      'Daily waste collection and removal',
      'Proper composting procedures',
      'Liquid waste treatment systems',
      'Environmental impact monitoring',
      'Compliance reporting to authorities'
    ],
    requirements: [
      'Waste treatment facilities',
      'Environmental monitoring equipment',
      'Trained waste management personnel',
      'Regular environmental audits'
    ],
    references: [
      'National Environmental Management Act',
      'Water Use License Conditions'
    ]
  },
  {
    id: 'breeding-records',
    title: 'Breeding Record Management',
    description: 'Comprehensive record keeping for breeding programs and genetics',
    category: 'breeding',
    animal_types: ['pigs', 'goats', 'rabbits'],
    steps: [
      'Individual animal identification systems',
      'Breeding performance tracking',
      'Genetic lineage documentation',
      'Production record maintenance',
      'Health and vaccination history'
    ],
    requirements: [
      'Electronic or physical record systems',
      'Regular data backup procedures',
      'Staff training on record keeping',
      'Veterinary record integration'
    ],
    references: [
      'South African Stud Book Association',
      'Livestock Improvement Corporation Guidelines'
    ]
  }
];

const useFilters = (animals: string[], activities: string[], searchTerm: string) => {
  const checkAnimalMatch = (itemAnimals: string[]) =>
    animals.length === 0 || itemAnimals.some(animal => animals.includes(animal));

  const checkSearchMatch = (searchableTexts: string[]) =>
    searchTerm === '' || searchableTexts.some(text =>
      text.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return { checkAnimalMatch, checkSearchMatch };
};

const useToggleHandler = () => {
  const createToggleHandler = (setState: React.Dispatch<React.SetStateAction<string[]>>) =>
    (id: string) => {
      setState(prev =>
        prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
      );
    };

  return { createToggleHandler };
};

const AnimalBadges: React.FC<{ animalIds: string[] }> = ({ animalIds }) => (
  <>
    {animalIds.map((animal) => {
      const animalData = LIVESTOCK_TYPES.find(t => t.id === animal);
      return (
        <Badge key={animal} className={animalData?.color || 'bg-gray-100 text-gray-800'}>
          {animalData?.label}
        </Badge>
      );
    })}
  </>
);

const EmptyState: React.FC<{ type: string }> = ({ type }) => (
  <div className="text-center py-8">
    <p className="text-gray-500">No {type} found matching your criteria.</p>
  </div>
);

export const ComplianceCanvas: React.FC = () => {
  const [selectedStrategy, setSelectedStrategy] = useState<'forward-looking' | 'conservative'>('conservative');
  const [selectedAnimals, setSelectedAnimals] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'permits' | 'sops'>('permits');

  const { checkAnimalMatch, checkSearchMatch } = useFilters(selectedAnimals, selectedActivities, searchTerm);
  const { createToggleHandler } = useToggleHandler();

  const handleAnimalToggle = createToggleHandler(setSelectedAnimals);
  const handleActivityToggle = createToggleHandler(setSelectedActivities);

  const filteredPermits = useMemo(() => {
    return SAMPLE_PERMITS.filter(permit => {
      const matchesStrategy = permit.category === selectedStrategy;
      const matchesAnimals = checkAnimalMatch(permit.applies_to);
      const matchesActivities = selectedActivities.length === 0 ||
        permit.activity.some(activity => selectedActivities.includes(activity));
      const matchesSearch = checkSearchMatch([permit.name, permit.core]);

      return matchesStrategy && matchesAnimals && matchesActivities && matchesSearch;
    });
  }, [selectedStrategy, selectedActivities, checkAnimalMatch, checkSearchMatch]);

  const filteredSOPs = useMemo(() => {
    return SAMPLE_SOPS.filter(sop => {
      const matchesAnimals = checkAnimalMatch(sop.animal_types);
      const matchesSearch = checkSearchMatch([sop.title, sop.description]);

      return matchesAnimals && matchesSearch;
    });
  }, [checkAnimalMatch, checkSearchMatch]);

  const generateCompliancePack = () => {
    alert('Compliance pack generation feature coming soon!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Shield className="h-8 w-8 text-green-600" />
                Compliance Canvas
              </h1>
              <p className="text-gray-600 mt-2">Navigate livestock regulations with confidence</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant={selectedStrategy === 'conservative' ? 'default' : 'outline'}
                onClick={() => setSelectedStrategy('conservative')}
                className={selectedStrategy === 'conservative' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                Conservative Strategy
              </Button>
              <Button
                variant={selectedStrategy === 'forward-looking' ? 'default' : 'outline'}
                onClick={() => setSelectedStrategy('forward-looking')}
                className={selectedStrategy === 'forward-looking' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                Forward-Looking Strategy
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Strategy Description */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={`${selectedStrategy === 'conservative' ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'} border rounded-lg p-6`}>
          <h2 className={`text-lg font-semibold mb-2 ${selectedStrategy === 'conservative' ? 'text-blue-900' : 'text-green-900'}`}>
            {selectedStrategy === 'conservative' ? 'Conservative Strategy' : 'Forward-Looking Strategy'}
          </h2>
          <p className={selectedStrategy === 'conservative' ? 'text-blue-800' : 'text-green-800'}>
            {selectedStrategy === 'conservative'
              ? 'Focus on mandatory compliance requirements and established regulatory frameworks. Prioritizes proven practices and minimal regulatory risk.'
              : 'Embrace emerging regulations and best practices. Anticipate future requirements and implement progressive standards for sustainable operations.'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          </div>

          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search permits and SOPs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Animal Types */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Livestock Types</h4>
            <div className="flex flex-wrap gap-2">
              {LIVESTOCK_TYPES.map((animal) => {
                const Icon = animal.icon;
                return (
                  <button
                    key={animal.id}
                    onClick={() => handleAnimalToggle(animal.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                      selectedAnimals.includes(animal.id)
                        ? 'bg-green-100 border-green-300 text-green-800'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {animal.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Activities */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Activities</h4>
            <div className="flex flex-wrap gap-2">
              {ACTIVITIES.map((activity) => (
                <button
                  key={activity.id}
                  onClick={() => handleActivityToggle(activity.id)}
                  className={`px-3 py-2 rounded-lg border transition-colors ${
                    selectedActivities.includes(activity.id)
                      ? 'bg-green-100 border-green-300 text-green-800'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {activity.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('permits')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'permits'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Permits Matrix ({filteredPermits.length})
              </button>
              <button
                onClick={() => setActiveTab('sops')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'sops'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                SOPs & Checklists ({filteredSOPs.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'permits' ? (
              <div className="space-y-4">
                {filteredPermits.map((permit) => (
                  <Card key={permit.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{permit.name}</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <AnimalBadges animalIds={permit.applies_to} />
                          <Badge className={
                            permit.compliance_level === 'mandatory' ? 'bg-red-100 text-red-800' :
                            permit.compliance_level === 'recommended' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }>
                            {permit.compliance_level}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">
                          <strong>Applies to:</strong> {permit.who}
                        </p>
                        <p className="text-gray-700">{permit.core}</p>
                      </div>
                      <div className="flex gap-2">
                        {permit.compliance_level === 'mandatory' && (
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                        )}
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong className="text-gray-900">Issuing Authority:</strong>
                          <p className="text-gray-600">{permit.issuing_authority}</p>
                        </div>
                        <div>
                          <strong className="text-gray-900">Required Documents:</strong>
                          <p className="text-gray-600">{permit.docs}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                {filteredPermits.length === 0 && <EmptyState type="permits" />}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSOPs.map((sop) => (
                  <Card key={sop.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{sop.title}</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <AnimalBadges animalIds={sop.animal_types} />
                          <Badge className="bg-purple-100 text-purple-800">
                            {sop.category}
                          </Badge>
                        </div>
                        <p className="text-gray-700 mb-4">{sop.description}</p>
                      </div>
                      <FileText className="h-5 w-5 text-blue-500" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Key Steps:</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          {sop.steps.map((step, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full text-xs flex items-center justify-center mt-0.5 flex-shrink-0">
                                {index + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Requirements:</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          {sop.requirements.map((req, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                ))}
                {filteredSOPs.length === 0 && <EmptyState type="SOPs" />}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Generate Compliance Pack</h3>
              <p className="text-gray-600">Download a customized compliance package based on your selection</p>
            </div>
            <Button
              onClick={generateCompliancePack}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <Download className="h-4 w-4" />
              Generate Pack
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};