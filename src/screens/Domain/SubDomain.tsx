import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiPlus, FiEdit } from "react-icons/fi";

const SubDomain = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const subdomains = [
    { name: "shop.myshop.com", pointsTo: "192.168.1.1", status: "Active" },
    { name: "blog.myshop.com", pointsTo: "192.168.1.2", status: "Active" },
    { name: "api.myshop.com", pointsTo: "192.168.1.3", status: "Active" },
    { name: "mail.myshop.com", pointsTo: "192.168.1.4", status: "Active" },
    { name: "admin.myshop.com", pointsTo: "192.168.1.5", status: "Active" },
  ];

  // Set active tab based on current path
  const getActiveTabFromPath = () => {
    if (location.pathname === '/domains') return 'domains';
    if (location.pathname === '/ssl') return 'ssl';
    if (location.pathname === '/dns') return 'dns';
    if (location.pathname === '/subdomains') return 'subdomains';
    return 'subdomains';
  };

  const activeTab = getActiveTabFromPath();

  const handleTabChange = (path: string) => {
    navigate(path);
  };

  const handleAddSubdomain = () => {
    console.log("Add subdomain clicked");
    navigate('/add-subdomain');
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-600";
      case "Inactive":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Subdomain Management</h2>

        <button
          onClick={handleAddSubdomain}
          className="flex items-center gap-3 px-6 py-1 rounded-full bg-gradient-to-r from-teal-400 to-green-500 text-white text-sm font-medium shadow-md hover:from-teal-500 hover:to-green-600 transition-all"
        >
          <span className="relative -left-5 flex items-center justify-center w-10 h-10 rounded-full bg-white">
            <FiPlus className="text-teal-500 text-lg" />
          </span>
          Add Subdomain
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

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
            <tr>
              <th className="px-6 py-4 rounded-l-xl">Subdomain</th>
              <th className="px-6 py-4">Points To</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 rounded-r-xl text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {subdomains.map((item, index) => (
              <tr
                key={index}
                className="border-t border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 text-gray-800 font-medium">
                  {item.name}
                </td>
                <td className="px-6 py-4 text-gray-600">{item.pointsTo}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyle(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <button className="flex items-center gap-2 bg-gradient-to-r from-teal-400 to-green-500 hover:from-teal-500 hover:to-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition shadow-md hover:shadow-lg">
                      <FiEdit size={14} />
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State if needed */}
      {subdomains.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No subdomains found</p>
        </div>
      )}
    </div>
  );
};

export default SubDomain;