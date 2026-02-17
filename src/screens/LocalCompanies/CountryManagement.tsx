import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaFilter, FaRedo, FaSearch, FaPencilAlt, FaTrash } from "react-icons/fa";
import { X } from "lucide-react";

interface Country {
  name: string;
  code: string;
  currency: string;
  languages: string;
  status: "Active" | "Inactive";
}

const initialCountries: Country[] = [
  {
    name: "Pakistan",
    code: "+92",
    currency: "PKR",
    languages: "Urdu, English",
    status: "Active",
  },
  {
    name: "India",
    code: "+91",
    currency: "USDT",
    languages: "French",
    status: "Inactive",
  },
  {
    name: "America",
    code: "+12",
    currency: "USA, UAE, Nigeria",
    languages: "Turkish",
    status: "Active",
  },
  {
    name: "America",
    code: "+92",
    currency: "USA, UAE, Nigeria",
    languages: "Urdu, English",
    status: "Inactive",
  },
  {
    name: "America",
    code: "+52",
    currency: "USA, UAE, Nigeria",
    languages: "Urdu, English",
    status: "Active",
  },
  {
    name: "NewZealand",
    code: "+92",
    currency: "USA, UAE, Nigeria",
    languages: "Urdu, English",
    status: "Inactive",
  },
];

const CountryManagement = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [countries, setCountries] = useState<Country[]>(initialCountries);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [deletedCountryName, setDeletedCountryName] = useState("");
  const itemsPerPage = 8;

  // Filter states
  const [filters, setFilters] = useState({
    name: "",
    status: "",
    code: ""
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const resetFilters = () => {
    setFilters({
      name: "",
      status: "",
      code: ""
    });
  };

  // Filter countries based on filters
  const filteredCountries = countries.filter(country => {
    if (filters.status && country.status !== filters.status) return false;
    if (filters.name && !country.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
    if (filters.code && !country.code.includes(filters.code)) return false;
    return true;
  });

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
  const totalPages = Math.ceil(filteredCountries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCountries = filteredCountries.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddCountry = () => {
    navigate('/addcountry');
  };

  const handleEditCountry = (country: Country) => {
    console.log("Edit country:", country);
    // You can navigate to edit page with state
    // navigate('/editcountry', { state: { country } });
  };

  const handleDeleteClick = (country: Country) => {
    setSelectedCountry(country);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCountry) {
      // Remove country from list
      setCountries(countries.filter(c => c.name !== selectedCountry.name));
      setDeletedCountryName(selectedCountry.name);
      setShowDeleteModal(false);
      
      // Show success modal
      setTimeout(() => {
        setShowSuccessModal(true);
      }, 100);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setSelectedCountry(null);
  };

  // Base style for table cells with gradient underlines
  const tdBase = "relative p-4 text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-gradient-to-r after:from-teal-400 after:to-green-400";

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Countries Management</h2>
        </div>

        <button
          onClick={handleAddCountry}
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
          Add New Country
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center overflow-hidden h-[52px] py-10">
        {/* Left Side Filters */}
        <div className="flex items-center bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden h-[52px] w-[60%]">
          
          {/* Filter Icon */}
          <div className="px-5 flex items-center border-r border-gray-200 text-gray-600">
            <FaFilter />
          </div>

          {/* Filter By Text */}
          <div className="px-5 flex items-center border-r border-gray-200 text-sm font-medium text-gray-700">
            Filter By
          </div>

          {/* Name Dropdown */}
          <div className="relative border-r border-gray-200">
            <select 
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              className="h-[52px] px-5 pr-9 text-sm bg-transparent outline-none appearance-none cursor-pointer text-gray-700"
            >
              <option value="">Name</option>
              <option value="A-Z">A-Z</option>
              <option value="Z-A">Z-A</option>
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
          </div>

          {/* Status Dropdown */}
          <div className="relative border-r border-gray-200">
            <select 
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="h-[52px] px-5 pr-9 text-sm bg-transparent outline-none appearance-none cursor-pointer text-gray-700"
            >
              <option value="">Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
          </div>

          {/* Country Code Dropdown */}
          <div className="relative border-r border-gray-200">
            <select 
              name="code"
              value={filters.code}
              onChange={handleFilterChange}
              className="h-[52px] px-5 pr-9 text-sm bg-transparent outline-none appearance-none cursor-pointer text-gray-700"
            >
              <option value="">Country Code</option>
              <option value="+92">+92</option>
              <option value="+91">+91</option>
              <option value="+12">+12</option>
              <option value="+52">+52</option>
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
          </div>

          {/* Reset Filter Button */}
          <button 
            onClick={resetFilters}
            className="px-5 flex items-center gap-2 text-sm text-blue-500 hover:underline"
          >
            <FaRedo className="text-xs" />
            Reset Filter
          </button>
        </div>

        {/* Search Box */}
        <div className="ml-auto relative mr-2">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search here..."
            className="w-70 h-[48px] pl-11 pr-4 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-400 shadow-lg"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-t-3xl overflow-hidden mt-6">
        <table className="w-full text-sm border-separate border-spacing-y-3">
          {/* HEADER - Gradient background */}
          <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
            <tr>
              <th className="p-4 text-left rounded-l-xl">Country Name</th>
              <th className="p-4 text-left">Country Code</th>
              <th className="p-4 text-left">Default Currency</th>
              <th className="p-4 text-left">Supported Languages</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center rounded-r-xl">Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {currentCountries.map((country, index) => (
              <tr key={index} className="bg-white shadow-sm hover:shadow-md transition">
                <td className={`${tdBase} font-medium rounded-l-xl text-black`}>
                  {country.name}
                </td>

                <td className={tdBase}>
                  {country.code}
                </td>

                <td className={tdBase}>
                  {country.currency}
                </td>

                <td className={tdBase}>
                  {country.languages}
                </td>

                <td className={tdBase}>
                  <span
                    className={`px-3 py-1 rounded-md text-xs font-medium ${statusStyle(country.status)}`}
                  >
                    {country.status}
                  </span>
                </td>

                {/* ACTION - Icons */}
                <td className="relative p-4 rounded-r-xl text-center">
                  {/* Right gradient border */}
                  <span className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-teal-400 to-green-400 rounded-r-xl" />
                  {/* Bottom gradient border */}
                  <span className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-teal-400 to-green-400" />

                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => handleEditCountry(country)}
                      className="text-gray-400 hover:text-teal-600 transition-colors"
                      title="Edit Country"
                    >
                      <FaPencilAlt size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(country)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete Country"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedCountry && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-8 w-[400px] text-center relative shadow-2xl animate-[scaleIn_0.3s_ease-out]">
            
            {/* Close button */}
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Bin Icon */}
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-red-100 flex items-center justify-center">
              <FaTrash className="text-red-500" size={40} />
            </div>

            {/* Confirmation Text */}
            <p className="text-gray-700 text-lg font-bold mb-2">
              Are you sure want to delete this Country?
            </p>
            <p className="text-gray-500 text-sm mb-8">
              This action cannot be undone.
            </p>

            {/* Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-8 py-2.5 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium w-24"
              >
                No
              </button>

              <button
                onClick={handleConfirmDelete}
                className="px-8 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-md w-24"
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
            
            {/* Close button */}
            <button
              onClick={handleCloseSuccessModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Tick Icon */}
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-r from-teal-500 to-green-500 flex items-center justify-center text-white text-4xl shadow-lg">
              ✓
            </div>

            {/* Success Content */}
            <h2 className="text-2xl font-bold mb-3 text-gray-800">
              Country Deleted!
            </h2>
            
            <p className="text-gray-600 text-lg mb-2">
              Country <span className="font-semibold text-teal-600">“{deletedCountryName}”</span>
            </p>
            <p className="text-gray-500 mb-4">
              has been successfully deleted.
            </p>

            {/* OK Button */}
            <button
              onClick={handleCloseSuccessModal}
              className="mt-4 px-10 py-2.5 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-lg hover:from-teal-600 hover:to-green-600 transition-all duration-200 font-medium shadow-md"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Add custom animations */}
      <style>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default CountryManagement;