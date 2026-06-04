
// // src/pages/Products/CreateProductForm.tsx
// import { useState, useEffect, useCallback, useRef } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useGetVendorsQuery } from "../../../app/api/VendorSlices/VendorApi";
// import {
//   useCreateVendorProductMutation,
//   useGetAllConfigurableAttributesQuery,
//   useGetAttributeOptionsQuery,
//   type MagentoAttributeOption
// } from "../../../app/api/ProductSlices/ProductApi";
// import type {
//   CreateProductPayload,
//   MediaGalleryEntry,
//   ConfigurableVariant
// } from "../../../app/api/ProductSlices/ProductApi";
// import { useGetAttributeSetsQuery } from "../../../app/api/AttributeSetSlices/AttributeSetApi";
// import { useGetAttributeSetStructureQuery } from "../../../app/api/AttributeSetSlices/AttributeSetApi";
// import { useGetStoresByVendorQuery } from "../../../app/api/StoreSlices/StoreApi";
// import { useGetCategoryTreeQuery, type CategoryTree } from "../../../app/api/CategorySlices/CategoryApi";
// import SearchableSelect from "../../../component/SearchableSelect";

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface Vendor {
//   id: number;
//   uuid: string;
//   company_name: string;
//   company_slug: string;
// }

// interface Store {
//   id: number;
//   uuid: string;
//   store_name: string;
//   store_slug: string;
//   status: string;
// }

// interface AttributeSet {
//   id: string;
//   uuid: string;
//   attribute_set_name: string;
//   magento_attr_set_id: number | null;
// }

// interface FormErrors {
//   [key: string]: string | undefined;
// }

// interface CategoryOption {
//   value: string;
//   label: string;
//   depth: number;
// }

// interface AttributeSetAttribute {
//   attribute_id: number;
//   attribute_code: string;
//   frontend_label: string;
//   sort_order: number;
//   is_system: boolean;
//   is_required: boolean;
//   frontend_input?: string;
//   default_value?: any;
//   options?: Array<{ value: string; label: string }>;
// }

// interface AttributeGroup {
//   attribute_group_id: number;
//   attribute_group_name: string;
//   sort_order: number;
//   attributes: AttributeSetAttribute[];
// }

// type ConfigurableStep = "select-attributes" | "attribute-values" | "bulk-images-price" | "summary";

// interface BulkConfig {
//   images: {
//     mode: "single" | "unique" | "skip";
//     attributeCode?: string;
//     singleFile?: File;
//     uniqueImages?: Record<string, File>;
//   };
//   price: {
//     mode: "single" | "unique" | "skip";
//     attributeCode?: string;
//     singleValue?: number;
//     uniqueValues?: Record<string, number>;
//   };
//   quantity: {
//     mode: "single" | "unique" | "skip";
//     attributeCode?: string;
//     singleValue?: number;
//     uniqueValues?: Record<string, number>;
//   };
// }

// // ─── Dynamic Attribute Field Component ────────────────────────────────────────

// const DynamicAttributeField = ({
//   attribute,
//   value,
//   onChange,
//   onBlur,
//   error,
//   touched
// }: {
//   attribute: AttributeSetAttribute;
//   value: any;
//   onChange: (code: string, value: any) => void;
//   onBlur: (code: string) => void;
//   error?: string;
//   touched?: boolean;
// }) => {
//   const hasError = error && touched;

//   const handleChange = (newValue: any) => {
//     onChange(attribute.attribute_code, newValue);
//   };

//   const handleBlur = () => {
//     onBlur(attribute.attribute_code);
//   };

//   const inputType = attribute.frontend_input || 'text';

//   switch (inputType) {
//     case 'select':
//     case 'dropdown':
//       return (
//         <div className="mb-4">
//           <label className="block text-sm font-semibold mb-1">
//             {attribute.frontend_label}
//             {attribute.is_required && <span className="text-red-500 ml-1">*</span>}
//           </label>
//           <select
//             value={value || ''}
//             onChange={(e) => handleChange(e.target.value)}
//             onBlur={handleBlur}
//             className={`w-full border rounded-lg p-2 ${hasError ? 'border-red-500' : 'border-gray-300'}`}
//           >
//             <option value="">-- Select {attribute.frontend_label} --</option>
//             {attribute.options?.map(opt => (
//               <option key={opt.value} value={opt.value}>{opt.label}</option>
//             ))}
//           </select>
//           {hasError && <p className="text-red-500 text-sm mt-1">{error}</p>}
//         </div>
//       );

//     case 'multiselect':
//       return (
//         <div className="mb-4">
//           <label className="block text-sm font-semibold mb-1">
//             {attribute.frontend_label}
//             {attribute.is_required && <span className="text-red-500 ml-1">*</span>}
//           </label>
//           <select
//             multiple
//             value={Array.isArray(value) ? value : (value ? [value] : [])}
//             onChange={(e) => {
//               const selected = Array.from(e.target.selectedOptions, opt => opt.value);
//               handleChange(selected);
//             }}
//             onBlur={handleBlur}
//             className={`w-full border rounded-lg p-2 ${hasError ? 'border-red-500' : 'border-gray-300'}`}
//             size={Math.min(attribute.options?.length || 5, 5)}
//           >
//             {attribute.options?.map(opt => (
//               <option key={opt.value} value={opt.value}>{opt.label}</option>
//             ))}
//           </select>
//           {hasError && <p className="text-red-500 text-sm mt-1">{error}</p>}
//         </div>
//       );

//     case 'boolean':
//       return (
//         <div className="mb-4 flex items-center gap-2">
//           <input
//             type="checkbox"
//             id={attribute.attribute_code}
//             checked={value === '1' || value === 1 || value === true}
//             onChange={(e) => handleChange(e.target.checked ? '1' : '0')}
//             onBlur={handleBlur}
//             className="w-4 h-4"
//           />
//           <label htmlFor={attribute.attribute_code} className="text-sm font-semibold">
//             {attribute.frontend_label}
//             {attribute.is_required && <span className="text-red-500 ml-1">*</span>}
//           </label>
//         </div>
//       );

//     case 'textarea':
//       return (
//         <div className="mb-4">
//           <label className="block text-sm font-semibold mb-1">
//             {attribute.frontend_label}
//             {attribute.is_required && <span className="text-red-500 ml-1">*</span>}
//           </label>
//           <textarea
//             value={value || ''}
//             onChange={(e) => handleChange(e.target.value)}
//             onBlur={handleBlur}
//             rows={4}
//             className={`w-full border rounded-lg p-2 ${hasError ? 'border-red-500' : 'border-gray-300'}`}
//           />
//           {hasError && <p className="text-red-500 text-sm mt-1">{error}</p>}
//         </div>
//       );

//     case 'price':
//       return (
//         <div className="mb-4">
//           <label className="block text-sm font-semibold mb-1">
//             {attribute.frontend_label}
//             {attribute.is_required && <span className="text-red-500 ml-1">*</span>}
//           </label>
//           <div className="relative">
//             <span className="absolute left-3 top-2 text-gray-500">$</span>
//             <input
//               type="number"
//               step="0.01"
//               value={value || ''}
//               onChange={(e) => handleChange(parseFloat(e.target.value))}
//               onBlur={handleBlur}
//               className={`w-full pl-7 border rounded-lg p-2 ${hasError ? 'border-red-500' : 'border-gray-300'}`}
//             />
//           </div>
//           {hasError && <p className="text-red-500 text-sm mt-1">{error}</p>}
//         </div>
//       );

//     case 'date':
//       return (
//         <div className="mb-4">
//           <label className="block text-sm font-semibold mb-1">
//             {attribute.frontend_label}
//             {attribute.is_required && <span className="text-red-500 ml-1">*</span>}
//           </label>
//           <input
//             type="date"
//             value={value || ''}
//             onChange={(e) => handleChange(e.target.value)}
//             onBlur={handleBlur}
//             className={`w-full border rounded-lg p-2 ${hasError ? 'border-red-500' : 'border-gray-300'}`}
//           />
//           {hasError && <p className="text-red-500 text-sm mt-1">{error}</p>}
//         </div>
//       );

//     default:
//       return (
//         <div className="mb-4">
//           <label className="block text-sm font-semibold mb-1">
//             {attribute.frontend_label}
//             {attribute.is_required && <span className="text-red-500 ml-1">*</span>}
//           </label>
//           <input
//             type="text"
//             value={value || ''}
//             onChange={(e) => handleChange(e.target.value)}
//             onBlur={handleBlur}
//             className={`w-full border rounded-lg p-2 ${hasError ? 'border-red-500' : 'border-gray-300'}`}
//           />
//           {hasError && <p className="text-red-500 text-sm mt-1">{error}</p>}
//         </div>
//       );
//   }
// };

// // ─── MultiSelectTree Component ────────────────────────────────────────────────

// const MultiSelectTree = ({
//   options,
//   selectedValues,
//   onChange,
//   placeholder
// }: {
//   options: CategoryOption[];
//   selectedValues: string[];
//   onChange: (values: string[]) => void;
//   placeholder: string;
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const toggleOption = (value: string) => {
//     if (selectedValues.includes(value)) {
//       onChange(selectedValues.filter(v => v !== value));
//     } else {
//       onChange([...selectedValues, value]);
//     }
//   };

//   const filteredOptions = options.filter(option =>
//     option.label.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const getSelectedLabels = () => {
//     return options
//       .filter(opt => selectedValues.includes(opt.value))
//       .map(opt => opt.label);
//   };

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <div
//         className="min-h-[42px] px-3 py-2 border border-gray-300 rounded-xl bg-white cursor-pointer flex flex-wrap gap-1 items-center"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         {selectedValues.length > 0 ? (
//           getSelectedLabels().map((label, idx) => (
//             <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-teal-100 text-teal-700 rounded-md text-sm">
//               {label}
//               <button
//                 type="button"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   onChange(selectedValues.filter((_, i) => i !== idx));
//                 }}
//                 className="hover:text-teal-900"
//               >
//                 ×
//               </button>
//             </span>
//           ))
//         ) : (
//           <span className="text-gray-400 text-sm">{placeholder}</span>
//         )}
//       </div>

//       {isOpen && (
//         <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-hidden">
//           <div className="p-2 border-b border-gray-100">
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search categories..."
//               className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:border-teal-400"
//               onClick={(e) => e.stopPropagation()}
//               autoFocus
//             />
//           </div>
//           <div className="overflow-y-auto max-h-60">
//             {filteredOptions.length > 0 ? (
//               filteredOptions.map(option => (
//                 <label
//                   key={option.value}
//                   className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
//                   style={{ paddingLeft: `${12 + option.depth * 20}px` }}
//                 >
//                   <input
//                     type="checkbox"
//                     checked={selectedValues.includes(option.value)}
//                     onChange={() => toggleOption(option.value)}
//                     className="w-4 h-4 rounded border-gray-300 text-teal-500 focus:ring-teal-500"
//                   />
//                   <span className="text-sm text-gray-700">{option.label}</span>
//                 </label>
//               ))
//             ) : (
//               <div className="px-3 py-2 text-sm text-gray-500 text-center">
//                 No categories found
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // ─── Helper Component ─────────────────────────────────────────────────────────

// const AttributeValueFetcher = ({
//   attributeId,
//   vendorId,
//   onOptionsLoaded
// }: {
//   attributeId: number;
//   vendorId: string;
//   onOptionsLoaded: (attributeId: number, options: any[]) => void;
// }) => {
//   const { data: options } = useGetAttributeOptionsQuery(
//     { vendor_uuid: vendorId, attributeId },
//     { skip: !vendorId || !attributeId }
//   );

//   useEffect(() => {
//     if (options) {
//       const optionsArray = Array.isArray(options) ? options : (options.data || options.items || []);
//       onOptionsLoaded(attributeId, optionsArray);
//     }
//   }, [options, attributeId, onOptionsLoaded]);

//   return null;
// };

// // ─── Main Component ──────────────────────────────────────────────────────────

// const CreateProductForm = () => {
//   const navigate = useNavigate();
//   const { vendor_uuid } = useParams<{ vendor_uuid: string }>();

//   // UI State
//   const [activeMainTab, setActiveMainTab] = useState<"general" | "pricing" | "inventory" | "images" | "seo" | "options" | "advanced">("general");
//   const [activeProductType, setActiveProductType] = useState<CreateProductPayload['type_id']>("simple");
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [alertMessage, setAlertMessage] = useState<{ type: "success" | "error"; message: string } | null>(null);
//   const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
//   const [pendingProductType, setPendingProductType] = useState<CreateProductPayload['type_id'] | null>(null);
//   const [showTypeChangeConfirm, setShowTypeChangeConfirm] = useState(false);

//   // Dynamic Attribute State
//   const [attributeSetGroups, setAttributeSetGroups] = useState<AttributeGroup[]>([]);
//   const [dynamicFieldErrors, setDynamicFieldErrors] = useState<Record<string, string>>({});
//   const [dynamicFieldTouched, setDynamicFieldTouched] = useState<Record<string, boolean>>({});

//   // Configurable product state
//   const [configurableStep, setConfigurableStep] = useState<ConfigurableStep>("select-attributes");
//   const [bulkConfig, setBulkConfig] = useState<BulkConfig>({
//     images: { mode: "skip" },
//     price: { mode: "skip" },
//     quantity: { mode: "skip" }
//   });
//   const [previewVariants, setPreviewVariants] = useState<ConfigurableVariant[]>([]);
//   const [selectedAll, setSelectedAll] = useState<Record<number, boolean>>({});

//   // Selected vendor state
//   const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
//   const [selectedVendorUuidForAttrSets, setSelectedVendorUuidForAttrSets] = useState<string>("");
//   const [selectedVendorUuid, setSelectedVendorUuid] = useState<string>("");

//   // Category state
//   const [selectedCategoryUuids, setSelectedCategoryUuids] = useState<string[]>([]);
//   const [categoryTreeData, setCategoryTreeData] = useState<CategoryTree[]>([]);

//   // Configurable attributes state
//   const [availableAttributes, setAvailableAttributes] = useState<any[]>([]);
//   const [selectedAttributes, setSelectedAttributes] = useState<any[]>([]);
//   const [attributeValues, setAttributeValues] = useState<Record<string, any[]>>({});

//   // ─── API Queries ────────────────────────────────────────────────────────────

//   const { data: vendorsData, isLoading: vendorsLoading } = useGetVendorsQuery({});

//   const {
//     data: attributeSetsResponse,
//     isLoading: attributeSetsLoading,
//   } = useGetAttributeSetsQuery(
//     { vendor_uuid: selectedVendorUuidForAttrSets, page: 1, per_page: 100 },
//     { skip: !selectedVendorUuidForAttrSets }
//   );

//   const {
//     data: categoryTreeResponse,
//     isLoading: categoryTreeLoading,
//   } = useGetCategoryTreeQuery(
//     { vendor_uuid: selectedVendorUuidForAttrSets, depth: 10 },
//     { skip: !selectedVendorUuidForAttrSets }
//   );

//   const {
//     data: storesResponse,
//     isLoading: storesLoading,
//   } = useGetStoresByVendorQuery(selectedVendor?.uuid || "", {
//     skip: !selectedVendor?.uuid,
//   });

//   const {
//     data: configurableAttributesData,
//     isLoading: attributesLoading,
//   } = useGetAllConfigurableAttributesQuery(
//     {
//       vendor_uuid: selectedVendorUuid,
//       search_criteria: { filter_groups: [] }
//     },
//     { skip: !selectedVendorUuid || activeProductType !== 'configurable' }
//   );

//   const [createVendorProduct, { isLoading: isSubmitting }] = useCreateVendorProductMutation();

//   // ✅ DEFINE DERIVED VALUES HERE - before they're used in useEffects
//   const attributeSets = attributeSetsResponse?.data || [];
//   const availableStores = storesResponse?.data?.stores || [];

//   // ─── Form Data State ────────────────────────────────────────────────────────

//   const [formData, setFormData] = useState<CreateProductPayload>({
//     vendor_id: vendor_uuid || "",
//     vendor_store_id: "",
//     sku: "",
//     name: "",
//     type_id: "simple",
//     attribute_set_id: "",
//     price: 0,
//     status: 1,
//     visibility: 4,
//     weight: 0,
//     tax_class_id: 2,
//     quantity: 0,
//     description: "",
//     short_description: "",
//     url_key: "",
//     meta_title: "",
//     meta_keyword: "",
//     meta_description: "",
//     special_price: undefined,
//     special_from_date: undefined,
//     special_to_date: undefined,
//     cost: undefined,
//     msrp: undefined,
//     msrp_display_actual_price_type: 0,
//     manage_stock: true,
//     backorders: 0,
//     notify_stock_qty: 0,
//     min_sale_qty: 1,
//     max_sale_qty: 0,
//     qty_increments: 1,
//     enable_qty_increments: false,
//     custom_design: "",
//     page_layout: "",
//     custom_layout_update: "",
//     gift_message_available: false,
//     news_from_date: undefined,
//     news_to_date: undefined,
//     country_of_manufacture: "",
//     category_ids: [],
//     media_gallery: [],
//     product_links: [],
//     custom_options: [],
//     tier_prices: [],
//     inventory: { source_code: "default", quantity: 0, status: 1 },
//     website_ids: [1],
//     dynamic_attributes: {},
//     configurable_attributes: [],
//     configurable_options: [],
//     configurable_variants: [],
//     grouped_links: [],
//     bundle_options: [],
//     bundle_shipping_type: "together",
//     bundle_price_type: "dynamic",
//     bundle_sku_type: "dynamic",
//     downloadable_links: [],
//     downloadable_samples: [],
//     links_purchased_separately: false,
//     links_title: "Downloads",
//     samples_title: "Samples",
//     giftcard_amounts: [],
//     giftcard_type: "virtual",
//     giftcard_amount_type: "fixed",
//     giftcard_open_amount_min: 0,
//     giftcard_open_amount_max: 0,
//     allow_message: true,
//     gift_message_max_length: 255,
//   });

//   // ─── Attribute Set Structure Query ──────────────────────────────────────────

//   const {
//     data: attributeSetStructure,
//     isLoading: structureLoading,
//   } = useGetAttributeSetStructureQuery(
//     {
//       vendor_uuid: formData.vendor_id,
//       id: formData.attribute_set_id   // ✅ matches the query param name
//     },
//     { skip: !formData.vendor_id || !formData.attribute_set_id }
//   );

//   // ─── useEffect Hooks ────────────────────────────────────────────────────────

//   // ✅ Set default attribute set when vendor loads
//   useEffect(() => {
//     if (attributeSets.length > 0 && !formData.attribute_set_id) {
//       const defaultSet = attributeSets.find((set: AttributeSet) => set.attribute_set_name === "Default") || attributeSets[0];
//       if (defaultSet) {
//         setFormData(prev => ({ ...prev, attribute_set_id: defaultSet.uuid }));
//       }
//     }
//   }, [attributeSets, formData.attribute_set_id]);

//   // Process attribute set structure when loaded
//   useEffect(() => {
//     if (attributeSetStructure?.success && attributeSetStructure?.data) {
//       const structure = attributeSetStructure.data;
//       const sortedGroups = [...(structure.groups || [])]
//         .filter(group => group.attributes && group.attributes.length > 0)
//         .sort((a, b) => a.sort_order - b.sort_order);
//       setAttributeSetGroups(sortedGroups);

//       const initialDynamicValues: Record<string, any> = {};
//       sortedGroups.forEach(group => {
//         group.attributes.forEach(attr => {
//           if (attr.default_value !== undefined && attr.default_value !== null) {
//             initialDynamicValues[attr.attribute_code] = attr.default_value;
//           }
//         });
//       });

//       setFormData(prev => ({
//         ...prev,
//         dynamic_attributes: { ...prev.dynamic_attributes, ...initialDynamicValues }
//       }));
//     }
//   }, [attributeSetStructure]);

//   // Update selected vendor
//   useEffect(() => {
//     if (formData.vendor_id && vendorsData?.data) {
//       const vendor = vendorsData.data.find((v: Vendor) => v.uuid === formData.vendor_id);
//       setSelectedVendor(vendor || null);
//       setSelectedVendorUuidForAttrSets(formData.vendor_id);
//     } else if (vendor_uuid) {
//       setFormData(prev => ({ ...prev, vendor_id: vendor_uuid }));
//       setSelectedVendorUuidForAttrSets(vendor_uuid);
//     } else {
//       setSelectedVendor(null);
//       setSelectedVendorUuidForAttrSets("");
//     }
//   }, [formData.vendor_id, vendorsData, vendor_uuid]);

//   // Update category tree data
//   useEffect(() => {
//     if (categoryTreeResponse?.data && Array.isArray(categoryTreeResponse.data)) {
//       setCategoryTreeData(categoryTreeResponse.data);
//     } else if (categoryTreeResponse?.data && typeof categoryTreeResponse.data === 'object') {
//       const treeData = (categoryTreeResponse.data as any).tree ||
//         (categoryTreeResponse.data as any).categories || [];
//       setCategoryTreeData(Array.isArray(treeData) ? treeData : []);
//     } else {
//       setCategoryTreeData([]);
//     }
//   }, [categoryTreeResponse]);

//   // Auto-generate SKU from name
//   useEffect(() => {
//     if (formData.name && !formData.sku) {
//       const generatedSku = formData.name
//         .toLowerCase()
//         .replace(/[^a-z0-9]+/g, '-')
//         .replace(/^-+|-+$/g, '');
//       setFormData(prev => ({ ...prev, sku: generatedSku }));
//     }
//   }, [formData.name]);

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

//   // Update vendor UUID for configurable attributes
//   useEffect(() => {
//     if (activeProductType === 'configurable' && formData.vendor_id) {
//       setSelectedVendorUuid(formData.vendor_id);
//     }
//   }, [activeProductType, formData.vendor_id]);

//   // Update available configurable attributes
//   useEffect(() => {
//     if (configurableAttributesData?.data) {
//       setAvailableAttributes(configurableAttributesData.data);
//     } else if (Array.isArray(configurableAttributesData)) {
//       setAvailableAttributes(configurableAttributesData);
//     } else {
//       setAvailableAttributes([]);
//     }
//   }, [configurableAttributesData]);

//   // ─── Helper Functions ───────────────────────────────────────────────────────

//   // const availableStores = storesResponse?.data?.stores || [];
//   // const attributeSets = attributeSetsResponse?.data || [];

//   const buildCategoryOptions = (categories: CategoryTree[], depth: number = 0): CategoryOption[] => {
//     const options: CategoryOption[] = [];
//     for (const category of categories) {
//       if (category.name !== "Root Catalog" && category.name !== "Default Category" && category.level > 0) {
//         options.push({
//           value: category.uuid,
//           label: `${"— ".repeat(depth)}${category.name}`,
//           depth: depth
//         });
//       }
//       if (category.children && category.children.length > 0) {
//         options.push(...buildCategoryOptions(category.children, depth + 1));
//       }
//     }
//     return options;
//   };

//   const handleCategoryChange = (selectedUuids: string[]) => {
//     setSelectedCategoryUuids(selectedUuids);
//     setFormData(prev => ({ ...prev, category_ids: selectedUuids.map(id => parseInt(id) || 0) }));
//   };

//   const handleDynamicAttributeChange = (attributeCode: string, value: any) => {
//     setFormData(prev => ({
//       ...prev,
//       dynamic_attributes: {
//         ...prev.dynamic_attributes,
//         [attributeCode]: value
//       }
//     }));
//     if (dynamicFieldErrors[attributeCode]) {
//       setDynamicFieldErrors(prev => ({ ...prev, [attributeCode]: '' }));
//     }
//   };

//   const handleDynamicAttributeBlur = (attributeCode: string) => {
//     setDynamicFieldTouched(prev => ({ ...prev, [attributeCode]: true }));
//     let attribute: AttributeSetAttribute | undefined;
//     for (const group of attributeSetGroups) {
//       const found = group.attributes.find(attr => attr.attribute_code === attributeCode);
//       if (found) {
//         attribute = found;
//         break;
//       }
//     }
//     if (attribute?.is_required && !formData.dynamic_attributes?.[attributeCode]) {
//       setDynamicFieldErrors(prev => ({
//         ...prev,
//         [attributeCode]: `${attribute.frontend_label} is required`
//       }));
//     }
//   };

//   const handleProductTypeChange = (type: CreateProductPayload['type_id']) => {
//     if (activeProductType === type) return;
//     if (activeProductType !== "simple") {
//       setPendingProductType(type);
//       setShowTypeChangeConfirm(true);
//     } else {
//       performProductTypeChange(type);
//     }
//   };

//   const performProductTypeChange = (type: CreateProductPayload['type_id']) => {
//     setActiveProductType(type);
//     resetTypeSpecificFields(type);
//     setPendingProductType(null);
//     setShowTypeChangeConfirm(false);
//   };

//   const resetTypeSpecificFields = (type: CreateProductPayload['type_id']) => {
//     setFormData(prev => {
//       const base = { ...prev, type_id: type };
//       if (['virtual', 'downloadable', 'giftcard'].includes(type)) {
//         base.weight = undefined;
//       }
//       if (type !== 'configurable') {
//         base.configurable_attributes = [];
//         base.configurable_options = [];
//         base.configurable_variants = [];
//         setConfigurableStep("select-attributes");
//         setSelectedAttributes([]);
//         setAttributeValues({});
//       }
//       if (type !== 'grouped') {
//         base.grouped_links = [];
//       }
//       if (type !== 'bundle') {
//         base.bundle_options = [];
//       }
//       if (type !== 'downloadable') {
//         base.downloadable_links = [];
//         base.downloadable_samples = [];
//       }
//       if (type === 'configurable') {
//         base.visibility = 4;
//       }
//       return base;
//     });
//   };

//   const validateDynamicFields = (): boolean => {
//     let isValid = true;
//     const newErrors: Record<string, string> = {};
//     attributeSetGroups.forEach(group => {
//       group.attributes.forEach(attr => {
//         if (attr.is_required && !formData.dynamic_attributes?.[attr.attribute_code]) {
//           newErrors[attr.attribute_code] = `${attr.frontend_label} is required`;
//           isValid = false;
//         }
//       });
//     });
//     setDynamicFieldErrors(newErrors);
//     return isValid;
//   };

//   const validateForm = (): boolean => {
//     const newErrors: FormErrors = {};
//     if (!formData.vendor_id) newErrors.vendor_id = "Vendor is required";
//     if (!formData.vendor_store_id) newErrors.vendor_store_id = "Store is required";
//     if (!formData.sku?.trim()) newErrors.sku = "SKU is required";
//     if (!formData.name?.trim()) newErrors.name = "Product name is required";
//     if (formData.type_id !== 'grouped' && (!formData.price || formData.price <= 0)) {
//       newErrors.price = "Valid price is required";
//     }
//     if (formData.type_id !== 'configurable' && formData.type_id !== 'grouped') {
//       if (formData.quantity === undefined || formData.quantity < 0) {
//         newErrors.quantity = "Valid quantity is required";
//       }
//     }
//     if (formData.type_id === 'configurable' && !formData.configurable_variants?.length) {
//       newErrors.configurable_variants = "At least one variant is required";
//     }
//     if (formData.type_id === 'bundle' && !formData.bundle_options?.length) {
//       newErrors.bundle_options = "At least one bundle option is required";
//     }
//     if (formData.type_id === 'grouped' && !formData.grouped_links?.length) {
//       newErrors.grouped_links = "At least one grouped product is required";
//     }
//     setErrors(newErrors);
//     const dynamicValid = validateDynamicFields();
//     return Object.keys(newErrors).length === 0 && dynamicValid;
//   };

//   const handleBlur = (field: string) => {
//     setTouched(prev => ({ ...prev, [field]: true }));
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

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setAlertMessage(null);

//     if (!validateForm()) {
//       setAlertMessage({ type: "error", message: "Please fix validation errors before submitting." });
//       window.scrollTo({ top: 0, behavior: "smooth" });
//       return;
//     }

//     const vendorToUse = vendor_uuid || formData.vendor_id;
//     if (!vendorToUse) {
//       setAlertMessage({ type: "error", message: "Vendor UUID is missing." });
//       window.scrollTo({ top: 0, behavior: "smooth" });
//       return;
//     }

//     let payload = { ...formData, type_id: activeProductType };

//     if (activeProductType === 'configurable' && payload.configurable_variants) {
//       payload.configurable_variants = payload.configurable_variants.map(variant => ({
//         ...variant,
//         sku: variant.sku?.startsWith('-') || !variant.sku ?
//           `${payload.sku}-${variant.sku.replace(/^-/, '')}` : variant.sku,
//         name: variant.name?.startsWith(' -') || !variant.name ?
//           `${payload.name}${variant.name}` : variant.name
//       }));
//     }

//     // Clean undefined values
//     Object.keys(payload).forEach(key => {
//       const fieldKey = key as keyof CreateProductPayload;
//       if (payload[fieldKey] === undefined ||
//         (Array.isArray(payload[fieldKey]) && (payload[fieldKey] as any[]).length === 0)) {
//         delete payload[fieldKey];
//       }
//     });

//     if (['virtual', 'downloadable', 'giftcard'].includes(activeProductType)) {
//       delete payload.weight;
//     }

//     try {
//       const result = await createVendorProduct({ vendor_uuid: vendorToUse, data: payload }).unwrap();
//       if (result.success) {
//         setAlertMessage({ type: "success", message: "Product created successfully and synced to Magento!" });
//         setTimeout(() => navigate(`/vendor/${vendorToUse}/products`), 2000);
//       }
//     } catch (error: any) {
//       console.error("Submit error:", error);
//       const errorMessage = error?.data?.message || error?.message || "Failed to create product";
//       setAlertMessage({ type: "error", message: errorMessage });
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     }
//   };

//   // ─── Configurable Product Helper Functions ──────────────────────────────────

//   const addConfigurableOptionValue = (attribute: any, value: any) => {
//     const existingOptions = formData.configurable_options || [];
//     const existingAttr = existingOptions.find(opt => opt.attribute_id === attribute.attribute_id);

//     if (existingAttr) {
//       const updated = existingOptions.map(opt =>
//         opt.attribute_id === attribute.attribute_id
//           ? { ...opt, values: [...opt.values, { value_index: value.value_index }] }
//           : opt
//       );
//       setFormData(prev => ({ ...prev, configurable_options: updated }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         configurable_options: [
//           ...(prev.configurable_options || []),
//           {
//             attribute_id: attribute.attribute_id,
//             label: attribute.default_frontend_label,
//             values: [{ value_index: value.value_index }]
//           }
//         ]
//       }));
//     }
//   };

//   const removeConfigurableOptionValue = (attribute: any, value: any) => {
//     const existingOptions = formData.configurable_options || [];
//     const existingAttr = existingOptions.find(opt => opt.attribute_id === attribute.attribute_id);

//     if (existingAttr) {
//       const updatedValues = existingAttr.values.filter(v => v.value_index !== value.value_index);
//       if (updatedValues.length === 0) {
//         const updated = existingOptions.filter(opt => opt.attribute_id !== attribute.attribute_id);
//         setFormData(prev => ({ ...prev, configurable_options: updated }));
//       } else {
//         const updated = existingOptions.map(opt =>
//           opt.attribute_id === attribute.attribute_id
//             ? { ...opt, values: updatedValues }
//             : opt
//         );
//         setFormData(prev => ({ ...prev, configurable_options: updated }));
//       }
//     }
//   };

//   const handleSelectAll = (attributeId: number, allValues: any[]) => {
//     const allSelected = !selectedAll[attributeId];
//     setSelectedAll(prev => ({ ...prev, [attributeId]: allSelected }));
//     const attribute = selectedAttributes.find(attr => attr.attribute_id === attributeId);
//     if (attribute) {
//       allValues.forEach(value => {
//         if (allSelected) {
//           addConfigurableOptionValue(attribute, value);
//         } else {
//           removeConfigurableOptionValue(attribute, value);
//         }
//       });
//     }
//   };

//   const cartesianProduct = (arrays: any[][]): any[][] => {
//     if (!arrays.length) return [[]];
//     const result: any[][] = [];
//     const first = arrays[0];
//     const rest = cartesianProduct(arrays.slice(1));
//     for (const item of first) {
//       for (const combo of rest) {
//         result.push([item, ...combo]);
//       }
//     }
//     return result;
//   };

//   const handleOptionsLoaded = useCallback((attributeId: number, options: any[]) => {
//     setAttributeValues(prev => {
//       const currentValue = prev[attributeId];
//       if (JSON.stringify(currentValue) === JSON.stringify(options)) {
//         return prev;
//       }
//       return { ...prev, [attributeId]: options };
//     });
//   }, []);

//   const generatePreviewVariants = () => {
//     const attributeValueSets = selectedAttributes.map(attr =>
//       attributeValues[attr.attribute_id]?.filter(v =>
//         formData.configurable_options?.find(opt =>
//           opt.attribute_id === attr.attribute_id &&
//           opt.values?.some(vv => vv.value_index === v.value_index)
//         )
//       ) || []
//     );

//     const combinations = cartesianProduct(attributeValueSets);
//     const parentSku = formData.sku;
//     const parentName = formData.name;

//     const variants = combinations.map((combo, index) => {
//       let price = formData.price;
//       let quantity = 0;

//       if (bulkConfig.price.mode === "single" && bulkConfig.price.singleValue) {
//         price = bulkConfig.price.singleValue;
//       } else if (bulkConfig.price.mode === "unique" && bulkConfig.price.attributeCode && bulkConfig.price.uniqueValues) {
//         const attrValue = combo.find(v => v.attribute_code === bulkConfig.price.attributeCode);
//         if (attrValue && bulkConfig.price.uniqueValues[attrValue.value]) {
//           price = bulkConfig.price.uniqueValues[attrValue.value];
//         }
//       }

//       if (bulkConfig.quantity.mode === "single" && bulkConfig.quantity.singleValue) {
//         quantity = bulkConfig.quantity.singleValue;
//       } else if (bulkConfig.quantity.mode === "unique" && bulkConfig.quantity.attributeCode && bulkConfig.quantity.uniqueValues) {
//         const attrValue = combo.find(v => v.attribute_code === bulkConfig.quantity.attributeCode);
//         if (attrValue && bulkConfig.quantity.uniqueValues[attrValue.value]) {
//           quantity = bulkConfig.quantity.uniqueValues[attrValue.value];
//         }
//       }

//       const variantNumber = String(index + 1).padStart(3, '0');
//       const variantSku = parentSku ? `${parentSku}-${variantNumber}` : `variant-${variantNumber}`;
//       const variantName = parentName ? `${parentName} - ${combo.map(v => v.value).join(' ')}` : `Variant - ${combo.map(v => v.value).join(' ')}`;

//       return {
//         sku: variantSku,
//         name: variantName,
//         price: price,
//         quantity: quantity,
//         weight: formData.weight || 0,
//         attribute_set_id: 4,
//         status: 1,
//         visibility: 1,
//         configurable_attributes: combo.reduce((acc, val, idx) => ({
//           ...acc,
//           [selectedAttributes[idx].attribute_code]: val.value_index
//         }), {})
//       };
//     });

//     setPreviewVariants(variants);
//     return variants;
//   };

//   const applyBulkConfigAndGenerate = () => {
//     const variants = generatePreviewVariants();
//     setFormData(prev => ({
//       ...prev,
//       configurable_variants: variants
//     }));
//     setConfigurableStep("summary");
//   };

//   // ─── Render Functions ───────────────────────────────────────────────────────

//   const renderDynamicAttributesByGroup = () => {
//     if (structureLoading) {
//       return (
//         <div className="text-center py-8">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
//           <p className="text-gray-500 mt-2">Loading attribute fields...</p>
//         </div>
//       );
//     }
//     if (attributeSetGroups.length === 0) return null;

//     return attributeSetGroups.map((group) => (
//       <div key={group.attribute_group_id} className="border-t pt-4 mt-4 first:border-t-0 first:pt-0 first:mt-0">
//         <h3 className="font-semibold text-lg mb-4 text-gray-800">{group.attribute_group_name}</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {group.attributes.map((attr) => (
//             <DynamicAttributeField
//               key={attr.attribute_id}
//               attribute={attr}
//               value={formData.dynamic_attributes?.[attr.attribute_code]}
//               onChange={handleDynamicAttributeChange}
//               onBlur={handleDynamicAttributeBlur}
//               error={dynamicFieldErrors[attr.attribute_code]}
//               touched={dynamicFieldTouched[attr.attribute_code]}
//             />
//           ))}
//         </div>
//       </div>
//     ));
//   };

//   const renderVendorStoreSection = () => {
//     const vendorOptions = vendorsData?.data?.map((vendor: Vendor) => ({
//       value: vendor.uuid,
//       label: vendor.company_name
//     })) || [];

//     const storeOptions = availableStores.map((store: Store) => ({
//       value: store.uuid,
//       label: store.store_name
//     }));

//     const attributeSetOptions = attributeSets.map((set: AttributeSet) => ({
//       value: set.uuid,
//       label: set.attribute_set_name
//     }));

//     const categoryOptions = buildCategoryOptions(categoryTreeData, 0);

//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-xl">
//         <div>
//           <label className="block text-sm font-semibold mb-2 text-gray-700">Vendor <span className="text-red-500">*</span></label>
//           <SearchableSelect
//             options={vendorOptions}
//             value={formData.vendor_id || ""}
//             onChange={(value) => {
//               setFormData(prev => ({ ...prev, vendor_id: value, vendor_store_id: "" }));
//               handleBlur("vendor_id");
//             }}
//             placeholder="Select Vendor"
//             disabled={vendorsLoading}
//           />
//           {touched.vendor_id && errors.vendor_id && <p className="text-red-500 text-sm mt-1">{errors.vendor_id}</p>}
//         </div>

//         <div>
//           <label className="block text-sm font-semibold mb-2 text-gray-700">Store <span className="text-red-500">*</span></label>
//           {!formData.vendor_id ? (
//             <div className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50">
//               <span className="text-sm text-gray-500">Select a vendor first</span>
//             </div>
//           ) : (
//             <SearchableSelect
//               options={storeOptions}
//               value={formData.vendor_store_id || ""}
//               onChange={(value) => {
//                 setFormData(prev => ({ ...prev, vendor_store_id: value }));
//                 handleBlur("vendor_store_id");
//               }}
//               placeholder="Select Store"
//               disabled={storesLoading}
//             />
//           )}
//           {touched.vendor_store_id && errors.vendor_store_id && <p className="text-red-500 text-sm mt-1">{errors.vendor_store_id}</p>}
//         </div>

//         <div>
//           <label className="block text-sm font-semibold mb-2 text-gray-700">Attribute Set</label>
//           {!formData.vendor_id ? (
//             <div className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50">
//               <span className="text-sm text-gray-500">Select a vendor first</span>
//             </div>
//           ) : (
//             <SearchableSelect
//               options={attributeSetOptions}
//               value={formData.attribute_set_id}
//               onChange={(value) => {
//                 setFormData(prev => ({ ...prev, attribute_set_id: value }));
//               }}
//               placeholder="Select Attribute Set"
//               disabled={attributeSetsLoading}
//             />
//           )}
//         </div>

//         <div>
//           <label className="block text-sm font-semibold mb-2 text-gray-700">Categories</label>
//           {!formData.vendor_id ? (
//             <div className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50">
//               <span className="text-sm text-gray-500">Select a vendor first</span>
//             </div>
//           ) : (
//             <MultiSelectTree
//               options={categoryOptions}
//               selectedValues={selectedCategoryUuids}
//               onChange={handleCategoryChange}
//               placeholder="Select Categories"
//             />
//           )}
//         </div>
//       </div>
//     );
//   };

//   const renderProductTypeSelector = () => (
//     <div className="flex gap-2 flex-wrap border-b border-gray-200 pb-4">
//       {["simple", "configurable", "grouped", "virtual", "bundle", "downloadable", "giftcard"].map(type => (
//         <button
//           key={type}
//           type="button"
//           onClick={() => handleProductTypeChange(type as any)}
//           className={`px-4 py-2 text-sm font-medium capitalize rounded-lg transition ${activeProductType === type ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
//         >
//           {type}
//         </button>
//       ))}
//     </div>
//   );

//   const renderGeneralTab = () => {
//     const visibilityOptions = [
//       { value: "1", label: "Not Visible Individually" },
//       { value: "2", label: "Catalog" },
//       { value: "3", label: "Search" },
//       { value: "4", label: "Catalog & Search" }
//     ];
//     const statusOptions = [
//       { value: "1", label: "Enabled" },
//       { value: "0", label: "Disabled" }
//     ];

//     return (
//       <div className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-semibold mb-1">SKU <span className="text-red-500">*</span></label>
//             <input
//               type="text"
//               name="sku"
//               value={formData.sku}
//               onChange={handleChange}
//               onBlur={() => handleBlur("sku")}
//               className={`w-full border ${touched.sku && errors.sku ? 'border-red-500' : 'border-gray-300'} rounded-xl p-3`}
//               placeholder="Unique product SKU (auto-generated from name)"
//             />
//             {touched.sku && errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
//           </div>
//           <div>
//             <label className="block text-sm font-semibold mb-1">Product Name <span className="text-red-500">*</span></label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               onBlur={() => handleBlur("name")}
//               className={`w-full border ${touched.name && errors.name ? 'border-red-500' : 'border-gray-300'} rounded-xl p-3`}
//               placeholder="Product name"
//             />
//             {touched.name && errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
//           </div>
//           <div>
//             <label className="block text-sm font-semibold mb-1">Visibility</label>
//             <SearchableSelect
//               options={visibilityOptions}
//               value={formData.visibility?.toString() || "4"}
//               onChange={(value) => setFormData(prev => ({ ...prev, visibility: parseInt(value) }))}
//               placeholder="Select Visibility"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-semibold mb-1">Status</label>
//             <SearchableSelect
//               options={statusOptions}
//               value={formData.status?.toString() || "1"}
//               onChange={(value) => setFormData(prev => ({ ...prev, status: parseInt(value) }))}
//               placeholder="Select Status"
//             />
//           </div>
//           {formData.type_id !== 'virtual' && formData.type_id !== 'downloadable' && formData.type_id !== 'giftcard' && (
//             <div>
//               <label className="block text-sm font-semibold mb-1">Weight (kg)</label>
//               <input type="number" step="0.01" name="weight" value={formData.weight} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" />
//             </div>
//           )}
//           <div>
//             <label className="block text-sm font-semibold mb-1">Tax Class ID</label>
//             <input type="number" name="tax_class_id" value={formData.tax_class_id} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" />
//           </div>
//         </div>

//         {renderDynamicAttributesByGroup()}

//         <div>
//           <label className="block text-sm font-semibold mb-1">Short Description</label>
//           <textarea name="short_description" rows={3} value={formData.short_description} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" />
//         </div>
//         <div>
//           <label className="block text-sm font-semibold mb-1">Full Description</label>
//           <textarea name="description" rows={5} value={formData.description} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" />
//         </div>
//       </div>
//     );
//   };

//   // Placeholder render functions - add your full implementations
//   const renderPricingTab = () => <div className="p-4">Pricing tab content</div>;
//   const renderInventoryTab = () => <div className="p-4">Inventory tab content</div>;
//   const renderImagesTab = () => <div className="p-4">Images tab content</div>;
//   const renderSeoTab = () => <div className="p-4">SEO tab content</div>;
//   const renderCustomOptionsTab = () => <div className="p-4">Custom Options tab content</div>;
//   const renderGroupedProductFields = () => <div className="p-4">Grouped product fields</div>;
//   const renderBundleProductFields = () => <div className="p-4">Bundle product fields</div>;
//   const renderDownloadableProductFields = () => <div className="p-4">Downloadable product fields</div>;
//   const renderGiftCardFields = () => <div className="p-4">Gift card fields</div>;

//   // Configurable product render functions
//   const renderSelectAttributesStep = () => <div>Select Attributes Step</div>;
//   const renderAttributeValuesStep = () => <div>Attribute Values Step</div>;
//   const renderBulkImagesPriceStep = () => <div>Bulk Images Price Step</div>;
//   const renderSummaryStep = () => <div>Summary Step</div>;

//   const renderConfigurableProductFields = () => (
//     <div className="space-y-6 mt-6 p-6 bg-purple-50 rounded-xl">
//       <h3 className="font-semibold text-xl text-purple-800 mb-4">Configurable Product Configuration</h3>
//       <div className="flex items-center justify-between mb-6">
//         {["select-attributes", "attribute-values", "bulk-images-price", "summary"].map((step, index) => (
//           <div key={step} className="flex-1 relative">
//             <div className={`flex items-center justify-center ${configurableStep === step ? "text-purple-600 font-bold" : "text-gray-500"}`}>
//               <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${configurableStep === step ? "border-purple-600 bg-purple-100" : "border-gray-300"}`}>
//                 {index + 1}
//               </div>
//             </div>
//             <div className={`text-center text-xs mt-2 capitalize ${configurableStep === step ? "text-purple-600 font-medium" : "text-gray-500"}`}>
//               {step.replace("-", " ")}
//             </div>
//           </div>
//         ))}
//       </div>
//       {configurableStep === "select-attributes" && renderSelectAttributesStep()}
//       {configurableStep === "attribute-values" && renderAttributeValuesStep()}
//       {configurableStep === "bulk-images-price" && renderBulkImagesPriceStep()}
//       {configurableStep === "summary" && renderSummaryStep()}
//     </div>
//   );

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
//           {activeMainTab === "advanced" && renderPricingTab()}

//           {activeProductType === "configurable" && renderConfigurableProductFields()}
//           {activeProductType === "grouped" && renderGroupedProductFields()}
//           {activeProductType === "bundle" && renderBundleProductFields()}
//           {activeProductType === "downloadable" && renderDownloadableProductFields()}
//           {activeProductType === "giftcard" && renderGiftCardFields()}

//           {activeProductType !== "configurable" && (
//             <div className="flex justify-end gap-3 pt-6 border-t mt-6">
//               <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition" disabled={isSubmitting}>Cancel</button>
//               <button type="submit" className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition disabled:bg-teal-300" disabled={isSubmitting}>
//                 {isSubmitting ? "Creating..." : "Create Product"}
//               </button>
//             </div>
//           )}
//         </form>
//       </div>

//       {showTypeChangeConfirm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-md">
//             <h3 className="text-lg font-semibold mb-4">Confirm Product Type Change</h3>
//             <p className="text-gray-600 mb-6">
//               Changing product type from <strong>{activeProductType}</strong> to <strong>{pendingProductType}</strong> will reset all product-type-specific fields. Are you sure you want to continue?
//             </p>
//             <div className="flex justify-end gap-3">
//               <button onClick={() => { setShowTypeChangeConfirm(false); setPendingProductType(null); }} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">Cancel</button>
//               <button onClick={() => pendingProductType && performProductTypeChange(pendingProductType)} className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600">Confirm</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CreateProductForm;