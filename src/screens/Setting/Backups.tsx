import  { useState } from "react";
import { Download, RefreshCw, X, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

interface Backup {
  id: number;
  dateCreated: string;
  backupType: string;
  size: string;
  status?: "in-progress" | "completed";
}

const Backups = () => {
  const navigate = useNavigate();
  const [showStartModal, setShowStartModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const [backups, setBackups] = useState<Backup[]>([
    {
      id: 1,
      dateCreated: "23 July 2025, 02:30 PM",
      backupType: "Full Backup",
      size: "3 GB",
      status: "completed",
    },
    {
      id: 2,
      dateCreated: "22 July 2025, 03:45 PM",
      backupType: "Database only",
      size: "1.2 GB",
      status: "in-progress",
    },
  ]);

  const handleStartBackup = () => {
    setShowStartModal(true);
  };

  const handleAddBackup = () => {
    navigate('/addbackup');
  };

  const handleConfirmBackup = () => {
    setShowStartModal(false);
    setIsBackingUp(true);

    setTimeout(() => {
      setIsBackingUp(false);
      setShowSuccessModal(true);

      const newBackup: Backup = {
        id: backups.length + 1,
        dateCreated: new Date().toLocaleDateString('en-US', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        backupType: "Full Backup",
        size: "3 GB",
        status: "completed",
      };
      setBackups([newBackup, ...backups]);

      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white rounded-xl p-8">
      {/* Page Title */}
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Backups
        </h1>

        {/* Add New Backup Button */}
       <button
                 onClick={handleAddBackup}
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
                   <FaPlus className="text-teal-500 text-sm" />
                 </span>
                 Add New Backup
               </button>
      </div>

    
      {/* Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

      <div className="flex justify-between mb-6">

        <h2 className="text-lg font-medium text-gray-800 mb-6">
          Backups History
        </h2>

          {/* Start Backup Button - Below Add New Backup */}
        <button
          onClick={handleStartBackup}
          className="px-5 py-2.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Start Backup
        </button>
      </div>


        <div className="space-y-6">
          {backups.map((backup) => (
            <div key={backup.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Date Created</p>
                  <p className="mt-1 text-gray-800 font-medium">{backup.dateCreated}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Backup Type</p>
                  <p className="mt-1 text-gray-800 font-medium">{backup.backupType}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Size</p>
                  <p className="mt-1 text-gray-800 font-medium">{backup.size}</p>
                </div>
              </div>

              {/* Status + Buttons */}
              <div className="flex items-center justify-between mt-6">
                {backup.status === "in-progress" ? (
                  <span className="px-4 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-700 flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                    Backup in progress
                  </span>
                ) : (
                  <span className="px-4 py-1 text-sm font-medium rounded-full bg-green-100 text-green-700 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Completed
                  </span>
                )}

                <div className="flex gap-4">
                  <button 
                    disabled={backup.status === "in-progress"}
                    className={`px-4 py-2 rounded-lg border transition ${
                      backup.status === "in-progress"
                        ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-100"
                        : "border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Restore
                  </button>

                  <button 
                    disabled={backup.status === "in-progress"}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                      backup.status === "in-progress"
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    <Download size={16} />
                    Export as PDF
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Start Backup Modal */}
      {showStartModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-6 w-[400px] text-center relative shadow-2xl animate-fadeIn">
            
            <button
              onClick={() => setShowStartModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
              <RefreshCw className="text-blue-600" size={28} />
            </div>

            <h3 className="text-xl font-semibold mb-2">Start Backup</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to start a new backup?
            </p>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm font-medium text-gray-700 mb-2">Backup Details:</p>
              <ul className="text-xs text-gray-600 space-y-2">
                <li className="flex justify-between">
                  <span>Type:</span>
                  <span className="font-medium">Full Backup</span>
                </li>
                <li className="flex justify-between">
                  <span>Estimated Size:</span>
                  <span className="font-medium">~3 GB</span>
                </li>
                <li className="flex justify-between">
                  <span>Estimated Time:</span>
                  <span className="font-medium">2-3 minutes</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowStartModal(false)}
                className="px-5 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBackup}
                className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
              >
                Start Backup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backup in Progress Modal */}
      {isBackingUp && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-6 w-[350px] text-center shadow-2xl animate-fadeIn">
            <div className="w-16 h-16 mx-auto mb-4">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-500"></div>
            </div>
            <h3 className="text-lg font-semibold mb-1">Creating Backup...</h3>
            <p className="text-sm text-gray-500 mb-4">Please wait</p>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-2 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-6 w-[350px] text-center shadow-2xl animate-fadeIn">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center text-white text-3xl">
              ✓
            </div>
            <h3 className="text-lg font-semibold mb-1">Backup Complete!</h3>
            <p className="text-sm text-gray-500">Your backup has been created</p>
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

export default Backups;