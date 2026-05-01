import React from "react";
import {
    useGetQueuesQuery,
    useRetryJobMutation,
    useClearFailedJobsMutation
} from "../../../app/api/SystemSlices/SystemApi";
import { FaRedo, FaTrash, FaCheckCircle, FaExclamationCircle, FaHourglassHalf } from "react-icons/fa";

const SystemQueues = () => {
    const { data, isLoading, refetch } = useGetQueuesQuery();
    const [retryJob] = useRetryJobMutation();
    const [clearFailedJobs] = useClearFailedJobsMutation();

    const handleRetry = async (id: string) => {
        try {
            await retryJob(id).unwrap();
            refetch();
        } catch (err) {
            console.error(err);
        }
    };

    const handleClearAll = async () => {
        if (!window.confirm("Are you sure you want to clear all failed jobs?")) return;
        try {
            await clearFailedJobs().unwrap();
            refetch();
        } catch (err) {
            console.error(err);
        }
    };

    const failedJobs = data?.data?.failed_jobs || [];
    const stats = data?.data?.stats || {};

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4 border-l-4 border-blue-500">
                    <div className="p-3 bg-blue-50 text-blue-500 rounded-lg"><FaHourglassHalf size={20} /></div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Pending Jobs</p>
                        <p className="text-2xl font-bold">{stats.pending || 0}</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4 border-l-4 border-red-500">
                    <div className="p-3 bg-red-50 text-red-500 rounded-lg"><FaExclamationCircle size={20} /></div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Failed Jobs</p>
                        <p className="text-2xl font-bold">{stats.failed || 0}</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4 border-l-4 border-green-500">
                    <div className="p-3 bg-green-50 text-green-500 rounded-lg"><FaCheckCircle size={20} /></div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Processed Jobs</p>
                        <p className="text-2xl font-bold">{stats.processed || 0}</p>
                    </div>
                </div>
            </div>

            {/* Failed Jobs Table */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Failed Jobs</h2>
                    {failedJobs.length > 0 && (
                        <button
                            onClick={handleClearAll}
                            className="flex items-center gap-2 text-sm text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
                        >
                            <FaTrash /> Clear All Failed
                        </button>
                    )}
                </div>

                <div className="overflow-x-auto rounded-t-xl">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
                            <tr>
                                <th className="p-4 rounded-tl-xl">ID</th>
                                <th className="p-4">Connection</th>
                                <th className="p-4">Queue</th>
                                <th className="p-4">Failed At</th>
                                <th className="p-4 rounded-tr-xl text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-10">
                                        <div className="animate-spin h-6 w-6 mx-auto rounded-full border-b-2 border-teal-500" />
                                    </td>
                                </tr>
                            ) : failedJobs.length > 0 ? (
                                failedJobs.map((job: any) => (
                                    <tr key={job.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="p-4 font-mono text-xs">{job.id}</td>
                                        <td className="p-4">{job.connection}</td>
                                        <td className="p-4">{job.queue}</td>
                                        <td className="p-4">{job.failed_at}</td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleRetry(job.id)}
                                                className="text-teal-600 hover:bg-teal-50 p-2 rounded-lg transition"
                                                title="Retry Job"
                                            >
                                                <FaRedo />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-gray-500">
                                        No failed jobs found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SystemQueues;
