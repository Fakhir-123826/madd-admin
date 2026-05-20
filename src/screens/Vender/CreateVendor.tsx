import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    useGetSingleVendorQuery,
    useCreateVendorMutation,
    useUpdateVendorMutation,
    useDeleteVendorMutation,
    useGetCountriesQuery,
    useGetPlansQuery
} from "../../app/api/VendorSlices/VendorApi";
import { ROUTES } from "../../router";

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

    // Prefill for edit mode
    useEffect(() => {
        if (data?.data && isEditMode) {
            const vendor = data.data;
            setFormData({
                first_name: vendor.user?.first_name || "",
                last_name: vendor.user?.last_name || "",
                email: vendor.user?.email || "",
                password: "",
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
    };

    // Handle submit
    const handleSubmit = async () => {
        if (isEditMode) {
            // Update mode - send all fields
            const updateData: any = { ...formData };

            // Remove password if empty (don't update password if not provided)
            if (!updateData.password) {
                delete updateData.password;
            }

            // Remove null values or keep them based on backend expectations
            Object.keys(updateData).forEach(key => {
                if (updateData[key] === null) {
                    delete updateData[key];
                }
            });

            try {
                await updateVendor({
                    id: id!,
                    data: updateData
                }).unwrap();
                alert("Vendor updated successfully!");
                navigate('/vendors');
            } catch (err: any) {
                alert(err?.data?.message || "Failed to update vendor");
            }
        } else {
            // Create mode
            if (!formData.password) {
                alert("Password is required");
                return;
            }

            if (!formData.company_name) {
                alert("Company name is required");
                return;
            }

            if (formData.password !== formData.password_confirmation) {
                alert("Passwords do not match");
                return;
            }

            if (formData.password.length < 8) {
                alert("Password must be at least 8 characters long");
                return;
            }

            if (!formData.email) {
                alert("Email is required");
                return;
            }

            if (!formData.first_name || !formData.last_name) {
                alert("First name and last name are required");
                return;
            }

            try {
                // Prepare data for creation - remove null values
                const createData: any = { ...formData };
                Object.keys(createData).forEach(key => {
                    if (createData[key] === null) {
                        delete createData[key];
                    }
                });

                await createVendor(createData).unwrap();
                alert("Vendor created successfully!");
                navigate('/vendors');
            } catch (err: any) {
                alert(err?.data?.message || "Failed to create vendor");
            }
        }
    };

    // Handle delete
    const handleDelete = async () => {
        try {
            await deleteVendor(id!).unwrap();
            alert("Vendor deleted successfully!");
            setOpen(false);
            navigate('/vendors');
        } catch (err: any) {
            alert(err?.data?.message || "Failed to delete vendor");
        }
    };

    if (isLoadingVendor) {
        return <div className="p-10 text-center">Loading vendor details...</div>;
    }

    return (
        <div className="bg-white shadow-sm p-6 ">
            {/* HEADER WITH BACK BUTTON */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(ROUTES.VENDOR_LIST)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        ← Back
                    </button>
                    <h2 className="text-lg font-semibold">
                        {isEditMode ? "Update Vendor" : "Create Vendor"}
                    </h2>
                </div>
            </div>

            {/* FORM */}
            <div className="space-y-6">
                {/* Section 1: Basic Information */}
                <div className="relative">
                    <div className="absolute top-0 left-0 w-1 h-8 bg-gradient-to-b from-teal-400 to-green-400 rounded-r-full" />
                    <h2 className="text-sm font-semibold pl-4">Basic Information</h2>
                </div>

                {/* COMPANY NAME */}
                <div>
                    <label className="text-xs font-medium text-gray-700">
                        Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleChange}
                        placeholder="Enter company name"
                        className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
                    />
                </div>

                {/* COMPANY SLUG */}
                <div>
                    <label className="text-xs font-medium text-gray-700">
                        Company Slug <span className="text-gray-400 text-xs">(Optional - Auto-generated if empty)</span>
                    </label>
                    <input
                        type="text"
                        name="company_slug"
                        value={formData.company_slug}
                        onChange={handleChange}
                        placeholder="company-slug"
                        className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
                    />
                </div>

                {/* LEGAL NAME + TRADING NAME */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-medium text-gray-700">
                            Legal Name
                        </label>
                        <input
                            type="text"
                            name="legal_name"
                            value={formData.legal_name || ""}
                            onChange={handleChange}
                            placeholder="Enter legal name"
                            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-700">
                            Trading Name
                        </label>
                        <input
                            type="text"
                            name="trading_name"
                            value={formData.trading_name || ""}
                            onChange={handleChange}
                            placeholder="Enter trading name"
                            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
                        />
                    </div>
                </div>

                {/* VAT NUMBER + REGISTRATION NUMBER */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-medium text-gray-700">
                            VAT Number
                        </label>
                        <input
                            type="text"
                            name="vat_number"
                            value={formData.vat_number || ""}
                            onChange={handleChange}
                            placeholder="Enter VAT number"
                            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-700">
                            Registration Number
                        </label>
                        <input
                            type="text"
                            name="registration_number"
                            value={formData.registration_number || ""}
                            onChange={handleChange}
                            placeholder="Enter registration number"
                            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
                        />
                    </div>
                </div>

                {/* Section 2: Contact Information */}
                <div className="relative mt-8">
                    <div className="absolute top-0 left-0 w-1 h-8 bg-gradient-to-b from-teal-400 to-green-400 rounded-r-full" />
                    <h2 className="text-sm font-semibold pl-4">Contact Information</h2>
                </div>

                {/* FIRST NAME + LAST NAME */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-medium text-gray-700">
                            First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            placeholder="Enter first name"
                            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-700">
                            Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            placeholder="Enter last name"
                            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
                        />
                    </div>
                </div>

                {/* EMAIL + CONTACT EMAIL */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-medium text-gray-700">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email address"
                            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-700">
                            Contact Email
                        </label>
                        <input
                            type="email"
                            name="contact_email"
                            value={formData.contact_email || ""}
                            onChange={handleChange}
                            placeholder="Enter contact email"
                            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
                        />
                    </div>
                </div>

                {/* PHONE + WEBSITE */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-medium text-gray-700">
                            Phone Number
                        </label>
                        <input
                            type="phone"
                            name="phone"
                            value={formData.phone || ""}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-700">
                            Website
                        </label>
                        <input
                            type="url"
                            name="website"
                            value={formData.website || ""}
                            onChange={handleChange}
                            placeholder="https://example.com"
                            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
                        />
                    </div>
                </div>

                {/* COUNTRY CODE + TIMEZONE */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-medium text-gray-700">
                            Country Code <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="country_code"
                            value={formData.country_code}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all appearance-none bg-white"
                        >
                            <option value="">
                                {isLoadingCountries ? "Loading countries..." : "Select Country"}
                            </option>

                            {countriesData?.data?.map((country: any) => (
                                <option
                                    key={country.id}
                                    value={country.phone_code}
                                >
                                    {`${country.name} (+${country.phone_code})`}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-700">
                            Timezone
                        </label>
                        <select
                            name="timezone"
                            value={formData.timezone}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all appearance-none bg-white"
                        >
                            <option value="UTC">UTC</option>
                            <option value="America/New_York">Eastern Time</option>
                            <option value="America/Chicago">Central Time</option>
                            <option value="America/Denver">Mountain Time</option>
                            <option value="America/Los_Angeles">Pacific Time</option>
                            <option value="Asia/Dubai">Dubai</option>
                            <option value="Asia/Karachi">Karachi</option>
                            <option value="Asia/Riyadh">Riyadh</option>
                            <option value="Europe/London">London</option>
                        </select>
                    </div>
                </div>

                {/* PASSWORD (Only for create mode) */}
                {!isEditMode && (
                    <>
                        <div>
                            <label className="text-xs font-medium text-gray-700">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter password (min 8 characters)"
                                className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
                            />
                        </div>

                        {/* Add Password Confirmation Field Here */}
                        <div>
                            <label className="text-xs font-medium text-gray-700">
                                Confirm Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                name="password_confirmation"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
                            />
                        </div>
                    </>
                )}

                {/* Section 3: Address Information */}
                <div className="relative mt-8">
                    <div className="absolute top-0 left-0 w-1 h-8 bg-gradient-to-b from-teal-400 to-green-400 rounded-r-full" />
                    <h2 className="text-sm font-semibold pl-4">Address Information</h2>
                </div>

                {/* ADDRESS LINE 1 + LINE 2 */}
                <div>
                    <label className="text-xs font-medium text-gray-700">
                        Address Line 1
                    </label>
                    <input
                        type="text"
                        name="address_line1"
                        value={formData.address_line1 || ""}
                        onChange={handleChange}
                        placeholder="Enter street address"
                        className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
                    />
                </div>

                <div>
                    <label className="text-xs font-medium text-gray-700">
                        Address Line 2
                    </label>
                    <input
                        type="text"
                        name="address_line2"
                        value={formData.address_line2 || ""}
                        onChange={handleChange}
                        placeholder="Apartment, suite, unit, etc."
                        className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
                    />
                </div>

                {/* CITY + POSTAL CODE */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-medium text-gray-700">
                            City
                        </label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city || ""}
                            onChange={handleChange}
                            placeholder="Enter city"
                            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-700">
                            Postal Code
                        </label>
                        <input
                            type="text"
                            name="postal_code"
                            value={formData.postal_code || ""}
                            onChange={handleChange}
                            placeholder="Enter postal code"
                            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
                        />
                    </div>
                </div>

                {/* Section 4: Plan & Commission */}
                <div className="relative mt-8">
                    <div className="absolute top-0 left-0 w-1 h-8 bg-gradient-to-b from-teal-400 to-green-400 rounded-r-full" />
                    <h2 className="text-sm font-semibold pl-4">Plan & Commission</h2>
                </div>

                {/* PLAN ID + DURATION */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-medium text-gray-700">
                            Select Plan
                        </label>
                        <select
                            name="plan_id"
                            value={formData.plan_id || 0}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all appearance-none bg-white"
                        >
                            {plansLoading ? (
                                <option disabled>Loading Plans...</option>
                            ) : (
                                plans.map((plan: any) => (
                                    <option key={plan.id} value={plan.id}>
                                        {plan.subscription_name} (${plan.price})
                                    </option>
                                ))
                            )}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-700">
                            Plan Duration (Months)
                        </label>
                        <input
                            type="number"
                            name="plan_duration_months"
                            value={formData.plan_duration_months}
                            onChange={handleChange}
                            min="1"
                            max="36"
                            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
                        />
                    </div>
                </div>

                {/* COMMISSION RATE + TYPE */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-medium text-gray-700">
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
                            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-700">
                            Commission Type
                        </label>
                        <select
                            name="commission_type"
                            value={formData.commission_type}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all appearance-none bg-white"
                        >
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed</option>
                        </select>
                    </div>
                </div>

                {/* Section 5: Media & Description */}
                <div className="relative mt-8">
                    <div className="absolute top-0 left-0 w-1 h-8 bg-gradient-to-b from-teal-400 to-green-400 rounded-r-full" />
                    <h2 className="text-sm font-semibold pl-4">Media & Description</h2>
                </div>

                {/* LOGO URL + BANNER URL */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-medium text-gray-700">
                            Logo URL
                        </label>
                        <input
                            type="url"
                            name="logo_url"
                            value={formData.logo_url || ""}
                            onChange={handleChange}
                            placeholder="https://example.com/logo.png"
                            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-700">
                            Banner URL
                        </label>
                        <input
                            type="url"
                            name="banner_url"
                            value={formData.banner_url || ""}
                            onChange={handleChange}
                            placeholder="https://example.com/banner.png"
                            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
                        />
                    </div>
                </div>

                {/* DESCRIPTION */}
                <div>
                    <label className="text-xs font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        rows={4}
                        value={formData.description || ""}
                        onChange={handleChange}
                        placeholder="Enter company description"
                        className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all resize-none"
                    />
                </div>

                {/* Section 6: Magento Integration */}
                <div className="relative mt-8">
                    <div className="absolute top-0 left-0 w-1 h-8 bg-gradient-to-b from-teal-400 to-green-400 rounded-r-full" />
                    <h2 className="text-sm font-semibold pl-4">Magento Integration (Optional)</h2>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-medium text-gray-700">
                            Magento Base URL
                        </label>
                        <input
                            type="url"
                            name="magento_base_url"
                            value={formData.magento_base_url || ""}
                            onChange={handleChange}
                            placeholder="https://magento-store.com"
                            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-700">
                            Magento Admin Username
                        </label>
                        <input
                            type="text"
                            name="magento_admin_username"
                            value={formData.magento_admin_username || ""}
                            onChange={handleChange}
                            placeholder="Enter admin username"
                            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-700">
                            Magento Admin Password
                        </label>
                        <input
                            type="password"
                            name="magento_admin_pass"
                            value={formData.magento_admin_pass || ""}
                            onChange={handleChange}
                            placeholder="Enter admin password"
                            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-700">
                            Magento Access Token
                        </label>
                        <input
                            type="text"
                            name="magento_access_token"
                            value={formData.magento_access_token || ""}
                            onChange={handleChange}
                            placeholder="Enter access token"
                            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-700">
                            Magento Website ID
                        </label>
                        <input
                            type="number"
                            name="magento_website_id"
                            value={formData.magento_website_id || ""}
                            onChange={handleChange}
                            placeholder="Enter website ID"
                            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-700">
                            Magento Store Group ID
                        </label>
                        <input
                            type="number"
                            name="magento_store_group_id"
                            value={formData.magento_store_group_id || ""}
                            onChange={handleChange}
                            placeholder="Enter store group ID"
                            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-700">
                            Magento Root Category ID
                        </label>
                        <input
                            type="number"
                            name="magento_root_category_id"
                            value={formData.magento_root_category_id || ""}
                            onChange={handleChange}
                            placeholder="Enter root category ID"
                            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
                        />
                    </div>
                </div>

                {/* Section 7: Status */}
                <div className="relative mt-8">
                    <div className="absolute top-0 left-0 w-1 h-8 bg-gradient-to-b from-teal-400 to-green-400 rounded-r-full" />
                    <h2 className="text-sm font-semibold pl-4">Status</h2>
                </div>

                <div className="grid grid-cols-2 gap-16">
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-3">Vendor Status</p>
                        <div className="flex gap-6">
                            {["active", "pending", "suspended", "terminated"].map((item) => (
                                <label key={item} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value={item}
                                        checked={formData.status === item}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-teal-500 focus:ring-teal-400 focus:ring-offset-0"
                                    />
                                    <span className="capitalize text-sm text-gray-600">{item}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-3">KYC Status</p>
                        <div className="flex gap-6">
                            {["pending", "verified", "rejected"].map((item) => (
                                <label key={item} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="kyc_status"
                                        value={item}
                                        checked={formData.kyc_status === item}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-teal-500 focus:ring-teal-400 focus:ring-offset-0"
                                    />
                                    <span className="capitalize text-sm text-gray-600">{item}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                    <button
                        onClick={() => navigate('/vendors')}
                        className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isCreating || isUpdating}
                        className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-teal-400 to-green-400 text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {isCreating || isUpdating
                            ? (isEditMode ? "Updating..." : "Creating...")
                            : (isEditMode ? "Update Vendor" : "Create Vendor")}
                    </button>

                    {isEditMode && (
                        <button
                            onClick={() => setOpen(true)}
                            disabled={isDeleting}
                            className="px-6 py-2.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                            {isDeleting ? "Deleting..." : "Delete Vendor"}
                        </button>
                    )}
                </div>
            </div>

            {/* DELETE MODAL */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
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
                                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
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