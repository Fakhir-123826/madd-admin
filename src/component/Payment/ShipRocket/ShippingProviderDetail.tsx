import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiEdit2, FiTrash2, FiArrowLeft, FiPlus, FiX } from "react-icons/fi";
import ShipRocket from "../../../../public/shiprocket.webp";

interface Zone {
  id: string;
  zoneName: string;
  country: string;
  rule: string;
  cost: string;
  status: "Active" | "Inactive";
}

const ShippingProviderDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const provider = location.state?.provider;

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [showZoneDeleteModal, setShowZoneDeleteModal] = useState(false);
  const [showZoneSuccessModal, setShowZoneSuccessModal] = useState(false);
  
  // Selected zone for delete
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  
  // Zones Data
  const [zones, setZones] = useState<Zone[]>([
    {
      id: "1",
      zoneName: "Pakistan",
      country: "Punjab, PK",
      rule: "Weight-based",
      cost: "<5kg = Rs. 300",
      status: "Active",
    },
    {
      id: "2",
      zoneName: "Pakistan",
      country: "Punjab, PK",
      rule: "Weight-based",
      cost: "<5kg = Rs. 300",
      status: "Active",
    },
    {
      id: "3",
      zoneName: "Pakistan",
      country: "Punjab, PK",
      rule: "Weight-based",
      cost: "<5kg = Rs. 300",
      status: "Active",
    },
  ]);

  // New zone form state
  const [newZone, setNewZone] = useState({
    zoneName: "",
    country: "",
    rule: "flat",
    weight: "",
    price: "",
    status: true,
  });

  if (!provider) {
    navigate("/shipping-mangement");
    return null;
  }

  const handleBack = () => {
    navigate("/shipping-mangement");
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    setShowSuccessModal(true);

    setTimeout(() => {
      setShowSuccessModal(false);
      navigate("/shipping-mangement");
    }, 2000);
  };

  const handleZoneDeleteClick = (zone: Zone) => {
    setSelectedZone(zone);
    setShowZoneDeleteModal(true);
  };

  const handleConfirmZoneDelete = () => {
    if (selectedZone) {
      setZones(zones.filter(z => z.id !== selectedZone.id));
      setShowZoneDeleteModal(false);
      setShowZoneSuccessModal(true);
      
      setTimeout(() => {
        setShowZoneSuccessModal(false);
        setSelectedZone(null);
      }, 2000);
    }
  };

  const handleAddZone = () => {
    setShowZoneModal(true);
  };

  const handleZoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
    setShowZoneModal(false);
    setNewZone({
      zoneName: "",
      country: "",
      rule: "flat",
      weight: "",
      price: "",
      status: true,
    });
  };

  const handleTestConnection = () => {
    alert("Connection test successful! (Demo)");
  };

  return (
    <div className="p-6 bg-white rounded-xl min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-200 rounded-lg transition"
        >
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">
          Shipping Provider Management
        </h1>
      </div>

      {/* Provider Details Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-teal-400 to-green-400 px-6 py-4 flex items-center gap-3">
          <img
            src={ShipRocket}
            alt="ShipRocket"
            className="w-8 h-8 object-contain bg-white rounded-full p-1"
          />
          <h2 className="text-white font-semibold text-lg">
            Provider Details
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 bg-gray-50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-10 text-sm">
            <div>
              <p className="text-gray-500">Provider Name</p>
              <p className="font-medium text-gray-800 mt-1">
                {provider.name}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Type</p>
              <p className="font-medium text-gray-800 mt-1">
                {provider.type}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Mode</p>
              <p className="font-medium text-gray-800 mt-1">
                {provider.mode}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Update Status</p>
              <span
                className={`inline-block mt-2 px-4 py-1 rounded-full text-xs font-medium ${
                  provider.status === "Active"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {provider.status}
              </span>
            </div>

            <div>
              <p className="text-gray-500">Region</p>
              <p className="font-medium text-gray-800 mt-1">
                Europe and Asia
              </p>
            </div>

            <div>
              <p className="text-gray-500">Account Number</p>
              <p className="font-medium text-gray-800 mt-1">
                2473456757
              </p>
            </div>

            <div>
              <p className="text-gray-500">API Key</p>
              <p className="font-medium text-gray-800 mt-1">
                #768usgd46
              </p>
            </div>
          </div>

          <div className="mt-6 text-xs text-gray-500">
            Last updated: 23 July 2025
          </div>

          {/* Buttons */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={handleTestConnection}
              className="px-5 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition"
            >
              Test Connection
            </button>

            <div className="flex gap-3">
              <button
                onClick={handleDeleteClick}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition"
              >
                <FiTrash2 size={16} />
                Delete Provider
              </button>

              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition">
                <FiEdit2 size={16} />
                Edit provider
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Zones & Rules Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-400 to-green-400 px-6 py-4 flex items-center justify-between">
          <h2 className="text-white font-semibold text-lg">
            Zones & Rules
          </h2>

          <button
            onClick={handleAddZone}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-lg transition"
          >
            <FiPlus size={16} />
            Add new zone
          </button>
        </div>

        {/* Table */}
        <div className="p-6 bg-gray-50">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-4 py-3">Zone Name</th>
                  <th className="px-4 py-3">Countries / States</th>
                  <th className="px-4 py-3">Rule Type</th>
                  <th className="px-4 py-3">Cost/Condition</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {zones.map((zone) => (
                  <tr key={zone.id} className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {zone.zoneName}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {zone.country}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {zone.rule}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {zone.cost}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600 font-medium">
                        {zone.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-3">
                        <button className="text-blue-500 hover:text-blue-700">
                          <FiEdit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleZoneDeleteClick(zone)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Zone Modal */}
      {showZoneModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl w-[500px] max-h-[90vh] overflow-y-auto p-6 relative">
            
            <button
              onClick={() => setShowZoneModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <FiX size={20} />
            </button>

            <h2 className="text-xl font-semibold mb-6">Add New Zone</h2>

            <form onSubmit={handleZoneSubmit} className="space-y-4">
              {/* Zone Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Zone Name
                </label>
                <input
                  type="text"
                  value={newZone.zoneName}
                  onChange={(e) => setNewZone({...newZone, zoneName: e.target.value})}
                  placeholder="e.g., North Zone"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-400 outline-none"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Country / State
                </label>
                <input
                  type="text"
                  value={newZone.country}
                  onChange={(e) => setNewZone({...newZone, country: e.target.value})}
                  placeholder="e.g., Punjab, PK"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-400 outline-none"
                />
              </div>

              {/* Rule Type */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Rule Type
                </label>
                <div className="flex gap-4">
                  {[
                    { value: "flat", label: "Flat rate" },
                    { value: "weight", label: "Weight based" },
                    { value: "free", label: "Free" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setNewZone({...newZone, rule: option.value})}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                        newZone.rule === option.value
                          ? "bg-teal-500 text-white border-teal-500"
                          : "bg-white text-gray-700 border-gray-300 hover:border-teal-400"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weight & Price (if weight based) */}
              {newZone.rule === "weight" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Weight
                    </label>
                    <input
                      type="text"
                      value={newZone.weight}
                      onChange={(e) => setNewZone({...newZone, weight: e.target.value})}
                      placeholder="e.g., <5kg"
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Price
                    </label>
                    <input
                      type="text"
                      value={newZone.price}
                      onChange={(e) => setNewZone({...newZone, price: e.target.value})}
                      placeholder="e.g., Rs. 300"
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-400 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Price for flat rate */}
              {newZone.rule === "flat" && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price
                  </label>
                  <input
                    type="text"
                    value={newZone.price}
                    onChange={(e) => setNewZone({...newZone, price: e.target.value})}
                    placeholder="e.g., Rs. 500"
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-400 outline-none"
                  />
                </div>
              )}

              {/* Status Toggle */}
              <div className="flex items-center gap-4 py-2">
                <span className="text-sm font-medium">Status</span>
                <button
                  type="button"
                  onClick={() => setNewZone({...newZone, status: !newZone.status})}
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
                <span className="text-sm">
                  {newZone.status ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowZoneModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                >
                  Add Zone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Provider Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-8 w-[400px] text-center relative shadow-2xl">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <FiX size={20} />
            </button>

            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-red-100 flex items-center justify-center">
              <FiTrash2 className="text-red-500" size={40} />
            </div>

            <p className="text-gray-700 text-lg font-bold mb-2">
              Are you sure want to delete this Provider?
            </p>

            <div className="flex gap-4 justify-center mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                No
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Zone Modal */}
      {showZoneDeleteModal && selectedZone && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-8 w-[400px] text-center relative shadow-2xl">
            <button
              onClick={() => setShowZoneDeleteModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <FiX size={20} />
            </button>

            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-red-100 flex items-center justify-center">
              <FiTrash2 className="text-red-500" size={40} />
            </div>

            <p className="text-gray-700 text-lg font-bold mb-2">
              Delete this Zone?
            </p>
            <p className="text-gray-500 text-sm mb-4">
              Are you sure you want to delete "{selectedZone.zoneName}" zone?
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowZoneDeleteModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                No
              </button>
              <button
                onClick={handleConfirmZoneDelete}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal for Provider Delete */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-8 w-[420px] text-center shadow-2xl">
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-r from-teal-500 to-green-500 flex items-center justify-center text-white text-4xl">
              ✓
            </div>

            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              Provider Deleted!
            </h2>

            <p className="text-gray-600">
              Provider{" "}
              <span className="font-semibold text-teal-600">
                “{provider.name}”
              </span>{" "}
              has been successfully deleted.
            </p>
          </div>
        </div>
      )}

      {/* Success Modal for Zone Delete */}
      {showZoneSuccessModal && selectedZone && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-8 w-[420px] text-center shadow-2xl">
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-r from-teal-500 to-green-500 flex items-center justify-center text-white text-4xl">
              ✓
            </div>

            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              Zone Deleted!
            </h2>

            <p className="text-gray-600">
              Zone{" "}
              <span className="font-semibold text-teal-600">
                “{selectedZone.zoneName}”
              </span>{" "}
              has been successfully deleted.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingProviderDetail;