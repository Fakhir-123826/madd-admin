import React, { useState } from "react";
import { X, Plus, Trash2, User, Mail, Phone, MapPin, Truck, CreditCard, Package } from "lucide-react";

interface ProductItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface AddOrderProps {
  onClose?: () => void;
  onSave?: (order: any) => void;
  isEmbedded?: boolean; // New prop to control layout
}

function AddOrder({ onClose, onSave, isEmbedded = false }: AddOrderProps) {
  const [products, setProducts] = useState<ProductItem[]>([
    { id: 1, name: "Product A", quantity: 1, price: 400 },
  ]);

  const [orderData, setOrderData] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    deliveryMethod: "Pick up",
    paymentMethod: "Paypal",
  });

  const addProduct = () => {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    setProducts([...products, { id: newId, name: "", quantity: 1, price: 0 }]);
  };

  const removeProduct = (id: number) => {
    if (products.length > 1) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const updateProduct = (id: number, field: keyof ProductItem, value: string | number) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const calculateTotal = () => {
    const subtotal = products.reduce((sum, p) => sum + (p.quantity * p.price), 0);
    const tax = subtotal * 0.1;
    const shipping = 395;
    return {
      subtotal,
      tax,
      shipping,
      total: subtotal + tax + shipping
    };
  };

  const totals = calculateTotal();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const order = {
      id: `#${Math.floor(Math.random() * 100000)}`,
      ...orderData,
      products,
      totals,
      datetime: new Date().toLocaleString(),
      status: "Pending",
    };
    onSave?.(order);
    onClose?.();
  };

  // If embedded, render without the overlay
  if (isEmbedded) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-auto animate-in slide-in-from-bottom duration-300">
        {/* Header with Gradient */}
        <div className=" bg-gradient-to-r from-teal-500 to-green-500 rounded-t-2xl">
          <div className="flex items-center justify-between p-6 text-white">
            <div>
              <h2 className="text-2xl font-bold">Add New Order</h2>
              <p className="text-sm text-white/80 mt-1">Create a new order for customer</p>
            </div>
            {/* <button 
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200"
            >
              <X size={24} />
            </button> */}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer Information Card */}
          <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
            <div className="px-6 py-3 bg-gradient-to-r from-teal-400 to-green-400 text-white font-medium flex items-center gap-2">
              <User size={18} />
              Customer Information
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <User size={16} className="text-teal-500" />
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={orderData.customerName}
                    onChange={(e) => setOrderData({...orderData, customerName: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
                    placeholder="Enter customer name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Mail size={16} className="text-teal-500" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={orderData.email}
                    onChange={(e) => setOrderData({...orderData, email: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Phone size={16} className="text-teal-500" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={orderData.phone}
                    onChange={(e) => setOrderData({...orderData, phone: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <MapPin size={16} className="text-teal-500" />
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    value={orderData.address}
                    onChange={(e) => setOrderData({...orderData, address: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
                    placeholder="Enter delivery address"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Products List Card */}
          <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
            <div className="px-6 py-3 bg-gradient-to-r from-teal-400 to-green-400 text-white font-medium flex items-center gap-2">
              <Package size={18} />
              Order Items
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-3 px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium text-gray-600">
                  <div className="col-span-5">Product Name</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-center">Unit Price</div>
                  <div className="col-span-2 text-center">Total</div>
                  <div className="col-span-1"></div>
                </div>

                {/* Product Rows */}
                {products.map((product) => (
                  <div key={product.id} className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-5">
                      <input
                        type="text"
                        placeholder="Product Name"
                        value={product.name}
                        onChange={(e) => updateProduct(product.id, "name", e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="Qty"
                        value={product.quantity}
                        onChange={(e) => updateProduct(product.id, "quantity", parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all text-center"
                        min="1"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="Price"
                        value={product.price}
                        onChange={(e) => updateProduct(product.id, "price", parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all text-center"
                        min="0"
                        required
                      />
                    </div>
                    <div className="col-span-2 text-center font-semibold text-teal-600">
                      ${product.quantity * product.price}
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button
                        type="button"
                        onClick={() => removeProduct(product.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50 disabled:hover:bg-transparent"
                        disabled={products.length === 1}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Add Product Button */}
                <button
                  type="button"
                  onClick={addProduct}
                  className="flex items-center gap-2 px-4 py-2 text-teal-500 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all mt-2"
                >
                  <Plus size={18} />
                  Add Another Product
                </button>
              </div>

              {/* Totals Section */}
              <div className="mt-6 border-t-2 border-gray-200 pt-6">
                <div className="flex flex-col items-end space-y-2">
                  <div className="w-72 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">${totals.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Taxes (10%):</span>
                      <span className="font-medium">${totals.tax}</span>
                    </div>
                    <div className="flex justify-between text-sm border-b-2 border-gray-200 pb-2">
                      <span className="text-gray-600">Shipping fee:</span>
                      <span className="font-medium">${totals.shipping}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2">
                      <span className="text-gray-800">Total:</span>
                      <span className="text-teal-600">${totals.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery & Payment Card */}
          <div className="grid grid-cols-2 gap-6">
            <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
              <div className="px-6 py-3 bg-gradient-to-r from-teal-400 to-green-400 text-white font-medium flex items-center gap-2">
                <Truck size={18} />
                Delivery Method
              </div>
              <div className="p-6">
                <select
                  value={orderData.deliveryMethod}
                  onChange={(e) => setOrderData({...orderData, deliveryMethod: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all appearance-none bg-white"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke='%23374151'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundPosition: `right 1rem center`,
                    backgroundRepeat: `no-repeat`,
                    backgroundSize: `1.5em 1.5em`,
                    paddingRight: `2.5rem`
                  }}
                >
                  <option>Pick up</option>
                  <option>Delivery</option>
                  <option>Express</option>
                </select>
              </div>
            </div>

            <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
              <div className="px-6 py-3 bg-gradient-to-r from-teal-400 to-green-400 text-white font-medium flex items-center gap-2">
                <CreditCard size={18} />
                Payment Method
              </div>
              <div className="p-6">
                <select
                  value={orderData.paymentMethod}
                  onChange={(e) => setOrderData({...orderData, paymentMethod: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all appearance-none bg-white"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke='%23374151'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundPosition: `right 1rem center`,
                    backgroundRepeat: `no-repeat`,
                    backgroundSize: `1.5em 1.5em`,
                    paddingRight: `2.5rem`
                  }}
                >
                  <option>Paypal</option>
                  <option>Credit Card</option>
                  <option>Cash on Delivery</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t-2 border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-medium text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-xl hover:from-teal-600 hover:to-green-600 transition-all font-medium shadow-lg hover:shadow-xl"
            >
              Create Order
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Original modal version (kept for backward compatibility)
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
        {/* ... (same content as embedded version) ... */}
      </div>
    </div>
  );
}

export default AddOrder;