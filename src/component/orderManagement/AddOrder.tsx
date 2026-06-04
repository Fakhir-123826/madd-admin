import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Minus, Package, Plus, Search, Trash2, User, Loader2 } from "lucide-react";
import { useGetVendorsQuery } from "../../app/api/VendorSlices/VendorApi";
import { useGetStoresByVendorQuery } from "../../app/api/StoreSlices/StoreApi";
import { useGetVendorProductsQuery, type VendorProduct } from "../../app/api/ProductSlices/ProductApi";
import { useCreateManualOrderMutation } from "../../app/api/OrderSlices/OrderApi";
import { useGetCustomersQuery } from "../../app/api/CustomerSlices/CustomerApi";
import { useGetPaymentMethodsQuery, useGetShippingMethodsQuery } from "../../app/api/CartSlices/CartApi";
import SearchableSelect from "../SearchableSelect";

const fallbackEmail = "naimyaqoob10@gmail.com";

const customerGroups = ["General", "Retailer", "Wholesale"] as const;

const countries = [
  { code: "US", label: "United States" },
  { code: "PK", label: "Pakistan" },
  { code: "AE", label: "United Arab Emirates" },
  { code: "GB", label: "United Kingdom" },
];

type AddressForm = {
  prefix: string;
  firstname: string;
  middlename: string;
  lastname: string;
  suffix: string;
  company: string;
  street: string;
  country_id: string;
  region: string;
  city: string;
  postcode: string;
  telephone: string;
  fax: string;
  vat_id: string;
};

type SelectedProduct = {
  uuid: string;
  name: string;
  sku: string;
  price: number;
  qty: number;
};

type PaymentMethod = {
  code: string;
  title: string;
  is_default: boolean;
  sort_order: number;
};

type ShippingMethod = {
  carrier_code: string;
  method_code: string;
  carrier_title: string;
  method_title: string;
  amount: number;
  base_amount: number;
  price_incl_tax: number;
  error_message?: string | null;
};

const emptyAddress: AddressForm = {
  prefix: "",
  firstname: "",
  middlename: "",
  lastname: "",
  suffix: "",
  company: "",
  street: "",
  country_id: "US",
  region: "California",
  city: "",
  postcode: "",
  telephone: "",
  fax: "",
  vat_id: "",
};

const money = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value || 0);

function AddOrder() {
  const navigate = useNavigate();
  const [selectedVendorUuid, setSelectedVendorUuid] = useState("");
  const [selectedStoreUuid, setSelectedStoreUuid] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | "">("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerGroup, setCustomerGroup] = useState<(typeof customerGroups)[number]>("General");
  const [productSearch, setProductSearch] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [billingAddress, setBillingAddress] = useState<AddressForm>(emptyAddress);
  const [shippingAddress, setShippingAddress] = useState<AddressForm>(emptyAddress);
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("checkmo");
  const [selectedShippingMethod, setSelectedShippingMethod] = useState("");
  const [historyComment, setHistoryComment] = useState("");
  const [appendComment, setAppendComment] = useState(true);
  const [emailConfirmation, setEmailConfirmation] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  
  // Debounce for shipping address to avoid too many API calls
  const [debouncedShippingAddress, setDebouncedShippingAddress] = useState<AddressForm>(shippingAddress);

  const { data: vendorsData } = useGetVendorsQuery();
  const vendors = vendorsData?.data || [];
  const selectedVendor = vendors.find((vendor: any) => vendor.uuid === selectedVendorUuid);

  const { data: storesData, isLoading: storesLoading } = useGetStoresByVendorQuery(selectedVendorUuid, {
    skip: !selectedVendorUuid,
  });
  const stores = storesData?.data?.stores || [];
  const selectedStore = stores.find((store: any) => store.uuid === selectedStoreUuid);

  const { data: customersData, isLoading: customersLoading } = useGetCustomersQuery(
    { vendor_uuid: selectedVendorUuid },
    { skip: !selectedVendorUuid }
  );
  const customers = customersData?.data || [];

  const { data: productsData, isFetching: productsLoading } = useGetVendorProductsQuery(
    {
      vendor_uuid: selectedVendorUuid,
      store_uuid: selectedStoreUuid || undefined,
      search: productSearch.length >= 2 ? productSearch : undefined,
      status: 'active',
      per_page: 20,
      limited: true,
    },
    { skip: !selectedVendorUuid || !selectedStoreUuid }
  );
  const products = productsData?.data?.data || [];

  // ✅ Dynamic Payment Methods
  const { 
    data: paymentMethods = [], 
    isLoading: paymentLoading,
    refetch: refetchPayment 
  } = useGetPaymentMethodsQuery(
    {
      vendor_uuid: selectedVendorUuid,
      store_uuid: selectedStoreUuid,
      customer_id: Number(selectedCustomerId),
    },
    { skip: !selectedVendorUuid || !selectedStoreUuid || !selectedCustomerId }
  );

  // ✅ Dynamic Shipping Methods
  const { 
    data: shippingMethods = [], 
    isLoading: shippingLoading,
    refetch: refetchShipping 
  } = useGetShippingMethodsQuery(
    {
      vendor_uuid: selectedVendorUuid,
      store_uuid: selectedStoreUuid,
      customer_id: Number(selectedCustomerId),
      shipping_address: {
        country_id: debouncedShippingAddress.country_id,
        region: debouncedShippingAddress.region,
        city: debouncedShippingAddress.city,
        postcode: debouncedShippingAddress.postcode,
        street: debouncedShippingAddress.street,
        firstname: debouncedShippingAddress.firstname,
        lastname: debouncedShippingAddress.lastname,
        telephone: debouncedShippingAddress.telephone,
      },
    },
    { 
      skip: !selectedVendorUuid || !selectedStoreUuid || !selectedCustomerId || 
             !debouncedShippingAddress.country_id || !debouncedShippingAddress.postcode 
    }
  );

  const [createManualOrder, { isLoading: isCreating }] = useCreateManualOrderMutation();

  // Set default payment method when methods load
  useEffect(() => {
    if (paymentMethods.length > 0 && !selectedPaymentMethod) {
      const defaultMethod = paymentMethods.find(m => m.is_default) || paymentMethods[0];
      setSelectedPaymentMethod(defaultMethod.code);
    }
  }, [paymentMethods, selectedPaymentMethod]);

  // Set default shipping method when methods load
  useEffect(() => {
    if (shippingMethods.length > 0 && !selectedShippingMethod) {
      setSelectedShippingMethod(`${shippingMethods[0].carrier_code}_${shippingMethods[0].method_code}`);
    }
  }, [shippingMethods, selectedShippingMethod]);

  // Debounce shipping address to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (shippingAddress.country_id && shippingAddress.postcode) {
        setDebouncedShippingAddress(shippingAddress);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [shippingAddress]);

  // Refetch shipping methods when shipping address changes
  // useEffect(() => {
  //   if (debouncedShippingAddress.country_id && debouncedShippingAddress.postcode) {
  //     refetchShipping();
  //   }
  // }, [debouncedShippingAddress, refetchShipping]);

  const getSelectedShippingMethod = () => {
    return shippingMethods.find(
      (method) => `${method.carrier_code}_${method.method_code}` === selectedShippingMethod
    );
  };

  const selectedShippingMethodObj = getSelectedShippingMethod();

  const subtotal = useMemo(
    () => selectedProducts.reduce((sum, product) => sum + product.price * product.qty, 0),
    [selectedProducts]
  );
  const discount = couponCode.trim() ? subtotal * 0.1 : 0;
  const grandTotal = Math.max(subtotal - discount + (selectedShippingMethodObj?.amount || 0), 0);

  useEffect(() => {
    if (sameAsBilling) {
      setShippingAddress(billingAddress);
    }
  }, [billingAddress, sameAsBilling]);

  useEffect(() => {
    const customer = customers.find((item: any) => item.id === selectedCustomerId);

    setCustomerEmail(customer?.email || fallbackEmail);

    if (customer) {
      setBillingAddress((prev) => ({
        ...prev,
        firstname: customer.first_name || "",
        lastname: customer.last_name || "",
        telephone: customer.phone || "",
      }));

      if (sameAsBilling) {
        setShippingAddress((prev) => ({
          ...prev,
          firstname: customer.first_name || "",
          lastname: customer.last_name || "",
          telephone: customer.phone || "",
        }));
      }
    }
  }, [selectedCustomerId, customers, sameAsBilling]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const addProduct = (product: VendorProduct) => {
    const sku = product.magento_sku || product.sku;
    setSelectedProducts((current) => {
      const existing = current.find((item) => item.uuid === product.uuid);
      if (existing) {
        return current.map((item) =>
          item.uuid === product.uuid ? { ...item, qty: item.qty + 1 } : item
        );
      }

      return [
        ...current,
        {
          uuid: product.uuid,
          name: product.name,
          sku,
          price: Number(product.price || 0),
          qty: 1,
        },
      ];
    });
  };

  const updateQty = (uuid: string, delta: number) => {
    setSelectedProducts((current) =>
      current.map((item) =>
        item.uuid === uuid ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  const removeProduct = (uuid: string) => {
    setSelectedProducts((current) => current.filter((item) => item.uuid !== uuid));
  };

  const updateAddress = (
    type: "billing" | "shipping",
    field: keyof AddressForm,
    value: string
  ) => {
    if (type === "billing") {
      setBillingAddress((current) => ({ ...current, [field]: value }));
    } else {
      setShippingAddress((current) => ({ ...current, [field]: value }));
    }
  };

  const canSubmit =
    selectedVendorUuid &&
    selectedStoreUuid &&
    selectedCustomerId &&
    customerEmail &&
    selectedProducts.length > 0 &&
    billingAddress.firstname &&
    billingAddress.lastname &&
    billingAddress.street &&
    billingAddress.city &&
    billingAddress.postcode &&
    shippingAddress.firstname &&
    shippingAddress.lastname &&
    shippingAddress.street &&
    shippingAddress.city &&
    shippingAddress.postcode &&
    selectedPaymentMethod &&
    selectedShippingMethod;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!canSubmit) {
      showToast("error", "Please complete all required fields.");
      return;
    }

    const shippingMethodObj = getSelectedShippingMethod();
    if (!shippingMethodObj) {
      showToast("error", "Please select a shipping method.");
      return;
    }

    try {
      await createManualOrder({
        vendor_uuid: selectedVendorUuid,
        store_uuid: selectedStoreUuid,
        customer: {
          id: Number(selectedCustomerId),
          email: customerEmail || fallbackEmail,
          group: customerGroup,
        },
        items: selectedProducts.map((product) => ({
          product_uuid: product.uuid,
          sku: product.sku,
          qty: product.qty,
          price: product.price,
        })),
        coupon_code: couponCode || undefined,
        billing_address: billingAddress,
        shipping_address: shippingAddress,
        payment_method: selectedPaymentMethod,
        shipping_method: {
          carrier_code: shippingMethodObj.carrier_code,
          method_code: shippingMethodObj.method_code,
          label: shippingMethodObj.carrier_title,
        },
        shipping_amount: shippingMethodObj.amount,
        history: {
          comment: historyComment,
          append_comment: appendComment,
          email_confirmation: emailConfirmation,
        },
        totals: {
          subtotal,
          discount,
          shipping: shippingMethodObj.amount,
          grand_total: grandTotal,
        },
      }).unwrap();

      showToast("success", "Order created successfully!");
      setTimeout(() => navigate("/orderlist"), 2000);
    } catch (error: any) {
      showToast("error", error?.data?.message || error?.error || "Failed to create order.");
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      {toast && (
        <div className={`fixed right-5 top-5 z-50 rounded-xl px-5 py-3 text-sm shadow-lg ${
          toast.type === "success" 
            ? "bg-green-50 text-green-700 border border-green-200" 
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {toast.message}
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate("/orderlist")}
            className="mb-2 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft size={16} /> Back to orders
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Create New Order</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
        <div className="space-y-6">
          {/* Vendor, Store & Customer Section */}
          <section className="rounded-xl border border-gray-200 p-5">
            <h2 className="mb-4 text-sm font-bold uppercase text-gray-600">Vendor, Store & Customer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <SearchableSelect
                options={vendors.map((vendor: any) => ({
                  value: vendor.uuid,
                  label: vendor.company_name || vendor.name,
                }))}
                value={selectedVendorUuid}
                onChange={(value: any) => {
                  setSelectedVendorUuid(value);
                  setSelectedStoreUuid("");
                  setSelectedProducts([]);
                  setSelectedCustomerId("");
                  setSelectedPaymentMethod("");
                  setSelectedShippingMethod("");
                }}
                placeholder="Select Vendor *"
              />

              <SearchableSelect
                options={stores.map((store: any) => ({
                  value: store.uuid,
                  label: store.store_name,
                }))}
                value={selectedStoreUuid}
                onChange={(value: any) => {
                  setSelectedStoreUuid(value);
                  setSelectedProducts([]);
                  setSelectedPaymentMethod("");
                  setSelectedShippingMethod("");
                }}
                placeholder={storesLoading ? "Loading Stores..." : "Select Store *"}
              />

              <SearchableSelect
                options={customers.map((customer: any) => ({
                  value: customer.id,
                  label: `${customer.firstname} ${customer.lastname}`,
                }))}
                value={selectedCustomerId}
                onChange={(value: any) => {
                  setSelectedCustomerId(value);
                  setSelectedPaymentMethod("");
                  setSelectedShippingMethod("");
                }}
                placeholder={customersLoading ? "Loading Customers..." : "Select Customer *"}
              />

              <SearchableSelect
                options={customerGroups.map((group) => ({
                  value: group,
                  label: group,
                }))}
                value={customerGroup}
                onChange={(value: any) => setCustomerGroup(value)}
                placeholder="Select Customer Group"
              />
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
              <Mail size={16} className="text-teal-500" />
              <span>{customerEmail || "Customer email will populate after selection"}</span>
            </div>
          </section>

          {/* Products Section */}
          <section className="rounded-xl border border-gray-200 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase text-gray-600">Products</h2>
              <span className="text-xs text-gray-400">Loaded from local database</span>
            </div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 text-gray-300" size={18} />
              <input
                value={productSearch}
                onChange={(event) => setProductSearch(event.target.value)}
                disabled={!selectedVendorUuid || !selectedStoreUuid}
                placeholder="Search products by name or SKU"
                className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm disabled:bg-gray-50"
              />
            </div>

            <div className="mb-5 grid grid-cols-1 md:grid-cols-2 gap-3">
              {productsLoading ? (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading products...
                </div>
              ) : !selectedVendorUuid ? (
                <div className="text-sm text-gray-400">Please select a vendor first</div>
              ) : !selectedStoreUuid ? (
                <div className="text-sm text-gray-400">Please select a store first</div>
              ) : products.length === 0 ? (
                <div className="text-sm text-gray-400">
                  No products found for this vendor/store.
                  {productSearch && " Try different search terms."}
                </div>
              ) : (
                products.map((product: any) => (
                  <button
                    type="button"
                    key={product.uuid}
                    onClick={() => addProduct(product)}
                    className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-left hover:border-teal-300 hover:bg-teal-50 transition-all"
                  >
                    <span>
                      <span className="block text-sm font-semibold text-gray-700">{product.name}</span>
                      <span className="text-xs text-gray-400">{product.magento_sku || product.sku}</span>
                      {product.quantity !== undefined && (
                        <span className="text-xs text-gray-400">Stock: {product.quantity}</span>
                      )}
                    </span>
                    <span className="text-sm font-bold text-teal-600">
                      {money(Number(product.price || 0))}
                    </span>
                  </button>
                ))
              )}
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              {selectedProducts.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-400">
                  <Package className="mx-auto mb-2 text-gray-300" />
                  Selected products will appear here.
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedProducts.map((product) => (
                    <div key={product.uuid} className="grid grid-cols-1 md:grid-cols-[1fr_110px_130px_40px] gap-3 rounded-xl bg-white p-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-700">{product.name}</p>
                        <p className="text-xs text-gray-400">SKU: {product.sku}</p>
                        <p className="text-xs text-gray-500">{money(product.price)} each</p>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <button type="button" onClick={() => updateQty(product.uuid, -1)} className="rounded-lg border p-2">
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{product.qty}</span>
                        <button type="button" onClick={() => updateQty(product.uuid, 1)} className="rounded-lg border p-2">
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="flex items-center justify-end text-sm font-bold text-gray-700">
                        {money(product.price * product.qty)}
                      </div>
                      <button type="button" onClick={() => removeProduct(product.uuid)} className="text-red-500">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Addresses Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AddressSection 
              title="Billing Address" 
              address={billingAddress} 
              onChange={(field, value) => updateAddress("billing", field, value)} 
            />
            <div>
              <label className="mb-3 flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={sameAsBilling}
                  onChange={(event) => {
                    setSameAsBilling(event.target.checked);
                    if (event.target.checked) setShippingAddress(billingAddress);
                  }}
                />
                Same As Billing Address
              </label>
              <AddressSection
                title="Shipping Address"
                address={shippingAddress}
                disabled={sameAsBilling}
                onChange={(field, value) => updateAddress("shipping", field, value)}
              />
            </div>
          </section>

          {/* Payment & Shipping Methods Section - DYNAMIC */}
          <section className="rounded-xl border border-gray-200 p-5">
            <h2 className="mb-4 text-sm font-bold uppercase text-gray-600">Payment & Shipping Methods</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Payment Methods Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
                {paymentLoading ? (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading payment methods...
                  </div>
                ) : paymentMethods.length > 0 ? (
                  <select
                    value={selectedPaymentMethod}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                  >
                    {paymentMethods.map((method: PaymentMethod) => (
                      <option key={method.code} value={method.code}>
                        {method.title}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-sm text-red-500">No payment methods available. Please check Magento configuration.</div>
                )}
              </div>

              {/* Shipping Methods Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Method *</label>
                {shippingLoading ? (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading shipping methods...
                  </div>
                ) : shippingMethods.length > 0 ? (
                  <select
                    value={selectedShippingMethod}
                    onChange={(e) => setSelectedShippingMethod(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                  >
                    {shippingMethods.map((method: ShippingMethod) => (
                      <option 
                        key={`${method.carrier_code}_${method.method_code}`} 
                        value={`${method.carrier_code}_${method.method_code}`}
                      >
                        {method.carrier_title} - {method.method_title} ({money(method.amount)})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-sm text-yellow-500">
                    {shippingAddress.country_id && shippingAddress.postcode 
                      ? "No shipping methods available for this address. Please check Magento configuration."
                      : "Please enter shipping address (Country & Postcode) to see available shipping methods."}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Order History Section */}
          <section className="rounded-xl border border-gray-200 p-5">
            <h2 className="mb-4 text-sm font-bold uppercase text-gray-600">Order History</h2>
            <textarea
              value={historyComment}
              onChange={(event) => setHistoryComment(event.target.value)}
              rows={4}
              placeholder="Order comments"
              className="mb-3 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
            />
            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={appendComment} onChange={(event) => setAppendComment(event.target.checked)} />
                Append Comment
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={emailConfirmation} onChange={(event) => setEmailConfirmation(event.target.checked)} />
                Email Order Confirmation
              </label>
            </div>
          </section>
        </div>

        {/* Order Summary Sidebar */}
        <aside className="h-fit rounded-xl border border-gray-200 p-5 xl:sticky xl:top-6">
          <h2 className="mb-4 text-sm font-bold uppercase text-gray-600">Order Summary</h2>
          <input
            value={couponCode}
            onChange={(event) => setCouponCode(event.target.value)}
            placeholder="Discount Coupon"
            className="mb-4 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm"
          />
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <strong>{money(subtotal)}</strong>
            </div>
            {discount > 0 && (
              <div className="flex justify-between">
                <span>Coupon Discount</span>
                <strong className="text-red-500">-{money(discount)}</strong>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping & Handling</span>
              <strong>{money(selectedShippingMethodObj?.amount || 0)}</strong>
            </div>
            <div className="border-t pt-3 flex justify-between text-lg">
              <span>Grand Total</span>
              <strong className="text-teal-600">{money(grandTotal)}</strong>
            </div>
          </div>
          <button
            type="submit"
            disabled={!canSubmit || isCreating}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-teal-500 to-green-500 px-5 py-3 font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? "Creating Order..." : "Submit Order"}
          </button>
        </aside>
      </form>
    </div>
  );
}

// Address Section Component
const AddressSection = ({
  title,
  address,
  disabled = false,
  onChange,
}: {
  title: string;
  address: AddressForm;
  disabled?: boolean;
  onChange: (field: keyof AddressForm, value: string) => void;
}) => {
  const inputClass = "rounded-xl border border-gray-200 px-4 py-2.5 text-sm disabled:bg-gray-50";

  return (
    <section className="rounded-xl border border-gray-200 p-5">
      <h2 className="mb-4 text-sm font-bold uppercase text-gray-600">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input disabled={disabled} value={address.prefix} onChange={(e) => onChange("prefix", e.target.value)} className={inputClass} placeholder="Name Prefix" />
        <input disabled={disabled} value={address.firstname} onChange={(e) => onChange("firstname", e.target.value)} className={inputClass} placeholder="First Name *" />
        <input disabled={disabled} value={address.middlename} onChange={(e) => onChange("middlename", e.target.value)} className={inputClass} placeholder="Middle Name / Initial" />
        <input disabled={disabled} value={address.lastname} onChange={(e) => onChange("lastname", e.target.value)} className={inputClass} placeholder="Last Name *" />
        <input disabled={disabled} value={address.suffix} onChange={(e) => onChange("suffix", e.target.value)} className={inputClass} placeholder="Name Suffix" />
        <input disabled={disabled} value={address.company} onChange={(e) => onChange("company", e.target.value)} className={inputClass} placeholder="Company" />
        <textarea disabled={disabled} value={address.street} onChange={(e) => onChange("street", e.target.value)} className={`${inputClass} md:col-span-2`} rows={3} placeholder="Street Address *" />
        <select disabled={disabled} value={address.country_id} onChange={(e) => onChange("country_id", e.target.value)} className={inputClass}>
          {countries.map((country) => <option key={country.code} value={country.code}>{country.label}</option>)}
        </select>
        <input disabled={disabled} value={address.region} onChange={(e) => onChange("region", e.target.value)} className={inputClass} placeholder="State/Region *" />
        <input disabled={disabled} value={address.city} onChange={(e) => onChange("city", e.target.value)} className={inputClass} placeholder="City *" />
        <input disabled={disabled} value={address.postcode} onChange={(e) => onChange("postcode", e.target.value)} className={inputClass} placeholder="Zip / Postal Code *" />
        <input disabled={disabled} value={address.telephone} onChange={(e) => onChange("telephone", e.target.value)} className={inputClass} placeholder="Phone Number" />
        <input disabled={disabled} value={address.fax} onChange={(e) => onChange("fax", e.target.value)} className={inputClass} placeholder="Fax" />
        <input disabled={disabled} value={address.vat_id} onChange={(e) => onChange("vat_id", e.target.value)} className={inputClass} placeholder="VAT Number" />
      </div>
    </section>
  );
};

export default AddOrder;