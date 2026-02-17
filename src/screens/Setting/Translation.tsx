import React, { useState } from "react";
import { FaSearch, FaChevronDown, FaSave } from "react-icons/fa";

interface TranslationItem {
  key: string;
  defaultText: string;
  translatedText: string;
}

const Translation = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [translations, setTranslations] = useState<TranslationItem[]>([
    { key: "login_button", defaultText: "Login", translatedText: "" },
    { key: "signup_button", defaultText: "Sign Up", translatedText: "" },
    { key: "logout_button", defaultText: "Logout", translatedText: "" },
    { key: "profile_label", defaultText: "Profile", translatedText: "" },
    { key: "settings_label", defaultText: "Settings", translatedText: "" },
  ]);

  const handleChange = (index: number, value: string) => {
    const updated = [...translations];
    updated[index].translatedText = value;
    setTranslations(updated);
  };

  const handleSave = () => {
    console.log("Saved translations:", translations);
    setShowSuccessModal(true);
    setTimeout(() => setShowSuccessModal(false), 2000);
  };

  const filteredTranslations = translations.filter(item => 
    item.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.defaultText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <h2 className="text-lg font-semibold mb-6">Translations</h2>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        {/* Language Dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Language:</label>
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="border-2 border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm outline-none focus:ring-2 focus:ring-teal-400 bg-white"
            >
              <option>English</option>
              <option>Urdu</option>
              <option>French</option>
            </select>
            <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border-2 border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border-2  border-gray-100 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-3 bg-gradient-to-r from-teal-500 to-green-500 text-white px-4 py-3 text-sm font-bold border-b border-gray-200">
          <div>Key</div>
          <div>Default</div>
          <div>Translation</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-100">
          {filteredTranslations.map((item, index) => (
            <div key={index} className="grid grid-cols-3 items-center gap-4 px-4 py-3">
              <div className="text-sm text-gray-700">{item.key}</div>
              <div className="text-sm text-gray-600">{item.defaultText}</div>
              <input
                type="text"
                value={item.translatedText}
                onChange={(e) => handleChange(index, e.target.value)}
                placeholder={`Translate`}
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-xl hover:from-teal-600 hover:to-green-600 transition-all font-medium shadow-md"
        >
          <FaSave size={14} />
          Save
        </button>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl p-6 w-80 text-center shadow-2xl animate-fadeIn">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-teal-500 to-green-500 flex items-center justify-center text-white text-3xl">
              ✓
            </div>
            <h3 className="text-lg font-semibold mb-1">Saved!</h3>
            <p className="text-sm text-gray-500">Translations updated</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Translation;