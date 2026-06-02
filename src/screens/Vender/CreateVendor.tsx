import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Loader2, Building, Mail, Phone, MapPin, Globe, CreditCard, Image, Server, AlertCircle, User, Users, Calendar, Hash, Briefcase, Lock } from "lucide-react";
import toast from "react-hot-toast";
import {
    useGetSingleVendorQuery,
    useCreateVendorMutation,
    useUpdateVendorMutation,
    useDeleteVendorMutation,
    useGetCountriesQuery,
    useGetPlansQuery
} from "../../app/api/VendorSlices/VendorApi";
import { ROUTES } from "../../router";
import SearchableSelect from "../../component/SearchableSelect";
interface VendorFormData {
    // User fields
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone: string | null;
    country_code: string;
    timezone: string;

    // Vendor fields
    company_name: string;
    company_slug: string;
    legal_name: string | null;
    trading_name: string | null;
    vat_number: string | null;
    registration_number: string | null;
    contact_email: string | null;
    website: string | null;
    address_line1: string | null;
    address_line2: string | null;
    city: string | null;
    postal_code: string | null;
    logo_url: string | null;
    banner_url: string | null;
    description: string | null;
    plan_id: number | null;
    plan_duration_months: number;
    commission_rate: number | null;
    commission_type: string;
    status: string;
    kyc_status: string;
    metadata: string | null;

    // Magento fields
    magento_base_url: string | null;
    magento_admin_username: string | null;
    magento_admin_pass: string | null;
    magento_access_token: string | null;
    magento_admin_token: string | null;
    magento_website_id: string | null;
    magento_store_group_id: string | null;
    magento_root_category_id: string | null;
}

interface FormErrors {
    company_name?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    password?: string;
    password_confirmation?: string;
    country_code?: string;
    plan_id?: string;
}

const CreateVendor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    // API Hooks
    const [createVendor, { isLoading: isCreating }] = useCreateVendorMutation();
    const [updateVendor, { isLoading: isUpdating }] = useUpdateVendorMutation();
    const [deleteVendor, { isLoading: isDeleting }] = useDeleteVendorMutation();
    const { data: countriesData, isLoading: isLoadingCountries } = useGetCountriesQuery();
    const { data: plans = [], isLoading: plansLoading } = useGetPlansQuery();

    const { data, isLoading: isLoadingVendor } = useGetSingleVendorQuery(id!, {
        skip: !isEditMode,
    });

    // Form State
    const [formData, setFormData] = useState<VendorFormData>({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password_confirmation: "",
        phone: null,
        country_code: "PK",
        timezone: "UTC",
        company_name: "",
        company_slug: "",
        legal_name: null,
        trading_name: null,
        vat_number: null,
        registration_number: null,
        contact_email: null,
        website: null,
        address_line1: null,
        address_line2: null,
        city: null,
        postal_code: null,
        logo_url: null,
        banner_url: null,
        description: null,
        plan_id: null,
        plan_duration_months: 12,
        commission_rate: null,
        commission_type: "percentage",
        status: "pending",
        kyc_status: "pending",
        metadata: null,
        magento_base_url: null,
        magento_admin_username: null,
        magento_admin_pass: null,
        magento_access_token: null,
        magento_admin_token: null,
        magento_website_id: null,
        magento_store_group_id: null,
        magento_root_category_id: null,
    });

    const [open, setOpen] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [errors, setErrors] = useState<FormErrors>({});

    // Prefill for edit mode
    useEffect(() => {
        if (data?.data && isEditMode) {
            const vendor = data.data;
            setFormData({
                first_name: vendor.user?.first_name || "",
                last_name: vendor.user?.last_name || "",
                email: vendor.user?.email || "",
                password: "",
                password_confirmation: "",
                phone: vendor.phone || null,
                country_code: vendor.country_code || "PK",
                timezone: vendor.timezone || "UTC",
                company_name: vendor.company_name || "",
                company_slug: vendor.company_slug || "",
                legal_name: vendor.legal_name || null,
                trading_name: vendor.trading_name || null,
                vat_number: vendor.vat_number || null,
                registration_number: vendor.registration_number || null,
                contact_email: vendor.contact_email || null,
                website: vendor.website || null,
                address_line1: vendor.address_line1 || null,
                address_line2: vendor.address_line2 || null,
                city: vendor.city || null,
                postal_code: vendor.postal_code || null,
                logo_url: vendor.logo_url || null,
                banner_url: vendor.banner_url || null,
                description: vendor.description || null,
                plan_id: vendor.plan?.id || null,
                plan_duration_months: vendor.plan_duration_months || 12,
                commission_rate: vendor.commission_rate || null,
                commission_type: vendor.commission_type || "percentage",
                status: vendor.status || "pending",
                kyc_status: vendor.kyc_status || "pending",
                metadata: vendor.metadata || null,
                magento_base_url: vendor.magento_base_url || null,
                magento_admin_username: vendor.magento_admin_username || null,
                magento_admin_pass: vendor.magento_admin_pass || null,
                magento_access_token: vendor.magento_access_token || null,
                magento_admin_token: vendor.magento_admin_token || null,
                magento_website_id: vendor.magento_website_id || null,
                magento_store_group_id: vendor.magento_store_group_id || null,
                magento_root_category_id: vendor.magento_root_category_id || null,
            });
        }
    }, [data, isEditMode]);

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value === "" ? null : value }));
        if (errors[name as keyof FormErrors]) {
            setErrors({ ...errors, [name]: undefined });
        }
    };

    const handleBlur = (field: string) => {
        setTouched({ ...touched, [field]: true });
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.company_name?.trim()) {
            newErrors.company_name = "Company name is required";
        }

        if (!formData.email?.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.first_name?.trim()) {
            newErrors.first_name = "First name is required";
        }

        if (!formData.last_name?.trim()) {
            newErrors.last_name = "Last name is required";
        }

        if (!isEditMode) {
            if (!formData.password) {
                newErrors.password = "Password is required";
            } else if (formData.password.length < 8) {
                newErrors.password = "Password must be at least 8 characters";
            } else if (formData.password !== formData.password_confirmation) {
                newErrors.password_confirmation = "Passwords do not match";
            }
        }

        if (!formData.country_code) {
            newErrors.country_code = "Country code is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const allFields = ['company_name', 'email', 'first_name', 'last_name', 'country_code'];
        const newTouched: Record<string, boolean> = {};
        allFields.forEach(field => { newTouched[field] = true; });
        setTouched(newTouched);

        if (!validateForm()) {
            const firstError = Object.values(errors)[0];
            if (firstError) {
                toast.error(firstError);
            }
            return;
        }

        if (isEditMode) {
            const updateData: any = { ...formData };
            if (!updateData.password) {
                delete updateData.password;
            }
            Object.keys(updateData).forEach(key => {
                if (updateData[key] === null) {
                    delete updateData[key];
                }
            });

            try {
                await updateVendor({ id: id!, data: updateData }).unwrap();
                toast.success("Vendor updated successfully!");
                navigate(ROUTES.VENDOR_LIST);
            } catch (err: any) {
                toast.error(err?.data?.message || "Failed to update vendor");
            }
        } else {
            try {
                const createData: any = { ...formData };
                Object.keys(createData).forEach(key => {
                    if (createData[key] === null) {
                        delete createData[key];
                    }
                });
                await createVendor(createData).unwrap();
                toast.success("Vendor created successfully!");
                navigate(ROUTES.VENDOR_LIST);
            } catch (err: any) {
                toast.error(err?.data?.message || "Failed to create vendor");
            }
        }
    };

    const handleDelete = async () => {
        try {
            await deleteVendor(id!).unwrap();
            toast.success("Vendor deleted successfully!");
            setOpen(false);
            navigate(ROUTES.VENDOR_LIST);
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to delete vendor");
        }
    };

    const getErrorClass = (field: string): string => {
        return errors[field as keyof FormErrors] && touched[field]
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:ring-blue-500';
    };

    if (isLoadingVendor) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex items-center gap-3 text-gray-600">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Loading vendor details...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(ROUTES.VENDOR_LIST)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Building className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {isEditMode ? 'Edit Vendor' : 'Add New Vendor'}
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    {isEditMode ? 'Update vendor information' : 'Create a new vendor account'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Building className="w-5 h-5 text-gray-500" />
                            Basic Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Company Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        name="company_name"
                                        value={formData.company_name}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('company_name')}
                                        placeholder="Enter company name"
                                        className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${getErrorClass('company_name')}`}
                                    />
                                </div>
                                {errors.company_name && touched.company_name && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.company_name}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Legal Name
                                </label>
                                <input
                                    type="text"
                                    name="legal_name"
                                    value={formData.legal_name || ""}
                                    onChange={handleChange}
                                    placeholder="Enter legal name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Trading Name
                                </label>
                                <input
                                    type="text"
                                    name="trading_name"
                                    value={formData.trading_name || ""}
                                    onChange={handleChange}
                                    placeholder="Enter trading name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Company Slug
                                </label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        name="company_slug"
                                        value={formData.company_slug}
                                        onChange={handleChange}
                                        placeholder="company-slug"
                                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">Optional - Auto-generated if empty</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    VAT Number
                                </label>
                                <input
                                    type="text"
                                    name="vat_number"
                                    value={formData.vat_number || ""}
                                    onChange={handleChange}
                                    placeholder="Enter VAT number"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Registration Number
                                </label>
                                <input
                                    type="text"
                                    name="registration_number"
                                    value={formData.registration_number || ""}
                                    onChange={handleChange}
                                    placeholder="Enter registration number"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-gray-500" />
                            Contact Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('first_name')}
                                    placeholder="Enter first name"
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${getErrorClass('first_name')}`}
                                />
                                {errors.first_name && touched.first_name && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.first_name}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('last_name')}
                                    placeholder="Enter last name"
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${getErrorClass('last_name')}`}
                                />
                                {errors.last_name && touched.last_name && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.last_name}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('email')}
                                        placeholder="Enter email address"
                                        className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${getErrorClass('email')}`}
                                    />
                                </div>
                                {errors.email && touched.email && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Contact Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="email"
                                        name="contact_email"
                                        value={formData.contact_email || ""}
                                        onChange={handleChange}
                                        placeholder="Enter contact email"
                                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone || ""}
                                        onChange={handleChange}
                                        placeholder="Enter phone number"
                                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Website
                                </label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="url"
                                        name="website"
                                        value={formData.website || ""}
                                        onChange={handleChange}
                                        placeholder="https://example.com"
                                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Country Code <span className="text-red-500">*</span>
                                </label>
                                <SearchableSelect
                                    options={
                                        countriesData?.data?.map((country: any) => ({
                                            value: country.phone_code,
                                            label: `${country.name} (+${country.phone_code})`,
                                        })) || []
                                    }
                                    value={formData.country_code}
                                    placeholder={isLoadingCountries ? "Loading countries..." : "Select Country"}
                                    onChange={(value) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            country_code: value,
                                        }));

                                        handleBlur('country_code');
                                    }}
                                />
                                {errors.country_code && touched.country_code && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.country_code}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Timezone
                                </label>
                                <SearchableSelect
                                    options={[
                                        { value: "UTC", label: "UTC" },
                                        { value: "America/New_York", label: "Eastern Time" },
                                        { value: "America/Chicago", label: "Central Time" },
                                        { value: "America/Denver", label: "Mountain Time" },
                                        { value: "America/Los_Angeles", label: "Pacific Time" },
                                        { value: "Asia/Dubai", label: "Dubai" },
                                        { value: "Asia/Karachi", label: "Karachi" },
                                        { value: "Asia/Riyadh", label: "Riyadh" },
                                        { value: "Europe/London", label: "London" },
                                    ]}
                                    value={formData.timezone}
                                    placeholder="Select Timezone"
                                    onChange={(value) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            timezone: value,
                                        }))
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Password Section (Only for create mode) */}
                    {!isEditMode && (
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Lock className="w-5 h-5 text-gray-500" />
                                Account Security
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            onBlur={() => handleBlur('password')}
                                            placeholder="Enter password (min 8 characters)"
                                            className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${getErrorClass('password')}`}
                                        />
                                    </div>
                                    {errors.password && touched.password && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.password}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm Password <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="password"
                                            name="password_confirmation"
                                            value={formData.password_confirmation}
                                            onChange={handleChange}
                                            onBlur={() => handleBlur('password_confirmation')}
                                            placeholder="Confirm your password"
                                            className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${getErrorClass('password_confirmation')}`}
                                        />
                                    </div>
                                    {errors.password_confirmation && touched.password_confirmation && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.password_confirmation}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Address Information */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-gray-500" />
                            Address Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Address Line 1
                                </label>
                                <input
                                    type="text"
                                    name="address_line1"
                                    value={formData.address_line1 || ""}
                                    onChange={handleChange}
                                    placeholder="Enter street address"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Address Line 2
                                </label>
                                <input
                                    type="text"
                                    name="address_line2"
                                    value={formData.address_line2 || ""}
                                    onChange={handleChange}
                                    placeholder="Apartment, suite, unit, etc."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    City
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city || ""}
                                    onChange={handleChange}
                                    placeholder="Enter city"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Postal Code
                                </label>
                                <input
                                    type="text"
                                    name="postal_code"
                                    value={formData.postal_code || ""}
                                    onChange={handleChange}
                                    placeholder="Enter postal code"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Plan & Commission */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-gray-500" />
                            Plan & Commission
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Select Plan
                                </label>
                                <SearchableSelect
                                    options={
                                        plans?.map((plan: any) => ({
                                            value: String(plan.id),
                                            label: `${plan.subscription_name} ($${plan.price})`,
                                        })) || []
                                    }
                                    value={String(formData.plan_id || "")}
                                    placeholder={plansLoading ? "Loading Plans..." : "Select a plan"}
                                    onChange={(value) =>
                                        handleChange({
                                            target: {
                                                name: "plan_id",
                                                value,
                                            },
                                        } as React.ChangeEvent<HTMLInputElement>)
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Plan Duration (Months)
                                </label>
                                <input
                                    type="number"
                                    name="plan_duration_months"
                                    value={formData.plan_duration_months}
                                    onChange={handleChange}
                                    min="1"
                                    max="36"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Commission Rate
                                </label>
                                <input
                                    type="number"
                                    name="commission_rate"
                                    value={formData.commission_rate || 0}
                                    onChange={handleChange}
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    placeholder="Enter commission rate"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Commission Type
                                </label>
                                <SearchableSelect
                                    options={[
                                        { value: "percentage", label: "Percentage" },
                                        { value: "fixed", label: "Fixed" },
                                    ]}
                                    value={formData.commission_type}
                                    placeholder="Select Commission Type"
                                    onChange={(value) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            commission_type: value,
                                        }))
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Media & Description */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Image className="w-5 h-5 text-gray-500" />
                            Media & Description
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Logo URL
                                </label>
                                <input
                                    type="url"
                                    name="logo_url"
                                    value={formData.logo_url || ""}
                                    onChange={handleChange}
                                    placeholder="https://example.com/logo.png"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Banner URL
                                </label>
                                <input
                                    type="url"
                                    name="banner_url"
                                    value={formData.banner_url || ""}
                                    onChange={handleChange}
                                    placeholder="https://example.com/banner.png"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    rows={4}
                                    value={formData.description || ""}
                                    onChange={handleChange}
                                    placeholder="Enter company description"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Magento Integration */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Server className="w-5 h-5 text-gray-500" />
                            Magento Integration (Optional)
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Magento Base URL
                                </label>
                                <input
                                    type="url"
                                    name="magento_base_url"
                                    value={formData.magento_base_url || ""}
                                    onChange={handleChange}
                                    placeholder="https://magento-store.com"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Magento Admin Username
                                </label>
                                <input
                                    type="text"
                                    name="magento_admin_username"
                                    value={formData.magento_admin_username || ""}
                                    onChange={handleChange}
                                    placeholder="Enter admin username"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Magento Admin Password
                                </label>
                                <input
                                    type="password"
                                    name="magento_admin_pass"
                                    value={formData.magento_admin_pass || ""}
                                    onChange={handleChange}
                                    placeholder="Enter admin password"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Magento Access Token
                                </label>
                                <input
                                    type="text"
                                    name="magento_access_token"
                                    value={formData.magento_access_token || ""}
                                    onChange={handleChange}
                                    placeholder="Enter access token"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Magento Website ID
                                </label>
                                <input
                                    type="number"
                                    name="magento_website_id"
                                    value={formData.magento_website_id || ""}
                                    onChange={handleChange}
                                    placeholder="Enter website ID"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Magento Store Group ID
                                </label>
                                <input
                                    type="number"
                                    name="magento_store_group_id"
                                    value={formData.magento_store_group_id || ""}
                                    onChange={handleChange}
                                    placeholder="Enter store group ID"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Magento Root Category ID
                                </label>
                                <input
                                    type="number"
                                    name="magento_root_category_id"
                                    value={formData.magento_root_category_id || ""}
                                    onChange={handleChange}
                                    placeholder="Enter root category ID"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-gray-500" />
                            Status
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-3">Vendor Status</p>
                                <div className="flex flex-wrap gap-4">
                                    {["active", "pending", "suspended", "terminated"].map((item) => (
                                        <label key={item} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="status"
                                                value={item}
                                                checked={formData.status === item}
                                                onChange={handleChange}
                                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                            />
                                            <span className="capitalize text-sm text-gray-700">{item}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-3">KYC Status</p>
                                <div className="flex flex-wrap gap-4">
                                    {["pending", "verified", "rejected"].map((item) => (
                                        <label key={item} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="kyc_status"
                                                value={item}
                                                checked={formData.kyc_status === item}
                                                onChange={handleChange}
                                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                            />
                                            <span className="capitalize text-sm text-gray-700">{item}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => navigate(ROUTES.VENDOR_LIST)}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isCreating || isUpdating}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {(isCreating || isUpdating) ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            {isEditMode ? 'Update Vendor' : 'Create Vendor'}
                        </button>
                        {isEditMode && (
                            <button
                                type="button"
                                onClick={() => setOpen(true)}
                                disabled={isDeleting}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertCircle className="w-4 h-4" />}
                                Delete Vendor
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* DELETE MODAL */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="w-[400px] rounded-xl bg-white shadow-xl relative transform transition-all">
                        <div className="relative">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-red-500 rounded-t-xl" />
                            <button
                                onClick={() => setOpen(false)}
                                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                            <div className="text-center pt-8 pb-4">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                                    <AlertCircle className="w-8 h-8 text-red-500" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Delete Vendor
                                </h2>
                                <p className="text-sm text-gray-500 mt-2">
                                    Are you sure you want to delete <span className="font-medium text-gray-700">{formData.company_name}</span>?
                                    <br />
                                    This action cannot be undone.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 p-6 pt-0">
                            <button
                                onClick={() => setOpen(false)}
                                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                                {isDeleting ? "Deleting..." : "Yes, Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateVendor;