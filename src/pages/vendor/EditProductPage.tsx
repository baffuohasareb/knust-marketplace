import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X, Save } from 'lucide-react';
import { useProductsStore } from '../../store/productsStore';
import { useApp } from '../../contexts/AppContext';
import { mockBusinesses, businessCategories } from '../../data/mockData';
import type { Product } from '../../types';

interface LocalImage {
  id: string;
  preview: string; // for immediate preview
  dataUrl: string; // persisted base64
}

export default function EditProductPage() {
  const { vendorId, productId } = useParams<{ vendorId: string; productId: string }>();
  const navigate = useNavigate();
  const { state } = useApp();
  const { products, updateProduct } = useProductsStore();

  const product = useMemo(() => products.find(p => p.id === productId), [products, productId]);
  const business = useMemo(() => state.userBusinesses.find(b => b.id === vendorId) || mockBusinesses.find(b => b.id === vendorId), [state.userBusinesses, vendorId]);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    sku: '',
    tags: '',
  });
  const [images, setImages] = useState<LocalImage[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description,
        price: String(product.price),
        category: product.category,
        stock: String(product.stock ?? 0),
        sku: (product as any).sku || '',
        tags: (product as any).tags || '',
      });
      setImages((product.images || []).map((src, i) => ({ id: `${i}-${product.id}`, preview: src, dataUrl: src })));
    }
  }, [product]);

  const onInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const fileToDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const next: LocalImage[] = [];
    for (const f of files) {
      const dataUrl = await fileToDataUrl(f);
      next.push({ id: `${Date.now()}-${Math.random()}`, preview: dataUrl, dataUrl });
    }
    setImages(prev => [...prev, ...next].slice(0, 10));
  };

  const removeImage = (id: string) => setImages(prev => prev.filter(i => i.id !== id));

  if (!product || !vendorId || !business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <Link to={`/vendor/${vendorId || ''}/products`} className="text-green-600 hover:text-green-700">
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const updated: Product = {
      ...product,
      name: form.name.trim(),
      description: form.description.trim(),
      price: parseFloat(form.price || '0') || 0,
      category: form.category,
      stock: parseInt(form.stock || '0') || 0,
      images: images.map(i => i.dataUrl),
      // keep options, rating, reviewCount as-is
    };
    updateProduct(updated);
    setSaving(false);
    navigate(`/vendor/${vendorId}/products`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to={`/vendor/${vendorId}/products`}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to products
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-gray-600">{business?.name}</p>
          </div>

          <form onSubmit={onSave} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input name="name" value={form.name} onChange={onInput} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select name="category" value={form.category} onChange={onInput} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" required>
                  <option value="">Select a category</option>
                  {businessCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₵)</label>
                <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={onInput} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                <input name="stock" type="number" min="0" value={form.stock} onChange={onInput} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea name="description" rows={5} value={form.description} onChange={onInput} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" required />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Images</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Upload images (up to 10)</p>
                <input id="edit-image-upload" type="file" accept="image/*" multiple className="hidden" onChange={onUpload} />
                <label htmlFor="edit-image-upload" className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">Choose Images</label>
              </div>
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {images.map((img) => (
                    <div key={img.id} className="relative group">
                      <img src={img.preview} className="w-full h-24 object-cover rounded-lg border border-gray-200" />
                      <button type="button" onClick={() => removeImage(img.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3">
              <Link to={`/vendor/${vendorId}/products`} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</Link>
              <button type="submit" disabled={saving} className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white ${saving ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}>
                <Save className="h-4 w-4" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
