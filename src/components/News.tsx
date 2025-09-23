import React, { useState, useEffect } from 'react';
import { Calendar, User, ExternalLink, Search, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  author: string;
  publishDate: Date;
  category: 'news' | 'announcement' | 'event' | 'education' | 'member-spotlight';
  imageUrl?: string;
  readingTime: number; // in minutes
  featured: boolean;
}

// Mock data for news articles
const mockArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'Annual Championship Show Results Announced',
    excerpt: 'The 2024 National Poultry Championship concluded with record attendance and outstanding bird quality across all categories.',
    author: 'Sarah van Zyl',
    publishDate: new Date('2024-03-15'),
    category: 'news',
    readingTime: 5,
    featured: true,
    imageUrl: '/placeholder-news.jpg'
  },
  {
    id: '2',
    title: 'New Heritage Breed Conservation Program Launched',
    excerpt: 'Poultry Club SA partners with conservation groups to preserve rare and endangered poultry breeds native to South Africa.',
    author: 'James Mbeki',
    publishDate: new Date('2024-03-10'),
    category: 'announcement',
    readingTime: 3,
    featured: true
  },
  {
    id: '3',
    title: 'Member Spotlight: Annelie du Toit\'s Success Story',
    excerpt: 'From hobby breeder to show champion - learn how dedication and community support transformed one member\'s breeding program.',
    author: 'Club Editorial',
    publishDate: new Date('2024-03-08'),
    category: 'member-spotlight',
    readingTime: 4,
    featured: false
  },
  {
    id: '4',
    title: 'Upcoming Regional Shows - Registration Open',
    excerpt: 'Mark your calendars! Registration is now open for the KZN Regional Show and Western Cape Provincial Championship.',
    author: 'Event Committee',
    publishDate: new Date('2024-03-05'),
    category: 'event',
    readingTime: 2,
    featured: false
  },
  {
    id: '5',
    title: 'Feed Safety Guidelines Updated for 2024',
    excerpt: 'Important updates to feed safety protocols and recommendations for optimal poultry nutrition and health.',
    author: 'Dr. Peter Williams',
    publishDate: new Date('2024-03-01'),
    category: 'education',
    readingTime: 6,
    featured: false
  },
  {
    id: '6',
    title: 'Club Membership Reaches 500 Members Milestone',
    excerpt: 'We\'re proud to announce that our membership has grown to over 500 active members across South Africa.',
    author: 'Membership Committee',
    publishDate: new Date('2024-02-28'),
    category: 'announcement',
    readingTime: 2,
    featured: false
  }
];

const ArticleCard: React.FC<{
  article: NewsArticle;
  featured?: boolean;
  onRead: (articleId: string) => void;
}> = ({ article, featured = false, onRead }) => {
  const getCategoryColor = (category: NewsArticle['category']) => {
    switch (category) {
      case 'news': return 'bg-blue-100 text-blue-700';
      case 'announcement': return 'bg-green-100 text-green-700';
      case 'event': return 'bg-purple-100 text-purple-700';
      case 'education': return 'bg-yellow-100 text-yellow-700';
      case 'member-spotlight': return 'bg-pink-100 text-pink-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatCategory = (category: NewsArticle['category']) => {
    return category.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (featured) {
    return (
      <Card className="col-span-full lg:col-span-2 hover:shadow-xl transition-shadow">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="aspect-video md:aspect-auto bg-gray-100 rounded-l-xl">
            {article.imageUrl ? (
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover rounded-l-xl"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Calendar className="h-12 w-12" />
              </div>
            )}
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Badge className={`text-xs ${getCategoryColor(article.category)}`}>
                {formatCategory(article.category)}
              </Badge>
              <span className="text-xs text-gray-500">Featured</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">{article.title}</h2>
            <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500 space-x-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {article.author}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(article.publishDate)}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {article.readingTime} min read
                </div>
              </div>
              <Button onClick={() => onRead(article.id)}>
                Read More
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <Badge className={`text-xs ${getCategoryColor(article.category)} mb-2`}>
            {formatCategory(article.category)}
          </Badge>
          <Button size="sm" variant="ghost" onClick={() => onRead(article.id)}>
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
        <CardTitle className="text-lg font-semibold leading-tight">
          {article.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4 line-clamp-3">
          {article.excerpt}
        </CardDescription>
        <div className="flex items-center text-xs text-gray-500 space-x-4">
          <div className="flex items-center">
            <User className="h-3 w-3 mr-1" />
            {article.author}
          </div>
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(article.publishDate)}
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {article.readingTime}m
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const News: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setArticles(mockArticles);
      setLoading(false);
    }, 1000);
  }, []);

  const categories = Array.from(new Set(articles.map(a => a.category)));

  const filteredArticles = articles.filter(article => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const featuredArticles = filteredArticles.filter(a => a.featured);
  const regularArticles = filteredArticles.filter(a => !a.featured);

  const handleReadArticle = (articleId: string) => {
    alert(`Opening article ${articleId} - This would navigate to the full article`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">News & Updates</h1>
          <p className="text-gray-600 mt-1">Loading latest news...</p>
        </div>
        <div className="space-y-8">
          {/* Featured article skeleton */}
          <div className="col-span-full lg:col-span-2 bg-white rounded-xl border border-gray-200 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="aspect-video md:aspect-auto bg-gray-200 rounded-l-xl"></div>
              <div className="p-6">
                <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-full mb-3"></div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
          {/* Regular articles skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-20 mb-4"></div>
                <div className="h-5 bg-gray-200 rounded w-full mb-4"></div>
                <div className="space-y-2 mb-4">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">News & Updates</h1>
        <p className="text-gray-600 mt-1">
          Stay informed with the latest news, announcements, and updates from Poultry Club SA
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
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-9 px-3 py-1 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-700"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.split('-').map(word =>
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredArticles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedCategory !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'No articles available at the moment.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Featured Articles */}
          {featuredArticles.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Featured</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {featuredArticles.map(article => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    featured={true}
                    onRead={handleReadArticle}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Regular Articles */}
          {regularArticles.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Latest News</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularArticles.map(article => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    onRead={handleReadArticle}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Category Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {categories.map(category => (
          <Card key={category}>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-green-600">
                {articles.filter(a => a.category === category).length}
              </div>
              <div className="text-sm text-gray-600">
                {category.split('-').map(word =>
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};