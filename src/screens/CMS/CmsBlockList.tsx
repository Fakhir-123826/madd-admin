import { useState, useEffect } from "react";
import AddButton from "../../component/AddButton";
import Searchbar from "../../component/Searchbar";
import SearchableSelect from "../../component/SearchableSelect";
import { FaEllipsisV, FaSync } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useGetCmsBlocksQuery, useSyncCmsBlocksMutation } from "../../app/api/CmsSlices/CmsApi";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { useGetVendorsQuery } from "../../app/api/VendorSlices/VendorApi";

const statusStyle = (status: boolean) => {
    return status ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600";
};

const CmsBlockList = () => {
    const navigate = useNavigate();

    const { user } = useSelector((state: RootState) => state.auth);
    const role = user?.role?.toLowerCase() || (user?.roles?.[0]?.toLowerCase()) || "";
    const isAdmin = role === "super_admin" || role === "admin";

    const { data: vendorsData } = useGetVendorsQuery(undefined, { skip: !isAdmin });
    const vendors = vendorsData?.data || [];

    const [selectedVendorUuid, setSelectedVendorUuid] = useState<string>("");

    useEffect(() => {
        if (isAdmin && vendors.length > 0 && !selectedVendorUuid) {
            setSelectedVendorUuid(vendors[0].uuid);
        } else if (!isAdmin && user) {
            const vendorUuid = user?.vendor?.uuid || user?.vendor_uuid || user?.uuid || "";
            if (vendorUuid) {
                setSelectedVendorUuid(vendorUuid);
            }
        }
    }, [isAdmin, vendors, user, selectedVendorUuid]);

    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const { data: response, isLoading, refetch } = useGetCmsBlocksQuery(
        { vendorUuid: selectedVendorUuid, page, per_page: ITEMS_PER_PAGE },
        { skip: !selectedVendorUuid }
    );
    const [syncBlocks, { isLoading: isSyncing }] = useSyncCmsBlocksMutation();

    const handleSync = async () => {
        if (!selectedVendorUuid) return;
        try {
            await syncBlocks(selectedVendorUuid).unwrap();
            refetch();
        } catch (error) {
            console.error("Failed to sync blocks:", error);
        }
    };

    const blocks = response?.data || [];
    const totalPages = response?.meta?.last_page || 1;

    const tdBase = "relative p-4 text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-gradient-to-r after:from-teal-400 after:to-green-400";

    return (
        <div>
            <div className="bg-white shadow-sm p-6">
                {/* HEADER */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">CMS Blocks</h2>
                    <div className="flex gap-4 items-center">
                        {isAdmin && (
                            <SearchableSelect
                                options={vendors.map((v: any) => ({ value: v.uuid, label: v.company_name || v.name }))}
                                value={selectedVendorUuid}
                                onChange={(value) => {
                                    setSelectedVendorUuid(value);
                                    setPage(1);
                                }}
                                placeholder="Select Vendor..."
                            />
                        )}
                        <button
                            onClick={handleSync}
                            disabled={isSyncing || !selectedVendorUuid}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition disabled:opacity-50"
                        >
                            <FaSync className={isSyncing ? "animate-spin" : ""} /> Sync from Magento
                        </button>
                        <AddButton
                            label="Add New CMS Block"
                            type="button"
                            onClick={() => navigate("/AddCmsBlock", { state: { vendorUuid: selectedVendorUuid } })}
                        />
                    </div>
                </div>

                <Searchbar />

                {/* TABLE */}
                <div className="rounded-t-3xl overflow-hidden mt-6">
                    <table className="w-full table-auto">
                        <thead className="bg-white">
                            <tr className="border-b border-gray-100">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Identifier
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Creation Time
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-teal-500" />
                                            <p className="text-sm text-gray-500">
                                                Loading CMS Blocks...
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : blocks.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <p className="text-gray-500">
                                            No CMS Blocks found
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                blocks.map((block: any) => (
                                    <tr
                                        key={block.uuid || block.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        {/* ID */}
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">
                                                {block.id || block.block_id}
                                            </div>
                                        </td>

                                        {/* Title */}
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">
                                                {block.title}
                                            </div>
                                        </td>

                                        {/* Identifier */}
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {block.identifier}
                                        </td>

                                        {/* Creation Time */}
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(
                                                block.creation_time || block.created_at
                                            ).toLocaleDateString()}
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${block.is_active
                                                        ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                                        : "bg-red-50 text-red-600 border-red-200"
                                                    }`}
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                                {block.is_active ? "Active" : "Inactive"}
                                            </span>
                                        </td>

                                        {/* Action */}
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/EditCmsBlock/${block.uuid || block.id}`,
                                                        {
                                                            state: {
                                                                vendorUuid: selectedVendorUuid,
                                                            },
                                                        }
                                                    )
                                                }
                                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                <FaEllipsisV className="text-sm" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-600">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40"
                    >
                        ← Back
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`px-3 py-1 rounded-md ${page === i + 1
                                ? "bg-blue-500 text-white"
                                : "hover:bg-gray-100"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        disabled={page === totalPages || totalPages === 0}
                        onClick={() => setPage(page + 1)}
                        className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40"
                    >
                        Next →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CmsBlockList;
