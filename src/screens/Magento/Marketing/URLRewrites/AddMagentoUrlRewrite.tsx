import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const storeViews = [
    "Default Store View",
    "Main Website Store",
    "my web site",
    "neo.exp - raw mart - nina",
];

const redirectTypes = ["No", "Temporary (302)", "Permanent (301)"];
const rewriteTypes = ["Custom", "For category", "For product", "For CMS page"];

const inputClass = (err?: boolean) =>
    `w-full px-3 py-2.5 rounded-xl border text-xs text-gray-700 outline-none transition-all bg-gray-50 focus:bg-white
    ${err ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-teal-400"}`;

const FieldRow = ({
    label, required, children, hint,
}: {
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

const AddMagentoUrlRewrite = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [touched, setTouched] = useState(false);
    const [success, setSuccess] = useState("");

    const [rewriteType, setRewriteType] = useState("Custom");
    const [store, setStore] = useState("Default Store View");
    const [requestPath, setRequestPath] = useState("");
    const [targetPath, setTargetPath] = useState("");
    const [redirectType, setRedirectType] = useState("No");
    const [description, setDescription] = useState("");

    const requestErr = touched && !requestPath.trim();
    const targetErr = touched && !targetPath.trim();

    const handleSave = () => {
        setTouched(true);
        if (!requestPath.trim() || !targetPath.trim()) return;
        setSuccess(`URL Rewrite has been ${isEdit ? "updated" : "saved"} successfully!`);
        setTimeout(() => navigate(-1), 1500);
    };

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
                        <h2 className="text-base font-semibold text-gray-800">
                            {isEdit ? "Edit URL Rewrite" : "Add New URL Rewrite"}
                        </h2>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {isEdit ? "Update existing URL rewrite" : "Create a new URL rewrite"}
                        </p>
                    </div>
                </div>
                <button onClick={handleSave}
                    className="px-5 py-2.5 rounded-xl text-white text-xs font-semibold hover:opacity-90 transition-all"
                    style={{ background: "linear-gradient(to right, #2dd4bf, #22c55e)" }}>
                    Save
                </button>
            </div>

            {/* SUCCESS */}
            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
                    <span>✓</span> {success}
                </div>
            )}

            {/* FORM CARD */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">

                {/* Create URL Rewrite type — outside section */}
                <div className="px-6 py-5 border-b border-gray-100">
                    <div className="grid grid-cols-4 items-center gap-4 max-w-3xl">
                        <label className="text-xs font-semibold text-gray-600 text-right">
                            Create URL Rewrite
                        </label>
                        <div className="col-span-3">
                            <select value={rewriteType} onChange={e => setRewriteType(e.target.value)}
                                className={inputClass()}>
                                {rewriteTypes.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* URL Rewrite Information section */}
                <div className="px-6 pt-5 pb-1">
                    <h3 className="text-sm font-semibold text-gray-800 mb-5">URL Rewrite Information</h3>
                </div>

                <div className="px-6 pb-6 space-y-5 max-w-3xl">

                    {/* Store */}
                    <FieldRow label="Store" required>
                        <select value={store} onChange={e => setStore(e.target.value)}
                            className={inputClass()}>
                            {storeViews.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </FieldRow>

                    {/* Request Path */}
                    <FieldRow label="Request Path" required>
                        <input type="text" value={requestPath}
                            onChange={e => setRequestPath(e.target.value)}
                            onBlur={() => setTouched(true)}
                            placeholder="e.g. my-custom-url.html"
                            className={inputClass(requestErr)} />
                        {requestErr && (
                            <div className="mt-1.5 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
                                <p className="text-xs text-amber-700">This is a required field.</p>
                            </div>
                        )}
                    </FieldRow>

                    {/* Target Path */}
                    <FieldRow label="Target Path" required>
                        <input type="text" value={targetPath}
                            onChange={e => setTargetPath(e.target.value)}
                            onBlur={() => setTouched(true)}
                            placeholder="e.g. catalog/product/view/id/1"
                            className={inputClass(targetErr)} />
                        {targetErr && (
                            <div className="mt-1.5 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
                                <p className="text-xs text-amber-700">This is a required field.</p>
                            </div>
                        )}
                    </FieldRow>

                    {/* Redirect Type */}
                    <FieldRow label="Redirect Type">
                        <select value={redirectType} onChange={e => setRedirectType(e.target.value)}
                            className={inputClass()}>
                            {redirectTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </FieldRow>

                    {/* Description */}
                    <FieldRow label="Description">
                        <textarea value={description} onChange={e => setDescription(e.target.value)}
                            rows={4} placeholder="Enter description (optional)"
                            className={`${inputClass()} resize-none`} />
                    </FieldRow>

                </div>
            </div>
        </div>
    );
};

export default AddMagentoUrlRewrite;