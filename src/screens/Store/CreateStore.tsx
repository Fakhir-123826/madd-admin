import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StepProgress from '../../component/Store/StepProgress';
import {
    useCreateStoreMutation,
    useUpdateStoreMutation,
    useGetStoreQuery,
    useGetVendorsForStoreQuery,
} from '../../app/api/StoreSlices/StoreApi';

// ============ TYPES ============
interface FormData {
    // Basic Info
    vendor_id: number;
    name: string;
    slug: string;
    description: string;
    
    // Address
    address: string;
    city: string;
    state: string;
    zip_code: string;
    country_code: string;
    
    // Contact
    email: string;
    phone: string;
    
    // Status
    status: 'active' | 'inactive' | 'pending';
    
    // Media
    logo: string;
    banner: string;
    
    // SEO
    meta_title: string;
    meta_description: string;
    
    // Social
    facebook_url: string;
    instagram_url: string;
    twitter_url: string;
    whatsapp_number: string;
    
    // Store Settings
    currency: string;
    timezone: string;
    
    // Store Timings (stored in metadata or separate table)
    opening_time: string;
    closing_time: string;
    break_from: string;
    break_to: string;
    
    // Pickup
    pickup_available: boolean;
    pickup_point_name: string;
    pickup_address: string;
    availability_from_day: string;
    availability_to_day: string;
    availability_from_time: string;
    availability_to_time: string;
    whole_week: boolean;
    additional_info: string;
}

// Extended Store type with additional fields that might be in metadata
interface ExtendedStoreData {
    id?: number;
    uuid?: string;
    vendor_id?: number;
    name?: string;
    slug?: string;
    description?: string;
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    country_code?: string;
    email?: string;
    phone?: string;
    status?: 'active' | 'inactive' | 'pending';
    logo?: string;
    banner?: string;
    meta_title?: string;
    meta_description?: string;
    facebook_url?: string;
    instagram_url?: string;
    twitter_url?: string;
    whatsapp_number?: string;
    currency?: string;
    timezone?: string;
    // Metadata might contain these fields
    metadata?: {
        opening_time?: string;
        closing_time?: string;
        break_from?: string;
        break_to?: string;
        pickup_available?: boolean;
        pickup_point_name?: string;
        pickup_address?: string;
        availability_from_day?: string;
        availability_to_day?: string;
        availability_from_time?: string;
        availability_to_time?: string;
        whole_week?: boolean;
        additional_info?: string;
    };
}

const CreateStore = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditMode = !!id;
    
    const [currentStep, setCurrentStep] = useState(0);
    const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
    
    // API Hooks
    const [createStore, { isLoading: isCreating }] = useCreateStoreMutation();
    const [updateStore, { isLoading: isUpdating }] = useUpdateStoreMutation();
    const { data: storeData, isLoading: isLoadingStore } = useGetStoreQuery(id!, {
        skip: !isEditMode,
    });
    const { data: vendorsData } = useGetVendorsForStoreQuery();
    
    const [formData, setFormData] = useState<FormData>({
        vendor_id: 0,
        name: "",
        slug: "",
        description: "",
        address: "",
        city: "",
        state: "",
        zip_code: "",
        country_code: "US",
        email: "",
        phone: "",
        status: "pending",
        logo: "",
        banner: "",
        meta_title: "",
        meta_description: "",
        facebook_url: "",
        instagram_url: "",
        twitter_url: "",
        whatsapp_number: "",
        currency: "USD",
        timezone: "UTC",
        opening_time: "09:00",
        closing_time: "17:00",
        break_from: "",
        break_to: "",
        pickup_available: false,
        pickup_point_name: "",
        pickup_address: "",
        availability_from_day: "Monday",
        availability_to_day: "Friday",
        availability_from_time: "09:00",
        availability_to_time: "17:00",
        whole_week: false,
        additional_info: "",
    });
    
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    const showToast = (type: "success" | "error", msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3000);
    };
    
    // Load store data for edit mode
    useEffect(() => {
        if (storeData?.data && isEditMode) {
            const store = storeData.data as ExtendedStoreData;
            const metadata = store.metadata || {};
            
            setFormData({
                vendor_id: store.vendor_id || 0,
                name: store.name || "",
                slug: store.slug || "",
                description: store.description || "",
                address: store.address || "",
                city: store.city || "",
                state: store.state || "",
                zip_code: store.zip_code || "",
                country_code: store.country_code || "US",
                email: store.email || "",
                phone: store.phone || "",
                status: store.status || "pending",
                logo: store.logo || "",
                banner: store.banner || "",
                meta_title: store.meta_title || "",
                meta_description: store.meta_description || "",
                facebook_url: store.facebook_url || "",
                instagram_url: store.instagram_url || "",
                twitter_url: store.twitter_url || "",
                whatsapp_number: store.whatsapp_number || "",
                currency: store.currency || "USD",
                timezone: store.timezone || "UTC",
                opening_time: metadata.opening_time || "09:00",
                closing_time: metadata.closing_time || "17:00",
                break_from: metadata.break_from || "",
                break_to: metadata.break_to || "",
                pickup_available: metadata.pickup_available || false,
                pickup_point_name: metadata.pickup_point_name || "",
                pickup_address: metadata.pickup_address || "",
                availability_from_day: metadata.availability_from_day || "Monday",
                availability_to_day: metadata.availability_to_day || "Friday",
                availability_from_time: metadata.availability_from_time || "09:00",
                availability_to_time: metadata.availability_to_time || "17:00",
                whole_week: metadata.whole_week || false,
                additional_info: metadata.additional_info || "",
            });
        }
    }, [storeData, isEditMode]);
    
    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData({ ...formData, [name]: checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
        // Clear error for this field
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };
    
    // Generate slug from name
    const generateSlug = () => {
        if (formData.name) {
            const slug = formData.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            setFormData({ ...formData, slug });
        }
    };
    
    // Validate current step
    const validateStep = (): boolean => {
        const newErrors: Record<string, string> = {};
        
        if (currentStep === 0) {
            if (!formData.vendor_id) newErrors.vendor_id = "Vendor is required";
            if (!formData.name.trim()) newErrors.name = "Store name is required";
            if (!formData.slug.trim()) newErrors.slug = "Slug is required";
            if (!formData.email.trim()) newErrors.email = "Email is required";
            else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    // Handle next step
    const handleNext = () => {
        if (validateStep()) {
            setCurrentStep(currentStep + 1);
        }
    };
    
    // Handle previous step
    const handlePrevious = () => {
        setCurrentStep(currentStep - 1);
    };
    
    // Prepare payload for API (only include fields that exist in the backend)
    const preparePayload = () => {
        return {
            vendor_id: formData.vendor_id,
            name: formData.name,
            slug: formData.slug,
            description: formData.description,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip_code: formData.zip_code,
            country_code: formData.country_code,
            email: formData.email,
            phone: formData.phone,
            status: formData.status,
            logo: formData.logo,
            banner: formData.banner,
            meta_title: formData.meta_title,
            meta_description: formData.meta_description,
            facebook_url: formData.facebook_url,
            instagram_url: formData.instagram_url,
            twitter_url: formData.twitter_url,
            whatsapp_number: formData.whatsapp_number,
            currency: formData.currency,
            timezone: formData.timezone,
            // Store timings and pickup in metadata
            metadata: {
                opening_time: formData.opening_time,
                closing_time: formData.closing_time,
                break_from: formData.break_from,
                break_to: formData.break_to,
                pickup_available: formData.pickup_available,
                pickup_point_name: formData.pickup_point_name,
                pickup_address: formData.pickup_address,
                availability_from_day: formData.availability_from_day,
                availability_to_day: formData.availability_to_day,
                availability_from_time: formData.availability_from_time,
                availability_to_time: formData.availability_to_time,
                whole_week: formData.whole_week,
                additional_info: formData.additional_info,
            },
        };
    };
    
    // Handle submit
    const handleSubmit = async () => {
        if (!validateStep()) return;
        
        try {
            const payload = preparePayload();
            
            if (isEditMode) {
                await updateStore({ id: parseInt(id!), data: payload }).unwrap();
                showToast("success", "Store updated successfully!");
            } else {
                await createStore(payload).unwrap();
                showToast("success", "Store created successfully!");
            }
            
            setTimeout(() => {
                navigate('/storeList');
            }, 1500);
        } catch (error: any) {
            console.error('Failed to save store:', error);
            if (error?.data?.errors) {
                setErrors(error.data.errors);
                showToast("error", "Please fix the validation errors");
            } else {
                showToast("error", error?.data?.message || "Failed to save store");
            }
        }
    };
    
    if (isLoadingStore) {
        return (
            <div className="bg-white shadow-sm p-6 rounded-xl">
                <div className="text-center py-10">
                    <div className="animate-spin h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-gray-500">Loading store details...</p>
                </div>
            </div>
        );
    }
    
    const isLoading = isCreating || isUpdating;
    const vendors = vendorsData?.data || [];
    
    return (
        <>
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
                    ${toast.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                >
                    <span>{toast.type === "success" ? "✓" : "✕"}</span>
                    {toast.msg}
                </div>
            )}
            
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/storeList')}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        ←
                    </button>
                    <h2 className="text-lg font-semibold">
                        {isEditMode ? "Edit Store" : "Create New Store"}
                    </h2>
                </div>
            </div>
            
            {/* STEP 0: Store Info */}
            {currentStep === 0 && (
                <div className="bg-white p-6 px-12 rounded-xl shadow-sm space-y-6">
                    <StepProgress
                        currentStep={0}
                        steps={[
                            { label: "Store Info" },
                            { label: "Timings" },
                            { label: "Pick up" },
                        ]}
                    />
                    
                    <div className="font-bold text-lg">Store Information</div>
                    
                    {/* STORE BASIC INFO */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Vendor Selection */}
                        <div>
                            <label className="text-sm font-medium">
                                Vendor <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="vendor_id"
                                value={formData.vendor_id}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                                disabled={isLoading}
                            >
                                <option value={0}>Select Vendor</option>
                                {vendors.map((vendor: any) => (
                                    <option key={vendor.id} value={vendor.id}>
                                        {vendor.company_name}
                                    </option>
                                ))}
                            </select>
                            {errors.vendor_id && (
                                <p className="text-red-500 text-xs mt-1">{errors.vendor_id}</p>
                            )}
                        </div>
                        
                        <div>
                            <label className="text-sm font-medium">
                                Store Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    onBlur={generateSlug}
                                    placeholder="Blossom Flowers"
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                                    disabled={isLoading}
                                />
                            </div>
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        
                        <div>
                            <label className="text-sm font-medium">
                                Store Slug <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                placeholder="blossom-flowers"
                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                                disabled={isLoading}
                            />
                            {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
                        </div>
                        
                        <div>
                            <label className="text-sm font-medium">Currency</label>
                            <select
                                name="currency"
                                value={formData.currency}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                                disabled={isLoading}
                            >
                                <option value="USD">USD - US Dollar</option>
                                <option value="EUR">EUR - Euro</option>
                                <option value="GBP">GBP - British Pound</option>
                                <option value="PKR">PKR - Pakistani Rupee</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="text-sm font-medium">Timezone</label>
                            <select
                                name="timezone"
                                value={formData.timezone}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                                disabled={isLoading}
                            >
                                <option value="UTC">UTC</option>
                                <option value="America/New_York">America/New_York</option>
                                <option value="America/Los_Angeles">America/Los_Angeles</option>
                                <option value="Europe/London">Europe/London</option>
                                <option value="Asia/Karachi">Asia/Karachi</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* DESCRIPTION */}
                    <div>
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Description"
                            rows={4}
                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                            disabled={isLoading}
                        />
                    </div>
                    
                    {/* ADDRESS */}
                    <div>
                        <label className="text-sm font-medium">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="New, Street #3 Main road"
                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                            disabled={isLoading}
                        />
                    </div>
                    
                    {/* COUNTRY / CITY / STATE / POSTAL */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                            <label className="text-sm font-medium">Country</label>
                            <select
                                name="country_code"
                                value={formData.country_code}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                                disabled={isLoading}
                            >
                                <option value="US">United States</option>
                                <option value="UK">United Kingdom</option>
                                <option value="PK">Pakistan</option>
                                <option value="AE">UAE</option>
                                <option value="SA">Saudi Arabia</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="text-sm font-medium">City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="New York"
                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                                disabled={isLoading}
                            />
                        </div>
                        
                        <div>
                            <label className="text-sm font-medium">State</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                placeholder="NY"
                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                                disabled={isLoading}
                            />
                        </div>
                        
                        <div>
                            <label className="text-sm font-medium">Postal Code</label>
                            <input
                                type="text"
                                name="zip_code"
                                value={formData.zip_code}
                                onChange={handleChange}
                                placeholder="10001"
                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                    
                    {/* CONTACT INFO */}
                    <div>
                        <h3 className="text-sm font-semibold mb-2">Contact Info</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm font-medium">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="info@gmail.com"
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                                    disabled={isLoading}
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                            
                            <div>
                                <label className="text-sm font-medium">Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+1 234 567 8900"
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* SOCIAL MEDIA */}
                    <div>
                        <h3 className="text-sm font-semibold mb-2">Social Media</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm font-medium">Facebook URL</label>
                                <input
                                    type="url"
                                    name="facebook_url"
                                    value={formData.facebook_url}
                                    onChange={handleChange}
                                    placeholder="https://facebook.com/store"
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Instagram URL</label>
                                <input
                                    type="url"
                                    name="instagram_url"
                                    value={formData.instagram_url}
                                    onChange={handleChange}
                                    placeholder="https://instagram.com/store"
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Twitter URL</label>
                                <input
                                    type="url"
                                    name="twitter_url"
                                    value={formData.twitter_url}
                                    onChange={handleChange}
                                    placeholder="https://twitter.com/store"
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">WhatsApp Number</label>
                                <input
                                    type="text"
                                    name="whatsapp_number"
                                    value={formData.whatsapp_number}
                                    onChange={handleChange}
                                    placeholder="+1 234 567 8900"
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* STORE STATUS */}
                    <div>
                        <h3 className="text-sm font-semibold mb-2">Store Status</h3>
                        <div className="flex items-center gap-6">
                            {["active", "inactive", "pending"].map((status) => (
                                <label key={status} className="flex items-center gap-2 text-sm">
                                    <input
                                        type="radio"
                                        name="status"
                                        value={status}
                                        checked={formData.status === status}
                                        onChange={handleChange}
                                        className="accent-teal-500"
                                    />
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </label>
                            ))}
                        </div>
                    </div>
                    
                    {/* STORE LOGO & BANNER */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-semibold mb-2">Store Logo URL</h3>
                            <input
                                type="text"
                                name="logo"
                                value={formData.logo}
                                onChange={handleChange}
                                placeholder="https://example.com/logo.png"
                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                            />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold mb-2">Store Banner URL</h3>
                            <input
                                type="text"
                                name="banner"
                                value={formData.banner}
                                onChange={handleChange}
                                placeholder="https://example.com/banner.png"
                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                            />
                        </div>
                    </div>
                    
                    {/* SEO */}
                    <div>
                        <h3 className="text-sm font-semibold mb-2">SEO Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Meta Title</label>
                                <input
                                    type="text"
                                    name="meta_title"
                                    value={formData.meta_title}
                                    onChange={handleChange}
                                    placeholder="SEO Title"
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Meta Description</label>
                                <textarea
                                    name="meta_description"
                                    value={formData.meta_description}
                                    onChange={handleChange}
                                    placeholder="SEO Description"
                                    rows={3}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* STEP 1: Timings */}
            {currentStep === 1 && (
                <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
                    <StepProgress
                        currentStep={1}
                        steps={[
                            { label: "Store Info" },
                            { label: "Timings" },
                            { label: "Pick up" },
                        ]}
                    />
                    
                    {/* STORE AVAILABILITY */}
                    <div>
                        <h3 className="text-sm font-semibold mb-4">Store Availability</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm text-gray-700">Opening Time</label>
                                <input
                                    type="time"
                                    name="opening_time"
                                    value={formData.opening_time}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-700">Closing Time</label>
                                <input
                                    type="time"
                                    name="closing_time"
                                    value={formData.closing_time}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* BREAK TIME */}
                    <div>
                        <h3 className="text-sm font-semibold mb-4">Break Time (Optional)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm text-gray-700">Break From</label>
                                <input
                                    type="time"
                                    name="break_from"
                                    value={formData.break_from}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-700">Break To</label>
                                <input
                                    type="time"
                                    name="break_to"
                                    value={formData.break_to}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* STEP 2: Pickup */}
            {currentStep === 2 && (
                <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
                    <StepProgress
                        currentStep={2}
                        steps={[
                            { label: "Store Info" },
                            { label: "Timings" },
                            { label: "Pick up" },
                        ]}
                    />
                    
                    {/* PICK UP */}
                    <div>
                        <h3 className="text-sm font-semibold mb-3">Pickup Settings</h3>
                        
                        {/* TOGGLE */}
                        <div className="flex items-center gap-3 mb-4">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="pickup_available"
                                    checked={formData.pickup_available}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                            </label>
                            <span className="text-sm text-gray-700">Pickup Availability</span>
                        </div>
                        
                        {formData.pickup_available && (
                            <>
                                <div className="mb-4">
                                    <label className="text-sm text-gray-700">Pickup Point Name</label>
                                    <input
                                        type="text"
                                        name="pickup_point_name"
                                        value={formData.pickup_point_name}
                                        onChange={handleChange}
                                        placeholder="Main Pickup Point"
                                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <label className="text-sm text-gray-700">Pickup Address</label>
                                    <input
                                        type="text"
                                        name="pickup_address"
                                        value={formData.pickup_address}
                                        onChange={handleChange}
                                        placeholder="Pickup Address"
                                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                    
                    {/* AVAILABILITY DAYS */}
                    <div>
                        <h3 className="text-sm font-semibold mb-4">Availability Days</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-3">
                            <div>
                                <label className="text-sm text-gray-700">From Day</label>
                                <select
                                    name="availability_from_day"
                                    value={formData.availability_from_day}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                                >
                                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                                        <option key={day} value={day}>{day}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label className="text-sm text-gray-700">To Day</label>
                                <select
                                    name="availability_to_day"
                                    value={formData.availability_to_day}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                                >
                                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                                        <option key={day} value={day}>{day}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        {/* WHOLE WEEK */}
                        <div className="flex items-center gap-3">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="whole_week"
                                    checked={formData.whole_week}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                            </label>
                            <span className="text-sm text-gray-700">Whole Week</span>
                        </div>
                    </div>
                    
                    {/* AVAILABILITY TIME */}
                    <div>
                        <h3 className="text-sm font-semibold mb-4">Availability Time</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm text-gray-700">From Time</label>
                                <input
                                    type="time"
                                    name="availability_from_time"
                                    value={formData.availability_from_time}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-700">To Time</label>
                                <input
                                    type="time"
                                    name="availability_to_time"
                                    value={formData.availability_to_time}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* ADDITIONAL INFO */}
                    <div>
                        <label className="text-sm text-gray-700">Additional Information (Optional)</label>
                        <textarea
                            name="additional_info"
                            value={formData.additional_info}
                            onChange={handleChange}
                            placeholder="Additional Information"
                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400 min-h-[120px]"
                        />
                    </div>
                </div>
            )}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4 mt-6">
                {currentStep > 0 && (
                    <button
                        onClick={handlePrevious}
                        disabled={isLoading}
                        className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        Previous
                    </button>
                )}
                
                {currentStep < 2 ? (
                    <button
                        onClick={handleNext}
                        className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-teal-400 to-green-400 text-white hover:opacity-90 transition-opacity ml-auto"
                    >
                        Next
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-teal-400 to-green-400 text-white hover:opacity-90 transition-opacity disabled:opacity-50 ml-auto flex items-center gap-2"
                    >
                        {isLoading && (
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        )}
                        {isEditMode ? "Update Store" : "Create Store"}
                    </button>
                )}
            </div>
        </>
    );
};

export default CreateStore;