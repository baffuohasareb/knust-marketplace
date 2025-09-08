import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Package, Plus, Pencil, Trash2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { mockBusinesses, mockProducts } from '../../data/mockData';
import { useProductsStore } from '../../store/productsStore';

export default function ManageProductsPage() {
  const { vendorId } = useParams<{ vendorId: string }>();
  const { state } = useApp();
  const { products, removeProduct } = useProductsStore();

  // Resolve business for header
  const business = useMemo(() => {
    return state.userBusinesses.find(b => b.id === vendorId) || mockBusinesses.find(b => b.id === vendorId);
  }, [state.userBusinesses, vendorId]);

  // Collect products for this business from store; merge with mocks for view
  const mergedProducts = useMemo(() => {
    const own = products.filter(p => p.businessId === vendorId);
    const m = mockProducts.filter(p => p.businessId === vendorId);
    // de-dup by id (store first)
    const map = new Map<string, typeof products[number]>();
    own.forEach(p => map.set(p.id, p as any));
    m.forEach(p => { if (!map.has(p.id)) map.set(p.id, p as any); });
    return Array.from(map.values());
  }, [products, vendorId]);

  if (!vendorId || !business) {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to={`/vendor/${vendorId}/dashboard`}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to dashboard
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
            <p className="text-gray-600 mt-1">{business.name}</p>
          </div>
          <Link
            to={`/vendor/${vendorId}/products/add`}
            className="inline-flex items-center space-x-2 bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Product</span>
          </Link>
        </div>

        {mergedProducts.length === 0 ? (
          <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-600 mb-6">Start by adding your first product.</p>
            <Link
              to={`/vendor/${vendorId}/products/add`}
              className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Product</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mergedProducts.map((p) => {
              const isEditable = products.some(sp => sp.id === p.id);
              return (
                <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <img src={p.images?.[0]} alt={p.name} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 truncate">{p.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 truncate">₵{p.price.toFixed(2)} • {p.category}</p>
                    <div className="flex items-center justify-between">
                      <Link
                        to={isEditable ? `/vendor/${vendorId}/products/${p.id}/edit` : `/product/${p.id}`}
                        className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-sm ${isEditable ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        title={isEditable ? 'Edit product' : 'View product'}
                      >
                        <Pencil className="h-4 w-4" />
                        <span>{isEditable ? 'Edit' : 'View'}</span>
                      </Link>
                      {isEditable && (
                        <button
                          onClick={() => removeProduct(p.id)}
                          className="inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
