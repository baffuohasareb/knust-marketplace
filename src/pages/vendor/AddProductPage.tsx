import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, Plus, Minus } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { businessCategories } from '../../data/mockData';

export default function AddProductPage() {
  const { vendorId } = useParams<{ vendorId: string }>();
  const navigate = useNavigate();
  const { state } = useApp();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });
  
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [options, setOptions] = useState({
    sizes: [''],
    colors: [''],
    hasSizes: false,
    hasColors: false,
  });
  const [loading, setLoading] = useState(false);

  const business = state.userBusinesses.find(b => b.id === vendorId);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = [...images, ...files].slice(0, 5);
    setImages(newImages);
    
    // Create previews
    const previews = newImages.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleOptionChange = (type: 'sizes' | 'colors', index: number, value: string) => {
    setOptions(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) => i === index ? value : item)
    }));
  };

  const addOption = (type: 'sizes' | 'colors') => {
    setOptions(prev => ({
      ...prev,
      [type]: [...prev[type], '']
    }));
  };

  const removeOption = (type: 'sizes' | 'colors', index: number) => {
    setOptions(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.price || !formData.category) return;
    
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      alert('Product added successfully!');
      navigate(`/vendor/${vendorId}/dashboard`);
    }, 2000);
  };

  const isFormValid = formData.name && formData.description && formData.price && formData.category && formData.stock;

  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Business not found</h2>
          <Link to="/buyer/my-businesses" className="text-green-600 hover:text-green-700">
            Back to my businesses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to={`/vendor/${vendorId}/dashboard`}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to dashboard
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
            <p className="text-gray-600 mt-1">Add a product or service to {business.name}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Product/Service Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Laptop Screen Repair"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a category</option>
                    {businessCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₵) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="25.00"
                    min="0"
                    step="0.50"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="10"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Describe your product or service in detail..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Product Images */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Product Images</h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload product images (up to 5 images)
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Choose Images
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  PNG, JPG up to 5MB each
                </p>
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Options */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Product Options (Optional)</h2>
              
              {/* Sizes */}
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <input
                    type="checkbox"
                    id="has-sizes"
                    checked={options.hasSizes}
                    onChange={(e) => setOptions(prev => ({ ...prev, hasSizes: e.target.checked }))}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="has-sizes" className="text-sm font-medium text-gray-700">
                    This product has different sizes
                  </label>
                </div>

                {options.hasSizes && (
                  <div className="space-y-3">
                    {options.sizes.map((size, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={size}
                          onChange={(e) => handleOptionChange('sizes', index, e.target.value)}
                          placeholder="e.g., Small, Medium, Large"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        {options.sizes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeOption('sizes', index)}
                            className="p-2 text-red-600 hover:text-red-700"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addOption('sizes')}
                      className="flex items-center space-x-2 text-green-600 hover:text-green-700"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Size</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Colors */}
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <input
                    type="checkbox"
                    id="has-colors"
                    checked={options.hasColors}
                    onChange={(e) => setOptions(prev => ({ ...prev, hasColors: e.target.checked }))}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="has-colors" className="text-sm font-medium text-gray-700">
                    This product has different colors
                  </label>
                </div>

                {options.hasColors && (
                  <div className="space-y-3">
                    {options.colors.map((color, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={color}
                          onChange={(e) => handleOptionChange('colors', index, e.target.value)}
                          placeholder="e.g., Black, White, Blue"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        {options.colors.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeOption('colors', index)}
                            className="p-2 text-red-600 hover:text-red-700"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addOption('colors')}
                      className="flex items-center space-x-2 text-green-600 hover:text-green-700"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Color</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link
                to={`/vendor/${vendorId}/dashboard`}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                  loading || !isFormValid
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {loading ? 'Adding Product...' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}