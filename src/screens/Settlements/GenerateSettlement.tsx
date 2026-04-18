import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaSave, FaSpinner, FaCalendarAlt, FaUser, FaCheckCircle } from "react-icons/fa";
import { useGenerateSettlementMutation } from "../../app/api/SettlementSlices/SettlementApi";

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
    <div className="flex items-center gap-3 mb-5">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-teal-400 to-green-400 flex items-center justify-center text-white shadow-sm">
            {icon}
        </div>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-widest">{title}</h3>
        <div className="flex-1 h-px bg-gradient-to-r from-teal-100 to-transparent" />
    </div>
);

const Field = ({
    label, name, value, onChange, type = "text", placeholder, required, hint,
}: {
    label: string; name: string; value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string; placeholder?: string; required?: boolean; hint?: string;
}) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {label} {required && <span className="text-teal-500">*</span>}
        </label>
        <input
            type={type} name={name} value={value} onChange={onChange}
            placeholder={placeholder} required={required}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700
                       bg-white focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-400
                       placeholder:text-gray-300 transition"
        />
        {hint && <p className="text-xs text-gray-400 pl-1">{hint}</p>}
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const GenerateSettlement = () => {
    const navigate = useNavigate();
    const [generate, { isLoading }] = useGenerateSettlementMutation();

    const [form, setForm] = useState({
        vendor_id:    "",   // nullable|exists:vendors,uuid — UUID string not int
        period_start: "",   // required|date
        period_end:   "",   // required|date|after:period_start
    });

    const [result, setResult] = useState<{
        generated: { vendor: string; settlement_id: number; amount: number }[];
        generated_count: number;
        errors: string[];
    } | null>(null);

    const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    const showToast = (type: "success" | "error", msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3500);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side: period_end must be after period_start
        if (form.period_end <= form.period_start) {
            showToast("error", "Period end must be after period start.");
            return;
        }

        try {
            const payload = {
                period_start: form.period_start,
                period_end:   form.period_end,
                // Only include vendor_id if filled — controller: nullable|exists:vendors,uuid
                ...(form.vendor_id.trim() ? { vendor_id: form.vendor_id.trim() } : {}),
            };

            const res = await generate(payload).unwrap();
            setResult(res.data);
            showToast("success", `Generated ${res.data.generated_count} settlement(s) successfully!`);
        } catch {
            showToast("error", "Failed to generate settlement. Please check the details.");
        }
    };

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="bg-white min-h-screen">

            {/* Toast */}
            {toast && (
                <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
                    ${toast.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                    <span>{toast.type === "success" ? "✓" : "✕"}</span>
                    {toast.msg}
                </div>
            )}

            {/* Page Header */}
            <div className="px-6 pt-6 pb-4 flex items-center gap-4 border-b border-gray-100">
                <button onClick={() => navigate("/settlements")}
                    className="h-9 w-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-teal-600 hover:border-teal-300 transition">
                    <FaChevronLeft className="text-xs" />
                </button>
                <div>
                    <h1 className="text-lg font-semibold text-gray-800">Generate Settlement</h1>
                    <p className="text-xs text-gray-400 mt-0.5">Create new settlements for a vendor or all active vendors</p>
                </div>
            </div>

            <div className="p-6 max-w-2xl space-y-6">

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Vendor UUID */}
                    <div>
                        <SectionHeader icon={<FaUser className="text-xs" />} title="Vendor (Optional)" />
                        <Field
                            label="Vendor UUID" name="vendor_id"
                            value={form.vendor_id} onChange={handleChange}
                            placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                            hint="Leave blank to generate for all active vendors. Must be a valid vendor UUID."
                        />
                    </div>

                    {/* Period */}
                    <div>
                        <SectionHeader icon={<FaCalendarAlt className="text-xs" />} title="Settlement Period" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Field
                                label="Period Start" name="period_start"
                                value={form.period_start} onChange={handleChange}
                                type="date" required
                            />
                            <Field
                                label="Period End" name="period_end"
                                value={form.period_end} onChange={handleChange}
                                type="date" required
                                hint="Must be after period start."
                            />
                        </div>
                    </div>

                    {/* Info box */}
                    <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4 text-sm text-teal-700 space-y-1">
                        <p className="font-medium">How it works</p>
                        <p className="text-xs text-teal-600 leading-relaxed">
                            The system calculates all completed orders in the period, deducts platform fees,
                            and creates settlement records with <strong>pending</strong> status.
                            If a settlement already exists for a vendor in this period, it will be skipped.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <button type="submit" disabled={isLoading}
                            className="flex items-center gap-2.5 px-6 py-2.5 rounded-xl
                                       bg-gradient-to-r from-teal-400 to-green-400 text-white text-sm font-medium
                                       shadow hover:shadow-md hover:from-teal-500 hover:to-green-500
                                       disabled:opacity-60 transition">
                            {isLoading ? <FaSpinner className="animate-spin text-xs" /> : <FaSave className="text-xs" />}
                            Generate Settlement
                        </button>
                        <button type="button" onClick={() => navigate("/settlements")}
                            className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300 transition">
                            Cancel
                        </button>
                    </div>
                </form>

                {/* Result — show generated list & errors after success */}
                {result && (
                    <div className="space-y-4">
                        {result.generated.length > 0 && (
                            <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
                                <p className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-3">
                                    Generated ({result.generated_count})
                                </p>
                                <div className="space-y-2">
                                    {result.generated.map(g => (
                                        <div key={g.settlement_id} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <FaCheckCircle className="text-green-500 text-xs" />
                                                <span className="text-gray-700">{g.vendor}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-green-600 font-semibold">
                                                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(g.amount)}
                                                </span>
                                                <button
                                                    onClick={() => navigate(`/settlements/${g.settlement_id}`)}
                                                    className="text-xs text-teal-500 hover:underline"
                                                >
                                                    View →
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {result.errors.length > 0 && (
                            <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                                <p className="text-xs font-semibold text-red-400 uppercase tracking-widest mb-3">
                                    Skipped / Errors ({result.errors.length})
                                </p>
                                <ul className="space-y-1.5">
                                    {result.errors.map((err, i) => (
                                        <li key={i} className="text-xs text-red-500 flex gap-2">
                                            <span>•</span>{err}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenerateSettlement;