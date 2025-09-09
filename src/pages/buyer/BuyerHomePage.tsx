import { useMemo, useState } from 'react';
import { Search, MapPin, TrendingUp, Percent, Clock } from 'lucide-react';
import BusinessCard from '../../components/Business/BusinessCard';
import EmptyState from '../../components/Common/EmptyState';
import ErrorState from '../../components/Common/ErrorState';
import { mockBusinesses } from '../../data/mockData';
import { useApp } from '../../contexts/AppContext';
import type { Business } from '../../types';

export default function BuyerHomePage() {
  const { state } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = ['all', 'Electronics', 'Food', 'Stationery', 'Books', 'Beverages', 'Accessories'];

  const allBusinesses: Business[] = useMemo(() => {
    // Map vendor-owned businesses to the public Business shape
    const mappedVendors: Business[] = (state.userBusinesses || []).map((vb) => ({
      id: vb.id,
      name: vb.name,
      logo: vb.logo,
      description: vb.description,
      location: vb.contactInfo?.hall || 'On Campus',
      rating: vb.rating ?? 4.7,
      reviewCount: vb.reviewCount ?? 0,
      phone: vb.contactInfo?.phone,
      whatsapp: vb.contactInfo?.whatsapp,
      chatEnabled: true,
      deliveryAvailable: vb.delivery?.available ?? false,
      categories: vb.tags && vb.tags.length > 0 ? vb.tags : [vb.category].filter(Boolean) as string[],
      images: vb.logo ? [vb.logo] : [],
      joinedDate: vb.createdAt,
      totalSales: vb.productCount || 0,
      responseTime: 'Varies',
      isVerified: false,
    }));

    // Merge with mock businesses (store-first de-dup by id)
    const map = new Map<string, Business>();
    mappedVendors.forEach((b) => map.set(b.id, b));
    mockBusinesses.forEach((b) => { if (!map.has(b.id)) map.set(b.id, b); });
    return Array.from(map.values());
  }, [state.userBusinesses]);

  const filteredBusinesses = allBusinesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         business.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           business.categories.some(cat => cat === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    // Simulate retry
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  if (error) return <ErrorState type="network" onRetry={handleRetry} />;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3 text-gray-600">
          <div className="h-10 w-10 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin" />
          <p className="text-sm">Loading, please wait…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Search Section */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for businesses, products, or services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-white border outline-none border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-md lg:text-lg"
            />
          </div>
          
          {/* Category Filters - Horizontal Scroll (Carousel-like) */}
          <div className="mt-4 -mx-4 sm:mx-0">
            <div className="overflow-x-auto px-4 sm:px-0 scrollbar-hide">
              <div className="inline-flex gap-2 whitespace-nowrap snap-x snap-mandatory">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors snap-start ${
                      selectedCategory === category
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-green-50 hover:text-green-700'
                    }`}
                  >
                    {category === 'all' ? 'All Categories' : category}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Section Headers */}
        <div className="space-y-12">
          {/* Most Viewed Businesses */}
          <section>
            <div className="flex items-center mb-6">
              <TrendingUp className="h-6 w-6 text-green-600 mr-3" />
              <h2 className="text-lg lg:text-2xl font-bold text-gray-900">Most Viewed Businesses</h2>
            </div>
            {filteredBusinesses.length === 0 ? (
              <EmptyState
                icon={TrendingUp}
                title="No businesses found"
                description={searchQuery ? `No businesses match "${searchQuery}"` : "No businesses available in this category"}
                actionText="Clear Search"
                onAction={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              />
            ) : (
              <div className="-mx-4 sm:mx-0">
                <div className="overflow-x-auto px-4 sm:px-0 scrollbar-hide">
                  <div className="flex gap-4 snap-x snap-mandatory">
                    {filteredBusinesses.slice(0, 3).map((business) => (
                      <div key={business.id} className="snap-start shrink-0 w-72 sm:w-80 h-[22rem] sm:h-[24rem]">
                        <BusinessCard business={business} className="h-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Businesses with Discounts */}
          <section>
            <div className="flex items-center mb-6">
              <Percent className="h-6 w-6 text-green-600 mr-3" />
              <h2 className="text-lg lg:text-2xl font-bold text-gray-900">Special Offers & Discounts</h2>
            </div>
            <div className="-mx-4 sm:mx-0">
              <div className="overflow-x-auto px-4 sm:px-0 scrollbar-hide">
                <div className="flex gap-4 snap-x snap-mandatory">
                  {filteredBusinesses.map((business) => (
                    <div key={business.id} className="snap-start shrink-0 w-72 sm:w-80 h-[22rem] sm:h-[24rem]">
                      <BusinessCard business={business} className="h-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Closest to You */}
          <section>
            <div className="flex items-center mb-6">
              <MapPin className="h-6 w-6 text-green-600 mr-3" />
              <h2 className="text-lg lg:text-2xl font-bold text-gray-900">Closest to You</h2>
            </div>
            <div className="-mx-4 sm:mx-0">
              <div className="overflow-x-auto px-4 sm:px-0 scrollbar-hide">
                <div className="flex gap-4 snap-x snap-mandatory">
                  {filteredBusinesses.slice(0, 2).map((business) => (
                    <div key={business.id} className="snap-start shrink-0 w-72 sm:w-80 h-[22rem] sm:h-[24rem]">
                      <BusinessCard business={business} className="h-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Recently Active */}
          <section>
            <div className="flex items-center mb-6">
              <Clock className="h-6 w-6 text-green-600 mr-3" />
              <h2 className="text-lg lg:text-2xl font-bold text-gray-900">Recently Active</h2>
            </div>
            <div className="-mx-4 sm:mx-0">
              <div className="overflow-x-auto px-4 sm:px-0 scrollbar-hide">
                <div className="flex gap-4 snap-x snap-mandatory">
                  {filteredBusinesses.map((business) => (
                    <div key={business.id} className="snap-start shrink-0 w-72 sm:w-80 h-[22rem] sm:h-[24rem]">
                      <BusinessCard business={business} className="h-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}