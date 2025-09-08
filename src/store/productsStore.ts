import { create, StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../types';

interface ProductsState {
  products: Product[];
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  removeProduct: (id: string) => void;
  clearAll: () => void;
}

const impl: StateCreator<ProductsState, [], [['zustand/persist', ProductsState]]> = (set, get) => ({
  products: [],
  addProduct: (p) => set({ products: [p, ...get().products] }),
  updateProduct: (p) => set({ products: get().products.map(x => x.id === p.id ? { ...x, ...p, updatedAt: (p as any).updatedAt || new Date().toISOString() } : x) }),
  removeProduct: (id) => set({ products: get().products.filter(x => x.id !== id) }),
  clearAll: () => set({ products: [] }),
});

export const useProductsStore = create<ProductsState>()(
  persist(impl, { name: 'km_products_store' })
);
