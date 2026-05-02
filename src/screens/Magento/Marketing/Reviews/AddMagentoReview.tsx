import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaStar } from "react-icons/fa";

const storeViews = [
    "Main Website",
    "Main Website Store",
    "Default Store View",
    "neo.exp",
    "raw mart",
    "nina",
];

// Read-only info row
const InfoRow = ({ label, value, alt }: { label: string; value: React.ReactNode; alt?: boolean }) => (
    <div className={`grid grid-cols-4 items-start gap-4 px-6 py-3 ${alt ? "bg-gray-50" : "bg-white"}`}>
        <p className="text-xs font-semibold text-gray-500 text-right pt-0.5">{label}</p>
        <div className="col-span-3 text-xs text-gray-800">{value}</div>
    </div>
);

// Editable field row
const FieldRow = ({ label, required, children, hint }: {
    label: string; required?: boolean; children: React.ReactNode; hint?: string;
}) => (
    <div className="grid grid-cols-4 items-start gap-4 px-6 py-3">
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

const inputClass = (err?: boolean) =>
    `w-full px-3 py-2.5 rounded-xl border text-xs text-gray-700 outline-none transition-all bg-gray-50 focus:bg-white
    ${err ? "border-red-300" : "border-gray-200 focus:border-teal-400"}`;

const StarPicker = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
    <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(s => (
            <button key={s} type="button" onClick={() => onChange(s)}>
                <FaStar className={`text-lg transition-colors ${s <= value ? "text-amber-400" : "text-gray-200 hover:text-amber-300"}`} />
            </button>
        ))}
    </div>
);

const AddMagentoReview = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [touched, setTouched] = useState(false);
    const [success, setSuccess] = useState("");

    // Read-only fields (from product/order data)
    const product = "Luma Analog Watch";
    const author = "Guest";
    const summaryRating = 4;

    // Editable fields
    const [detailedRating, setDetailedRating] = useState(4);
    const [status, setStatus] = useState("Approved");
    const [visibility, setVisibility] = useState<string[]>(["Main Website", "Main Website Store", "Default Store View"]);
    const [nickname, setNickname] = useState(isEdit ? "joette" : "");
    const [summaryOfReview, setSummaryOfReview] = useState(isEdit ? "Has been through quite a few adventures" : "");
    const [review, setReview] = useState(isEdit ? "Has been through quite a few adventures and vacations with me and still looks and runs great. That includes plenty of trips to water parks with the kids!" : "");

    const nicknameErr = touched && !nickname.trim();
    const summaryErr = touched && !summaryOfReview.trim();
    const reviewErr = touched && !review.trim();

    const toggleVisibility = (val: string) => {
        setVisibility(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
    };

    const handleSave = () => {
        setTouched(true);
        if (!nickname.trim() || !summaryOfReview.trim() || !review.trim()) return;
        setSuccess(`Review has been ${isEdit ? "updated" : "saved"} successfully!`);
        setTimeout(() => navigate("/MagentoReviewsList"), 1500);
    };

    return (
        <div className="space-y-5">

            {/* TOP BAR */}
            <div className="bg-white rounded-xl shadow-sm px-6 py-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate("/MagentoReviewsList")}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-gray-500 text-xs hover:bg-gray-50 transition-all">
                        <FaArrowLeft className="text-xs" /> Back
                    </button>
                    <div>
                        <h2 className="text-base font-semibold text-gray-800">
                            {isEdit ? "Edit Review" : "New Review"}
                        </h2>
                        <p className="text-xs text-gray-400 mt-0.5">Product Reviews Management</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => { setNickname(""); setSummaryOfReview(""); setReview(""); setTouched(false); }}
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
                        Save Review
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
                    <h3 className="text-sm font-semibold text-gray-800">Review Information</h3>
                </div>

                <div className="divide-y divide-gray-50 pb-4">

                    {/* READ-ONLY: Product */}
                    <InfoRow label="Product" alt={false}
                        value={<span className="text-blue-500 font-medium">{product}</span>} />

                    {/* READ-ONLY: Author */}
                    <InfoRow label="Author" alt={true} value={author} />

                    {/* READ-ONLY: Summary Rating */}
                    <InfoRow label="Summary Rating" alt={false}
                        value={
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <FaStar key={s} className={`text-sm ${s <= summaryRating ? "text-amber-400" : "text-gray-200"}`} />
                                ))}
                            </div>
                        } />

                    {/* EDITABLE: Detailed Rating */}
                    <FieldRow label="Detailed Rating" required>
                        <div className="space-y-2">
                            <div className="flex items-center gap-4">
                                <span className="text-xs text-gray-500 w-16">Rating</span>
                                <StarPicker value={detailedRating} onChange={setDetailedRating} />
                            </div>
                        </div>
                    </FieldRow>

                    {/* EDITABLE: Status */}
                    <FieldRow label="Status" required>
                        <select value={status} onChange={e => setStatus(e.target.value)}
                            className={inputClass()}>
                            <option>Approved</option>
                            <option>Pending</option>
                            <option>Not Approved</option>
                        </select>
                    </FieldRow>

                    {/* EDITABLE: Visibility */}
                    <FieldRow label="Visibility" required>
                        <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                            {storeViews.map((sv, i) => (
                                <label key={sv}
                                    className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-blue-50/40 transition-all
                                        ${i !== storeViews.length - 1 ? "border-b border-gray-100" : ""}`}>
                                    <input type="checkbox"
                                        checked={visibility.includes(sv)}
                                        onChange={() => toggleVisibility(sv)}
                                        className="accent-teal-500 w-3.5 h-3.5 flex-shrink-0" />
                                    <span className="text-xs text-gray-700">{sv}</span>
                                </label>
                            ))}
                        </div>
                    </FieldRow>

                    {/* EDITABLE: Nickname */}
                    <FieldRow label="Nickname" required>
                        <input type="text" value={nickname}
                            onChange={e => setNickname(e.target.value)}
                            onBlur={() => setTouched(true)}
                            className={inputClass(nicknameErr)} />
                        {nicknameErr && (
                            <div className="mt-1.5 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
                                <p className="text-xs text-amber-700">This is a required field.</p>
                            </div>
                        )}
                    </FieldRow>

                    {/* EDITABLE: Summary of Review */}
                    <FieldRow label="Summary of Review" required>
                        <input type="text" value={summaryOfReview}
                            onChange={e => setSummaryOfReview(e.target.value)}
                            onBlur={() => setTouched(true)}
                            className={inputClass(summaryErr)} />
                        {summaryErr && (
                            <div className="mt-1.5 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
                                <p className="text-xs text-amber-700">This is a required field.</p>
                            </div>
                        )}
                    </FieldRow>

                    {/* EDITABLE: Review */}
                    <FieldRow label="Review" required>
                        <textarea value={review}
                            onChange={e => setReview(e.target.value)}
                            onBlur={() => setTouched(true)}
                            rows={6}
                            className={`${inputClass(reviewErr)} resize-none`} />
                        {reviewErr && (
                            <div className="mt-1.5 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
                                <p className="text-xs text-amber-700">This is a required field.</p>
                            </div>
                        )}
                    </FieldRow>

                </div>
            </div>
        </div>
    );
};

export default AddMagentoReview;
