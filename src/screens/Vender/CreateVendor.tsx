import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AddButton from "../../component/AddButton";
import {
    useGetSingleVendorQuery,
    useCreateVendorMutation,
    useUpdateVendorPlanMutation
} from "../../app/api/VendorSlices/VendorApi";

interface VendorFormData {
    // User fields
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone: string;
    country_code: string;

    // Vendor fields
    company_name: string;
    company_slug: string;
    description: string;
    plan_id: number;
    status: string;
}

const CreateVendor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    // API Hooks
    const [createVendor, { isLoading: isCreating }] = useCreateVendorMutation();
    const [updateVendorPlan, { isLoading: isUpdating }] = useUpdateVendorPlanMutation();
    const { data, isLoading: isLoadingVendor } = useGetSingleVendorQuery(id!, {
        skip: !isEditMode,
    });

    // Form State
    const [formData, setFormData] = useState<VendorFormData>({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        phone: "",
        country_code: "PK",
        company_name: "",
        company_slug: "",
        description: "",
        plan_id: 0,
        status: "pending",
    });

    const [planStatus, setPlanStatus] = useState("active");
    const [open, setOpen] = useState(false);

    // Prefill for edit mode
    useEffect(() => {
        if (data?.data && isEditMode) {
            const vendor = data.data;
            setFormData({
                first_name: vendor.user?.first_name || "",
                last_name: vendor.user?.last_name || "",
                email: vendor.contact?.email || "",
                password: "",
                phone: vendor.contact?.phone || "",
                country_code: vendor.country_code || "PK",
                company_name: vendor.company_name || "",
                company_slug: vendor.company_slug || "",
                description: vendor.description || "",
                plan_id: vendor.plan?.id || 0,
                status: vendor.status || "pending",
            });
            setPlanStatus(vendor.plan?.is_expired ? "inactive" : "active");
        }
    }, [data, isEditMode]);

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle submit
    const handleSubmit = async () => {
        if (isEditMode) {
            // Update mode - call update plan API
            if (formData.plan_id) {
                try {
                    await updateVendorPlan({
                        id: id!,
                        data: {
                            plan_id: formData.plan_id,
                            duration_months: 12
                        }
                    }).unwrap();
                    alert("Vendor plan updated successfully!");
                    navigate('/vendors');
                } catch (err: any) {
                    alert(err?.data?.message || "Failed to update vendor plan");
                }
            }
        } else {
            // Create mode
            if (!formData.password) {
                alert("Password is required");
                return;
            }

            try {
                await createVendor({
                    user_id: 1,
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone,
                    country_code: formData.country_code,
                    company_name: formData.company_name,
                    company_slug: formData.company_slug,
                    description: formData.description,
                    plan_id: formData.plan_id,
                    status: formData.status,
                }).unwrap();
                alert("Vendor created successfully!");
                navigate('/vendors');
            } catch (err: any) {
                alert(err?.data?.message || "Failed to create vendor");
            }
        }
    };

    // Handle delete (to be implemented)
    const handleDelete = () => {
        console.log("Delete vendor:", id);
        setOpen(false);
    };

    if (isLoadingVendor) {
        return <div className="p-10 text-center">Loading vendor details...</div>;
    }

    return (
        <div className="bg-white shadow-sm p-6 rounded-xl">
            {/* HEADER WITH BACK BUTTON */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/Vendor')}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        ←
                    </button>
                    <h2 className="text-lg font-semibold">
                        {isEditMode ? "Update Vendor" : "Create Vendor"}
                    </h2>
                </div>
                {!isEditMode && (
                    // <Link to="/CreateStore">
                    //     <button className="px-5 py-2 rounded-lg bg-gradient-to-r from-teal-400 to-green-400 text-white hover:opacity-90 transition-opacity">
                    //         Add New Store
                    //     </button>
                    // </Link>
                    <button onClick={handleSubmit} className="px-5 py-2 rounded-lg bg-gradient-to-r from-teal-400 to-green-400 text-white hover:opacity-90 transition-opacity">
                        Add New Store
                    </button>
                )}
            </div>

            {/* FORM */}
            <div className="space-y-6">
                {/* Section Header */}
                <div className="relative">
                    <div className="absolute top-0 left-0 w-1 h-8 bg-gradient-to-b from-teal-400 to-green-400 rounded-r-full" />
                    <h2 className="text-sm font-semibold pl-4">Vendor Info</h2>
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

                {/* EMAIL + PHONE */}
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
                            Phone Number
                        </label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
                        />
                    </div>
                </div>

                {/* PASSWORD (Only for create mode) */}
                {!isEditMode && (
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
                )}

                {/* COUNTRY CODE */}
                <div>
                    <label className="text-xs font-medium text-gray-700">
                        Country Code <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="country_code"
                        value={formData.country_code}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all appearance-none bg-white"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 1rem center',
                            backgroundSize: '1.25rem',
                        }}
                    >
                        <option value="PK">Pakistan (PK)</option>
                        <option value="US">United States (US)</option>
                        <option value="UK">United Kingdom (UK)</option>
                        <option value="AE">UAE (AE)</option>
                        <option value="SA">Saudi Arabia (SA)</option>
                    </select>
                </div>

                {/* COMPANY SLUG */}
                <div>
                    <label className="text-xs font-medium text-gray-700">
                        Company Slug <span className="text-gray-400 text-xs">(Optional)</span>
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

                {/* PLAN */}
                <div>
                    <label className="text-xs font-medium text-gray-700">
                        Select Plan
                    </label>
                    <select
                        name="plan_id"
                        value={formData.plan_id}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all appearance-none bg-white"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 1rem center',
                            backgroundSize: '1.25rem',
                        }}
                    >
                        <option value="0">Select Plan</option>
                        <option value="1">Basic</option>
                        <option value="2">Premium</option>
                        <option value="3">Enterprise</option>
                    </select>
                </div>

                {/* DESCRIPTION */}
                <div>
                    <label className="text-xs font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter description"
                        className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all resize-none"
                    />
                </div>

                {/* STATUS RADIOS */}
                <div className="grid grid-cols-2 gap-16">
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-3">Status</p>
                        <div className="flex gap-6">
                            {["active", "inactive", "pending"].map((item) => (
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

                    {/* PLAN STATUS (Edit mode only) */}
                    {isEditMode && (
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-3">Plan Status</p>
                            <div className="flex gap-6">
                                {["active", "inactive"].map((item) => (
                                    <label key={item} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="planStatus"
                                            checked={planStatus === item}
                                            onChange={() => setPlanStatus(item)}
                                            className="w-4 h-4 text-teal-500 focus:ring-teal-400 focus:ring-offset-0"
                                        />
                                        <span className="capitalize text-sm text-gray-600">{item}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
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
                            className="px-6 py-2.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                        >
                            Delete Vendor
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
                                className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition-colors"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateVendor;