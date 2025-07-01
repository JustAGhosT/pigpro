import React from 'react';
import { 
  ArrowRight, 
  Brain, 
  TrendingUp, 
  Users, 
  Award,
  CheckCircle,
  Star,
  Play
} from 'lucide-react';

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
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold text-gray-900">PigPro SA</span>
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
                Revolutionize Your
                <span className="text-emerald-600 block">Pig Farming</span>
                with AI
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Maximize profits through AI-powered breeding optimization, market insights, 
                and comprehensive farm management designed specifically for South African farmers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={onGetStarted}
                  className="bg-emerald-600 text-white px-8 py-4 rounded-lg hover:bg-emerald-700 transition-all duration-300 font-semibold text-lg flex items-center justify-center space-x-2 hover:shadow-lg"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-emerald-600 hover:text-emerald-600 transition-all duration-300 font-semibold text-lg flex items-center justify-center space-x-2">
                  <Play className="h-5 w-5" />
                  <span>Watch Demo</span>
                </button>
              </div>
              <div className="flex items-center space-x-6 mt-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span>14-day free trial</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="bg-emerald-50 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">AI Breed Analysis</h3>
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">94% Confidence</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Breed:</span>
                      <span className="font-medium">Large White</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Health Score:</span>
                      <span className="font-medium text-green-600">87/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Est. Value:</span>
                      <span className="font-medium">R2,850</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Brain className="h-8 w-8 text-emerald-600" />
                  </div>
                  <p className="text-sm text-gray-600">Upload pig photos for instant AI analysis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Optimize Your Farm
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From AI-powered breed identification to market insights and team collaboration, 
              PigPro SA provides all the tools you need to maximize your farm's potential.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brain className="h-6 w-6 text-emerald-600" />}
              title="AI Breed Analysis"
              description="Upload photos for instant breed identification, health scoring, and value estimation with 94%+ accuracy."
            />
            <FeatureCard
              icon={<TrendingUp className="h-6 w-6 text-emerald-600" />}
              title="Market Insights"
              description="Real-time pricing data and market forecasts to help you make informed selling decisions."
            />
            <FeatureCard
              icon={<Users className="h-6 w-6 text-emerald-600" />}
              title="Team Collaboration"
              description="Manage your farm team with role-based access, task assignments, and real-time updates."
            />
            <FeatureCard
              icon={<Award className="h-6 w-6 text-emerald-600" />}
              title="Breeding Optimization"
              description="AI-powered recommendations for optimal breeding pairs to maximize desired traits and profitability."
            />
            <FeatureCard
              icon={<CheckCircle className="h-6 w-6 text-emerald-600" />}
              title="Compliance Tracking"
              description="Automated traceability and compliance documentation to meet regulatory requirements effortlessly."
            />
            <FeatureCard
              icon={<Star className="h-6 w-6 text-emerald-600" />}
              title="Breed Encyclopedia"
              description="Comprehensive guide to South African pig breeds with community-contributed insights and data."
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Trusted by South African Farmers
            </h2>
            <p className="text-xl text-gray-600">
              See how PigPro SA is transforming farms across the country
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              name="Sipho Mthembu"
              role="Farm Owner, KwaZulu-Natal"
              content="PigPro SA increased our revenue by 23% in just 6 months. The AI recommendations are incredibly accurate."
              rating={5}
            />
            <TestimonialCard
              name="Maria Santos"
              role="Veterinarian, Western Cape"
              content="The health scoring feature helps me identify issues early. It's like having an AI assistant for every pig."
              rating={5}
            />
            <TestimonialCard
              name="Johan van der Merwe"
              role="Feed Specialist, Free State"
              content="Feed optimization suggestions have reduced our costs by 15% while improving growth rates."
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Join thousands of South African farmers who are already maximizing their profits with PigPro SA.
          </p>
          <button 
            onClick={onGetStarted}
            className="bg-white text-emerald-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-lg inline-flex items-center space-x-2"
          >
            <span>Start Your Free Trial</span>
            <ArrowRight className="h-5 w-5" />
          </button>
          <p className="text-emerald-200 mt-4 text-sm">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">P</span>
                </div>
                <span className="text-lg font-bold">PigPro SA</span>
              </div>
              <p className="text-gray-400">
                AI-powered pig farming optimization for South African farmers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PigPro SA. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};