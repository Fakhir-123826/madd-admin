import React from "react";
import { useGetMaintenanceStatusQuery, useToggleMaintenanceMutation } from "../../../app/api/SystemSlices/SystemApi";
import { FaServer, FaLock, FaGlobe } from "react-icons/fa";

const SystemMaintenance = () => {
    const { data, isLoading, refetch } = useGetMaintenanceStatusQuery();
    const [toggleMaintenance, { isLoading: isToggling }] = useToggleMaintenanceMutation();

    const isMaintenanceMode = data?.data?.is_down;

    const handleToggle = async () => {
        const msg = isMaintenanceMode
            ? "Bring the system back online?"
            : "Put the system into maintenance mode? Users will not be able to access the site.";
        if (!window.confirm(msg)) return;

        try {
            await toggleMaintenance().unwrap();
            refetch();
        } catch (err) {
            console.error(err);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64 bg-white rounded-xl shadow-sm">
                <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-teal-500" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 max-w-4xl">
            <h2 className="text-lg font-semibold mb-6">Maintenance Mode</h2>

            {/* Status Banner */}
            <div className={`p-6 rounded-2xl mb-8 flex items-center justify-between border ${isMaintenanceMode ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-full ${isMaintenanceMode ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'}`}>
                        {isMaintenanceMode ? <FaLock size={24} /> : <FaGlobe size={24} />}
                    </div>
                    <div>
                        <h3 className={`text-xl font-bold ${isMaintenanceMode ? 'text-red-700' : 'text-green-700'}`}>
                            {isMaintenanceMode ? "System is in Maintenance Mode" : "System is Online"}
                        </h3>
                        <p className={`text-sm mt-1 ${isMaintenanceMode ? 'text-red-600' : 'text-green-600'}`}>
                            {isMaintenanceMode
                                ? "Public access is disabled. Only allowed IPs or users with the secret key can bypass."
                                : "The application is running normally and is accessible to the public."}
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleToggle}
                    disabled={isToggling}
                    className={`px-6 py-2.5 rounded-xl font-medium text-white shadow-md transition-all disabled:opacity-50 ${isMaintenanceMode
                            ? "bg-green-500 hover:bg-green-600 shadow-green-500/30"
                            : "bg-red-500 hover:bg-red-600 shadow-red-500/30"
                        }`}
                >
                    {isToggling ? "Processing..." : (isMaintenanceMode ? "Turn Online" : "Enable Maintenance")}
                </button>
            </div>

            {/* Details (If Down) */}
            {isMaintenanceMode && data?.data?.down_details && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-xl p-5 bg-gray-50">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Secret Key (Bypass)</h4>
                        <p className="font-mono text-teal-600 bg-white border border-gray-200 p-2 rounded-lg text-sm truncate">
                            {data.data.down_details.secret || "None"}
                        </p>
                    </div>
                    <div className="border border-gray-200 rounded-xl p-5 bg-gray-50">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Allowed IPs</h4>
                        <div className="flex flex-wrap gap-2">
                            {data.data.down_details.allowed_ips?.length > 0 ? (
                                data.data.down_details.allowed_ips.map((ip: string) => (
                                    <span key={ip} className="bg-white border border-gray-200 px-3 py-1 rounded-md text-sm font-mono text-gray-600">
                                        {ip}
                                    </span>
                                ))
                            ) : (
                                <span className="text-sm text-gray-500 italic">No IPs explicitly allowed</span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SystemMaintenance;
