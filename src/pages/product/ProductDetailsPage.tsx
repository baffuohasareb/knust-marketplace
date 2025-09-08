import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, MessageCircle, Minus, Plus } from 'lucide-react';
import { mockProducts, mockBusinesses } from '../../data/mockData';
import { useProductsStore } from '../../store/productsStore';
import { useApp } from '../../contexts/AppContext';
import SuccessModal from '../../components/Common/SuccessModal';

export default function ProductDetailsPage() {
  const { productId } = useParams<{ productId: string }>();
  const { dispatch } = useApp();
  const { products: storeProducts } = useProductsStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const mergedProducts = [
    ...storeProducts,
    ...mockProducts,
  ];
  const product = mergedProducts.find(p => p.id === productId);
  const business = product ? mockBusinesses.find(b => b.id === product.businessId) : null;

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <Link to="/buyer/home" className="text-green-600 hover:text-green-700">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    const cartItem = {
      productId: product.id,
      quantity,
      selectedSize,
      selectedColor,
      price: product.price,
      name: product.name,
      image: product.images[0],
      businessName: business ? business.name : 'Seller',
      businessId: product.businessId
    };

    dispatch({ type: 'ADD_TO_CART', payload: cartItem });
    setShowSuccess(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to={business ? `/business/${business.id}` : '/buyer/my-businesses'}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {business ? `Back to ${business.name}` : 'Back to my businesses'}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="flex space-x-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-green-600' : 'border-gray-200'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-green-600">₵{product.price}</span>
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-medium text-gray-900">{product.rating}</span>
                  <span className="text-gray-500">({product.reviewCount} reviews)</span>
                </div>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

              <div className="border-t border-gray-200 pt-6 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Availability:</span>
                  <span className={`text-sm font-medium ${
                    product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
                  </span>
                </div>
                {business && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Sold by:</span>
                    <Link to={`/business/${business.id}`} className="text-sm text-green-600 hover:text-green-700 font-medium">
                      {business.name}
                    </Link>
                  </div>
                )}
              </div>

              {/* Options */}
              {product.options?.sizes && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Size:</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.options.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          selectedSize === size
                            ? 'border-green-600 bg-green-50 text-green-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.options?.colors && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Color:</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.options.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          selectedColor === color
                            ? 'border-green-600 bg-green-50 text-green-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Quantity:</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-2 hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    Total: ₵{(product.price * quantity).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-medium transition-colors ${
                    product.stock === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Add to Cart</span>
                </button>

                {business && (
                  <Link
                    to={`/chat/${business.id}`}
                    className="flex-1 flex items-center justify-center space-x-2 py-3 px-6 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>Chat with seller</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
              
              <div className="space-y-6">
                {[1, 2].map((review) => (
                  <div key={review} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-medium text-sm">JD</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-gray-900">John Doe</p>
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">Verified Purchase • 3 days ago</p>
                        <p className="text-gray-600">
                          Excellent product! Works perfectly and arrived quickly. Great quality for the price.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        message="Added to cart"
      />
    </div>
  );
}