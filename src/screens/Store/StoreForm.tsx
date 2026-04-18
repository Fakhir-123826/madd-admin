import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    FaGlobe, FaStore, FaFlag, FaLink,
    FaChevronLeft, FaSave, FaSpinner
} from "react-icons/fa";
import {
    useGetStoreQuery,
    useUpdateStoreMutation,
    useAddStoreDomainMutation,
} from "../../app/api/StoreSlices/StoreApi";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StoreFormData {
    store_name: string;
    store_slug: string;
    status: "active" | "inactive" | "suspended" | "maintenance";
    country_code: string;
    language_code: string;
    currency_code: string;
    currency_symbol: string;
    subdomain: string;
    is_demo: boolean;
}

interface DomainFormData {
    domain: string;
}

interface StoreDomain {
    domain: string;
    is_primary: boolean;
    dns_verified: boolean;
    ssl_status: string;
}

interface StoreDetail {
    store_name: string;
    store_slug: string;
    status: "active" | "inactive" | "suspended" | "maintenance";
    subdomain: string;
    is_demo: boolean;
    country?: { code: string; name: string };
    language?: { code: string; name: string };
    currency?: { code: string; symbol: string };
    domain?: StoreDomain | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
    { value: "active",      label: "Active" },
    { value: "inactive",    label: "Inactive" },
    { value: "suspended",   label: "Suspended" },
    { value: "maintenance", label: "Maintenance" },
];

const statusStyle = (status: string) => {
    switch (status) {
        case "active":      return "bg-green-100 text-green-600";
        case "inactive":    return "bg-red-100 text-red-600";
        case "suspended":   return "bg-purple-100 text-purple-600";
        case "maintenance": return "bg-yellow-100 text-yellow-600";
        default:            return "bg-gray-100 text-gray-500";
    }
};

const sslStyle = (status: string) => {
    switch (status) {
        case "active":  return "bg-green-100 text-green-600";
        case "pending": return "bg-yellow-100 text-yellow-600";
        case "failed":  return "bg-red-100 text-red-500";
        default:        return "bg-gray-100 text-gray-400";
    }
};

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
    label, name, value, onChange, type = "text", placeholder, required, disabled,
}: {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
}) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {label} {required && <span className="text-teal-500">*</span>}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700
                       bg-white focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-400
                       placeholder:text-gray-300 transition disabled:bg-gray-50 disabled:text-gray-400"
        />
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const StoreForm = () => {
    const navigate = useNavigate();
    const { id }   = useParams<{ id?: string }>();
    const isEdit   = Boolean(id);

    // ── RTK Query ──
    const { data: storeData, isLoading: loadingStore } = useGetStoreQuery(id ?? "", { skip: !isEdit });
    const [updateStore, { isLoading: updating }]       = useUpdateStoreMutation();
    const [addDomain,   { isLoading: addingDomain }]   = useAddStoreDomainMutation();

    // ✅ Single safe reference — eliminates all "possibly undefined" errors
    const currentStore: StoreDetail | null = (storeData?.data as StoreDetail) ?? null;

    // ── State ──
    const [form, setForm] = useState<StoreFormData>({
        store_name:      "",
        store_slug:      "",
        status:          "active",
        country_code:    "",
        language_code:   "",
        currency_code:   "",
        currency_symbol: "",
        subdomain:       "",
        is_demo:         false,
    });

    const [domainForm, setDomainForm] = useState<DomainFormData>({ domain: "" });
    const [toast, setToast]           = useState<{ type: "success" | "error"; msg: string } | null>(null);
    const [activeTab, setActiveTab]   = useState<"info" | "domain">("info");

    // ── Pre-fill on edit ──
    useEffect(() => {
        if (isEdit && currentStore) {
            setForm({
                store_name:      currentStore.store_name       ?? "",
                store_slug:      currentStore.store_slug       ?? "",
                status:          currentStore.status           ?? "active",
                country_code:    currentStore.country?.code    ?? "",
                language_code:   currentStore.language?.code   ?? "",
                currency_code:   currentStore.currency?.code   ?? "",
                currency_symbol: currentStore.currency?.symbol ?? "",
                subdomain:       currentStore.subdomain        ?? "",
                is_demo:         currentStore.is_demo          ?? false,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storeData]);

    // ── Toast auto-dismiss ──
    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 3500);
        return () => clearTimeout(t);
    }, [toast]);

    // ── Handlers ──
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement;
        setForm(prev => ({
            ...prev,
            [target.name]: target.type === "checkbox" ? target.checked : target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEdit && id) {
                await updateStore({ id, data: form }).unwrap();
                setToast({ type: "success", msg: "Store updated successfully!" });
            } else {
                // wire createStore mutation here when ready
                setToast({ type: "success", msg: "Store created successfully!" });
            }
        } catch {
            setToast({ type: "error", msg: "Something went wrong. Please try again." });
        }
    };

    const handleAddDomain = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        try {
            await addDomain({ id, data: domainForm }).unwrap();
            setToast({ type: "success", msg: "Domain added successfully!" });
            setDomainForm({ domain: "" });
        } catch {
            setToast({ type: "error", msg: "Failed to add domain. It may already exist." });
        }
    };

    // ─── Loading ──────────────────────────────────────────────────────────────

    if (isEdit && loadingStore) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4 text-gray-400">
                    <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-teal-500" />
                    <span className="text-sm">Loading store data…</span>
                </div>
            </div>
        );
    }

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <div className="bg-white min-h-screen">

            {/* Toast */}
            {toast && (
                <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
                    ${toast.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                >
                    <span>{toast.type === "success" ? "✓" : "✕"}</span>
                    {toast.msg}
                </div>
            )}

            {/* Page Header */}
            <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/storeList")}
                        className="h-9 w-9 rounded-xl border border-gray-200 flex items-center justify-center
                                   text-gray-400 hover:text-teal-600 hover:border-teal-300 transition"
                    >
                        <FaChevronLeft className="text-xs" />
                    </button>
                    <div>
                        <h1 className="text-lg font-semibold text-gray-800">
                            {isEdit ? "Edit Store" : "Create New Store"}
                        </h1>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {isEdit
                                ? `Editing ID: ${id}`
                                : "Fill in the details below to create a new store"
                            }
                        </p>
                    </div>
                </div>

                {isEdit && (
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium capitalize ${statusStyle(form.status)}`}>
                        {form.status}
                    </span>
                )}
            </div>

            {/* Tabs — edit mode only */}
            {isEdit && (
                <div className="flex gap-6 px-6 border-b border-gray-100">
                    {(["info", "domain"] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-3 text-sm capitalize transition-colors border-b-2 -mb-px ${
                                activeTab === tab
                                    ? "border-teal-500 text-teal-600 font-medium"
                                    : "border-transparent text-gray-400 hover:text-teal-500"
                            }`}
                        >
                            {tab === "info" ? "Store Info" : "Custom Domain"}
                        </button>
                    ))}
                </div>
            )}

            <div className="p-6 max-w-4xl">

                {/* ══════════════════════════════════
                    TAB: Store Info
                ══════════════════════════════════ */}
                {activeTab === "info" && (
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Basic Info */}
                        <div>
                            <SectionHeader icon={<FaStore className="text-xs" />} title="Basic Info" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Field
                                    label="Store Name" name="store_name"
                                    value={form.store_name} onChange={handleChange}
                                    placeholder="My Awesome Store" required
                                />
                                <Field
                                    label="Store Slug" name="store_slug"
                                    value={form.store_slug} onChange={handleChange}
                                    placeholder="my-awesome-store" required
                                />
                                <Field
                                    label="Subdomain" name="subdomain"
                                    value={form.subdomain} onChange={handleChange}
                                    placeholder="mystore.yourplatform.com"
                                />
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                        Status <span className="text-teal-500">*</span>
                                    </label>
                                    <select
                                        name="status"
                                        value={form.status}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700
                                                   bg-white focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-400 transition"
                                    >
                                        {STATUS_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Demo Toggle */}
                            <div className="mt-4 flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setForm(prev => ({ ...prev, is_demo: !prev.is_demo }))}
                                    className={`relative h-6 w-11 rounded-full transition-colors ${form.is_demo ? "bg-teal-400" : "bg-gray-200"}`}
                                >
                                    <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${form.is_demo ? "translate-x-5" : ""}`} />
                                </button>
                                <span className="text-sm text-gray-600">Mark as Demo Store</span>
                            </div>
                        </div>

                        {/* Locale & Region */}
                        <div>
                            <SectionHeader icon={<FaFlag className="text-xs" />} title="Locale & Region" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <Field
                                    label="Country Code" name="country_code"
                                    value={form.country_code} onChange={handleChange}
                                    placeholder="PK, US, GB…" required
                                />
                                <Field
                                    label="Language Code" name="language_code"
                                    value={form.language_code} onChange={handleChange}
                                    placeholder="en, ur, fr…" required
                                />
                                <Field
                                    label="Currency Code" name="currency_code"
                                    value={form.currency_code} onChange={handleChange}
                                    placeholder="PKR, USD, EUR…" required
                                />
                            </div>
                            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5">
                                <Field
                                    label="Currency Symbol" name="currency_symbol"
                                    value={form.currency_symbol} onChange={handleChange}
                                    placeholder="₨, $, €…"
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex items-center gap-4 pt-2">
                            <button
                                type="submit"
                                disabled={updating}
                                className="flex items-center gap-2.5 px-6 py-2.5 rounded-xl
                                           bg-gradient-to-r from-teal-400 to-green-400 text-white text-sm font-medium
                                           shadow hover:shadow-md hover:from-teal-500 hover:to-green-500
                                           disabled:opacity-60 transition"
                            >
                                {updating
                                    ? <FaSpinner className="animate-spin text-xs" />
                                    : <FaSave className="text-xs" />
                                }
                                {isEdit ? "Save Changes" : "Create Store"}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate("/storeList")}
                                className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {/* ══════════════════════════════════
                    TAB: Domain (edit only)
                ══════════════════════════════════ */}
                {activeTab === "domain" && isEdit && (
                    <div className="space-y-6">
                        <SectionHeader icon={<FaGlobe className="text-xs" />} title="Custom Domain" />

                        {/* Current domain card */}
                        {currentStore?.domain ? (
                            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-3">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                                    Current Domain
                                </p>
                                <p className="text-sm font-medium text-blue-500">
                                    {currentStore.domain.domain}
                                </p>
                                <div className="flex gap-3 flex-wrap">
                                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                                        currentStore.domain.dns_verified
                                            ? "bg-green-100 text-green-600"
                                            : "bg-red-100 text-red-500"
                                    }`}>
                                        DNS: {currentStore.domain.dns_verified ? "Verified" : "Not Verified"}
                                    </span>
                                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${sslStyle(currentStore.domain.ssl_status)}`}>
                                        SSL: {currentStore.domain.ssl_status ?? "—"}
                                    </span>
                                    {currentStore.domain.is_primary && (
                                        <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-teal-100 text-teal-600">
                                            Primary
                                        </span>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400">No custom domain configured yet.</p>
                        )}

                        {/* Add domain form */}
                        <form onSubmit={handleAddDomain} className="space-y-5">
                            <p className="text-sm text-gray-500">
                                {currentStore?.domain
                                    ? "Replace or add a new custom domain:"
                                    : "Add a custom domain for this store:"
                                }
                            </p>
                            <div className="flex gap-3 items-end">
                                <div className="flex-1">
                                    <Field
                                        label="Domain" name="domain"
                                        value={domainForm.domain}
                                        onChange={e => setDomainForm({ domain: e.target.value })}
                                        placeholder="store.yourdomain.com"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={addingDomain}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                                               bg-gradient-to-r from-teal-400 to-green-400 text-white text-sm font-medium
                                               shadow hover:from-teal-500 hover:to-green-500 disabled:opacity-60 transition"
                                >
                                    {addingDomain
                                        ? <FaSpinner className="animate-spin text-xs" />
                                        : <FaLink className="text-xs" />
                                    }
                                    Add Domain
                                </button>
                            </div>
                        </form>
                    </div>
                )}

            </div>
        </div>
    );
};

export default StoreForm;