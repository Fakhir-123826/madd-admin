import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaPlus, FaEllipsisV } from "react-icons/fa";
import { SiStripe } from "react-icons/si";

interface Provider {
  id: number;
  name: string;
  type: string;
  mode: string;
  status: "Active" | "Inactive";
}

const initialProviders: Provider[] = [
  { id: 1, name: "Stripe", type: "Online Gateway", mode: "Live", status: "Active" },
  { id: 2, name: "Stripe", type: "Online Gateway", mode: "Sandbox", status: "Inactive" },
  { id: 3, name: "Stripe", type: "Online Gateway", mode: "Sandbox", status: "Active" },
  { id: 4, name: "Stripe", type: "Online Gateway", mode: "Sandbox", status: "Active" },
  { id: 5, name: "Stripe", type: "Online Gateway", mode: "Sandbox", status: "Active" },
  { id: 6, name: "PayPal", type: "Online Gateway", mode: "Live", status: "Active" },
  { id: 7, name: "PayStack", type: "Online Gateway", mode: "Sandbox", status: "Inactive" },
  { id: 8, name: "Razorpay", type: "Online Gateway", mode: "Live", status: "Active" },
];

const PaymentProviderManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [providers] = useState<Provider[]>(initialProviders);
  const itemsPerPage = 8;

  const statusStyle = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-600";
      case "Inactive":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(providers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProviders = providers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddStripe = () => {
    navigate('/addstripe');
  };

  const handleAddProvider = () => {
    navigate('/addprovider');
  };

  const handleViewProvider = (provider: Provider) => {
    navigate(`/payment-provider/${provider.id}`, { state: { provider } });
  };

  // Base style for table cells with gradient underlines
  const tdBase = "relative p-4 text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-gradient-to-r after:from-teal-400 after:to-green-400";

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Payment Provider Management</h2>
        
        <div className="flex gap-3">
          {/* Add Stripe Button */}
          <button
            onClick={handleAddStripe}
            className="flex items-center gap-3 px-6 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium shadow-md hover:from-indigo-600 hover:to-purple-600 transition-all"
          >
            <span className="relative -left-5 flex items-center justify-center w-10 h-10 rounded-full bg-white">
              <SiStripe className="text-indigo-500 text-sm" />
            </span>
            Add Stripe
          </button>

          {/* Add New Provider Button */}
          <button
            onClick={handleAddProvider}
            className="flex items-center gap-3 px-6 py-1 rounded-full bg-gradient-to-r from-teal-400 to-green-500 text-white text-sm font-medium shadow-md hover:from-teal-500 hover:to-green-600 transition-all"
          >
            <span className="relative -left-5 flex items-center justify-center w-10 h-10 rounded-full bg-white">
              <FaPlus className="text-teal-500 text-sm" />
            </span>
            Add New Provider
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-t-3xl overflow-hidden mt-6">
        <table className="w-full text-sm border-separate border-spacing-y-3">
          {/* HEADER - Gradient background */}
          <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
            <tr>
              <th className="p-4 text-left rounded-l-xl">Provider Name</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Mode</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center rounded-r-xl">Action</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {currentProviders.map((provider, index) => (
              <tr key={index} className="bg-white shadow-sm hover:shadow-md transition relative">
                {/* Provider Name Cell */}
                <td className="relative p-4 font-medium rounded-l-xl text-black">
                  <div className="flex items-center gap-2">
                    <SiStripe className="text-indigo-500" size={18} />
                    {provider.name}
                  </div>
                  {/* Bottom gradient border */}
                  <span className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-teal-400 to-green-400" />
                </td>

                {/* Type Cell */}
                <td className="relative p-4 text-gray-600">
                  {provider.type}
                  {/* Bottom gradient border */}
                  <span className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-teal-400 to-green-400" />
                </td>

                {/* Mode Cell */}
                <td className="relative p-4 text-gray-600">
                  {provider.mode}
                  {/* Bottom gradient border */}
                  <span className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-teal-400 to-green-400" />
                </td>

                {/* Status Cell */}
                <td className="relative p-4 text-gray-600">
                  <span
                    className={`px-3 py-1 rounded-md text-xs font-medium ${statusStyle(provider.status)}`}
                  >
                    {provider.status}
                  </span>
                  {/* Bottom gradient border */}
                  <span className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-teal-400 to-green-400" />
                </td>

                {/* Actions Cell with Right and Bottom Borders */}
                <td className="relative p-4 rounded-r-xl text-center">
                  {/* Right gradient border */}
                  <span className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-teal-400 to-green-400 rounded-r-xl" />
                  {/* Bottom gradient border */}
                  <span className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-teal-400 to-green-400" />

                  <button 
                    onClick={() => handleViewProvider(provider)}
                    className="text-gray-400 hover:text-teal-600 transition-colors"
                    title="View Provider Details"
                  >
                    <FaEllipsisV size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-600">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40"
        >
          ← Back
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 rounded-md ${
              currentPage === i + 1
                ? "bg-gradient-to-r from-teal-400 to-green-400 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default PaymentProviderManagement;