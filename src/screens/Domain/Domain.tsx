import React, { useState } from "react";
import { FiShoppingCart, FiSearch, FiChevronDown } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";

const Domain = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  // Set active tab based on current path
  const getActiveTabFromPath = () => {
    if (location.pathname === '/domains') return 'domains';
    if (location.pathname === '/ssl') return 'ssl';
    if (location.pathname === '/dns') return 'dns';
    if (location.pathname === '/subdomains') return 'subdomains';
    return 'domains';
  };

  const [activeTab] = useState(getActiveTabFromPath());

  const handleTabChange = (tab: string, path: string) => {
    navigate(path);
  };

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <h2 className="text-lg font-semibold mb-6">Domains</h2>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200 mb-6">
        <button
          onClick={() => handleTabChange('domains', '/domains')}
          className={`pb-2 transition-colors ${
            activeTab === 'domains'
              ? 'text-teal-600 border-b-2 border-teal-500 font-medium'
              : 'text-gray-500 hover:text-teal-600'
          }`}
        >
          Domains
        </button>
        <button
          onClick={() => handleTabChange('ssl', '/ssl')}
          className={`pb-2 transition-colors ${
            activeTab === 'ssl'
              ? 'text-teal-600 border-b-2 border-teal-500 font-medium'
              : 'text-gray-500 hover:text-teal-600'
          }`}
        >
          SSL
        </button>
        <button
          onClick={() => handleTabChange('dns', '/dns')}
          className={`pb-2 transition-colors ${
            activeTab === 'dns'
              ? 'text-teal-600 border-b-2 border-teal-500 font-medium'
              : 'text-gray-500 hover:text-teal-600'
          }`}
        >
          DNS
        </button>
        <button
          onClick={() => handleTabChange('subdomains', '/subdomains')}
          className={`pb-2 transition-colors ${
            activeTab === 'subdomains'
              ? 'text-teal-600 border-b-2 border-teal-500 font-medium'
              : 'text-gray-500 hover:text-teal-600'
          }`}
        >
          Subdomains
        </button>
      </div>

      {/* Search Bar - Centered */}
      <div className="flex justify-center items-center gap-4 mb-12">
        <div className="relative w-full max-w-md">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search domain..."
            className="w-full h-[48px] pl-11 pr-4 text-sm border-2 border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-6 py-2.5 bg-gradient-to-r from-teal-400 to-green-500 text-white text-sm font-medium rounded-xl hover:from-teal-500 hover:to-green-600 transition-all shadow-md hover:shadow-lg"
        >
          Search Domain
        </button>
      </div>

      {/* Available Card - Centered */}
      <div className="flex justify-center mb-12">
        <div className="bg-gradient-to-br from-teal-50 to-green-50 w-80 rounded-xl border-2 border-teal-100 p-6 relative overflow-hidden">
          {/* Gradient border effects */}
          <span className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-teal-400 to-green-400" />
          <span className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-teal-400 to-green-400" />
          
          <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full font-medium">
            Available
          </span>

          <h2 className="mt-4 font-semibold text-xl text-gray-800">jhonsmith.com</h2>

          <div className="mt-4">
            <p className="text-2xl font-bold text-gray-800">45$</p>
            <span className="text-xs text-gray-400">per year</span>
          </div>
        </div>
      </div>

      {/* More Domains Section - Centered */}
      <div className="flex flex-col items-center">
        <h3 className="text-md font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-teal-500 rounded-full"></span>
          More Domains
        </h3>

        <div className="space-y-4 w-full max-w-2xl">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white border-2 border-gray-100 flex justify-between items-center p-4 rounded-xl hover:border-teal-200 transition-all shadow-sm hover:shadow-md relative overflow-hidden"
            >
              {/* Bottom gradient border */}
              <span className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-teal-400 to-green-400" />
              
              <div>
                <p className="font-medium text-gray-800">jhonsmith.com</p>
                <span className="text-xs text-gray-400">1 year registration</span>
              </div>

              <div className="flex items-center gap-4">
                <p className="font-semibold text-lg text-gray-800">45$</p>
                <button className="p-2.5 border-2 border-teal-500 text-teal-500 rounded-lg hover:bg-teal-50 transition-all" title="Add to Cart">
                  <FiShoppingCart size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Domain;