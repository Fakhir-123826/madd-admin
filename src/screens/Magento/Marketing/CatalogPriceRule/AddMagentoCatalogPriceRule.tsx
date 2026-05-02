import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaChevronDown, FaChevronUp, FaPlus } from "react-icons/fa";

const websites = ["Main Website", "my web site", "neo.exp"];
const customerGroups = ["NOT LOGGED IN", "General", "Wholesale", "Retailer", "MY group 2"];

const AddMagentoCatalogPriceRule = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        ruleName: "",
        description: "",
        active: false,
        websites: [] as string[],
        customerGroups: [] as string[],
        from: "",
        to: "",
        priority: "",
        apply: "percentage",
        discountAmount: "",
        discardSubsequent: "no",
    });

    const [touched, setTouched] = useState(false);
    const [conditionsOpen, setConditionsOpen] = useState(false);
    const [actionsOpen, setActionsOpen] = useState(false);
    const [success, setSuccess] = useState("");

    const toggleList = (field: "websites" | "customerGroups", val: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].includes(val)
                ? prev[field].filter(v => v !== val)
                : [...prev[field], val],
        }));
    };

    const handleSave = () => {
        setTouched(true);
        if (!formData.ruleName.trim()) return;
        if (formData.websites.length === 0) return;
        if (formData.customerGroups.length === 0) return;
        setSuccess("Catalog price rule saved successfully!");
        setTimeout(() => navigate(-1), 1500);
    };

    const inputClass = (err?: boolean) =>
        `w-full px-3 py-2.5 rounded-xl border text-xs text-gray-700 outline-none transition-all bg-gray-50 focus:bg-white
        ${err ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-teal-400"}`;

    const nameErr = touched && !formData.ruleName.trim();
    const websiteErr = touched && formData.websites.length === 0;
    const groupErr = touched && formData.customerGroups.length === 0;
    const discountErr = touched && actionsOpen && !formData.discountAmount;

    return (
        <div className="space-y-5">

            {/* TOP BAR */}
            <div className="bg-white rounded-xl shadow-sm px-6 py-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-gray-500 text-xs hover:bg-gray-50 transition-all">
                        <FaArrowLeft className="text-xs" /> Back
                    </button>
                    <div>
                        <h2 className="text-base font-semibold text-gray-800">New Catalog Price Rule</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Create a new catalog price rule</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={() => setFormData({ ruleName: "", description: "", active: false, websites: [], customerGroups: [], from: "", to: "", priority: "", apply: "percentage", discountAmount: "", discardSubsequent: "no" })}
                        className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition-all">
                        Reset
                    </button>
                    <button onClick={handleSave}
                        className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition-all">
                        Save and Apply
                    </button>
                    <button onClick={handleSave}
                        className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition-all">
                        Save and Continue Edit
                    </button>
                    <button onClick={handleSave}
                        className="px-5 py-2.5 rounded-xl text-white text-xs font-semibold hover:opacity-90 transition-all"
                        style={{ background: "linear-gradient(to right, #2dd4bf, #22c55e)" }}>
                        Save
                    </button>
                </div>
            </div>

            {/* SUCCESS */}
            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
                    <span>✓</span> {success}
                </div>
            )}

            {/* MAIN FORM */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-800">Rule Information</h3>
                </div>
                <div className="p-6 space-y-5 max-w-3xl">

                    {/* Rule Name */}
                    <div className="grid grid-cols-4 items-start gap-4">
                        <div className="flex items-center justify-end gap-1 pt-2.5">
                            <label className="text-xs font-semibold text-gray-600 text-right">Rule Name</label>
                            <span className="text-red-500 text-xs">*</span>
                        </div>
                        <div className="col-span-3">
                            <input type="text" value={formData.ruleName}
                                onChange={(e) => setFormData({ ...formData, ruleName: e.target.value })}
                                onBlur={() => setTouched(true)}
                                className={inputClass(nameErr)} placeholder="Enter rule name" />
                            {nameErr && (
                                <div className="mt-1.5 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
                                    <p className="text-xs text-amber-700">This is a required field.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="grid grid-cols-4 items-start gap-4">
                        <label className="text-xs font-semibold text-gray-600 text-right pt-2.5">Description</label>
                        <div className="col-span-3">
                            <textarea value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3} placeholder="Enter description"
                                className={`${inputClass()} resize-none`} />
                        </div>
                    </div>

                    {/* Active Toggle */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <div className="flex items-center justify-end gap-1">
                            <label className="text-xs font-semibold text-gray-600">Active</label>
                            <span className="text-red-500 text-xs">*</span>
                        </div>
                        <div className="col-span-3 flex items-center gap-3">
                            <button type="button"
                                onClick={() => setFormData({ ...formData, active: !formData.active })}
                                className={`relative w-11 h-6 rounded-full transition-all duration-300 ${formData.active ? "bg-teal-400" : "bg-gray-300"}`}>
                                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${formData.active ? "left-5" : "left-0.5"}`} />
                            </button>
                            <span className="text-xs text-gray-500">{formData.active ? "Yes" : "No"}</span>
                        </div>
                    </div>

                    {/* Websites */}
                    <div className="grid grid-cols-4 items-start gap-4">
                        <div className="flex items-center justify-end gap-1 pt-2">
                            <label className="text-xs font-semibold text-gray-600 text-right">Websites</label>
                            <span className="text-red-500 text-xs">*</span>
                        </div>
                        <div className="col-span-3">
                            <div className={`border rounded-xl overflow-hidden bg-gray-50 ${websiteErr ? "border-red-300" : "border-gray-200"}`}>
                                {websites.map((site, i) => (
                                    <label key={site}
                                        className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-blue-50/40 transition-all
                                            ${i !== websites.length - 1 ? "border-b border-gray-100" : ""}`}>
                                        <input type="checkbox" checked={formData.websites.includes(site)}
                                            onChange={() => toggleList("websites", site)}
                                            className="accent-teal-500 w-3.5 h-3.5 flex-shrink-0" />
                                        <span className="text-xs text-gray-700">{site}</span>
                                    </label>
                                ))}
                            </div>
                            {websiteErr && <p className="text-xs text-red-500 mt-1.5">Please select at least one website.</p>}
                        </div>
                    </div>

                    {/* Customer Groups */}
                    <div className="grid grid-cols-4 items-start gap-4">
                        <div className="flex items-center justify-end gap-1 pt-2">
                            <label className="text-xs font-semibold text-gray-600 text-right">Customer Groups</label>
                            <span className="text-red-500 text-xs">*</span>
                        </div>
                        <div className="col-span-3">
                            <div className={`border rounded-xl overflow-hidden bg-gray-50 ${groupErr ? "border-red-300" : "border-gray-200"}`}>
                                {customerGroups.map((grp, i) => (
                                    <label key={grp}
                                        className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-blue-50/40 transition-all
                                            ${i !== customerGroups.length - 1 ? "border-b border-gray-100" : ""}`}>
                                        <input type="checkbox" checked={formData.customerGroups.includes(grp)}
                                            onChange={() => toggleList("customerGroups", grp)}
                                            className="accent-teal-500 w-3.5 h-3.5 flex-shrink-0" />
                                        <span className="text-xs text-gray-700">{grp}</span>
                                    </label>
                                ))}
                            </div>
                            {groupErr && <p className="text-xs text-red-500 mt-1.5">Please select at least one customer group.</p>}
                        </div>
                    </div>

                    {/* From */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-xs font-semibold text-gray-600 text-right">From</label>
                        <div className="col-span-3">
                            <input type="date" value={formData.from}
                                onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                                className={inputClass()} />
                        </div>
                    </div>

                    {/* To */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-xs font-semibold text-gray-600 text-right">To</label>
                        <div className="col-span-3">
                            <input type="date" value={formData.to}
                                onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                                className={inputClass()} />
                        </div>
                    </div>

                    {/* Priority */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-xs font-semibold text-gray-600 text-right">Priority</label>
                        <div className="col-span-3">
                            <input type="number" value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                placeholder="0" className={inputClass()} />
                        </div>
                    </div>

                </div>
            </div>

            {/* CONDITIONS ACCORDION */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <button onClick={() => setConditionsOpen(!conditionsOpen)}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-all">
                    <h3 className="text-sm font-semibold text-gray-800">Conditions</h3>
                    {conditionsOpen
                        ? <FaChevronUp className="text-gray-400 text-xs" />
                        : <FaChevronDown className="text-gray-400 text-xs" />}
                </button>

                {conditionsOpen && (
                    <div className="px-6 pb-6 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mt-4 mb-4 font-medium">
                            Conditions (don't add conditions if rule is applied to all products)
                        </p>
                        <div className="border-b border-gray-100 pb-4">
                            <p className="text-xs text-gray-600">
                                If <span className="font-bold">ALL</span> of these conditions are <span className="font-bold">TRUE</span>:
                            </p>
                            <div className="mt-3 ml-4 flex items-center gap-2">
                                <button className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center hover:bg-teal-600 transition-all">
                                    <FaPlus className="text-white text-[8px]" />
                                </button>
                                <span className="text-xs text-gray-400">Add condition</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ACTIONS ACCORDION */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <button onClick={() => setActionsOpen(!actionsOpen)}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-all">
                    <h3 className="text-sm font-semibold text-gray-800">Actions</h3>
                    {actionsOpen
                        ? <FaChevronUp className="text-gray-400 text-xs" />
                        : <FaChevronDown className="text-gray-400 text-xs" />}
                </button>

                {actionsOpen && (
                    <div className="px-6 pb-6 border-t border-gray-100">
                        <div className="mt-5 space-y-5 max-w-3xl">

                            {/* Apply */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label className="text-xs font-semibold text-gray-600 text-right">Apply</label>
                                <div className="col-span-3">
                                    <select value={formData.apply}
                                        onChange={(e) => setFormData({ ...formData, apply: e.target.value })}
                                        className={inputClass()}>
                                        <option value="percentage">Apply as percentage of original</option>
                                        <option value="fixed">Apply as fixed amount</option>
                                        <option value="fixed_price">Adjust final price to this percentage</option>
                                        <option value="final_price">Adjust final price to discount value</option>
                                    </select>
                                </div>
                            </div>

                            {/* Discount Amount */}
                            <div className="grid grid-cols-4 items-start gap-4">
                                <div className="flex items-center justify-end gap-1 pt-2.5">
                                    <label className="text-xs font-semibold text-gray-600 text-right">Discount Amount</label>
                                    <span className="text-red-500 text-xs">*</span>
                                </div>
                                <div className="col-span-3">
                                    <input type="number" value={formData.discountAmount}
                                        onChange={(e) => setFormData({ ...formData, discountAmount: e.target.value })}
                                        placeholder="0.00" className={inputClass(discountErr)} />
                                    {discountErr && (
                                        <div className="mt-1.5 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
                                            <p className="text-xs text-amber-700">This is a required field.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Discard Subsequent Rules */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label className="text-xs font-semibold text-gray-600 text-right">Discard subsequent rules</label>
                                <div className="col-span-3">
                                    <select value={formData.discardSubsequent}
                                        onChange={(e) => setFormData({ ...formData, discardSubsequent: e.target.value })}
                                        className={inputClass()}>
                                        <option value="no">No</option>
                                        <option value="yes">Yes</option>
                                    </select>
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default AddMagentoCatalogPriceRule;