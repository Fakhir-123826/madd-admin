import React, { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { HiOutlineCheckCircle } from "react-icons/hi";
import { SiStripe } from "react-icons/si";

const PaymentGatewayIntegration: React.FC = () => {
  const [stripeEnabled1, setStripeEnabled1] = useState(true);
  const [stripeEnabled2, setStripeEnabled2] = useState(true);
  const [mode1, setMode1] = useState<"sandbox" | "live">("sandbox");
  const [mode2, setMode2] = useState<"sandbox" | "live">("sandbox");

  const Card = ({
    title,
    enabled,
    setEnabled,
    mode,
    setMode,
  }: {
    title: string;
    enabled: boolean;
    setEnabled: React.Dispatch<React.SetStateAction<boolean>>;
    mode: "sandbox" | "live";
    setMode: React.Dispatch<React.SetStateAction<"sandbox" | "live">>;
  }) => {
    const [apiKey, setApiKey] = useState("TXN-20250715-00087");
    const [apiSecret, setApiSecret] = useState("12345678901234567890");
    const [currency, setCurrency] = useState("USDT");

    const [editApiKey, setEditApiKey] = useState(false);
    const [editApiSecret, setEditApiSecret] = useState(false);

    return (
      <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-100 hover:shadow-lg transition">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl text-indigo-600">
              <SiStripe />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 lowercase">
              {title}
            </h2>
          </div>

          {/* Toggle */}
          <button
            onClick={() => setEnabled(!enabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition duration-300 ${
              enabled ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-300 ${
                enabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Content - API Row */}
        <div className="grid grid-cols-3 gap-6 items-center mb-6">
          {/* API Key */}
          <div>
            <p className="text-sm text-gray-500 mb-1">API Key:</p>
            <div className="flex items-center gap-2">
              {editApiKey ? (
                <input
                  autoFocus
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  onBlur={() => setEditApiKey(false)}
                  onKeyDown={(e) => e.key === "Enter" && setEditApiKey(false)}
                  className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              ) : (
                <p className="text-sm text-gray-800 font-medium">{apiKey}</p>
              )}
              <FiEdit
                onClick={() => setEditApiKey(true)}
                className="text-gray-400 hover:text-blue-500 cursor-pointer transition"
              />
            </div>
          </div>

          {/* API Secret */}
          <div>
            <p className="text-sm text-gray-500 mb-1">API Secret:</p>
            <div className="flex items-center gap-2">
              {editApiSecret ? (
                <input
                  autoFocus
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  onBlur={() => setEditApiSecret(false)}
                  onKeyDown={(e) => e.key === "Enter" && setEditApiSecret(false)}
                  className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              ) : (
                <p className="text-sm text-gray-800 font-medium tracking-wider">
                  {"*".repeat(apiSecret.length)}
                </p>
              )}
              <FiEdit
                onClick={() => setEditApiSecret(true)}
                className="text-gray-400 hover:text-blue-500 cursor-pointer transition"
              />
            </div>
          </div>

          {/* Currency */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Currency:</p>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option>USDT</option>
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
            </select>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-6 mb-6">
          <p className="text-sm font-medium text-gray-700">Mode</p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode(mode === "sandbox" ? "live" : "sandbox")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition duration-300 ${
                mode === "sandbox" ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-300 ${
                  mode === "sandbox" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`text-sm ${
                mode === "sandbox" ? "text-blue-600 font-medium" : "text-gray-500"
              }`}
            >
              Sandbox
            </span>
          </div>

          <span
            className={`text-sm ${
              mode === "live" ? "text-blue-600 font-medium" : "text-gray-400"
            }`}
          >
            Live
          </span>
        </div>

        {/* URLs */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Callback URL:</p>
            <div className="bg-gray-50 border rounded-md px-3 py-2 text-sm text-gray-700">
              yoursite.com/auth/stripe/callback
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Webhook URL:</p>
            <div className="bg-gray-50 border rounded-md px-3 py-2 text-sm text-gray-700">
              yoursite.com/webhooks/stripe
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-1">Status</p>
          <span className="inline-flex items-center gap-1 bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full font-medium">
            <HiOutlineCheckCircle />
            Connected
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between mt-6">
          <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg transition">
            Test Connection
          </button>

          <button className="flex items-center gap-2 bg-lime-500 hover:bg-lime-600 text-white text-sm px-5 py-2 rounded-lg transition shadow">
            <HiOutlineCheckCircle size={30} className="text-lg" />
            Save Changes
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-200 rounded-xl min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Payment Gateway Integrations
      </h1>

      <Card
        title="stripe"
        enabled={stripeEnabled1}
        setEnabled={setStripeEnabled1}
        mode={mode1}
        setMode={setMode1}
      />

      <Card
        title="stripe"
        enabled={stripeEnabled2}
        setEnabled={setStripeEnabled2}
        mode={mode2}
        setMode={setMode2}
      />
    </div>
  );
};

export default PaymentGatewayIntegration;