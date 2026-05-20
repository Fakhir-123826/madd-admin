import { useState, useEffect } from "react";
import AddButton from "../../component/AddButton";
import SearchableSelect from "../../component/SearchableSelect";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { useGetVendorsQuery } from "../../app/api/VendorSlices/VendorApi";
import {
    useCreateCmsPageMutation,
    useUpdateCmsPageMutation,
    useGetCmsPageQuery
} from "../../app/api/CmsSlices/CmsApi";

const AddCmsPage = () => {
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

    const { data: response, isLoading: isFetching } = useGetCmsPageQuery(
        { vendorUuid, uuid: id as string },
        { skip: !isEdit || !vendorUuid }
    );

    const [createCmsPage, { isLoading: isCreating }] = useCreateCmsPageMutation();
    const [updateCmsPage, { isLoading: isUpdating }] = useUpdateCmsPageMutation();

    // Replace the existing formData useState (around line 45)
    const [formData, setFormData] = useState({
        title: "",
        identifier: "",
        content_heading: "",
        content: "",
        meta_title: "",
        meta_keywords: "",
        meta_description: "",
        page_layout: "",
        layout_update_xml: "",
        custom_theme: "",
        custom_root_template: "",
        custom_layout_update_xml: "",
        custom_theme_from: "",
        custom_theme_to: "",
        sort_order: "",
        is_active: true
    });

    useEffect(() => {
        if (isEdit && response?.data) {
            setFormData({
                title: response.data.title || "",
                identifier: response.data.identifier || "",
                content_heading: response.data.content_heading || "",
                content: response.data.content || "",
                meta_title: response.data.meta_title || "",
                meta_keywords: response.data.meta_keywords || "",
                meta_description: response.data.meta_description || "",
                page_layout: response.data.page_layout || "",
                layout_update_xml: response.data.layout_update_xml || "",
                custom_theme: response.data.custom_theme || "",
                custom_root_template: response.data.custom_root_template || "",
                custom_layout_update_xml: response.data.custom_layout_update_xml || "",
                custom_theme_from: response.data.custom_theme_from || "",
                custom_theme_to: response.data.custom_theme_to || "",
                sort_order: response.data.sort_order || "",
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

    // Add this validation function before handleSubmit
    const validateXml = (xmlString: string): boolean => {
        if (!xmlString || xmlString.trim() === '') return true;

        try {
            // Simple validation for basic XML structure
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, "text/xml");
            const parserError = xmlDoc.querySelector("parsererror");
            if (parserError) {
                console.error("XML parsing error:", parserError.textContent);
                return false;
            }
            return true;
        } catch (error) {
            console.error("XML validation error:", error);
            return false;
        }
    };

    const handleSubmit = async () => {
        // Validate XML fields before submission
        if (formData.layout_update_xml && !validateXml(formData.layout_update_xml)) {
            alert("Invalid XML format in Layout Update XML field");
            return;
        }

        if (formData.custom_layout_update_xml && !validateXml(formData.custom_layout_update_xml)) {
            alert("Invalid XML format in Custom Layout Update XML field");
            return;
        }

        try {
            if (isEdit) {
                await updateCmsPage({ vendorUuid, uuid: id as string, data: formData }).unwrap();
            } else {
                await createCmsPage({ vendorUuid, data: formData }).unwrap();
            }
            navigate("/CmsPageList");
        } catch (error) {
            console.error("Failed to save CMS Page:", error);
        }
    };

    return (
        <div>
            <div className="bg-white shadow-sm p-6">
                {/* HEADER */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">CMS Page Info</h2>

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
                            label={isEdit ? "Update CMS Page" : "Add CMS Page"}
                            type="button"
                            onClick={handleSubmit}
                        />
                    </div>
                </div>

                {/* CARD */}
                {isFetching ? (
                    <div className="text-center p-6">Loading page details...</div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">

                        {/* NAME + IDENTIFIER */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700">
                                    Page Title
                                </label>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter Page Title"
                                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700">
                                    Identifier (URL Key)
                                </label>
                                <input
                                    name="identifier"
                                    value={formData.identifier}
                                    onChange={handleChange}
                                    placeholder="e.g., about-us"
                                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400"
                                />
                            </div>
                        </div>

                        {/* CONTENT HEADING */}
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-700">
                                Content Heading
                            </label>
                            <input
                                name="content_heading"
                                value={formData.content_heading}
                                onChange={handleChange}
                                placeholder="Enter Content Heading"
                                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400"
                            />
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
                        {/* Add this section after the Content field and before Status */}
                        {/* META INFORMATION */}
                        <div className="border-t pt-6 mt-6">
                            <h3 className="text-md font-semibold mb-4 text-gray-800">Meta Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700">Meta Title</label>
                                    <input
                                        name="meta_title"
                                        value={formData.meta_title}
                                        onChange={handleChange}
                                        placeholder="Meta Title"
                                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700">Meta Keywords</label>
                                    <input
                                        name="meta_keywords"
                                        value={formData.meta_keywords}
                                        onChange={handleChange}
                                        placeholder="Meta Keywords (comma separated)"
                                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400"
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-semibold mb-2 text-gray-700">Meta Description</label>
                                <textarea
                                    name="meta_description"
                                    value={formData.meta_description}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Meta Description"
                                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400"
                                />
                            </div>
                        </div>

                        {/* PAGE LAYOUT & DESIGN */}
                        <div className="border-t pt-6 mt-6">
                            <h3 className="text-md font-semibold mb-4 text-gray-800">Page Layout & Design</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700">Page Layout</label>
                                    <select
                                        name="page_layout"
                                        value={formData.page_layout}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400"
                                    >
                                        <option value="">Select Layout</option>
                                        <option value="1column">1 Column</option>
                                        <option value="2columns-left">2 Columns with Left Sidebar</option>
                                        <option value="2columns-right">2 Columns with Right Sidebar</option>
                                        <option value="3columns">3 Columns</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700">Sort Order</label>
                                    <input
                                        name="sort_order"
                                        type="number"
                                        value={formData.sort_order}
                                        onChange={handleChange}
                                        placeholder="Sort Order"
                                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400"
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-semibold mb-2 text-gray-700">Layout Update XML</label>
                                <textarea
                                    name="layout_update_xml"
                                    value={formData.layout_update_xml}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder='<?xml version="1.0"?>
<referenceContainer name="content">
    <block class="Magento\Cms\Block\Block" name="cms-block">
        <arguments>
            <argument name="block_id" xsi:type="string">block_identifier</argument>
        </arguments>
    </block>
</referenceContainer>'
                                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400 font-mono text-sm"
                                />
                            </div>
                        </div>

                        {/* CUSTOM THEME SETTINGS */}
                        <div className="border-t pt-6 mt-6">
                            <h3 className="text-md font-semibold mb-4 text-gray-800">Custom Theme Settings</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700">Custom Theme</label>
                                    <input
                                        name="custom_theme"
                                        value={formData.custom_theme}
                                        onChange={handleChange}
                                        placeholder="Magento/blank"
                                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700">Custom Root Template</label>
                                    <input
                                        name="custom_root_template"
                                        value={formData.custom_root_template}
                                        onChange={handleChange}
                                        placeholder="3columns"
                                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700">Custom Theme From (Date)</label>
                                    <input
                                        name="custom_theme_from"
                                        type="date"
                                        value={formData.custom_theme_from}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700">Custom Theme To (Date)</label>
                                    <input
                                        name="custom_theme_to"
                                        type="date"
                                        value={formData.custom_theme_to}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400"
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-semibold mb-2 text-gray-700">Custom Layout Update XML</label>
                                <textarea
                                    name="custom_layout_update_xml"
                                    value={formData.custom_layout_update_xml}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder='<?xml version="1.0"?>
<referenceContainer name="content">
    <block class="Magento\Cms\Block\Page" name="cms-page"/>
</referenceContainer>'
                                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400 font-mono text-sm"
                                />
                            </div>
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
                                onClick={() => navigate("/CmsPageList")}
                                className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSubmit}
                                disabled={isCreating || isUpdating}
                                className="px-6 py-2 bg-gradient-to-r from-teal-400 to-green-400 text-white rounded-md opacity-90 hover:opacity-100 transition disabled:opacity-50"
                            >
                                {isCreating || isUpdating ? "Saving..." : (isEdit ? "Update Page" : "Add Page")}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddCmsPage;
