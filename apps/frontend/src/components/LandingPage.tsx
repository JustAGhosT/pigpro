import {
    ArrowRight,
    Award,
    Brain,
    CheckCircle,
    Play,
    Shield,
    ShoppingCart,
    Star,
    TrendingUp,
    Truck,
    Users
} from 'lucide-react';
import React from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const TestimonialCard: React.FC<{
  name: string;
  role: string;
  content: string;
  rating: number;
}> = ({ name, role, content, rating }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200">
    <div className="flex items-center mb-4">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
        />
      ))}
    </div>
    <p className="text-gray-700 mb-4 italic">"{content}"</p>
    <div>
      <p className="font-semibold text-gray-900">{name}</p>
      <p className="text-sm text-gray-600">{role}</p>
    </div>
  </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onSignIn }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Livestock Club SA</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={onSignIn}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Sign In
              </button>
              <button 
                onClick={onGetStarted}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Welcome to the
                <span className="text-green-700 block">Livestock Club</span>
                South Africa
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Dedicated to promoting excellence in livestock breeding across South Africa.
                Join our community of passionate breeders raising chickens, pigs, goats, rabbits, and more.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onGetStarted}
                  className="bg-green-700 text-white px-8 py-4 rounded-lg hover:bg-green-800 transition-all duration-300 font-semibold text-lg flex items-center justify-center space-x-2 hover:shadow-lg"
                >
                  <span>Become a Member</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-green-700 hover:text-green-700 transition-all duration-300 font-semibold text-lg flex items-center justify-center space-x-2">
                  <Play className="h-5 w-5" />
                  <span>Learn More</span>
                </button>
              </div>
              <div className="flex items-center space-x-6 mt-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-700" />
                  <span>Member benefits included</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-700" />
                  <span>Community support</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="bg-green-50 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Featured Breed</h3>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">Show Quality</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Breed:</span>
                      <span className="font-medium">Rhode Island Red</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium text-green-600">Poultry</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Origin:</span>
                      <span className="font-medium">United States</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-600">Explore our comprehensive breed database</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace Section */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <ShoppingCart className="h-8 w-8 text-green-700" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Livestock Marketplace
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Buy and sell quality livestock from verified breeders across South Africa. 
              Connect with trusted sellers and find the perfect animals for your farm.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-green-700" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Sellers</h3>
              <p className="text-gray-600">All sellers are verified members with proven track records and quality livestock.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Truck className="h-6 w-6 text-blue-700" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Safe Transport</h3>
              <p className="text-gray-600">Professional livestock transport services available with insurance and tracking.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-purple-700" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Guarantee</h3>
              <p className="text-gray-600">All animals come with health certificates and breed documentation.</p>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={onGetStarted}
              className="bg-green-700 text-white px-8 py-4 rounded-lg hover:bg-green-800 transition-all duration-300 font-semibold text-lg inline-flex items-center space-x-2 hover:shadow-lg"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Explore Marketplace</span>
            </button>
            <p className="text-gray-600 mt-4 text-sm">
              Join thousands of breeders buying and selling quality livestock
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Livestock Excellence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From comprehensive breed information to compliance management and community networking,
              Livestock Club SA provides all the resources you need for successful livestock operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Award className="h-6 w-6 text-green-700" />}
              title="Breed Encyclopedia"
              description="Comprehensive database of livestock breeds including chickens, pigs, goats, and rabbits with detailed characteristics and standards."
            />
            <FeatureCard
              icon={<TrendingUp className="h-6 w-6 text-green-700" />}
              title="Event Calendar"
              description="Stay updated on upcoming livestock shows, competitions, and club events across South Africa."
            />
            <FeatureCard
              icon={<Users className="h-6 w-6 text-green-700" />}
              title="Member Community"
              description="Connect with fellow breeders, share experiences, and access the member directory."
            />
            <FeatureCard
              icon={<Brain className="h-6 w-6 text-green-700" />}
              title="Educational Resources"
              description="Access breeding guides, standards documentation, and educational materials for all skill levels."
            />
            <FeatureCard
              icon={<CheckCircle className="h-6 w-6 text-green-700" />}
              title="Regulatory Compliance"
              description="Navigate complex livestock regulations with our comprehensive compliance framework and guidance system."
            />
            <FeatureCard
              icon={<Star className="h-6 w-6 text-green-700" />}
              title="Expert Guidance"
              description="Get advice from experienced judges and breeders to improve your breeding program and ensure compliance."
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Trusted by South African Livestock Enthusiasts
            </h2>
            <p className="text-xl text-gray-600">
              See what our members say about the Livestock Club SA community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              name="Sarah van Zyl"
              role="Breeder, Western Cape"
              content="The breed database is incredibly comprehensive. It's helped me understand the standards and improve my breeding program significantly."
              rating={5}
            />
            <TestimonialCard
              name="James Mbeki"
              role="Show Judge, Gauteng"
              content="Being part of this community has enriched my knowledge. The educational resources are top-notch and very accessible."
              rating={5}
            />
            <TestimonialCard
              name="Annelie du Toit"
              role="Hobby Breeder, Free State"
              content="The event calendar keeps me updated on all shows. I've connected with so many passionate breeders through this platform."
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join hundreds of South African livestock enthusiasts who are passionate about excellence in livestock breeding and compliance.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-white text-green-700 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-lg inline-flex items-center space-x-2"
          >
            <span>Become a Member Today</span>
            <ArrowRight className="h-5 w-5" />
          </button>
          <p className="text-green-200 mt-4 text-sm">
            Individual, family, and commercial memberships available
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">L</span>
                </div>
                <span className="text-lg font-bold">Livestock Club SA</span>
              </div>
              <p className="text-gray-400">
                Dedicated to promoting excellence in livestock breeding and regulatory compliance across Southern Africa.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Club</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Membership</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Breeds</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Events</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Standards</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Education</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">News</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Livestock Club South Africa. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};