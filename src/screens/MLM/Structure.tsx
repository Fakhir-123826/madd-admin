// src/screens/MLM/Structure.tsx
import { useState } from "react";
import { FaSync, FaUsers, FaUserPlus, FaChevronRight, FaChevronDown } from "react-icons/fa";
import { useGetMlmStructureQuery } from "../../app/api/MlmSlices/MlmApi";

const Structure = () => {
    const { data, isLoading, refetch } = useGetMlmStructureQuery();
    const structure = data?.data ?? [];
    const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());

    const toggleNode = (id: number) => {
        const newExpanded = new Set(expandedNodes);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedNodes(newExpanded);
    };

    const renderTreeNode = (node: any, level: number = 0) => {
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = expandedNodes.has(node.id);

        return (
            <div key={node.id} className="relative">
                <div
                    className="flex items-center gap-3 py-3 px-4 hover:bg-gray-50 rounded-lg transition cursor-pointer"
                    style={{ marginLeft: `${level * 30}px` }}
                    onClick={() => toggleNode(node.id)}
                >
                    <div className="flex items-center gap-2">
                        {hasChildren ? (
                            <button className="text-gray-400 hover:text-gray-600">
                                {isExpanded ? <FaChevronDown className="text-xs" /> : <FaChevronRight className="text-xs" />}
                            </button>
                        ) : (
                            <div className="w-4" />
                        )}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-400 to-green-400 flex items-center justify-center text-white font-semibold">
                            {node.name?.charAt(0) || "A"}
                        </div>
                        <div>
                            <p className="font-medium text-gray-800">{node.name}</p>
                            <div className="flex gap-2 text-xs">
                                <span className="text-gray-400">{node.email}</span>
                                <span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-700">Level {node.level}</span>
                                <span className={`px-1.5 py-0.5 rounded ${node.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                                    {node.status}
                                </span>
                            </div>
                        </div>
                        <div className="ml-auto text-right">
                            <p className="text-sm font-semibold text-teal-600">${(node.total_commissions || 0).toLocaleString()}</p>
                            <p className="text-xs text-gray-400">{node.children?.length || 0} downline</p>
                        </div>
                    </div>
                </div>
                {hasChildren && isExpanded && (
                    <div className="ml-4 border-l-2 border-gray-200">
                        {node.children.map((child: any) => renderTreeNode(child, level + 1))}
                    </div>
                )}
            </div>
        );
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
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">MLM Structure</h2>
                    <p className="text-sm text-gray-500">View the complete agent hierarchy tree</p>
                </div>
                <button onClick={() => refetch()} className="h-10 w-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-teal-500 transition">
                    <FaSync className="text-sm" />
                </button>
            </div>

            {/* Tree View */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-2">
                        <FaUsers className="text-teal-500" />
                        <h3 className="font-semibold text-gray-800">Agent Hierarchy</h3>
                        <span className="text-xs text-gray-400 ml-auto">Click on any node to expand/collapse</span>
                    </div>
                </div>
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {structure.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <FaUsers className="text-4xl mx-auto mb-3 opacity-30" />
                            <p>No agents found in the hierarchy</p>
                        </div>
                    ) : (
                        structure.map((node) => renderTreeNode(node))
                    )}
                </div>
            </div>

            {/* Legend */}
            <div className="bg-gray-50 rounded-xl p-4 flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-teal-500" />
                    <span className="text-gray-600">Active Agent</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-400" />
                    <span className="text-gray-600">Inactive Agent</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-gray-600">Top Earner</span>
                </div>
                <div className="flex items-center gap-2">
                    <FaUserPlus className="text-teal-500 text-xs" />
                    <span className="text-gray-600">Has Downline</span>
                </div>
            </div>
        </div>
    );
};

export default Structure;