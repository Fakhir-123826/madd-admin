import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiChevronDown, FiChevronUp, FiTrash2, FiEdit2, FiPlus } from "react-icons/fi";

const Dns = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const domains = [
    { name: "jhonsmith.com", records: 3 },
    { name: "myshop.com", records: 5 },
    { name: "test.com", records: 2 },
  ];

  // DNS records data
  const dnsRecords = [
    { type: "CNAME", host: "www", value: "v=spf1 includemail.com", ttl: "14400" },
    { type: "A", host: "@", value: "192.168.1.1", ttl: "3600" },
    { type: "MX", host: "@", value: "mail.google.com", ttl: "14400" },
    { type: "TXT", host: "@", value: "v=spf1 include:spf.mandrillapp.com ?all", ttl: "3600" },
  ];

  // Set active tab based on current path
  const getActiveTabFromPath = () => {
    if (location.pathname === '/domains') return 'domains';
    if (location.pathname === '/ssl') return 'ssl';
    if (location.pathname === '/dns') return 'dns';
    if (location.pathname === '/subdomains') return 'subdomains';
    return 'dns';
  };

  const activeTab = getActiveTabFromPath();

  const handleTabChange = (path: string) => {
    navigate(path);
  };

  const toggleDropdown = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleAddRecord = (domain: string) => {
    console.log("Add record for:", domain);
  };

  const handleAddNewRecord = () => {
    navigate('/add-dns-record');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">DNS Management</h2>

        <button
          onClick={handleAddNewRecord}
          className="flex items-center gap-3 px-6 py-1 rounded-full bg-gradient-to-r from-teal-400 to-green-500 text-white text-sm font-medium shadow-md hover:from-teal-500 hover:to-green-600 transition-all"
        >
          <span className="relative -left-5 flex items-center justify-center w-10 h-10 rounded-full bg-white">
            <FiPlus className="text-teal-500 text-lg" />
          </span>
          Add New Record
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

      {/* Container */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-gray-800 font-semibold mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-teal-500 rounded-full"></span>
          Available Domains
        </h2>

        <div className="space-y-3">
          {domains.map((domain, index) => (
            <div
              key={index}
              className="border-2 border-gray-100 rounded-xl overflow-hidden hover:border-teal-200 transition-all"
            >
              {/* Domain Header */}
              <div
                className="flex justify-between items-center px-4 py-3 cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
                onClick={() => toggleDropdown(index)}
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-800">
                    {domain.name}
                  </span>
                  <span className="text-xs bg-teal-100 text-teal-600 px-2 py-0.5 rounded-full">
                    {domain.records} records
                  </span>
                </div>

                {openIndex === index ? (
                  <FiChevronUp className="text-gray-500" />
                ) : (
                  <FiChevronDown className="text-gray-500" />
                )}
              </div>

              {/* Dropdown Content */}
              {openIndex === index && (
                <div className="p-4 border-t border-gray-200">
                  {/* Table Header */}
                  <div className="grid grid-cols-5 text-xs font-medium text-gray-500 border-b border-gray-200 pb-2 mb-3">
                    <span>Type</span>
                    <span>Host</span>
                    <span>Value</span>
                    <span>TTL</span>
                    <span className="text-center">Action</span>
                  </div>

                  {/* Rows */}
                  <div className="space-y-3">
                    {dnsRecords.map((record, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-5 items-center text-sm py-2 hover:bg-gray-50 rounded-lg transition"
                      >
                        <span className="font-medium text-gray-700">{record.type}</span>
                        <span className="text-gray-600">{record.host}</span>
                        <span className="text-gray-600 truncate pr-2">{record.value}</span>
                        <span className="text-gray-600">{record.ttl}</span>
                        <span className="flex justify-center gap-3">
                          <button className="text-red-500 hover:text-red-600 transition" title="Delete">
                            <FiTrash2 size={16} />
                          </button>
                          <button className="text-gray-500 hover:text-teal-600 transition" title="Edit">
                            <FiEdit2 size={16} />
                          </button>
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Add Record Button */}
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => handleAddRecord(domain.name)}
                      className="flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition text-sm font-medium"
                    >
                      <FiPlus size={16} />
                      Add DNS Record
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dns;