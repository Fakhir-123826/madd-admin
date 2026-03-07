import { useState, useEffect } from "react";
import axios from "axios";
import { FaChevronDown, FaGlobe } from "react-icons/fa";
import type { Store, StoreView, StoreViewSelection, Website } from "../model/MagentoProduct/StoreViewSelection";

// ============ INTERFACES ============





interface StoreViewDropdownProps {
    onChange?: (selection: StoreViewSelection) => void;
}

// ============ COMPONENT ============
export default function StoreViewDropdown({ onChange }: StoreViewDropdownProps) {
    const [open, setOpen] = useState(false);
    const [websites, setWebsites] = useState<Website[]>([]);
    const [stores, setStores] = useState<Store[]>([]);
    const [storeViews, setStoreViews] = useState<StoreView[]>([]);
    const [selected, setSelected] = useState<StoreViewSelection>({ type: "all" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("admin_token");
                const headers = { Authorization: `Bearer ${token}` };
                const base = "http://127.0.0.1:8000/api";

                const [w, s, sv] = await Promise.all([
                    axios.get(`${base}/websites`, { headers }),
                    axios.get(`${base}/stores`, { headers }),
                    axios.get(`${base}/store-views`, { headers }),
                ]);

                setWebsites(w.data?.data || []);
                setStores(s.data?.data || []);
                setStoreViews(sv.data?.data || []);
            } catch (err) {
                console.error("StoreViewDropdown fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const getLabel = () => {
        if (selected.type === "all") return "All Store Views";
        if (selected.type === "website") return selected.website.name;
        if (selected.type === "store") return selected.store.name;
        if (selected.type === "storeView") return selected.storeView.name;
    };

    const handleSelect = (sel: StoreViewSelection) => {
        setSelected(sel);
        onChange?.(sel);
        setOpen(false);
    };

    return (
        <div className="relative inline-block">
            {/* Trigger Button */}
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors min-w-[180px] justify-between"
            >
                <div className="flex items-center gap-2">
                    <FaGlobe className="text-teal-500" />
                    <span>{loading ? "Loading..." : getLabel()}</span>
                </div>
                <FaChevronDown className={`text-xs transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {/* Backdrop */}
            {open && (
                <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            )}

            {/* Dropdown */}
            {open && (
                <div className="absolute left-0 top-12 z-50 bg-white rounded-xl shadow-lg border border-gray-100 w-64 overflow-hidden">

                    {/* All Store Views */}
                    <div
                        onClick={() => handleSelect({ type: "all" })}
                        className={`px-4 py-3 text-sm hover:bg-gray-50 transition font-semibold
              ${selected.type === "all" ? "text-teal-600 bg-teal-50" : "text-gray-700"}`}
                    >
                        All Store Views
                    </div>

                    {/* Websites → Stores → Store Views */}
                    {websites
                        .filter((w) => w.id !== 0) // Admin website hide karo
                        .map((website) => (
                            <div key={website.id}>

                                {/* Website Level */}
                                <div
                                    // onClick={() => handleSelect({ type: "website", website })}
                                    className={`px-4 py-2 text-sm hover:bg-gray-50 transition border-t border-gray-100 font-semibold
                    ${selected.type === "website" && selected.website.id === website.id
                                            ? "text-teal-600 bg-teal-50"
                                            : "text-gray-800"}`}
                                >
                                    {website.name}
                                </div>

                                {/* Stores under this website */}
                                {stores
                                    .filter((s) => s.website_id === website.id && s.id !== 0)
                                    .map((store) => (
                                        <div key={store.id}>

                                            {/* Store Level */}
                                            <div
                                                // onClick={() => handleSelect({ type: "store", store })}
                                                className={`pl-8 pr-4 py-2 text-sm hover:bg-gray-50 transition font-medium
                          ${selected.type === "store" && selected.store.id === store.id
                                                        ? "text-teal-600 bg-teal-50"
                                                        : "text-gray-600"}`}
                                            >
                                                {store.name}
                                            </div>

                                            {/* Store Views under this store */}
                                            {storeViews
                                                .filter((sv) => sv.store_group_id === store.store_group_id && sv.id !== 0)
                                                .map((sv) => (
                                                    <div
                                                        key={sv.id}
                                                        onClick={() => handleSelect({ type: "storeView", storeView: sv })}
                                                        className={`pl-12 pr-4 py-2 text-xs cursor-pointer hover:bg-gray-50 transition
                              ${selected.type === "storeView" && selected.storeView.id === sv.id
                                                                ? "text-teal-600 bg-teal-50 font-semibold"
                                                                : "text-gray-500"}`}
                                                    >
                                                        {sv.name}
                                                    </div>
                                                ))}
                                        </div>
                                    ))}
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}