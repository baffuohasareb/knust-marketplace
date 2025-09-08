import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Minus,
  Package,
  Wrench,
  Tag,
  DollarSign,
  Hash,
} from "lucide-react";
import { useStore } from "../../stores/useStore";
import { businessCategories } from "../../data/mockData";
import { VendorProduct, ProductVariation } from "../../types";

interface ProductImage {
  file: File;
  preview: string;
  id: string;
}

export default function AddProductPage() {
  const { vendorId } = useParams<{ vendorId: string }>();
  const navigate = useNavigate();
  const userBusinesses = useStore((state) => state.userBusinesses);
  const addVendorProduct = useStore((state) => state.addVendorProduct);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    sku: "",
    weight: "",
    dimensions: {
      length: "",
      width: "",
      height: "",
    },
    tags: "",
    isActive: true,
    allowBackorders: false,
    trackQuantity: true,
    isDigital: false,
    requiresShipping: true,
  });

  const [images, setImages] = useState<ProductImage[]>([]);
  const [variations, setVariations] = useState<ProductVariation[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "basic" | "variations" | "inventory" | "shipping"
  >("basic");

  const business = userBusinesses.find((b) => b.id === vendorId);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages: ProductImage[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    }));

    setImages((prev) => [...prev, ...newImages].slice(0, 10)); // Max 10 images
  };

  const removeImage = (imageId: string) => {
    setImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === imageId);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter((img) => img.id !== imageId);
    });
  };

  const addVariation = () => {
    const newVariation: ProductVariation = {
      id: Date.now().toString(),
      name: "",
      values: [""],
    };
    setVariations((prev) => [...prev, newVariation]);
  };

  const removeVariation = (variationId: string) => {
    setVariations((prev) => prev.filter((v) => v.id !== variationId));
  };

  const updateVariationName = (variationId: string, name: string) => {
    setVariations((prev) =>
      prev.map((v) => (v.id === variationId ? { ...v, name } : v))
    );
  };

  const addVariationValue = (variationId: string) => {
    setVariations((prev) =>
      prev.map((v) =>
        v.id === variationId ? { ...v, values: [...v.values, ""] } : v
      )
    );
  };

  const removeVariationValue = (variationId: string, valueIndex: number) => {
    setVariations((prev) =>
      prev.map((v) =>
        v.id === variationId
          ? { ...v, values: v.values.filter((_, i) => i !== valueIndex) }
          : v
      )
    );
  };

  const updateVariationValue = (
    variationId: string,
    valueIndex: number,
    value: string
  ) => {
    setVariations((prev) =>
      prev.map((v) =>
        v.id === variationId
          ? {
              ...v,
              values: v.values.map((val, i) =>
                i === valueIndex ? value : val
              ),
            }
          : v
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.category
    )
      return;

    setLoading(true);

    try {
      // Create the new product
      const newProduct: VendorProduct = {
        id: `vp${Date.now()}`,
        businessId: vendorId!,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        images: images.map((img) => img.preview), // In a real app, you'd upload these to a server
        category: formData.category,
        stock: parseInt(formData.stock) || 0,
        isActive: formData.isActive,
        variations: variations.filter(
          (v) => v.name && v.values.some((val) => val.trim())
        ),
        sku: formData.sku || undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        dimensions:
          formData.dimensions.length ||
          formData.dimensions.width ||
          formData.dimensions.height
            ? {
                length: parseFloat(formData.dimensions.length) || 0,
                width: parseFloat(formData.dimensions.width) || 0,
                height: parseFloat(formData.dimensions.height) || 0,
              }
            : undefined,
        tags: formData.tags
          ? formData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag)
          : undefined,
        allowBackorders: formData.allowBackorders,
        trackQuantity: formData.trackQuantity,
        isDigital: formData.isDigital,
        requiresShipping: formData.requiresShipping,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add to store
      addVendorProduct(newProduct);

      // Update business product count
      const business = userBusinesses.find((b) => b.id === vendorId);
      if (business) {
        // In a real app, you'd update the business product count here
      }

      alert("Product added successfully!");
      navigate(`/vendor/${vendorId}/dashboard`);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.name &&
    formData.description &&
    formData.price &&
    formData.category;

  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Business not found
          </h2>
          <Link
            to="/buyer/my-businesses"
            className="text-green-600 hover:text-green-700"
          >
            Back to my businesses
          </Link>
        </div>
      </div>
    );
  }

  const isService = business.businessType === "services";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to={`/vendor/${vendorId}/dashboard`}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to dashboard
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              {isService ? (
                <Wrench className="h-6 w-6 text-green-600" />
              ) : (
                <Package className="h-6 w-6 text-green-600" />
              )}
              <h1 className="text-2xl font-bold text-gray-900">
                Add New {isService ? "Service" : "Product"}
              </h1>
            </div>
            <p className="text-gray-600">
              Add a {isService ? "service" : "product"} to {business.name}
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {[
                { id: "basic", label: "Basic Info", icon: Tag },
                { id: "variations", label: "Variations", icon: Hash },
                { id: "inventory", label: "Inventory", icon: Package },
                { id: "shipping", label: "Shipping", icon: Wrench },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 text-sm font-medium border-b-2 transition-colors flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? "border-green-600 text-green-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {/* Basic Information Tab */}
            {activeTab === "basic" && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        {isService ? "Service" : "Product"} Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={
                          isService
                            ? "e.g., Mathematics Tutoring"
                            : "e.g., Wireless Headphones"
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="category"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
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
                      <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Price (₵) *
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="number"
                          id="price"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          placeholder="25.00"
                          min="0"
                          step="0.50"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="sku"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        SKU (Optional)
                      </label>
                      <input
                        type="text"
                        id="sku"
                        name="sku"
                        value={formData.sku}
                        onChange={handleInputChange}
                        placeholder="e.g., WH-001"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="tags"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Tags (Optional)
                      </label>
                      <input
                        type="text"
                        id="tags"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        placeholder="e.g., wireless, bluetooth, audio"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Separate tags with commas to help customers find your{" "}
                        {isService ? "service" : "product"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Description *
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={6}
                        placeholder={
                          isService
                            ? "Describe your service in detail, including what's included, duration, and any requirements..."
                            : "Describe your product in detail, including features, specifications, and benefits..."
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="isActive"
                          name="isActive"
                          checked={formData.isActive}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <label
                          htmlFor="isActive"
                          className="text-sm font-medium text-gray-700"
                        >
                          Make this {isService ? "service" : "product"} active
                          immediately
                        </label>
                      </div>

                      {!isService && (
                        <>
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              id="isDigital"
                              name="isDigital"
                              checked={formData.isDigital}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                            <label
                              htmlFor="isDigital"
                              className="text-sm font-medium text-gray-700"
                            >
                              This is a digital product
                            </label>
                          </div>

                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              id="requiresShipping"
                              name="requiresShipping"
                              checked={formData.requiresShipping}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                            <label
                              htmlFor="requiresShipping"
                              className="text-sm font-medium text-gray-700"
                            >
                              Requires shipping/delivery
                            </label>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Product Images */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {isService ? "Service" : "Product"} Images
                  </h3>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Upload {isService ? "service" : "product"} images (up to
                      10 images)
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
                      PNG, JPG up to 5MB each. First image will be the main
                      image.
                    </p>
                  </div>

                  {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                      {images.map((image, index) => (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          />
                          {index === 0 && (
                            <div className="absolute top-1 left-1 bg-green-600 text-white text-xs px-2 py-1 rounded">
                              Main
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(image.id)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                            title="Remove image"
                            aria-label="Remove image"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Variations Tab */}
            {activeTab === "variations" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Product Variations
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Add variations like size, color, material, etc. Each
                      variation can have multiple options.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addVariation}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Variation</span>
                  </button>
                </div>

                {variations.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Hash className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      No variations added
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Add variations like size, color, or material to give
                      customers more options
                    </p>
                    <button
                      type="button"
                      onClick={addVariation}
                      className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add First Variation</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {variations.map((variation, variationIndex) => (
                      <div
                        key={variation.id}
                        className="bg-gray-50 rounded-lg p-6"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-gray-900">
                            Variation {variationIndex + 1}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeVariation(variation.id)}
                            className="text-red-600 hover:text-red-700 p-1"
                            title="Remove variation"
                            aria-label="Remove variation"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Variation Name (e.g., Color, Size, Material)
                            </label>
                            <input
                              type="text"
                              value={variation.name}
                              onChange={(e) =>
                                updateVariationName(
                                  variation.id,
                                  e.target.value
                                )
                              }
                              placeholder="e.g., Color"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Variation Options
                              </label>
                              <button
                                type="button"
                                onClick={() => addVariationValue(variation.id)}
                                className="text-sm text-green-600 hover:text-green-700 flex items-center space-x-1"
                              >
                                <Plus className="h-3 w-3" />
                                <span>Add Option</span>
                              </button>
                            </div>

                            <div className="space-y-2">
                              {variation.values.map((value, valueIndex) => (
                                <div
                                  key={valueIndex}
                                  className="flex items-center space-x-2"
                                >
                                  <input
                                    type="text"
                                    value={value}
                                    onChange={(e) =>
                                      updateVariationValue(
                                        variation.id,
                                        valueIndex,
                                        e.target.value
                                      )
                                    }
                                    placeholder={`${
                                      variation.name || "Option"
                                    } ${valueIndex + 1}`}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                  />
                                  {variation.values.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeVariationValue(
                                          variation.id,
                                          valueIndex
                                        )
                                      }
                                      className="p-2 text-red-600 hover:text-red-700"
                                      title="Remove option"
                                      aria-label="Remove option"
                                    >
                                      <Minus className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Inventory Tab */}
            {activeTab === "inventory" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Inventory Management
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Manage stock levels and inventory tracking for your{" "}
                    {isService ? "service" : "product"}.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="stock"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      {isService ? "Available Slots" : "Stock Quantity"} *
                    </label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder={isService ? "10" : "50"}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {isService
                        ? "Number of service slots available"
                        : "Current number of items in stock"}
                    </p>
                  </div>

                  {!isService && (
                    <div>
                      <label
                        htmlFor="weight"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        id="weight"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        placeholder="0.5"
                        min="0"
                        step="0.1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>

                {!isService && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dimensions (cm)
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <input
                          type="number"
                          name="dimensions.length"
                          value={formData.dimensions.length}
                          onChange={handleInputChange}
                          placeholder="Length"
                          min="0"
                          step="0.1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          name="dimensions.width"
                          value={formData.dimensions.width}
                          onChange={handleInputChange}
                          placeholder="Width"
                          min="0"
                          step="0.1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          name="dimensions.height"
                          value={formData.dimensions.height}
                          onChange={handleInputChange}
                          placeholder="Height"
                          min="0"
                          step="0.1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="trackQuantity"
                      name="trackQuantity"
                      checked={formData.trackQuantity}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label
                      htmlFor="trackQuantity"
                      className="text-sm font-medium text-gray-700"
                    >
                      Track quantity for this{" "}
                      {isService ? "service" : "product"}
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="allowBackorders"
                      name="allowBackorders"
                      checked={formData.allowBackorders}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label
                      htmlFor="allowBackorders"
                      className="text-sm font-medium text-gray-700"
                    >
                      Allow {isService ? "bookings" : "orders"} when out of
                      stock
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Shipping Tab */}
            {activeTab === "shipping" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {isService ? "Service Delivery" : "Shipping & Delivery"}
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Configure how your{" "}
                    {isService
                      ? "service will be delivered"
                      : "product will be shipped"}
                    .
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <h4 className="font-medium text-blue-900 mb-2">
                    {isService
                      ? "Service Delivery Options"
                      : "Shipping Information"}
                  </h4>
                  <p className="text-sm text-blue-800 mb-4">
                    {isService
                      ? "Your business delivery settings will be used for this service."
                      : "Your business delivery settings will be used for this product."}
                  </p>

                  <div className="space-y-2 text-sm text-blue-800">
                    <div className="flex justify-between">
                      <span>Delivery Available:</span>
                      <span className="font-medium">
                        {business.delivery?.available ? "Yes" : "No"}
                      </span>
                    </div>
                    {business.delivery?.available && (
                      <>
                        <div className="flex justify-between">
                          <span>Delivery Fee:</span>
                          <span className="font-medium">
                            ₵{business.delivery.fee || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Coverage:</span>
                          <span className="font-medium">
                            {business.delivery.coverage || "Campus"}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <Link
                    to={`/vendor/${vendorId}/settings`}
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium mt-3"
                  >
                    Update delivery settings →
                  </Link>
                </div>

                {isService && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">
                      Service Delivery Method
                    </h4>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="serviceDelivery"
                          value="in-person"
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                          defaultChecked
                        />
                        <div>
                          <span className="font-medium text-gray-900">
                            In-Person Service
                          </span>
                          <p className="text-sm text-gray-600">
                            Service provided at customer's location or your
                            location
                          </p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="serviceDelivery"
                          value="online"
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <div>
                          <span className="font-medium text-gray-900">
                            Online Service
                          </span>
                          <p className="text-sm text-gray-600">
                            Service provided remotely via video call or online
                            platform
                          </p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="serviceDelivery"
                          value="hybrid"
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <div>
                          <span className="font-medium text-gray-900">
                            Hybrid
                          </span>
                          <p className="text-sm text-gray-600">
                            Combination of in-person and online service
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex justify-between pt-8 border-t border-gray-200">
              <Link
                to={`/vendor/${vendorId}/dashboard`}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>

              <div className="flex space-x-4">
                {activeTab !== "basic" && (
                  <button
                    type="button"
                    onClick={() => {
                      const tabs = [
                        "basic",
                        "variations",
                        "inventory",
                        "shipping",
                      ];
                      const currentIndex = tabs.indexOf(activeTab);
                      if (currentIndex > 0) {
                        setActiveTab(tabs[currentIndex - 1] as any);
                      }
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                )}

                {activeTab !== "shipping" ? (
                  <button
                    type="button"
                    onClick={() => {
                      const tabs = [
                        "basic",
                        "variations",
                        "inventory",
                        "shipping",
                      ];
                      const currentIndex = tabs.indexOf(activeTab);
                      if (currentIndex < tabs.length - 1) {
                        setActiveTab(tabs[currentIndex + 1] as any);
                      }
                    }}
                    disabled={activeTab === "basic" && !isFormValid}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      activeTab === "basic" && !isFormValid
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading || !isFormValid}
                    className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                      loading || !isFormValid
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {loading
                      ? `Adding ${isService ? "Service" : "Product"}...`
                      : `Add ${isService ? "Service" : "Product"}`}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
