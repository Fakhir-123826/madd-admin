// src/screens/MLM/Dashboard.tsx
import { useGetMlmStatisticsQuery } from "../../app/api/MlmSlices/MlmApi";
import {
    FaUsers,
    FaUserCheck,
    FaUserTimes,
    FaUserSlash,
    FaMoneyBillWave,
    FaDollarSign,
    FaChartLine,
    FaTrophy,
} from "react-icons/fa";

const fmtPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(price || 0);
};

const MlmDashboard = () => {
    const { data, isLoading } = useGetMlmStatisticsQuery();

    const stats = data?.data;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-teal-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Agent Statistics */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Agent Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-xl px-4 py-3">
                        <span className="text-xs text-gray-500">Total Agents</span>
                        <p className="text-xl font-bold text-teal-600">{stats?.total_agents || 0}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl px-4 py-3">
                        <FaUserCheck className="text-emerald-500 mb-1" />
                        <span className="text-xs text-gray-500">Active</span>
                        <p className="text-xl font-bold text-emerald-600">{stats?.active_agents || 0}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl px-4 py-3">
                        <FaUserTimes className="text-gray-400 mb-1" />
                        <span className="text-xs text-gray-500">Inactive</span>
                        <p className="text-xl font-bold text-gray-600">{stats?.inactive_agents || 0}</p>
                    </div>
                    <div className="bg-red-50 rounded-xl px-4 py-3">
                        <FaUserSlash className="text-red-500 mb-1" />
                        <span className="text-xs text-gray-500">Suspended</span>
                        <p className="text-xl font-bold text-red-600">{stats?.suspended_agents || 0}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-xl px-4 py-3">
                        <span className="text-xs text-gray-500">KYC Pending</span>
                        <p className="text-xl font-bold text-yellow-600">{stats?.kyc_pending || 0}</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl px-4 py-3">
                        <span className="text-xs text-gray-500">KYC Verified</span>
                        <p className="text-xl font-bold text-purple-600">{stats?.kyc_verified || 0}</p>
                    </div>
                </div>
            </div>

            {/* Commission Statistics */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Commission Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl px-4 py-3">
                        <span className="text-xs text-gray-500">Total Commissions</span>
                        <p className="text-xl font-bold text-blue-600">{fmtPrice(stats?.total_commissions || 0)}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-xl px-4 py-3">
                        <span className="text-xs text-gray-500">Pending</span>
                        <p className="text-xl font-bold text-yellow-600">{fmtPrice(stats?.pending_commissions || 0)}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl px-4 py-3">
                        <span className="text-xs text-gray-500">Paid</span>
                        <p className="text-xl font-bold text-emerald-600">{fmtPrice(stats?.paid_commissions || 0)}</p>
                    </div>
                </div>
            </div>

            {/* Agents by Level */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Agents by Level</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {stats?.by_level?.map((level) => (
                        <div key={level.level} className="bg-gray-50 rounded-xl px-4 py-3 text-center">
                            <span className="text-xs text-gray-500">Level {level.level}</span>
                            <p className="text-xl font-bold text-teal-600">{level.count}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Earners & Top Recruiters */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FaTrophy className="text-yellow-500" /> Top Earners
                    </h3>
                    <div className="space-y-2">
                        {stats?.top_earners?.map((agent, idx) => (
                            <div key={agent.id} className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-lg font-bold text-gray-400">#{idx + 1}</span>
                                    <div>
                                        <p className="font-medium text-gray-800">{agent.user?.full_name}</p>
                                        <p className="text-xs text-gray-500">Level {agent.level}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-teal-600">{fmtPrice(agent.total_commissions_earned)}</p>
                                    <p className="text-xs text-gray-400">{agent.total_vendors_recruited} recruits</p>
                                </div>
                            </div>
                        ))}
                        {(!stats?.top_earners || stats.top_earners.length === 0) && (
                            <p className="text-gray-400 text-center py-8">No data available</p>
                        )}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FaUsers className="text-teal-500" /> Top Recruiters
                    </h3>
                    <div className="space-y-2">
                        {stats?.top_recruiters?.map((agent, idx) => (
                            <div key={agent.id} className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-lg font-bold text-gray-400">#{idx + 1}</span>
                                    <div>
                                        <p className="font-medium text-gray-800">{agent.user?.full_name}</p>
                                        <p className="text-xs text-gray-500">Level {agent.level}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-teal-600">{agent.total_vendors_recruited} recruits</p>
                                    <p className="text-xs text-gray-400">{fmtPrice(agent.total_commissions_earned)} earned</p>
                                </div>
                            </div>
                        ))}
                        {(!stats?.top_recruiters || stats.top_recruiters.length === 0) && (
                            <p className="text-gray-400 text-center py-8">No data available</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MlmDashboard;