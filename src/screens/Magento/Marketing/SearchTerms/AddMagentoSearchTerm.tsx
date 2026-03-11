import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const storeViews = [
    "Default Store View",
    "Main Website",
    "Main Website Store",
    "neo.exp",
    "raw mart",
    "nina",
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

const AddMagentoSearchTerm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [touched, setTouched] = useState(false);
    const [success, setSuccess] = useState("");

    const [searchQuery, setSearchQuery] = useState("");
    const [store, setStore] = useState("");
    const [redirectUrl, setRedirectUrl] = useState("");
    const [suggestedTerms, setSuggestedTerms] = useState("No");

    const queryErr = touched && !searchQuery.trim();
    const storeErr = touched && !store;

    const handleReset = () => {
        setSearchQuery("");
        setStore("");
        setRedirectUrl("");
        setSuggestedTerms("No");
        setTouched(false);
        setSuccess("");
    };

    const handleSave = () => {
        setTouched(true);
        if (!searchQuery.trim() || !store) return;
        setSuccess(`Search term has been ${isEdit ? "updated" : "saved"} successfully!`);
        setTimeout(() => navigate("/SearchTerms"), 1500);
    };

    return (
        <div className="space-y-5">

            {/* TOP BAR */}
            <div className="bg-white rounded-xl shadow-sm px-6 py-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate("/SearchTerms")}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-gray-500 text-xs hover:bg-gray-50 transition-all">
                        <FaArrowLeft className="text-xs" /> Back
                    </button>
                    <div>
                        <h2 className="text-base font-semibold text-gray-800">
                            {isEdit ? "Edit Search Term" : "New Search Term"}
                        </h2>
                        <p className="text-xs text-gray-400 mt-0.5">Search Terms Management</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handleReset}
                        className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition-all">
                        Reset
                    </button>
                    <button onClick={handleSave}
                        className="px-5 py-2.5 rounded-xl text-white text-xs font-semibold hover:opacity-90 transition-all"
                        style={{ background: "linear-gradient(to right, #2dd4bf, #22c55e)" }}>
                        Save Search
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

                    {/* Search Query */}
                    <FieldRow label="Search Query" required>
                        <input type="text" value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            onBlur={() => setTouched(true)}
                            className={inputClass(queryErr)} />
                        {queryErr && (
                            <div className="mt-1.5 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
                                <p className="text-xs text-amber-700">This is a required field.</p>
                            </div>
                        )}
                    </FieldRow>

                    {/* Store */}
                    <FieldRow label="Store" required>
                        <select value={store} onChange={e => setStore(e.target.value)}
                            className={inputClass(storeErr)}>
                            <option value=""></option>
                            {storeViews.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {storeErr && (
                            <div className="mt-1.5 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
                                <p className="text-xs text-amber-700">This is a required field.</p>
                            </div>
                        )}
                    </FieldRow>

                    {/* Redirect URL */}
                    <FieldRow label="Redirect URL" hint="ex. http://domain.com">
                        <input type="url" value={redirectUrl}
                            onChange={e => setRedirectUrl(e.target.value)}
                            placeholder="https://"
                            className={inputClass()} />
                    </FieldRow>

                    {/* Display in Suggested Terms */}
                    <FieldRow label="Display in Suggested Terms">
                        <select value={suggestedTerms} onChange={e => setSuggestedTerms(e.target.value)}
                            className={inputClass()}>
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                        </select>
                    </FieldRow>

                </div>
            </div>
        </div>
    );
};

export default AddMagentoSearchTerm;