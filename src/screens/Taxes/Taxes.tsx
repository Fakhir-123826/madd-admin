import React, { useState } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TaxRule {
  id: number;
  name: string;
  country: string;
  appliedTo: string;
  status: "Active" | "Inactive";
}

const initialTaxRules: TaxRule[] = [
  {
    id: 1,
    name: "Tax Rule",
    country: "America",
    appliedTo: "Electronic, Beauty, Hair",
    status: "Active",
  },
  {
    id: 2,
    name: "Tax Rule",
    country: "America",
    appliedTo: "Electronic, Beauty, Hair",
    status: "Active",
  },
];

function Taxes() {
  const navigate = useNavigate();
  const [taxRules, setTaxRules] = useState<TaxRule[]>(initialTaxRules);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState<TaxRule | null>(null);
  const [deletedRuleName, setDeletedRuleName] = useState("");

  const handleDeleteClick = (rule: TaxRule) => {
    setSelectedRule(rule);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedRule) {
      setTaxRules(taxRules.filter(rule => rule.id !== selectedRule.id));
      setDeletedRuleName(selectedRule.name);
      setShowDeleteModal(false);
      
      setTimeout(() => {
        setShowSuccessModal(true);
      }, 100);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setSelectedRule(null);
  };

  const handleAddRule = () => {
    navigate('/add-rule');
  };

  return (
    <div className="min-h-screen bg-white rounded-xl p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header with Add New Rule Button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Tax Rules Management
          </h1>

          <button
            onClick={handleAddRule}
            className="
              flex items-center gap-3
              px-6 py-1
              rounded-full
              bg-gradient-to-r from-teal-400 to-green-500
              text-white text-sm font-medium
              shadow-md
              hover:from-teal-500 hover:to-green-600
              transition-all
              hover:cursor-pointer
            "
          >
            <span className="relative -left-5 flex items-center justify-center w-10 h-10 rounded-full bg-white">
              <Plus className="text-teal-500 text-sm" size={16} />
            </span>
            Add New Rule
          </button>
        </div>

        {/* Rest of the component remains the same */}
        {/* Tax Rule Cards */}
        <div className="space-y-6">
          {taxRules.map((rule, index) => (
            <div
              key={rule.id}
              className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Top Gradient Bar */}
              <div className="bg-gradient-to-r from-teal-500 to-green-500 text-white px-6 py-3 font-bold">
                {index + 1 === 1 ? "Tax Rule name" : "2nd Tax Rule name"}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-4 gap-6 items-center">
                  <div>
                    <p className="text-sm text-gray-500 font-bold">Rule Name</p>
                    <p className="font-normal text-gray-800">{rule.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-bold">Country</p>
                    <p className="font-normal text-gray-800">{rule.country}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-bold">Applied to</p>
                    <p className="font-normal text-gray-800">{rule.appliedTo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1 font-bold">Status</p>
                    <span className="px-4 py-1.5 rounded-full text-sm bg-green-100 text-green-700 font-medium">
                      {rule.status}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() => handleDeleteClick(rule)}
                    className="flex items-center gap-3 px-6 py-1 rounded-full bg-red-500 text-white text-sm font-medium shadow-md hover:bg-red-600 transition-all duration-200 hover:shadow-lg"
                  >
                    <span className="relative -left-5 flex items-center justify-center w-8 h-8 rounded-full bg-white">
                      <Trash2 className="text-red-500" size={14} />
                    </span>
                    Delete Rule
                  </button>

                  <button
                    className="flex items-center gap-3 px-6 py-1 rounded-full bg-gradient-to-r from-teal-500 to-green-500 text-white text-sm font-medium shadow-md hover:from-teal-600 hover:to-green-600 transition-all duration-200 hover:shadow-lg"
                  >
                    <span className="relative -left-5 flex items-center justify-center w-8 h-8 rounded-full bg-white">
                      <Pencil className="text-teal-500" size={14} />
                    </span>
                    Edit Rule
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedRule && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-8 w-[450px] text-center relative shadow-2xl animate-[scaleIn_0.3s_ease-out]">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-red-100 flex items-center justify-center">
              <Trash2 className="text-red-500" size={40} />
            </div>

            <h2 className="text-2xl font-bold mb-3 text-gray-800">Delete Tax Rule?</h2>
            <p className="text-gray-600 mb-8 text-lg font-normal">
              Are you sure you want to delete this Tax Rule?
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-8 py-3 border-2 border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium w-32"
              >
                No
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-md w-32"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-8 w-[450px] text-center relative shadow-2xl animate-[scaleIn_0.3s_ease-out]">
            <button
              onClick={handleCloseSuccessModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-r from-teal-500 to-green-500 flex items-center justify-center text-white text-4xl shadow-lg">
              ✓
            </div>

            <h2 className="text-2xl font-bold mb-3 text-gray-800">Rule Deleted!</h2>
            <p className="text-gray-600 mb-2 text-lg font-normal">
              Tax Rule <span className="font-semibold text-teal-600">“{deletedRuleName}”</span>
            </p>
            <p className="text-gray-500 font-normal">has been successfully deleted.</p>

            <button
              onClick={handleCloseSuccessModal}
              className="mt-8 px-10 py-3 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-xl hover:from-teal-600 hover:to-green-600 transition-all duration-200 font-medium shadow-md"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

export default Taxes;