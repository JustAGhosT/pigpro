import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Mail, 
  Phone, 
  Calendar,
  MapPin,
  Activity,
  Settings,
  UserPlus,
  Award
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar: string;
  status: 'active' | 'inactive';
  joinDate: string;
  permissions: string[];
}

interface Farm {
  id: string;
  name: string;
  location: string;
  size: string;
  established: string;
  totalPigs: number;
  breeds: string[];
}

const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sipho Mthembu',
    role: 'Farm Owner',
    email: 'sipho@example.com',
    phone: '+27 82 123 4567',
    avatar: 'SM',
    status: 'active',
    joinDate: '2020-01-15',
    permissions: ['Full Access']
  },
  {
    id: '2',
    name: 'Maria Santos',
    role: 'Veterinarian',
    email: 'maria@example.com',
    phone: '+27 84 987 6543',
    avatar: 'MS',
    status: 'active',
    joinDate: '2022-06-20',
    permissions: ['Health Records', 'Breeding', 'Reports']
  },
  {
    id: '3',
    name: 'Johan van der Merwe',
    role: 'Feed Specialist',
    email: 'johan@example.com',
    phone: '+27 83 555 7890',
    avatar: 'JV',
    status: 'active',
    joinDate: '2023-03-10',
    permissions: ['Feed Management', 'Growth Tracking']
  },
  {
    id: '4',
    name: 'Thandiwe Nkomo',
    role: 'Butcher',
    email: 'thandiwe@example.com',
    phone: '+27 81 246 8135',
    avatar: 'TN',
    status: 'active',
    joinDate: '2023-11-05',
    permissions: ['Slaughter Records', 'Cut Optimization']
  }
];

const farmData: Farm = {
  id: '1',
  name: 'Mthembu Family Farm',
  location: 'KwaZulu-Natal, South Africa',
  size: '45 hectares',
  established: '1987',
  totalPigs: 247,
  breeds: ['Large White', 'Kolbroek', 'Landrace', 'Duroc']
};

const MemberCard: React.FC<{ member: TeamMember }> = ({ member }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
          <span className="text-emerald-700 font-semibold">{member.avatar}</span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{member.name}</h3>
          <p className="text-sm text-gray-600">{member.role}</p>
          <div className="flex items-center space-x-4 mt-1">
            <div className="flex items-center space-x-1">
              <Mail className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500">{member.email}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Phone className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500">{member.phone}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          member.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {member.status}
        </span>
        <button className="p-1 hover:bg-gray-100 rounded">
          <Settings className="h-4 w-4 text-gray-400" />
        </button>
      </div>
    </div>

    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-900 mb-2">Permissions</h4>
      <div className="flex flex-wrap gap-1">
        {member.permissions.map((permission, index) => (
          <span 
            key={index}
            className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
          >
            {permission}
          </span>
        ))}
      </div>
    </div>

    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Joined</span>
        <span className="font-medium text-gray-900">
          {new Date(member.joinDate).toLocaleDateString()}
        </span>
      </div>
    </div>
  </div>
);

export const TeamFarm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'team' | 'farm'>('team');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Team & Farm Management</h1>
        <p className="text-gray-600 mt-1">Manage your team and farm operations efficiently</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('team')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'team'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users className="h-4 w-4 inline mr-2" />
          Team
        </button>
        <button
          onClick={() => setActiveTab('farm')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'farm'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <MapPin className="h-4 w-4 inline mr-2" />
          Farm Details
        </button>
      </div>

      {activeTab === 'team' && (
        <div className="space-y-6">
          {/* Team Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
              <p className="text-sm text-gray-600">{teamMembers.length} active members</p>
            </div>
            <button className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
              <UserPlus className="h-4 w-4" />
              <span>Add Member</span>
            </button>
          </div>

          {/* Team Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{teamMembers.length}</div>
              <div className="text-sm text-gray-600">Total Members</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">
                {teamMembers.filter(m => m.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Active Today</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">4</div>
              <div className="text-sm text-gray-600">Roles</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">98%</div>
              <div className="text-sm text-gray-600">Task Completion</div>
            </div>
          </div>

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {teamMembers.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Team Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Activity className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Maria completed health check</p>
                  <p className="text-xs text-gray-600">Batch C - All pigs healthy</p>
                </div>
                <span className="text-xs text-gray-500">1h ago</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Award className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Johan optimized feed plan</p>
                  <p className="text-xs text-gray-600">Improved efficiency by 8%</p>
                </div>
                <span className="text-xs text-gray-500">3h ago</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Thandiwe joined the team</p>
                  <p className="text-xs text-gray-600">Added as Butcher specialist</p>
                </div>
                <span className="text-xs text-gray-500">2d ago</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'farm' && (
        <div className="space-y-6">
          {/* Farm Overview */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Farm Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Farm Name</label>
                  <p className="text-lg font-semibold text-gray-900">{farmData.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Location</label>
                  <p className="text-gray-900">{farmData.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Size</label>
                  <p className="text-gray-900">{farmData.size}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Established</label>
                  <p className="text-gray-900">{farmData.established}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Total Pigs</label>
                  <p className="text-lg font-semibold text-gray-900">{farmData.totalPigs}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Breeds</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {farmData.breeds.map((breed, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm"
                      >
                        {breed}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Farm Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Production</h3>
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">This Month</span>
                  <span className="font-medium">42 pigs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">This Year</span>
                  <span className="font-medium">487 pigs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg. Weight</span>
                  <span className="font-medium">125kg</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Health</h3>
                <Activity className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Healthy</span>
                  <span className="font-medium text-green-600">98.4%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Under Treatment</span>
                  <span className="font-medium text-yellow-600">1.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Quarantined</span>
                  <span className="font-medium text-red-600">0.4%</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Efficiency</h3>
                <Award className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Feed Conversion</span>
                  <span className="font-medium">2.8:1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Growth Rate</span>
                  <span className="font-medium">750g/day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Mortality</span>
                  <span className="font-medium text-green-600">1.2%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};