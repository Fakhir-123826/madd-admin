import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiInfo, FiArrowRight } from "react-icons/fi";

const CommerceConnector = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Commerce Services Connector Setup</h1>
        
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            
          <div className="grid lg:grid-cols-2 gap-10 items-center p-8 lg:p-12">
            {/* Left */}
            <div className="flex justify-center">
              <img
                src="https://assets-v2.lottiefiles.com/a/30812cc4-1175-11ee-9129-134c71276cc8/Ws4zxxFQvP.gif"
                alt="Commerce Connector"
                className="w-full max-w-sm"
              />
            </div>

            {/* Right */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4">
                <FiInfo />
                Commerce Services
              </div>

              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Commerce Services Connector Setup
              </h2>

              <p className="text-gray-600 leading-7 mb-4">
                Connect your Commerce instance with Commerce Services using a
                one-time setup process.
              </p>

              <p className="text-gray-600 leading-7 mb-8">
                You will need API Portal Keys from the account owner or license
                holder to complete the integration.
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowModal(true)}
                  className="px-5 py-2.5 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Learn More
                </button>

                <button
                  onClick={() => navigate("/settings/commerce-connector-setup")}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-2 transition"
                >
                  Start Setup
                  <FiArrowRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learn More Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl">
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold">
                Commerce Services Connector
              </h3>
            </div>

            <div className="p-6 space-y-4 text-gray-600">
              <p>
                Commerce Services Connector allows your Magento store to
                communicate securely with Adobe Commerce Services.
              </p>

              <p>
                This setup is required only once and enables:
              </p>

              <ul className="list-disc pl-5 space-y-2">
                <li>Catalog Sync</li>
                <li>Product Recommendations</li>
                <li>Live Search Integration</li>
                <li>Commerce Service APIs</li>
                <li>Future Adobe Service Features</li>
              </ul>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-blue-700">
                  Make sure you have API Portal Keys before proceeding with the
                  setup.
                </p>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CommerceConnector;