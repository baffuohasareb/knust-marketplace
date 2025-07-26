import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Store, Zap, TrendingUp } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export default function OnboardingStartPage() {
  const navigate = useNavigate();
  const { dispatch } = useApp();

  const handleStartOnboarding = () => {
    // Clear any existing onboarding data
    dispatch({ type: 'CLEAR_ONBOARDING_DATA' });
    navigate('/vendor/onboarding/type');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/buyer/my-businesses"
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to my businesses
        </Link>

        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Store className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Start Your <span className="text-green-600">Business</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Join the KNUST Marketplace and start selling to your fellow students. 
            It only takes a few minutes to set up your store.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Quick Setup</h3>
            <p className="text-sm text-gray-600">
              Get your store up and running in just 4 simple steps
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Store className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Campus Focused</h3>
            <p className="text-sm text-gray-600">
              Reach thousands of KNUST students right on campus
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Grow Your Income</h3>
            <p className="text-sm text-gray-600">
              Turn your skills and products into a profitable business
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            We'll guide you through setting up your business profile, contact information, 
            and delivery options step by step.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleStartOnboarding}
              className="bg-green-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm"
            >
              Start Business Setup
            </button>
            <Link
              to="/buyer/my-businesses"
              className="bg-gray-100 text-gray-700 px-8 py-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Maybe Later
            </Link>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Already have a business? <Link to="/buyer/my-businesses" className="text-green-600 hover:text-green-700 font-medium">View your businesses</Link>
          </p>
        </div>
      </div>
    </div>
  );
}