import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const AddMagentoCustomerGroup = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        groupName: "",
        taxClass: "retail",
        excludedWebsites: [] as string[],
    });
    const [touched, setTouched] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const websites = ["Main Website", "my web site", "neo.exp"];

    // Pre-fill in edit mode
    useEffect(() => {
        if (isEdit) {
            setFormData({
                groupName: "Wholesale",
                taxClass: "retail",
                excludedWebsites: [],
            });
        }
    }, [isEdit]);

    const handleReset = () => {
        setFormData({ groupName: "", taxClass: "retail", excludedWebsites: [] });
        setTouched(false);
        setError("");
        setSuccess("");
    };

    const toggleWebsite = (site: string) => {
        setFormData(prev => ({
            ...prev,
            excludedWebsites: prev.excludedWebsites.includes(site)
                ? prev.excludedWebsites.filter(w => w !== site)
                : [...prev.excludedWebsites, site],
        }));
    };

    const handleSubmit = () => {
        setTouched(true);
        if (!formData.groupName.trim()) return;
        if (formData.groupName.length > 32) return;
        setSuccess(isEdit ? "Customer group updated!" : "Customer group created!");
        setTimeout(() => navigate("/CustomerGroups"), 1500);
    };

    const nameError = touched && !formData.groupName.trim();
    const nameTooLong = formData.groupName.length > 32;

    const inputClass = (hasError: boolean) =>
        `w-full px-3 py-2.5 rounded-xl border text-sm text-gray-700 outline-none transition-all bg-gray-50 focus:bg-white
        ${hasError ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-teal-400"}`;

    return (
        <div className="space-y-5">

            {/* TOP BAR */}
            <div className="bg-white rounded-xl shadow-sm px-6 py-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate("/MagentoCustomerGroupsList")}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-gray-500 text-xs hover:bg-gray-50 transition-all">
                        <FaArrowLeft className="text-xs" /> Back
                    </button>
                    <div>
                        <h2 className="text-base font-semibold text-gray-800">
                            {isEdit ? "Edit Customer Group" : "New Customer Group"}
                        </h2>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {isEdit ? "Update group information" : "Create a new customer group"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handleReset}
                        className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition-all">
                        Reset
                    </button>
                    <button onClick={handleSubmit}
                        className="px-5 py-2.5 rounded-xl text-white text-xs font-semibold hover:opacity-90 transition-all"
                        style={{ background: "linear-gradient(to right, #2dd4bf, #22c55e)" }}>
                        {isEdit ? "Update Customer Group" : "Save Customer Group"}
                    </button>
                </div>
            </div>

            {/* SUCCESS */}
            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
                    <span>✓</span> {success}
                </div>
            )}

            {/* FORM CARD */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-800">Group Information</h3>
                </div>
                <div className="p-6 space-y-6 max-w-2xl">

                    {/* Group Name */}
                    <div>
                        <div className="flex items-center gap-1 mb-1.5">
                            <label className="text-xs font-semibold text-gray-700">Group Name</label>
                            <span className="text-red-500 text-xs">*</span>
                        </div>
                        <input
                            type="text"
                            value={formData.groupName}
                            onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                            onBlur={() => setTouched(true)}
                            placeholder="Enter group name"
                            maxLength={35}
                            className={inputClass(nameError || nameTooLong)}
                        />
                        {nameError && (
                            <div className="mt-1.5 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
                                <p className="text-xs text-amber-700">This is a required field.</p>
                            </div>
                        )}
                        {nameTooLong && (
                            <div className="mt-1.5 px-3 py-2 rounded-lg bg-red-50 border border-red-200">
                                <p className="text-xs text-red-600">Maximum length must be less than 32 characters.</p>
                            </div>
                        )}
                        {!nameError && !nameTooLong && (
                            <p className="text-xs text-gray-400 mt-1.5">Maximum length must be less than 32 characters.</p>
                        )}
                    </div>

                    {/* Tax Class */}
                    <div>
                        <div className="flex items-center gap-1 mb-1.5">
                            <label className="text-xs font-semibold text-gray-700">Tax Class</label>
                            <span className="text-red-500 text-xs">*</span>
                        </div>
                        <select
                            value={formData.taxClass}
                            onChange={(e) => setFormData({ ...formData, taxClass: e.target.value })}
                            className={inputClass(false)}>
                            <option value="retail">Retail Customer</option>
                            <option value="wholesale">Wholesale Customer</option>
                            <option value="none">None</option>
                        </select>
                    </div>

                    {/* Excluded Websites */}
                    <div>
                        <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Excluded Website(s)</label>
                        <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                            {websites.map((site, i) => (
                                <label key={site}
                                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-blue-50/40 transition-all
                                        ${i !== websites.length - 1 ? "border-b border-gray-100" : ""}`}>
                                    <input
                                        type="checkbox"
                                        checked={formData.excludedWebsites.includes(site)}
                                        onChange={() => toggleWebsite(site)}
                                        className="accent-teal-500 w-3.5 h-3.5 flex-shrink-0"
                                    />
                                    <span className="text-xs text-gray-700">{site}</span>
                                </label>
                            ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-1.5">Select websites you want to exclude from this customer group.</p>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default AddMagentoCustomerGroup;