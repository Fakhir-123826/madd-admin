import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCirclePlus } from "react-icons/fa6";
import { ArrowLeft, X, ChevronDown, ChevronUp } from "lucide-react";

interface FormData {
  providerName: string;
  apiKey: string;
  accountNumber: string;
  region: string;
  shippingRule: "flat" | "weight" | "free";
  flatRate: string;
  status: boolean;
  mode: boolean;
}

interface Zone {
  id: string;
  zoneName: string;
  country: string;
  rule: string;
  cost: string;
  status: "Active" | "Inactive";
}

const AddShipRocket: React.FC = () => {
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showZoneSection, setShowZoneSection] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    providerName: "Shiprocket",
    apiKey: "",
    accountNumber: "",
    region: "",
    shippingRule: "flat",
    flatRate: "",
    status: true,
    mode: true,
  });

  const [zones, setZones] = useState<Zone[]>([
    {
      id: "1",
      zoneName: "North Zone",
      country: "Punjab, PK",
      rule: "Weight-based",
      cost: "<5kg = Rs. 300",
      status: "Active",
    },
    {
      id: "2",
      zoneName: "Central Zone",
      country: "Sindh, PK",
      rule: "Flat rate",
      cost: "Rs. 500",
      status: "Active",
    },
  ]);

  const [newZone, setNewZone] = useState({
    zoneName: "",
    country: "",
    rule: "flat",
    weight: "",
    price: "",
    status: true,
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const toggleStatus = () => {
    setFormData((prev) => ({ ...prev, status: !prev.status }));
  };

  const toggleMode = () => {
    setFormData((prev) => ({ ...prev, mode: !prev.mode }));
  };

  const setRule = (rule: "flat" | "weight" | "free") => {
    setFormData((prev) => ({ ...prev, shippingRule: rule }));
  };

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.apiKey.trim()) {
      newErrors.apiKey = "API Key is required";
    }
    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = "Account Number is required";
    }
    if (!formData.region) {
      newErrors.region = "Region is required";
    }
    if (formData.shippingRule === "flat" && !formData.flatRate) {
      newErrors.flatRate = "Flat rate is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Saving Shiprocket provider:", {
        ...formData,
        status: formData.status ? "Active" : "Inactive",
        mode: formData.mode ? "Global" : "Local",
        zones: zones,
      });

      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
        navigate("/shipping-mangement");
      }, 2000);
    }
  };

  const handleCancel = () => {
    navigate("/shipping-mangement");
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate("/shipping-mangement");
  };

  const toggleZoneSection = () => {
    setShowZoneSection(!showZoneSection);
  };

  const handleZoneChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewZone((prev) => ({ ...prev, [name]: value }));
  };

  const handleZoneRuleChange = (rule: string) => {
    setNewZone((prev) => ({ ...prev, rule }));
  };

  const toggleZoneStatus = () => {
    setNewZone((prev) => ({ ...prev, status: !prev.status }));
  };

  const handleAddZone = () => {
    const newZoneData: Zone = {
      id: Date.now().toString(),
      zoneName: newZone.zoneName || "New Zone",
      country: newZone.country || "Default",
      rule: newZone.rule === "weight" ? "Weight-based" : 
            newZone.rule === "flat" ? "Flat rate" : "Free",
      cost: newZone.rule === "weight" ? `${newZone.weight} = ${newZone.price}` : 
            newZone.rule === "flat" ? `${newZone.price}` : "Free",
      status: newZone.status ? "Active" : "Inactive",
    };

    setZones([...zones, newZoneData]);
    setNewZone({
      zoneName: "",
      country: "",
      rule: "flat",
      weight: "",
      price: "",
      status: true,
    });
  };

  const handleDeleteZone = (id: string) => {
    setZones(zones.filter(zone => zone.id !== id));
  };

  return (
    <div className="min-h-screen bg-white rounded-xl p-4 md:p-8">
      <div className="w-full">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-teal-500 to-green-500 px-6 py-4 rounded-t-2xl flex items-center gap-4 shadow-lg">
          <button
            onClick={handleCancel}
            className="text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-200"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-white font-semibold text-xl tracking-wide flex items-center gap-2">
            Add Shiprocket Provider
          </h1>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-b-2xl shadow-xl p-6 md:p-8 border-x border-b border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Provider Information */}
            <div>
              <h2 className="text-lg font-semibold mb-5 flex items-center gap-2 text-gray-800">
                <span className="w-1 h-6 bg-teal-500 rounded-full"></span>
                Provider Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Provider Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Provider Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="providerName"
                      value={formData.providerName}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white appearance-none"
                    >
                      <option value="Shiprocket">Shiprocket</option>
                      <option value="DHL">DHL</option>
                      <option value="FedEx">FedEx</option>
                      <option value="Aramex">Aramex</option>
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      ▼
                    </span>
                  </div>
                </div>

                {/* Region */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Region <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      className={`w-full border-2 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white appearance-none ${
                        errors.region ? "border-red-500" : "border-gray-200"
                      }`}
                    >
                      <option value="">Select region</option>
                      <option value="Global">Global</option>
                      <option value="Asia">Asia</option>
                      <option value="Europe">Europe</option>
                      <option value="USA">USA</option>
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      ▼
                    </span>
                  </div>
                  {errors.region && (
                    <p className="text-red-500 text-xs mt-1">{errors.region}</p>
                  )}
                </div>

                {/* API Key */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">
                    API Key <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="apiKey"
                      value={formData.apiKey}
                      onChange={handleChange}
                      placeholder="Enter API key"
                      className={`w-full border-2 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white ${
                        errors.apiKey ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                    {formData.apiKey && !errors.apiKey && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">✓</span>
                    )}
                  </div>
                  {errors.apiKey && (
                    <p className="text-red-500 text-xs mt-1">{errors.apiKey}</p>
                  )}
                </div>

                {/* Account Number */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Account Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      placeholder="Enter account number"
                      className={`w-full border-2 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white ${
                        errors.accountNumber ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                    {formData.accountNumber && !errors.accountNumber && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">✓</span>
                    )}
                  </div>
                  {errors.accountNumber && (
                    <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Add Zone Button with Dropdown */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={toggleZoneSection}
                className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-gray-700 flex items-center gap-2"><FaCirclePlus color="green" size={20}/> Zones & Rules</span>
                {showZoneSection ? (
                  <ChevronUp className="text-gray-500" size={20} />
                ) : (
                  <ChevronDown className="text-gray-500" size={20} />
                )}
              </button>

              {/* Expandable Zone Section */}
              {showZoneSection && (
                <div className="p-6 border-t border-gray-200">
                  {/* Existing Zones List */}
                  {zones.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">Existing Zones</h3>
                      <div className="space-y-2">
                        {zones.map((zone) => (
                          <div key={zone.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-800">{zone.zoneName}</p>
                              <p className="text-xs text-gray-500">{zone.country} • {zone.rule} • {zone.cost}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                zone.status === "Active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                              }`}>
                                {zone.status}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDeleteZone(zone.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add New Zone Form */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Add New Zone</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="zoneName"
                        value={newZone.zoneName}
                        onChange={handleZoneChange}
                        placeholder="Zone Name"
                        className="border-2 border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none"
                      />
                      <input
                        type="text"
                        name="country"
                        value={newZone.country}
                        onChange={handleZoneChange}
                        placeholder="Country / State"
                        className="border-2 border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none"
                      />

                      {/* Rule Selection */}
                      <div className="col-span-2">
                        <div className="flex gap-4">
                          {["flat", "weight", "free"].map((rule) => (
                            <button
                              key={rule}
                              type="button"
                              onClick={() => handleZoneRuleChange(rule)}
                              className={`px-4 py-2 rounded-lg border-2 font-medium transition ${
                                newZone.rule === rule
                                  ? "bg-teal-500 text-white border-teal-500"
                                  : "bg-white text-gray-700 border-gray-200 hover:border-teal-400"
                              }`}
                            >
                              {rule === "flat" ? "Flat Rate" : rule === "weight" ? "Weight Based" : "Free"}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Weight & Price */}
                      {newZone.rule === "weight" && (
                        <>
                          <input
                            type="text"
                            name="weight"
                            value={newZone.weight}
                            onChange={handleZoneChange}
                            placeholder="Weight (e.g., <5kg)"
                            className="border-2 border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none"
                          />
                          <input
                            type="text"
                            name="price"
                            value={newZone.price}
                            onChange={handleZoneChange}
                            placeholder="Price (e.g., Rs. 300)"
                            className="border-2 border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none"
                          />
                        </>
                      )}

                      {/* Price for Flat Rate */}
                      {newZone.rule === "flat" && (
                        <div className="col-span-2">
                          <input
                            type="text"
                            name="price"
                            value={newZone.price}
                            onChange={handleZoneChange}
                            placeholder="Price (e.g., Rs. 500)"
                            className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none"
                          />
                        </div>
                      )}

                      {/* Status Toggle */}
                      <div className="col-span-2 flex items-center gap-4">
                        <span className="text-sm font-medium">Status</span>
                        <button
                          type="button"
                          onClick={toggleZoneStatus}
                          className={`relative w-12 h-6 rounded-full transition ${
                            newZone.status ? "bg-teal-500" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                              newZone.status ? "right-1" : "left-1"
                            }`}
                          />
                        </button>
                        <span className="text-sm">{newZone.status ? "Active" : "Inactive"}</span>
                      </div>

                      {/* Add Zone Button */}
                      <div className="col-span-2">
                        <button
                          type="button"
                          onClick={handleAddZone}
                          className="w-full py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition font-medium"
                        >
                          Add Zone
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Shipping Rule */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                Shipping Rule
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <button
                  type="button"
                  onClick={() => setRule("flat")}
                  className={`w-full py-3 rounded-xl border-2 font-semibold transition-all duration-300 ${
                    formData.shippingRule === "flat"
                      ? "bg-teal-500 text-white border-teal-500 shadow-md"
                      : "bg-white text-gray-700 border-gray-200 hover:border-teal-400"
                  }`}
                >
                  Flat Rate
                </button>

                <button
                  type="button"
                  onClick={() => setRule("weight")}
                  className={`w-full py-3 rounded-xl border-2 font-semibold transition-all duration-300 ${
                    formData.shippingRule === "weight"
                      ? "bg-teal-500 text-white border-teal-500 shadow-md"
                      : "bg-white text-gray-700 border-gray-200 hover:border-teal-400"
                  }`}
                >
                  Weight Based
                </button>

                <button
                  type="button"
                  onClick={() => setRule("free")}
                  className={`w-full py-3 rounded-xl border-2 font-semibold transition-all duration-300 ${
                    formData.shippingRule === "free"
                      ? "bg-teal-500 text-white border-teal-500 shadow-md"
                      : "bg-white text-gray-700 border-gray-200 hover:border-teal-400"
                  }`}
                >
                  Free Shipping
                </button>
              </div>

              {/* Flat Rate Input */}
              {formData.shippingRule === "flat" && (
                <div className="mt-4">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Flat Rate Amount <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="flatRate"
                      value={formData.flatRate}
                      onChange={handleChange}
                      placeholder="e.g., $10"
                      className={`w-full border-2 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white ${
                        errors.flatRate ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                  </div>
                  {errors.flatRate && (
                    <p className="text-red-500 text-xs mt-1">{errors.flatRate}</p>
                  )}
                </div>
              )}
            </div>

            {/* Status Toggle */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                Status
              </h2>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 w-fit">
                <span className={`text-sm font-medium ${!formData.status ? 'text-red-600' : 'text-gray-500'}`}>
                  Inactive
                </span>
                
                <button
                  type="button"
                  onClick={toggleStatus}
                  className={`relative w-14 h-7 flex items-center rounded-full p-1 transition-all duration-300 ${
                    formData.status ? "bg-teal-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                      formData.status ? "translate-x-7" : "translate-x-0"
                    }`}
                  />
                </button>
                
                <span className={`text-sm font-medium ${formData.status ? 'text-teal-600' : 'text-gray-500'}`}>
                  Active
                </span>
              </div>
            </div>

            {/* Mode Toggle */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                Mode
              </h2>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 w-fit">
                <span className={`text-sm font-medium ${!formData.mode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Local
                </span>
                
                <button
                  type="button"
                  onClick={toggleMode}
                  className={`relative w-14 h-7 flex items-center rounded-full p-1 transition-all duration-300 ${
                    formData.mode ? "bg-teal-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                      formData.mode ? "translate-x-7" : "translate-x-0"
                    }`}
                  />
                </button>
                
                <span className={`text-sm font-medium ${formData.mode ? 'text-teal-600' : 'text-gray-500'}`}>
                  Global
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 px-8 py-3.5 border-2 border-red-500 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 font-medium"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-xl hover:from-teal-600 hover:to-green-600 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
              >
                Save Provider
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-8 w-[450px] text-center relative shadow-2xl animate-fadeIn">
            <button
              onClick={handleCloseSuccessModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-r from-teal-500 to-green-500 flex items-center justify-center text-white text-4xl shadow-lg">
              ✓
            </div>

            <h2 className="text-2xl font-bold mb-3 text-gray-800">
              Provider Added!
            </h2>
            
            <p className="text-gray-600 mb-2 text-lg font-normal">
              <span className="font-semibold text-teal-600">Shiprocket</span> has been successfully added.
            </p>

            <div className="w-full bg-gray-200 h-1 rounded-full mt-4 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-green-500 h-1 rounded-full animate-progress" />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-progress {
          animation: progress 2s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AddShipRocket;