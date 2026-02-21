import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { HiOutlineCheckCircle } from "react-icons/hi";

const SocialLoginIntegration: React.FC = () => {
  const [googleEnabled, setGoogleEnabled] = useState(true);
  const [facebookEnabled, setFacebookEnabled] = useState(true);

  const Card = ({
    icon,
    title,
    enabled,
    setEnabled,
  }: {
    icon: React.ReactNode;
    title: string;
    enabled: boolean;
    setEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    const [clientId, setClientId] = useState("TXN-20250715-00087");
    const [clientSecret, setClientSecret] = useState("12345678901234567890");

    const [editClientId, setEditClientId] = useState(false);
    const [editSecret, setEditSecret] = useState(false);

    return (
      <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-100 hover:shadow-lg transition">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{icon}</div>
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
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

        {/* Content */}
        <div className="grid grid-cols-3 gap-6 items-center">
          {/* Client ID */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Client ID:</p>
            <div className="flex items-center gap-2">
              {editClientId ? (
                <input
                  autoFocus
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  onBlur={() => setEditClientId(false)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && setEditClientId(false)
                  }
                  className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              ) : (
                <p className="text-sm text-gray-800 font-medium">
                  {clientId}
                </p>
              )}

              <FiEdit
                onClick={() => setEditClientId(true)}
                className="text-gray-400 hover:text-blue-500 cursor-pointer transition"
              />
            </div>
          </div>

          {/* Client Secret */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Client Secret:</p>
            <div className="flex items-center gap-2">
              {editSecret ? (
                <input
                  autoFocus
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  onBlur={() => setEditSecret(false)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && setEditSecret(false)
                  }
                  className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              ) : (
                <p className="text-sm text-gray-800 font-medium tracking-wider">
                  {"*".repeat(clientSecret.length)}
                </p>
              )}

              <FiEdit
                onClick={() => setEditSecret(true)}
                className="text-gray-400 hover:text-blue-500 cursor-pointer transition"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Status</p>
            <span className="inline-flex items-center gap-1 bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full font-medium">
              <HiOutlineCheckCircle />
              Connected
            </span>
          </div>
        </div>

        {/* Redirect URI */}
        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-1">Redirect URI:</p>
          <div className="bg-gray-50 border rounded-md px-3 py-2 text-sm text-gray-700">
            yoursite.com/auth/{title.toLowerCase()}/callback
          </div>
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
        Social Login Integrations
      </h1>

      <Card
        icon={<FcGoogle />}
        title="Google"
        enabled={googleEnabled}
        setEnabled={setGoogleEnabled}
      />

      <Card
        icon={<FaFacebookF className="text-blue-600" />}
        title="Facebook"
        enabled={facebookEnabled}
        setEnabled={setFacebookEnabled}
      />
    </div>
  );
};

export default SocialLoginIntegration;