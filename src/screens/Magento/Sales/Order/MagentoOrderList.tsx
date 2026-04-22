import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaFilter,
  FaColumns,
  FaFileExport,
  FaChevronDown,
} from "react-icons/fa";
import StoreViewDropdown from "../../../../component/StoreViewDropdown";
import type { StoreViewSelection } from "../../../../model/MagentoProduct/StoreViewSelection";

// ============ FAKE DATA GENERATION ============
interface MagentoOrder {
  entity_id: number;
  increment_id: string;
  order_currency_code: string;
  created_at: string;
  customer_firstname: string;
  customer_lastname: string;
  customer_email: string;
  grand_total: number;
  status: string;
  state: string;
  subtotal: number;
  shipping_amount: number;
  payment?: { method: string };
  billing_address?: { street: string[]; city: string; region?: string };
  extension_attributes?: {
    shipping_assignments?: Array<{
      shipping?: {
        address?: { street: string[]; city: string };
        method?: string;
      };
    }>;
  };
}

const firstNames = ["John", "Emma", "Michael", "Sophia", "William", "Olivia", "James", "Ava", "Robert", "Isabella", "David", "Mia", "Richard", "Charlotte", "Joseph", "Amelia", "Thomas", "Harper", "Charles", "Evelyn"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Wilson", "Anderson", "Taylor", "Thomas", "Moore", "Jackson", "Martin", "Lee", "White", "Harris"];
const statuses = ["pending", "processing", "complete", "closed", "canceled"];
const paymentMethods = ["credit_card", "paypal", "bank_transfer", "cash_on_delivery", "braintree"];
const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "Austin"];
const streets = ["123 Main St", "456 Oak Ave", "789 Pine Rd", "321 Elm Blvd", "654 Maple Dr", "987 Cedar Ln", "147 Birch St", "258 Walnut Ave"];

const generateRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const formatDate = (date: Date) => {
  return date.toISOString().slice(0, 19).replace('T', ' ');
};

const generateFakeOrders = (count: number): MagentoOrder[] => {
  const orders: MagentoOrder[] = [];
  const startDate = new Date(2024, 0, 1);
  const endDate = new Date();

  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const grandTotal = Math.floor(Math.random() * 50000) / 100 + 10;
    const subtotal = grandTotal - (Math.random() * 20);
    const shippingAmount = Math.floor(Math.random() * 1500) / 100;
    const orderDate = generateRandomDate(startDate, endDate);
    const city = cities[Math.floor(Math.random() * cities.length)];
    const street = streets[Math.floor(Math.random() * streets.length)];
    
    orders.push({
      entity_id: i,
      increment_id: `#${100000 + i}`,
      order_currency_code: "USD",
      created_at: formatDate(orderDate),
      customer_firstname: firstName,
      customer_lastname: lastName,
      customer_email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@example.com`,
      grand_total: grandTotal,
      status: status,
      state: status === "complete" ? "closed" : status === "processing" ? "processing" : "new",
      subtotal: parseFloat(subtotal.toFixed(2)),
      shipping_amount: parseFloat(shippingAmount.toFixed(2)),
      payment: {
        method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)]
      },
      billing_address: {
        street: [street],
        city: city,
        region: ["CA", "TX", "NY", "FL", "IL"][Math.floor(Math.random() * 5)]
      },
      extension_attributes: {
        shipping_assignments: [{
          shipping: {
            address: {
              street: [street],
              city: city
            },
            method: ["flatrate", "freeshipping", "table"][Math.floor(Math.random() * 3)]
          }
        }]
      }
    });
  }
  
  // Sort by date descending (newest first)
  return orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

const FAKE_ORDERS = generateFakeOrders(50);

// ============ ORDER FILTERS TYPE ============
interface OrderFilters {
  purchaseDateFrom: string;
  purchaseDateTo: string;
  grandTotalBaseFrom: string;
  grandTotalBaseTo: string;
  grandTotalPurchasedFrom: string;
  grandTotalPurchasedTo: string;
  billToName: string;
  shipToName: string;
  status: string;
  customerEmail: string;
  disputeState: string;
  purchasePoint: string;
  id: string;
}

// ============ MAIN COMPONENT ============
function MagentoOrderList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showColumns, setShowColumns] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [perPage, setPerPage] = useState(20);
  const [storeSelection, setStoreSelection] = useState<StoreViewSelection>({ type: "all" });
  const [exportType, setExportType] = useState<"csv" | "excel">("csv");
  const [showExport, setShowExport] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Column Visibility State
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    purchasePoint: true,
    purchaseDate: true,
    billToName: true,
    shipToName: true,
    grandTotalBase: true,
    grandTotalPurchased: true,
    status: true,
    billingAddress: true,
    shippingAddress: true,
    shippingInformation: true,
    customerEmail: true,
    customerGroup: true,
    subtotal: true,
    shippingAndHandling: true,
    customerName: true,
    paymentMethod: true,
    totalRefunded: true,
    action: true,
    allocatedSources: true,
    pickupLocationCode: true,
    braintreeSource: true,
    disputeState: true,
  });

  // Filter States
  const [filters, setFilters] = useState<OrderFilters>({
    purchaseDateFrom: "",
    purchaseDateTo: "",
    grandTotalBaseFrom: "",
    grandTotalBaseTo: "",
    grandTotalPurchasedFrom: "",
    grandTotalPurchasedTo: "",
    billToName: "",
    shipToName: "",
    status: "",
    customerEmail: "",
    disputeState: "",
    purchasePoint: "",
    id: "",
  });

  // Using fake data instead of API
  const orders = FAKE_ORDERS;
  const totalCount = orders.length;
  const totalPages = Math.ceil(totalCount / perPage);
  const isLoading = false;
  const error = null;

  // Apply filters to orders
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      result = result.filter((order) =>
        order.increment_id?.toLowerCase().includes(searchLower) ||
        `${order.customer_firstname} ${order.customer_lastname}`.toLowerCase().includes(searchLower) ||
        order.customer_email?.toLowerCase().includes(searchLower)
      );
    }

    // Date range filter
    if (filters.purchaseDateFrom) {
      result = result.filter(order => new Date(order.created_at) >= new Date(filters.purchaseDateFrom));
    }
    if (filters.purchaseDateTo) {
      result = result.filter(order => new Date(order.created_at) <= new Date(filters.purchaseDateTo));
    }

    // Grand total filters
    if (filters.grandTotalBaseFrom) {
      result = result.filter(order => order.grand_total >= parseFloat(filters.grandTotalBaseFrom));
    }
    if (filters.grandTotalBaseTo) {
      result = result.filter(order => order.grand_total <= parseFloat(filters.grandTotalBaseTo));
    }

    // Bill-to Name filter
    if (filters.billToName) {
      const nameLower = filters.billToName.toLowerCase();
      result = result.filter(order => 
        `${order.customer_firstname} ${order.customer_lastname}`.toLowerCase().includes(nameLower)
      );
    }

    // Status filter
    if (filters.status) {
      result = result.filter(order => order.status === filters.status);
    }

    // Customer email filter
    if (filters.customerEmail) {
      const emailLower = filters.customerEmail.toLowerCase();
      result = result.filter(order => order.customer_email?.toLowerCase().includes(emailLower));
    }

    // ID filter
    if (filters.id) {
      result = result.filter(order => order.increment_id.includes(filters.id));
    }

    return result;
  }, [orders, search, filters]);

  // Reset to page 1 when filters or perPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, perPage, search]);

  // Pagination
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelected(
      selected.length === paginatedOrders.length ? [] : paginatedOrders.map((order) => order.increment_id)
    );
  };

  const thClass = "px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap";
  const tdClass = "px-6 py-4 text-sm text-gray-600 whitespace-nowrap";

  const handleFilterChange = (key: keyof OrderFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      purchaseDateFrom: "",
      purchaseDateTo: "",
      grandTotalBaseFrom: "",
      grandTotalBaseTo: "",
      grandTotalPurchasedFrom: "",
      grandTotalPurchasedTo: "",
      billToName: "",
      shipToName: "",
      status: "",
      customerEmail: "",
      disputeState: "",
      purchasePoint: "",
      id: "",
    });
    setSearch("");
    setShowFilters(false);
  };

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const exportData = () => {
    const dataToExport = filteredOrders;

    if (exportType === "csv") {
      const headers = [
        "ID", "Purchase Point", "Purchase Date", "Bill-to Name", "Ship-to Name",
        "Grand Total (Base)", "Grand Total (Purchased)", "Status", "Billing Address",
        "Shipping Address", "Shipping Information", "Customer Email", "Customer Group",
        "Subtotal", "Shipping and Handling", "Customer Name", "Payment Method",
        "Total Refunded", "Allocated sources", "Braintree Transaction Source", "Dispute State"
      ];

      const csvRows = dataToExport.map(order => [
        order.increment_id,
        order.order_currency_code,
        order.created_at,
        `"${order.customer_firstname} ${order.customer_lastname}"`,
        `"${order.customer_firstname} ${order.customer_lastname}"`,
        order.grand_total,
        order.grand_total,
        order.status,
        `"${order.billing_address?.street?.join(", ") || ""}, ${order.billing_address?.city || ""}"`,
        `"${order.extension_attributes?.shipping_assignments?.[0]?.shipping?.address?.street?.join(", ") || ""}, ${order.extension_attributes?.shipping_assignments?.[0]?.shipping?.address?.city || ""}"`,
        `"${order.extension_attributes?.shipping_assignments?.[0]?.shipping?.method || ""}"`,
        order.customer_email,
        "General",
        order.subtotal,
        order.shipping_amount,
        `"${order.customer_firstname} ${order.customer_lastname}"`,
        `"${order.payment?.method || ""}"`,
        "0",
        order.extension_attributes?.shipping_assignments?.[0]?.shipping?.method || "",
        order.payment?.method || "",
        order.state || ""
      ].join(","));

      const csvContent = [headers.join(","), ...csvRows].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `orders_${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
    } else if (exportType === "excel") {
      let xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet">
  <Worksheet ss:Name="Orders">
    <Table>`;

      // Headers
      xml += `<Row>`;
      ["ID", "Purchase Date", "Customer Name", "Status", "Grand Total", "Customer Email", "Payment Method"].forEach(header => {
        xml += `<Cell><Data ss:Type="String">${header}</Data></Cell>`;
      });
      xml += `</Row>`;

      // Data Rows
      dataToExport.forEach(order => {
        xml += `<Row>`;
        xml += `<Cell><Data ss:Type="String">${order.increment_id}</Data></Cell>`;
        xml += `<Cell><Data ss:Type="String">${order.created_at}</Data></Cell>`;
        xml += `<Cell><Data ss:Type="String">${order.customer_firstname} ${order.customer_lastname}</Data></Cell>`;
        xml += `<Cell><Data ss:Type="String">${order.status}</Data></Cell>`;
        xml += `<Cell><Data ss:Type="Number">${order.grand_total}</Data></Cell>`;
        xml += `<Cell><Data ss:Type="String">${order.customer_email}</Data></Cell>`;
        xml += `<Cell><Data ss:Type="String">${order.payment?.method || ""}</Data></Cell>`;
        xml += `</Row>`;
      });

      xml += `</Table></Worksheet></Workbook>`;

      const blob = new Blob([xml], { type: "application/vnd.ms-excel" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `orders_${new Date().toISOString().slice(0, 10)}.xml`;
      link.click();
    }

    setShowExport(false);
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      processing: "bg-blue-100 text-blue-700",
      complete: "bg-green-100 text-green-700",
      closed: "bg-gray-100 text-gray-700",
      canceled: "bg-red-100 text-red-700"
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">

      {/* HEADER */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Orders ({totalCount})</h2>
          <button
            onClick={() => navigate("/addorder")}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all"
          >
            Create New Order
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by ID, Name, or Email..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-400 bg-gray-50 focus:bg-white"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border text-sm font-medium transition-all ${showFilters ? "border-teal-500 bg-teal-50 text-teal-600" : "border-gray-300 hover:bg-gray-50"
                }`}
            >
              <FaFilter /> Filters
            </button>

            <button
              onClick={() => setShowColumns(!showColumns)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50"
            >
              <FaColumns /> Columns <FaChevronDown className="text-xs" />
            </button>

            <button onClick={() => setShowExport(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50">
              <FaFileExport /> Export <FaChevronDown className="text-xs" />
            </button>

            <StoreViewDropdown onChange={(sel) => setStoreSelection(sel)} />
          </div>
        </div>
      </div>

      {/* EXPORT POPUP */}
      {showExport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-[380px] p-6">
            <h3 className="text-lg font-semibold mb-6">Export Orders</h3>

            <div className="space-y-4 mb-8">
              <label className="flex items-center gap-3 cursor-pointer text-base">
                <input
                  type="radio"
                  checked={exportType === "csv"}
                  onChange={() => setExportType("csv")}
                />
                CSV
              </label>

              <label className="flex items-center gap-3 cursor-pointer text-base">
                <input
                  type="radio"
                  checked={exportType === "excel"}
                  onChange={() => setExportType("excel")}
                />
                Excel XML
              </label>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowExport(false)}
                className="px-6 py-2.5 text-teal-600 font-medium hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={exportData}
                className="px-8 py-2.5 bg-gray-900 hover:bg-black text-white font-medium rounded-xl"
              >
                Export
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COLUMNS POPUP */}
      {showColumns && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-[420px] p-6 max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Columns</h3>
              <button onClick={() => setShowColumns(false)} className="text-2xl text-gray-500 hover:text-black">✕</button>
            </div>

            <p className="text-sm text-gray-500 mb-4">{Object.values(visibleColumns).filter(v => v).length} out of {Object.keys(visibleColumns).length} visible</p>

            <div className="grid grid-cols-2 gap-3">
              {Object.keys(visibleColumns).map((key) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer text-sm py-1">
                  <input
                    type="checkbox"
                    checked={visibleColumns[key as keyof typeof visibleColumns]}
                    onChange={() => toggleColumn(key)}
                    className="accent-teal-500"
                  />
                  {key.replace(/([A-Z])/g, " $1").trim()}
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

      {/* FILTERS PANEL */}
      {showFilters && (
        <div className="px-6 py-8 bg-gray-50 border-b">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-7">

            {/* Purchase Date */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Purchase Date</label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={filters.purchaseDateFrom}
                  onChange={(e) => handleFilterChange("purchaseDateFrom", e.target.value)}
                  className="border border-gray-300 rounded-xl px-4 py-3 text-sm"
                />
                <input
                  type="date"
                  value={filters.purchaseDateTo}
                  onChange={(e) => handleFilterChange("purchaseDateTo", e.target.value)}
                  className="border border-gray-300 rounded-xl px-4 py-3 text-sm"
                />
              </div>
            </div>

            {/* Grand Total (Base) */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Grand Total</label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Min $"
                  value={filters.grandTotalBaseFrom}
                  onChange={(e) => handleFilterChange("grandTotalBaseFrom", e.target.value)}
                  className="border border-gray-300 rounded-xl px-4 py-3 text-sm"
                />
                <input
                  type="number"
                  placeholder="Max $"
                  value={filters.grandTotalBaseTo}
                  onChange={(e) => handleFilterChange("grandTotalBaseTo", e.target.value)}
                  className="border border-gray-300 rounded-xl px-4 py-3 text-sm"
                />
              </div>
            </div>

            {/* Bill-to Name */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Customer Name</label>
              <input type="text" value={filters.billToName} onChange={(e) => handleFilterChange("billToName", e.target.value)} placeholder="Search by name..." className="border border-gray-300 rounded-xl px-4 py-3 w-full" />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Status</label>
              <select value={filters.status} onChange={(e) => handleFilterChange("status", e.target.value)} className="border border-gray-300 rounded-xl px-4 py-3 w-full">
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="complete">Complete</option>
                <option value="closed">Closed</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>

            {/* Customer Email */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Customer Email</label>
              <input type="email" value={filters.customerEmail} onChange={(e) => handleFilterChange("customerEmail", e.target.value)} placeholder="Search by email..." className="border border-gray-300 rounded-xl px-4 py-3 w-full" />
            </div>

            {/* ID */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Order ID</label>
              <input type="text" value={filters.id} onChange={(e) => handleFilterChange("id", e.target.value)} placeholder="Search by ID..." className="border border-gray-300 rounded-xl px-4 py-3 w-full" />
            </div>

          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-10">
            <button
              onClick={resetFilters}
              className="px-8 py-3 border border-gray-300 rounded-2xl text-sm font-medium hover:bg-gray-50"
            >
              Reset All
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="px-8 py-3 bg-teal-600 text-white rounded-2xl text-sm font-medium hover:bg-teal-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <select
              className="px-4 py-2.5 border border-gray-300 rounded-2xl text-sm bg-white appearance-none pr-8 cursor-pointer focus:outline-none focus:border-teal-500 hover:border-gray-400 transition-all"
              onChange={(e) => {
                const value = e.target.value;
                if (value && value !== "Actions") {
                  alert(`Action: ${value} applied to ${selected.length || paginatedOrders.length} selected records`);
                  e.target.value = "Actions";
                }
              }}
            >
              <option value="Actions" disabled selected>Actions</option>
              <option value="Cancel">Cancel</option>
              <option value="Hold">Hold</option>
              <option value="Unhold">Unhold</option>
              <option value="Print Invoices">Print Invoices</option>
              <option value="Print Packing Slips">Print Packing Slips</option>
              <option value="Print Credit Memos">Print Credit Memos</option>
              <option value="Print All">Print All</option>
              <option value="Print Shipping Labels">Print Shipping Labels</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▼</div>
          </div>

          <span className="text-sm text-gray-600 font-medium">
            {filteredOrders.length} records found
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <select
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-xl bg-white focus:outline-none focus:border-teal-500 text-sm cursor-pointer"
            >
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>per page</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-40 transition-all"
            >
              ←
            </button>

            <div className="px-5 py-2 text-sm font-medium text-gray-800 bg-white border border-gray-200 rounded-xl">
              Page {currentPage} of {totalPages}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-40 transition-all"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[2400px]">
          <thead>
            <tr className="bg-gradient-to-r from-teal-400 to-emerald-500 text-white">
              <th className="px-6 py-4 w-10"><input type="checkbox" className="accent-white" onChange={toggleAll} /></th>
              {visibleColumns.id && <th className={thClass}>ID</th>}
              {visibleColumns.purchasePoint && <th className={thClass}>Purchase Point</th>}
              {visibleColumns.purchaseDate && <th className={thClass}>Purchase Date</th>}
              {visibleColumns.billToName && <th className={thClass}>Bill-to Name</th>}
              {visibleColumns.shipToName && <th className={thClass}>Ship-to Name</th>}
              {visibleColumns.grandTotalBase && <th className={thClass}>Grand Total (Base)</th>}
              {visibleColumns.grandTotalPurchased && <th className={thClass}>Grand Total (Purchased)</th>}
              {visibleColumns.status && <th className={thClass}>Status</th>}
              {visibleColumns.billingAddress && <th className={thClass}>Billing Address</th>}
              {visibleColumns.shippingAddress && <th className={thClass}>Shipping Address</th>}
              {visibleColumns.shippingInformation && <th className={thClass}>Shipping Information</th>}
              {visibleColumns.customerEmail && <th className={thClass}>Customer Email</th>}
              {visibleColumns.customerGroup && <th className={thClass}>Customer Group</th>}
              {visibleColumns.subtotal && <th className={thClass}>Subtotal</th>}
              {visibleColumns.shippingAndHandling && <th className={thClass}>Shipping and Handling</th>}
              {visibleColumns.customerName && <th className={thClass}>Customer Name</th>}
              {visibleColumns.paymentMethod && <th className={thClass}>Payment Method</th>}
              {visibleColumns.totalRefunded && <th className={thClass}>Total Refunded</th>}
              {visibleColumns.action && <th className={thClass}>Action</th>}
              {visibleColumns.allocatedSources && <th className={thClass}>Allocated sources</th>}
              {visibleColumns.pickupLocationCode && <th className={thClass}>Pickup Location Code</th>}
              {visibleColumns.braintreeSource && <th className={thClass}>Braintree Transaction Source</th>}
              {visibleColumns.disputeState && <th className={thClass}>Dispute State</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.length === 0 ? (
              <tr>
                <td colSpan={30} className="py-20 text-center">
                  <p className="text-gray-500 text-xl">We couldn't find any records matching your filters.</p>
                </td>
              </tr>
            ) : (
              paginatedOrders.map((order: MagentoOrder, idx: number) => (
                <tr key={order.entity_id} className={`border-b border-gray-100 hover:bg-teal-50/60 transition-all ${idx % 2 === 1 ? "bg-gray-50" : "bg-white"}`}>
                  <td className="px-6 py-4">
                    <input type="checkbox" checked={selected.includes(order.increment_id)} onChange={() => toggleSelect(order.increment_id)} className="accent-teal-500" />
                  </td>
                  {visibleColumns.id && <td className={`${tdClass} font-medium text-teal-600`}>{order.increment_id}</td>}
                  {visibleColumns.purchasePoint && <td className={tdClass}>{order.order_currency_code}</td>}
                  {visibleColumns.purchaseDate && <td className={tdClass}>{new Date(order.created_at).toLocaleDateString()}</td>}
                  {visibleColumns.billToName && <td className={tdClass}>{order.customer_firstname} {order.customer_lastname}</td>}
                  {visibleColumns.shipToName && <td className={tdClass}>{order.customer_firstname} {order.customer_lastname}</td>}
                  {visibleColumns.grandTotalBase && <td className={`${tdClass} font-semibold`}>${order.grand_total.toFixed(2)}</td>}
                  {visibleColumns.grandTotalPurchased && <td className={`${tdClass} font-semibold`}>${order.grand_total.toFixed(2)}</td>}
                  {visibleColumns.status && <td className={tdClass}>
                    <span className={`px-3 py-1 text-xs rounded-full ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </td>}
                  {visibleColumns.billingAddress && <td className={tdClass}>
                    {order.billing_address?.street?.join(", ")} {order.billing_address?.city}
                  </td>}
                  {visibleColumns.shippingAddress && <td className={tdClass}>
                    {order.extension_attributes?.shipping_assignments?.[0]?.shipping?.address?.street?.join(", ")} {order.extension_attributes?.shipping_assignments?.[0]?.shipping?.address?.city}
                  </td>}
                  {visibleColumns.shippingInformation && <td className={tdClass}>
                    {order.extension_attributes?.shipping_assignments?.[0]?.shipping?.method || "-"}
                  </td>}
                  {visibleColumns.customerEmail && <td className={tdClass}>{order.customer_email}</td>}
                  {visibleColumns.customerGroup && <td className={tdClass}>General</td>}
                  {visibleColumns.subtotal && <td className={tdClass}>${order.subtotal.toFixed(2)}</td>}
                  {visibleColumns.shippingAndHandling && <td className={tdClass}>${order.shipping_amount.toFixed(2)}</td>}
                  {visibleColumns.customerName && <td className={tdClass}>{order.customer_firstname} {order.customer_lastname}</td>}
                  {visibleColumns.paymentMethod && <td className={tdClass}>
                    <span className="capitalize">{order.payment?.method?.replace("_", " ") || "-"}</span>
                  </td>}
                  {visibleColumns.totalRefunded && <td className={tdClass}>$0.00</td>}
                  {visibleColumns.action && (
                    <td 
                      onClick={() => navigate(`/orders/${order.entity_id}`)} 
                      className="px-6 py-4 text-teal-600 hover:text-teal-700 cursor-pointer font-medium"
                    >
                      View
                    </td>
                  )}
                  {visibleColumns.allocatedSources && <td className={tdClass}>Default Source</td>}
                  {visibleColumns.pickupLocationCode && <td className={tdClass}>-</td>}
                  {visibleColumns.braintreeSource && <td className={tdClass}>{order.payment?.method || "-"}</td>}
                  {visibleColumns.disputeState && <td className={tdClass}>{order.state || "-"}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MagentoOrderList;