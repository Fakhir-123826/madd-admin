import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

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

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <h2 className="text-lg font-semibold mb-6">SSL Management</h2>

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
          <span>SSL Status</span>
          <span>Action</span>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-gray-100">
          {sslData.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-4 items-center px-6 py-3 text-sm hover:bg-gray-50 transition"
            >
              <span className="text-gray-800">{item.domain}</span>
              <span className="text-gray-600">{item.expiry}</span>

              {/* Status Badge */}
              <span>
                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusStyle(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </span>

              {/* Action Button */}
              <span>
                <button className={`px-4 py-1.5 text-xs font-medium rounded-lg transition ${
                  item.status === "Active"
                    ? "bg-teal-500 text-white hover:bg-teal-600"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}>
                  {getButtonText(item.status)}
                </button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ssl;