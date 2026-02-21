import React, { useState } from "react";
import { FiEdit, FiCheckCircle, FiExternalLink } from "react-icons/fi";
import { HiOutlineCheckCircle } from "react-icons/hi";
import { FaRegCopy } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { SiHubspot } from "react-icons/si";

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

interface CrmConfig {
  id: string;
  provider: string;
  name: string;
  enabled: boolean;
  apiKey: string;
  workspaceId: string;
  domain: string;
  status: "connected" | "disconnected" | "error";
  lastSync: string;
  syncEnabled: boolean;
  syncOptions: {
    push: boolean;
    pull: boolean;
    bidirectional: boolean;
  };
}

const CrmIntegration: React.FC = () => {
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // CRM providers state
  const [providers, setProviders] = useState<CrmConfig[]>([
    {
      id: "hubspot-1",
      provider: "HubSpot",
      name: "HubSpot",
      enabled: true,
      apiKey: "sk_test_hubspot_ABC123456789",
      workspaceId: "123456789012345",
      domain: "company.hubspot.com",
      status: "connected",
      lastSync: "August 6, 2025",
      syncEnabled: true,
      syncOptions: {
        push: true,
        pull: false,
        bidirectional: false,
      },
    },
    {
      id: "hubspot-2",
      provider: "HubSpot",
      name: "HubSpot",
      enabled: true,
      apiKey: "sk_test_hubspot_XYZ987654321",
      workspaceId: "987654321098765",
      domain: "company2.hubspot.com",
      status: "connected",
      lastSync: "August 6, 2025",
      syncEnabled: true,
      syncOptions: {
        push: true,
        pull: true,
        bidirectional: false,
      },
    },
  ]);

  // Edit states
  const [editingApiKey, setEditingApiKey] = useState<{ [key: string]: boolean }>({});
  const [editingWorkspaceId, setEditingWorkspaceId] = useState<{ [key: string]: boolean }>({});
  const [editingDomain, setEditingDomain] = useState<{ [key: string]: boolean }>({});
  const [editingLastSync, setEditingLastSync] = useState<{ [key: string]: boolean }>({});

  const handleSaveChanges = (providerId: string) => {
    setModalMessage(`CRM integration settings saved successfully!`);
    setModalOpen(true);
  };

  const handleTestConnection = () => {
    setModalMessage(`Connection test successful!`);
    setModalOpen(true);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setModalMessage("Copied to clipboard!");
    setModalOpen(true);
  };

  const updateProvider = (id: string, updates: Partial<CrmConfig>) => {
    setProviders(providers.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const updateSyncOption = (id: string, option: keyof CrmConfig['syncOptions'], value: boolean) => {
    setProviders(providers.map((p) => 
      p.id === id 
        ? { ...p, syncOptions: { ...p.syncOptions, [option]: value } } 
        : p
    ));
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

  const Card = ({ provider }: { provider: CrmConfig }) => (
    <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-100 hover:shadow-lg transition">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-xl">
            <SiHubspot />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {provider.name}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">CRM Integration</p>
          </div>
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

      {/* Grid Info - 3 Columns */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Provider */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Provider:</p>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-800 font-medium">{provider.provider}</p>
            <FiExternalLink className="text-gray-400 text-xs cursor-pointer hover:text-blue-500" />
          </div>
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
            <FiExternalLink className="text-gray-400 text-xs cursor-pointer hover:text-blue-500" />
          </div>
        </div>

        {/* Status */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Status</p>
          {getStatusBadge(provider.status)}
        </div>

        {/* Workspace ID */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Workspace ID:</p>
          <div className="flex items-center gap-2">
            {editingWorkspaceId[provider.id] ? (
              <input
                autoFocus
                value={provider.workspaceId}
                onChange={(e) => updateProvider(provider.id, { workspaceId: e.target.value })}
                onBlur={() => setEditingWorkspaceId({ ...editingWorkspaceId, [provider.id]: false })}
                onKeyDown={(e) => e.key === "Enter" && setEditingWorkspaceId({ ...editingWorkspaceId, [provider.id]: false })}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <p className="text-sm text-gray-800 font-medium">{provider.workspaceId}</p>
            )}
            <FiEdit
              onClick={() => setEditingWorkspaceId({ ...editingWorkspaceId, [provider.id]: true })}
              className="text-gray-400 hover:text-blue-500 cursor-pointer transition"
            />
            <FaRegCopy
              onClick={() => handleCopy(provider.workspaceId)}
              className="text-gray-400 hover:text-blue-500 cursor-pointer transition"
            />
            <FiExternalLink className="text-gray-400 text-xs cursor-pointer hover:text-blue-500" />
          </div>
        </div>

        {/* Domain */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Domain:</p>
          <div className="flex items-center gap-2">
            {editingDomain[provider.id] ? (
              <input
                autoFocus
                value={provider.domain}
                onChange={(e) => updateProvider(provider.id, { domain: e.target.value })}
                onBlur={() => setEditingDomain({ ...editingDomain, [provider.id]: false })}
                onKeyDown={(e) => e.key === "Enter" && setEditingDomain({ ...editingDomain, [provider.id]: false })}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <p className="text-sm text-gray-800 font-medium">{provider.domain}</p>
            )}
            <FiEdit
              onClick={() => setEditingDomain({ ...editingDomain, [provider.id]: true })}
              className="text-gray-400 hover:text-blue-500 cursor-pointer transition"
            />
            <FaRegCopy
              onClick={() => handleCopy(provider.domain)}
              className="text-gray-400 hover:text-blue-500 cursor-pointer transition"
            />
            <FiExternalLink className="text-gray-400 text-xs cursor-pointer hover:text-blue-500" />
          </div>
        </div>

        {/* Last Sync */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Last Sync:</p>
          <div className="flex items-center gap-2">
            {editingLastSync[provider.id] ? (
              <input
                autoFocus
                value={provider.lastSync}
                onChange={(e) => updateProvider(provider.id, { lastSync: e.target.value })}
                onBlur={() => setEditingLastSync({ ...editingLastSync, [provider.id]: false })}
                onKeyDown={(e) => e.key === "Enter" && setEditingLastSync({ ...editingLastSync, [provider.id]: false })}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <p className="text-sm text-gray-800 font-medium">{provider.lastSync}</p>
            )}
            <FiEdit
              onClick={() => setEditingLastSync({ ...editingLastSync, [provider.id]: true })}
              className="text-gray-400 hover:text-blue-500 cursor-pointer transition"
            />
          </div>
        </div>
      </div>

      {/* Sync Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-gray-700">Sync</p>

          {/* Toggle */}
          <button
            onClick={() => updateProvider(provider.id, { syncEnabled: !provider.syncEnabled })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition duration-300 ${
              provider.syncEnabled ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-300 ${
                provider.syncEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Sync Options */}
        <div className="flex gap-6 text-sm text-gray-600">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={provider.syncOptions.push}
              onChange={(e) => updateSyncOption(provider.id, 'push', e.target.checked)}
              disabled={!provider.syncEnabled}
              className="w-4 h-4 accent-blue-500 rounded disabled:opacity-50"
            />
            <span className="text-gray-700">Push</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={provider.syncOptions.pull}
              onChange={(e) => updateSyncOption(provider.id, 'pull', e.target.checked)}
              disabled={!provider.syncEnabled}
              className="w-4 h-4 accent-blue-500 rounded disabled:opacity-50"
            />
            <span className="text-gray-700">Pull</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={provider.syncOptions.bidirectional}
              onChange={(e) => updateSyncOption(provider.id, 'bidirectional', e.target.checked)}
              disabled={!provider.syncEnabled}
              className="w-4 h-4 accent-blue-500 rounded disabled:opacity-50"
            />
            <span className="text-gray-700">Bi-directional</span>
          </label>
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
          CRM Integrations
        </h1>

        {providers.map((provider) => (
          <Card key={provider.id} provider={provider} />
        ))}
      </div>
    </>
  );
};

export default CrmIntegration;