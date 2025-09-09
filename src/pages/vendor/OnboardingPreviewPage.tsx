import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Store, MapPin, Phone, MessageCircle, Truck, Check } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export default function OnboardingPreviewPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [isCreating, setIsCreating] = useState(false);

  const { onboardingData } = state;

  const fileToDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleCreateStore = async () => {
    setIsCreating(true);

    // Simulate API call
    setTimeout(async () => {
      const logoFile = onboardingData.businessInfo.logo;
      const logoDataUrl = logoFile ? await fileToDataUrl(logoFile) : undefined;

      const newBusiness = {
        id: `vb${Date.now()}`,
        ownerId: state.user?.id || '1',
        name: onboardingData.businessInfo.name,
        description: onboardingData.businessInfo.description,
        // Persist as data URL for reload-proof logo
        logo: logoDataUrl || 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=200',
        businessType: onboardingData.businessType as 'goods' | 'services' | 'both',
        category: onboardingData.businessInfo.category,
        tags: onboardingData.businessInfo.tags,
        contactInfo: onboardingData.contactInfo,
        delivery: onboardingData.delivery,
        productCount: 0,
        reviewCount: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      dispatch({ type: 'ADD_USER_BUSINESS', payload: newBusiness });
      dispatch({ type: 'CLEAR_ONBOARDING_DATA' });
      
      // Add success notification
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now().toString(),
          userId: state.user?.id || '1',
          type: 'system',
          title: 'Business Created Successfully!',
          message: `Your business "${newBusiness.name}" is now live on the marketplace.`,
          read: false,
          createdAt: new Date().toISOString(),
        },
      });

      navigate(`/vendor/${newBusiness.id}/dashboard`);
    }, 2000);
  };

  const getBusinessTypeLabel = (type: string) => {
    switch (type) {
      case 'goods':
        return 'Goods';
      case 'services':
        return 'Services';
      case 'both':
        return 'Both';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/vendor/onboarding/contact"
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Review & Create</h1>
              <span className="text-sm text-gray-500">Step 4 of 4</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full w-full transition-all duration-300"></div>
            </div>
          </div>

          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Review your business details
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Make sure everything looks correct before creating your store. You can always edit these details later.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              {/* Business Preview Card */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 mb-8">
                <div className="flex items-start space-x-6">
                  <div className="w-24 h-24 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center overflow-hidden">
                    {onboardingData.businessInfo.logo ? (
                      <img
                        src={URL.createObjectURL(onboardingData.businessInfo.logo)}
                        alt="Business logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Store className="h-10 w-10 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {onboardingData.businessInfo.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {onboardingData.businessInfo.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {getBusinessTypeLabel(onboardingData.businessType)}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {onboardingData.businessInfo.category}
                      </span>
                      {onboardingData.delivery.available && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                          Delivery Available
                        </span>
                      )}
                    </div>
                    
                    {onboardingData.businessInfo.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {onboardingData.businessInfo.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Contact Information */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold text-gray-900">Location & Contact</h4>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hall:</span>
                      <span className="font-medium">{onboardingData.contactInfo.hall}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Room:</span>
                      <span className="font-medium">{onboardingData.contactInfo.room}</span>
                    </div>
                    {onboardingData.contactInfo.landmark && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Landmark:</span>
                        <span className="font-medium">{onboardingData.contactInfo.landmark}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{onboardingData.contactInfo.phone}</span>
                    </div>
                    {onboardingData.contactInfo.whatsapp && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">WhatsApp:</span>
                        <span className="font-medium">{onboardingData.contactInfo.whatsapp}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Delivery Information */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Truck className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold text-gray-900">Delivery Options</h4>
                  </div>
                  
                  {onboardingData.delivery.available ? (
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Available:</span>
                        <span className="font-medium text-green-600">Yes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fee:</span>
                        <span className="font-medium">₵{onboardingData.delivery.fee}</span>
                      </div>
                      {onboardingData.delivery.coverage && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Coverage:</span>
                          <span className="font-medium">{onboardingData.delivery.coverage}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">Delivery not available</p>
                  )}
                </div>
              </div>

              {/* Create Button */}
              <div className="text-center">
                <button
                  onClick={handleCreateStore}
                  disabled={isCreating}
                  className={`px-12 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                    isCreating
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isCreating ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Your Store...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Check className="h-5 w-5" />
                      <span>Create My Store</span>
                    </div>
                  )}
                </button>
                
                <p className="text-sm text-gray-500 mt-4">
                  By creating your store, you agree to our terms of service and seller guidelines.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}