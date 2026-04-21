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
} from "react-icons/fa";
import StoreViewDropdown from "../../../../component/StoreViewDropdown";
import type { StoreViewSelection } from "../../../../model/MagentoProduct/StoreViewSelection";

// ============ FAKE MAGENTO TRANSACTIONS DATA ============
interface Transaction {
  id: number;
  order_id: string;
  transaction_id: string;
  parent_transaction_id: string | null;
  payment_method: string;
  transaction_type: "capture" | "refund" | "authorize" | "void" | "settlement";
  closed: boolean;
  created_at: string;
  amount: string;
  status: "Success" | "Pending" | "Failed";
}

const paymentMethods = [
  "Credit Card", "PayPal", "Braintree", "Stripe", "Authorize.Net", 
  "Square", "Bank Transfer", "Cash on Delivery", "Venmo", "Apple Pay"
];

const transactionTypes = ["capture", "refund", "authorize", "void", "settlement"];
const statuses = ["Success", "Pending", "Failed"];

const generateRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const formatDate = (date: Date) => {
  return date.toLocaleString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).replace(/,/g, '');
};

const generateFakeTransactions = (count: number): Transaction[] => {
  const transactions: Transaction[] = [];
  const startDate = new Date(2024, 0, 1);
  const endDate = new Date();

  for (let i = 1; i <= count; i++) {
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    const transactionType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const createdDate = generateRandomDate(startDate, endDate);
    const amount = (Math.floor(Math.random() * 50000) / 100).toFixed(2);
    
    // Generate random transaction IDs
    const transactionId = `txn_${Math.random().toString(36).substring(2, 15)}`;
    const parentTransactionId = Math.random() > 0.7 ? `parent_${Math.random().toString(36).substring(2, 12)}` : null;
    
    transactions.push({
      id: 10000 + i,
      order_id: `${200000 + i}`,
      transaction_id: transactionId,
      parent_transaction_id: parentTransactionId,
      payment_method: paymentMethod,
      transaction_type: transactionType as any,
      closed: Math.random() > 0.3,
      created_at: formatDate(createdDate),
      amount: `$${amount}`,
      status: status,
    });
  }
  
  // Sort by ID descending (newest first)
  return transactions.sort((a, b) => b.id - a.id);
};

const FAKE_TRANSACTIONS = generateFakeTransactions(50);

// ============ MAIN COMPONENT ============
function MagentoTransactionList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showColumns, setShowColumns] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [perPage, setPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [storeSelection, setStoreSelection] = useState<StoreViewSelection>({ type: "all" });

  // Filter states
  const [filters, setFilters] = useState({
    idFrom: "",
    idTo: "",
    orderId: "",
    transactionId: "",
    parentTransactionId: "",
    paymentMethod: "",
    transactionType: "",
    closed: "",
    createdFrom: "",
    createdTo: "",
  });

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    orderId: true,
    transactionId: true,
    parentTransactionId: true,
    paymentMethod: true,
    transactionType: true,
    closed: true,
    created: true,
    amount: true,
    status: true,
    action: true,
  });

  // Apply filters and search
  const filteredTransactions = useMemo(() => {
    let result = [...FAKE_TRANSACTIONS];

    // Global search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (transaction) =>
          transaction.order_id.includes(searchLower) ||
          transaction.transaction_id.toLowerCase().includes(searchLower) ||
          transaction.payment_method.toLowerCase().includes(searchLower)
      );
    }

    // Apply specific filters
    if (filters.idFrom) {
      result = result.filter(t => t.id >= parseInt(filters.idFrom));
    }
    if (filters.idTo) {
      result = result.filter(t => t.id <= parseInt(filters.idTo));
    }
    if (filters.orderId) {
      result = result.filter(t => t.order_id.includes(filters.orderId));
    }
    if (filters.transactionId) {
      result = result.filter(t => 
        t.transaction_id.toLowerCase().includes(filters.transactionId.toLowerCase())
      );
    }
    if (filters.parentTransactionId) {
      result = result.filter(t => 
        t.parent_transaction_id && t.parent_transaction_id.toLowerCase().includes(filters.parentTransactionId.toLowerCase())
      );
    }
    if (filters.paymentMethod) {
      result = result.filter(t => t.payment_method === filters.paymentMethod);
    }
    if (filters.transactionType) {
      result = result.filter(t => t.transaction_type === filters.transactionType);
    }
    if (filters.closed) {
      const isClosed = filters.closed === "yes";
      result = result.filter(t => t.closed === isClosed);
    }
    if (filters.createdFrom) {
      result = result.filter(t => new Date(t.created_at) >= new Date(filters.createdFrom));
    }
    if (filters.createdTo) {
      result = result.filter(t => new Date(t.created_at) <= new Date(filters.createdTo));
    }

    return result;
  }, [FAKE_TRANSACTIONS, search, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / perPage);
  const paginatedTransactions = filteredTransactions.slice(
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
      selected.length === paginatedTransactions.length
        ? []
        : paginatedTransactions.map((i) => i.id)
    );
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      idFrom: "",
      idTo: "",
      orderId: "",
      transactionId: "",
      parentTransactionId: "",
      paymentMethod: "",
      transactionType: "",
      closed: "",
      createdFrom: "",
      createdTo: "",
    });
    setSearch("");
    setCurrentPage(1);
  };

  const getTransactionTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      capture: "bg-green-100 text-green-700",
      refund: "bg-red-100 text-red-700",
      authorize: "bg-blue-100 text-blue-700",
      void: "bg-gray-100 text-gray-700",
      settlement: "bg-purple-100 text-purple-700",
    };
    return styles[type] || "bg-gray-100 text-gray-700";
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Success: "bg-green-100 text-green-700",
      Pending: "bg-yellow-100 text-yellow-700",
      Failed: "bg-red-100 text-red-700",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  const handleExport = () => {
    const headers = ["ID", "Order ID", "Transaction ID", "Parent Transaction ID", "Payment Method", "Transaction Type", "Closed", "Created Date", "Amount", "Status"];
    const csvRows = filteredTransactions.map(transaction => [
      transaction.id,
      transaction.order_id,
      transaction.transaction_id,
      transaction.parent_transaction_id || "",
      transaction.payment_method,
      transaction.transaction_type,
      transaction.closed ? "Yes" : "No",
      transaction.created_at,
      transaction.amount,
      transaction.status
    ].join(","));

    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `transactions_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  const thClass = "px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap";
  const tdClass = "px-6 py-4 text-sm text-gray-600 whitespace-nowrap";

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">

      {/* HEADER */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Transactions</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage all payment transactions ({FAKE_TRANSACTIONS.length} total)
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
              placeholder="Search by Order ID, Transaction ID..."
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

        {/* FILTER ROW - Toggled by Filters Button */}
        {showFilters && (
          <div className="bg-gray-100 border-b px-6 py-5 mt-4 rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-9 gap-4">
              {/* ID From / To */}
              <div>
                <div className="text-xs text-gray-500 mb-1 font-medium">ID</div>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder="From" 
                    value={filters.idFrom}
                    onChange={(e) => handleFilterChange("idFrom", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-gray-300 text-sm focus:border-teal-400" 
                  />
                  <input 
                    type="text" 
                    placeholder="To" 
                    value={filters.idTo}
                    onChange={(e) => handleFilterChange("idTo", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-gray-300 text-sm focus:border-teal-400" 
                  />
                </div>
              </div>

              {/* Order ID */}
              <div>
                <div className="text-xs text-gray-500 mb-1 font-medium">Order ID</div>
                <input 
                  type="text" 
                  placeholder="Order ID" 
                  value={filters.orderId}
                  onChange={(e) => handleFilterChange("orderId", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-gray-300 text-sm focus:border-teal-400" 
                />
              </div>

              {/* Transaction ID */}
              <div>
                <div className="text-xs text-gray-500 mb-1 font-medium">Transaction ID</div>
                <input 
                  type="text" 
                  placeholder="Transaction ID" 
                  value={filters.transactionId}
                  onChange={(e) => handleFilterChange("transactionId", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-gray-300 text-sm focus:border-teal-400" 
                />
              </div>

              {/* Parent Transaction ID */}
              <div>
                <div className="text-xs text-gray-500 mb-1 font-medium">Parent Transaction ID</div>
                <input 
                  type="text" 
                  placeholder="Parent ID" 
                  value={filters.parentTransactionId}
                  onChange={(e) => handleFilterChange("parentTransactionId", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-gray-300 text-sm focus:border-teal-400" 
                />
              </div>

              {/* Payment Method */}
              <div>
                <div className="text-xs text-gray-500 mb-1 font-medium">Payment Method</div>
                <select 
                  value={filters.paymentMethod}
                  onChange={(e) => handleFilterChange("paymentMethod", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-gray-300 text-sm focus:border-teal-400"
                >
                  <option value="">All</option>
                  {paymentMethods.map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>

              {/* Transaction Type */}
              <div>
                <div className="text-xs text-gray-500 mb-1 font-medium">Transaction Type</div>
                <select 
                  value={filters.transactionType}
                  onChange={(e) => handleFilterChange("transactionType", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-gray-300 text-sm focus:border-teal-400"
                >
                  <option value="">All</option>
                  <option value="capture">Capture</option>
                  <option value="refund">Refund</option>
                  <option value="authorize">Authorize</option>
                  <option value="void">Void</option>
                  <option value="settlement">Settlement</option>
                </select>
              </div>

              {/* Closed */}
              <div>
                <div className="text-xs text-gray-500 mb-1 font-medium">Closed</div>
                <select 
                  value={filters.closed}
                  onChange={(e) => handleFilterChange("closed", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-gray-300 text-sm focus:border-teal-400"
                >
                  <option value="">All</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              {/* Created From / To */}
              <div className="lg:col-span-2">
                <div className="text-xs text-gray-500 mb-1 font-medium">Created</div>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="date" 
                    value={filters.createdFrom}
                    onChange={(e) => handleFilterChange("createdFrom", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-gray-300 text-sm focus:border-teal-400" 
                  />
                  <input 
                    type="date" 
                    value={filters.createdTo}
                    onChange={(e) => handleFilterChange("createdTo", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-gray-300 text-sm focus:border-teal-400" 
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={resetFilters}
                className="px-4 py-2 border border-gray-300 rounded-2xl text-sm font-medium hover:bg-gray-50 transition-all"
              >
                Reset Filters
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="px-4 py-2 bg-teal-600 text-white rounded-2xl text-sm font-medium hover:bg-teal-700 transition-all"
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
                  {key === "orderId" ? "Order ID" :
                   key === "transactionId" ? "Transaction ID" :
                   key === "parentTransactionId" ? "Parent Transaction ID" :
                   key === "paymentMethod" ? "Payment Method" :
                   key === "transactionType" ? "Transaction Type" :
                   key.charAt(0).toUpperCase() + key.slice(1)}
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
            <option>Refund Selected</option>
            <option>Export Selected</option>
          </select>

          <span className="text-sm text-gray-500">
            <span className="font-semibold text-gray-700">{filteredTransactions.length}</span> records found
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
                  checked={selected.length === paginatedTransactions.length && paginatedTransactions.length > 0}
                  onChange={toggleAll}
                  className="w-4 h-4 accent-white"
                />
              </th>
              {visibleColumns.id && <th className={thClass}>ID</th>}
              {visibleColumns.orderId && <th className={thClass}>Order ID</th>}
              {visibleColumns.transactionId && <th className={thClass}>Transaction ID</th>}
              {visibleColumns.parentTransactionId && <th className={thClass}>Parent Transaction ID</th>}
              {visibleColumns.paymentMethod && <th className={thClass}>Payment Method</th>}
              {visibleColumns.transactionType && <th className={thClass}>Transaction Type</th>}
              {visibleColumns.amount && <th className={thClass}>Amount</th>}
              {visibleColumns.status && <th className={thClass}>Status</th>}
              {visibleColumns.closed && <th className={thClass}>Closed</th>}
              {visibleColumns.created && <th className={thClass}>Created</th>}
              {visibleColumns.action && <th className={thClass + " text-right pr-8"}>Action</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.length === 0 ? (
              <tr>
                <td colSpan={12} className="py-24 text-center">
                  <p className="text-gray-500 text-xl font-light">We couldn't find any records.</p>
                  <p className="text-gray-400 text-sm mt-3">Try adjusting your search or filters.</p>
                </td>
              </tr>
            ) : (
              paginatedTransactions.map((transaction, idx) => (
                <tr
                  key={transaction.id}
                  className={`border-b border-gray-100 hover:bg-teal-50/50 transition-all ${
                    selected.includes(transaction.id) ? "bg-teal-50" : idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selected.includes(transaction.id)}
                      onChange={() => toggleSelect(transaction.id)}
                      className="w-4 h-4 accent-teal-500"
                    />
                  </td>
                  {visibleColumns.id && (
                    <td className={`${tdClass} font-medium text-gray-900`}>{transaction.id}</td>
                  )}
                  {visibleColumns.orderId && (
                    <td className={`${tdClass} font-medium text-teal-600`}>#{transaction.order_id}</td>
                  )}
                  {visibleColumns.transactionId && (
                    <td className={tdClass}>
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {transaction.transaction_id}
                      </span>
                    </td>
                  )}
                  {visibleColumns.parentTransactionId && (
                    <td className={tdClass}>
                      {transaction.parent_transaction_id ? (
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                          {transaction.parent_transaction_id}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  )}
                  {visibleColumns.paymentMethod && (
                    <td className={tdClass}>{transaction.payment_method}</td>
                  )}
                  {visibleColumns.transactionType && (
                    <td className={tdClass}>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getTransactionTypeBadge(transaction.transaction_type)}`}>
                        {transaction.transaction_type}
                      </span>
                    </td>
                  )}
                  {visibleColumns.amount && (
                    <td className={`${tdClass} font-semibold text-gray-900`}>{transaction.amount}</td>
                  )}
                  {visibleColumns.status && (
                    <td className={tdClass}>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadge(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                  )}
                  {visibleColumns.closed && (
                    <td className={tdClass}>
                      {transaction.closed ? (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Yes</span>
                      ) : (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">No</span>
                      )}
                    </td>
                  )}
                  {visibleColumns.created && <td className={tdClass}>{transaction.created_at}</td>}
                  {visibleColumns.action && (
                    <td className="px-6 py-4 text-right pr-8">
                      <button
                        onClick={() => navigate(`/transaction/${transaction.id}`)}
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

export default MagentoTransactionList;