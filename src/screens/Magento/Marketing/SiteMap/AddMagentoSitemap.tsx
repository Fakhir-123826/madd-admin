import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaQuestionCircle } from "react-icons/fa";

const storeViews = ["Default Store View", "Main Website Store", "neo.exp", "raw mart", "nina"];

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

const AddMagentoSitemap = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [touched, setTouched] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [success, setSuccess] = useState("");

    const [filename, setFilename] = useState("");
    const [path, setPath] = useState("/media/sitemap");
    const [storeView, setStoreView] = useState("Default Store View");

    const filenameErr = touched && !filename.trim();
    const pathErr = touched && !path.trim();

    const handleReset = () => {
        setFilename(""); setPath("/media/sitemap"); setStoreView("Default Store View");
        setTouched(false); setErrorMsg(""); setSuccess("");
    };

    const handleSave = () => {
        setTouched(true);
        if (!filename.trim() || !path.trim()) return;

        // Simulate path not available error (like image 1)
        if (path === "/media/sitemap/lelo") {
            setErrorMsg(`Path "${path}/${filename}" is not available and cannot be used.`);
            return;
        }

        setErrorMsg("");
        setSuccess("Sitemap has been saved successfully!");
        setTimeout(() => navigate("/MagentoSitemapList"), 1500);
    };

    return (
        <div className="space-y-5">

            {/* TOP BAR */}
            <div className="bg-white rounded-xl shadow-sm px-6 py-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate("/MagentoSitemapList")}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-gray-500 text-xs hover:bg-gray-50 transition-all">
                        <FaArrowLeft className="text-xs" /> Back
                    </button>
                    <div>
                        <h2 className="text-base font-semibold text-gray-800">
                            {isEdit ? "Edit Sitemap" : "New Sitemap"}
                        </h2>
                        <p className="text-xs text-gray-400 mt-0.5">Site Map Management</p>
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
                        Save
                    </button>
                </div>
            </div>

            {/* ERROR BANNER */}
            {errorMsg && (
                <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-[10px] font-bold">✕</span>
                        </div>
                        <span className="text-xs font-medium text-red-700">{errorMsg}</span>
                    </div>
                    <button onClick={() => setErrorMsg("")} className="text-red-400 hover:text-red-600">
                        <span className="text-xs">✕</span>
                    </button>
                </div>
            )}

            {/* SUCCESS BANNER */}
            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
                    <span>✓</span> {success}
                </div>
            )}

            {/* FORM CARD */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-800">Sitemap</h3>
                </div>
                <div className="p-6 space-y-5 max-w-3xl">

                    {/* Filename */}
                    <FieldRow label="Filename" required hint="example: sitemap.xml">
                        <input type="text" value={filename}
                            onChange={e => setFilename(e.target.value)}
                            onBlur={() => setTouched(true)}
                            placeholder="sitemap.xml"
                            className={inputClass(filenameErr)} />
                        {filenameErr && (
                            <div className="mt-1.5 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
                                <p className="text-xs text-amber-700">This is a required field.</p>
                            </div>
                        )}
                    </FieldRow>

                    {/* Path */}
                    <FieldRow label="Path" required hint={`example: "/media/sitemap/" for base path (path must be writeable)`}>
                        <input type="text" value={path}
                            onChange={e => setPath(e.target.value)}
                            onBlur={() => setTouched(true)}
                            placeholder="/media/sitemap/"
                            className={inputClass(pathErr)} />
                        {pathErr && (
                            <div className="mt-1.5 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
                                <p className="text-xs text-amber-700">This is a required field.</p>
                            </div>
                        )}
                    </FieldRow>

                    {/* Store View */}
                    <FieldRow label="Store View" required>
                        <div className="flex items-center gap-2">
                            <select value={storeView} onChange={e => setStoreView(e.target.value)}
                                className={inputClass()}>
                                {storeViews.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <FaQuestionCircle className="text-gray-400 text-sm flex-shrink-0"
                                title="Select the store view for this sitemap" />
                        </div>
                    </FieldRow>

                </div>
            </div>
        </div>
    );
};

export default AddMagentoSitemap;