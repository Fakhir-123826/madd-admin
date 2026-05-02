import React from "react";
import { useGetCacheInfoQuery, useClearCacheMutation } from "../../../app/api/SystemSlices/SystemApi";
import { FaTrash, FaHdd, FaMicrochip } from "react-icons/fa";

const SystemCache = () => {
    const { data, isLoading, refetch } = useGetCacheInfoQuery();
    const [clearCache, { isLoading: isClearing }] = useClearCacheMutation();

    const handleClearCache = async () => {
        if (!window.confirm("Are you sure you want to clear the application cache?")) return;
        try {
            await clearCache().unwrap();
            alert("Cache cleared successfully!");
            refetch();
        } catch (err) {
            console.error(err);
            alert("Failed to clear cache.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">System Cache Management</h2>
                    <button
                        onClick={handleClearCache}
                        disabled={isClearing}
                        className="flex items-center gap-2 text-sm text-white bg-gradient-to-r from-teal-400 to-green-400 px-4 py-2 rounded-lg hover:shadow-lg transition disabled:opacity-50"
                    >
                        <FaTrash />
                        {isClearing ? "Clearing..." : "Clear Cache"}
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-teal-500" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-teal-50 to-green-50 p-6 rounded-2xl border border-teal-100 flex items-start gap-4">
                            <div className="p-3 bg-white rounded-xl shadow-sm text-teal-500">
                                <FaHdd size={24} />
                            </div>
                            <div>
                                <h3 className="text-gray-500 text-sm font-medium mb-1">Cache Driver</h3>
                                <p className="text-2xl font-bold text-gray-800 capitalize">{data?.data?.driver || "N/A"}</p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 flex items-start gap-4">
                            <div className="p-3 bg-white rounded-xl shadow-sm text-blue-500">
                                <FaMicrochip size={24} />
                            </div>
                            <div>
                                <h3 className="text-gray-500 text-sm font-medium mb-1">System Status</h3>
                                <p className="text-2xl font-bold text-gray-800">Operational</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-4">About Cache</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                    Clearing the system cache will remove temporary compiled views, route caches, and configuration caches.
                    This process might slightly slow down the initial load of the application for the first user accessing it
                    post-clear, but it is necessary if you are experiencing stale data or after deploying updates.
                </p>
            </div>
        </div>
    );
};

export default SystemCache;
