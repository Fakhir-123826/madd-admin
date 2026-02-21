import React, { useState } from "react";
import { FiEdit, FiCheckCircle } from "react-icons/fi";
import { HiOutlineCheckCircle } from "react-icons/hi";
import { FaRegCopy } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

// Custom Success Modal
const SuccessModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  message: string;
}> = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-96 bg-white rounded-2xl shadow-xl animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <IoClose className="text-xl" />
        </button>

        <div className="flex justify-center mt-8">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-4xl">
            ✅
          </div>
        </div>

        <div className="text-center px-8 pb-8">
          <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">
            Success!
          </h3>
          <p className="text-gray-600 text-sm mb-6">{message}</p>
          <button
            onClick={onClose}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

interface ErpConfig {
  id: string;
  provider: string;
  enabled: boolean;
  erpProvider: string;
  apiBaseUrl: string;
  apiKey: string;
  organizationId: string;
  status: "connected" | "disconnected" | "error" | "synced";
  syncOptions: {
    products: boolean;
    inventory: boolean;
    orders: boolean;
    billingData: boolean;
  };
  syncFrequency: string;
  lastSync: string;
}

const ErpIntegration = () => {
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // ERP providers state
  const [providers, setProviders] = useState<ErpConfig[]>([
    {
      id: "erp-1",
      provider: "ERP",
      enabled: true,
      erpProvider: "Odoo",
      apiBaseUrl: "https://api.odoo.com/v1",
      apiKey: "TXN-20250715-00087",
      organizationId: "ORG-12345",
      status: "synced",
      syncOptions: {
        products: true,
        inventory: false,
        orders: false,
        billingData: false,
      },
      syncFrequency: "Manual Only",
      lastSync: "August 6, 2025",
    },
    {
      id: "erp-2",
      provider: "ERP",
      enabled: true,
      erpProvider: "Odoo",
      apiBaseUrl: "https://api.odoo.com/v2",
      apiKey: "TXN-20250715-00088",
      organizationId: "ORG-67890",
      status: "synced",
      syncOptions: {
        products: true,
        inventory: true,
        orders: false,
        billingData: false,
      },
      syncFrequency: "Manual Only",
      lastSync: "August 6, 2025",
    },
  ]);

  // Edit states
  const [editingErpProvider, setEditingErpProvider] = useState<{ [key: string]: boolean }>({});
  const [editingApiBaseUrl, setEditingApiBaseUrl] = useState<{ [key: string]: boolean }>({});
  const [editingApiKey, setEditingApiKey] = useState<{ [key: string]: boolean }>({});
  const [editingOrgId, setEditingOrgId] = useState<{ [key: string]: boolean }>({});

  const handleSaveChanges = (providerId: string) => {
    setModalMessage(`ERP integration settings saved successfully!`);
    setModalOpen(true);
  };

  const handleTestConnection = () => {
    setModalMessage(`ERP connection test successful!`);
    setModalOpen(true);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setModalMessage("Copied to clipboard!");
    setModalOpen(true);
  };

  const updateProvider = (id: string, updates: Partial<ErpConfig>) => {
    setProviders(providers.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const updateSyncOption = (id: string, option: keyof ErpConfig['syncOptions'], value: boolean) => {
    setProviders(providers.map((p) => 
      p.id === id 
        ? { ...p, syncOptions: { ...p.syncOptions, [option]: value } } 
        : p
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "synced":
      case "connected":
        return (
          <span className="inline-flex items-center gap-1 bg-green-100 text-green-600 text-xs px-3 py-1.5 rounded-full font-medium">
            <FiCheckCircle className="text-xs" />
            Synced
          </span>
        );
      case "disconnected":
        return (
          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full font-medium">
            <FiCheckCircle className="text-xs" />
            Disconnected
          </span>
        );
      case "error":
        return (
          <span className="inline-flex items-center gap-1 bg-red-100 text-red-600 text-xs px-3 py-1.5 rounded-full font-medium">
            <FiCheckCircle className="text-xs" />
            Error
          </span>
        );
      default:
        return null;
    }
  };

  const Card = ({ provider }: { provider: ErpConfig }) => (
    <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-100 hover:shadow-lg transition">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-lg">
            ERP
          </div>
          <h2 className="text-lg font-semibold text-gray-800">
            ERP Integration
          </h2>
        </div>

        {/* Toggle */}
        <button
          onClick={() => updateProvider(provider.id, { enabled: !provider.enabled })}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition duration-300 ${
            provider.enabled ? "bg-blue-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-300 ${
              provider.enabled ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Grid - 3 Columns */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* ERP Provider */}
        <div>
          <p className="text-sm text-gray-500 mb-1">ERP Provider:</p>
          <div className="flex items-center gap-2">
            {editingErpProvider[provider.id] ? (
              <input
                autoFocus
                value={provider.erpProvider}
                onChange={(e) => updateProvider(provider.id, { erpProvider: e.target.value })}
                onBlur={() => setEditingErpProvider({ ...editingErpProvider, [provider.id]: false })}
                onKeyDown={(e) => e.key === "Enter" && setEditingErpProvider({ ...editingErpProvider, [provider.id]: false })}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <p className="text-sm text-gray-800 font-medium">{provider.erpProvider}</p>
            )}
            <FiEdit
              onClick={() => setEditingErpProvider({ ...editingErpProvider, [provider.id]: true })}
              className="text-gray-400 hover:text-blue-500 cursor-pointer transition"
            />
          </div>
        </div>

        {/* API Base URL */}
        <div>
          <p className="text-sm text-gray-500 mb-1">API Base URL:</p>
          <div className="flex items-center gap-2">
            {editingApiBaseUrl[provider.id] ? (
              <input
                autoFocus
                value={provider.apiBaseUrl}
                onChange={(e) => updateProvider(provider.id, { apiBaseUrl: e.target.value })}
                onBlur={() => setEditingApiBaseUrl({ ...editingApiBaseUrl, [provider.id]: false })}
                onKeyDown={(e) => e.key === "Enter" && setEditingApiBaseUrl({ ...editingApiBaseUrl, [provider.id]: false })}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <p className="text-sm text-gray-800 font-medium truncate">{provider.apiBaseUrl}</p>
            )}
            <FiEdit
              onClick={() => setEditingApiBaseUrl({ ...editingApiBaseUrl, [provider.id]: true })}
              className="text-gray-400 hover:text-blue-500 cursor-pointer transition"
            />
            <FaRegCopy
              onClick={() => handleCopy(provider.apiBaseUrl)}
              className="text-gray-400 hover:text-blue-500 cursor-pointer transition"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Status</p>
          {getStatusBadge(provider.status)}
        </div>

        {/* API Key */}
        <div>
          <p className="text-sm text-gray-500 mb-1">API Key:</p>
          <div className="flex items-center gap-2">
            {editingApiKey[provider.id] ? (
              <input
                autoFocus
                value={provider.apiKey}
                onChange={(e) => updateProvider(provider.id, { apiKey: e.target.value })}
                onBlur={() => setEditingApiKey({ ...editingApiKey, [provider.id]: false })}
                onKeyDown={(e) => e.key === "Enter" && setEditingApiKey({ ...editingApiKey, [provider.id]: false })}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <p className="text-sm text-gray-800 font-medium">{provider.apiKey}</p>
            )}
            <FiEdit
              onClick={() => setEditingApiKey({ ...editingApiKey, [provider.id]: true })}
              className="text-gray-400 hover:text-blue-500 cursor-pointer transition"
            />
            <FaRegCopy
              onClick={() => handleCopy(provider.apiKey)}
              className="text-gray-400 hover:text-blue-500 cursor-pointer transition"
            />
          </div>
        </div>

        {/* Organization ID */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Organization ID:</p>
          <div className="flex items-center gap-2">
            {editingOrgId[provider.id] ? (
              <input
                autoFocus
                value={provider.organizationId}
                onChange={(e) => updateProvider(provider.id, { organizationId: e.target.value })}
                onBlur={() => setEditingOrgId({ ...editingOrgId, [provider.id]: false })}
                onKeyDown={(e) => e.key === "Enter" && setEditingOrgId({ ...editingOrgId, [provider.id]: false })}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <p className="text-sm text-gray-800 font-medium">{provider.organizationId}</p>
            )}
            <FiEdit
              onClick={() => setEditingOrgId({ ...editingOrgId, [provider.id]: true })}
              className="text-gray-400 hover:text-blue-500 cursor-pointer transition"
            />
            <FaRegCopy
              onClick={() => handleCopy(provider.organizationId)}
              className="text-gray-400 hover:text-blue-500 cursor-pointer transition"
            />
          </div>
        </div>
      </div>

      {/* Sync Section */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-3">Sync</p>
        <div className="flex items-center gap-6 text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={provider.syncOptions.products}
              onChange={(e) => updateSyncOption(provider.id, 'products', e.target.checked)}
              className="w-4 h-4 accent-blue-500 rounded"
            />
            <span className="text-gray-700">Products</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={provider.syncOptions.inventory}
              onChange={(e) => updateSyncOption(provider.id, 'inventory', e.target.checked)}
              className="w-4 h-4 accent-blue-500 rounded"
            />
            <span className="text-gray-700">Inventory</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={provider.syncOptions.orders}
              onChange={(e) => updateSyncOption(provider.id, 'orders', e.target.checked)}
              className="w-4 h-4 accent-blue-500 rounded"
            />
            <span className="text-gray-700">Orders</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={provider.syncOptions.billingData}
              onChange={(e) => updateSyncOption(provider.id, 'billingData', e.target.checked)}
              className="w-4 h-4 accent-blue-500 rounded"
            />
            <span className="text-gray-700">Billing Data</span>
          </label>
        </div>
      </div>

      {/* Bottom Section - 2 Columns */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-sm text-gray-500 mb-1">Sync Frequency:</p>
          <p className="text-sm text-gray-800 font-medium">{provider.syncFrequency}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Last Sync:</p>
          <p className="text-sm text-gray-800 font-medium">{provider.lastSync}</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={handleTestConnection}
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg transition"
        >
          Test Connection
        </button>

        <button
          onClick={() => handleSaveChanges(provider.id)}
          className="flex items-center gap-2 bg-lime-500 hover:bg-lime-600 text-white text-sm px-5 py-2 rounded-lg transition shadow"
        >
          <HiOutlineCheckCircle size={30} className="text-lg" />
          Save Integration
        </button>
      </div>
    </div>
  );

  return (
    <>
      <SuccessModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        message={modalMessage}
      />

      <div className="p-6 bg-gray-200 rounded-xl min-h-screen">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          ERP Integrations
        </h1>

        {providers.map((provider) => (
          <Card key={provider.id} provider={provider} />
        ))}
      </div>
    </>
  );
};

export default ErpIntegration;