import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { useStore } from "../../stores/useStore";
import ReviewForm from "../../components/Review/ReviewForm";

export default function WriteReviewPage() {
  const navigate = useNavigate();
  const orders = useStore((state) => state.orders);
  const businesses = useStore((state) => state.businesses);
  const products = useStore((state) => state.products);
  const [searchParams] = useSearchParams();

  const preselectedBusinessId = searchParams.get("businessId");
  const preselectedProductId = searchParams.get("productId");
  const preselectedOrderId = searchParams.get("orderId");

  const [selectedBusiness, setSelectedBusiness] = useState<string>(
    preselectedBusinessId || ""
  );
  const [selectedProduct, setSelectedProduct] = useState<string>(
    preselectedProductId || ""
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [reviewType, setReviewType] = useState<"business" | "product">(
    "business"
  );

  // Get user's orders to show only businesses/products they've purchased from
  const userOrders = orders;
  const purchasedBusinessIds = [
    ...new Set(
      userOrders.flatMap((order) =>
        order.items.map((item) => item.businessName)
      )
    ),
  ];

  const eligibleBusinesses = businesses.filter(
    (business) =>
      purchasedBusinessIds.includes(business.name) &&
      business.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const eligibleProducts = products.filter((product) => {
    const business = businesses.find((b) => b.id === product.businessId);
    return (
      business &&
      purchasedBusinessIds.includes(business.name) &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleReviewSubmit = () => {
    navigate("/reviews");
  };

  const selectedBusinessData = businesses.find(
    (b) => b.id === selectedBusiness
  );
  const selectedProductData = products.find((p) => p.id === selectedProduct);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/reviews"
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to reviews
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Write a Review
        </h1>

        {!selectedBusiness && !selectedProduct ? (
          <div className="space-y-8">
            {/* Review Type Selection */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                What would you like to review?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setReviewType("business")}
                  className={`p-6 rounded-lg border-2 transition-colors text-left ${
                    reviewType === "business"
                      ? "border-green-600 bg-green-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Business/Vendor
                  </h3>
                  <p className="text-sm text-gray-600">
                    Review your overall experience with a business
                  </p>
                </button>
                <button
                  onClick={() => setReviewType("product")}
                  className={`p-6 rounded-lg border-2 transition-colors text-left ${
                    reviewType === "product"
                      ? "border-green-600 bg-green-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Product/Service
                  </h3>
                  <p className="text-sm text-gray-600">
                    Review a specific product or service you purchased
                  </p>
                </button>
              </div>
            </div>

            {/* Search and Selection */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Select {reviewType === "business" ? "Business" : "Product"} to
                Review
              </h2>

              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${
                    reviewType === "business" ? "businesses" : "products"
                  }...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <p className="text-sm text-gray-600 mb-4">
                You can only review{" "}
                {reviewType === "business" ? "businesses" : "products"} you've
                purchased from.
              </p>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {reviewType === "business" ? (
                  eligibleBusinesses.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        {searchQuery
                          ? "No businesses found matching your search."
                          : "No eligible businesses to review."}
                      </p>
                    </div>
                  ) : (
                    eligibleBusinesses.map((business) => (
                      <button
                        key={business.id}
                        onClick={() => setSelectedBusiness(business.id)}
                        className="w-full p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={business.logo}
                            alt={business.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {business.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {business.location}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))
                  )
                ) : eligibleProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      {searchQuery
                        ? "No products found matching your search."
                        : "No eligible products to review."}
                    </p>
                  </div>
                ) : (
                  eligibleProducts.map((product) => {
                    const business = mockBusinesses.find(
                      (b) => b.id === product.businessId
                    );
                    return (
                      <button
                        key={product.id}
                        onClick={() => {
                          setSelectedProduct(product.id);
                          setSelectedBusiness(product.businessId);
                        }}
                        className="w-full p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              by {business?.name}
                            </p>
                            <p className="text-sm text-green-600">
                              ₵{product.price}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Selected Item Info */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Reviewing:{" "}
                  {selectedProductData
                    ? selectedProductData.name
                    : selectedBusinessData?.name}
                </h2>
                <button
                  onClick={() => {
                    setSelectedBusiness("");
                    setSelectedProduct("");
                  }}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Change selection
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <img
                  src={
                    selectedProductData
                      ? selectedProductData.images[0]
                      : selectedBusinessData?.logo
                  }
                  alt={
                    selectedProductData
                      ? selectedProductData.name
                      : selectedBusinessData?.name
                  }
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-medium text-gray-900">
                    {selectedProductData
                      ? selectedProductData.name
                      : selectedBusinessData?.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedProductData
                      ? `by ${selectedBusinessData?.name}`
                      : selectedBusinessData?.location}
                  </p>
                  {selectedProductData && (
                    <p className="text-sm text-green-600">
                      ₵{selectedProductData.price}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Review Form */}
            <ReviewForm
              businessId={selectedBusiness}
              productId={selectedProduct}
              orderId={preselectedOrderId || undefined}
              onSubmit={handleReviewSubmit}
              onCancel={() => navigate("/reviews")}
            />
          </div>
        )}
      </div>
    </div>
  );
}
