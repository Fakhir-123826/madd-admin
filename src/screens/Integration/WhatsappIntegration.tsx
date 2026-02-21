import React, { useState } from "react";
import { FiEdit, FiCheckCircle } from "react-icons/fi";
import { HiOutlineCheckCircle } from "react-icons/hi";
import { FaRegCopy } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { BsWhatsapp } from "react-icons/bs";

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

interface ChatConfig {
  id: string;
  provider: string;
  enabled: boolean;
  chatProvider: string;
  widgetId: string;
  widgetScript: string;
  status: "connected" | "disconnected" | "error";
  position: "bottom-right" | "bottom-left";
  widgetColor: string;
  greetingMessage: string;
}

const WhatsappIntegration = () => {
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Chat providers state
  const [providers, setProviders] = useState<ChatConfig[]>([
    {
      id: "whatsapp-1",
      provider: "Whatsapp",
      enabled: true,
      chatProvider: "Whatsapp",
      widgetId: "WIDGET-12345",
      widgetScript: "TXN-20250715-00087",
      status: "connected",
      position: "bottom-right",
      widgetColor: "#EF4444", // red-600
      greetingMessage: "Hello! How can we help you today?",
    },
  ]);

  // Edit states
  const [editingWidgetId, setEditingWidgetId] = useState<{ [key: string]: boolean }>({});
  const [editingWidgetScript, setEditingWidgetScript] = useState<{ [key: string]: boolean }>({});
  const [editingGreeting, setEditingGreeting] = useState<{ [key: string]: boolean }>({});

  // Color picker state
  const [showColorPicker, setShowColorPicker] = useState<{ [key: string]: boolean }>({});

  const colorOptions = [
    { name: 'red', color: '#EF4444' },
    { name: 'blue', color: '#3B82F6' },
    { name: 'purple', color: '#8B5CF6' },
    { name: 'green', color: '#10B981' },
    { name: 'orange', color: '#F97316' },
    { name: 'pink', color: '#EC4899' },
  ];

  const handleSaveChanges = (providerId: string) => {
    setModalMessage(`Whatsapp integration settings saved successfully!`);
    setModalOpen(true);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setModalMessage("Copied to clipboard!");
    setModalOpen(true);
  };

  const updateProvider = (id: string, updates: Partial<ChatConfig>) => {
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

  const Card = ({ provider }: { provider: ChatConfig }) => (
    <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-100 hover:shadow-lg transition">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xl">
            <BsWhatsapp />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {provider.provider} Integration
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Chat Integration</p>
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

      {/* Grid - 3 Columns */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Chat Provider */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Chat Provider:</p>
          <p className="text-sm text-gray-800 font-medium">{provider.chatProvider}</p>
        </div>

        {/* Widget ID */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Widget ID:</p>
          <div className="flex items-center gap-2">
            {editingWidgetId[provider.id] ? (
              <input
                autoFocus
                value={provider.widgetId}
                onChange={(e) => updateProvider(provider.id, { widgetId: e.target.value })}
                onBlur={() => setEditingWidgetId({ ...editingWidgetId, [provider.id]: false })}
                onKeyDown={(e) => e.key === "Enter" && setEditingWidgetId({ ...editingWidgetId, [provider.id]: false })}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <p className="text-sm text-gray-800 font-medium">{provider.widgetId}</p>
            )}
            <FiEdit
              onClick={() => setEditingWidgetId({ ...editingWidgetId, [provider.id]: true })}
              className="text-gray-400 hover:text-blue-500 cursor-pointer transition"
            />
            <FaRegCopy
              onClick={() => handleCopy(provider.widgetId)}
              className="text-gray-400 hover:text-blue-500 cursor-pointer transition"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Status</p>
          {getStatusBadge(provider.status)}
        </div>

        {/* Widget Script */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Widget Script:</p>
          <div className="flex items-center gap-2">
            {editingWidgetScript[provider.id] ? (
              <input
                autoFocus
                value={provider.widgetScript}
                onChange={(e) => updateProvider(provider.id, { widgetScript: e.target.value })}
                onBlur={() => setEditingWidgetScript({ ...editingWidgetScript, [provider.id]: false })}
                onKeyDown={(e) => e.key === "Enter" && setEditingWidgetScript({ ...editingWidgetScript, [provider.id]: false })}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <p className="text-sm text-gray-800 font-medium">{provider.widgetScript}</p>
            )}
            <FiEdit
              onClick={() => setEditingWidgetScript({ ...editingWidgetScript, [provider.id]: true })}
              className="text-gray-400 hover:text-blue-500 cursor-pointer transition"
            />
            <FaRegCopy
              onClick={() => handleCopy(provider.widgetScript)}
              className="text-gray-400 hover:text-blue-500 cursor-pointer transition"
            />
          </div>
        </div>
      </div>

      {/* Position */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-3">Position</p>
        <div className="flex items-center gap-6 text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={`position-${provider.id}`}
              checked={provider.position === "bottom-right"}
              onChange={() => updateProvider(provider.id, { position: "bottom-right" })}
              className="w-4 h-4 accent-blue-500"
            />
            <span className="text-gray-700">Bottom right</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={`position-${provider.id}`}
              checked={provider.position === "bottom-left"}
              onChange={() => updateProvider(provider.id, { position: "bottom-left" })}
              className="w-4 h-4 accent-blue-500"
            />
            <span className="text-gray-700">Bottom left</span>
          </label>
        </div>
      </div>

      {/* Widget Color & Greeting */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Widget Color */}
        <div>
          <p className="text-sm text-gray-500 mb-2">Widget Color:</p>
          
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="w-16 h-8 rounded-lg shadow-sm" 
              style={{ backgroundColor: provider.widgetColor }}
            ></div>

            <select 
              value={provider.widgetColor}
              onChange={(e) => updateProvider(provider.id, { widgetColor: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {colorOptions.map((option) => (
                <option key={option.name} value={option.color}>
                  {option.name.charAt(0).toUpperCase() + option.name.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Color Options */}
          <div className="flex items-center gap-2">
            {colorOptions.map((option) => (
              <button
                key={option.name}
                onClick={() => updateProvider(provider.id, { widgetColor: option.color })}
                className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${
                  provider.widgetColor === option.color ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                }`}
                style={{ backgroundColor: option.color }}
                title={option.name}
              />
            ))}
            <button
              onClick={() => setShowColorPicker({ ...showColorPicker, [provider.id]: !showColorPicker[provider.id] })}
              className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 hover:bg-gray-300 transition"
              title="Custom color"
            >
              +
            </button>
          </div>

          {/* Custom Color Picker */}
          {showColorPicker[provider.id] && (
            <div className="mt-3">
              <input
                type="color"
                value={provider.widgetColor}
                onChange={(e) => updateProvider(provider.id, { widgetColor: e.target.value })}
                className="w-full h-10 rounded-lg cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Greeting Message */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Greeting Message:</p>
          <div className="flex items-center gap-2">
            {editingGreeting[provider.id] ? (
              <input
                autoFocus
                value={provider.greetingMessage}
                onChange={(e) => updateProvider(provider.id, { greetingMessage: e.target.value })}
                onBlur={() => setEditingGreeting({ ...editingGreeting, [provider.id]: false })}
                onKeyDown={(e) => e.key === "Enter" && setEditingGreeting({ ...editingGreeting, [provider.id]: false })}
                className="text-sm border border-gray-300 rounded px-2 py-1 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <p className="text-sm text-gray-800 font-medium flex-1">{provider.greetingMessage}</p>
            )}
            <FiEdit
              onClick={() => setEditingGreeting({ ...editingGreeting, [provider.id]: true })}
              className="text-gray-400 hover:text-blue-500 cursor-pointer transition"
            />
            <FaRegCopy
              onClick={() => handleCopy(provider.greetingMessage)}
              className="text-gray-400 hover:text-blue-500 cursor-pointer transition"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-8">
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
          Chat Integrations
        </h1>

        {providers.map((provider) => (
          <Card key={provider.id} provider={provider} />
        ))}
      </div>
    </>
  );
};

export default WhatsappIntegration;