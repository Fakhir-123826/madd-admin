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
    const isAdmin = user?.roles?.includes('admin') || user?.roles?.includes('super_admin');

    const { data: vendorsData } = useGetVendorsQuery({}, { skip: !isAdmin });
    const vendors = vendorsData?.data || [];

    const [selectedVendorUuid, setSelectedVendorUuid] = useState<string>("");

    useEffect(() => {
        if (isAdmin && vendors.length > 0 && !selectedVendorUuid) {
            setSelectedVendorUuid(vendors[0].uuid);
        } else if (!isAdmin && user) {
            setSelectedVendorUuid(user?.vendor?.uuid || user?.uuid || "");
        }
    }, [isAdmin, vendors, user]);

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
                    <table className="w-full text-sm border-separate border-spacing-y-3">
                        {/* HEADER */}
                        <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
                            <tr>
                                <th className="p-4 text-left">ID</th>
                                <th className="p-4 text-left">Title</th>
                                <th className="p-4 text-left">Identifier</th>
                                <th className="p-4 text-left">Creation Time</th>
                                <th className="p-4 text-left">Status</th>
                                <th className="p-4"></th>
                            </tr>
                        </thead>

                        {/* BODY */}
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center p-4">Loading...</td>
                                </tr>
                            ) : blocks.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center p-4">No CMS Blocks found</td>
                                </tr>
                            ) : (
                                blocks.map((block: any, i: number) => (
                                    <tr key={i} className="bg-white shadow-sm hover:shadow-md transition">
                                        <td className={`${tdBase} font-medium rounded-l-xl text-black`}>
                                            {block.id || block.block_id}
                                        </td>

                                        <td className={tdBase}>
                                            {block.title}
                                        </td>

                                        <td className={tdBase}>
                                            {block.identifier}
                                        </td>

                                        <td className={tdBase}>
                                            {new Date(block.creation_time || block.created_at).toLocaleDateString()}
                                        </td>

                                        <td className={tdBase}>
                                            <span
                                                className={`px-3 py-1 rounded-md text-xs font-medium ${statusStyle(
                                                    block.is_active
                                                )}`}
                                            >
                                                {block.is_active ? "Active" : "Inactive"}
                                            </span>
                                        </td>

                                        {/* ACTION */}
                                        <td className="relative p-4 rounded-r-xl text-right">
                                            <span className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-teal-400 to-green-400 rounded-r-xl" />
                                            <span className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-teal-400 to-green-400" />
                                            <FaEllipsisV 
                                                onClick={() => navigate(`/EditCmsBlock/${block.uuid || block.id}`, { state: { vendorUuid: selectedVendorUuid } })} 
                                                className="relative text-gray-400 cursor-pointer hover:text-gray-600 inline-block" 
                                            />
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
