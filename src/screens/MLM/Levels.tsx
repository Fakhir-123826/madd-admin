// src/screens/MLM/Levels.tsx
import { useEffect, useState } from "react";
import { FaSync, FaSave, FaLayerGroup } from "react-icons/fa";
import {
    useGetMlmLevelsQuery,
    useUpdateMlmLevelsMutation,
    type MlmLevel,
} from "../../app/api/MlmSlices/MlmApi";

const Levels = () => {
    const { data, isLoading, refetch } = useGetMlmLevelsQuery();
    const [updateMlmLevels, { isLoading: saving }] = useUpdateMlmLevelsMutation();

    const [levels, setLevels] = useState<MlmLevel[]>([]);
    const [dirty, setDirty] = useState(false);
    const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    useEffect(() => {
        if (data?.data) {
            setLevels(JSON.parse(JSON.stringify(data.data))); // deep clone
            setDirty(false);
        }
    }, [data]);

    const showToast = (type: "success" | "error", msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3000);
    };

    const handleChange = (index: number, field: keyof MlmLevel, value: string) => {
        setLevels(prev => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: Number(value) };
            return next;
        });
        setDirty(true);
    };

    const handleSave = async () => {
        try {
            await updateMlmLevels(levels).unwrap();
            showToast("success", "Levels updated successfully");
            setDirty(false);
            refetch();
        } catch (error: any) {
            showToast("error", error?.data?.message || "Failed to update levels");
        }
    };

    const handleReset = () => {
        if (data?.data) {
            setLevels(JSON.parse(JSON.stringify(data.data)));
            setDirty(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-teal-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
                    ${toast.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                    <span>{toast.type === "success" ? "✓" : "✕"}</span>
                    {toast.msg}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">MLM Levels</h2>
                    <p className="text-sm text-gray-500">Configure commission rates and requirements for each level</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => refetch()}
                        className="h-10 w-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-teal-500 transition">
                        <FaSync className="text-sm" />
                    </button>
                    {dirty && (
                        <button onClick={handleReset}
                            className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition">
                            Reset
                        </button>
                    )}
                    <button onClick={handleSave} disabled={saving || !dirty}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-green-400 text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 transition">
                        {saving ? (
                            <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        ) : (
                            <FaSave className="text-xs" />
                        )}
                        {saving ? "Saving…" : "Save Changes"}
                    </button>
                </div>
            </div>

            {dirty && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 text-sm text-yellow-700">
                    ⚠ You have unsaved changes. Click <strong>Save Changes</strong> to apply them.
                </div>
            )}

            {/* Level Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {levels.map((level, idx) => (
                    <div key={level.level} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Card Header */}
                        <div className="bg-gradient-to-r from-teal-400 to-green-400 px-5 py-3 flex items-center gap-2">
                            <FaLayerGroup className="text-white/80 text-sm" />
                            <h3 className="text-white font-semibold">Level {level.level}</h3>
                        </div>

                        <div className="p-5 space-y-4">
                            {/* Commission % */}
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Commission Rate (%)</label>
                                <input
                                    type="number"
                                    min={0} max={100} step={0.01}
                                    value={level.commission_percentage}
                                    onChange={(e) => handleChange(idx, "commission_percentage", e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-teal-400 outline-none font-semibold text-teal-700"
                                />
                            </div>

                            {/* Required Downline */}
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Required Downline</label>
                                <input
                                    type="number"
                                    min={0}
                                    value={level.required_downline}
                                    onChange={(e) => handleChange(idx, "required_downline", e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-teal-400 outline-none"
                                />
                            </div>

                            {/* Required Volume */}
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Required Volume ($)</label>
                                <input
                                    type="number"
                                    min={0}
                                    value={level.required_volume}
                                    onChange={(e) => handleChange(idx, "required_volume", e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-teal-400 outline-none"
                                />
                            </div>

                            {/* Bonus Amount */}
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Bonus Amount ($)</label>
                                <input
                                    type="number"
                                    min={0}
                                    value={level.bonus_amount}
                                    onChange={(e) => handleChange(idx, "bonus_amount", e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-teal-400 outline-none"
                                />
                            </div>

                            {/* Summary Row */}
                            <div className="pt-1 border-t border-gray-50 grid grid-cols-2 gap-2 text-xs">
                                <div className="bg-teal-50 rounded-lg px-2 py-1.5 text-center">
                                    <span className="text-gray-400 block">Commission</span>
                                    <span className="font-semibold text-teal-700">{level.commission_percentage}%</span>
                                </div>
                                <div className="bg-emerald-50 rounded-lg px-2 py-1.5 text-center">
                                    <span className="text-gray-400 block">Bonus</span>
                                    <span className="font-semibold text-emerald-700">${level.bonus_amount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {levels.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                    <FaLayerGroup className="text-4xl mx-auto mb-3 opacity-30" />
                    <p>No levels configured</p>
                </div>
            )}
        </div>
    );
};

export default Levels;