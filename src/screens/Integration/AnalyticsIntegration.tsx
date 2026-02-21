import React, { useState } from "react";
import { FiEdit, FiCheckCircle, FiExternalLink } from "react-icons/fi";
import { HiOutlineCheckCircle } from "react-icons/hi";
import { FaRegCopy } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { SiMeta } from "react-icons/si";

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

interface AnalyticsConfig {
  id: string;
  provider: string;
  name: string;
  enabled: boolean;
  measurementId: string;
  pixelId: string;
  status: "tracking" | "not-tracking" | "error";
  ecommerceEvents: {
    productViews: boolean;
    addToCart: boolean;
    purchaseCompleted: boolean;
  };
  codePlacement: string;
}

const AnalyticsIntegration: React.FC = () => {
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Analytics providers state
  const [providers, setProviders] = useState<AnalyticsConfig[]>([
    {
      id: "meta-pixel-1",
      provider: "Meta",
      name: "Meta Pixel",
      enabled: true,
      measurementId: "G-XXXXXXXXXX",
      pixelId: "123456789012345",
      status: "not-tracking",
      ecommerceEvents: {
        productViews: true,
        addToCart: false,
        purchaseCompleted: false,
      },
      codePlacement: "site header (before </head>)",
    },
    {
      id: "meta-pixel-2",
      provider: "Meta",
      name: "Meta Pixel",
      enabled: true,
      measurementId: "G-YYYYYYYYYY",
      pixelId: "987654321098765",
      status: "not-tracking",
      ecommerceEvents: {
        productViews: true,
        addToCart: true,
        purchaseCompleted: false,
      },
      codePlacement: "site header (before </head>)",
    },
  ]);

  // Edit states
  const [editingMeasurementId, setEditingMeasurementId] = useState<{ [key: string]: boolean }>({});
  const [editingPixelId, setEditingPixelId] = useState<{ [key: string]: boolean }>({});
  const [editingCodePlacement, setEditingCodePlacement] = useState<{ [key: string]: boolean }>({});

  const handleSaveChanges = (providerId: string) => {
    setModalMessage(`Analytics integration settings saved successfully!`);
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

  const updateProvider = (id: string, updates: Partial<AnalyticsConfig>) => {
    setProviders(providers.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const updateEvent = (id: string, event: keyof AnalyticsConfig['ecommerceEvents'], value: boolean) => {
    setProviders(providers.map((p) => 
      p.id === id 
        ? { ...p, ecommerceEvents: { ...p.ecommerceEvents, [event]: value } } 
        : p
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "tracking":
        return (
          <span className="inline-flex items-center gap-1 bg-green-100 text-green-600 text-xs px-3 py-1.5 rounded-full font-medium">
            <FiCheckCircle className="text-xs" />
            Tracking
          </span>
        );
      case "not-tracking":
        return (
          <span className="inline-flex items-center gap-1 bg-red-100 text-red-600 text-xs px-3 py-1.5 rounded-full font-medium">
            <FiCheckCircle className="text-xs" />
            Not Tracking
          </span>
        );
      case "error":
        return (
          <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-600 text-xs px-3 py-1.5 rounded-full font-medium">
            <FiCheckCircle className="text-xs" />
            Error
          </span>
        );
      default:
        return null;
    }
  };

  const Card = ({ provider }: { provider: AnalyticsConfig }) => (
    <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-100 hover:shadow-lg transition">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl">
            <SiMeta />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {provider.name}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Analytics Integration</p>
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

      {/* Provider / Measurement / Status */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Provider */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Provider:</p>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-800 font-medium">{provider.provider}</p>
            <FiExternalLink className="text-gray-400 text-xs cursor-pointer hover:text-blue-500" />
          </div>
        </div>

        {/* Measurement ID */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Measurement ID:</p>
          <div className="flex items-center gap-2">
            {editingMeasurementId[provider.id] ? (
              <input
                autoFocus
                value={provider.measurementId}
                onChange={(e) => updateProvider(provider.id, { measurementId: e.target.value })}
                onBlur={() => setEditingMeasurementId({ ...editingMeasurementId, [provider.id]: false })}
                onKeyDown={(e) => e.key === "Enter" && setEditingMeasurementId({ ...editingMeasurementId, [provider.id]: false })}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <p className="text-sm text-gray-800 font-medium">{provider.measurementId}</p>
            )}
            <FiEdit
              onClick={() => setEditingMeasurementId({ ...editingMeasurementId, [provider.id]: true })}
              className="text-gray-400 hover:text-blue-500 cursor-pointer transition"
            />
            <FaRegCopy
              onClick={() => handleCopy(provider.measurementId)}
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
      </div>

      {/* Pixel ID */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-1">Pixel ID:</p>
        <div className="flex items-center gap-2">
          {editingPixelId[provider.id] ? (
            <input
              autoFocus
              value={provider.pixelId}
              onChange={(e) => updateProvider(provider.id, { pixelId: e.target.value })}
              onBlur={() => setEditingPixelId({ ...editingPixelId, [provider.id]: false })}
              onKeyDown={(e) => e.key === "Enter" && setEditingPixelId({ ...editingPixelId, [provider.id]: false })}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ) : (
            <p className="text-sm text-gray-800 font-medium">{provider.pixelId}</p>
          )}
          <FiEdit
            onClick={() => setEditingPixelId({ ...editingPixelId, [provider.id]: true })}
            className="text-gray-400 hover:text-blue-500 cursor-pointer transition"
          />
          <FaRegCopy
            onClick={() => handleCopy(provider.pixelId)}
            className="text-gray-400 hover:text-blue-500 cursor-pointer transition"
          />
          <FiExternalLink className="text-gray-400 text-xs cursor-pointer hover:text-blue-500" />
        </div>
      </div>

      {/* eCommerce Events */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-gray-700">
            Enable eCommerce Events
          </p>

          {/* Toggle */}
          <button
            onClick={() => {
              // This would toggle all events or master toggle
              const newValue = !(provider.ecommerceEvents.productViews && 
                                provider.ecommerceEvents.addToCart && 
                                provider.ecommerceEvents.purchaseCompleted);
              updateProvider(provider.id, {
                ecommerceEvents: {
                  productViews: newValue,
                  addToCart: newValue,
                  purchaseCompleted: newValue,
                }
              });
            }}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition duration-300 ${
              provider.ecommerceEvents.productViews || 
              provider.ecommerceEvents.addToCart || 
              provider.ecommerceEvents.purchaseCompleted ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-300 ${
                provider.ecommerceEvents.productViews || 
                provider.ecommerceEvents.addToCart || 
                provider.ecommerceEvents.purchaseCompleted ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Event Toggles */}
        <div className="flex gap-6 text-sm text-gray-600">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={provider.ecommerceEvents.productViews}
              onChange={(e) => updateEvent(provider.id, 'productViews', e.target.checked)}
              className="w-4 h-4 accent-blue-500 rounded"
            />
            <span className="text-gray-700">Product views</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={provider.ecommerceEvents.addToCart}
              onChange={(e) => updateEvent(provider.id, 'addToCart', e.target.checked)}
              className="w-4 h-4 accent-blue-500 rounded"
            />
            <span className="text-gray-700">Add to cart</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={provider.ecommerceEvents.purchaseCompleted}
              onChange={(e) => updateEvent(provider.id, 'purchaseCompleted', e.target.checked)}
              className="w-4 h-4 accent-blue-500 rounded"
            />
            <span className="text-gray-700">Purchase completed</span>
          </label>
        </div>
      </div>

      {/* Code Placement */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-1">Code Placement:</p>
        <div className="flex items-center gap-2">
          {editingCodePlacement[provider.id] ? (
            <input
              autoFocus
              value={provider.codePlacement}
              onChange={(e) => updateProvider(provider.id, { codePlacement: e.target.value })}
              onBlur={() => setEditingCodePlacement({ ...editingCodePlacement, [provider.id]: false })}
              onKeyDown={(e) => e.key === "Enter" && setEditingCodePlacement({ ...editingCodePlacement, [provider.id]: false })}
              className="text-sm border border-gray-300 rounded px-2 py-1 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ) : (
            <p className="text-sm text-gray-800 font-medium flex-1">{provider.codePlacement}</p>
          )}
          <FiEdit
            onClick={() => setEditingCodePlacement({ ...editingCodePlacement, [provider.id]: true })}
            className="text-gray-400 hover:text-blue-500 cursor-pointer transition"
          />
          <FaRegCopy
            onClick={() => handleCopy(provider.codePlacement)}
            className="text-gray-400 hover:text-blue-500 cursor-pointer transition"
          />
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
          Analytics Integrations
        </h1>

        {providers.map((provider) => (
          <Card key={provider.id} provider={provider} />
        ))}
      </div>
    </>
  );
};

export default AnalyticsIntegration;