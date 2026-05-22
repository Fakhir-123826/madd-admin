// src/pages/Products/CreateProductForm.tsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetVendorsQuery } from "../../../app/api/VendorSlices/VendorApi";
import {
  useCreateProductMutation,
  useGetAllConfigurableAttributesQuery,
  useCreateVendorProductMutation,
  useGetAttributeOptionsQuery,
  type MagentoAttribute,
  type MagentoAttributeOption
} from "../../../app/api/ProductSlices/ProductApi";
import type {
  CreateProductPayload,
  MediaGalleryEntry,
  CustomOption,
  TierPrice,
  ProductLink,
  BundleOption,
  DownloadableLink,
  ConfigurableAttribute,
  ConfigurableVariant,
  GroupedProductLink,
  ConfigurableOption
} from "../../../app/api/ProductSlices/ProductApi";
import { useGetStoresByVendorQuery } from "../../../app/api/StoreSlices/StoreApi";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Vendor {
  id: number;
  uuid: string;
  company_name: string;
  company_slug: string;
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

// Configurable Product Steps
type ConfigurableStep = "select-attributes" | "attribute-values" | "bulk-images-price" | "summary";

// Bulk configuration options
interface BulkConfig {
  images: {
    mode: "single" | "unique" | "skip";
    attributeCode?: string;
    singleFile?: File;
    uniqueImages?: Record<string, File>;
  };
  price: {
    mode: "single" | "unique" | "skip";
    attributeCode?: string;
    singleValue?: number;
    uniqueValues?: Record<string, number>;
  };
  quantity: {
    mode: "single" | "unique" | "skip";
    attributeCode?: string;
    singleValue?: number;
    uniqueValues?: Record<string, number>;
  };
}

// ─── Helper Component Outside Main Component ─────────────────────────────────

const AttributeValueFetcher = ({
  attributeId,
  vendorId,
  onOptionsLoaded
}: {
  attributeId: number;
  vendorId: string;
  onOptionsLoaded: (attributeId: number, options: any[]) => void;
}) => {
  const { data: options, isLoading, error } = useGetAttributeOptionsQuery(
    { vendor_uuid: vendorId, attributeId },
    { skip: !vendorId || !attributeId }
  );

  useEffect(() => {
    if (options) {
      let optionsArray = [];
      if (Array.isArray(options)) {
        optionsArray = options;
      } else if (options.data && Array.isArray(options.data)) {
        optionsArray = options.data;
      } else if (options.items && Array.isArray(options.items)) {
        optionsArray = options.items;
      } else {
        optionsArray = [];
      }
      onOptionsLoaded(attributeId, optionsArray);
    }
  }, [options, attributeId, onOptionsLoaded]);

  return null;
};

// ─── Main Component ──────────────────────────────────────────────────────────

const CreateProductForm = () => {
  const navigate = useNavigate();
  const { vendor_uuid } = useParams<{ vendor_uuid: string }>();
  const [activeMainTab, setActiveMainTab] = useState<"general" | "pricing" | "inventory" | "images" | "seo" | "options" | "advanced">("general");
  const [activeProductType, setActiveProductType] = useState<CreateProductPayload['type_id']>("simple");
  const [errors, setErrors] = useState<FormErrors>({});
  const [alertMessage, setAlertMessage] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [pendingProductType, setPendingProductType] = useState<CreateProductPayload['type_id'] | null>(null);
  const [showTypeChangeConfirm, setShowTypeChangeConfirm] = useState(false);

  // Configurable product state
  const [configurableStep, setConfigurableStep] = useState<ConfigurableStep>("select-attributes");
  const [bulkConfig, setBulkConfig] = useState<BulkConfig>({
    images: { mode: "skip" },
    price: { mode: "skip" },
    quantity: { mode: "skip" }
  });
  const [bulkImages, setBulkImages] = useState<File[]>([]);
  const [previewVariants, setPreviewVariants] = useState<ConfigurableVariant[]>([]);
  const [selectedAll, setSelectedAll] = useState<Record<number, boolean>>({});

  // Fetch vendors
  const { data: vendorsData, isLoading: vendorsLoading } = useGetVendorsQuery({});
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  // Fetch attributes
  const [availableAttributes, setAvailableAttributes] = useState<any[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<any[]>([]);
  const [attributeValues, setAttributeValues] = useState<Record<string, any[]>>({});

  // Fetch stores by selected vendor UUID
  const {
    data: storesResponse,
    isLoading: storesLoading,
  } = useGetStoresByVendorQuery(selectedVendor?.uuid || "", {
    skip: !selectedVendor?.uuid,
  });

  const [selectedVendorUuid, setSelectedVendorUuid] = useState<string>("");

  // Handle options loaded from AttributeValueFetcher
  const handleOptionsLoaded = useCallback((attributeId: number, options: any[]) => {
    setAttributeValues(prev => {
      const currentValue = prev[attributeId];
      if (JSON.stringify(currentValue) === JSON.stringify(options)) {
        return prev;
      }
      return { ...prev, [attributeId]: options };
    });
  }, []);

  // Use the query hook properly
  const {
    data: configurableAttributesData,
    isLoading: attributesLoading,
  } = useGetAllConfigurableAttributesQuery(
    {
      vendor_uuid: selectedVendorUuid,
      search_criteria: {
        filter_groups: []
      }
    },
    { skip: !selectedVendorUuid || activeProductType !== 'configurable' }
  );

  const availableStores = storesResponse?.data?.stores || [];

  const [createVendorProduct, { isLoading: isSubmitting }] = useCreateVendorProductMutation();

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

    description: "",
    short_description: "",
    url_key: "",
    meta_title: "",
    meta_keyword: "",
    meta_description: "",

    special_price: undefined,
    special_from_date: undefined,
    special_to_date: undefined,
    cost: undefined,
    msrp: undefined,
    msrp_display_actual_price_type: 0,

    manage_stock: true,
    backorders: 0,
    notify_stock_qty: 0,
    min_sale_qty: 1,
    max_sale_qty: 0,
    qty_increments: 1,
    enable_qty_increments: false,

    custom_design: "",
    page_layout: "",
    custom_layout_update: "",
    gift_message_available: false,
    news_from_date: undefined,
    news_to_date: undefined,
    country_of_manufacture: "",
    category_ids: [],
    media_gallery: [],
    product_links: [],
    custom_options: [],
    tier_prices: [],
    inventory: { source_code: "default", quantity: 0, status: 1 },
    website_ids: [1],
    dynamic_attributes: {},

    configurable_attributes: [],
    configurable_options: [],
    configurable_variants: [],

    grouped_links: [],

    bundle_options: [],
    bundle_shipping_type: "together",
    bundle_price_type: "dynamic",
    bundle_sku_type: "dynamic",

    downloadable_links: [],
    downloadable_samples: [],
    links_purchased_separately: false,
    links_title: "Downloads",
    samples_title: "Samples",

    giftcard_amounts: [],
    giftcard_type: "virtual",
    giftcard_amount_type: "fixed",
    giftcard_open_amount_min: 0,
    giftcard_open_amount_max: 0,
    allow_message: true,
    gift_message_max_length: 255,
  });

  // Update selected vendor when vendor_id changes
  useEffect(() => {
    if (formData.vendor_id && vendorsData?.data) {
      const vendor = vendorsData.data.find((v: Vendor) => v.uuid === formData.vendor_id);
      setSelectedVendor(vendor || null);
      setFormData(prev => ({ ...prev, vendor_store_id: "" }));
    } else {
      setSelectedVendor(null);
    }
  }, [formData.vendor_id, vendorsData]);

  // Auto-generate SKU from name
  useEffect(() => {
    if (formData.name && !formData.sku) {
      const generatedSku = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, sku: generatedSku }));
    }
  }, [formData.name]);

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

  useEffect(() => {
    if (activeProductType === 'configurable' && formData.vendor_id) {
      setSelectedVendorUuid(formData.vendor_id);
    }
  }, [activeProductType, formData.vendor_id]);

  // Update availableAttributes when data loads
  useEffect(() => {
    if (configurableAttributesData?.data) {
      setAvailableAttributes(configurableAttributesData.data);
    } else if (Array.isArray(configurableAttributesData)) {
      setAvailableAttributes(configurableAttributesData);
    } else {
      setAvailableAttributes([]);
    }
  }, [configurableAttributesData]);

  // Handle product type change with confirmation
  const handleProductTypeChange = (type: CreateProductPayload['type_id']) => {
    if (activeProductType === type) return;
    
    if (activeProductType !== "simple") {
      setPendingProductType(type);
      setShowTypeChangeConfirm(true);
    } else {
      performProductTypeChange(type);
    }
  };

  const performProductTypeChange = (type: CreateProductPayload['type_id']) => {
    setActiveProductType(type);
    resetTypeSpecificFields(type);
    setPendingProductType(null);
    setShowTypeChangeConfirm(false);
  };

  const resetTypeSpecificFields = (type: CreateProductPayload['type_id']) => {
    setFormData(prev => {
      const base = { ...prev, type_id: type };

      if (['virtual', 'downloadable', 'giftcard'].includes(type)) {
        base.weight = undefined;
      }

      if (type !== 'configurable') {
        base.configurable_attributes = [];
        base.configurable_options = [];
        base.configurable_variants = [];
        setConfigurableStep("select-attributes");
        setSelectedAttributes([]);
        setAttributeValues({});
      }

      if (type !== 'grouped') {
        base.grouped_links = [];
      }

      if (type !== 'bundle') {
        base.bundle_options = [];
      }

      if (type !== 'downloadable') {
        base.downloadable_links = [];
        base.downloadable_samples = [];
      }

      if (type === 'configurable') {
        base.visibility = 4;
      }

      return base;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.vendor_id) newErrors.vendor_id = "Vendor is required";
    if (!formData.vendor_store_id) newErrors.vendor_store_id = "Store is required";
    if (!formData.sku?.trim()) newErrors.sku = "SKU is required";
    if (!formData.name?.trim()) newErrors.name = "Product name is required";

    if (formData.type_id !== 'grouped' && (!formData.price || formData.price <= 0)) {
      newErrors.price = "Valid price is required";
    }

    if (formData.type_id !== 'configurable' && formData.type_id !== 'grouped') {
      if (formData.quantity === undefined || formData.quantity < 0) {
        newErrors.quantity = "Valid quantity is required";
      }
    }

    if (formData.type_id === 'configurable') {
      if (!formData.configurable_variants?.length) {
        newErrors.configurable_variants = "At least one variant is required";
      }
    }

    if (formData.type_id === 'bundle') {
      if (!formData.bundle_options?.length) {
        newErrors.bundle_options = "At least one bundle option is required";
      }
    }

    if (formData.type_id === 'grouped') {
      if (!formData.grouped_links?.length) {
        newErrors.grouped_links = "At least one grouped product is required";
      }
    }

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

    if (!validateForm()) {
      setAlertMessage({ type: "error", message: "Please fix validation errors before submitting." });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const vendorToUse = vendor_uuid || formData.vendor_id;

    if (!vendorToUse) {
      setAlertMessage({ type: "error", message: "Vendor UUID is missing." });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    let payload = { ...formData, type_id: activeProductType };

    // Ensure configurable variants have proper SKUs and names
    if (activeProductType === 'configurable' && payload.configurable_variants) {
      payload.configurable_variants = payload.configurable_variants.map(variant => ({
        ...variant,
        sku: variant.sku?.startsWith('-') || !variant.sku ?
          `${payload.sku}-${variant.sku.replace(/^-/, '')}` :
          variant.sku,
        name: variant.name?.startsWith(' -') || !variant.name ?
          `${payload.name}${variant.name}` :
          variant.name
      }));
    }

    // Clean payload
    Object.keys(payload).forEach(key => {
      const fieldKey = key as keyof CreateProductPayload;
      if (payload[fieldKey] === undefined ||
        (Array.isArray(payload[fieldKey]) && (payload[fieldKey] as any[]).length === 0)) {
        delete payload[fieldKey];
      }
    });

    if (['virtual', 'downloadable', 'giftcard'].includes(activeProductType)) {
      delete payload.weight;
    }

    try {
      const result = await createVendorProduct({ vendor_uuid: vendorToUse, data: payload }).unwrap();
      if (result.success) {
        setAlertMessage({ type: "success", message: "Product created successfully and synced to Magento!" });
        // setTimeout(() => navigate(`/vendor/${vendorToUse}/products`), 2000);
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      const errorMessage = error?.data?.message || error?.message || "Failed to create product";
      setAlertMessage({ type: "error", message: errorMessage });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Helper functions for configurable product
  const addConfigurableOptionValue = (attribute: any, value: any) => {
    const existingOptions = formData.configurable_options || [];
    const existingAttr = existingOptions.find(opt => opt.attribute_id === attribute.attribute_id);

    if (existingAttr) {
      const updated = existingOptions.map(opt =>
        opt.attribute_id === attribute.attribute_id
          ? { ...opt, values: [...opt.values, { value_index: value.value_index }] }
          : opt
      );
      setFormData(prev => ({ ...prev, configurable_options: updated }));
    } else {
      setFormData(prev => ({
        ...prev,
        configurable_options: [
          ...(prev.configurable_options || []),
          {
            attribute_id: attribute.attribute_id,
            label: attribute.default_frontend_label,
            values: [{ value_index: value.value_index }]
          }
        ]
      }));
    }
  };

  const removeConfigurableOptionValue = (attribute: any, value: any) => {
    const existingOptions = formData.configurable_options || [];
    const existingAttr = existingOptions.find(opt => opt.attribute_id === attribute.attribute_id);

    if (existingAttr) {
      const updatedValues = existingAttr.values.filter(v => v.value_index !== value.value_index);

      if (updatedValues.length === 0) {
        const updated = existingOptions.filter(opt => opt.attribute_id !== attribute.attribute_id);
        setFormData(prev => ({ ...prev, configurable_options: updated }));
      } else {
        const updated = existingOptions.map(opt =>
          opt.attribute_id === attribute.attribute_id
            ? { ...opt, values: updatedValues }
            : opt
        );
        setFormData(prev => ({ ...prev, configurable_options: updated }));
      }
    }
  };

  const handleSelectAll = (attributeId: number, allValues: any[]) => {
    const allSelected = !selectedAll[attributeId];
    setSelectedAll(prev => ({ ...prev, [attributeId]: allSelected }));
    
    const attribute = selectedAttributes.find(attr => attr.attribute_id === attributeId);
    if (attribute) {
      allValues.forEach(value => {
        if (allSelected) {
          addConfigurableOptionValue(attribute, value);
        } else {
          removeConfigurableOptionValue(attribute, value);
        }
      });
    }
  };

  const calculatePossibleVariantsCount = (): number => {
    const selectedOptions = formData.configurable_options || [];
    if (selectedOptions.length === 0) return 0;

    let count = 1;
    for (const option of selectedOptions) {
      count *= option.values.length;
    }
    return count;
  };

  const cartesianProduct = (arrays: any[][]): any[][] => {
    if (!arrays.length) return [[]];
    const result: any[][] = [];
    const first = arrays[0];
    const rest = cartesianProduct(arrays.slice(1));

    for (const item of first) {
      for (const combo of rest) {
        result.push([item, ...combo]);
      }
    }
    return result;
  };

  const generatePreviewVariants = () => {
    const attributeValueSets = selectedAttributes.map(attr =>
      attributeValues[attr.attribute_id]?.filter(v =>
        formData.configurable_options?.find(opt =>
          opt.attribute_id === attr.attribute_id &&
          opt.values?.some(vv => vv.value_index === v.value_index)
        )
      ) || []
    );

    const combinations = cartesianProduct(attributeValueSets);

    const parentSku = formData.sku;
    const parentName = formData.name;

    const variants = combinations.map((combo, index) => {
      let price = formData.price;
      let quantity = 0;

      // Apply bulk price configuration
      if (bulkConfig.price.mode === "single" && bulkConfig.price.singleValue) {
        price = bulkConfig.price.singleValue;
      } else if (bulkConfig.price.mode === "unique" && bulkConfig.price.attributeCode && bulkConfig.price.uniqueValues) {
        const attrValue = combo.find(v => v.attribute_code === bulkConfig.price.attributeCode);
        if (attrValue && bulkConfig.price.uniqueValues[attrValue.value]) {
          price = bulkConfig.price.uniqueValues[attrValue.value];
        }
      }

      // Apply bulk quantity configuration
      if (bulkConfig.quantity.mode === "single" && bulkConfig.quantity.singleValue) {
        quantity = bulkConfig.quantity.singleValue;
      } else if (bulkConfig.quantity.mode === "unique" && bulkConfig.quantity.attributeCode && bulkConfig.quantity.uniqueValues) {
        const attrValue = combo.find(v => v.attribute_code === bulkConfig.quantity.attributeCode);
        if (attrValue && bulkConfig.quantity.uniqueValues[attrValue.value]) {
          quantity = bulkConfig.quantity.uniqueValues[attrValue.value];
        }
      }

      const variantNumber = String(index + 1).padStart(3, '0');
      const variantSku = parentSku ? `${parentSku}-${variantNumber}` : `variant-${variantNumber}`;
      const variantName = parentName ? `${parentName} - ${combo.map(v => v.value).join(' ')}` : `Variant - ${combo.map(v => v.value).join(' ')}`;

      return {
        sku: variantSku,
        name: variantName,
        price: price,
        quantity: quantity,
        weight: formData.weight || 0,
        attribute_set_id: formData.attribute_set_id || 4,
        status: 1,
        visibility: 1,
        configurable_attributes: combo.reduce((acc, val, idx) => ({
          ...acc,
          [selectedAttributes[idx].attribute_code]: val.value_index
        }), {})
      };
    });

    setPreviewVariants(variants);
    return variants;
  };

  const applyBulkConfigAndGenerate = () => {
    const variants = generatePreviewVariants();

    const validVariants = variants.map(variant => ({
      ...variant,
      sku: variant.sku || `${formData.sku}-${Math.random().toString(36).substr(2, 5)}`,
      name: variant.name || `${formData.name} - Variant`
    }));

    setFormData(prev => ({
      ...prev,
      configurable_variants: validVariants
    }));
    setConfigurableStep("summary");
  };

  // ============ CONFIGURABLE PRODUCT STEP RENDERERS ============

  const renderSelectAttributesStep = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <h4 className="font-semibold text-blue-800 mb-2">Step 1: Select Configurable Attributes</h4>
        <p className="text-sm text-blue-600">Choose the attributes that will define your product variations.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 p-2 text-left">
                <input
                  type="checkbox"
                  checked={selectedAttributes.length === availableAttributes.length && availableAttributes.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedAttributes([...availableAttributes]);
                    } else {
                      setSelectedAttributes([]);
                    }
                  }}
                  className="w-4 h-4"
                />
              </th>
              <th className="border border-gray-300 p-2 text-left">Attribute Code</th>
              <th className="border border-gray-300 p-2 text-left">Attribute Label</th>
              <th className="border border-gray-300 p-2 text-left">Required</th>
              <th className="border border-gray-300 p-2 text-left">System</th>
              <th className="border border-gray-300 p-2 text-left">Visible</th>
              <th className="border border-gray-300 p-2 text-left">Scope</th>
              <th className="border border-gray-300 p-2 text-left">Searchable</th>
              <th className="border border-gray-300 p-2 text-left">Comparable</th>
              <th className="border border-gray-300 p-2 text-left">Use in Layered Navigation</th>
            </tr>
          </thead>
          <tbody>
            {availableAttributes.map(attr => (
              <tr key={attr.attribute_id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">
                  <input
                    type="checkbox"
                    checked={selectedAttributes.some(a => a.attribute_id === attr.attribute_id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAttributes([...selectedAttributes, attr]);
                      } else {
                        setSelectedAttributes(selectedAttributes.filter(a => a.attribute_id !== attr.attribute_id));
                      }
                    }}
                    className="w-4 h-4"
                  />
                </td>
                <td className="border border-gray-300 p-2">{attr.attribute_code}</td>
                <td className="border border-gray-300 p-2">{attr.default_frontend_label}</td>
                <td className="border border-gray-300 p-2">{attr.is_required ? 'Yes' : 'No'}</td>
                <td className="border border-gray-300 p-2">{!attr.is_user_defined ? 'Yes' : 'No'}</td>
                <td className="border border-gray-300 p-2">{attr.is_visible ? 'Yes' : 'No'}</td>
                <td className="border border-gray-300 p-2">{attr.scope || 'Global'}</td>
                <td className="border border-gray-300 p-2">{attr.is_searchable === '1' ? 'Yes' : 'No'}</td>
                <td className="border border-gray-300 p-2">{attr.is_comparable === '1' ? 'Yes' : 'No'}</td>
                <td className="border border-gray-300 p-2">{attr.is_filterable ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {attributesLoading && <p className="text-sm text-gray-500 text-center py-4">Loading attributes...</p>}
        {availableAttributes.length === 0 && !attributesLoading && (
          <p className="text-gray-500 text-center py-4">No configurable attributes available</p>
        )}
      </div>

      {selectedAttributes.length > 0 && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setConfigurableStep("attribute-values")}
            className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
          >
            Next: Select Attribute Values →
          </button>
        </div>
      )}
    </div>
  );

  const renderAttributeValuesStep = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <h4 className="font-semibold text-blue-800 mb-2">Step 2: Select Attribute Values</h4>
        <p className="text-sm text-blue-600">Choose the specific values for each attribute that will create your product variations.</p>
      </div>

      {selectedAttributes.map(attr => (
        <div key={attr.attribute_id} className="border rounded-lg p-4 mb-4 bg-white">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold text-lg">{attr.default_frontend_label || attr.attribute_code}</h4>
            <button
              type="button"
              onClick={() => handleSelectAll(attr.attribute_id, attributeValues[attr.attribute_id] || [])}
              className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              {selectedAll[attr.attribute_id] ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <AttributeValueFetcher
            attributeId={attr.attribute_id}
            vendorId={formData.vendor_id}
            onOptionsLoaded={handleOptionsLoaded}
          />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {attributeValues[attr.attribute_id]?.map((value: MagentoAttributeOption) => (
              <label key={value.value_index} className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.configurable_options?.some(
                    opt => opt.attribute_id === attr.attribute_id &&
                      opt.values?.some(v => v.value_index === value.value_index)
                  )}
                  onChange={(e) => {
                    if (e.target.checked) {
                      addConfigurableOptionValue(attr, value);
                    } else {
                      removeConfigurableOptionValue(attr, value);
                    }
                  }}
                  className="w-4 h-4"
                />
                <span>{value.value}</span>
                {value.swatch_data && (
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: value.swatch_data.value }}
                  />
                )}
              </label>
            ))}
          </div>
          {!attributeValues[attr.attribute_id] && (
            <p className="text-sm text-gray-500 text-center py-4">Loading options...</p>
          )}
        </div>
      ))}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setConfigurableStep("select-attributes")}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={() => {
            if (formData.configurable_options?.length > 0) {
              setConfigurableStep("bulk-images-price");
            } else {
              setAlertMessage({ type: "error", message: "Please select at least one attribute value." });
            }
          }}
          className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
        >
          Next: Configure Bulk Settings →
        </button>
      </div>
    </div>
  );

  const renderBulkImagesPriceStep = () => {
    const selectedValues = formData.configurable_options || [];
    const selectedAttributeValues: Record<string, any[]> = {};
    
    selectedAttributes.forEach(attr => {
      const selectedOptions = selectedValues.find(opt => opt.attribute_id === attr.attribute_id);
      if (selectedOptions) {
        selectedAttributeValues[attr.attribute_code] = selectedOptions.values.map(v => 
          attributeValues[attr.attribute_id]?.find(val => val.value_index === v.value_index)
        ).filter(v => v);
      }
    });

    const selectedOptionsList = Object.values(selectedAttributeValues).flat();

    return (
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <h4 className="font-semibold text-blue-800 mb-2">Step 3: Bulk Images & Price Configuration</h4>
          <p className="text-sm text-blue-600">Configure images, pricing, and quantity for all variants at once.</p>
        </div>

        {/* Images Section */}
        <div className="border rounded-lg p-4 bg-white">
          <h4 className="font-semibold text-lg mb-3">Images</h4>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-2 border rounded cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="images_mode"
                checked={bulkConfig.images.mode === "single"}
                onChange={() => setBulkConfig(prev => ({ ...prev, images: { mode: "single" } }))}
                className="w-4 h-4"
              />
              <span>Apply single set of images to all SKUs</span>
            </label>

            {bulkConfig.images.mode === "single" && (
              <div className="ml-8 mt-2 p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-semibold mb-2">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setBulkConfig(prev => ({
                        ...prev,
                        images: { ...prev.images, singleFile: e.target.files![0] }
                      }));
                    }
                  }}
                  className="w-full border rounded-lg p-2"
                />
                {bulkConfig.images.singleFile && (
                  <p className="text-sm text-green-600 mt-2">{bulkConfig.images.singleFile.name} selected</p>
                )}
              </div>
            )}

            <label className="flex items-center gap-3 p-2 border rounded cursor-pointer hover:bg-gray-50">
              <input                type="radio"
                name="images_mode"
                checked={bulkConfig.images.mode === "unique"}
                onChange={() => setBulkConfig(prev => ({ ...prev, images: { mode: "unique", attributeCode: selectedAttributes[0]?.attribute_code, uniqueImages: {} } }))}
                className="w-4 h-4"
              />
              <span>Apply unique images by attribute to each SKU</span>
            </label>

            {bulkConfig.images.mode === "unique" && selectedAttributes.length > 0 && (
              <div className="ml-8 mt-2">
                <label className="block text-sm font-medium mb-1">Select attribute for image mapping</label>
                <select
                  className="border rounded-lg p-2 w-64 mb-4"
                  value={bulkConfig.images.attributeCode}
                  onChange={(e) => setBulkConfig(prev => ({ ...prev, images: { ...prev.images, attributeCode: e.target.value } }))}
                >
                  {selectedAttributes.map(attr => (
                    <option key={attr.attribute_id} value={attr.attribute_code}>
                      {attr.default_frontend_label || attr.attribute_code}
                    </option>
                  ))}
                </select>

                <div className="space-y-3">
                  <h5 className="font-medium">Upload images for each option:</h5>
                  {selectedOptionsList.map(option => (
                    <div key={option.value_index} className="flex items-center gap-3 p-2 border rounded">
                      <span className="w-32 font-medium">{option.value}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setBulkConfig(prev => ({
                              ...prev,
                              images: {
                                ...prev.images,
                                uniqueImages: {
                                  ...prev.images.uniqueImages,
                                  [option.value]: e.target.files![0]
                                }
                              }
                            }));
                          }
                        }}
                        className="flex-1"
                      />
                      {bulkConfig.images.uniqueImages?.[option.value] && (
                        <span className="text-sm text-green-600">✓ Uploaded</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <label className="flex items-center gap-3 p-2 border rounded cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="images_mode"
                checked={bulkConfig.images.mode === "skip"}
                onChange={() => setBulkConfig(prev => ({ ...prev, images: { mode: "skip" } }))}
                className="w-4 h-4"
              />
              <span>Skip image uploading at this time</span>
            </label>
          </div>
        </div>

        {/* Price Section */}
        <div className="border rounded-lg p-4 bg-white">
          <h4 className="font-semibold text-lg mb-3">Price</h4>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-2 border rounded cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="price_mode"
                checked={bulkConfig.price.mode === "single"}
                onChange={() => setBulkConfig(prev => ({ ...prev, price: { mode: "single", singleValue: 0 } }))}
                className="w-4 h-4"
              />
              <span>Apply single price to all SKUs</span>
            </label>

            {bulkConfig.price.mode === "single" && (
              <div className="ml-8 mt-2">
                <label className="block text-sm font-medium mb-1">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={bulkConfig.price.singleValue || 0}
                  onChange={(e) => setBulkConfig(prev => ({ ...prev, price: { ...prev.price, singleValue: parseFloat(e.target.value) } }))}
                  className="border rounded-lg p-2 w-64"
                  placeholder="Enter price"
                />
              </div>
            )}

            <label className="flex items-center gap-3 p-2 border rounded cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="price_mode"
                checked={bulkConfig.price.mode === "unique"}
                onChange={() => setBulkConfig(prev => ({ ...prev, price: { mode: "unique", attributeCode: selectedAttributes[0]?.attribute_code, uniqueValues: {} } }))}
                className="w-4 h-4"
              />
              <span>Apply unique prices by attribute to each SKU</span>
            </label>

            {bulkConfig.price.mode === "unique" && selectedAttributes.length > 0 && (
              <div className="ml-8 mt-2">
                <label className="block text-sm font-medium mb-1">Select attribute for price variation</label>
                <select
                  className="border rounded-lg p-2 w-64 mb-4"
                  value={bulkConfig.price.attributeCode}
                  onChange={(e) => setBulkConfig(prev => ({ ...prev, price: { ...prev.price, attributeCode: e.target.value } }))}
                >
                  {selectedAttributes.map(attr => (
                    <option key={attr.attribute_id} value={attr.attribute_code}>
                      {attr.default_frontend_label || attr.attribute_code}
                    </option>
                  ))}
                </select>

                <div className="space-y-3">
                  <h5 className="font-medium">Set prices for each option:</h5>
                  {selectedOptionsList.map(option => (
                    <div key={option.value_index} className="flex items-center gap-3 p-2 border rounded">
                      <span className="w-32 font-medium">{option.value}</span>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Price"
                        value={bulkConfig.price.uniqueValues?.[option.value] || ''}
                        onChange={(e) => {
                          setBulkConfig(prev => ({
                            ...prev,
                            price: {
                              ...prev.price,
                              uniqueValues: {
                                ...prev.price.uniqueValues,
                                [option.value]: parseFloat(e.target.value)
                              }
                            }
                          }));
                        }}
                        className="flex-1 border rounded p-2"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <label className="flex items-center gap-3 p-2 border rounded cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="price_mode"
                checked={bulkConfig.price.mode === "skip"}
                onChange={() => setBulkConfig(prev => ({ ...prev, price: { mode: "skip" } }))}
                className="w-4 h-4"
              />
              <span>Skip price at this time</span>
            </label>
          </div>
        </div>

        {/* Quantity Section */}
        <div className="border rounded-lg p-4 bg-white">
          <h4 className="font-semibold text-lg mb-3">Quantity</h4>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-2 border rounded cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="quantity_mode"
                checked={bulkConfig.quantity.mode === "single"}
                onChange={() => setBulkConfig(prev => ({ ...prev, quantity: { mode: "single", singleValue: 0 } }))}
                className="w-4 h-4"
              />
              <span>Apply single quantity to all SKUs</span>
            </label>

            {bulkConfig.quantity.mode === "single" && (
              <div className="ml-8 mt-2">
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input
                  type="number"
                  value={bulkConfig.quantity.singleValue || 0}
                  onChange={(e) => setBulkConfig(prev => ({ ...prev, quantity: { ...prev.quantity, singleValue: parseInt(e.target.value) } }))}
                  className="border rounded-lg p-2 w-64"
                  placeholder="Enter quantity"
                />
              </div>
            )}

            <label className="flex items-center gap-3 p-2 border rounded cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="quantity_mode"
                checked={bulkConfig.quantity.mode === "unique"}
                onChange={() => setBulkConfig(prev => ({ ...prev, quantity: { mode: "unique", attributeCode: selectedAttributes[0]?.attribute_code, uniqueValues: {} } }))}
                className="w-4 h-4"
              />
              <span>Apply unique quantities by attribute to each SKU</span>
            </label>

            {bulkConfig.quantity.mode === "unique" && selectedAttributes.length > 0 && (
              <div className="ml-8 mt-2">
                <label className="block text-sm font-medium mb-1">Select attribute for quantity variation</label>
                <select
                  className="border rounded-lg p-2 w-64 mb-4"
                  value={bulkConfig.quantity.attributeCode}
                  onChange={(e) => setBulkConfig(prev => ({ ...prev, quantity: { ...prev.quantity, attributeCode: e.target.value } }))}
                >
                  {selectedAttributes.map(attr => (
                    <option key={attr.attribute_id} value={attr.attribute_code}>
                      {attr.default_frontend_label || attr.attribute_code}
                    </option>
                  ))}
                </select>

                <div className="space-y-3">
                  <h5 className="font-medium">Set quantities for each option:</h5>
                  {selectedOptionsList.map(option => (
                    <div key={option.value_index} className="flex items-center gap-3 p-2 border rounded">
                      <span className="w-32 font-medium">{option.value}</span>
                      <input
                        type="number"
                        placeholder="Quantity"
                        value={bulkConfig.quantity.uniqueValues?.[option.value] || ''}
                        onChange={(e) => {
                          setBulkConfig(prev => ({
                            ...prev,
                            quantity: {
                              ...prev.quantity,
                              uniqueValues: {
                                ...prev.quantity.uniqueValues,
                                [option.value]: parseInt(e.target.value)
                              }
                            }
                          }));
                        }}
                        className="flex-1 border rounded p-2"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <label className="flex items-center gap-3 p-2 border rounded cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="quantity_mode"
                checked={bulkConfig.quantity.mode === "skip"}
                onChange={() => setBulkConfig(prev => ({ ...prev, quantity: { mode: "skip" } }))}
                className="w-4 h-4"
              />
              <span>Skip quantity at this time</span>
            </label>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setConfigurableStep("attribute-values")}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={applyBulkConfigAndGenerate}
            className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
          >
            Generate Variants & Continue →
          </button>
        </div>
      </div>
    );
  };

  const renderSummaryStep = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <h4 className="font-semibold text-blue-800 mb-2">Step 4: Summary</h4>
        <p className="text-sm text-blue-600">Review your product configuration before saving.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4 bg-white">
          <h5 className="font-semibold text-green-600 mb-2">Selected Attributes</h5>
          {selectedAttributes.map(attr => (
            <p key={attr.attribute_id} className="text-sm">• {attr.default_frontend_label || attr.attribute_code}</p>
          ))}
        </div>

        <div className="border rounded-lg p-4 bg-white">
          <h5 className="font-semibold text-green-600 mb-2">Bulk Configuration</h5>
          <p className="text-sm">Images: <strong>{bulkConfig.images.mode === "single" ? "Single image" : bulkConfig.images.mode === "unique" ? "Unique by attribute" : "Skipped"}</strong></p>
          <p className="text-sm">Price: <strong>{bulkConfig.price.mode === "single" ? `$${bulkConfig.price.singleValue}` : bulkConfig.price.mode === "unique" ? "Unique by attribute" : "Skipped"}</strong></p>
          <p className="text-sm">Quantity: <strong>{bulkConfig.quantity.mode === "single" ? bulkConfig.quantity.singleValue : bulkConfig.quantity.mode === "unique" ? "Unique by attribute" : "Skipped"}</strong></p>
        </div>

        <div className="border rounded-lg p-4 bg-white">
          <h5 className="font-semibold text-green-600 mb-2">Variants Count</h5>
          <p className="text-2xl font-bold text-teal-600">{previewVariants.length}</p>
          <p className="text-sm text-gray-500">Total product variations</p>
        </div>
      </div>

      {/* Variants Table */}
      <div className="border rounded-lg overflow-hidden">
        <h5 className="font-semibold p-3 bg-gray-100">Generated Variants</h5>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">SKU</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Price</th>
                <th className="p-2 text-left">Quantity</th>
                {selectedAttributes.map(attr => (
                  <th key={attr.attribute_id} className="p-2 text-left">{attr.default_frontend_label || attr.attribute_code}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewVariants.slice(0, 10).map((variant, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2">{variant.sku}</td>
                  <td className="p-2">{variant.name}</td>
                  <td className="p-2">${variant.price}</td>
                  <td className="p-2">{variant.quantity}</td>
                  {selectedAttributes.map(attr => (
                    <td key={attr.attribute_id} className="p-2">
                      {Object.entries(variant.configurable_attributes).find(([key]) => key === attr.attribute_code)?.[1]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {previewVariants.length > 10 && (
            <p className="p-2 text-center text-gray-500">... and {previewVariants.length - 10} more variants</p>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setConfigurableStep("bulk-images-price")}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          ← Back
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
        >
          Create Product
        </button>
      </div>
    </div>
  );

  const renderConfigurableProductFields = () => (
    <div className="space-y-6 mt-6 p-6 bg-purple-50 rounded-xl">
      <h3 className="font-semibold text-xl text-purple-800 mb-4">Configurable Product Configuration</h3>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-6">
        {["select-attributes", "attribute-values", "bulk-images-price", "summary"].map((step, index) => (
          <div key={step} className="flex-1 relative">
            <div className={`flex items-center justify-center ${configurableStep === step ? "text-purple-600 font-bold" : "text-gray-500"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${configurableStep === step ? "border-purple-600 bg-purple-100" : "border-gray-300"
                }`}>
                {index + 1}
              </div>
            </div>
            <div className={`text-center text-xs mt-2 capitalize ${configurableStep === step ? "text-purple-600 font-medium" : "text-gray-500"
              }`}>
              {step.replace("-", " ")}
            </div>
            {index < 3 && (
              <div className={`absolute top-4 left-1/2 w-full h-0.5 ${configurableStep === step ? "bg-purple-400" : "bg-gray-300"
                }`} style={{ transform: 'translateY(-50%)' }} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {configurableStep === "select-attributes" && renderSelectAttributesStep()}
      {configurableStep === "attribute-values" && renderAttributeValuesStep()}
      {configurableStep === "bulk-images-price" && renderBulkImagesPriceStep()}
      {configurableStep === "summary" && renderSummaryStep()}
    </div>
  );

  // ============ RENDER FUNCTIONS FOR OTHER PRODUCT TYPES ============

  const renderVendorStoreSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-xl">
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">Vendor <span className="text-red-500">*</span></label>
        <select
          name="vendor_id"
          value={formData.vendor_id || ""}
          onChange={handleChange}
          onBlur={() => handleBlur("vendor_id")}
          className={`w-full border ${touched.vendor_id && errors.vendor_id ? 'border-red-500' : 'border-gray-300'} rounded-xl p-3`}
        >
          <option value="">Select Vendor</option>
          {vendorsData?.data?.map((vendor: Vendor) => (
            <option key={vendor.uuid} value={vendor.uuid}>{vendor.company_name}</option>
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
            {!formData.vendor_id ? "Select a vendor first" : storesLoading ? "Loading Stores..." : "Select Store"}
          </option>
          {availableStores.map((store: Store) => (
            <option key={store.uuid} value={store.uuid}>{store.store_name}</option>
          ))}
        </select>
        {touched.vendor_store_id && errors.vendor_store_id && <p className="text-red-500 text-sm mt-1">{errors.vendor_store_id}</p>}
      </div>
    </div>
  );

  const renderProductTypeSelector = () => (
    <div className="flex gap-2 flex-wrap border-b border-gray-200 pb-4">
      {["simple", "configurable", "grouped", "virtual", "bundle", "downloadable", "giftcard"].map(type => (
        <button
          key={type}
          type="button"
          onClick={() => handleProductTypeChange(type as any)}
          className={`px-4 py-2 text-sm font-medium capitalize rounded-lg transition ${activeProductType === type ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
        >
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
            placeholder="Unique product SKU (auto-generated from name)"
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
        <div>
          <label className="block text-sm font-semibold mb-1">Attribute Set ID</label>
          <input type="number" name="attribute_set_id" value={formData.attribute_set_id} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Visibility</label>
          <select name="visibility" value={formData.visibility} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3">
            <option value={1}>Not Visible Individually</option>
            <option value={2}>Catalog</option>
            <option value={3}>Search</option>
            <option value={4}>Catalog & Search</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3">
            <option value={1}>Enabled</option>
            <option value={0}>Disabled</option>
          </select>
        </div>
        {formData.type_id !== 'virtual' && formData.type_id !== 'downloadable' && formData.type_id !== 'giftcard' && (
          <div>
            <label className="block text-sm font-semibold mb-1">Weight (kg)</label>
            <input type="number" step="0.01" name="weight" value={formData.weight} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" />
          </div>
        )}
        <div>
          <label className="block text-sm font-semibold mb-1">Tax Class ID</label>
          <input type="number" name="tax_class_id" value={formData.tax_class_id} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Short Description</label>
        <textarea name="short_description" rows={3} value={formData.short_description} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Full Description</label>
        <textarea name="description" rows={5} value={formData.description} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" />
      </div>
    </div>
  );

  const renderPricingTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formData.type_id !== 'grouped' && (
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
        )}
        <div>
          <label className="block text-sm font-semibold mb-1">Special Price</label>
          <input type="number" step="0.01" name="special_price" value={formData.special_price || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Special Price From</label>
          <input type="date" name="special_from_date" value={formData.special_from_date || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Special Price To</label>
          <input type="date" name="special_to_date" value={formData.special_to_date || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Cost (Manufacturer Price)</label>
          <input type="number" step="0.01" name="cost" value={formData.cost || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">MSRP (Manufacturer's Suggested Retail Price)</label>
          <input type="number" step="0.01" name="msrp" value={formData.msrp || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-semibold text-gray-700">Tier Prices (Volume Discounts)</label>
          <button
            type="button"
            onClick={() => addToArray("tier_prices", { customer_group: "ALL GROUPS", quantity: 1, price: 0, website_id: 0, price_type: "fixed" })}
            className="px-3 py-1 bg-teal-500 text-white rounded-lg text-sm"
          >
            + Add Tier Price
          </button>
        </div>
        {formData.tier_prices?.map((tier, index) => (
          <div key={index} className="relative grid grid-cols-5 gap-4 mb-3 p-3 bg-gray-50 rounded-lg">
            <RemoveButton onClick={() => removeFromArray("tier_prices", index)} />
            <select
              value={tier.customer_group}
              onChange={(e) => handleArrayChange("tier_prices", index, "customer_group", e.target.value)}
              className="border rounded-lg p-2"
            >
              <option value="ALL GROUPS">ALL GROUPS</option>
              <option value="General">General</option>
              <option value="Wholesale">Wholesale</option>
              <option value="Retailer">Retailer</option>
            </select>
            <input
              type="number"
              placeholder="Min Qty"
              value={tier.quantity}
              onChange={(e) => handleArrayChange("tier_prices", index, "quantity", parseInt(e.target.value))}
              className="border rounded-lg p-2"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={tier.price}
              onChange={(e) => handleArrayChange("tier_prices", index, "price", parseFloat(e.target.value))}
              className="border rounded-lg p-2"
            />
            <input
              type="number"
              placeholder="Website ID"
              value={tier.website_id}
              onChange={(e) => handleArrayChange("tier_prices", index, "website_id", parseInt(e.target.value))}
              className="border rounded-lg p-2"
            />
            <select
              value={tier.price_type}
              onChange={(e) => handleArrayChange("tier_prices", index, "price_type", e.target.value)}
              className="border rounded-lg p-2"
            >
              <option value="fixed">Fixed</option>
              <option value="discount">Discount</option>
            </select>
          </div>
        ))}
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-semibold text-gray-700">Product Links (Related/Up-sell/Cross-sell)</label>
          <button
            type="button"
            onClick={() => addToArray("product_links", { link_type: "related", linked_sku: "", linked_type: "simple", position: 0 })}
            className="px-3 py-1 bg-teal-500 text-white rounded-lg text-sm"
          >
            + Add Link
          </button>
        </div>
        {formData.product_links?.map((link, index) => (
          <div key={index} className="relative grid grid-cols-4 gap-4 mb-3 p-3 bg-gray-50 rounded-lg">
            <RemoveButton onClick={() => removeFromArray("product_links", index)} />
            <input
              type="text"
              placeholder="Linked Product SKU"
              value={link.linked_sku}
              onChange={(e) => handleArrayChange("product_links", index, "linked_sku", e.target.value)}
              className="border rounded-lg p-2"
            />
            <select value={link.link_type} onChange={(e) => handleArrayChange("product_links", index, "link_type", e.target.value)} className="border rounded-lg p-2">
              <option value="related">Related</option>
              <option value="upsell">Up-sell</option>
              <option value="crosssell">Cross-sell</option>
            </select>
            <input type="number" placeholder="Position" value={link.position} onChange={(e) => handleArrayChange("product_links", index, "position", parseInt(e.target.value))} className="border rounded-lg p-2" />
          </div>
        ))}
      </div>
    </div>
  );

  const renderInventoryTab = () => {
    if (formData.type_id === 'configurable' || formData.type_id === 'grouped') {
      return (
        <div className="p-6 bg-gray-50 rounded-xl text-center text-gray-500">
          Inventory is managed at the variant/child product level for {formData.type_id} products.
        </div>
      );
    }

    return (
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
          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="manage_stock" checked={formData.manage_stock} onChange={handleChange} className="w-4 h-4" />
              Manage Stock
            </label>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Backorders</label>
            <select name="backorders" value={formData.backorders} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3">
              <option value={0}>No Backorders</option>
              <option value={1}>Allow Qty Below 0</option>
              <option value={2}>Allow Qty Below 0 & Notify</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Notify Stock Qty</label>
            <input type="number" name="notify_stock_qty" value={formData.notify_stock_qty} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Minimum Sale Qty</label>
            <input type="number" name="min_sale_qty" value={formData.min_sale_qty} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Maximum Sale Qty</label>
            <input type="number" name="max_sale_qty" value={formData.max_sale_qty} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" />
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3">MSI Inventory Source</h4>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Source Code" value={formData.inventory?.source_code} onChange={(e) => setFormData(prev => ({ ...prev, inventory: { ...prev.inventory!, source_code: e.target.value } }))} className="border rounded-lg p-2" />
            <input type="number" placeholder="Quantity" value={formData.inventory?.quantity} onChange={(e) => setFormData(prev => ({ ...prev, inventory: { ...prev.inventory!, quantity: parseFloat(e.target.value) } }))} className="border rounded-lg p-2" />
          </div>
        </div>
      </div>
    );
  };

  const renderImagesTab = () => (
    <div className="space-y-6">
      <div className="flex gap-3 flex-wrap">
        {formData.media_gallery?.map((img, idx) => (
          <div key={idx} className="relative w-24 h-24 bg-gray-200 rounded-xl overflow-hidden">
            <img src={`data:${img.content?.type};base64,${img.content?.base64_encoded_data}`} alt={img.label} className="w-full h-full object-cover" />
            <RemoveButton onClick={() => removeFromArray("media_gallery", idx)} />
          </div>
        ))}
        <label className="w-24 h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-sm text-gray-500 cursor-pointer hover:border-teal-400 transition">
          + Add Image
          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
        </label>
      </div>
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-700">First image will be set as base, small, and thumbnail image automatically.</p>
      </div>
    </div>
  );

  const renderSeoTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold mb-1">URL Key</label>
        <input type="text" name="url_key" value={formData.url_key} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" placeholder="product-url-key" />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Meta Title</label>
        <input type="text" name="meta_title" value={formData.meta_title} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" maxLength={70} />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Meta Keywords</label>
        <input type="text" name="meta_keyword" value={formData.meta_keyword} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" placeholder="keyword1, keyword2, keyword3" />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Meta Description</label>
        <textarea name="meta_description" rows={3} value={formData.meta_description} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" maxLength={160} />
      </div>
    </div>
  );

  const renderCustomOptionsTab = () => (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-semibold text-gray-700">Custom Options</label>
          <button
            type="button"
            onClick={() => addToArray("custom_options", {
              title: "New Option",
              type: "field",
              is_required: false,
              sort_order: 0,
              price: 0,
              price_type: "fixed",
              sku: "",
              values: []
            })}
            className="px-3 py-1 bg-teal-500 text-white rounded-lg text-sm"
          >
            + Add Option
          </button>
        </div>
        {formData.custom_options?.map((option, index) => (
          <div key={index} className="relative p-4 bg-gray-50 rounded-lg mb-3">
            <RemoveButton onClick={() => removeFromArray("custom_options", index)} />
            <div className="grid grid-cols-2 gap-4 mb-3">
              <input type="text" placeholder="Option Title" value={option.title} onChange={(e) => handleArrayChange("custom_options", index, "title", e.target.value)} className="border rounded-lg p-2" />
              <select value={option.type} onChange={(e) => handleArrayChange("custom_options", index, "type", e.target.value)} className="border rounded-lg p-2">
                <option value="field">Text Field</option>
                <option value="area">Text Area</option>
                <option value="drop_down">Drop-down</option>
                <option value="radio">Radio Buttons</option>
                <option value="checkbox">Checkbox</option>
                <option value="date">Date</option>
                <option value="date_time">Date & Time</option>
                <option value="time">Time</option>
                <option value="file">File</option>
              </select>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-3">
              <input type="number" step="0.01" placeholder="Price" value={option.price} onChange={(e) => handleArrayChange("custom_options", index, "price", parseFloat(e.target.value))} className="border rounded-lg p-2" />
              <select value={option.price_type} onChange={(e) => handleArrayChange("custom_options", index, "price_type", e.target.value)} className="border rounded-lg p-2">
                <option value="fixed">Fixed</option>
                <option value="percent">Percent</option>
              </select>
              <input type="text" placeholder="SKU" value={option.sku} onChange={(e) => handleArrayChange("custom_options", index, "sku", e.target.value)} className="border rounded-lg p-2" />
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={option.is_required} onChange={(e) => handleArrayChange("custom_options", index, "is_required", e.target.checked)} className="w-4 h-4" />
              Required
            </label>

            {['drop_down', 'radio', 'checkbox', 'multiple'].includes(option.type) && (
              <div className="mt-3 pl-4 border-l-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Option Values</label>
                  <button
                    type="button"
                    onClick={() => {
                      const currentValues = [...(option.values || [])];
                      currentValues.push({ title: "", price: 0, price_type: "fixed", sku: "", sort_order: currentValues.length });
                      handleArrayChange("custom_options", index, "values", currentValues);
                    }}
                    className="px-2 py-1 bg-gray-500 text-white rounded text-xs"
                  >
                    + Add Value
                  </button>
                </div>
                {option.values?.map((value, vIdx) => (
                  <div key={vIdx} className="grid grid-cols-4 gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Value Label"
                      value={value.title}
                      onChange={(e) => {
                        const updated = [...(option.values || [])];
                        updated[vIdx] = { ...updated[vIdx], title: e.target.value };
                        handleArrayChange("custom_options", index, "values", updated);
                      }}
                      className="border rounded p-1 text-sm"
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Price"
                      value={value.price}
                      onChange={(e) => {
                        const updated = [...(option.values || [])];
                        updated[vIdx] = { ...updated[vIdx], price: parseFloat(e.target.value) };
                        handleArrayChange("custom_options", index, "values", updated);
                      }}
                      className="border rounded p-1 text-sm"
                    />
                    <select
                      value={value.price_type}
                      onChange={(e) => {
                        const updated = [...(option.values || [])];
                        updated[vIdx] = { ...updated[vIdx], price_type: e.target.value };
                        handleArrayChange("custom_options", index, "values", updated);
                      }}
                      className="border rounded p-1 text-sm"
                    >
                      <option value="fixed">Fixed</option>
                      <option value="percent">Percent</option>
                    </select>
                    <input
                      type="text"
                      placeholder="SKU"
                      value={value.sku}
                      onChange={(e) => {
                        const updated = [...(option.values || [])];
                        updated[vIdx] = { ...updated[vIdx], sku: e.target.value };
                        handleArrayChange("custom_options", index, "values", updated);
                      }}
                      className="border rounded p-1 text-sm"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold mb-3">Dynamic Custom Attributes</h4>
        <div className="space-y-2">
          {Object.entries(formData.dynamic_attributes || {}).map(([key, value]) => (
            <div key={key} className="flex gap-2">
              <input type="text" placeholder="Attribute Code" value={key} className="border rounded-lg p-2 flex-1" disabled />
              <input type="text" placeholder="Value" value={value} onChange={(e) => setFormData(prev => ({ ...prev, dynamic_attributes: { ...prev.dynamic_attributes, [key]: e.target.value } }))} className="border rounded-lg p-2 flex-1" />
              <button type="button" onClick={() => { const { [key]: _, ...rest } = formData.dynamic_attributes || {}; setFormData(prev => ({ ...prev, dynamic_attributes: rest })); }} className="bg-red-500 text-white px-3 rounded-lg">×</button>
            </div>
          ))}
          <button type="button" onClick={() => { const code = prompt("Enter attribute code:"); if (code) setFormData(prev => ({ ...prev, dynamic_attributes: { ...prev.dynamic_attributes, [code]: "" } })); }} className="text-teal-500 text-sm">+ Add Dynamic Attribute</button>
        </div>
      </div>
    </div>
  );

  const renderAdvancedTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-1">Custom Design</label>
          <input type="text" name="custom_design" value={formData.custom_design} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Page Layout</label>
          <select name="page_layout" value={formData.page_layout} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3">
            <option value="">No Layout Updates</option>
            <option value="1column">1 Column</option>
            <option value="2columns-left">2 Columns with Left Bar</option>
            <option value="2columns-right">2 Columns with Right Bar</option>
            <option value="3columns">3 Columns</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-1">Custom Layout Update (XML)</label>
          <textarea
            name="custom_layout_update"
            rows={4}
            value={formData.custom_layout_update}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-3 font-mono text-sm"
            placeholder="<referenceContainer name='content'><block class='Magento\Framework\View\Element\Template' template='MyModule::custom.phtml'/></referenceContainer>"
          />
        </div>
        <div>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="gift_message_available" checked={formData.gift_message_available} onChange={handleChange} className="w-4 h-4" />
            Allow Gift Message
          </label>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">News From Date</label>
          <input type="date" name="news_from_date" value={formData.news_from_date || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">News To Date</label>
          <input type="date" name="news_to_date" value={formData.news_to_date || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Country of Manufacture</label>
          <select name="country_of_manufacture" value={formData.country_of_manufacture} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3">
            <option value="">Select Country</option>
            <option value="US">United States</option>
            <option value="CN">China</option>
            <option value="IN">India</option>
            <option value="JP">Japan</option>
            <option value="DE">Germany</option>
            <option value="UK">United Kingdom</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Categories</label>
        <input
          type="text"
          placeholder="Enter category IDs separated by commas"
          value={formData.category_ids?.join(", ")}
          onChange={(e) => setFormData(prev => ({ ...prev, category_ids: e.target.value.split(",").map(id => parseInt(id.trim())).filter(id => !isNaN(id)) }))}
          className="w-full border border-gray-300 rounded-xl p-3"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Website IDs</label>
        <input
          type="text"
          placeholder="Enter website IDs separated by commas"
          value={formData.website_ids?.join(", ")}
          onChange={(e) => setFormData(prev => ({ ...prev, website_ids: e.target.value.split(",").map(id => parseInt(id.trim())).filter(id => !isNaN(id)) }))}
          className="w-full border border-gray-300 rounded-xl p-3"
        />
      </div>
    </div>
  );

  const renderGroupedProductFields = () => (
    <div className="space-y-6 mt-6 p-4 bg-green-50 rounded-xl">
      <h3 className="font-semibold text-lg text-green-800">Grouped Product Configuration</h3>
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-semibold text-gray-700">Associated Products</label>
          <button
            type="button"
            onClick={() => addToArray("grouped_links", { linked_sku: "", qty: 1, position: 0 })}
            className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm"
          >
            + Add Product
          </button>
        </div>
        {formData.grouped_links?.map((link, index) => (
          <div key={index} className="relative grid grid-cols-3 gap-4 mb-3 p-3 bg-white rounded-lg border">
            <RemoveButton onClick={() => removeFromArray("grouped_links", index)} />
            <input
              type="text"
              placeholder="Product SKU"
              value={link.linked_sku}
              onChange={(e) => handleArrayChange("grouped_links", index, "linked_sku", e.target.value)}
              className="border rounded-lg p-2"
            />
            <input
              type="number"
              placeholder="Default Quantity"
              value={link.qty}
              onChange={(e) => handleArrayChange("grouped_links", index, "qty", parseInt(e.target.value))}
              className="border rounded-lg p-2"
            />
            <input
              type="number"
              placeholder="Position"
              value={link.position}
              onChange={(e) => handleArrayChange("grouped_links", index, "position", parseInt(e.target.value))}
              className="border rounded-lg p-2"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderBundleProductFields = () => (
    <div className="space-y-6 mt-6 p-4 bg-yellow-50 rounded-xl">
      <h3 className="font-semibold text-lg text-yellow-800">Bundle Product Configuration</h3>

      <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-lg border">
        <div>
          <label className="block text-sm font-semibold mb-1">Price Type</label>
          <select
            name="bundle_price_type"
            value={formData.bundle_price_type}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          >
            <option value="dynamic">Dynamic</option>
            <option value="fixed">Fixed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">SKU Type</label>
          <select
            name="bundle_sku_type"
            value={formData.bundle_sku_type}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          >
            <option value="dynamic">Dynamic</option>
            <option value="fixed">Fixed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Shipping Type</label>
          <select
            name="bundle_shipping_type"
            value={formData.bundle_shipping_type}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          >
            <option value="together">Ship Together</option>
            <option value="separately">Ship Separately</option>
          </select>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-semibold text-gray-700">Bundle Options</label>
          <button
            type="button"
            onClick={() => addToArray("bundle_options", {
              title: "",
              required: true,
              type: "select",
              position: 0,
              sku: "",
              product_links: []
            })}
            className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm"
          >
            + Add Option
          </button>
        </div>
        {formData.bundle_options?.map((option, index) => (
          <div key={index} className="relative p-4 bg-white rounded-lg mb-3 border">
            <RemoveButton onClick={() => removeFromArray("bundle_options", index)} />
            <div className="grid grid-cols-2 gap-4 mb-3">
              <input
                type="text"
                placeholder="Option Title"
                value={option.title}
                onChange={(e) => handleArrayChange("bundle_options", index, "title", e.target.value)}
                className="border rounded-lg p-2"
              />
              <select
                value={option.type}
                onChange={(e) => handleArrayChange("bundle_options", index, "type", e.target.value)}
                className="border rounded-lg p-2"
              >
                <option value="select">Drop-down</option>
                <option value="radio">Radio Buttons</option>
                <option value="checkbox">Checkbox</option>
                <option value="multi">Multiple Select</option>
              </select>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={option.required}
                  onChange={(e) => handleArrayChange("bundle_options", index, "required", e.target.checked)}
                  className="w-4 h-4"
                />
                Required
              </label>
              <input
                type="text"
                placeholder="Option SKU"
                value={option.sku}
                onChange={(e) => handleArrayChange("bundle_options", index, "sku", e.target.value)}
                className="border rounded-lg p-2"
              />
            </div>

            <div className="mt-3 pl-4 border-l-2">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">Products in this Option</label>
                <button
                  type="button"
                  onClick={() => {
                    const currentLinks = [...(option.product_links || [])];
                    currentLinks.push({ sku: "", qty: 1, price: 0, price_type: "fixed", is_default: false });
                    handleArrayChange("bundle_options", index, "product_links", currentLinks);
                  }}
                  className="px-2 py-1 bg-gray-500 text-white rounded text-xs"
                >
                  + Add Product
                </button>
              </div>
              {option.product_links?.map((product, pIdx) => (
                <div key={pIdx} className="grid grid-cols-4 gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Product SKU"
                    value={product.sku}
                    onChange={(e) => {
                      const updated = [...option.product_links];
                      updated[pIdx] = { ...updated[pIdx], sku: e.target.value };
                      handleArrayChange("bundle_options", index, "product_links", updated);
                    }}
                    className="border rounded p-1 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Default Qty"
                    value={product.qty}
                    onChange={(e) => {
                      const updated = [...option.product_links];
                      updated[pIdx] = { ...updated[pIdx], qty: parseInt(e.target.value) };
                      handleArrayChange("bundle_options", index, "product_links", updated);
                    }}
                    className="border rounded p-1 text-sm"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={product.price}
                    onChange={(e) => {
                      const updated = [...option.product_links];
                      updated[pIdx] = { ...updated[pIdx], price: parseFloat(e.target.value) };
                      handleArrayChange("bundle_options", index, "product_links", updated);
                    }}
                    className="border rounded p-1 text-sm"
                  />
                  <label className="flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      checked={product.is_default}
                      onChange={(e) => {
                        const updated = [...option.product_links];
                        updated[pIdx] = { ...updated[pIdx], is_default: e.target.checked };
                        handleArrayChange("bundle_options", index, "product_links", updated);
                      }}
                    />
                    Default
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDownloadableProductFields = () => (
    <div className="space-y-6 mt-6 p-4 bg-blue-50 rounded-xl">
      <h3 className="font-semibold text-lg text-blue-800">Downloadable Product Configuration</h3>

      <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-lg border">
        <div>
          <label className="block text-sm font-semibold mb-1">Links Title</label>
          <input
            type="text"
            name="links_title"
            value={formData.links_title}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Samples Title</label>
          <input
            type="text"
            name="samples_title"
            value={formData.samples_title}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="links_purchased_separately"
            checked={formData.links_purchased_separately}
            onChange={handleChange}
            className="w-4 h-4"
          />
          Links can be purchased separately
        </label>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-semibold text-gray-700">Downloadable Links</label>
          <button
            type="button"
            onClick={() => addToArray("downloadable_links", {
              title: "",
              sort_order: 0,
              is_shareable: 1,
              price: 0,
              number_of_downloads: 0,
              link_type: "file",
              sample_type: "file"
            })}
            className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm"
          >
            + Add Link
          </button>
        </div>
        {formData.downloadable_links?.map((link, index) => (
          <div key={index} className="relative p-4 bg-white rounded-lg mb-3 border">
            <RemoveButton onClick={() => removeFromArray("downloadable_links", index)} />
            <div className="grid grid-cols-2 gap-4 mb-3">
              <input
                type="text"
                placeholder="Link Title"
                value={link.title}
                onChange={(e) => handleArrayChange("downloadable_links", index, "title", e.target.value)}
                className="border rounded-lg p-2"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                value={link.price}
                onChange={(e) => handleArrayChange("downloadable_links", index, "price", parseFloat(e.target.value))}
                className="border rounded-lg p-2"
              />
              <select
                value={link.link_type}
                onChange={(e) => handleArrayChange("downloadable_links", index, "link_type", e.target.value)}
                className="border rounded-lg p-2"
              >
                <option value="file">File Upload</option>
                <option value="url">URL</option>
              </select>
              <input
                type="text"
                placeholder={link.link_type === "file" ? "File Path" : "URL"}
                value={link.link_type === "file" ? link.link_file : link.link_url}
                onChange={(e) => handleArrayChange("downloadable_links", index,
                  link.link_type === "file" ? "link_file" : "link_url", e.target.value)}
                className="border rounded-lg p-2"
              />
              <input
                type="number"
                placeholder="Max Downloads (0 = unlimited)"
                value={link.number_of_downloads}
                onChange={(e) => handleArrayChange("downloadable_links", index, "number_of_downloads", parseInt(e.target.value))}
                className="border rounded-lg p-2"
              />
              <select
                value={link.is_shareable}
                onChange={(e) => handleArrayChange("downloadable_links", index, "is_shareable", parseInt(e.target.value))}
                className="border rounded-lg p-2"
              >
                <option value={0}>No</option>
                <option value={1}>Yes</option>
                <option value={2}>Use Config</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-semibold text-gray-700">Samples</label>
          <button
            type="button"
            onClick={() => addToArray("downloadable_samples", {
              title: "",
              sort_order: 0,
              sample_type: "file"
            })}
            className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm"
          >
            + Add Sample
          </button>
        </div>
        {formData.downloadable_samples?.map((sample, index) => (
          <div key={index} className="relative grid grid-cols-3 gap-4 mb-3 p-3 bg-white rounded-lg border">
            <RemoveButton onClick={() => removeFromArray("downloadable_samples", index)} />
            <input
              type="text"
              placeholder="Sample Title"
              value={sample.title}
              onChange={(e) => handleArrayChange("downloadable_samples", index, "title", e.target.value)}
              className="border rounded-lg p-2"
            />
            <select
              value={sample.sample_type}
              onChange={(e) => handleArrayChange("downloadable_samples", index, "sample_type", e.target.value)}
              className="border rounded-lg p-2"
            >
              <option value="file">File Upload</option>
              <option value="url">URL</option>
            </select>
            <input
              type="text"
              placeholder={sample.sample_type === "file" ? "File Path" : "URL"}
              value={sample.sample_type === "file" ? sample.sample_file : sample.sample_url}
              onChange={(e) => handleArrayChange("downloadable_samples", index,
                sample.sample_type === "file" ? "sample_file" : "sample_url", e.target.value)}
              className="border rounded-lg p-2"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderGiftCardFields = () => (
    <div className="space-y-6 mt-6 p-4 bg-pink-50 rounded-xl">
      <h3 className="font-semibold text-lg text-pink-800">Gift Card Configuration</h3>

      <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-lg border">
        <div>
          <label className="block text-sm font-semibold mb-1">Gift Card Type</label>
          <select
            name="giftcard_type"
            value={formData.giftcard_type}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          >
            <option value="virtual">Virtual</option>
            <option value="physical">Physical</option>
            <option value="combined">Combined</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Amount Type</label>
          <select
            name="giftcard_amount_type"
            value={formData.giftcard_amount_type}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          >
            <option value="fixed">Fixed Amounts</option>
            <option value="dynamic">Open Amount</option>
          </select>
        </div>

        {formData.giftcard_amount_type === 'dynamic' && (
          <>
            <div>
              <label className="block text-sm font-semibold mb-1">Min Open Amount</label>
              <input
                type="number"
                step="0.01"
                name="giftcard_open_amount_min"
                value={formData.giftcard_open_amount_min}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Max Open Amount</label>
              <input
                type="number"
                step="0.01"
                name="giftcard_open_amount_max"
                value={formData.giftcard_open_amount_max}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              />
            </div>
          </>
        )}

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="allow_message"
            checked={formData.allow_message}
            onChange={handleChange}
            className="w-4 h-4"
          />
          Allow Gift Message
        </label>

        {formData.allow_message && (
          <div>
            <label className="block text-sm font-semibold mb-1">Message Max Length</label>
            <input
              type="number"
              name="gift_message_max_length"
              value={formData.gift_message_max_length}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>
        )}
      </div>

      {formData.giftcard_amount_type === 'fixed' && (
        <div>
          <label className="block text-sm font-semibold mb-2">Predefined Amounts</label>
          <div className="flex gap-2 flex-wrap">
            {["10", "25", "50", "100", "200", "500"].map(amount => (
              <label key={amount} className="flex items-center gap-2 p-2 border rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.giftcard_amounts?.some(a => a.value === parseInt(amount))}
                  onChange={(e) => {
                    if (e.target.checked) {
                      addToArray("giftcard_amounts", { website_id: 0, value: parseInt(amount) });
                    } else {
                      const filtered = formData.giftcard_amounts?.filter(a => a.value !== parseInt(amount));
                      setFormData(prev => ({ ...prev, giftcard_amounts: filtered }));
                    }
                  }}
                />
                ${amount}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );

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

          {activeProductType === "configurable" && renderConfigurableProductFields()}
          {activeProductType === "grouped" && renderGroupedProductFields()}
          {activeProductType === "bundle" && renderBundleProductFields()}
          {activeProductType === "downloadable" && renderDownloadableProductFields()}
          {activeProductType === "giftcard" && renderGiftCardFields()}

          {/* For non-configurable products, show the submit button here */}
          {activeProductType !== "configurable" && (
            <div className="flex justify-end gap-3 pt-6 border-t mt-6">
              <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition" disabled={isSubmitting}>Cancel</button>
              <button type="submit" className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition disabled:bg-teal-300" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create Product"}</button>
            </div>
          )}
        </form>
      </div>

      {/* Product Type Change Confirmation Modal */}
      {showTypeChangeConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <h3 className="text-lg font-semibold mb-4">Confirm Product Type Change</h3>
            <p className="text-gray-600 mb-6">
              Changing product type from <strong>{activeProductType}</strong> to <strong>{pendingProductType}</strong> will reset all product-type-specific fields. Are you sure you want to continue?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowTypeChangeConfirm(false);
                  setPendingProductType(null);
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => pendingProductType && performProductTypeChange(pendingProductType)}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateProductForm;