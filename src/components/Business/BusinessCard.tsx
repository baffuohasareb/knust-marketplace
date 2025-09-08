import React from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, Truck, Heart } from "lucide-react";
import { Business } from "../../types";
import { useStore } from "../../stores/useStore";

interface BusinessCardProps {
  business: Business;
}

export default function BusinessCard({ business }: BusinessCardProps) {
  const favorites = useStore((state) => state.favorites);
  const toggleFavorite = useStore((state) => state.toggleFavorite);

  const isFavorite = favorites.some((fav) => fav.id === business.id);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(business);
  };

  return (
    <Link to={`/business/${business.id}`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
        <div className="relative">
          <img
            src={business.logo}
            alt={business.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <button
            onClick={handleToggleFavorite}
            className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
              isFavorite
                ? "bg-red-100 text-red-600"
                : "bg-white/80 text-gray-600 hover:bg-red-100 hover:text-red-600"
            }`}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
          </button>

          {business.deliveryAvailable && (
            <div className="absolute bottom-3 left-3 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
              <Truck className="h-3 w-3" />
              <span>Delivery</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 truncate">
            {business.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {business.description}
          </p>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{business.location}</span>
            </div>

            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-900">
                {business.rating}
              </span>
              <span className="text-sm text-gray-500">
                ({business.reviewCount})
              </span>
            </div>
          </div>

          <div className="flex -space-x-2 mb-3">
            {business.images.slice(0, 3).map((image, index) => (
              <img
                key={index}
                src={image}
                alt=""
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
              />
            ))}
            {business.images.length > 3 && (
              <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                +{business.images.length - 3}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-1">
            {business.categories.slice(0, 2).map((category) => (
              <span
                key={category}
                className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
