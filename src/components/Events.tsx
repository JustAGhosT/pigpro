import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Plus, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Event } from '../lib/types';

// Mock data for events
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'KwaZulu-Natal Poultry Show',
    description: 'Annual poultry show featuring all breeds with competitions and judging.',
    startDate: new Date('2024-11-15'),
    endDate: new Date('2024-11-17'),
    location: {
      name: 'Pietermaritzburg Showgrounds',
      address: '123 Show Road, Pietermaritzburg, KZN'
    },
    type: 'show',
    isRegistrationRequired: true,
    maxAttendees: 200,
    attendees: ['member1', 'member2'],
    organizer: 'organizer1',
    imageUrl: '/placeholder-poultry-show.jpg'
  },
  {
    id: '2',
    title: 'Breeding Best Practices Workshop',
    description: 'Educational workshop on modern breeding techniques and genetic selection.',
    startDate: new Date('2024-12-05'),
    endDate: new Date('2024-12-05'),
    location: {
      name: 'Cape Town Convention Centre',
      address: '1 Lower Long Street, Cape Town'
    },
    type: 'workshop',
    isRegistrationRequired: true,
    maxAttendees: 50,
    attendees: ['member3'],
    organizer: 'organizer2'
  },
  {
    id: '3',
    title: 'Club Monthly Meeting',
    description: 'Regular monthly meeting to discuss club business and upcoming events.',
    startDate: new Date('2024-12-20'),
    endDate: new Date('2024-12-20'),
    location: {
      name: 'Club House',
      address: 'Johannesburg Agricultural Centre'
    },
    type: 'meeting',
    isRegistrationRequired: false,
    attendees: [],
    organizer: 'organizer3'
  }
];

const EventCard: React.FC<{ event: Event; onRegister: (eventId: string) => void }> = ({
  event,
  onRegister
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-ZA', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'show': return 'bg-green-100 text-green-700';
      case 'workshop': return 'bg-blue-100 text-blue-700';
      case 'meeting': return 'bg-gray-100 text-gray-700';
      case 'competition': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">{event.title}</CardTitle>
            <Badge className={`text-xs ${getTypeColor(event.type)} mt-2`}>
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </Badge>
          </div>
          {event.isRegistrationRequired && (
            <Button size="sm" onClick={() => onRegister(event.id)}>
              <Plus className="h-4 w-4 mr-1" />
              Register
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4">{event.description}</CardDescription>

        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>
              {formatDate(event.startDate)}
              {event.endDate.getTime() !== event.startDate.getTime() &&
                ` - ${formatDate(event.endDate)}`
              }
            </span>
          </div>

          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            <div>
              <div className="font-medium">{event.location.name}</div>
              <div className="text-xs text-gray-500">{event.location.address}</div>
            </div>
          </div>

          {event.maxAttendees && (
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <span>
                {event.attendees.length} / {event.maxAttendees} registered
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || event.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleRegister = (eventId: string) => {
    alert(`Registration for event ${eventId} - This would open registration form`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events & Shows</h1>
          <p className="text-gray-600 mt-1">Loading upcoming events...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-6"></div>
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events & Shows</h1>
          <p className="text-gray-600 mt-1">Stay updated on upcoming poultry events and shows</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search events..."
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
                <option value="all">All Types</option>
                <option value="show">Shows</option>
                <option value="workshop">Workshops</option>
                <option value="meeting">Meetings</option>
                <option value="competition">Competitions</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedType !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'No upcoming events at the moment. Check back soon!'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onRegister={handleRegister}
            />
          ))}
        </div>
      )}
    </div>
  );
};