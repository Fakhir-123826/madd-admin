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

interface ShippingConfig {
  id: string;
  provider: string;
  enabled: boolean;
  mode: "sandbox" | "live";
  apiKey: string;
  accountNumber: string;
  defaultRegion: string;
  redirectUri: string;
  status: "connected" | "disconnected" | "error";
}

const ShippingIntegration = () => {
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Shipping providers state
  const [providers, setProviders] = useState<ShippingConfig[]>([
    {
      id: "shiprocket-1",
      provider: "Shiprocket",
      enabled: true,
      mode: "sandbox",
      apiKey: "TXN-20250715-00087",
      accountNumber: "FedEx",
      defaultRegion: "Pakistan",
      redirectUri: "yoursite.com/auth/shiprocket/callback",
      status: "connected",
    },
    {
      id: "shiprocket-2",
      provider: "Shiprocket",
      enabled: true,
      mode: "sandbox",
      apiKey: "TXN-20250715-00088",
      accountNumber: "FedEx",
      defaultRegion: "Pakistan",
      redirectUri: "yoursite.com/auth/shiprocket/callback",
      status: "connected",
    },
  ]);

  // Edit states
  const [editingApiKey, setEditingApiKey] = useState<{ [key: string]: boolean }>({});
  const [editingAccount, setEditingAccount] = useState<{ [key: string]: boolean }>({});
  const [editingRegion, setEditingRegion] = useState<{ [key: string]: boolean }>({});

  const handleSaveChanges = (providerId: string, providerName: string) => {
    setModalMessage(`${providerName} settings saved successfully!`);
    setModalOpen(true);
  };

  const handleTestConnection = (providerName: string) => {
    setModalMessage(`${providerName} connection test successful!`);
    setModalOpen(true);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setModalMessage("Copied to clipboard!");
    setModalOpen(true);
  };

  const updateProvider = (id: string, updates: Partial<ShippingConfig>) => {
    setProviders(providers.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return (
          <span className="inline-flex items-center gap-1 bg-green-100 text-green-600 text-xs px-3 py-1.5 rounded-full font-medium">
            <FiCheckCircle className="text-xs" />
            Connected
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

  const Card = ({ provider }: { provider: ShippingConfig }) => (
    <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-100 hover:shadow-lg transition">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
            🚚
          </div>
          <h2 className="text-lg font-semibold text-gray-800">
            {provider.provider} Integration
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

      {/* Form Grid */}
      <div className="grid grid-cols-2 gap-6 mb-6">
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

        {/* Account Number */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Account Number:</p>
          <div className="flex items-center gap-2">
            {editingAccount[provider.id] ? (
              <input
                autoFocus
                value={provider.accountNumber}
                onChange={(e) => updateProvider(provider.id, { accountNumber: e.target.value })}
                onBlur={() => setEditingAccount({ ...editingAccount, [provider.id]: false })}
                onKeyDown={(e) => e.key === "Enter" && setEditingAccount({ ...editingAccount, [provider.id]: false })}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <p className="text-sm text-gray-800 font-medium">{provider.accountNumber}</p>
            )}
            <FiEdit
              onClick={() => setEditingAccount({ ...editingAccount, [provider.id]: true })}
              className="text-gray-400 hover:text-blue-500 cursor-pointer transition"
            />
            <FaRegCopy
              onClick={() => handleCopy(provider.accountNumber)}
              className="text-gray-400 hover:text-blue-500 cursor-pointer transition"
            />
          </div>
        </div>

        {/* Default Region */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Default Region:</p>
          <div className="flex items-center gap-2">
            {editingRegion[provider.id] ? (
              <input
                autoFocus
                value={provider.defaultRegion}
                onChange={(e) => updateProvider(provider.id, { defaultRegion: e.target.value })}
                onBlur={() => setEditingRegion({ ...editingRegion, [provider.id]: false })}
                onKeyDown={(e) => e.key === "Enter" && setEditingRegion({ ...editingRegion, [provider.id]: false })}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <p className="text-sm text-gray-800 font-medium">{provider.defaultRegion}</p>
            )}
            <FiEdit
              onClick={() => setEditingRegion({ ...editingRegion, [provider.id]: true })}
              className="text-gray-400 hover:text-blue-500 cursor-pointer transition"
            />
          </div>
        </div>

        {/* Redirect URI */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Redirect URI:</p>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-800 font-medium truncate">
              {provider.redirectUri}
            </p>
            <FaRegCopy
              onClick={() => handleCopy(provider.redirectUri)}
              className="text-gray-400 hover:text-blue-500 cursor-pointer transition flex-shrink-0"
            />
          </div>
        </div>
      </div>

      {/* Mode */}
      <div className="flex items-center gap-6 mb-6">
        <p className="text-sm font-medium text-gray-700">Mode</p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => updateProvider(provider.id, { mode: provider.mode === "sandbox" ? "live" : "sandbox" })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition duration-300 ${
              provider.mode === "sandbox" ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-300 ${
                provider.mode === "sandbox" ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span
            className={`text-sm ${
              provider.mode === "sandbox" ? "text-blue-600 font-medium" : "text-gray-500"
            }`}
          >
            Sandbox
          </span>
        </div>

        <span
          className={`text-sm ${
            provider.mode === "live" ? "text-blue-600 font-medium" : "text-gray-400"
          }`}
        >
          Live
        </span>
      </div>

      {/* Status */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-1">Status</p>
        {getStatusBadge(provider.status)}
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => handleTestConnection(provider.provider)}
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg transition"
        >
          Test Connection
        </button>

        <button
          onClick={() => handleSaveChanges(provider.id, provider.provider)}
          className="flex items-center gap-2 bg-lime-500 hover:bg-lime-600 text-white text-sm px-5 py-2 rounded-lg transition shadow"
        >
          <HiOutlineCheckCircle size={30} className="text-lg" />
          Save Changes
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
          Shipping Integrations
        </h1>

        {providers.map((provider) => (
          <Card key={provider.id} provider={provider} />
        ))}
      </div>
    </>
  );
};

export default ShippingIntegration;