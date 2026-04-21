// components/SubscriptionModal.tsx
import { useState, useEffect } from 'react';
import { FiX, FiPlus, FiTrash2, FiDollarSign, FiTag, FiUsers, FiShoppingCart, FiClock } from 'react-icons/fi';
import type { Subscription } from '../../model/susbcription/ISubscription';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription?: Subscription | null;
  onSave: (data: Partial<Subscription>) => Promise<void>;
  isLoading?: boolean;
}

const SubscriptionModal = ({ isOpen, onClose, subscription, onSave, isLoading = false }: SubscriptionModalProps) => {
  const [formData, setFormData] = useState<Partial<Subscription>>({
    subscription_name: '',
    billing_type: 'monthly',
    price: 0,
    feature: [],
    status: 1,
    description: '',
    max_products: 100,
    max_stores: 1,
    max_users: 1,
    commission_rate: 0,
    trial_period_days: 0,
    setup_fee: 0,
    transaction_fee_percentage: 0,
  });
  
  const [featureInput, setFeatureInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeSection, setActiveSection] = useState<'basic' | 'features' | 'limits'>('basic');

  // Populate form when editing
  useEffect(() => {
    if (subscription) {
      setFormData({
        subscription_name: subscription.subscription_name,
        billing_type: subscription.billing_type,
        price: subscription.price,
        feature: Array.isArray(subscription.feature) ? subscription.feature : [],
        status: subscription.status,
        description: subscription.description || '',
        max_products: subscription.max_products || 100,
        max_stores: subscription.max_stores || 1,
        max_users: subscription.max_users || 1,
        commission_rate: subscription.commission_rate || 0,
        trial_period_days: subscription.trial_period_days || 0,
        setup_fee: subscription.setup_fee || 0,
        transaction_fee_percentage: subscription.transaction_fee_percentage || 0,
      });
    } else {
      // Reset form for new subscription
      setFormData({
        subscription_name: '',
        billing_type: 'monthly',
        price: 0,
        feature: [],
        status: 1,
        description: '',
        max_products: 100,
        max_stores: 1,
        max_users: 1,
        commission_rate: 0,
        trial_period_days: 0,
        setup_fee: 0,
        transaction_fee_percentage: 0,
      });
      setFeatureInput('');
    }
    setErrors({});
    setActiveSection('basic');
  }, [subscription, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.subscription_name?.trim()) {
      newErrors.subscription_name = 'Subscription name is required';
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    if (formData.price && formData.price > 999999) {
      newErrors.price = 'Price is too high';
    }
    
    if (formData.commission_rate && (formData.commission_rate < 0 || formData.commission_rate > 100)) {
      newErrors.commission_rate = 'Commission rate must be between 0 and 100';
    }
    
    if (formData.max_products && formData.max_products < -1) {
      newErrors.max_products = 'Invalid product limit (-1 for unlimited)';
    }
    
    if (formData.trial_period_days && formData.trial_period_days < 0) {
      newErrors.trial_period_days = 'Trial period cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddFeature = () => {
    if (featureInput.trim() && !formData.feature?.includes(featureInput.trim())) {
      setFormData({
        ...formData,
        feature: [...(formData.feature || []), featureInput.trim()],
      });
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (featureToRemove: string) => {
    setFormData({
      ...formData,
      feature: formData.feature?.filter(f => f !== featureToRemove) || [],
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddFeature();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    await onSave(formData);
  };

  const getPricePreview = () => {
    if (!formData.price) return null;
    const price = formData.price;
    switch (formData.billing_type) {
      case 'monthly':
        return `$${price.toFixed(2)} / month`;
      case 'yearly':
        return `$${price.toFixed(2)} / year ($${(price / 12).toFixed(2)}/month)`;
      case 'one-time':
        return `$${price.toFixed(2)} one-time payment`;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  const isEditMode = !!subscription;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {isEditMode ? 'Edit Subscription Plan' : 'Create New Subscription Plan'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {isEditMode ? 'Modify the plan details below' : 'Fill in the details to create a new subscription plan'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition cursor-pointer p-2 hover:bg-gray-100 rounded-lg"
              disabled={isLoading}
            >
              <FiX className="text-xl" />
            </button>
          </div>
          
          {/* Section Tabs */}
          <div className="border-b border-gray-200 px-6">
            <div className="flex gap-4">
              {[
                { id: 'basic', label: 'Basic Info', icon: FiTag },
                { id: 'features', label: 'Features', icon: FiPlus },
                { id: 'limits', label: 'Limits & Fees', icon: FiUsers },
              ].map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id as any)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition border-b-2 cursor-pointer ${
                      activeSection === section.id
                        ? 'border-teal-500 text-teal-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="text-base" />
                    {section.label}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Basic Information Section */}
              {activeSection === 'basic' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Plan Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.subscription_name}
                        onChange={(e) => setFormData({ ...formData, subscription_name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                        placeholder="e.g., Professional Plan"
                        disabled={isLoading}
                      />
                      {errors.subscription_name && (
                        <p className="text-red-500 text-xs mt-1">{errors.subscription_name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Billing Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.billing_type}
                        onChange={(e) => setFormData({ ...formData, billing_type: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                        disabled={isLoading}
                      >
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                        <option value="one-time">One Time</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price ($) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                        placeholder="0.00"
                        disabled={isLoading}
                      />
                      {errors.price && (
                        <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                      )}
                      {formData.price > 0 && (
                        <p className="text-green-600 text-xs mt-1">{getPricePreview()}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <div className="flex gap-4 mt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value={1}
                            checked={formData.status === 1}
                            onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
                            className="w-4 h-4 text-teal-500 focus:ring-teal-500"
                            disabled={isLoading}
                          />
                          <span className="text-sm text-gray-700">Active</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value={0}
                            checked={formData.status === 0}
                            onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
                            className="w-4 h-4 text-teal-500 focus:ring-teal-500"
                            disabled={isLoading}
                          />
                          <span className="text-sm text-gray-700">Inactive</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none"
                        placeholder="Describe the plan benefits and features..."
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Features Section */}
              {activeSection === 'features' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Add Features
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                        placeholder="e.g., Unlimited Products, Priority Support"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={handleAddFeature}
                        className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition cursor-pointer flex items-center gap-1"
                        disabled={isLoading || !featureInput.trim()}
                      >
                        <FiPlus className="text-sm" />
                        Add
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plan Features ({formData.feature?.length || 0})
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {formData.feature?.map((feature, index) => (
                        <div
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg border border-teal-200"
                        >
                          <span className="text-sm">{feature}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(feature)}
                            className="text-teal-400 hover:text-red-500 transition cursor-pointer"
                            disabled={isLoading}
                          >
                            <FiTrash2 className="text-xs" />
                          </button>
                        </div>
                      ))}
                      {(!formData.feature || formData.feature.length === 0) && (
                        <p className="text-sm text-gray-400 italic">No features added yet</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>💡 Tip:</strong> Features help customers understand what's included in this plan. 
                      Add clear, benefit-focused features like "24/7 Support", "API Access", or "Advanced Analytics".
                    </p>
                  </div>
                </div>
              )}
              
              {/* Limits & Fees Section */}
              {activeSection === 'limits' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Products
                      </label>
                      <input
                        type="number"
                        value={formData.max_products}
                        onChange={(e) => setFormData({ ...formData, max_products: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                        placeholder="-1 for unlimited"
                        disabled={isLoading}
                      />
                      <p className="text-xs text-gray-500 mt-1">Use -1 for unlimited</p>
                      {errors.max_products && (
                        <p className="text-red-500 text-xs mt-1">{errors.max_products}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Stores
                      </label>
                      <input
                        type="number"
                        value={formData.max_stores}
                        onChange={(e) => setFormData({ ...formData, max_stores: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                        placeholder="-1 for unlimited"
                        disabled={isLoading}
                      />
                      <p className="text-xs text-gray-500 mt-1">Use -1 for unlimited</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Users
                      </label>
                      <input
                        type="number"
                        value={formData.max_users}
                        onChange={(e) => setFormData({ ...formData, max_users: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                        placeholder="-1 for unlimited"
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Commission Rate (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.commission_rate}
                        onChange={(e) => setFormData({ ...formData, commission_rate: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                        placeholder="0-100"
                        disabled={isLoading}
                      />
                      {errors.commission_rate && (
                        <p className="text-red-500 text-xs mt-1">{errors.commission_rate}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Setup Fee ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.setup_fee}
                        onChange={(e) => setFormData({ ...formData, setup_fee: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                        placeholder="0.00"
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Transaction Fee (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.transaction_fee_percentage}
                        onChange={(e) => setFormData({ ...formData, transaction_fee_percentage: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                        placeholder="0.00"
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Trial Period (Days)
                      </label>
                      <input
                        type="number"
                        value={formData.trial_period_days}
                        onChange={(e) => setFormData({ ...formData, trial_period_days: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                        placeholder="0 for no trial"
                        disabled={isLoading}
                      />
                      {errors.trial_period_days && (
                        <p className="text-red-500 text-xs mt-1">{errors.trial_period_days}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer Buttons */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition cursor-pointer"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-teal-400 to-green-400 text-white rounded-lg hover:shadow-lg transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading && (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                )}
                {isEditMode ? 'Update Plan' : 'Create Plan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;