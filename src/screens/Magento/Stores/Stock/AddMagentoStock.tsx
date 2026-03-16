import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaChevronDown, FaQuestionCircle } from "react-icons/fa";
import MagentoSourcesList from "../Source/MagentoSourcesList"; // Your existing component

const AddMagentoStock = () => {
  const navigate = useNavigate();

  const [showSourcesModal, setShowSourcesModal] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>([]); // Yeh real selected sources store karega

  // Form states
  const [stockName, setStockName] = useState("");

  const handleSave = () => {
    // Final save logic (RTK mutation yahan aayega)
    console.log("Saving stock:", { name: stockName, sources: selectedSources });
    navigate("/MagentoStockList");
  };

  const handleAssignSources = (sources: string[]) => {
    setSelectedSources(sources); // Done button se sources receive karo
    setShowSourcesModal(false);
  };

  return (
    <div className="space-y-6 pb-10">

      {/* TOP BAR */}
      <div className="bg-white rounded-xl shadow-sm px-6 py-4 flex items-center justify-between flex-wrap gap-3 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/MagentoStockList")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-50">
            <FaArrowLeft className="text-sm" /> Back
          </button>
          <h2 className="text-lg font-semibold text-gray-800">New Stock</h2>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button className="px-5 py-2.5 rounded-xl border border-red-300 text-red-600 text-sm hover:bg-red-50">
            Delete
          </button>
          <button className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-50">
            Reset
          </button>
          <button onClick={handleSave}
            className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2"
            style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
            Save & Continue <FaChevronDown className="text-xs" />
          </button>
        </div>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6 space-y-8">

        <h3 className="text-base font-semibold text-gray-800 border-b border-gray-200 pb-2">Sales Channels</h3>

        {/* Sales Channels Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Websites</label>
            <button className="text-gray-500 hover:text-gray-700">
              <FaQuestionCircle />
            </button>
          </div>
          <div className="border border-gray-300 rounded-xl p-4 bg-gray-50 min-h-[140px] resize-y overflow-y-auto">
            <div className="space-y-2 text-sm text-gray-700">
              <div>Main Website</div>
              <div>my web site</div>
              <div>neo.exp</div>
              <div>rrrr</div>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Use Ctrl+Click to check several values or uncheck value. All unassigned sales channels will be assigned to the Default Stock.
          </p>
        </div>

        {/* Sources Section */}
        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Sources</h3>
          <button
            onClick={() => setShowSourcesModal(true)}
            className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all"
            style={{ background: "#4b5563" }} // dark gray/black
          >
            Assign Sources
          </button>

          {/* Assigned Sources Table */}
          {selectedSources.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Assigned Sources</h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Code</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Unassign</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSources.map((source, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="px-4 py-3 text-sm text-gray-700">{source}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{source} Source</td>
                        <td className="px-4 py-3 text-right">
                          <button 
                            onClick={() => setSelectedSources(prev => prev.filter(s => s !== source))}
                            className="text-xs text-blue-500 hover:text-blue-700"
                          >
                            Unassign
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Assign Sources Modal */}
      {showSourcesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800">Assign Sources</h3>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowSourcesModal(false)}
                  className="px-5 py-2 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    // Yeh Done button hai – yahan se selected sources pass kar sakte ho
                    // Abhi mock kar raha hoon, real mein MagentoSourcesList se selected le lo
                    const mockSelected = ["default", "neno880"]; // Yeh real mein component se aayega
                    setSelectedSources(mockSelected);
                    setShowSourcesModal(false);
                  }}
                  className="px-6 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all"
                  style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}
                >
                  Done
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <MagentoSourcesList />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMagentoStock;