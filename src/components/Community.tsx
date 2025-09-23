import React, { useState } from 'react';
import {
  Users,
  MessageCircle,
  Heart,
  Share2,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Award,
  MapPin,
  BookOpen,
  Camera
} from 'lucide-react';

interface Post {
  id: string;
  author: {
    name: string;
    role: string;
    avatar: string;
    location: string;
  };
  content: string;
  images?: string[];
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
  type: 'discussion' | 'success-story' | 'question' | 'tip';
}

interface Expert {
  id: string;
  name: string;
  title: string;
  specialization: string;
  avatar: string;
  rating: number;
  responses: number;
  location: string;
}

const posts: Post[] = [
  {
    id: '1',
    author: {
      name: 'Sipho Mthembu',
      role: 'Farm Owner',
      avatar: 'SM',
      location: 'KwaZulu-Natal'
    },
    content: 'Just achieved a 23% increase in revenue using PigPro SA\'s AI breeding recommendations! The Large White x Kolbroek cross is performing exceptionally well. Happy to share my experience with anyone interested.',
    images: ['https://images.pexels.com/photos/1300353/pexels-photo-1300353.jpeg?auto=compress&cs=tinysrgb&w=400'],
    timestamp: '2024-03-15T10:30:00Z',
    likes: 47,
    comments: 12,
    shares: 8,
    tags: ['breeding', 'success-story', 'kolbroek', 'large-white'],
    type: 'success-story'
  },
  {
    id: '2',
    author: {
      name: 'Dr. Maria Santos',
      role: 'Veterinarian',
      avatar: 'MS',
      location: 'Western Cape'
    },
    content: 'Quick tip for new farmers: Early detection of respiratory issues can save your entire herd. Look for these signs: labored breathing, coughing, and reduced appetite. The AI health scoring in PigPro SA has been incredibly helpful for this.',
    timestamp: '2024-03-14T15:45:00Z',
    likes: 89,
    comments: 23,
    shares: 15,
    tags: ['health', 'tips', 'respiratory', 'ai-health'],
    type: 'tip'
  },
  {
    id: '3',
    author: {
      name: 'Johan van der Merwe',
      role: 'Feed Specialist',
      avatar: 'JV',
      location: 'Free State'
    },
    content: 'Has anyone tried the new feed optimization algorithm? I\'m seeing some interesting results but would love to hear other experiences before fully implementing across all batches.',
    timestamp: '2024-03-14T09:20:00Z',
    likes: 34,
    comments: 18,
    shares: 5,
    tags: ['feed-optimization', 'question', 'algorithm'],
    type: 'question'
  }
];

const experts: Expert[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    title: 'Senior Veterinarian',
    specialization: 'Pig Health & Disease Prevention',
    avatar: 'SJ',
    rating: 4.9,
    responses: 234,
    location: 'Gauteng'
  },
  {
    id: '2',
    name: 'Prof. Michael Chen',
    title: 'Animal Geneticist',
    specialization: 'Breeding & Genetics',
    avatar: 'MC',
    rating: 4.8,
    responses: 189,
    location: 'Western Cape'
  },
  {
    id: '3',
    name: 'Thandiwe Nkomo',
    title: 'Master Butcher',
    specialization: 'Meat Processing & Value Addition',
    avatar: 'TN',
    rating: 4.7,
    responses: 156,
    location: 'KwaZulu-Natal'
  }
];

const PostCard: React.FC<{ post: Post }> = ({ post }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-start space-x-3 mb-4">
      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
        <span className="text-emerald-700 font-semibold">{post.author.avatar}</span>
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <h4 className="font-semibold text-gray-900">{post.author.name}</h4>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            post.type === 'success-story' ? 'bg-green-100 text-green-700' :
            post.type === 'tip' ? 'bg-blue-100 text-blue-700' :
            post.type === 'question' ? 'bg-yellow-100 text-yellow-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {post.type.replace('-', ' ')}
          </span>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
          <span>{post.author.role}</span>
          <div className="flex items-center space-x-1">
            <MapPin className="h-3 w-3" />
            <span>{post.author.location}</span>
          </div>
          <span>{new Date(post.timestamp).toLocaleDateString()}</span>
        </div>
      </div>
    </div>

    <p className="text-gray-700 mb-4">{post.content}</p>

    {post.images && post.images.length > 0 && (
      <div className="mb-4">
        <img 
          src={post.images[0]} 
          alt="Post image"
          className="w-full h-48 object-cover rounded-lg"
        />
      </div>
    )}

    <div className="flex flex-wrap gap-2 mb-4">
      {post.tags.map((tag, index) => (
        <span 
          key={index}
          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 cursor-pointer"
        >
          #{tag}
        </span>
      ))}
    </div>

    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
      <div className="flex items-center space-x-6">
        <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors">
          <Heart className="h-4 w-4" />
          <span className="text-sm">{post.likes}</span>
        </button>
        <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
          <MessageCircle className="h-4 w-4" />
          <span className="text-sm">{post.comments}</span>
        </button>
        <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors">
          <Share2 className="h-4 w-4" />
          <span className="text-sm">{post.shares}</span>
        </button>
      </div>
      <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
        View Discussion
      </button>
    </div>
  </div>
);

const ExpertCard: React.FC<{ expert: Expert }> = ({ expert }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-start space-x-3 mb-4">
      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
        <span className="text-blue-700 font-semibold">{expert.avatar}</span>
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{expert.name}</h4>
        <p className="text-sm text-gray-600">{expert.title}</p>
        <p className="text-sm text-blue-600 mt-1">{expert.specialization}</p>
      </div>
      <div className="text-right">
        <div className="flex items-center space-x-1">
          <Award className="h-4 w-4 text-yellow-500" />
          <span className="text-sm font-medium">{expert.rating}</span>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="text-center">
        <div className="text-lg font-bold text-gray-900">{expert.responses}</div>
        <div className="text-xs text-gray-600">Responses</div>
      </div>
      <div className="text-center">
        <div className="text-lg font-bold text-gray-900">{expert.rating}</div>
        <div className="text-xs text-gray-600">Rating</div>
      </div>
    </div>

    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-1 text-sm text-gray-600">
        <MapPin className="h-3 w-3" />
        <span>{expert.location}</span>
      </div>
      <button className="bg-emerald-600 text-white px-3 py-1 rounded-lg hover:bg-emerald-700 transition-colors text-sm">
        Ask Question
      </button>
    </div>
  </div>
);

export const Community: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'experts' | 'groups'>('feed');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Community</h1>
        <p className="text-gray-600 mt-1">Connect, learn, and share with fellow pig farmers across South Africa</p>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium text-gray-900">Active Members</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">2,847</div>
          <div className="text-sm text-green-600">+127 this month</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">Discussions</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">1,234</div>
          <div className="text-sm text-blue-600">45 today</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <Award className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-medium text-gray-900">Experts</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">89</div>
          <div className="text-sm text-yellow-600">Verified</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-900">Success Stories</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">456</div>
          <div className="text-sm text-purple-600">Shared</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('feed')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'feed'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <MessageCircle className="h-4 w-4 inline mr-2" />
          Community Feed
        </button>
        <button
          onClick={() => setActiveTab('experts')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'experts'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Award className="h-4 w-4 inline mr-2" />
          Expert Network
        </button>
        <button
          onClick={() => setActiveTab('groups')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'groups'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users className="h-4 w-4 inline mr-2" />
          Groups
        </button>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search discussions, experts, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="flex items-center space-x-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
            <Plus className="h-4 w-4" />
            <span>New Post</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'feed' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            
            <div className="space-y-6">
              {/* Trending Topics */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending Topics</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">#breeding-optimization</span>
                    <span className="text-xs text-gray-500">234 posts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">#kolbroek-heritage</span>
                    <span className="text-xs text-gray-500">189 posts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">#feed-efficiency</span>
                    <span className="text-xs text-gray-500">156 posts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">#market-prices</span>
                    <span className="text-xs text-gray-500">143 posts</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                    <Camera className="h-5 w-5 text-emerald-600" />
                    <div>
                      <div className="font-medium text-gray-900">Share Success Story</div>
                      <div className="text-sm text-gray-600">Show your achievements</div>
                    </div>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">Ask Question</div>
                      <div className="text-sm text-gray-600">Get expert advice</div>
                    </div>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-medium text-gray-900">Share Knowledge</div>
                      <div className="text-sm text-gray-600">Help others learn</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'experts' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experts.map((expert) => (
              <ExpertCard key={expert.id} expert={expert} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'groups' && (
        <div className="space-y-6">
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Groups Coming Soon</h3>
            <p className="text-gray-600 mb-4">
              Join specialized groups based on your location, breed focus, or farming interests.
            </p>
            <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
              Get Notified
            </button>
          </div>
        </div>
      )}
    </div>
  );
};