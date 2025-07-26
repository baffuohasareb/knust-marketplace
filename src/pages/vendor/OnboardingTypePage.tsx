import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Wrench, Layers } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export default function OnboardingTypePage() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [selectedType, setSelectedType] = useState<'goods' | 'services' | 'both' | ''>(
    state.onboardingData.businessType
  );

  const businessTypes = [
    {
      id: 'goods' as const,
      title: 'Goods',
      description: 'Sell physical products like food, electronics, clothing, books, etc.',
      icon: Package,
      examples: ['Food & Snacks', 'Electronics', 'Clothing', 'Books & Stationery'],
    },
    {
      id: 'services' as const,
      title: 'Services',
      description: 'Offer services like tutoring, repairs, cleaning, transportation, etc.',
      icon: Wrench,
      examples: ['Tutoring', 'Phone Repairs', 'Laundry', 'Transportation'],
    },
    {
      id: 'both' as const,
      title: 'Both',
      description: 'Sell products and offer services to maximize your business potential.',
      icon: Layers,
      examples: ['Tech Store + Repairs', 'Food + Catering', 'Books + Tutoring'],
    },
  ];

  const handleContinue = () => {
    if (!selectedType) return;
    
    dispatch({
      type: 'UPDATE_ONBOARDING_DATA',
      payload: { businessType: selectedType },
    });
    
    navigate('/vendor/onboarding/info');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/vendor/onboarding/start"
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Business Setup</h1>
              <span className="text-sm text-gray-500">Step 1 of 4</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full w-1/4 transition-all duration-300"></div>
            </div>
          </div>

          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                What does your business offer?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Choose the type that best describes your business. You can always change this later.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {businessTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 text-left hover:shadow-md ${
                      selectedType === type.id
                        ? 'border-green-600 bg-green-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                      selectedType === type.id ? 'bg-green-600' : 'bg-gray-100'
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        selectedType === type.id ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    
                    <h3 className={`text-xl font-bold mb-2 ${
                      selectedType === type.id ? 'text-green-900' : 'text-gray-900'
                    }`}>
                      {type.title}
                    </h3>
                    
                    <p className={`text-sm mb-4 ${
                      selectedType === type.id ? 'text-green-700' : 'text-gray-600'
                    }`}>
                      {type.description}
                    </p>
                    
                    <div className="space-y-1">
                      <p className={`text-xs font-medium ${
                        selectedType === type.id ? 'text-green-800' : 'text-gray-500'
                      }`}>
                        Examples:
                      </p>
                      {type.examples.map((example, index) => (
                        <span
                          key={index}
                          className={`inline-block text-xs px-2 py-1 rounded-full mr-1 mb-1 ${
                            selectedType === type.id
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between">
              <Link
                to="/vendor/onboarding/start"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </Link>
              
              <button
                onClick={handleContinue}
                disabled={!selectedType}
                className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                  selectedType
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}