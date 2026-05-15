import { useState, useEffect } from "react";
import AddButton from "../../component/AddButton";
import SearchableSelect from "../../component/SearchableSelect";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { useGetVendorsQuery } from "../../app/api/VendorSlices/VendorApi";
import { 
    useCreateCmsBlockMutation, 
    useUpdateCmsBlockMutation, 
    useGetCmsBlockQuery 
} from "../../app/api/CmsSlices/CmsApi";

const AddCmsBlock = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const { user } = useSelector((state: RootState) => state.auth);
    const role = user?.role?.toLowerCase() || (user?.roles?.[0]?.toLowerCase()) || "";
    const isAdmin = role === "super_admin" || role === "admin";

    const { data: vendorsData } = useGetVendorsQuery(undefined, { skip: !isAdmin });
    const vendors = vendorsData?.data || [];

    const [vendorUuid, setVendorUuid] = useState<string>(
        location.state?.vendorUuid || ""
    );

    
    useEffect(() => {
        if (!vendorUuid) {
            if (isAdmin && vendors.length > 0) {
                setVendorUuid(vendors[0].uuid);
            } else if (!isAdmin && user) {
                const uuid = user?.vendor?.uuid || user?.vendor_uuid || user?.uuid || "";
                if (uuid) {
                    setVendorUuid(uuid);
                }
            }
        }
    }, [isAdmin, vendors, user, vendorUuid]);

    const { data: response, isLoading: isFetching } = useGetCmsBlockQuery(
        { vendorUuid, uuid: id as string }, 
        { skip: !isEdit || !vendorUuid }
    );
    
    const [createCmsBlock, { isLoading: isCreating }] = useCreateCmsBlockMutation();
    const [updateCmsBlock, { isLoading: isUpdating }] = useUpdateCmsBlockMutation();

    const [formData, setFormData] = useState({
        title: "",
        identifier: "",
        content: "",
        is_active: true
    });

    useEffect(() => {
        if (isEdit && response?.data) {
            setFormData({
                title: response.data.title || "",
                identifier: response.data.identifier || "",
                content: response.data.content || "",
                is_active: response.data.is_active ?? true
            });
        }
    }, [isEdit, response]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as any;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' || type === 'radio' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleStatusChange = (status: boolean) => {
        setFormData(prev => ({ ...prev, is_active: status }));
    };

    const handleSubmit = async () => {
        try {
            if (isEdit) {
                await updateCmsBlock({ vendorUuid, uuid: id as string, data: formData }).unwrap();
            } else {
                await createCmsBlock({ vendorUuid, data: formData }).unwrap();
            }
            navigate("/CmsBlockList");
        } catch (error) {
            console.error("Failed to save CMS Block:", error);
        }
    };

    return (
        <div>
            <div className="bg-white shadow-sm p-6">
                {/* HEADER */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">CMS Block Info</h2>

                    <div className="flex items-center gap-4">
                        {isAdmin && !isEdit && (
                            <SearchableSelect
                                options={vendors.map((v: any) => ({ value: v.uuid, label: v.company_name || v.name }))}
                                value={vendorUuid}
                                onChange={(value) => setVendorUuid(value)}
                                placeholder="Select Vendor..."
                            />
                        )}
                        <AddButton
                            label={isEdit ? "Update CMS Block" : "Add CMS Block"}
                            type="button"
                            onClick={handleSubmit}
                        />
                    </div>
                </div>

                {/* CARD */}
                {isFetching ? (
                    <div className="text-center p-6">Loading block details...</div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">

                        {/* NAME + IDENTIFIER */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700">
                                    Block Title
                                </label>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter Block Title"
                                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700">
                                    Identifier
                                </label>
                                <input
                                    name="identifier"
                                    value={formData.identifier}
                                    onChange={handleChange}
                                    placeholder="e.g., footer_links"
                                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400"
                                />
                            </div>
                        </div>

                        {/* CONTENT */}
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-700">
                                Content
                            </label>

                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                rows={10}
                                placeholder="HTML Content"
                                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400 font-mono text-sm"
                            />
                        </div>


                        {/* STATUS */}
                        <div>
                            <p className="text-sm font-semibold mb-2 text-gray-700">Status</p>

                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="status" 
                                        className="accent-teal-500" 
                                        checked={formData.is_active === true}
                                        onChange={() => handleStatusChange(true)}
                                    />
                                    <span className="text-sm">Active</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="status" 
                                        className="accent-teal-500" 
                                        checked={formData.is_active === false}
                                        onChange={() => handleStatusChange(false)}
                                    />
                                    <span className="text-sm">Inactive</span>
                                </label>
                            </div>
                        </div>

                        {/* BUTTONS */}
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <button 
                                onClick={() => navigate("/CmsBlockList")}
                                className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
                            >
                                Cancel
                            </button>

                            <button 
                                onClick={handleSubmit}
                                disabled={isCreating || isUpdating}
                                className="px-6 py-2 bg-gradient-to-r from-teal-400 to-green-400 text-white rounded-md opacity-90 hover:opacity-100 transition disabled:opacity-50"
                            >
                                {isCreating || isUpdating ? "Saving..." : (isEdit ? "Update Block" : "Add Block")}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddCmsBlock;