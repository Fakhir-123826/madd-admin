// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import AddButton from "../../component/AddButton";
// import { useGetSingleVendorQuery } from "../../app/api/VendorSlices/VendorApi";

// const CreateVendor = () => {
//     const { id } = useParams();
//     const isEditMode = !!id;

//     /*
//     =====================================
//     STATES
//     =====================================
//     */
//     const [vendorName, setVendorName] = useState("");
//     const [email, setEmail] = useState("");
//     const [phone, setPhone] = useState("");
//     const [storeName, setStoreName] = useState("");
//     const [storeUrl, setStoreUrl] = useState("");
//     const [selectedPlan, setSelectedPlan] = useState("");
//     const [description, setDescription] = useState("");
//     const [planStatus, setPlanStatus] = useState("");
//     const [status, setStatus] = useState("");
//     const [open, setOpen] = useState(false);

//     /*
//     =====================================
//     GET SINGLE VENDOR (ONLY EDIT MODE)
//     =====================================
//     */
//     const vendorId = id ? Number(id) : undefined;

//     const { data, isLoading } = useGetSingleVendorQuery(vendorId!, {
//         skip: !vendorId,
//     });
//     /*
//     =====================================
//     PREFILL FORM FOR EDIT MODE
//     =====================================
//     */
//     useEffect(() => {
//         if (data?.data && isEditMode) {
//             const vendor = data.data;

//             setVendorName(vendor.company_name || "");
//             setEmail(vendor.contact?.email || "");
//             setPhone(vendor.contact?.phone || "");
//             setStoreName(vendor.stores?.[0]?.name || "");
//             setStoreUrl(vendor.stores?.[0]?.url || "");
//             setSelectedPlan(vendor.plan?.name || "");
//             setDescription(vendor.description || "");
//             setStatus(vendor.status || "");
//             setPlanStatus(
//                 vendor.plan?.is_expired ? "inactive" : "active"
//             );
//         }
//     }, [data, isEditMode]);

//     /*
//     =====================================
//     SUBMIT HANDLER
//     =====================================
//     */
//     const handleSubmit = () => {
//         const payload = {
//             vendorName,
//             email,
//             phone,
//             storeName,
//             storeUrl,
//             selectedPlan,
//             description,
//             status,
//             planStatus,
//         };

//         console.log(
//             isEditMode ? "UPDATE VENDOR" : "CREATE VENDOR",
//             payload
//         );
//     };

//     if (isLoading) {
//         return (
//             <div className="p-10 text-center">
//                 Loading vendor details...
//             </div>
//         );
//     }

//     return (
//         <div>
//             {/* HEADER */}
//             <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-lg font-semibold">
//                     {isEditMode
//                         ? "Update Vendor"
//                         : "Create Vendor"}
//                 </h2>

//                 <AddButton
//                     label="Add New Store"
//                     type="button"
//                     onClick={() =>
//                         console.log("Add Store Clicked")
//                     }
//                 />
//             </div>

//             {/* FORM */}
//             <div className="bg-white p-6 px-10 rounded-xl space-y-6">
//                 <h2 className="text-sm font-semibold">
//                     Vendor Info
//                 </h2>

//                 {/* VENDOR NAME */}
//                 <div>
//                     <label className="text-xs font-medium">
//                         Vendor Name
//                     </label>
//                     <input
//                         type="text"
//                         value={vendorName}
//                         onChange={(e) =>
//                             setVendorName(e.target.value)
//                         }
//                         placeholder="Vendor Name"
//                         className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
//                     />
//                 </div>

//                 {/* EMAIL + PHONE */}
//                 <div className="grid grid-cols-2 gap-6">
//                     <div>
//                         <label className="text-xs font-medium">
//                             Enter Email
//                         </label>
//                         <input
//                             type="email"
//                             value={email}
//                             onChange={(e) =>
//                                 setEmail(e.target.value)
//                             }
//                             placeholder="Enter Email"
//                             className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
//                         />
//                     </div>

//                     <div>
//                         <label className="text-xs font-medium">
//                             Enter Phone Number
//                         </label>
//                         <input
//                             type="text"
//                             value={phone}
//                             onChange={(e) =>
//                                 setPhone(e.target.value)
//                             }
//                             placeholder="Enter Phone Number"
//                             className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
//                         />
//                     </div>
//                 </div>

//                 {/* STORE NAME + URL */}
//                 <div className="grid grid-cols-2 gap-6">
//                     <div>
//                         <label className="text-xs font-medium">
//                             Store Name (Optional)
//                         </label>
//                         <input
//                             type="text"
//                             value={storeName}
//                             onChange={(e) =>
//                                 setStoreName(e.target.value)
//                             }
//                             placeholder="Store Name"
//                             className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
//                         />
//                     </div>

//                     <div>
//                         <label className="text-xs font-medium">
//                             Store URL (Optional)
//                         </label>
//                         <input
//                             type="text"
//                             value={storeUrl}
//                             onChange={(e) =>
//                                 setStoreUrl(e.target.value)
//                             }
//                             placeholder="Store URL"
//                             className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
//                         />
//                     </div>
//                 </div>

//                 {/* PLAN */}
//                 <div>
//                     <label className="text-xs font-medium">
//                         Select Plan
//                     </label>
//                     <select
//                         value={selectedPlan}
//                         onChange={(e) =>
//                             setSelectedPlan(
//                                 e.target.value
//                             )
//                         }
//                         className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
//                     >
//                         <option value="">
//                             Select Plan
//                         </option>
//                         <option value="Basic">
//                             Basic
//                         </option>
//                         <option value="Premium">
//                             Premium
//                         </option>
//                         <option value="Enterprise">
//                             Enterprise
//                         </option>
//                     </select>
//                 </div>

//                 {/* DESCRIPTION */}
//                 <div>
//                     <label className="text-xs font-medium">
//                         Description
//                     </label>
//                     <textarea
//                         rows={4}
//                         value={description}
//                         onChange={(e) =>
//                             setDescription(
//                                 e.target.value
//                             )
//                         }
//                         placeholder="Description"
//                         className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
//                     />
//                 </div>

//                 {/* STATUS */}
//                 <div className="grid grid-cols-2 gap-16">
//                     <div>
//                         <p className="text-sm font-medium mb-3">
//                             Status
//                         </p>

//                         <div className="flex gap-6">
//                             {["active", "inactive"].map(
//                                 (item) => (
//                                     <label
//                                         key={item}
//                                         className="flex items-center gap-2 cursor-pointer"
//                                     >
//                                         <input
//                                             type="checkbox"
//                                             className="sr-only"
//                                             checked={
//                                                 status ===
//                                                 item
//                                             }
//                                             onChange={() =>
//                                                 setStatus(
//                                                     item
//                                                 )
//                                             }
//                                         />

//                                         <div
//                                             className={`w-10 h-5 rounded-full relative ${status ===
//                                                 item
//                                                 ? "bg-blue-500"
//                                                 : "bg-gray-300"
//                                                 }`}
//                                         >
//                                             <span
//                                                 className={`absolute top-0.5 h-4 w-4 bg-white rounded-full transition ${status ===
//                                                     item
//                                                     ? "left-5"
//                                                     : "left-0.5"
//                                                     }`}
//                                             />
//                                         </div>

//                                         {item}
//                                     </label>
//                                 )
//                             )}
//                         </div>
//                     </div>

//                     {/* PLAN STATUS */}
//                     <div>
//                         <p className="text-sm font-medium mb-3">
//                             Plan Status
//                         </p>

//                         <div className="flex gap-6">
//                             {["active", "inactive"].map(
//                                 (item) => (
//                                     <label
//                                         key={item}
//                                         className="flex items-center gap-2 cursor-pointer"
//                                     >
//                                         <input
//                                             type="checkbox"
//                                             className="sr-only"
//                                             checked={
//                                                 planStatus ===
//                                                 item
//                                             }
//                                             onChange={() =>
//                                                 setPlanStatus(
//                                                     item
//                                                 )
//                                             }
//                                         />

//                                         <div
//                                             className={`w-10 h-5 rounded-full relative ${planStatus ===
//                                                 item
//                                                 ? "bg-blue-500"
//                                                 : "bg-gray-300"
//                                                 }`}
//                                         >
//                                             <span
//                                                 className={`absolute top-0.5 h-4 w-4 bg-white rounded-full transition ${planStatus ===
//                                                     item
//                                                     ? "left-5"
//                                                     : "left-0.5"
//                                                     }`}
//                                             />
//                                         </div>

//                                         {item}
//                                     </label>
//                                 )
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {/* ACTION BUTTONS */}
//                 <div className="flex justify-end gap-4 pt-6">
//                     <button
//                         onClick={handleSubmit}
//                         className="px-6 py-3 rounded-lg bg-gradient-to-r from-teal-400 to-green-400 text-white"
//                     >
//                         {isEditMode
//                             ? "Update Vendor"
//                             : "Create Vendor"}
//                     </button>

//                     {isEditMode && (
//                         <button
//                             onClick={() => setOpen(true)}
//                             className="px-6 py-3 rounded-lg bg-red-500 text-white"
//                         >
//                             Delete Vendor
//                         </button>
//                     )}
//                 </div>

//                 {/* DELETE MODAL */}
//                 {open && (
//                     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//                         <div className="w-[380px] rounded-xl bg-white p-6 shadow-lg relative">
//                             <button
//                                 onClick={() =>
//                                     setOpen(false)
//                                 }
//                                 className="absolute right-4 top-4"
//                             >
//                                 ✕
//                             </button>

//                             <h2 className="text-center text-lg font-semibold">
//                                 Are you sure you want to
//                                 delete this vendor?
//                             </h2>

//                             <div className="mt-6 flex justify-center gap-4">
//                                 <button
//                                     onClick={() =>
//                                         setOpen(false)
//                                     }
//                                     className="rounded-lg bg-gray-200 px-6 py-2"
//                                 >
//                                     Cancel
//                                 </button>

//                                 <button
//                                     className="rounded-lg bg-red-500 px-6 py-2 text-white"
//                                 >
//                                     Yes Delete
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default CreateVendor;



import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
        <div>
            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">
                    {isEditMode ? "Update Vendor" : "Create Vendor"}
                </h2>
                <AddButton
                    label="Add New Store"
                    type="button"
                    onClick={() => console.log("Add Store Clicked")}
                />
            </div>

            {/* FORM */}
            <div className="bg-white p-6 px-10 rounded-xl space-y-6">
                <h2 className="text-sm font-semibold">Vendor Info</h2>

                {/* COMPANY NAME */}
                <div>
                    <label className="text-xs font-medium">
                        Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleChange}
                        placeholder="Company Name"
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                    />
                </div>

                {/* FIRST NAME + LAST NAME */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-medium">
                            First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            placeholder="First Name"
                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium">
                            Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            placeholder="Last Name"
                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                        />
                    </div>
                </div>

                {/* EMAIL + PHONE */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-medium">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter Email"
                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter Phone Number"
                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                        />
                    </div>
                </div>

                {/* PASSWORD (Only for create mode) */}
                {!isEditMode && (
                    <div>
                        <label className="text-xs font-medium">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter Password (min 8 characters)"
                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                        />
                    </div>
                )}

                {/* COUNTRY CODE */}
                <div>
                    <label className="text-xs font-medium">
                        Country Code <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="country_code"
                        value={formData.country_code}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
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
                    <label className="text-xs font-medium">
                        Company Slug (Optional)
                    </label>
                    <input
                        type="text"
                        name="company_slug"
                        value={formData.company_slug}
                        onChange={handleChange}
                        placeholder="company-slug"
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                    />
                </div>

                {/* PLAN */}
                <div>
                    <label className="text-xs font-medium">
                        Select Plan
                    </label>
                    <select
                        name="plan_id"
                        value={formData.plan_id}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                    >
                        <option value="0">Select Plan</option>
                        <option value="1">Basic</option>
                        <option value="2">Premium</option>
                        <option value="3">Enterprise</option>
                    </select>
                </div>

                {/* DESCRIPTION */}
                <div>
                    <label className="text-xs font-medium">Description</label>
                    <textarea
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Description"
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-md outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                    />
                </div>

                {/* STATUS */}
                <div className="grid grid-cols-2 gap-16">
                    <div>
                        <p className="text-sm font-medium mb-3">Status</p>
                        <div className="flex gap-6">
                            {["active", "inactive", "pending"].map((item) => (
                                <label key={item} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value={item}
                                        checked={formData.status === item}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-teal-500"
                                    />
                                    <span className="capitalize">{item}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* PLAN STATUS (Edit mode only) */}
                    {isEditMode && (
                        <div>
                            <p className="text-sm font-medium mb-3">Plan Status</p>
                            <div className="flex gap-6">
                                {["active", "inactive"].map((item) => (
                                    <label key={item} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="planStatus"
                                            checked={planStatus === item}
                                            onChange={() => setPlanStatus(item)}
                                            className="w-4 h-4 text-teal-500"
                                        />
                                        <span className="capitalize">{item}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex justify-end gap-4 pt-6">
                    <button
                        onClick={() => navigate('/vendors')}
                        className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-600 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isCreating || isUpdating}
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-teal-400 to-green-400 text-white hover:from-teal-500 hover:to-green-500 disabled:opacity-50"
                    >
                        {isCreating || isUpdating 
                            ? (isEditMode ? "Updating..." : "Creating...") 
                            : (isEditMode ? "Update Vendor" : "Create Vendor")}
                    </button>

                    {isEditMode && (
                        <button
                            onClick={() => setOpen(true)}
                            className="px-6 py-3 rounded-lg bg-red-500 text-white hover:bg-red-600"
                        >
                            Delete Vendor
                        </button>
                    )}
                </div>

                {/* DELETE MODAL */}
                {open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="w-[380px] rounded-xl bg-white p-6 shadow-lg relative">
                            <button onClick={() => setOpen(false)} className="absolute right-4 top-4 text-gray-500">
                                ✕
                            </button>
                            <h2 className="text-center text-lg font-semibold">
                                Are you sure you want to delete this vendor?
                            </h2>
                            <div className="mt-6 flex justify-center gap-4">
                                <button onClick={() => setOpen(false)} className="rounded-lg bg-gray-200 px-6 py-2">
                                    Cancel
                                </button>
                                <button onClick={handleDelete} className="rounded-lg bg-red-500 px-6 py-2 text-white">
                                    Yes Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateVendor;