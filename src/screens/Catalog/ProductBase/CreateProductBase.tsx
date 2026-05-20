// // src/pages/Products/CreateProductForm.tsx
// import { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useGetVendorsQuery } from "../../../app/api/VendorSlices/VendorApi";
// import { useCreateProductMutation } from "../../../app/api/ProductSlices/ProductApi";
// import type { CreateProductPayload, MediaGalleryEntry, CustomOption, TierPrice, ProductLink, BundleOption, DownloadableLink } from "../../../app/api/ProductSlices/ProductApi";
// import { useGetStoresByVendorQuery } from "../../../app/api/StoreSlices/StoreApi";

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface Vendor {
//   id: number;
//   uuid: string;
//   company_name: string;
//   company_slug: string;
//   stores: Array<{
//     id: number;
//     uuid: string;
//     store_name: string;
//     store_slug: string;
//     status: string;
//   }>;
// }

// interface FormErrors {
//   [key: string]: string | undefined;
// }

// // ─── Component ────────────────────────────────────────────────────────────────

// const CreateProductForm = () => {
//   const navigate = useNavigate();
//   const { vendor_uuid } = useParams<{ vendor_uuid: string }>();
//   const [activeMainTab, setActiveMainTab] = useState<"general" | "pricing" | "inventory" | "images" | "seo" | "options" | "advanced">("general");
//   const [activeProductType, setActiveProductType] = useState<"simple" | "configurable" | "bundle" | "downloadable" | "virtual" | "giftcard">("simple");
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [alertMessage, setAlertMessage] = useState<{ type: "success" | "error"; message: string } | null>(null);

//   // Fetch vendors
//   const { data: vendorsData, isLoading: vendorsLoading } = useGetVendorsQuery({});
//   const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

//   // Detect selected vendor from vendor UUID
//   useEffect(() => {
//     if (formData.vendor_id && vendorsData?.data) {
//       const vendor = vendorsData.data.find(
//         (v: Vendor) => v.uuid === formData.vendor_id
//       );

//       setSelectedVendor(vendor || null);

//       // reset store when vendor changes
//       setFormData(prev => ({
//         ...prev,
//         vendor_store_id: 0,
//       }));
//     } else {
//       setSelectedVendor(null);
//     }
//   }, [formData.vendor_id, vendorsData]);

//   // Fetch stores by selected vendor UUID
//   const {
//     data: storesResponse,
//     isLoading: storesLoading,
//   } = useGetStoresByVendorQuery(selectedVendor?.uuid || "", {
//     skip: !selectedVendor?.uuid,
//   });

//   const availableStores = storesResponse?.data?.stores || [];

//   const availableStores = storesResponse?.data?.stores || [];

//   const [createProduct, { isLoading: isSubmitting }] = useCreateProductMutation();

//   // Complete Form Data with all Magento fields
//   const [formData, setFormData] = useState<CreateProductPayload>({
//     vendor_id: 0,
//     vendor_store_id: 0,
//     sku: "",
//     name: "",
//     type_id: "simple",
//     attribute_set_id: 4,
//     price: 0,
//     status: 1,
//     visibility: 4,
//     weight: 0,
//     tax_class_id: 2,
//     quantity: 0,

//     // Content
//     description: "",
//     short_description: "",

//     // SEO
//     url_key: "",
//     meta_title: "",
//     meta_keyword: "",
//     meta_description: "",

//     // Advanced Pricing
//     special_price: undefined,
//     special_from_date: undefined,
//     special_to_date: undefined,
//     cost: undefined,
//     msrp: undefined,
//     msrp_display_actual_price_type: 0,

//     // Stock Management
//     manage_stock: true,
//     backorders: 0,
//     notify_stock_qty: 0,
//     min_sale_qty: 1,
//     max_sale_qty: 0,
//     qty_increments: 1,
//     enable_qty_increments: false,

//     // Design
//     custom_design: "",
//     page_layout: "",
//     custom_layout_update: "",

//     // Gift Options
//     gift_message_available: false,

//     // Product Badges
//     news_from_date: undefined,
//     news_to_date: undefined,
//     country_of_manufacture: "",

//     // Categories
//     category_ids: [],

//     // Media
//     media_gallery: [],

//     // Product Links
//     product_links: [],

//     // Custom Options
//     custom_options: [],

//     // Tier Prices
//     tier_prices: [],

//     // MSI Inventory
//     inventory: {
//       source_code: "default",
//       quantity: 0,
//       status: 1,
//     },

//     // Configurable Product Fields
//     configurable_options: [],
//     configurable_product_links: [],

//     // Downloadable Product Fields
//     downloadable_links: [],
//     downloadable_samples: [],

//     // Bundle Product Fields
//     bundle_options: [],

//     // Gift Card Fields
//     giftcard_amounts: [],
//     giftcard_type: "virtual",
//     giftcard_amount_type: "fixed",
//     giftcard_open_amount_max: 0,
//     giftcard_open_amount_min: 0,

//     // Dynamic Attributes
//     dynamic_attributes: {},

//     // Website IDs
//     website_ids: [1],
//   });

//   useEffect(() => {
//     if (formData.vendor_id && vendorsData?.data) {
//       const vendor = vendorsData.data.find(
//         (v: Vendor) => v.id === Number(formData.vendor_id)
//       );

//       setSelectedVendor(vendor || null);
//     } else {
//       setSelectedVendor(null);
//     }
//   }, [formData.vendor_id, vendorsData]);

//   // Auto-generate URL key from name
//   useEffect(() => {
//     if (formData.name && !formData.url_key) {
//       const generatedKey = formData.name
//         .toLowerCase()
//         .replace(/[^a-z0-9]+/g, '-')
//         .replace(/^-+|-+$/g, '');
//       setFormData(prev => ({ ...prev, url_key: generatedKey }));
//     }
//   }, [formData.name]);

//   const validateForm = (): boolean => {
//     const newErrors: FormErrors = {};

//     if (!formData.vendor_id) newErrors.vendor_id = "Vendor is required";
//     if (!formData.vendor_store_id) newErrors.vendor_store_id = "Store is required";
//     if (!formData.sku?.trim()) newErrors.sku = "SKU is required";
//     if (!formData.name?.trim()) newErrors.name = "Product name is required";
//     if (!formData.price || formData.price <= 0) newErrors.price = "Valid price is required";
//     if (formData.quantity < 0) newErrors.quantity = "Valid quantity is required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value, type } = e.target;

//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: undefined }));
//     }

//     let parsedValue: any = value;
//     if (type === "number") {
//       parsedValue = value === "" ? 0 : parseFloat(value);
//     } else if (type === "checkbox") {
//       parsedValue = (e.target as HTMLInputElement).checked;
//     }

//     setFormData(prev => ({ ...prev, [name]: parsedValue }));
//   };

//   const handleArrayChange = (field: keyof CreateProductPayload, index: number, key: string, value: any) => {
//     const currentArray = formData[field] as any[];
//     const updated = [...currentArray];
//     updated[index] = { ...updated[index], [key]: value };
//     setFormData(prev => ({ ...prev, [field]: updated as any }));
//   };

//   const addToArray = (field: keyof CreateProductPayload, defaultItem: any) => {
//     const currentArray = formData[field] as any[];
//     setFormData(prev => ({ ...prev, [field]: [...currentArray, defaultItem] as any }));
//   };

//   const removeFromArray = (field: keyof CreateProductPayload, index: number) => {
//     const currentArray = formData[field] as any[];
//     setFormData(prev => ({ ...prev, [field]: currentArray.filter((_, i) => i !== index) as any }));
//   };

//   const handleImageUpload = async (file: File) => {
//     if (file.size > 5 * 1024 * 1024) {
//       setAlertMessage({ type: "error", message: "Image size should be less than 5MB" });
//       return;
//     }

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const base64 = (reader.result as string).split(",")[1];
//       const newImage: MediaGalleryEntry = {
//         media_type: "image",
//         label: file.name,
//         position: (formData.media_gallery?.length || 0) + 1,
//         disabled: false,
//         types: formData.media_gallery?.length === 0 ? ["image", "small_image", "thumbnail"] : [],
//         content: {
//           base64_encoded_data: base64,
//           type: file.type,
//           name: file.name,
//         },
//       };
//       setFormData(prev => ({
//         ...prev,
//         media_gallery: [...(prev.media_gallery || []), newImage],
//       }));
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setAlertMessage(null);

//     if (!validateForm()) {
//       setAlertMessage({ type: "error", message: "Please fix validation errors before submitting." });
//       window.scrollTo({ top: 0, behavior: "smooth" });
//       return;
//     }

//     if (!vendor_uuid) {
//       setAlertMessage({ type: "error", message: "Vendor UUID is missing" });
//       return;
//     }

//     // Prepare payload
//     const payload = {
//       ...formData,
//       type_id: activeProductType,
//     };

//     // Remove empty arrays/undefined values
//     Object.keys(payload).forEach(key => {
//       if (payload[key as keyof CreateProductPayload] === undefined ||
//         (Array.isArray(payload[key as keyof CreateProductPayload]) && (payload[key as keyof CreateProductPayload] as any[]).length === 0)) {
//         delete payload[key as keyof CreateProductPayload];
//       }
//     });

//     try {
//       const result = await createProduct({ vendor_uuid, data: payload }).unwrap();
//       if (result.success) {
//         setAlertMessage({ type: "success", message: "Product created successfully and synced to Magento!" });
//         setTimeout(() => {
//           navigate(`/vendor/${vendor_uuid}/products`);
//         }, 2000);
//       }
//     } catch (error: any) {
//       console.error("Submit error:", error);
//       const errorMessage = error?.data?.message || error?.message || "Failed to create product";
//       setAlertMessage({ type: "error", message: errorMessage });
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     }
//   };

//   const LoadingOverlay = () => (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
//         <p className="text-gray-700 font-medium">Creating product and syncing to Magento...</p>
//       </div>
//     </div>
//   );

//   const Alert = ({ type, message, onClose }: { type: "success" | "error"; message: string; onClose: () => void }) => (
//     <div className={`rounded-lg p-4 mb-6 flex justify-between items-center ${type === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
//       <p className={type === "success" ? "text-green-700" : "text-red-700"}>{message}</p>
//       <button onClick={onClose} className="text-gray-400 hover:text-gray-600">×</button>
//     </div>
//   );

//   const RemoveButton = ({ onClick }: { onClick: () => void }) => (
//     <button type="button" onClick={onClick} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs hover:bg-red-600 transition flex items-center justify-center">×</button>
//   );

//   // ─── Render Sections ───────────────────────────────────────────────────────

//   const renderVendorStoreSection = () => (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-xl">
//       <div>
//         <label className="block text-sm font-semibold mb-2 text-gray-700">Vendor <span className="text-red-500">*</span></label>
//         <select
//           name="vendor_id" value={formData.vendor_id || ""} onChange={handleChange} className={`w-full border ${errors.vendor_id ? 'border-red-500' : 'border-gray-300'} rounded-xl p-3`}>
//           <option value="">Select Vendor</option>
//           {vendorsData?.data?.map((vendor: Vendor) => (
//             <option key={vendor.uuid} value={vendor.uuid}>{vendor.company_name || `Vendor ${vendor.uuid}`}</option>
//           ))}
//         </select>
//         {errors.vendor_id && <p className="text-red-500 text-sm mt-1">{errors.vendor_id}</p>}
//       </div>
//       <div>
//         <label className="block text-sm font-semibold mb-2 text-gray-700">Store <span className="text-red-500">*</span></label>
//         <select
//           name="vendor_store_id"
//           value={formData.vendor_store_id || ""}
//           onChange={handleChange}
//           disabled={!formData.vendor_id || storesLoading}
//           className={`w-full border ${errors.vendor_store_id ? "border-red-500" : "border-gray-300"
//             } rounded-xl p-3 disabled:bg-gray-100`}
//         >
//           <option value="">
//             {storesLoading ? "Loading Stores..." : "Select Store"}
//           </option>

//           {availableStores.map((store) => (
//             <option key={store.id} value={store.id}>
//               {store.store_name}
//             </option>
//           ))}
//         </select>
//         {errors.vendor_store_id && <p className="text-red-500 text-sm mt-1">{errors.vendor_store_id}</p>}
//       </div>
//     </div>
//   );

//   const renderProductTypeSelector = () => (
//     <div className="flex gap-2 flex-wrap border-b border-gray-200 pb-4">
//       {["simple", "configurable", "bundle", "downloadable", "virtual", "giftcard"].map(type => (
//         <button key={type} type="button" onClick={() => setActiveProductType(type as any)} className={`px-4 py-2 text-sm font-medium capitalize rounded-lg transition ${activeProductType === type ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
//           {type}
//         </button>
//       ))}
//     </div>
//   );

//   const renderGeneralTab = () => (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div><label className="block text-sm font-semibold mb-1">SKU <span className="text-red-500">*</span></label><input type="text" name="sku" value={formData.sku} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" placeholder="Unique product SKU" />{errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}</div>
//         <div><label className="block text-sm font-semibold mb-1">Product Name <span className="text-red-500">*</span></label><input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" placeholder="Product name" />{errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}</div>
//         <div><label className="block text-sm font-semibold mb-1">Attribute Set ID</label><input type="number" name="attribute_set_id" value={formData.attribute_set_id} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" /></div>
//         <div><label className="block text-sm font-semibold mb-1">Visibility</label><select name="visibility" value={formData.visibility} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3"><option value={1}>Not Visible</option><option value={2}>Catalog</option><option value={3}>Search</option><option value={4}>Catalog & Search</option></select></div>
//         <div><label className="block text-sm font-semibold mb-1">Status</label><select name="status" value={formData.status} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3"><option value={1}>Enabled</option><option value={2}>Disabled</option></select></div>
//         <div><label className="block text-sm font-semibold mb-1">Weight (kg)</label><input type="number" step="0.01" name="weight" value={formData.weight} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" /></div>
//         <div><label className="block text-sm font-semibold mb-1">Tax Class ID</label><input type="number" name="tax_class_id" value={formData.tax_class_id} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" /></div>
//       </div>
//       <div><label className="block text-sm font-semibold mb-1">Short Description</label><textarea name="short_description" rows={3} value={formData.short_description} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" /></div>
//       <div><label className="block text-sm font-semibold mb-1">Full Description</label><textarea name="description" rows={5} value={formData.description} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" /></div>
//     </div>
//   );

//   const renderPricingTab = () => (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div><label className="block text-sm font-semibold mb-1">Regular Price <span className="text-red-500">*</span></label><input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" />{errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}</div>
//         <div><label className="block text-sm font-semibold mb-1">Special Price</label><input type="number" step="0.01" name="special_price" value={formData.special_price || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" /></div>
//         <div><label className="block text-sm font-semibold mb-1">Special Price From</label><input type="date" name="special_from_date" value={formData.special_from_date || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" /></div>
//         <div><label className="block text-sm font-semibold mb-1">Special Price To</label><input type="date" name="special_to_date" value={formData.special_to_date || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" /></div>
//         <div><label className="block text-sm font-semibold mb-1">Cost (Manufacturer Price)</label><input type="number" step="0.01" name="cost" value={formData.cost || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" /></div>
//         <div><label className="block text-sm font-semibold mb-1">MSRP (Manufacturer's Suggested Retail Price)</label><input type="number" step="0.01" name="msrp" value={formData.msrp || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" /></div>
//         <div><label className="block text-sm font-semibold mb-1">MSRP Display Type</label><select name="msrp_display_actual_price_type" value={formData.msrp_display_actual_price_type} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3"><option value={0}>Use Config</option><option value={1}>In Cart</option><option value={2}>Before Order Confirmation</option><option value={3}>On Gesture</option></select></div>
//       </div>

//       {/* Tier Prices */}
//       <div><div className="flex justify-between items-center mb-3"><label className="text-sm font-semibold text-gray-700">Tier Prices (Volume Discounts)</label><button type="button" onClick={() => addToArray("tier_prices", { customer_group_id: 0, qty: 0, price: 0, price_type: "fixed" })} className="px-3 py-1 bg-teal-500 text-white rounded-lg text-sm">+ Add Tier Price</button></div>
//         {formData.tier_prices?.map((tier, index) => (<div key={index} className="relative grid grid-cols-4 gap-4 mb-3 p-3 bg-gray-50 rounded-lg"><RemoveButton onClick={() => removeFromArray("tier_prices", index)} />
//           <input type="number" placeholder="Customer Group ID" value={tier.customer_group_id} onChange={(e) => handleArrayChange("tier_prices", index, "customer_group_id", parseInt(e.target.value))} className="border rounded-lg p-2" />
//           <input type="number" placeholder="Min Qty" value={tier.qty} onChange={(e) => handleArrayChange("tier_prices", index, "qty", parseInt(e.target.value))} className="border rounded-lg p-2" />
//           <input type="number" step="0.01" placeholder="Price" value={tier.price} onChange={(e) => handleArrayChange("tier_prices", index, "price", parseFloat(e.target.value))} className="border rounded-lg p-2" />
//           <select value={tier.price_type} onChange={(e) => handleArrayChange("tier_prices", index, "price_type", e.target.value)} className="border rounded-lg p-2"><option value="fixed">Fixed</option><option value="percent">Percent</option></select>
//         </div>))}
//       </div>

//       {/* Product Links */}
//       <div><div className="flex justify-between items-center mb-3"><label className="text-sm font-semibold text-gray-700">Product Links (Related/Up-sell/Cross-sell)</label><button type="button" onClick={() => addToArray("product_links", { link_type: "related", linked_product_sku: "", linked_product_type: "simple", position: 0 })} className="px-3 py-1 bg-teal-500 text-white rounded-lg text-sm">+ Add Link</button></div>
//         {formData.product_links?.map((link, index) => (<div key={index} className="relative grid grid-cols-4 gap-4 mb-3 p-3 bg-gray-50 rounded-lg"><RemoveButton onClick={() => removeFromArray("product_links", index)} />
//           <input type="text" placeholder="Linked Product SKU" value={link.linked_product_sku} onChange={(e) => handleArrayChange("product_links", index, "linked_product_sku", e.target.value)} className="border rounded-lg p-2" />
//           <select value={link.link_type} onChange={(e) => handleArrayChange("product_links", index, "link_type", e.target.value)} className="border rounded-lg p-2"><option value="related">Related</option><option value="upsell">Up-sell</option><option value="crosssell">Cross-sell</option></select>
//           <input type="number" placeholder="Position" value={link.position} onChange={(e) => handleArrayChange("product_links", index, "position", parseInt(e.target.value))} className="border rounded-lg p-2" />
//         </div>))}
//       </div>
//     </div>
//   );

//   const renderInventoryTab = () => (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div><label className="block text-sm font-semibold mb-1">Quantity <span className="text-red-500">*</span></label><input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" />{errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}</div>
//         <div><label className="flex items-center gap-2"><input type="checkbox" name="manage_stock" checked={formData.manage_stock} onChange={handleChange} className="w-4 h-4" /> Manage Stock</label></div>
//         <div><label className="block text-sm font-semibold mb-1">Backorders</label><select name="backorders" value={formData.backorders} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3"><option value={0}>No Backorders</option><option value={1}>Allow Qty Below 0</option><option value={2}>Allow Qty Below 0 & Notify</option></select></div>
//         <div><label className="block text-sm font-semibold mb-1">Notify Stock Qty</label><input type="number" name="notify_stock_qty" value={formData.notify_stock_qty} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" /></div>
//         <div><label className="block text-sm font-semibold mb-1">Minimum Sale Qty</label><input type="number" name="min_sale_qty" value={formData.min_sale_qty} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" /></div>
//         <div><label className="block text-sm font-semibold mb-1">Maximum Sale Qty</label><input type="number" name="max_sale_qty" value={formData.max_sale_qty} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" /></div>
//         <div><label className="block text-sm font-semibold mb-1">Qty Increments</label><input type="number" name="qty_increments" value={formData.qty_increments} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" /></div>
//         <div><label className="flex items-center gap-2"><input type="checkbox" name="enable_qty_increments" checked={formData.enable_qty_increments} onChange={handleChange} className="w-4 h-4" /> Enable Qty Increments</label></div>
//       </div>

//       {/* MSI Inventory Source */}
//       <div className="border-t pt-4"><h4 className="font-semibold mb-3">MSI Inventory Source</h4>
//         <div className="grid grid-cols-2 gap-4"><input type="text" placeholder="Source Code" value={formData.inventory?.source_code} onChange={(e) => setFormData(prev => ({ ...prev, inventory: { ...prev.inventory!, source_code: e.target.value } }))} className="border rounded-lg p-2" />
//           <input type="number" placeholder="Quantity" value={formData.inventory?.quantity} onChange={(e) => setFormData(prev => ({ ...prev, inventory: { ...prev.inventory!, quantity: parseFloat(e.target.value) } }))} className="border rounded-lg p-2" />
//         </div>
//       </div>
//     </div>
//   );

//   const renderImagesTab = () => (
//     <div className="space-y-6">
//       <div className="flex gap-3 flex-wrap">
//         {formData.media_gallery?.map((img, idx) => (<div key={idx} className="relative w-24 h-24 bg-gray-200 rounded-xl overflow-hidden"><img src={`data:${img.content?.type};base64,${img.content?.base64_encoded_data}`} alt={img.label} className="w-full h-full object-cover" /><RemoveButton onClick={() => removeFromArray("media_gallery", idx)} /></div>))}
//         <label className="w-24 h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-sm text-gray-500 cursor-pointer hover:border-teal-400 transition">+ Add Image<input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} /></label>
//       </div>
//       <div className="bg-blue-50 p-4 rounded-lg"><p className="text-sm text-blue-700">First image will be set as base, small, and thumbnail image automatically.</p></div>
//     </div>
//   );

//   const renderSeoTab = () => (
//     <div className="space-y-6">
//       <div><label className="block text-sm font-semibold mb-1">URL Key</label><input type="text" name="url_key" value={formData.url_key} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" placeholder="product-url-key" /></div>
//       <div><label className="block text-sm font-semibold mb-1">Meta Title</label><input type="text" name="meta_title" value={formData.meta_title} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" maxLength={70} /></div>
//       <div><label className="block text-sm font-semibold mb-1">Meta Keywords</label><input type="text" name="meta_keyword" value={formData.meta_keyword} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" placeholder="keyword1, keyword2, keyword3" /></div>
//       <div><label className="block text-sm font-semibold mb-1">Meta Description</label><textarea name="meta_description" rows={3} value={formData.meta_description} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" maxLength={160} /></div>
//     </div>
//   );

//   const renderCustomOptionsTab = () => (
//     <div className="space-y-6">
//       <div><div className="flex justify-between items-center mb-3"><label className="text-sm font-semibold text-gray-700">Custom Options</label><button type="button" onClick={() => addToArray("custom_options", { title: "", type: "field", is_require: false, sort_order: 0, price: 0, price_type: "fixed", sku: "", values: [] })} className="px-3 py-1 bg-teal-500 text-white rounded-lg text-sm">+ Add Option</button></div>
//         {formData.custom_options?.map((option, index) => (<div key={index} className="relative p-4 bg-gray-50 rounded-lg mb-3"><RemoveButton onClick={() => removeFromArray("custom_options", index)} />
//           <div className="grid grid-cols-2 gap-4 mb-3"><input type="text" placeholder="Option Title" value={option.title} onChange={(e) => handleArrayChange("custom_options", index, "title", e.target.value)} className="border rounded-lg p-2" />
//             <select value={option.type} onChange={(e) => handleArrayChange("custom_options", index, "type", e.target.value)} className="border rounded-lg p-2"><option value="field">Text Field</option><option value="area">Text Area</option><option value="drop_down">Drop-down</option><option value="radio">Radio Buttons</option><option value="checkbox">Checkbox</option><option value="date">Date</option><option value="date_time">Date & Time</option><option value="time">Time</option><option value="file">File</option></select>
//           </div>
//           <div className="grid grid-cols-3 gap-4 mb-3"><input type="number" step="0.01" placeholder="Price" value={option.price} onChange={(e) => handleArrayChange("custom_options", index, "price", parseFloat(e.target.value))} className="border rounded-lg p-2" />
//             <select value={option.price_type} onChange={(e) => handleArrayChange("custom_options", index, "price_type", e.target.value)} className="border rounded-lg p-2"><option value="fixed">Fixed</option><option value="percent">Percent</option></select>
//             <input type="text" placeholder="SKU" value={option.sku} onChange={(e) => handleArrayChange("custom_options", index, "sku", e.target.value)} className="border rounded-lg p-2" />
//           </div>
//           <label className="flex items-center gap-2"><input type="checkbox" checked={option.is_require} onChange={(e) => handleArrayChange("custom_options", index, "is_require", e.target.checked)} className="w-4 h-4" /> Required</label>
//         </div>))}
//       </div>

//       {/* Dynamic Attributes */}
//       <div className="border-t pt-4"><h4 className="font-semibold mb-3">Dynamic Custom Attributes</h4>
//         <div className="space-y-2">{Object.entries(formData.dynamic_attributes || {}).map(([key, value]) => (<div key={key} className="flex gap-2"><input type="text" placeholder="Attribute Code" value={key} className="border rounded-lg p-2 flex-1" disabled /><input type="text" placeholder="Value" value={value} onChange={(e) => setFormData(prev => ({ ...prev, dynamic_attributes: { ...prev.dynamic_attributes, [key]: e.target.value } }))} className="border rounded-lg p-2 flex-1" /><button type="button" onClick={() => { const { [key]: _, ...rest } = formData.dynamic_attributes || {}; setFormData(prev => ({ ...prev, dynamic_attributes: rest })); }} className="bg-red-500 text-white px-3 rounded-lg">×</button></div>))}
//           <button type="button" onClick={() => { const code = prompt("Enter attribute code:"); if (code) setFormData(prev => ({ ...prev, dynamic_attributes: { ...prev.dynamic_attributes, [code]: "" } })); }} className="text-teal-500 text-sm">+ Add Dynamic Attribute</button>
//         </div>
//       </div>
//     </div>
//   );

//   const renderAdvancedTab = () => (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div><label className="block text-sm font-semibold mb-1">Custom Design</label><input type="text" name="custom_design" value={formData.custom_design} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" /></div>
//         <div><label className="block text-sm font-semibold mb-1">Page Layout</label><select name="page_layout" value={formData.page_layout} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3"><option value="">No Layout Updates</option><option value="1column">1 Column</option><option value="2columns-left">2 Columns with Left Bar</option><option value="2columns-right">2 Columns with Right Bar</option><option value="3columns">3 Columns</option></select></div>
//         <div><label className="block text-sm font-semibold mb-1">Custom Layout Update (XML)</label>
//           <textarea
//             name="custom_layout_update"
//             rows={4}
//             value={formData.custom_layout_update}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded-xl p-3 font-mono text-sm"
//             placeholder="<referenceContainer name='content'><block class='Magento\Framework\View\Element\Template' template='MyModule::custom.phtml'/></referenceContainer>"
//           /></div>
//         <div><label className="flex items-center gap-2"><input type="checkbox" name="gift_message_available" checked={formData.gift_message_available} onChange={handleChange} className="w-4 h-4" /> Allow Gift Message</label></div>
//         <div><label className="block text-sm font-semibold mb-1">News From Date</label><input type="date" name="news_from_date" value={formData.news_from_date || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" /></div>
//         <div><label className="block text-sm font-semibold mb-1">News To Date</label><input type="date" name="news_to_date" value={formData.news_to_date || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" /></div>
//         <div><label className="block text-sm font-semibold mb-1">Country of Manufacture</label><select name="country_of_manufacture" value={formData.country_of_manufacture} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3"><option value="">Select Country</option><option value="US">United States</option><option value="CN">China</option><option value="IN">India</option><option value="JP">Japan</option><option value="DE">Germany</option><option value="UK">United Kingdom</option></select></div>
//       </div>
//       <div><label className="block text-sm font-semibold mb-1">Categories</label><input type="text" placeholder="Enter category IDs separated by commas" value={formData.category_ids?.join(", ")} onChange={(e) => setFormData(prev => ({ ...prev, category_ids: e.target.value.split(",").map(id => parseInt(id.trim())).filter(id => !isNaN(id)) }))} className="w-full border border-gray-300 rounded-xl p-3" /></div>
//       <div><label className="block text-sm font-semibold mb-1">Website IDs</label><input type="text" placeholder="Enter website IDs separated by commas" value={formData.website_ids?.join(", ")} onChange={(e) => setFormData(prev => ({ ...prev, website_ids: e.target.value.split(",").map(id => parseInt(id.trim())).filter(id => !isNaN(id)) }))} className="w-full border border-gray-300 rounded-xl p-3" /></div>
//     </div>
//   );

//   if (vendorsLoading) {
//     return <div className="bg-gray-100 min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div></div>;
//   }

//   return (
//     <div className="bg-gray-100 min-h-screen">
//       {isSubmitting && <LoadingOverlay />}
//       <div className="mx-auto bg-white shadow-sm border border-gray-200 p-8 space-y-6">
//         <h1 className="text-2xl font-bold text-gray-800">Create New Product</h1>
//         {alertMessage && <Alert type={alertMessage.type} message={alertMessage.message} onClose={() => setAlertMessage(null)} />}

//         {renderVendorStoreSection()}
//         {renderProductTypeSelector()}

//         {/* Main Tabs */}
//         <div className="border-b border-gray-200">
//           <nav className="flex gap-1 flex-wrap">
//             {["general", "pricing", "inventory", "images", "seo", "options", "advanced"].map(tab => (
//               <button key={tab} type="button" onClick={() => setActiveMainTab(tab as any)} className={`px-4 py-2 text-sm font-medium capitalize rounded-t-lg transition ${activeMainTab === tab ? "text-teal-600 border-b-2 border-teal-600 bg-teal-50" : "text-gray-500 hover:text-gray-700"}`}>
//                 {tab}
//               </button>
//             ))}
//           </nav>
//         </div>

//         <form onSubmit={handleSubmit}>
//           {activeMainTab === "general" && renderGeneralTab()}
//           {activeMainTab === "pricing" && renderPricingTab()}
//           {activeMainTab === "inventory" && renderInventoryTab()}
//           {activeMainTab === "images" && renderImagesTab()}
//           {activeMainTab === "seo" && renderSeoTab()}
//           {activeMainTab === "options" && renderCustomOptionsTab()}
//           {activeMainTab === "advanced" && renderAdvancedTab()}

//           {/* Additional product type specific sections */}
//           {activeProductType === "configurable" && (
//             <div className="mt-6 p-4 bg-purple-50 rounded-lg"><h3 className="font-semibold mb-2">Configurable Product Settings</h3><p className="text-sm text-purple-700">Create simple products first, then link them here using SKUs.</p>
//               <input type="text" placeholder="Simple Product SKUs (comma separated)" className="w-full border rounded-lg p-2 mt-2" onChange={(e) => setFormData(prev => ({ ...prev, configurable_product_links: e.target.value.split(",").map(s => s.trim()) }))} />
//             </div>
//           )}

//           {activeProductType === "downloadable" && (
//             <div className="mt-6 p-4 bg-blue-50 rounded-lg"><h3 className="font-semibold mb-2">Downloadable Product Settings</h3><button type="button" onClick={() => addToArray("downloadable_links", { title: "", sort_order: 0, is_shareable: 1, price: 0, number_of_downloads: 0, link_type: "file", sample_type: "file" })} className="px-3 py-1 bg-teal-500 text-white rounded-lg text-sm mb-2">+ Add Downloadable Link</button>
//               {formData.downloadable_links?.map((link, idx) => (<div key={idx} className="grid grid-cols-2 gap-2 mt-2 p-2 bg-white rounded"><input placeholder="Title" value={link.title} onChange={(e) => handleArrayChange("downloadable_links", idx, "title", e.target.value)} className="border rounded p-1" /><input type="number" placeholder="Price" value={link.price} onChange={(e) => handleArrayChange("downloadable_links", idx, "price", parseFloat(e.target.value))} className="border rounded p-1" /><input placeholder="File URL" value={link.link_file || link.link_url} onChange={(e) => handleArrayChange("downloadable_links", idx, link.link_type === "file" ? "link_file" : "link_url", e.target.value)} className="border rounded p-1 col-span-2" /></div>))}
//             </div>
//           )}

//           {activeProductType === "bundle" && (
//             <div className="mt-6 p-4 bg-green-50 rounded-lg"><h3 className="font-semibold mb-2">Bundle Product Settings</h3><button type="button" onClick={() => addToArray("bundle_options", { title: "", required: true, type: "select", position: 0, sku: "", product_links: [] })} className="px-3 py-1 bg-teal-500 text-white rounded-lg text-sm">+ Add Bundle Option</button></div>
//           )}

//           {activeProductType === "giftcard" && (
//             <div className="mt-6 p-4 bg-yellow-50 rounded-lg"><h3 className="font-semibold mb-2">Gift Card Settings</h3>
//               <div className="grid grid-cols-2 gap-4"><label className="flex items-center gap-2"><input type="radio" name="giftcard_type" value="virtual" checked={formData.giftcard_type === "virtual"} onChange={handleChange} /> Virtual</label>
//                 <label className="flex items-center gap-2"><input type="radio" name="giftcard_type" value="physical" checked={formData.giftcard_type === "physical"} onChange={handleChange} /> Physical</label>
//                 <label className="flex items-center gap-2"><input type="radio" name="giftcard_type" value="combined" checked={formData.giftcard_type === "combined"} onChange={handleChange} /> Combined</label>
//               </div>
//               <div className="mt-3 flex gap-2 flex-wrap">{["25", "50", "100", "200"].map(amount => (<label key={amount} className="flex items-center gap-2 p-2 border rounded"><input type="checkbox" checked={formData.giftcard_amounts?.some(a => a.value === parseInt(amount))} onChange={(e) => { if (e.target.checked) { addToArray("giftcard_amounts", { website_id: 0, value: parseInt(amount) }); } else { const filtered = formData.giftcard_amounts?.filter(a => a.value !== parseInt(amount)); setFormData(prev => ({ ...prev, giftcard_amounts: filtered })); } }} />${amount}</label>))}</div>
//             </div>
//           )}

//           <div className="flex justify-end gap-3 pt-6 border-t mt-6">
//             <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition" disabled={isSubmitting}>Cancel</button>
//             <button type="submit" className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition disabled:bg-teal-300" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create Product"}</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateProductForm;


// src/pages/Products/CreateProductForm.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetVendorsQuery } from "../../../app/api/VendorSlices/VendorApi";
import { useCreateProductMutation } from "../../../app/api/ProductSlices/ProductApi";
import type { CreateProductPayload, MediaGalleryEntry, CustomOption, TierPrice, ProductLink, BundleOption, DownloadableLink } from "../../../app/api/ProductSlices/ProductApi";
import { useGetStoresByVendorQuery } from "../../../app/api/StoreSlices/StoreApi";
import SearchableSelect from "../../../component/SearchableSelect";


// ─── Types ────────────────────────────────────────────────────────────────────

interface Vendor {
  id: number;
  uuid: string;
  company_name: string;
  company_slug: string;
  stores: Array<{
    id: number;
    uuid: string;
    store_name: string;
    store_slug: string;
    status: string;
  }>;
}

interface Store {
  id: number;
  uuid: string;
  store_name: string;
  store_slug: string;
  status: string;
}

interface FormErrors {
  [key: string]: string | undefined;
}

// ─── Component ────────────────────────────────────────────────────────────────

const CreateProductForm = () => {
  const navigate = useNavigate();
  const { vendor_uuid } = useParams<{ vendor_uuid: string }>();
  const [activeMainTab, setActiveMainTab] = useState<"general" | "pricing" | "inventory" | "images" | "seo" | "options" | "advanced">("general");
  const [activeProductType, setActiveProductType] = useState<"simple" | "configurable" | "bundle" | "downloadable" | "virtual" | "giftcard">("simple");
  const [errors, setErrors] = useState<FormErrors>({});
  const [alertMessage, setAlertMessage] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Fetch vendors
  const { data: vendorsData, isLoading: vendorsLoading } = useGetVendorsQuery({});
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  // Fetch stores by selected vendor UUID
  const {
    data: storesResponse,
    isLoading: storesLoading,
  } = useGetStoresByVendorQuery(selectedVendor?.uuid || "", {
    skip: !selectedVendor?.uuid,
  });

  const availableStores = storesResponse?.data?.stores || [];

  const [createProduct, { isLoading: isSubmitting }] = useCreateProductMutation();

  // Complete Form Data with all Magento fields
  const [formData, setFormData] = useState<CreateProductPayload>({
    vendor_id: "",
    vendor_store_id: "",
    sku: "",
    name: "",
    type_id: "simple",
    attribute_set_id: 4,
    price: 0,
    status: 1,
    visibility: 4,
    weight: 0,
    tax_class_id: 2,
    quantity: 0,

    // Content
    description: "",
    short_description: "",

    // SEO
    url_key: "",
    meta_title: "",
    meta_keyword: "",
    meta_description: "",

    // Advanced Pricing
    special_price: undefined,
    special_from_date: undefined,
    special_to_date: undefined,
    cost: undefined,
    msrp: undefined,
    msrp_display_actual_price_type: 0,

    // Stock Management
    manage_stock: true,
    backorders: 0,
    notify_stock_qty: 0,
    min_sale_qty: 1,
    max_sale_qty: 0,
    qty_increments: 1,
    enable_qty_increments: false,

    // Design
    custom_design: "",
    page_layout: "",
    custom_layout_update: "",

    // Gift Options
    gift_message_available: false,

    // Product Badges
    news_from_date: undefined,
    news_to_date: undefined,
    country_of_manufacture: "",

    // Categories
    category_ids: [],

    // Media
    media_gallery: [],

    // Product Links
    product_links: [],

    // Custom Options
    custom_options: [],

    // Tier Prices
    tier_prices: [],

    // MSI Inventory
    inventory: {
      source_code: "default",
      quantity: 0,
      status: 1,
    },

    // Configurable Product Fields
    configurable_options: [],
    configurable_product_links: [],

    // Downloadable Product Fields
    downloadable_links: [],
    downloadable_samples: [],

    // Bundle Product Fields
    bundle_options: [],

    // Gift Card Fields
    giftcard_amounts: [],
    giftcard_type: "virtual",
    giftcard_amount_type: "fixed",
    giftcard_open_amount_max: 0,
    giftcard_open_amount_min: 0,

    // Dynamic Attributes
    dynamic_attributes: {},

    // Website IDs
    website_ids: [1],
  });

  // Update selected vendor when vendor_id (UUID) changes
  useEffect(() => {
    if (formData.vendor_id && vendorsData?.data) {
      const vendor = vendorsData.data.find(
        (v: Vendor) => v.uuid === formData.vendor_id
      );
      setSelectedVendor(vendor || null);

      // Reset store when vendor changes
      setFormData(prev => ({
        ...prev,
        vendor_store_id: "",
      }));

      // Clear store error when vendor changes
      if (errors.vendor_store_id) {
        setErrors(prev => ({ ...prev, vendor_store_id: undefined }));
      }
    } else {
      setSelectedVendor(null);
    }
  }, [formData.vendor_id, vendorsData]);

  // Auto-generate URL key from name
  useEffect(() => {
    if (formData.name && !formData.url_key) {
      const generatedKey = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, url_key: generatedKey }));
    }
  }, [formData.name]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.vendor_id) newErrors.vendor_id = "Vendor is required";
    if (!formData.vendor_store_id) newErrors.vendor_store_id = "Store is required";
    if (!formData.sku?.trim()) newErrors.sku = "SKU is required";
    if (!formData.name?.trim()) newErrors.name = "Product name is required";
    if (!formData.price || formData.price <= 0) newErrors.price = "Valid price is required";
    if (formData.quantity === undefined || formData.quantity < 0) newErrors.quantity = "Valid quantity is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }

    let parsedValue: any = value;
    if (type === "number") {
      parsedValue = value === "" ? 0 : parseFloat(value);
    } else if (type === "checkbox") {
      parsedValue = (e.target as HTMLInputElement).checked;
    }

    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleArrayChange = (field: keyof CreateProductPayload, index: number, key: string, value: any) => {
    const currentArray = formData[field] as any[];
    const updated = [...currentArray];
    updated[index] = { ...updated[index], [key]: value };
    setFormData(prev => ({ ...prev, [field]: updated as any }));
  };

  const addToArray = (field: keyof CreateProductPayload, defaultItem: any) => {
    const currentArray = formData[field] as any[];
    setFormData(prev => ({ ...prev, [field]: [...currentArray, defaultItem] as any }));
  };

  const removeFromArray = (field: keyof CreateProductPayload, index: number) => {
    const currentArray = formData[field] as any[];
    setFormData(prev => ({ ...prev, [field]: currentArray.filter((_, i) => i !== index) as any }));
  };

  const handleImageUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setAlertMessage({ type: "error", message: "Image size should be less than 5MB" });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(",")[1];
      const newImage: MediaGalleryEntry = {
        media_type: "image",
        label: file.name,
        position: (formData.media_gallery?.length || 0) + 1,
        disabled: false,
        types: formData.media_gallery?.length === 0 ? ["image", "small_image", "thumbnail"] : [],
        content: {
          base64_encoded_data: base64,
          type: file.type,
          name: file.name,
        },
      };
      setFormData(prev => ({
        ...prev,
        media_gallery: [...(prev.media_gallery || []), newImage],
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertMessage(null);

    // Debug logging
    console.log("URL vendor_uuid:", vendor_uuid);
    console.log("Selected vendor_id from form:", formData.vendor_id);
    console.log("Selected vendor_store_id from form:", formData.vendor_store_id);

    if (!validateForm()) {
      setAlertMessage({ type: "error", message: "Please fix validation errors before submitting." });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Use either the URL vendor_uuid OR the selected vendor from form
    const vendorToUse = vendor_uuid || formData.vendor_id;

    if (!vendorToUse) {
      setAlertMessage({ type: "error", message: "Vendor UUID is missing. Please select a vendor or ensure the URL contains a vendor UUID." });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Prepare payload
    const payload = {
      ...formData,
      type_id: activeProductType,
    };

    // Remove empty arrays/undefined values
    Object.keys(payload).forEach(key => {
      if (payload[key as keyof CreateProductPayload] === undefined ||
        (Array.isArray(payload[key as keyof CreateProductPayload]) && (payload[key as keyof CreateProductPayload] as any[]).length === 0)) {
        delete payload[key as keyof CreateProductPayload];
      }
    });

    console.log("Submitting payload:", payload);
    console.log("Using vendor UUID:", vendorToUse);

    try {
      const result = await createProduct({ vendor_uuid: vendorToUse, data: payload }).unwrap();
      if (result.success) {
        setAlertMessage({ type: "success", message: "Product created successfully and synced to Magento!" });
        setTimeout(() => {
          // navigate(`/vendor/${vendorToUse}/products`);
        }, 2000);
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      const errorMessage = error?.data?.message || error?.message || "Failed to create product";
      setAlertMessage({ type: "error", message: errorMessage });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        <p className="text-gray-700 font-medium">Creating product and syncing to Magento...</p>
      </div>
    </div>
  );

  const Alert = ({ type, message, onClose }: { type: "success" | "error"; message: string; onClose: () => void }) => (
    <div className={`rounded-lg p-4 mb-6 flex justify-between items-center ${type === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
      <p className={type === "success" ? "text-green-700" : "text-red-700"}>{message}</p>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600">×</button>
    </div>
  );

  const RemoveButton = ({ onClick }: { onClick: () => void }) => (
    <button type="button" onClick={onClick} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs hover:bg-red-600 transition flex items-center justify-center">×</button>
  );

  // ─── Render Sections ───────────────────────────────────────────────────────

  const renderVendorStoreSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-xl">
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">Vendor <span className="text-red-500">*</span></label>
        <select
          name="vendor_id"
          value={formData.vendor_id || ""}
          onChange={handleChange}
          onBlur={() => handleBlur("vendor_id")}
          className={`w-full border ${touched.vendor_id && errors.vendor_id ? 'border-red-500' : 'border-gray-300'} rounded-xl p-3`}>
          <option value="">Select Vendor</option>
          {vendorsData?.data?.map((vendor: Vendor) => (
            <option key={vendor.uuid} value={vendor.uuid}>{vendor.company_name || `Vendor ${vendor.uuid}`}</option>
          ))}
        </select>
        {touched.vendor_id && errors.vendor_id && <p className="text-red-500 text-sm mt-1">{errors.vendor_id}</p>}
      </div>
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">Store <span className="text-red-500">*</span></label>
        <select
          name="vendor_store_id"
          value={formData.vendor_store_id || ""}
          onChange={handleChange}
          onBlur={() => handleBlur("vendor_store_id")}
          disabled={!formData.vendor_id || storesLoading}
          className={`w-full border ${touched.vendor_store_id && errors.vendor_store_id ? "border-red-500" : "border-gray-300"} rounded-xl p-3 disabled:bg-gray-100`}
        >
          <option value="">
            {!formData.vendor_id
              ? "Select a vendor first"
              : storesLoading
                ? "Loading Stores..."
                : "Select Store"}
          </option>
          {availableStores.map((store: Store) => (
            <option key={store.uuid} value={store.uuid}>
              {store.store_name}
            </option>
          ))}
        </select>
        {touched.vendor_store_id && errors.vendor_store_id && <p className="text-red-500 text-sm mt-1">{errors.vendor_store_id}</p>}
      </div>
    </div>
  );

  const renderProductTypeSelector = () => (
    <div className="flex gap-2 flex-wrap border-b border-gray-200 pb-4">
      {["simple", "configurable", "bundle", "downloadable", "virtual", "giftcard"].map(type => (
        <button key={type} type="button" onClick={() => setActiveProductType(type as any)} className={`px-4 py-2 text-sm font-medium capitalize rounded-lg transition ${activeProductType === type ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
          {type}
        </button>
      ))}
    </div>
  );

  const renderGeneralTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-1">SKU <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            onBlur={() => handleBlur("sku")}
            className={`w-full border ${touched.sku && errors.sku ? 'border-red-500' : 'border-gray-300'} rounded-xl p-3`}
            placeholder="Unique product SKU"
          />
          {touched.sku && errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Product Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={() => handleBlur("name")}
            className={`w-full border ${touched.name && errors.name ? 'border-red-500' : 'border-gray-300'} rounded-xl p-3`}
            placeholder="Product name"
          />
          {touched.name && errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        <div><label className="block text-sm font-semibold mb-1">Attribute Set ID</label><input type="number" name="attribute_set_id" value={formData.attribute_set_id} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" /></div>
        <div><label className="block text-sm font-semibold mb-1">Visibility</label><select name="visibility" value={formData.visibility} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3"><option value={1}>Not Visible</option><option value={2}>Catalog</option><option value={3}>Search</option><option value={4}>Catalog & Search</option></select></div>
        <div><label className="block text-sm font-semibold mb-1">Status</label><select name="status" value={formData.status} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3"><option value={1}>Enabled</option><option value={0}>Disabled</option></select></div>
        <div><label className="block text-sm font-semibold mb-1">Weight (kg)</label><input type="number" step="0.01" name="weight" value={formData.weight} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" /></div>
        <div><label className="block text-sm font-semibold mb-1">Tax Class ID</label><input type="number" name="tax_class_id" value={formData.tax_class_id} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" /></div>
      </div>
      <div><label className="block text-sm font-semibold mb-1">Short Description</label><textarea name="short_description" rows={3} value={formData.short_description} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" /></div>
      <div><label className="block text-sm font-semibold mb-1">Full Description</label><textarea name="description" rows={5} value={formData.description} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" /></div>
    </div>
  );

  const renderPricingTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-1">Regular Price <span className="text-red-500">*</span></label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={formData.price}
            onChange={handleChange}
            onBlur={() => handleBlur("price")}
            className={`w-full border ${touched.price && errors.price ? 'border-red-500' : 'border-gray-300'} rounded-xl p-3`}
          />
          {touched.price && errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>
        <div><label className="block text-sm font-semibold mb-1">Special Price</label><input type="number" step="0.01" name="special_price" value={formData.special_price || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" /></div>
        <div><label className="block text-sm font-semibold mb-1">Special Price From</label><input type="date" name="special_from_date" value={formData.special_from_date || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" /></div>
        <div><label className="block text-sm font-semibold mb-1">Special Price To</label><input type="date" name="special_to_date" value={formData.special_to_date || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" /></div>
        <div><label className="block text-sm font-semibold mb-1">Cost (Manufacturer Price)</label><input type="number" step="0.01" name="cost" value={formData.cost || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" /></div>
        <div><label className="block text-sm font-semibold mb-1">MSRP (Manufacturer's Suggested Retail Price)</label><input type="number" step="0.01" name="msrp" value={formData.msrp || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" /></div>
        <div><label className="block text-sm font-semibold mb-1">MSRP Display Type</label><select name="msrp_display_actual_price_type" value={formData.msrp_display_actual_price_type} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3"><option value={0}>Use Config</option><option value={1}>In Cart</option><option value={2}>Before Order Confirmation</option><option value={3}>On Gesture</option></select></div>
      </div>

      {/* Tier Prices
      <div><div className="flex justify-between items-center mb-3"><label className="text-sm font-semibold text-gray-700">Tier Prices (Volume Discounts)</label><button type="button" onClick={() => addToArray("tier_prices", { customer_group_id: 0, qty: 0, price: 0, price_type: "fixed" })} className="px-3 py-1 bg-teal-500 text-white rounded-lg text-sm">+ Add Tier Price</button></div>
        {formData.tier_prices?.map((tier, index) => (<div key={index} className="relative grid grid-cols-4 gap-4 mb-3 p-3 bg-gray-50 rounded-lg"><RemoveButton onClick={() => removeFromArray("tier_prices", index)} />
          <input type="number" placeholder="Customer Group ID" value={tier.customer_group_id} onChange={(e) => handleArrayChange("tier_prices", index, "customer_group_id", parseInt(e.target.value))} className="border rounded-lg p-2" />
          <input type="number" placeholder="Min Qty" value={tier.qty} onChange={(e) => handleArrayChange("tier_prices", index, "qty", parseInt(e.target.value))} className="border rounded-lg p-2" />
          <input type="number" step="0.01" placeholder="Price" value={tier.price} onChange={(e) => handleArrayChange("tier_prices", index, "price", parseFloat(e.target.value))} className="border rounded-lg p-2" />
          <select value={tier.price_type} onChange={(e) => handleArrayChange("tier_prices", index, "price_type", e.target.value)} className="border rounded-lg p-2"><option value="fixed">Fixed</option><option value="percent">Percent</option></select>
        </div>))}
      </div> */}



      {/* Tier Prices */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-semibold text-gray-700">
            Tier Prices (Volume Discounts)
          </label>

          <button
            type="button"
            onClick={() =>
              addToArray("tier_prices", {
                customer_group: "General",
                quantity: 1,
                price: 0,
                website_id: 0,
                price_type: "fixed",
              })
            }
            className="px-3 py-1 bg-teal-500 text-white rounded-lg text-sm"
          >
            + Add Tier Price
          </button>
        </div>

        {formData.tier_prices?.map((tier, index) => (
          <div
            key={index}
            className="relative grid grid-cols-5 gap-4 mb-3 p-3 bg-gray-50 rounded-lg"
          >
            <RemoveButton
              onClick={() => removeFromArray("tier_prices", index)}
            />

            {/* Customer Group */}
            <select
              value={tier.customer_group}
              onChange={(e) =>
                handleArrayChange(
                  "tier_prices",
                  index,
                  "customer_group",
                  e.target.value
                )
              }
              className="border rounded-lg p-2"
            >
              <option value="ALL GROUPS">ALL GROUPS</option>
              <option value="General">General</option>
              <option value="Wholesale">Wholesale</option>
              <option value="Retailer">Retailer</option>
            </select>

            {/* Quantity */}
            <input
              type="number"
              placeholder="Min Qty"
              value={tier.quantity}
              onChange={(e) =>
                handleArrayChange(
                  "tier_prices",
                  index,
                  "quantity",
                  parseInt(e.target.value)
                )
              }
              className="border rounded-lg p-2"
            />

            {/* Price */}
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={tier.price}
              onChange={(e) =>
                handleArrayChange(
                  "tier_prices",
                  index,
                  "price",
                  parseFloat(e.target.value)
                )
              }
              className="border rounded-lg p-2"
            />

            {/* Website ID */}
            <input
              type="number"
              placeholder="Website ID"
              value={tier.website_id}
              onChange={(e) =>
                handleArrayChange(
                  "tier_prices",
                  index,
                  "website_id",
                  parseInt(e.target.value)
                )
              }
              className="border rounded-lg p-2"
            />

            {/* Price Type */}
            <select
              value={tier.price_type}
              onChange={(e) =>
                handleArrayChange(
                  "tier_prices",
                  index,
                  "price_type",
                  e.target.value
                )
              }
              className="border rounded-lg p-2"
            >
              <option value="fixed">Fixed</option>
              <option value="discount">Discount</option>
            </select>
          </div>
        ))}
      </div>



      {/* Product Links */}
      <div><div className="flex justify-between items-center mb-3"><label className="text-sm font-semibold text-gray-700">Product Links (Related/Up-sell/Cross-sell)</label><button type="button" onClick={() => addToArray("product_links", { link_type: "related", linked_sku: "", linked_type: "simple", position: 0 })} className="px-3 py-1 bg-teal-500 text-white rounded-lg text-sm">+ Add Link</button></div>
        {formData.product_links?.map((link, index) => (<div key={index} className="relative grid grid-cols-4 gap-4 mb-3 p-3 bg-gray-50 rounded-lg"><RemoveButton onClick={() => removeFromArray("product_links", index)} />
          <input
            type="text"
            placeholder="Linked Product SKU"
            value={link.linked_sku}  // ✅ Correct
            onChange={(e) => handleArrayChange("product_links", index, "linked_sku", e.target.value)}  // ✅ Correct
          />

          <select value={link.link_type} onChange={(e) => handleArrayChange("product_links", index, "link_type", e.target.value)} className="border rounded-lg p-2"><option value="related">Related</option><option value="upsell">Up-sell</option><option value="crosssell">Cross-sell</option></select>
          <input type="number" placeholder="Position" value={link.position} onChange={(e) => handleArrayChange("product_links", index, "position", parseInt(e.target.value))} className="border rounded-lg p-2" />
        </div>))}
      </div>
    </div>
  );

  const renderInventoryTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-1">Quantity <span className="text-red-500">*</span></label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            onBlur={() => handleBlur("quantity")}
            className={`w-full border ${touched.quantity && errors.quantity ? 'border-red-500' : 'border-gray-300'} rounded-xl p-3`}
          />
          {touched.quantity && errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
        </div>
        <div><label className="flex items-center gap-2"><input type="checkbox" name="manage_stock" checked={formData.manage_stock} onChange={handleChange} className="w-4 h-4" /> Manage Stock</label></div>
        <div><label className="block text-sm font-semibold mb-1">Backorders</label><select name="backorders" value={formData.backorders} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3"><option value={0}>No Backorders</option><option value={1}>Allow Qty Below 0</option><option value={2}>Allow Qty Below 0 & Notify</option></select></div>
        <div><label className="block text-sm font-semibold mb-1">Notify Stock Qty</label><input type="number" name="notify_stock_qty" value={formData.notify_stock_qty} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" /></div>
        <div><label className="block text-sm font-semibold mb-1">Minimum Sale Qty</label><input type="number" name="min_sale_qty" value={formData.min_sale_qty} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" /></div>
        <div><label className="block text-sm font-semibold mb-1">Maximum Sale Qty</label><input type="number" name="max_sale_qty" value={formData.max_sale_qty} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" /></div>
        <div><label className="block text-sm font-semibold mb-1">Qty Increments</label><input type="number" name="qty_increments" value={formData.qty_increments} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" /></div>
        <div><label className="flex items-center gap-2"><input type="checkbox" name="enable_qty_increments" checked={formData.enable_qty_increments} onChange={handleChange} className="w-4 h-4" /> Enable Qty Increments</label></div>
      </div>

      {/* MSI Inventory Source */}
      <div className="border-t pt-4"><h4 className="font-semibold mb-3">MSI Inventory Source</h4>
        <div className="grid grid-cols-2 gap-4"><input type="text" placeholder="Source Code" value={formData.inventory?.source_code} onChange={(e) => setFormData(prev => ({ ...prev, inventory: { ...prev.inventory!, source_code: e.target.value } }))} className="border rounded-lg p-2" />
          <input type="number" placeholder="Quantity" value={formData.inventory?.quantity} onChange={(e) => setFormData(prev => ({ ...prev, inventory: { ...prev.inventory!, quantity: parseFloat(e.target.value) } }))} className="border rounded-lg p-2" />
        </div>
      </div>
    </div>
  );

  const renderImagesTab = () => (
    <div className="space-y-6">
      <div className="flex gap-3 flex-wrap">
        {formData.media_gallery?.map((img, idx) => (<div key={idx} className="relative w-24 h-24 bg-gray-200 rounded-xl overflow-hidden"><img src={`data:${img.content?.type};base64,${img.content?.base64_encoded_data}`} alt={img.label} className="w-full h-full object-cover" /><RemoveButton onClick={() => removeFromArray("media_gallery", idx)} /></div>))}
        <label className="w-24 h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-sm text-gray-500 cursor-pointer hover:border-teal-400 transition">+ Add Image<input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} /></label>
      </div>
      <div className="bg-blue-50 p-4 rounded-lg"><p className="text-sm text-blue-700">First image will be set as base, small, and thumbnail image automatically.</p></div>
    </div>
  );

  const renderSeoTab = () => (
    <div className="space-y-6">
      <div><label className="block text-sm font-semibold mb-1">URL Key</label><input type="text" name="url_key" value={formData.url_key} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" placeholder="product-url-key" /></div>
      <div><label className="block text-sm font-semibold mb-1">Meta Title</label><input type="text" name="meta_title" value={formData.meta_title} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" maxLength={70} /></div>
      <div><label className="block text-sm font-semibold mb-1">Meta Keywords</label><input type="text" name="meta_keyword" value={formData.meta_keyword} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" placeholder="keyword1, keyword2, keyword3" /></div>
      <div><label className="block text-sm font-semibold mb-1">Meta Description</label><textarea name="meta_description" rows={3} value={formData.meta_description} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" maxLength={160} /></div>
    </div>
  );

  const renderCustomOptionsTab = () => (
    <div className="space-y-6">
      <div><div className="flex justify-between items-center mb-3"><label className="text-sm font-semibold text-gray-700">Custom Options</label>

        <button
          type="button"
          onClick={() => addToArray("custom_options", {
            title: "New Option",  // ✅ Has value
            type: "field",
            is_required: false,  // ✅ Correct field name
            sort_order: 0,
            price: 0,
            price_type: "fixed",
            sku: "",
            values: []
          })}
        >
        </button>

      </div>
        {formData.custom_options?.map((option, index) => (<div key={index} className="relative p-4 bg-gray-50 rounded-lg mb-3"><RemoveButton onClick={() => removeFromArray("custom_options", index)} />
          <div className="grid grid-cols-2 gap-4 mb-3"><input type="text" placeholder="Option Title" value={option.title} onChange={(e) => handleArrayChange("custom_options", index, "title", e.target.value)} className="border rounded-lg p-2" />
            <select value={option.type} onChange={(e) => handleArrayChange("custom_options", index, "type", e.target.value)} className="border rounded-lg p-2"><option value="field">Text Field</option><option value="area">Text Area</option><option value="drop_down">Drop-down</option><option value="radio">Radio Buttons</option><option value="checkbox">Checkbox</option><option value="date">Date</option><option value="date_time">Date & Time</option><option value="time">Time</option><option value="file">File</option></select>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-3"><input type="number" step="0.01" placeholder="Price" value={option.price} onChange={(e) => handleArrayChange("custom_options", index, "price", parseFloat(e.target.value))} className="border rounded-lg p-2" />
            <select value={option.price_type} onChange={(e) => handleArrayChange("custom_options", index, "price_type", e.target.value)} className="border rounded-lg p-2"><option value="fixed">Fixed</option><option value="percent">Percent</option></select>
            <input type="text" placeholder="SKU" value={option.sku} onChange={(e) => handleArrayChange("custom_options", index, "sku", e.target.value)} className="border rounded-lg p-2" />
          </div>
          <label className="flex items-center gap-2"><input type="checkbox" checked={option.is_require} onChange={(e) => handleArrayChange("custom_options", index, "is_require", e.target.checked)} className="w-4 h-4" /> Required</label>
        </div>))}
      </div>

      {/* Dynamic Attributes */}
      <div className="border-t pt-4"><h4 className="font-semibold mb-3">Dynamic Custom Attributes</h4>
        <div className="space-y-2">{Object.entries(formData.dynamic_attributes || {}).map(([key, value]) => (<div key={key} className="flex gap-2"><input type="text" placeholder="Attribute Code" value={key} className="border rounded-lg p-2 flex-1" disabled /><input type="text" placeholder="Value" value={value} onChange={(e) => setFormData(prev => ({ ...prev, dynamic_attributes: { ...prev.dynamic_attributes, [key]: e.target.value } }))} className="border rounded-lg p-2 flex-1" /><button type="button" onClick={() => { const { [key]: _, ...rest } = formData.dynamic_attributes || {}; setFormData(prev => ({ ...prev, dynamic_attributes: rest })); }} className="bg-red-500 text-white px-3 rounded-lg">×</button></div>))}
          <button type="button" onClick={() => { const code = prompt("Enter attribute code:"); if (code) setFormData(prev => ({ ...prev, dynamic_attributes: { ...prev.dynamic_attributes, [code]: "" } })); }} className="text-teal-500 text-sm">+ Add Dynamic Attribute</button>
        </div>
      </div>
    </div>
  );

  const renderAdvancedTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><label className="block text-sm font-semibold mb-1">Custom Design</label><input type="text" name="custom_design" value={formData.custom_design} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" /></div>
        <div><label className="block text-sm font-semibold mb-1">Page Layout</label><select name="page_layout" value={formData.page_layout} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3"><option value="">No Layout Updates</option><option value="1column">1 Column</option><option value="2columns-left">2 Columns with Left Bar</option><option value="2columns-right">2 Columns with Right Bar</option><option value="3columns">3 Columns</option></select></div>
        <div><label className="block text-sm font-semibold mb-1">Custom Layout Update (XML)</label>
          <textarea
            name="custom_layout_update"
            rows={4}
            value={formData.custom_layout_update}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-3 font-mono text-sm"
            placeholder="<referenceContainer name='content'><block class='Magento\Framework\View\Element\Template' template='MyModule::custom.phtml'/></referenceContainer>"
          /></div>
        <div><label className="flex items-center gap-2"><input type="checkbox" name="gift_message_available" checked={formData.gift_message_available} onChange={handleChange} className="w-4 h-4" /> Allow Gift Message</label></div>
        <div><label className="block text-sm font-semibold mb-1">News From Date</label><input type="date" name="news_from_date" value={formData.news_from_date || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" /></div>
        <div><label className="block text-sm font-semibold mb-1">News To Date</label><input type="date" name="news_to_date" value={formData.news_to_date || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" /></div>
        <div><label className="block text-sm font-semibold mb-1">Country of Manufacture</label><select name="country_of_manufacture" value={formData.country_of_manufacture} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3"><option value="">Select Country</option><option value="US">United States</option><option value="CN">China</option><option value="IN">India</option><option value="JP">Japan</option><option value="DE">Germany</option><option value="UK">United Kingdom</option></select></div>
      </div>
      <div><label className="block text-sm font-semibold mb-1">Categories</label><input type="text" placeholder="Enter category IDs separated by commas" value={formData.category_ids?.join(", ")} onChange={(e) => setFormData(prev => ({ ...prev, category_ids: e.target.value.split(",").map(id => parseInt(id.trim())).filter(id => !isNaN(id)) }))} className="w-full border border-gray-300 rounded-xl p-3" /></div>
      <div><label className="block text-sm font-semibold mb-1">Website IDs</label><input type="text" placeholder="Enter website IDs separated by commas" value={formData.website_ids?.join(", ")} onChange={(e) => setFormData(prev => ({ ...prev, website_ids: e.target.value.split(",").map(id => parseInt(id.trim())).filter(id => !isNaN(id)) }))} className="w-full border border-gray-300 rounded-xl p-3" /></div>
    </div>
  );

  if (vendorsLoading) {
    return <div className="bg-gray-100 min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div></div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {isSubmitting && <LoadingOverlay />}
      <div className="mx-auto bg-white shadow-sm border border-gray-200 p-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Create New Product</h1>
        {alertMessage && <Alert type={alertMessage.type} message={alertMessage.message} onClose={() => setAlertMessage(null)} />}

        {renderVendorStoreSection()}
        {renderProductTypeSelector()}

        {/* Main Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex gap-1 flex-wrap">
            {["general", "pricing", "inventory", "images", "seo", "options", "advanced"].map(tab => (
              <button key={tab} type="button" onClick={() => setActiveMainTab(tab as any)} className={`px-4 py-2 text-sm font-medium capitalize rounded-t-lg transition ${activeMainTab === tab ? "text-teal-600 border-b-2 border-teal-600 bg-teal-50" : "text-gray-500 hover:text-gray-700"}`}>
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <form onSubmit={handleSubmit}>
          {activeMainTab === "general" && renderGeneralTab()}
          {activeMainTab === "pricing" && renderPricingTab()}
          {activeMainTab === "inventory" && renderInventoryTab()}
          {activeMainTab === "images" && renderImagesTab()}
          {activeMainTab === "seo" && renderSeoTab()}
          {activeMainTab === "options" && renderCustomOptionsTab()}
          {activeMainTab === "advanced" && renderAdvancedTab()}

          {/* Additional product type specific sections */}
          {activeProductType === "configurable" && (
            <div className="mt-6 p-4 bg-purple-50 rounded-lg"><h3 className="font-semibold mb-2">Configurable Product Settings</h3><p className="text-sm text-purple-700">Create simple products first, then link them here using SKUs.</p>
              <input type="text" placeholder="Simple Product SKUs (comma separated)" className="w-full border rounded-lg p-2 mt-2" onChange={(e) => setFormData(prev => ({ ...prev, configurable_product_links: e.target.value.split(",").map(s => s.trim()) }))} />
            </div>
          )}

          {activeProductType === "downloadable" && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg"><h3 className="font-semibold mb-2">Downloadable Product Settings</h3><button type="button" onClick={() => addToArray("downloadable_links", { title: "", sort_order: 0, is_shareable: 1, price: 0, number_of_downloads: 0, link_type: "file", sample_type: "file" })} className="px-3 py-1 bg-teal-500 text-white rounded-lg text-sm mb-2">+ Add Downloadable Link</button>
              {formData.downloadable_links?.map((link, idx) => (<div key={idx} className="grid grid-cols-2 gap-2 mt-2 p-2 bg-white rounded"><input placeholder="Title" value={link.title} onChange={(e) => handleArrayChange("downloadable_links", idx, "title", e.target.value)} className="border rounded p-1" /><input type="number" placeholder="Price" value={link.price} onChange={(e) => handleArrayChange("downloadable_links", idx, "price", parseFloat(e.target.value))} className="border rounded p-1" /><input placeholder="File URL" value={link.link_file || link.link_url} onChange={(e) => handleArrayChange("downloadable_links", idx, link.link_type === "file" ? "link_file" : "link_url", e.target.value)} className="border rounded p-1 col-span-2" /></div>))}
            </div>
          )}

          {activeProductType === "bundle" && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg"><h3 className="font-semibold mb-2">Bundle Product Settings</h3><button type="button" onClick={() => addToArray("bundle_options", { title: "", required: true, type: "select", position: 0, sku: "", product_links: [] })} className="px-3 py-1 bg-teal-500 text-white rounded-lg text-sm">+ Add Bundle Option</button></div>
          )}

          {activeProductType === "giftcard" && (
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg"><h3 className="font-semibold mb-2">Gift Card Settings</h3>
              <div className="grid grid-cols-2 gap-4"><label className="flex items-center gap-2"><input type="radio" name="giftcard_type" value="virtual" checked={formData.giftcard_type === "virtual"} onChange={handleChange} /> Virtual</label>
                <label className="flex items-center gap-2"><input type="radio" name="giftcard_type" value="physical" checked={formData.giftcard_type === "physical"} onChange={handleChange} /> Physical</label>
                <label className="flex items-center gap-2"><input type="radio" name="giftcard_type" value="combined" checked={formData.giftcard_type === "combined"} onChange={handleChange} /> Combined</label>
              </div>
              <div className="mt-3 flex gap-2 flex-wrap">{["25", "50", "100", "200"].map(amount => (<label key={amount} className="flex items-center gap-2 p-2 border rounded"><input type="checkbox" checked={formData.giftcard_amounts?.some(a => a.value === parseInt(amount))} onChange={(e) => { if (e.target.checked) { addToArray("giftcard_amounts", { website_id: 0, value: parseInt(amount) }); } else { const filtered = formData.giftcard_amounts?.filter(a => a.value !== parseInt(amount)); setFormData(prev => ({ ...prev, giftcard_amounts: filtered })); } }} />${amount}</label>))}</div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-6 border-t mt-6">
            <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition" disabled={isSubmitting}>Cancel</button>
            <button type="submit" className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition disabled:bg-teal-300" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create Product"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductForm;