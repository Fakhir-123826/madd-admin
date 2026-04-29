// src/screens/MLM/AgentForm.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import {
    useGetAgentQuery,
    useCreateAgentMutation,
    useUpdateAgentMutation,
    useGetAgentsQuery,
} from "../../app/api/MlmSlices/MlmApi";

const TERRITORY_TYPES = ["country", "region", "city"] as const;
const STATUS_OPTIONS  = ["active", "inactive", "suspended"] as const;

const AgentForm = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id?: string }>();
    const isEdit = Boolean(id);

    const { data: agentData, isLoading: loadingAgent } = useGetAgentQuery(Number(id), { skip: !isEdit });
    const { data: agentsData } = useGetAgentsQuery({ per_page: 200 });

    const [createAgent, { isLoading: creating }] = useCreateAgentMutation();
    const [updateAgent, { isLoading: updating }]  = useUpdateAgentMutation();

    const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [form, setForm] = useState({
        user_id:         "",
        parent_id:       "",
        level:           "1",
        territory_type:  "country" as typeof TERRITORY_TYPES[number],
        territory_code:  "",
        commission_rate: "",
        phone:           "",
        status:          "active" as typeof STATUS_OPTIONS[number],
    });

    // Populate form when editing
    useEffect(() => {
        if (isEdit && agentData?.data) {
            const a = agentData.data;
            setForm({
                user_id:         String(a.user_id ?? ""),
                parent_id:       String(a.parent_id ?? ""),
                level:           String(a.level ?? "1"),
                territory_type:  a.territory_type ?? "country",
                territory_code:  a.territory_code ?? "",
                commission_rate: String(a.commission_rate ?? ""),
                phone:           a.phone ?? "",
                status:          a.status ?? "active",
            });
        }
    }, [agentData, isEdit]);

    const showToast = (type: "success" | "error", msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3500);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!isEdit && !form.user_id)         errs.user_id         = "User ID is required";
        if (!form.level)                       errs.level           = "Level is required";
        if (!form.territory_type)              errs.territory_type  = "Territory type is required";
        if (!form.territory_code.trim())       errs.territory_code  = "Territory code is required";
        if (!form.commission_rate)             errs.commission_rate = "Commission rate is required";
        if (Number(form.commission_rate) < 0 || Number(form.commission_rate) > 100) {
            errs.commission_rate = "Must be between 0 and 100";
        }
        return errs;
    };

    const handleSubmit = async () => {
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        const payload: Record<string, any> = {
            level:           Number(form.level),
            territory_type:  form.territory_type,
            territory_code:  form.territory_code.toUpperCase(),
            commission_rate: Number(form.commission_rate),
            phone:           form.phone || null,
            status:          form.status,
        };
        if (form.parent_id) payload.parent_id = Number(form.parent_id);
        if (!isEdit) payload.user_id = Number(form.user_id);

        try {
            if (isEdit) {
                await updateAgent({ id: Number(id), data: payload }).unwrap();
                showToast("success", "Agent updated successfully");
            } else {
                await createAgent(payload).unwrap();
                showToast("success", "Agent created successfully");
                setTimeout(() => navigate("/mlm/agents"), 1000);
            }
        } catch (error: any) {
            const serverErrors = error?.data?.errors;
            if (serverErrors) {
                const mapped: Record<string, string> = {};
                Object.keys(serverErrors).forEach(k => { mapped[k] = serverErrors[k][0]; });
                setErrors(mapped);
            }
            showToast("error", error?.data?.message || "Something went wrong");
        }
    };

    if (isEdit && loadingAgent) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-teal-500" />
            </div>
        );
    }

    const allAgents = agentsData?.data ?? [];
    const isSaving  = creating || updating;

    const Field = ({
        label, name, type = "text", placeholder, required,
    }: { label: string; name: string; type?: string; placeholder?: string; required?: boolean }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                name={name}
                value={(form as any)[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className={`w-full px-3 py-2 rounded-xl border text-sm focus:ring-2 focus:ring-teal-400 outline-none
                    ${errors[name] ? "border-red-400 bg-red-50" : "border-gray-200"}`}
            />
            {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
        </div>
    );

    return (
        <div className="mx-auto space-y-6">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
                    ${toast.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                    <span>{toast.type === "success" ? "✓" : "✕"}</span>
                    {toast.msg}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center gap-3">
                <button onClick={() => navigate("/mlm/agents")}
                    className="h-9 w-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-teal-500 transition">
                    <FaArrowLeft className="text-sm" />
                </button>
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">{isEdit ? "Edit Agent" : "Add New Agent"}</h2>
                    <p className="text-sm text-gray-500">{isEdit ? "Update agent information" : "Create a new MLM agent"}</p>
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-teal-400 to-green-400" />
                <div className="p-6 space-y-5">

                    {/* User ID — only for create */}
                    {!isEdit && (
                        <Field label="User ID" name="user_id" type="number" placeholder="e.g. 42" required />
                    )}

                    {/* Parent Agent */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Parent Agent</label>
                        <select name="parent_id" value={form.parent_id} onChange={handleChange}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-teal-400 outline-none">
                            <option value="">— No parent (root agent) —</option>
                            {allAgents
                                .filter(a => !isEdit || a.id !== Number(id))
                                .map(a => (
                                    <option key={a.id} value={a.id}>
                                        {a.user?.full_name ?? `Agent #${a.id}`} (Level {a.level})
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    {/* Level + Commission Rate */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Level <span className="text-red-500">*</span></label>
                            <select name="level" value={form.level} onChange={handleChange}
                                className={`w-full px-3 py-2 rounded-xl border text-sm focus:ring-2 focus:ring-teal-400 outline-none
                                    ${errors.level ? "border-red-400 bg-red-50" : "border-gray-200"}`}>
                                {[1, 2, 3, 4, 5, 6].map(l => (
                                    <option key={l} value={l}>Level {l}</option>
                                ))}
                            </select>
                            {errors.level && <p className="text-red-500 text-xs mt-1">{errors.level}</p>}
                        </div>
                        <Field label="Commission Rate (%)" name="commission_rate" type="number" placeholder="e.g. 5" required />
                    </div>

                    {/* Territory */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Territory Type <span className="text-red-500">*</span></label>
                            <select name="territory_type" value={form.territory_type} onChange={handleChange}
                                className={`w-full px-3 py-2 rounded-xl border text-sm focus:ring-2 focus:ring-teal-400 outline-none
                                    ${errors.territory_type ? "border-red-400 bg-red-50" : "border-gray-200"}`}>
                                {TERRITORY_TYPES.map(t => (
                                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                                ))}
                            </select>
                            {errors.territory_type && <p className="text-red-500 text-xs mt-1">{errors.territory_type}</p>}
                        </div>
                        <Field label="Territory Code" name="territory_code" placeholder="e.g. PK, US, NY" required />
                    </div>

                    {/* Phone + Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Phone" name="phone" type="tel" placeholder="+1 555 000 0000" />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select name="status" value={form.status} onChange={handleChange}
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-teal-400 outline-none">
                                {STATUS_OPTIONS.map(s => (
                                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-3 pt-2">
                        <button onClick={() => navigate("/mlm/agents")}
                            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition">
                            Cancel
                        </button>
                        <button onClick={handleSubmit} disabled={isSaving}
                            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-green-400 text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2">
                            {isSaving ? (
                                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                            ) : (
                                <FaSave className="text-xs" />
                            )}
                            {isSaving ? "Saving…" : isEdit ? "Update Agent" : "Create Agent"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentForm;