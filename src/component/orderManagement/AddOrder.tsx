import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Minus, Package, Plus, Search, Trash2, User } from "lucide-react";
import { useGetVendorsQuery } from "../../app/api/VendorSlices/VendorApi";
import { useGetStoresByVendorQuery } from "../../app/api/StoreSlices/StoreApi";
import { useGetProductsQuery, type Product } from "../../app/api/ProductSlices/ProductApi";
import { useCreateManualOrderMutation } from "../../app/api/OrderSlices/OrderApi";

const fallbackEmail = "naimyaqoob10@gmail.com";

const customers = [
  { id: 1, name: "Customer ID 1", email: "customer1@example.com" },
  { id: 2, name: "Customer ID 2", email: "" },
];

const customerGroups = ["General", "Retailer", "Wholesale"] as const;

const countries = [
  { code: "US", label: "United States" },
  { code: "PK", label: "Pakistan" },
  { code: "AE", label: "United Arab Emirates" },
  { code: "GB", label: "United Kingdom" },
];

const states = ["California", "New York", "Punjab", "Sindh", "Dubai", "England"];

const shippingMethods = [
  { label: "Flat Rate", carrier_code: "flatrate", method_code: "flatrate", amount: 10 },
  { label: "Free Shipping", carrier_code: "freeshipping", method_code: "freeshipping", amount: 0 },
  { label: "Best Way", carrier_code: "tablerate", method_code: "bestway", amount: 15 },
];

const paymentMethods = [
  { label: "Check / Money Order", value: "checkmo" },
  { label: "Bank Transfer", value: "banktransfer" },
  { label: "Cash On Delivery", value: "cashondelivery" },
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
  const [paymentMethod, setPaymentMethod] = useState("checkmo");
  const [shippingMethodKey, setShippingMethodKey] = useState("flatrate_flatrate");
  const [historyComment, setHistoryComment] = useState("");
  const [appendComment, setAppendComment] = useState(true);
  const [emailConfirmation, setEmailConfirmation] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const { data: vendorsData } = useGetVendorsQuery();
  const vendors = vendorsData?.data || [];
  const selectedVendor = vendors.find((vendor: any) => vendor.uuid === selectedVendorUuid);

  const { data: storesData, isLoading: storesLoading } = useGetStoresByVendorQuery(selectedVendorUuid, {
    skip: !selectedVendorUuid,
  });
  const stores = storesData?.data?.stores || [];
  const selectedStore = stores.find((store) => store.uuid === selectedStoreUuid);

  const { data: productsData, isFetching: productsLoading } = useGetProductsQuery(
    {
      vendor_id: selectedVendor?.id,
      vendor_store_id: selectedStore?.id,
      store_uuid: selectedStoreUuid,
      search: productSearch.length >= 2 ? productSearch : undefined,
      status: "active",
      per_page: 20,
    },
    { skip: !selectedVendor?.id || !selectedStore?.id }
  );
  const products = productsData?.data || [];

  const [createManualOrder, { isLoading: isCreating }] = useCreateManualOrderMutation();

  const selectedShippingMethod = shippingMethods.find(
    (method) => `${method.carrier_code}_${method.method_code}` === shippingMethodKey
  ) || shippingMethods[0];

  const subtotal = useMemo(
    () => selectedProducts.reduce((sum, product) => sum + product.price * product.qty, 0),
    [selectedProducts]
  );
  const discount = couponCode.trim() ? subtotal * 0.1 : 0;
  const grandTotal = Math.max(subtotal - discount + selectedShippingMethod.amount, 0);

  useEffect(() => {
    if (sameAsBilling) {
      setShippingAddress(billingAddress);
    }
  }, [billingAddress, sameAsBilling]);

  useEffect(() => {
    const customer = customers.find((item) => item.id === selectedCustomerId);
    setCustomerEmail(customer ? customer.email || fallbackEmail : "");
  }, [selectedCustomerId]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const addProduct = (product: Product) => {
    const sku = product.magento_sku || product.sku;
    setSelectedProducts((current) => {
      const existing = current.find((item) => item.uuid === product.uuid);
      if (existing) {
        return current.map((item) => item.uuid === product.uuid ? { ...item, qty: item.qty + 1 } : item);
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
    shippingAddress.postcode;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!canSubmit) {
      showToast("error", "Please complete vendor, store, customer, products, and required address fields.");
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
        payment_method: paymentMethod,
        shipping_method: selectedShippingMethod,
        shipping_amount: selectedShippingMethod.amount,
        history: {
          comment: historyComment,
          append_comment: appendComment,
          email_confirmation: emailConfirmation,
        },
        totals: {
          subtotal,
          discount,
          shipping: selectedShippingMethod.amount,
          grand_total: grandTotal,
        },
      }).unwrap();

      showToast("success", "Order created in Magento and synchronized locally.");
      setTimeout(() => navigate("/orderlist"), 700);
    } catch (error: any) {
      showToast("error", error?.data?.message || error?.error || "Failed to create order.");
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      {toast && (
        <div className={`fixed right-5 top-5 z-50 rounded-xl px-5 py-3 text-sm shadow-lg ${
          toast.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
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
          <section className="rounded-xl border border-gray-200 p-5">
            <h2 className="mb-4 text-sm font-bold uppercase text-gray-600">Vendor, Store & Customer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <select
                value={selectedVendorUuid}
                onChange={(event) => {
                  setSelectedVendorUuid(event.target.value);
                  setSelectedStoreUuid("");
                  setSelectedProducts([]);
                }}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm"
              >
                <option value="">Select Vendor *</option>
                {vendors.map((vendor: any) => (
                  <option key={vendor.uuid} value={vendor.uuid}>
                    {vendor.company_name || vendor.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedStoreUuid}
                onChange={(event) => {
                  setSelectedStoreUuid(event.target.value);
                  setSelectedProducts([]);
                }}
                disabled={!selectedVendorUuid || storesLoading}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm disabled:bg-gray-50"
              >
                <option value="">Select Store *</option>
                {stores.map((store) => (
                  <option key={store.uuid} value={store.uuid}>
                    {store.store_name}
                  </option>
                ))}
              </select>

              <select
                value={selectedCustomerId}
                onChange={(event) => setSelectedCustomerId(event.target.value ? Number(event.target.value) : "")}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm"
              >
                <option value="">Select Customer *</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>

              <select
                value={customerGroup}
                onChange={(event) => setCustomerGroup(event.target.value as (typeof customerGroups)[number])}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm"
              >
                {customerGroups.map((group) => (
                  <option key={group}>{group}</option>
                ))}
              </select>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
              <Mail size={16} className="text-teal-500" />
              <span>{customerEmail || "Customer email will populate after selection"}</span>
            </div>
          </section>

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
                <div className="text-sm text-gray-400">Loading products...</div>
              ) : products.length === 0 ? (
                <div className="text-sm text-gray-400">Select a vendor/store or search products.</div>
              ) : (
                products.map((product) => (
                  <button
                    type="button"
                    key={product.uuid}
                    onClick={() => addProduct(product)}
                    className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-left hover:border-teal-300 hover:bg-teal-50"
                  >
                    <span>
                      <span className="block text-sm font-semibold text-gray-700">{product.name}</span>
                      <span className="text-xs text-gray-400">{product.magento_sku || product.sku}</span>
                    </span>
                    <span className="text-sm font-bold text-teal-600">{money(Number(product.price || 0))}</span>
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

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AddressSection title="Billing Address" address={billingAddress} onChange={(field, value) => updateAddress("billing", field, value)} />
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

          <section className="rounded-xl border border-gray-200 p-5">
            <h2 className="mb-4 text-sm font-bold uppercase text-gray-600">Payment & Shipping</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm">
                {paymentMethods.map((method) => (
                  <option key={method.value} value={method.value}>{method.label}</option>
                ))}
              </select>
              <select value={shippingMethodKey} onChange={(event) => setShippingMethodKey(event.target.value)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm">
                {shippingMethods.map((method) => (
                  <option key={`${method.carrier_code}_${method.method_code}`} value={`${method.carrier_code}_${method.method_code}`}>
                    {method.label} - {money(method.amount)}
                  </option>
                ))}
              </select>
            </div>
          </section>

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

        <aside className="h-fit rounded-xl border border-gray-200 p-5 xl:sticky xl:top-6">
          <h2 className="mb-4 text-sm font-bold uppercase text-gray-600">Order Summary</h2>
          <input
            value={couponCode}
            onChange={(event) => setCouponCode(event.target.value)}
            placeholder="Discount Coupon"
            className="mb-4 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm"
          />
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
            <div className="flex justify-between"><span>Coupon Discount</span><strong>-{money(discount)}</strong></div>
            <div className="flex justify-between"><span>Shipping & Handling</span><strong>{money(selectedShippingMethod.amount)}</strong></div>
            <div className="border-t pt-3 flex justify-between text-lg"><span>Grand Total</span><strong className="text-teal-600">{money(grandTotal)}</strong></div>
          </div>
          <button
            type="submit"
            disabled={!canSubmit || isCreating}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-teal-500 to-green-500 px-5 py-3 font-semibold text-white disabled:opacity-50"
          >
            {isCreating ? "Creating Order..." : "Submit Order"}
          </button>
        </aside>
      </form>
    </div>
  );
}

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
        <input disabled={disabled} value={address.prefix} onChange={(event) => onChange("prefix", event.target.value)} className={inputClass} placeholder="Name Prefix" />
        <input disabled={disabled} value={address.firstname} onChange={(event) => onChange("firstname", event.target.value)} className={inputClass} placeholder="First Name *" />
        <input disabled={disabled} value={address.middlename} onChange={(event) => onChange("middlename", event.target.value)} className={inputClass} placeholder="Middle Name / Initial" />
        <input disabled={disabled} value={address.lastname} onChange={(event) => onChange("lastname", event.target.value)} className={inputClass} placeholder="Last Name *" />
        <input disabled={disabled} value={address.suffix} onChange={(event) => onChange("suffix", event.target.value)} className={inputClass} placeholder="Name Suffix" />
        <input disabled={disabled} value={address.company} onChange={(event) => onChange("company", event.target.value)} className={inputClass} placeholder="Company" />
        <textarea disabled={disabled} value={address.street} onChange={(event) => onChange("street", event.target.value)} className={`${inputClass} md:col-span-2`} rows={3} placeholder="Street Address *" />
        <select disabled={disabled} value={address.country_id} onChange={(event) => onChange("country_id", event.target.value)} className={inputClass}>
          {countries.map((country) => <option key={country.code} value={country.code}>{country.label}</option>)}
        </select>
        <select disabled={disabled} value={address.region} onChange={(event) => onChange("region", event.target.value)} className={inputClass}>
          {states.map((state) => <option key={state}>{state}</option>)}
        </select>
        <input disabled={disabled} value={address.city} onChange={(event) => onChange("city", event.target.value)} className={inputClass} placeholder="City *" />
        <input disabled={disabled} value={address.postcode} onChange={(event) => onChange("postcode", event.target.value)} className={inputClass} placeholder="Zip / Postal Code *" />
        <input disabled={disabled} value={address.telephone} onChange={(event) => onChange("telephone", event.target.value)} className={inputClass} placeholder="Phone Number" />
        <input disabled={disabled} value={address.fax} onChange={(event) => onChange("fax", event.target.value)} className={inputClass} placeholder="Fax" />
        <input disabled={disabled} value={address.vat_id} onChange={(event) => onChange("vat_id", event.target.value)} className={inputClass} placeholder="VAT Number" />
      </div>
    </section>
  );
};

export default AddOrder;
