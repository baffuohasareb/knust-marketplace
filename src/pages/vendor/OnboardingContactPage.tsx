import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, MessageCircle, Truck } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { knustHalls } from '../../data/mockData';

export default function OnboardingContactPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  
  const [contactInfo, setContactInfo] = useState({
    hall: state.onboardingData.contactInfo.hall,
    room: state.onboardingData.contactInfo.room,
    landmark: state.onboardingData.contactInfo.landmark,
    phone: state.onboardingData.contactInfo.phone,
    whatsapp: state.onboardingData.contactInfo.whatsapp,
  });
  
  const [delivery, setDelivery] = useState({
    available: state.onboardingData.delivery.available,
    fee: state.onboardingData.delivery.fee,
    coverage: state.onboardingData.delivery.coverage,
  });

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleDeliveryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setDelivery(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
    }));
  };

  const handleContinue = () => {
    if (!contactInfo.hall || !contactInfo.room || !contactInfo.phone) return;
    
    dispatch({
      type: 'UPDATE_ONBOARDING_DATA',
      payload: {
        contactInfo,
        delivery,
      },
    });
    
    navigate('/vendor/onboarding/preview');
  };

  const isFormValid = contactInfo.hall && contactInfo.room && contactInfo.phone;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/vendor/onboarding/info"
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Contact & Delivery</h1>
              <span className="text-sm text-gray-500">Step 3 of 4</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full w-3/4 transition-all duration-300"></div>
            </div>
          </div>

          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                How can students reach you?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Provide your contact information and delivery options to make it easy for students to do business with you.
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-8">
              {/* Contact Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Location & Contact</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="hall" className="block text-sm font-medium text-gray-700 mb-2">
                      Hall of Residence *
                    </label>
                    <select
                      id="hall"
                      name="hall"
                      value={contactInfo.hall}
                      onChange={handleContactChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select your hall</option>
                      {knustHalls.map((hall) => (
                        <option key={hall} value={hall}>
                          {hall}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="room" className="block text-sm font-medium text-gray-700 mb-2">
                      Room Number *
                    </label>
                    <input
                      type="text"
                      id="room"
                      name="room"
                      value={contactInfo.room}
                      onChange={handleContactChange}
                      placeholder="e.g., A205"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 mb-2">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      id="landmark"
                      name="landmark"
                      value={contactInfo.landmark}
                      onChange={handleContactChange}
                      placeholder="e.g., Near the main entrance, opposite the notice board"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={contactInfo.phone}
                      onChange={handleContactChange}
                      placeholder="+233241234567"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp Number (Optional)
                    </label>
                    <input
                      type="tel"
                      id="whatsapp"
                      name="whatsapp"
                      value={contactInfo.whatsapp}
                      onChange={handleContactChange}
                      placeholder="233241234567"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Without the + sign. Students can contact you directly on WhatsApp.
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery Options */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Truck className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Delivery Options</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="delivery-available"
                      name="available"
                      checked={delivery.available}
                      onChange={handleDeliveryChange}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label htmlFor="delivery-available" className="text-sm font-medium text-gray-700">
                      I offer delivery services
                    </label>
                  </div>

                  {delivery.available && (
                    <div className="ml-7 space-y-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="delivery-fee" className="block text-sm font-medium text-gray-700 mb-2">
                            Delivery Fee (₵)
                          </label>
                          <input
                            type="number"
                            id="delivery-fee"
                            name="fee"
                            value={delivery.fee}
                            onChange={handleDeliveryChange}
                            min="0"
                            step="0.5"
                            placeholder="5.00"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label htmlFor="delivery-coverage" className="block text-sm font-medium text-gray-700 mb-2">
                            Delivery Coverage
                          </label>
                          <input
                            type="text"
                            id="delivery-coverage"
                            name="coverage"
                            value={delivery.coverage}
                            onChange={handleDeliveryChange}
                            placeholder="e.g., All halls on campus"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Link
                to="/vendor/onboarding/info"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </Link>
              
              <button
                onClick={handleContinue}
                disabled={!isFormValid}
                className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                  isFormValid
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