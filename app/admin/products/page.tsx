'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { StoreProduct } from '@/types';
import { Plus, Trash2, Edit2, Tag, ShoppingBag, CheckCircle, X } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface StoreOrder {
  id: string;
  product_id: string;
  full_name: string;
  phone_number: string;
  email: string;
  delivery_address: string;
  size: string;
  color: string;
  quantity: number;
  total_price: number;
  status: string;
  created_at: string;
  store_products?: { title: string };
}

export default function UnifiedStoreAdminPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  
  // Products State
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form State for Create / Edit Product
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'t-shirts' | 'sweatshirts' | 'face-caps'>('t-shirts');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Orders State
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  async function fetchProducts() {
    setLoadingProducts(true);
    const { data, error } = await supabase
      .from('store_products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching products:', error);
    else setProducts(data || []);
    setLoadingProducts(false);
  }

  async function fetchOrders() {
    setLoadingOrders(true);
    const { data, error } = await supabase
      .from('store_orders')
      .select('*, store_products(title)')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching orders:', error);
    else setOrders(data || []);
    setLoadingOrders(false);
  }

  function handleEditClick(product: StoreProduct) {
    setEditingId(product.id);
    setTitle(product.title);
    setCategory(product.category as any);
    setPrice(product.price.toString());
    setDescription(product.description || '');
    setImageUrl(product.image_url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditingId(null);
    setTitle('');
    setCategory('t-shirts');
    setPrice('');
    setDescription('');
    setImageUrl('');
  }

  async function handleSaveProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !price || !imageUrl) {
      alert('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setSuccessMsg('');

    if (editingId) {
      // Update existing product
      const { error } = await supabase
        .from('store_products')
        .update({
          title,
          category,
          price: parseFloat(price),
          description,
          image_url: imageUrl,
        })
        .eq('id', editingId);

      if (error) {
        alert('Failed to update product: ' + error.message);
      } else {
        setSuccessMsg('Product updated successfully!');
        cancelEdit();
        fetchProducts();
      }
    } else {
      // Insert new product
      const { error } = await supabase.from('store_products').insert([
        {
          title,
          category,
          price: parseFloat(price),
          description,
          image_url: imageUrl,
          is_available: true,
        },
      ]);

      if (error) {
        alert('Failed to add product: ' + error.message);
      } else {
        setSuccessMsg('Product added successfully!');
        cancelEdit();
        fetchProducts();
      }
    }
    setSubmitting(false);
  }

  async function toggleAvailability(id: string, currentStatus: boolean) {
    const { error } = await supabase
      .from('store_products')
      .update({ is_available: !currentStatus })
      .eq('id', id);

    if (error) alert('Failed to update status');
    else fetchProducts();
  }

  async function deleteProduct(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const { error } = await supabase.from('store_products').delete().eq('id', id);
    if (error) alert('Failed to delete: ' + error.message);
    else fetchProducts();
  }

  async function updateOrderStatus(id: string, newStatus: string) {
    const { error } = await supabase
      .from('store_orders')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) alert('Failed to update order status');
    else fetchOrders();
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <span className="bg-[#C62828] text-white text-[10px] font-bold uppercase px-2 py-1 border border-[#0A0A0A]">
          Unified Control Center
        </span>
        <h1 className="text-3xl font-bold font-['Bricolage_Grotesque'] text-[#293241] mt-2">
          Support Store Management
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Manage your merchandise catalog, update listings, and track support orders in one place.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b-2 border-[#0A0A0A] bg-[#FFFFFE]">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-sm border-r-2 border-[#0A0A0A] transition-all ${
            activeTab === 'products' ? 'bg-[#293241] text-white' : 'hover:bg-[#F4F1EA] text-[#293241]'
          }`}
        >
          <Tag className="w-4 h-4 text-[#C62828]" /> Products Catalog ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-sm transition-all ${
            activeTab === 'orders' ? 'bg-[#293241] text-white' : 'hover:bg-[#F4F1EA] text-[#293241]'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-[#C62828]" /> Customer Orders ({orders.length})
        </button>
      </div>

      {successMsg && (
        <div className="bg-green-100 border-2 border-green-700 text-green-900 px-4 py-3 font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-700" /> {successMsg}
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-green-900 font-bold">×</button>
        </div>
      )}

      {/* TAB 1: PRODUCTS CATALOG & CREATION/EDITING */}
      {activeTab === 'products' && (
        <div className="space-y-8">
          {/* Add / Edit Form */}
          <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] p-6 shadow-[4px_4px_0px_0px_#0A0A0A]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#293241] flex items-center gap-2">
                {editingId ? <Edit2 className="w-5 h-5 text-[#C62828]" /> : <Plus className="w-5 h-5 text-[#C62828]" />}
                {editingId ? 'Edit Product Item' : 'List New Item'}
              </h2>
              {editingId && (
                <button
                  onClick={cancelEdit}
                  className="text-xs font-bold bg-gray-200 text-gray-800 px-3 py-1 border border-[#0A0A0A] hover:bg-gray-300 flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Cancel Editing
                </button>
              )}
            </div>

            <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-1 text-gray-700">Product Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mission Impact T-Shirt"
                  className="w-full border-2 border-[#0A0A0A] p-2.5 text-sm bg-[#F4F1EA] focus:outline-none focus:border-[#C62828]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1 text-gray-700">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full border-2 border-[#0A0A0A] p-2.5 text-sm bg-[#F4F1EA] focus:outline-none focus:border-[#C62828]"
                >
                  <option value="t-shirts">T-Shirts</option>
                  <option value="sweatshirts">Sweatshirts</option>
                  <option value="face-caps">Face Caps</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1 text-gray-700">Price (₦) *</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 15000"
                  className="w-full border-2 border-[#0A0A0A] p-2.5 text-sm bg-[#F4F1EA] focus:outline-none focus:border-[#C62828]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1 text-gray-700">Image URL *</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full border-2 border-[#0A0A0A] p-2.5 text-sm bg-[#F4F1EA] focus:outline-none focus:border-[#C62828]"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase mb-1 text-gray-700">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description about the item..."
                  rows={3}
                  className="w-full border-2 border-[#0A0A0A] p-2.5 text-sm bg-[#F4F1EA] focus:outline-none focus:border-[#C62828]"
                />
              </div>

              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#C62828] text-white font-bold px-6 py-3 border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A] hover:bg-[#a52222] transition-all disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingId ? 'Update Product Item' : 'Publish Product to Store'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="bg-gray-300 text-[#293241] font-bold px-6 py-3 border-2 border-[#0A0A0A] hover:bg-gray-400 transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Product List Table */}
          <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] p-6 shadow-[4px_4px_0px_0px_#0A0A0A]">
            <h2 className="text-xl font-bold text-[#293241] mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-[#C62828]" /> Store Inventory
            </h2>

            {loadingProducts ? (
              <p className="text-sm text-gray-500 py-4">Loading inventory...</p>
            ) : products.length === 0 ? (
              <p className="text-sm text-gray-500 py-4">No products listed yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-[#0A0A0A] text-xs uppercase bg-[#F4F1EA]">
                      <th className="p-3 border-r-2 border-[#0A0A0A]">Item</th>
                      <th className="p-3 border-r-2 border-[#0A0A0A]">Category</th>
                      <th className="p-3 border-r-2 border-[#0A0A0A]">Price</th>
                      <th className="p-3 border-r-2 border-[#0A0A0A]">Status</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-[#0A0A0A]/20 hover:bg-[#F4F1EA]/50">
                        <td className="p-3 border-r border-[#0A0A0A]/20 flex items-center gap-3">
                          <img src={product.image_url} alt={product.title} className="w-10 h-10 object-cover border border-[#0A0A0A]" />
                          <span className="font-bold text-sm text-[#293241]">{product.title}</span>
                        </td>
                        <td className="p-3 border-r border-[#0A0A0A]/20 text-sm capitalize">{product.category}</td>
                        <td className="p-3 border-r border-[#0A0A0A]/20 text-sm font-semibold">₦{product.price.toLocaleString()}</td>
                        <td className="p-3 border-r border-[#0A0A0A]/20 text-sm">
                          <button
                            onClick={() => toggleAvailability(product.id, product.is_available ?? true)}
                            className={`px-2 py-1 text-xs font-bold border border-[#0A0A0A] ${
                              product.is_available ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'
                            }`}
                          >
                            {product.is_available ? 'Active' : 'Hidden'}
                          </button>
                        </td>
                        <td className="p-3 text-center flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(product)}
                            className="text-blue-600 hover:text-blue-800 p-1 bg-blue-50 border border-blue-200"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="text-red-600 hover:text-red-800 p-1 bg-red-50 border border-red-200"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOMER ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] p-6 shadow-[4px_4px_0px_0px_#0A0A0A]">
          <h2 className="text-xl font-bold text-[#293241] mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#C62828]" /> Incoming Customer Orders
          </h2>

          {loadingOrders ? (
            <p className="text-sm text-gray-500 py-4">Loading customer orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-sm text-gray-500 py-4">No support orders received yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#0A0A0A] text-xs uppercase bg-[#F4F1EA]">
                    <th className="p-3 border-r-2 border-[#0A0A0A]">Customer</th>
                    <th className="p-3 border-r-2 border-[#0A0A0A]">Item Ordered</th>
                    <th className="p-3 border-r-2 border-[#0A0A0A]">Details</th>
                    <th className="p-3 border-r-2 border-[#0A0A0A]">Total</th>
                    <th className="p-3 border-r-2 border-[#0A0A0A]">Status</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-[#0A0A0A]/20 hover:bg-[#F4F1EA]/50">
                      <td className="p-3 border-r border-[#0A0A0A]/20">
                        <p className="font-bold text-sm text-[#293241]">{order.full_name}</p>
                        <p className="text-xs text-gray-500">{order.phone_number}</p>
                        <p className="text-xs text-gray-500">{order.delivery_address}</p>
                      </td>
                      <td className="p-3 border-r border-[#0A0A0A]/20 text-sm font-semibold">
                        {order.store_products?.title || 'Unknown Item'}
                      </td>
                      <td className="p-3 border-r border-[#0A0A0A]/20 text-xs">
                        <p>Size: <b>{order.size || 'N/A'}</b></p>
                        <p>Color: <b>{order.color || 'Standard'}</b></p>
                        <p>Qty: <b>{order.quantity}</b></p>
                      </td>
                      <td className="p-3 border-r border-[#0A0A0A]/20 text-sm font-bold">
                        ₦{order.total_price.toLocaleString()}
                      </td>
                      <td className="p-3 border-r border-[#0A0A0A]/20 text-sm">
                        <span className={`px-2 py-1 text-xs font-bold border border-[#0A0A0A] capitalize ${
                          order.status === 'completed' ? 'bg-green-200 text-green-900' : 'bg-yellow-200 text-yellow-900'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="border border-[#0A0A0A] p-1 text-xs bg-[#F4F1EA]"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}