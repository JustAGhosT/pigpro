import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, MapPin, Search, Filter, User, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Member } from '../lib/types';

// Mock data for members
const mockMembers: Member[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'van Zyl',
    email: 'sarah.vanzyl@email.com',
    phone: '+27 82 123 4567',
    membershipType: 'individual',
    joinDate: new Date('2020-03-15'),
    renewalDate: new Date('2024-03-15'),
    isActive: true,
    profile: {
      farmName: 'Sunny Acres Poultry',
      location: 'Western Cape',
      specialties: ['Chickens', 'Ducks'],
      bio: 'Passionate about heritage breed conservation with 15 years of experience.',
      profileImage: '/placeholder-member.jpg'
    }
  },
  {
    id: '2',
    firstName: 'James',
    lastName: 'Mbeki',
    email: 'james.mbeki@email.com',
    phone: '+27 83 987 6543',
    membershipType: 'commercial',
    joinDate: new Date('2018-07-22'),
    renewalDate: new Date('2024-07-22'),
    isActive: true,
    profile: {
      farmName: 'Heritage Poultry Farm',
      location: 'Gauteng',
      specialties: ['Chickens', 'Geese', 'Turkeys'],
      bio: 'Commercial breeder and certified show judge specializing in waterfowl.',
      profileImage: '/placeholder-member.jpg'
    }
  },
  {
    id: '3',
    firstName: 'Annelie',
    lastName: 'du Toit',
    email: 'annelie.dutoit@email.com',
    membershipType: 'family',
    joinDate: new Date('2021-11-08'),
    renewalDate: new Date('2024-11-08'),
    isActive: true,
    profile: {
      farmName: 'Homestead Poultry',
      location: 'Free State',
      specialties: ['Chickens'],
      bio: 'Hobby breeder focused on rare and heritage chicken breeds.',
      profileImage: '/placeholder-member.jpg'
    }
  },
  {
    id: '4',
    firstName: 'Peter',
    lastName: 'Williams',
    email: 'peter.williams@email.com',
    phone: '+27 84 555 1234',
    membershipType: 'honorary',
    joinDate: new Date('2015-01-10'),
    renewalDate: new Date('2025-01-10'),
    isActive: true,
    profile: {
      location: 'KwaZulu-Natal',
      specialties: ['All Breeds'],
      bio: 'Founding member and experienced poultry judge with over 30 years in the industry.',
      profileImage: '/placeholder-member.jpg'
    }
  }
];

const MemberCard: React.FC<{ member: Member; onContact: (memberId: string) => void }> = ({
  member,
  onContact
}) => {
  const getMembershipColor = (type: Member['membershipType']) => {
    switch (type) {
      case 'individual': return 'bg-blue-100 text-blue-700';
      case 'family': return 'bg-green-100 text-green-700';
      case 'commercial': return 'bg-purple-100 text-purple-700';
      case 'honorary': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatMembershipType = (type: Member['membershipType']) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">
                {member.firstName} {member.lastName}
              </CardTitle>
              <Badge className={`text-xs mt-1 ${getMembershipColor(member.membershipType)}`}>
                {formatMembershipType(member.membershipType)} Member
              </Badge>
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={() => onContact(member.id)}>
            <Mail className="h-4 w-4 mr-1" />
            Contact
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {member.profile?.bio && (
          <CardDescription className="mb-4">{member.profile.bio}</CardDescription>
        )}

        <div className="space-y-2 text-sm text-gray-600">
          {member.profile?.farmName && (
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span className="font-medium">{member.profile.farmName}</span>
            </div>
          )}

          {member.profile?.location && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{member.profile.location}</span>
            </div>
          )}

          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Member since {member.joinDate.getFullYear()}</span>
          </div>

          {member.profile?.specialties && member.profile.specialties.length > 0 && (
            <div className="pt-3">
              <div className="text-xs font-medium text-gray-500 mb-2">Specialties</div>
              <div className="flex flex-wrap gap-1">
                {member.profile.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const Members: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMembers(mockMembers);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredMembers = members.filter(member => {
    const matchesSearch =
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.profile?.farmName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.profile?.specialties?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedType === 'all' || member.membershipType === selectedType;
    const matchesLocation =
      selectedLocation === 'all' || member.profile?.location === selectedLocation;

    return matchesSearch && matchesType && matchesLocation;
  });

  const uniqueLocations = Array.from(
    new Set(members.map(m => m.profile?.location).filter(Boolean))
  );

  const handleContact = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    if (member) {
      alert(`Contact ${member.firstName} ${member.lastName} at ${member.email}`);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Member Directory</h1>
          <p className="text-gray-600 mt-1">Loading members...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Member Directory</h1>
        <p className="text-gray-600 mt-1">
          Connect with {members.length} passionate poultry enthusiasts across South Africa
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full h-9 px-3 py-1 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-700"
              >
                <option value="all">All Memberships</option>
                <option value="individual">Individual</option>
                <option value="family">Family</option>
                <option value="commercial">Commercial</option>
                <option value="honorary">Honorary</option>
              </select>
            </div>
            <div className="sm:w-48">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full h-9 px-3 py-1 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-700"
              >
                <option value="all">All Locations</option>
                {uniqueLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members Grid */}
      {filteredMembers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No members found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedType !== 'all' || selectedLocation !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'No members in the directory.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map(member => (
            <MemberCard
              key={member.id}
              member={member}
              onContact={handleContact}
            />
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {members.filter(m => m.membershipType === 'individual').length}
            </div>
            <div className="text-sm text-gray-600">Individual</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {members.filter(m => m.membershipType === 'family').length}
            </div>
            <div className="text-sm text-gray-600">Family</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {members.filter(m => m.membershipType === 'commercial').length}
            </div>
            <div className="text-sm text-gray-600">Commercial</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {members.filter(m => m.membershipType === 'honorary').length}
            </div>
            <div className="text-sm text-gray-600">Honorary</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};