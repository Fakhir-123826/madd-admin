import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaFilter,
  FaColumns,
  FaFileExport,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaSort,
} from "react-icons/fa";
import StoreViewDropdown from "../../../../component/StoreViewDropdown";
import type { StoreViewSelection } from "../../../../model/MagentoProduct/StoreViewSelection";

// ============ FAKE MAGENTO BILLING AGREEMENTS DATA ============
interface BillingAgreement {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  reference_id: string;
  status: "Active" | "Inactive" | "Canceled" | "Suspended";
  created_at: string;
  updated_at: string;
  customer_group: string;
  payment_method: string;
}

const firstNames = [
  "John", "Emma", "Michael", "Sophia", "William", "Olivia", "James", "Ava",
  "Robert", "Isabella", "David", "Mia", "Richard", "Charlotte", "Joseph",
  "Amelia", "Thomas", "Harper", "Charles", "Evelyn", "Daniel", "Grace",
  "Matthew", "Victoria", "Anthony", "Hannah", "Mark", "Lily", "Paul", "Zoe",
  "Steven", "Natalie", "Brian", "Samantha", "Kevin", "Ashley"
];

const lastNames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Wilson", "Anderson", "Taylor", "Thomas", "Moore",
  "Jackson", "Martin", "Lee", "White", "Harris", "Clark", "Lewis", "Robinson",
  "Walker", "Young", "Allen", "King", "Wright", "Scott", "Green", "Baker", "Nelson"
];

const domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com", "company.com", "business.com", "magento.com", "shopify.com", "store.com"];
const customerGroups = ["General", "Wholesale", "Retail", "VIP", "Premium", "Guest"];
const paymentMethods = ["PayPal", "Stripe", "Braintree", "Authorize.Net", "Square", "Credit Card", "Bank Transfer"];

const generateRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: '2-digit' 
  }).replace(/,/g, '');
};

const generateFakeBillingAgreements = (count: number): BillingAgreement[] => {
  const agreements: BillingAgreement[] = [];
  const startDate = new Date(2023, 0, 1);
  const endDate = new Date();
  const statuses: BillingAgreement["status"][] = ["Active", "Inactive", "Canceled", "Suspended"];

  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 999)}@${domain}`;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const createdDate = generateRandomDate(startDate, endDate);
    const updatedDate = generateRandomDate(createdDate, endDate);
    const customerGroup = customerGroups[Math.floor(Math.random() * customerGroups.length)];
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    
    // Generate reference ID in different Magento formats
    const refIdFormats = [
      `ba-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      `REF-${Math.floor(Math.random() * 100000)}`,
      `BA${createdDate.getFullYear()}${Math.floor(Math.random() * 10000)}`,
      `agreement_${i}_${Math.floor(Math.random() * 1000)}`,
      `BILL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      `BA-${Math.floor(Math.random() * 90000 + 10000)}`,
      `MAG-${Math.floor(Math.random() * 999999)}`,
      `BILLING_${createdDate.getFullYear()}_${Math.floor(Math.random() * 999)}`,
    ];
    const referenceId = refIdFormats[Math.floor(Math.random() * refIdFormats.length)];

    agreements.push({
      id: 10000 + i,
      email: email,
      firstname: firstName,
      lastname: lastName,
      reference_id: referenceId,
      status: status,
      created_at: formatDate(createdDate),
      updated_at: formatDate(updatedDate),
      customer_group: customerGroup,
      payment_method: paymentMethod,
    });
  }
  
  // Sort by ID descending (newest first)
  return agreements.sort((a, b) => b.id - a.id);
};

const FAKE_BILLING_AGREEMENTS = generateFakeBillingAgreements(50);

// ============ MAIN COMPONENT ============
function MagentoBillingAgreementsList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showColumns, setShowColumns] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [perPage, setPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [storeSelection, setStoreSelection] = useState<StoreViewSelection>({ type: "all" });
  const [sortField, setSortField] = useState<string>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Filter states
  const [filters, setFilters] = useState({
    id: "",
    email: "",
    firstName: "",
    lastName: "",
    referenceId: "",
    status: "",
    customerGroup: "",
    paymentMethod: "",
    createdFrom: "",
    createdTo: "",
    updatedFrom: "",
    updatedTo: "",
  });

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    referenceId: true,
    status: true,
    created: true,
    updated: true,
    customerGroup: true,
    paymentMethod: true,
    action: true,
  });

  // Apply filters and search
  const filteredAgreements = useMemo(() => {
    let result = [...FAKE_BILLING_AGREEMENTS];

    // Global search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (agreement) =>
          agreement.email.toLowerCase().includes(searchLower) ||
          agreement.reference_id.toLowerCase().includes(searchLower) ||
          agreement.firstname.toLowerCase().includes(searchLower) ||
          agreement.lastname.toLowerCase().includes(searchLower) ||
          agreement.id.toString().includes(searchLower)
      );
    }

    // Apply specific filters
    if (filters.id) {
      result = result.filter((a) => a.id.toString().includes(filters.id));
    }
    if (filters.email) {
      result = result.filter((a) =>
        a.email.toLowerCase().includes(filters.email.toLowerCase())
      );
    }
    if (filters.firstName) {
      result = result.filter((a) =>
        a.firstname.toLowerCase().includes(filters.firstName.toLowerCase())
      );
    }
    if (filters.lastName) {
      result = result.filter((a) =>
        a.lastname.toLowerCase().includes(filters.lastName.toLowerCase())
      );
    }
    if (filters.referenceId) {
      result = result.filter((a) =>
        a.reference_id.toLowerCase().includes(filters.referenceId.toLowerCase())
      );
    }
    if (filters.status) {
      result = result.filter((a) => a.status === filters.status);
    }
    if (filters.customerGroup) {
      result = result.filter((a) => 
        a.customer_group.toLowerCase().includes(filters.customerGroup.toLowerCase())
      );
    }
    if (filters.paymentMethod) {
      result = result.filter((a) => 
        a.payment_method.toLowerCase().includes(filters.paymentMethod.toLowerCase())
      );
    }
    if (filters.createdFrom) {
      result = result.filter((a) => {
        const createdDate = new Date(a.created_at);
        return createdDate >= new Date(filters.createdFrom);
      });
    }
    if (filters.createdTo) {
      result = result.filter((a) => {
        const createdDate = new Date(a.created_at);
        return createdDate <= new Date(filters.createdTo);
      });
    }
    if (filters.updatedFrom) {
      result = result.filter((a) => {
        const updatedDate = new Date(a.updated_at);
        return updatedDate >= new Date(filters.updatedFrom);
      });
    }
    if (filters.updatedTo) {
      result = result.filter((a) => {
        const updatedDate = new Date(a.updated_at);
        return updatedDate <= new Date(filters.updatedTo);
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortField === "id") {
        return sortDirection === "asc" ? a.id - b.id : b.id - a.id;
      }
      if (sortField === "email") {
        return sortDirection === "asc" 
          ? a.email.localeCompare(b.email)
          : b.email.localeCompare(a.email);
      }
      if (sortField === "referenceId") {
        return sortDirection === "asc"
          ? a.reference_id.localeCompare(b.reference_id)
          : b.reference_id.localeCompare(a.reference_id);
      }
      if (sortField === "status") {
        return sortDirection === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      return 0;
    });

    return result;
  }, [FAKE_BILLING_AGREEMENTS, search, filters, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAgreements.length / perPage);
  const paginatedAgreements = filteredAgreements.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelected(
      selected.length === paginatedAgreements.length
        ? []
        : paginatedAgreements.map((i) => i.id)
    );
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      id: "",
      email: "",
      firstName: "",
      lastName: "",
      referenceId: "",
      status: "",
      customerGroup: "",
      paymentMethod: "",
      createdFrom: "",
      createdTo: "",
      updatedFrom: "",
      updatedTo: "",
    });
    setSearch("");
    setCurrentPage(1);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      Active: "bg-emerald-100 text-emerald-700",
      Inactive: "bg-gray-100 text-gray-700",
      Canceled: "bg-red-100 text-red-700",
      Suspended: "bg-yellow-100 text-yellow-700",
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-700";
  };

  const handleExport = () => {
    const headers = ["ID", "Email", "First Name", "Last Name", "Reference ID", "Status", "Customer Group", "Payment Method", "Created Date", "Updated Date"];
    const csvRows = filteredAgreements.map(agreement => [
      agreement.id,
      agreement.email,
      agreement.firstname,
      agreement.lastname,
      agreement.reference_id,
      agreement.status,
      agreement.customer_group,
      agreement.payment_method,
      agreement.created_at,
      agreement.updated_at
    ].join(","));

    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `billing_agreements_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  const thClass = "px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap";
  const tdClass = "px-6 py-4 text-sm text-gray-600 whitespace-nowrap";

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">

      {/* HEADER */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Billing Agreements</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage all customer billing agreements ({FAKE_BILLING_AGREEMENTS.length} total)
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="flex items-center gap-3 border border-gray-200 rounded-2xl px-5 py-3 bg-gray-50 focus-within:border-teal-400 focus-within:bg-white transition-all w-full md:w-96">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by Email, Reference ID, Name..."
              className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border text-sm font-medium transition-all ${
                showFilters
                  ? "border-teal-400 text-teal-600 bg-teal-50"
                  : "border-teal-400 text-teal-500 hover:bg-teal-50"
              }`}
            >
              <FaFilter /> Filters
            </button>

            <button
              onClick={() => setShowColumns(!showColumns)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-teal-300 text-teal-500 text-sm font-medium hover:bg-teal-50 transition-all"
            >
              <FaColumns /> Columns <FaChevronDown className="text-xs" />
            </button>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-teal-300 text-teal-500 text-sm font-medium hover:bg-teal-50 transition-all"
            >
              <FaFileExport /> Export <FaChevronDown className="text-xs" />
            </button>

            <StoreViewDropdown onChange={(sel) => setStoreSelection(sel)} />
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">ID</label>
                <input
                  type="text"
                  placeholder="Enter ID"
                  value={filters.id}
                  onChange={(e) => handleFilterChange("id", e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Email</label>
                <input
                  type="text"
                  placeholder="Enter Email"
                  value={filters.email}
                  onChange={(e) => handleFilterChange("email", e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">First Name</label>
                <input
                  type="text"
                  placeholder="Enter First Name"
                  value={filters.firstName}
                  onChange={(e) => handleFilterChange("firstName", e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Last Name</label>
                <input
                  type="text"
                  placeholder="Enter Last Name"
                  value={filters.lastName}
                  onChange={(e) => handleFilterChange("lastName", e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Reference ID</label>
                <input
                  type="text"
                  placeholder="Enter Reference ID"
                  value={filters.referenceId}
                  onChange={(e) => handleFilterChange("referenceId", e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:border-teal-400 text-sm transition-all"
                >
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Canceled">Canceled</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Customer Group</label>
                <select
                  value={filters.customerGroup}
                  onChange={(e) => handleFilterChange("customerGroup", e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:border-teal-400 text-sm transition-all"
                >
                  <option value="">All Groups</option>
                  <option value="General">General</option>
                  <option value="Wholesale">Wholesale</option>
                  <option value="Retail">Retail</option>
                  <option value="VIP">VIP</option>
                  <option value="Premium">Premium</option>
                  <option value="Guest">Guest</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Payment Method</label>
                <select
                  value={filters.paymentMethod}
                  onChange={(e) => handleFilterChange("paymentMethod", e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:border-teal-400 text-sm transition-all"
                >
                  <option value="">All Methods</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Stripe">Stripe</option>
                  <option value="Braintree">Braintree</option>
                  <option value="Authorize.Net">Authorize.Net</option>
                  <option value="Square">Square</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Created Date</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    placeholder="From"
                    value={filters.createdFrom}
                    onChange={(e) => handleFilterChange("createdFrom", e.target.value)}
                    className="px-4 py-3 rounded-2xl border border-gray-300 focus:border-teal-400 text-sm"
                  />
                  <input
                    type="date"
                    placeholder="To"
                    value={filters.createdTo}
                    onChange={(e) => handleFilterChange("createdTo", e.target.value)}
                    className="px-4 py-3 rounded-2xl border border-gray-300 focus:border-teal-400 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Updated Date</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    placeholder="From"
                    value={filters.updatedFrom}
                    onChange={(e) => handleFilterChange("updatedFrom", e.target.value)}
                    className="px-4 py-3 rounded-2xl border border-gray-300 focus:border-teal-400 text-sm"
                  />
                  <input
                    type="date"
                    placeholder="To"
                    value={filters.updatedTo}
                    onChange={(e) => handleFilterChange("updatedTo", e.target.value)}
                    className="px-4 py-3 rounded-2xl border border-gray-300 focus:border-teal-400 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 border border-gray-300 rounded-2xl text-sm font-medium hover:bg-gray-50 transition-all"
              >
                Reset Filters
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="px-6 py-2.5 bg-teal-600 text-white rounded-2xl text-sm font-medium hover:bg-teal-700 transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* COLUMNS POPUP */}
      {showColumns && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-[420px] p-6 max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Select Columns</h3>
              <button onClick={() => setShowColumns(false)} className="text-2xl text-gray-500 hover:text-black">
                ✕
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              {Object.values(visibleColumns).filter((v) => v).length} out of{" "}
              {Object.keys(visibleColumns).length} visible
            </p>

            <div className="grid grid-cols-2 gap-3">
              {Object.keys(visibleColumns).map((key) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer text-sm py-1">
                  <input
                    type="checkbox"
                    checked={visibleColumns[key as keyof typeof visibleColumns]}
                    onChange={() =>
                      setVisibleColumns((prev) => ({
                        ...prev,
                        [key]: !prev[key as keyof typeof prev],
                      }))
                    }
                    className="accent-teal-500"
                  />
                  {key === "customerGroup" ? "Customer Group" :
                   key === "paymentMethod" ? "Payment Method" :
                   key.replace(/([A-Z])/g, " $1").trim()}
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowColumns(false)}
                className="px-6 py-2 border border-gray-300 rounded-xl text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowColumns(false)}
                className="px-6 py-2 bg-teal-600 text-white rounded-xl text-sm font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACTION + PAGINATION BAR */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4 bg-gray-50">
        <div className="flex items-center gap-4">
          <select className="px-4 py-2 border border-gray-300 rounded-2xl text-sm bg-white focus:border-teal-400">
            <option>Actions</option>
            <option>Delete Selected</option>
            <option>Export Selected</option>
            <option>Activate Selected</option>
            <option>Cancel Selected</option>
          </select>

          <span className="text-sm text-gray-500">
            <span className="font-semibold text-gray-700">{filteredAgreements.length}</span> records found
            {selected.length > 0 && (
              <span className="ml-2 text-teal-600">({selected.length} selected)</span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-2xl px-3 py-1 text-sm focus:border-teal-400"
            >
              {[20, 30, 50, 100].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <span className="text-gray-400">per page</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-2xl hover:bg-teal-50 text-gray-400 hover:text-teal-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FaChevronLeft />
            </button>
            <span className="px-5 py-2 border border-gray-300 rounded-2xl text-sm font-medium">
              {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-2xl hover:bg-teal-50 text-gray-400 hover:text-teal-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1300px]">
          <thead>
            <tr className="bg-gradient-to-r from-teal-400 to-emerald-500">
              <th className="px-6 py-4 w-10">
                <input
                  type="checkbox"
                  checked={selected.length === paginatedAgreements.length && paginatedAgreements.length > 0}
                  onChange={toggleAll}
                  className="w-4 h-4 accent-white"
                />
              </th>
              {visibleColumns.id && (
                <th className={thClass}>
                  <button onClick={() => handleSort("id")} className="flex items-center gap-1 hover:text-white/80">
                    ID <FaSort className="text-white/70" />
                  </button>
                </th>
              )}
              {visibleColumns.email && (
                <th className={thClass}>
                  <button onClick={() => handleSort("email")} className="flex items-center gap-1 hover:text-white/80">
                    Email <FaSort className="text-white/70" />
                  </button>
                </th>
              )}
              {visibleColumns.firstName && <th className={thClass}>First Name</th>}
              {visibleColumns.lastName && <th className={thClass}>Last Name</th>}
              {visibleColumns.referenceId && (
                <th className={thClass}>
                  <button onClick={() => handleSort("referenceId")} className="flex items-center gap-1 hover:text-white/80">
                    Reference ID <FaSort className="text-white/70" />
                  </button>
                </th>
              )}
              {visibleColumns.status && (
                <th className={thClass}>
                  <button onClick={() => handleSort("status")} className="flex items-center gap-1 hover:text-white/80">
                    Status <FaSort className="text-white/70" />
                  </button>
                </th>
              )}
              {visibleColumns.customerGroup && <th className={thClass}>Customer Group</th>}
              {visibleColumns.paymentMethod && <th className={thClass}>Payment Method</th>}
              {visibleColumns.created && <th className={thClass}>Created</th>}
              {visibleColumns.updated && <th className={thClass}>Updated</th>}
              {visibleColumns.action && <th className={thClass + " text-right pr-8"}>Action</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedAgreements.length === 0 ? (
              <tr>
                <td colSpan={12} className="py-24 text-center">
                  <p className="text-gray-500 text-xl font-light">We couldn't find any records.</p>
                  <p className="text-gray-400 text-sm mt-3">Try adjusting your search or filters.</p>
                </td>
              </tr>
            ) : (
              paginatedAgreements.map((agreement, idx) => (
                <tr
                  key={agreement.id}
                  className={`border-b border-gray-100 hover:bg-teal-50/50 transition-all ${
                    selected.includes(agreement.id) ? "bg-teal-50" : idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selected.includes(agreement.id)}
                      onChange={() => toggleSelect(agreement.id)}
                      className="w-4 h-4 accent-teal-500"
                    />
                  </td>
                  {visibleColumns.id && (
                    <td className={`${tdClass} font-medium text-gray-900`}>#{agreement.id}</td>
                  )}
                  {visibleColumns.email && <td className={tdClass}>{agreement.email}</td>}
                  {visibleColumns.firstName && <td className={tdClass}>{agreement.firstname}</td>}
                  {visibleColumns.lastName && <td className={tdClass}>{agreement.lastname}</td>}
                  {visibleColumns.referenceId && (
                    <td className={tdClass}>
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {agreement.reference_id}
                      </span>
                    </td>
                  )}
                  {visibleColumns.status && (
                    <td className={tdClass}>
                      <span className={`px-4 py-1 text-xs font-medium rounded-full ${getStatusBadge(agreement.status)}`}>
                        {agreement.status}
                      </span>
                    </td>
                  )}
                  {visibleColumns.customerGroup && (
                    <td className={tdClass}>
                      <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded-md text-xs">
                        {agreement.customer_group}
                      </span>
                    </td>
                  )}
                  {visibleColumns.paymentMethod && (
                    <td className={tdClass}>
                      <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md text-xs">
                        {agreement.payment_method}
                      </span>
                    </td>
                  )}
                  {visibleColumns.created && <td className={tdClass}>{agreement.created_at}</td>}
                  {visibleColumns.updated && <td className={tdClass}>{agreement.updated_at}</td>}
                  {visibleColumns.action && (
                    <td className="px-6 py-4 text-right pr-8">
                      <button
                        onClick={() => navigate(`/billing-agreement/${agreement.id}`)}
                        className="text-teal-600 hover:text-teal-700 font-medium text-sm transition-colors"
                      >
                        View
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MagentoBillingAgreementsList;