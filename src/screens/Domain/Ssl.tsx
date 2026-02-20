import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiPlus } from "react-icons/fi";

const Ssl = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const sslData = [
    { domain: "myshop.com", expiry: "12 Aug 2026", status: "Active" },
    { domain: "myblog.com", expiry: "23 Sep 2026", status: "Active" },
    { domain: "test.com", expiry: "05 Jul 2026", status: "Not Installed" },
    { domain: "oldshop.com", expiry: "15 Jan 2026", status: "Expired" },
    { domain: "newstore.com", expiry: "30 Oct 2026", status: "Active" },
    { domain: "demo.com", expiry: "18 Mar 2026", status: "Expired" },
    { domain: "sample.com", expiry: "22 Nov 2026", status: "Expired" },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-600";
      case "Not Installed":
        return "bg-yellow-100 text-yellow-600";
      case "Expired":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getButtonText = (status: string) => {
    return status === "Active" ? "Renew SSL" : "Install SSL";
  };

  const getButtonStyle = (status: string) => {
    return status === "Active"
      ? "bg-teal-500 text-white hover:bg-teal-600"
      : "bg-blue-500 text-white hover:bg-blue-600";
  };

  // Set active tab based on current path
  const getActiveTabFromPath = () => {
    if (location.pathname === '/domains') return 'domains';
    if (location.pathname === '/ssl') return 'ssl';
    if (location.pathname === '/dns') return 'dns';
    if (location.pathname === '/subdomains') return 'subdomains';
    return 'ssl';
  };

  const activeTab = getActiveTabFromPath();

  const handleTabChange = (path: string) => {
    navigate(path);
  };

  const handleAddSsl = () => {
    navigate('/add-ssl-certificate');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header with Add SSL Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">SSL Management</h2>

        <button
          onClick={handleAddSsl}
          className="flex items-center gap-3 px-6 py-1 rounded-full bg-gradient-to-r from-teal-400 to-green-500 text-white text-sm font-medium shadow-md hover:from-teal-500 hover:to-green-600 transition-all"
        >
          <span className="relative -left-5 flex items-center justify-center w-10 h-10 rounded-full bg-white">
            <FiPlus className="text-teal-500 text-lg" />
          </span>
          Add SSL Certificate
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200 mb-6">
        <button
          onClick={() => handleTabChange('/domains')}
          className={`pb-2 transition-colors ${
            activeTab === 'domains'
              ? 'text-teal-600 border-b-2 border-teal-500 font-medium'
              : 'text-gray-500 hover:text-teal-600'
          }`}
        >
          Domains
        </button>
        <button
          onClick={() => handleTabChange('/ssl')}
          className={`pb-2 transition-colors ${
            activeTab === 'ssl'
              ? 'text-teal-600 border-b-2 border-teal-500 font-medium'
              : 'text-gray-500 hover:text-teal-600'
          }`}
        >
          SSL
        </button>
        <button
          onClick={() => handleTabChange('/dns')}
          className={`pb-2 transition-colors ${
            activeTab === 'dns'
              ? 'text-teal-600 border-b-2 border-teal-500 font-medium'
              : 'text-gray-500 hover:text-teal-600'
          }`}
        >
          DNS
        </button>
        <button
          onClick={() => handleTabChange('/subdomains')}
          className={`pb-2 transition-colors ${
            activeTab === 'subdomains'
              ? 'text-teal-600 border-b-2 border-teal-500 font-medium'
              : 'text-gray-500 hover:text-teal-600'
          }`}
        >
          Subdomains
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-4 bg-gray-50 px-6 py-3 text-sm font-medium text-gray-600 border-b">
          <span>Domain Name</span>
          <span>Expiry Date</span>
          <span className="text-center">SSL Status</span>
          <span className="text-center">Action</span>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-gray-100">
          {sslData.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-4 items-center px-6 py-4 text-sm hover:bg-gray-50 transition"
            >
              {/* Domain Name */}
              <span className="text-gray-800 font-medium">{item.domain}</span>
              
              {/* Expiry Date */}
              <span className="text-gray-600">{item.expiry}</span>

              {/* Status Badge - Centered */}
              <div className="flex justify-center">
                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusStyle(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </div>

              {/* Action Button - Centered */}
              <div className="flex justify-center">
                <button className={`px-4 py-1.5 text-xs font-medium rounded-lg transition ${getButtonStyle(item.status)}`}>
                  {getButtonText(item.status)}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ssl;