import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaQuestionCircle } from "react-icons/fa";

const scopes = [
    "All Websites",
    "Main Website",
    "Main Website Store - Default Store View",
    "my web site",
    "neo.exp - raw mart - nina",
];

const inputClass = (err?: boolean) =>
    `w-full px-3 py-2.5 rounded-xl border text-xs text-gray-700 outline-none transition-all bg-gray-50 focus:bg-white
    ${err ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-teal-400"}`;

const FieldRow = ({ label, required, children, hint }: {
    label: string; required?: boolean; children: React.ReactNode; hint?: string;
}) => (
    <div className="grid grid-cols-4 items-start gap-4">
        <div className="flex items-center justify-end gap-1 pt-2.5">
            <label className="text-xs font-semibold text-gray-600 text-right">{label}</label>
            {required && <span className="text-red-500 text-xs">*</span>}
        </div>
        <div className="col-span-3">
            {children}
            {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
        </div>
    </div>
);

const AddMagentoSearchSynonym = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [touched, setTouched] = useState(false);
    const [success, setSuccess] = useState("");

    const [scope, setScope] = useState("All Websites");
    const [synonymsText, setSynonymsText] = useState("");
    const [mergeExisting, setMergeExisting] = useState(false);

    const synonymsErr = touched && !synonymsText.trim();

    const handleReset = () => {
        setScope("All Websites");
        setSynonymsText("");
        setMergeExisting(false);
        setTouched(false);
        setSuccess("");
    };

    const handleSave = () => {
        setTouched(true);
        if (!synonymsText.trim()) return;
        setSuccess(`Synonym group has been ${isEdit ? "updated" : "saved"} successfully!`);
        setTimeout(() => navigate("/SearchSynonyms"), 1500);
    };

    return (
        <div className="space-y-5">

            {/* TOP BAR */}
            <div className="bg-white rounded-xl shadow-sm px-6 py-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate("/SearchSynonyms")}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-gray-500 text-xs hover:bg-gray-50 transition-all">
                        <FaArrowLeft className="text-xs" /> Back
                    </button>
                    <div>
                        <h2 className="text-base font-semibold text-gray-800">
                            {isEdit ? "Edit Synonym Group" : "New Synonym Group"}
                        </h2>
                        <p className="text-xs text-gray-400 mt-0.5">Search Synonyms Management</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handleReset}
                        className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition-all">
                        Reset
                    </button>
                    <button onClick={handleSave}
                        className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition-all">
                        Save and Continue Edit
                    </button>
                    <button onClick={handleSave}
                        className="px-5 py-2.5 rounded-xl text-white text-xs font-semibold hover:opacity-90 transition-all"
                        style={{ background: "linear-gradient(to right, #2dd4bf, #22c55e)" }}>
                        Save Synonym Group
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
                    <h3 className="text-sm font-semibold text-gray-800">General Information</h3>
                </div>
                <div className="p-6 space-y-5 max-w-3xl">

                    {/* Scope */}
                    <FieldRow label="Scope" required>
                        <div className="flex items-center gap-2">
                            <select value={scope} onChange={e => setScope(e.target.value)}
                                className={inputClass()}>
                                {scopes.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <FaQuestionCircle className="text-gray-400 text-sm flex-shrink-0"
                                title="Select the scope for this synonym group" />
                        </div>
                    </FieldRow>

                    {/* Synonyms */}
                    <FieldRow label="Synonyms" required>
                        <div className="flex items-start gap-2">
                            <div className="flex-1">
                                <textarea
                                    value={synonymsText}
                                    onChange={e => setSynonymsText(e.target.value)}
                                    onBlur={() => setTouched(true)}
                                    rows={4}
                                    placeholder="e.g. shoes, footwear, sneakers"
                                    className={`${inputClass(synonymsErr)} resize-none`} />
                                {synonymsErr && (
                                    <div className="mt-1.5 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
                                        <p className="text-xs text-amber-700">This is a required field.</p>
                                    </div>
                                )}
                            </div>
                            <FaQuestionCircle className="text-gray-400 text-sm flex-shrink-0 mt-2.5"
                                title="Enter comma-separated synonyms" />
                        </div>
                    </FieldRow>

                    {/* Merge existing synonyms */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <div /> {/* spacer */}
                        <div className="col-span-3">
                            <label className="flex items-center gap-2.5 cursor-pointer">
                                <input type="checkbox" checked={mergeExisting}
                                    onChange={e => setMergeExisting(e.target.checked)}
                                    className="w-3.5 h-3.5 accent-teal-500 flex-shrink-0" />
                                <span className="text-xs text-gray-600">Merge existing synonyms</span>
                                <FaQuestionCircle className="text-gray-400 text-xs"
                                    title="If checked, existing synonyms will be merged with new ones" />
                            </label>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AddMagentoSearchSynonym;