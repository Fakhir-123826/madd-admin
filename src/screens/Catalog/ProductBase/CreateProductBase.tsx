import { useState, useEffect } from "react";
import Input from "../../../component/Inputs Feilds/Input";
import AddButton from "../../../component/AddButton";
import { useNavigate } from "react-router-dom";
import { useGetVendorsQuery } from "../../../app/api/VendorSlices/VendorApi";
import { useCreateProductMutation } from "../../../app/api/ProductSlices/ProductApi";
import { ROUTES } from "../../../router";


interface TierPrice {
  customer_group_id: number;
  qty: number;
  value: number;
}

interface ProductLink {
  sku: string;
  link_type: "related" | "upsell" | "crosssell";
  linked_product_sku: string;
  linked_product_type: string;
  position: number;
}

interface CustomOption {
  title: string;
  type: "field" | "area" | "file" | "drop_down" | "radio" | "checkbox" | "multiple" | "date" | "date_time" | "time";
  is_require: boolean;
  sort_order: number;
  price: number;
  price_type: "fixed" | "percent";
  sku: string;
  max_characters?: number;
  values?: Array<{
    title: string;
    price: number;
    price_type: "fixed" | "percent";
    sku: string;
    sort_order: number;
  }>;
}

interface MediaGalleryEntry {
  media_type: "image" | "external-video";
  label: string;
  position: number;
  disabled: boolean;
  types: string[];
  file?: string;
  content?: {
    base64_encoded_data: string;
    type: string;
    name: string;
  };
  video_content?: {
    video_provider: "youtube" | "vimeo";
    video_url: string;
    video_title: string;
    video_description: string;
  };
}

interface DownloadableLink {
  title: string;
  sort_order: number;
  is_shareable: number;
  price: number;
  number_of_downloads: number;
  link_type: "file" | "url";
  link_file?: string;
  link_url?: string;
  sample_type: "file" | "url";
  sample_file?: string;
  sample_url?: string;
}

interface DownloadableSample {
  title: string;
  sort_order: number;
  sample_type: "file" | "url";
  sample_file?: string;
  sample_url?: string;
}

interface BundleOption {
  title: string;
  required: boolean;
  type: "select" | "multi" | "radio" | "checkbox";
  position: number;
  sku: string;
  product_links: Array<{
    sku: string;
    qty: number;
    position: number;
    is_default: boolean;
    price: number;
    price_type: number;
    can_change_quantity: number;
  }>;
}

interface FormErrors {
  vendor_id?: string;
  vendor_store_id?: string;
  sku?: string;
  name?: string;
  price?: string;
  quantity?: string;
  [key: string]: string | undefined;
}

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

const CreateProductBase = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("simple");
  const [errors, setErrors] = useState<FormErrors>({});
  const [alertMessage, setAlertMessage] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Fetch vendors
  const { data: vendorsData, isLoading: vendorsLoading } = useGetVendorsQuery({});

  const [availableStores, setAvailableStores] = useState<any[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const [formData, setFormData] = useState({
    vendor_id: "",
    vendor_store_id: "",
    sku: "",
    name: "",
    description: "",
    short_description: "",
    price: "",
    special_price: "",
    special_price_from: "",
    special_price_to: "",
    quantity: "",
    weight: "",
    status: "active",
    visibility: 4,
    categories: [] as number[],
    attributes: {} as Record<string, any>,
    media_gallery: [] as MediaGalleryEntry[],
    product_data: {
      type_id: "simple",
      attribute_set_id: 4,
      visibility: 4,
      extension_attributes: {
        website_ids: [1],
        stock_item: {
          qty: 0,
          is_in_stock: true,
          use_config_manage_stock: true,
          manage_stock: true
        }
      },
      tier_prices: [] as TierPrice[],
      product_links: [] as ProductLink[],
      options: [] as CustomOption[]
    },
    downloadable_links: [] as DownloadableLink[],
    downloadable_samples: [] as DownloadableSample[],
    bundle_options: [] as BundleOption[],
    configurable_attributes: [] as Array<{
      attribute_id: string;
      label: string;
      values: number[];
    }>,
    configurable_product_links: [] as string[],
    giftcard_amounts: [] as Array<{
      website_id: number;
      value: number;
    }>
  });

  const [createProduct, { isLoading: isSubmitting }] = useCreateProductMutation();

  // Update available stores when vendor changes
  useEffect(() => {
    if (formData.vendor_id && vendorsData?.data) {
      const vendor = vendorsData.data.find((v: Vendor) => v.id === parseInt(formData.vendor_id));
      if (vendor) {
        setSelectedVendor(vendor);
        setAvailableStores(vendor.stores || []);
        // Reset store selection when vendor changes
        setFormData(prev => ({ ...prev, vendor_store_id: "" }));
      } else {
        setSelectedVendor(null);
        setAvailableStores([]);
      }
    } else {
      setAvailableStores([]);
      setSelectedVendor(null);
    }
  }, [formData.vendor_id, vendorsData]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.vendor_id) {
      newErrors.vendor_id = "Vendor is required";
    }
    if (!formData.vendor_store_id) {
      newErrors.vendor_store_id = "Store is required";
    }
    if (!formData.sku.trim()) {
      newErrors.sku = "SKU is required";
    }
    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }
    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      newErrors.quantity = "Valid quantity is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : value
    }));
  };

  const handleRemoveTierPrice = (index: number) => {
    setFormData(prev => ({
      ...prev,
      product_data: {
        ...prev.product_data,
        tier_prices: prev.product_data.tier_prices.filter((_, i) => i !== index)
      }
    }));
  };

  const handleRemoveProductLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      product_data: {
        ...prev.product_data,
        product_links: prev.product_data.product_links.filter((_, i) => i !== index)
      }
    }));
  };

  const handleRemoveCustomOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      product_data: {
        ...prev.product_data,
        options: prev.product_data.options.filter((_, i) => i !== index)
      }
    }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      media_gallery: prev.media_gallery.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveDownloadableLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      downloadable_links: prev.downloadable_links.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveBundleOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      bundle_options: prev.bundle_options.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveBundleProductLink = (optionIndex: number, productIndex: number) => {
    setFormData(prev => ({
      ...prev,
      bundle_options: prev.bundle_options.map((option, idx) =>
        idx === optionIndex
          ? { ...option, product_links: option.product_links.filter((_, i) => i !== productIndex) }
          : option
      )
    }));
  };

  const handleAddTierPrice = () => {
    setFormData(prev => ({
      ...prev,
      product_data: {
        ...prev.product_data,
        tier_prices: [
          ...prev.product_data.tier_prices,
          { customer_group_id: 0, qty: 0, value: 0 }
        ]
      }
    }));
  };

  const handleTierPriceChange = (index: number, field: keyof TierPrice, value: number) => {
    const updated = [...formData.product_data.tier_prices];
    updated[index][field] = value;
    setFormData(prev => ({
      ...prev,
      product_data: { ...prev.product_data, tier_prices: updated }
    }));
  };

  const handleAddProductLink = () => {
    setFormData(prev => ({
      ...prev,
      product_data: {
        ...prev.product_data,
        product_links: [
          ...prev.product_data.product_links,
          { sku: "", link_type: "related", linked_product_sku: "", linked_product_type: "simple", position: 0 }
        ]
      }
    }));
  };

  const handleAddCustomOption = () => {
    setFormData(prev => ({
      ...prev,
      product_data: {
        ...prev.product_data,
        options: [
          ...prev.product_data.options,
          { title: "", type: "field", is_require: false, sort_order: 0, price: 0, price_type: "fixed", sku: "", values: [] }
        ]
      }
    }));
  };

  // Update handleAddImage
  const handleAddImage = async (base64Image: string, fileName: string) => {
    try {
      // Compress image before adding
      const compressedImage = await compressImage(base64Image, 800, 800);

      const newImage: MediaGalleryEntry = {
        media_type: "image",
        label: fileName,
        position: formData.media_gallery.length + 1,
        disabled: false,
        types: formData.media_gallery.length === 0 ? ["image", "small_image", "thumbnail"] : [],
        content: {
          base64_encoded_data: compressedImage,
          type: "image/jpeg",
          name: fileName.replace(/\.[^/.]+$/, '') + '.jpg' // Change extension to jpg
        }
      };

      setFormData(prev => ({
        ...prev,
        media_gallery: [...prev.media_gallery, newImage]
      }));
    } catch (error) {
      console.error("Failed to compress image:", error);
      setAlertMessage({ type: "error", message: "Failed to process image. Please try a different image." });
    }
  };

  const handleAddDownloadableLink = () => {
    setFormData(prev => ({
      ...prev,
      downloadable_links: [
        ...prev.downloadable_links,
        { title: "", sort_order: 0, is_shareable: 1, price: 0, number_of_downloads: 0, link_type: "file", sample_type: "file" }
      ]
    }));
  };

  const handleAddBundleOption = () => {
    setFormData(prev => ({
      ...prev,
      bundle_options: [
        ...prev.bundle_options,
        { title: "", required: true, type: "select", position: 0, sku: "", product_links: [] }
      ]
    }));
  };

  const handleAddBundleProductLink = (optionIndex: number) => {
    setFormData(prev => ({
      ...prev,
      bundle_options: prev.bundle_options.map((option, idx) =>
        idx === optionIndex
          ? {
            ...option,
            product_links: [
              ...option.product_links,
              { sku: "", qty: 1, position: option.product_links.length, is_default: false, price: 0, price_type: 0, can_change_quantity: 0 }
            ]
          }
          : option
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertMessage(null);

    if (!validateForm()) {
      setAlertMessage({ type: "error", message: "Please fix the validation errors before submitting." });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Separate media_gallery from main product_data
    const mediaGallery = formData.media_gallery;

    const payload: any = {
      vendor_id: parseInt(formData.vendor_id),
      vendor_store_id: parseInt(formData.vendor_store_id),
      sku: formData.sku,
      name: formData.name,
      description: formData.description,
      short_description: formData.short_description,
      price: parseFloat(formData.price),
      special_price: formData.special_price ? parseFloat(formData.special_price) : undefined,
      special_price_from: formData.special_price_from || undefined,
      special_price_to: formData.special_price_to || undefined,
      quantity: parseInt(formData.quantity),
      weight: formData.weight ? parseFloat(formData.weight) : 0,
      status: formData.status,
      categories: formData.categories.length ? formData.categories : undefined,
      attributes: Object.keys(formData.attributes).length ? formData.attributes : undefined,
      // Don't send media_gallery in the main product_data
      media_gallery: mediaGallery.length ? mediaGallery : undefined,
      product_data: {
        ...formData.product_data,
        type_id: activeTab,
        tier_prices: formData.product_data.tier_prices.length ? formData.product_data.tier_prices : undefined,
        product_links: formData.product_data.product_links.length ? formData.product_data.product_links : undefined,
        options: formData.product_data.options.length ? formData.product_data.options : undefined
      }
    };

    // Remove media_gallery from product_data to avoid duplication
    if (payload.product_data.media_gallery_entries) {
      delete payload.product_data.media_gallery_entries;
    }

    // Similar for other product types...

    try {
      const result = await createProduct(payload).unwrap();
      if (result.success) {
        setAlertMessage({ type: "success", message: "Product created successfully!" });
        setTimeout(() => {
          navigate(ROUTES.PRODUCT_BASE_LIST);
        }, 2000);
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      const errorMessage = error?.data?.message || error?.message || "Failed to create product";
      setAlertMessage({ type: "error", message: errorMessage });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const compressImage = (base64: string, maxWidth: number = 800, maxHeight: number = 800): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Compress to JPEG with 0.7 quality
        const compressed = canvas.toDataURL('image/jpeg', 0.7);
        const base64Data = compressed.split(',')[1];
        resolve(base64Data);
      };
      img.onerror = reject;
      img.src = `data:image/jpeg;base64,${base64}`;
    });
  };



  // Loading overlay component
  const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        <p className="text-gray-700 font-medium">Creating product...</p>
      </div>
    </div>
  );

  // Alert component
  const Alert = ({ type, message, onClose }: { type: "success" | "error"; message: string; onClose: () => void }) => (
    <div className={`rounded-lg p-4 mb-6 flex justify-between items-center ${type === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
      }`}>
      <p className={type === "success" ? "text-green-700" : "text-red-700"}>{message}</p>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600">×</button>
    </div>
  );

  // Remove button component
  const RemoveButton = ({ onClick }: { onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs hover:bg-red-600 transition flex items-center justify-center"
    >
      ×
    </button>
  );

  if (vendorsLoading) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  const vendors = vendorsData?.data || [];

  const renderSimpleTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Basic Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative">
          <Input
            label="SKU"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            required
            error={errors.sku}
          />
        </div>
        <div className="relative">
          <Input
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            error={errors.name}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">Short Description</label>
        <textarea
          name="short_description"
          rows={2}
          value={formData.short_description}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">Full Description</label>
        <textarea
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400"
        />
      </div>

      <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Pricing & Inventory</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative">
          <Input
            label="Regular Price"
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
            error={errors.price}
          />
        </div>
        <Input label="Special Price" name="special_price" type="number" step="0.01" value={formData.special_price} onChange={handleChange} />
        <Input label="Special Price From" name="special_price_from" type="date" value={formData.special_price_from} onChange={handleChange} />
        <Input label="Special Price To" name="special_price_to" type="date" value={formData.special_price_to} onChange={handleChange} />
        <div className="relative">
          <Input
            label="Quantity"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            required
            error={errors.quantity}
          />
        </div>
        <Input label="Weight (kg)" name="weight" type="number" step="0.01" value={formData.weight} onChange={handleChange} />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">Status</label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input type="radio" name="status" value="active" checked={formData.status === "active"} onChange={handleChange} />
            Active
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="status" value="inactive" checked={formData.status === "inactive"} onChange={handleChange} />
            Inactive
          </label>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-semibold text-gray-700">Tier Prices (Volume Discounts)</label>
          <AddButton label="Add Tier Price" type="button" onClick={handleAddTierPrice} />
        </div>
        {formData.product_data.tier_prices.map((tier, index) => (
          <div key={index} className="relative grid grid-cols-3 gap-4 mb-3 p-3 bg-gray-50 rounded-lg">
            <RemoveButton onClick={() => handleRemoveTierPrice(index)} />
            <Input label="Customer Group ID" type="number" value={tier.customer_group_id.toString()} onChange={(e) => handleTierPriceChange(index, "customer_group_id", parseInt(e.target.value))} />
            <Input label="Minimum Qty" type="number" value={tier.qty.toString()} onChange={(e) => handleTierPriceChange(index, "qty", parseInt(e.target.value))} />
            <Input label="Price" type="number" step="0.01" value={tier.value.toString()} onChange={(e) => handleTierPriceChange(index, "value", parseFloat(e.target.value))} />
          </div>
        ))}
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-semibold text-gray-700">Related/Up-sell/Cross-sell Products</label>
          <AddButton label="Add Product Link" type="button" onClick={handleAddProductLink} />
        </div>
        {formData.product_data.product_links.map((link, index) => (
          <div key={index} className="relative grid grid-cols-4 gap-4 mb-3 p-3 bg-gray-50 rounded-lg">
            <RemoveButton onClick={() => handleRemoveProductLink(index)} />
            <Input label="Linked Product SKU" value={link.linked_product_sku} onChange={(e) => {
              const updated = [...formData.product_data.product_links];
              updated[index].linked_product_sku = e.target.value;
              setFormData(prev => ({ ...prev, product_data: { ...prev.product_data, product_links: updated } }));
            }} />
            <select value={link.link_type} onChange={(e) => {
              const updated = [...formData.product_data.product_links];
              updated[index].link_type = e.target.value as any;
              setFormData(prev => ({ ...prev, product_data: { ...prev.product_data, product_links: updated } }));
            }} className="border border-gray-300 rounded-xl p-3">
              <option value="related">Related</option>
              <option value="upsell">Up-sell</option>
              <option value="crosssell">Cross-sell</option>
            </select>
            <Input label="Position" type="number" value={link.position.toString()} onChange={(e) => {
              const updated = [...formData.product_data.product_links];
              updated[index].position = parseInt(e.target.value);
              setFormData(prev => ({ ...prev, product_data: { ...prev.product_data, product_links: updated } }));
            }} />
          </div>
        ))}
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-semibold text-gray-700">Custom Options</label>
          <AddButton label="Add Custom Option" type="button" onClick={handleAddCustomOption} />
        </div>
        {formData.product_data.options.map((option, index) => (
          <div key={index} className="relative p-4 bg-gray-50 rounded-lg mb-3">
            <RemoveButton onClick={() => handleRemoveCustomOption(index)} />
            <div className="grid grid-cols-2 gap-4 mb-3">
              <Input label="Option Title" value={option.title} onChange={(e) => {
                const updated = [...formData.product_data.options];
                updated[index].title = e.target.value;
                setFormData(prev => ({ ...prev, product_data: { ...prev.product_data, options: updated } }));
              }} />
              <select value={option.type} onChange={(e) => {
                const updated = [...formData.product_data.options];
                updated[index].type = e.target.value as any;
                setFormData(prev => ({ ...prev, product_data: { ...prev.product_data, options: updated } }));
              }} className="border border-gray-300 rounded-xl p-3">
                <option value="field">Text Field</option>
                <option value="area">Text Area</option>
                <option value="drop_down">Drop-down</option>
                <option value="radio">Radio Buttons</option>
                <option value="checkbox">Checkbox</option>
                <option value="date">Date</option>
              </select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Input label="Price" type="number" step="0.01" value={option.price.toString()} onChange={(e) => {
                const updated = [...formData.product_data.options];
                updated[index].price = parseFloat(e.target.value);
                setFormData(prev => ({ ...prev, product_data: { ...prev.product_data, options: updated } }));
              }} />
              <Input label="SKU" value={option.sku} onChange={(e) => {
                const updated = [...formData.product_data.options];
                updated[index].sku = e.target.value;
                setFormData(prev => ({ ...prev, product_data: { ...prev.product_data, options: updated } }));
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDownloadableTab = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <p className="text-sm text-blue-700">Downloadable products are digital goods that customers can download after purchase.</p>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-semibold text-gray-700">Downloadable Files</label>
          <AddButton label="Add Downloadable Link" type="button" onClick={handleAddDownloadableLink} />
        </div>
        {formData.downloadable_links.map((link, index) => (
          <div key={index} className="relative p-4 bg-gray-50 rounded-lg mb-3">
            <RemoveButton onClick={() => handleRemoveDownloadableLink(index)} />
            <div className="grid grid-cols-2 gap-4 mb-3">
              <Input label="Title" value={link.title} onChange={(e) => {
                const updated = [...formData.downloadable_links];
                updated[index].title = e.target.value;
                setFormData(prev => ({ ...prev, downloadable_links: updated }));
              }} />
              <Input label="Price" type="number" step="0.01" value={link.price.toString()} onChange={(e) => {
                const updated = [...formData.downloadable_links];
                updated[index].price = parseFloat(e.target.value);
                setFormData(prev => ({ ...prev, downloadable_links: updated }));
              }} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="File URL or Path" value={link.link_file || link.link_url || ""} onChange={(e) => {
                const updated = [...formData.downloadable_links];
                if (link.link_type === "file") {
                  updated[index].link_file = e.target.value;
                } else {
                  updated[index].link_url = e.target.value;
                }
                setFormData(prev => ({ ...prev, downloadable_links: updated }));
              }} />
              <select value={link.link_type} onChange={(e) => {
                const updated = [...formData.downloadable_links];
                updated[index].link_type = e.target.value as any;
                setFormData(prev => ({ ...prev, downloadable_links: updated }));
              }} className="border border-gray-300 rounded-xl p-3">
                <option value="file">File Upload</option>
                <option value="url">URL</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {renderSimpleTab()}
    </div>
  );

  const renderBundleTab = () => (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg mb-4">
        <p className="text-sm text-green-700">Bundle products allow customers to purchase multiple items together as a set.</p>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-semibold text-gray-700">Bundle Options</label>
          <AddButton label="Add Bundle Option" type="button" onClick={handleAddBundleOption} />
        </div>
        {formData.bundle_options.map((option, optionIndex) => (
          <div key={optionIndex} className="relative p-4 bg-gray-50 rounded-lg mb-3">
            <RemoveButton onClick={() => handleRemoveBundleOption(optionIndex)} />
            <div className="grid grid-cols-2 gap-4 mb-3">
              <Input label="Option Title" value={option.title} onChange={(e) => {
                const updated = [...formData.bundle_options];
                updated[optionIndex].title = e.target.value;
                setFormData(prev => ({ ...prev, bundle_options: updated }));
              }} />
              <select value={option.type} onChange={(e) => {
                const updated = [...formData.bundle_options];
                updated[optionIndex].type = e.target.value as any;
                setFormData(prev => ({ ...prev, bundle_options: updated }));
              }} className="border border-gray-300 rounded-xl p-3">
                <option value="select">Drop-down</option>
                <option value="radio">Radio Buttons</option>
                <option value="checkbox">Checkbox</option>
                <option value="multi">Multiple Select</option>
              </select>
            </div>
            <div className="flex items-center gap-4 mb-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={option.required} onChange={(e) => {
                  const updated = [...formData.bundle_options];
                  updated[optionIndex].required = e.target.checked;
                  setFormData(prev => ({ ...prev, bundle_options: updated }));
                }} />
                Required
              </label>
            </div>
            <div className="mt-3">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Products in this option</label>
              {option.product_links.map((productLink, productIndex) => (
                <div key={productIndex} className="relative grid grid-cols-3 gap-3 mb-2 p-2 bg-white rounded">
                  <RemoveButton onClick={() => handleRemoveBundleProductLink(optionIndex, productIndex)} />
                  <Input label="Product SKU" value={productLink.sku} onChange={(e) => {
                    const updated = [...formData.bundle_options];
                    updated[optionIndex].product_links[productIndex].sku = e.target.value;
                    setFormData(prev => ({ ...prev, bundle_options: updated }));
                  }} />
                  <Input label="Quantity" type="number" value={productLink.qty.toString()} onChange={(e) => {
                    const updated = [...formData.bundle_options];
                    updated[optionIndex].product_links[productIndex].qty = parseInt(e.target.value);
                    setFormData(prev => ({ ...prev, bundle_options: updated }));
                  }} />
                  <Input label="Price" type="number" step="0.01" value={productLink.price.toString()} onChange={(e) => {
                    const updated = [...formData.bundle_options];
                    updated[optionIndex].product_links[productIndex].price = parseFloat(e.target.value);
                    setFormData(prev => ({ ...prev, bundle_options: updated }));
                  }} />
                </div>
              ))}
              <AddButton label="Add Product to Option" type="button" onClick={() => handleAddBundleProductLink(optionIndex)} />
            </div>
          </div>
        ))}
      </div>

      {renderSimpleTab()}
    </div>
  );

  const renderConfigurableTab = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 p-4 rounded-lg mb-4">
        <p className="text-sm text-purple-700">Configurable products allow customers to choose variations (e.g., size, color).</p>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">Configurable Attributes</label>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-3">Simple products will need to be created first and then linked here.</p>
          <Input label="Simple Product SKUs (comma separated)" placeholder="PROD-001, PROD-002, PROD-003" onChange={(e) => {
            setFormData(prev => ({
              ...prev,
              configurable_product_links: e.target.value.split(",").map(s => s.trim()).filter(s => s)
            }));
          }} />
        </div>
      </div>

      {renderSimpleTab()}
    </div>
  );

  const renderGiftCardTab = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 p-4 rounded-lg mb-4">
        <p className="text-sm text-yellow-700">Gift cards can be purchased and redeemed for store credit.</p>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">Gift Card Amounts</label>
        <div className="grid grid-cols-2 gap-4">
          {["25", "50", "100", "200"].map(amount => (
            <label key={amount} className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                value={amount}
                onChange={(e) => {
                  const value = parseFloat(amount);
                  if (e.target.checked) {
                    setFormData(prev => ({
                      ...prev,
                      giftcard_amounts: [...prev.giftcard_amounts, { website_id: 0, value }]
                    }));
                  } else {
                    setFormData(prev => ({
                      ...prev,
                      giftcard_amounts: prev.giftcard_amounts.filter(a => a.value !== value)
                    }));
                  }
                }}
              />
              ${amount}
            </label>
          ))}
        </div>
      </div>

      {renderSimpleTab()}
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {isSubmitting && <LoadingOverlay />}

      <div className="mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-8">
        {/* Alert Messages */}
        {alertMessage && (
          <Alert
            type={alertMessage.type}
            message={alertMessage.message}
            onClose={() => setAlertMessage(null)}
          />
        )}

        {/* Vendor & Store Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Vendor <span className="text-red-500">*</span>
            </label>
            <select
              name="vendor_id"
              value={formData.vendor_id}
              onChange={handleChange}
              className={`w-full border ${errors.vendor_id ? 'border-red-500' : 'border-gray-300'} rounded-xl p-3 focus:ring-2 focus:ring-teal-400`}
            >
              <option value="">Select Vendor</option>
              {vendors.map((vendor: Vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.company_name || `Vendor ${vendor.id}`}
                </option>
              ))}
            </select>
            {errors.vendor_id && (
              <p className="text-red-500 text-sm mt-1">{errors.vendor_id}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Store <span className="text-red-500">*</span>
            </label>
            <select
              name="vendor_store_id"
              value={formData.vendor_store_id}
              onChange={handleChange}
              disabled={!formData.vendor_id || availableStores.length === 0}
              className={`w-full border ${errors.vendor_store_id ? 'border-red-500' : 'border-gray-300'} rounded-xl p-3 focus:ring-2 focus:ring-teal-400 disabled:bg-gray-100 disabled:cursor-not-allowed`}
            >
              <option value="">Select Store</option>
              {availableStores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.store_name}
                </option>
              ))}
            </select>
            {errors.vendor_store_id && (
              <p className="text-red-500 text-sm mt-1">{errors.vendor_store_id}</p>
            )}
            {formData.vendor_id && availableStores.length === 0 && !vendorsLoading && (
              <p className="text-yellow-500 text-sm mt-1">No stores found for this vendor</p>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex gap-2 flex-wrap">
            {["simple", "downloadable", "bundle", "configurable", "giftcard"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium capitalize rounded-t-lg transition ${activeTab === tab
                    ? "text-teal-600 border-b-2 border-teal-600 bg-teal-50"
                    : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Media Gallery - Common for all product types */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-gray-700">Product Images</label>
            <div className="flex gap-3 flex-wrap">
              {formData.media_gallery.map((img, idx) => (
                <div key={idx} className="relative w-24 h-24 bg-gray-200 rounded-xl overflow-hidden">
                  <img
                    src={`data:${img.content?.type};base64,${img.content?.base64_encoded_data}`}
                    alt={img.label}
                    className="w-full h-full object-cover"
                  />
                  <RemoveButton onClick={() => handleRemoveImage(idx)} />
                </div>
              ))}
              <label className="w-24 h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-sm text-gray-500 cursor-pointer hover:border-teal-400 transition">
                + Add Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 5 * 1024 * 1024) {
                        setAlertMessage({ type: "error", message: "Image size should be less than 5MB" });
                        return;
                      }
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const base64 = (reader.result as string).split(",")[1];
                        handleAddImage(base64, file.name);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {/* Product Type Specific Content */}
          {activeTab === "simple" && renderSimpleTab()}
          {activeTab === "downloadable" && renderDownloadableTab()}
          {activeTab === "bundle" && renderBundleTab()}
          {activeTab === "configurable" && renderConfigurableTab()}
          {activeTab === "giftcard" && renderGiftCardTab()}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition disabled:bg-teal-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductBase;