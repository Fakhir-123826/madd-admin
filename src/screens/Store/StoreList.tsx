import { FaPlus, FaEllipsisV, FaSearch, FaFilter, FaRedo } from "react-icons/fa";
import AddButton from "../../component/AddButton";
import Searchbar from "../../component/Searchbar";
import { useState } from "react";

const stores = [
    {
        name: "Blossom Store",
        storeId: "8728394456133",
        location: "New York street #1, USA",
        pickup: "Yes",
        status: "Active",
    },
    {
        name: "Blossom Store",
        storeId: "8728394456133",
        location: "New York street #1, USA",
        pickup: "Yes",
        status: "Hold",
    },
    {
        name: "Blossom Store",
        storeId: "8728394456133",
        location: "New York street #1, USA",
        pickup: "Yes",
        status: "Inactive",
    },
    {
        name: "Blossom Store",
        storeId: "8728394456133",
        location: "New York street #1, USA",
        pickup: "Yes",
        status: "Inactive",
    },
    {
        name: "Blossom Store",
        storeId: "8728394456133",
        location: "New York street #1, USA",
        pickup: "Yes",
        status: "Inactive",
    },
    {
        name: "Blossom Store",
        storeId: "8728394456133",
        location: "New York street #1, USA",
        pickup: "Yes",
        status: "Inactive",
    },

    {
        name: "Blossom Store",
        storeId: "8728394456133",
        location: "New York street #1, USA",
        pickup: "Yes",
        status: "Inactive",
    },
    {
        name: "Blossom Store",
        storeId: "8728394456133",
        location: "New York street #1, USA",
        pickup: "Yes",
        status: "Inactive",
    }, {
        name: "Blossom Store",
        storeId: "8728394456133",
        location: "New York street #1, USA",
        pickup: "Yes",
        status: "Inactive",
    },
    {
        name: "Blossom Store",
        storeId: "8728394456133",
        location: "New York street #1, USA",
        pickup: "Yes",
        status: "Inactive",
    },
    {
        name: "Blossom Store",
        storeId: "8728394456133",
        location: "New York street #1, USA",
        pickup: "Yes",
        status: "Inactive",
    },
    {
        name: "Blossom Store",
        storeId: "8728394456133",
        location: "New York street #1, USA",
        pickup: "Yes",
        status: "Inactive",
    },
    {
        name: "Blossom Store",
        storeId: "8728394456133",
        location: "New York street #1, USA",
        pickup: "Yes",
        status: "Inactive",
    },
    {
        name: "Blossom Store",
        storeId: "8728394456133",
        location: "New York street #1, USA",
        pickup: "Yes",
        status: "Inactive",
    },
    {
        name: "Blossom Store 5554554545",
        storeId: "8728394456133",
        location: "New York street #1, USA",
        pickup: "Yes",
        status: "Inactive",
    },

];

const statusStyle = (status: string) => {
    switch (status) {
        case "Active":
            return "bg-green-100 text-green-600";
        case "Inactive":
            return "bg-red-100 text-red-600";
        case "Hold":
            return "bg-purple-100 text-purple-600";
        default:
            return "";
    }
};


const StoreList = () => {

    const ITEMS_PER_PAGE = 8;
    const [page, setPage] = useState(1);

    const totalPages = Math.ceil(stores.length / ITEMS_PER_PAGE);

    const paginatedStores = stores.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );
    return (
        <div className="bg-white  shadow-sm p-6">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Stores Management</h2>
                <AddButton />
            </div>

            <Searchbar />


            {/* TABLE */}
            {/* TABLE */}
            <div className="rounded-t-3xl overflow-hidden">
                <table className="w-full text-sm border-separate border-spacing-y-2 ">
                    {/* HEADER */}
                    <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white ">
                        <tr>
                            <th className="p-4 text-left">Name</th>
                            <th className="p-4 text-left">Store ID</th>
                            <th className="p-4 text-left">Location</th>
                            <th className="p-4 text-left">Pickup Enabled</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4"></th>
                        </tr>
                    </thead>

                    {/* BODY */}
                    <tbody>
                        {paginatedStores.map((store, i) => (
                            <tr key={i}>
                                <td colSpan={6} className="p-0 shadow-md">
                                    {/* ROW CARD */}
                                    <div
                                        className="
                                        relative
                                        bg-white
                                        rounded-xl
                                        shadow-[0_6px_12px_-8px_rgba(0,0,0,0.25)]
                                        overflow-hidden
                                        "
                                    >
                                        {/* RIGHT + BOTTOM GRADIENT BORDER */}
                                        <div className="absolute inset-0 pointer-events-none">
                                            <div className="absolute right-0 top-1 h-full w-[5px] bg-gradient-to-b from-teal-400 to-green-400" />
                                            <div className="absolute bottom-0 left-0 w-full h-[5px] bg-gradient-to-r from-teal-400 to-green-400" />
                                        </div>

                                        {/* ACTUAL ROW CONTENT */}
                                        <div className="grid grid-cols-[2fr_2fr_3fr_1.5fr_1.5fr_40px] items-center">
                                            {/* NAME */}
                                            <div className="p-4 flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-gray-300" />
                                                <span className="font-medium">{store.name}</span>
                                            </div>

                                            {/* STORE ID */}
                                            <div className="p-4 text-gray-600">
                                                #{store.storeId}
                                            </div>

                                            {/* LOCATION */}
                                            <div className="p-4 text-gray-600">
                                                📍 {store.location}
                                            </div>

                                            {/* PICKUP */}
                                            <div className="p-4 text-gray-600">
                                                {store.pickup}
                                            </div>

                                            {/* STATUS */}
                                            <div className="p-4">
                                                <span
                                                    className={`px-3 py-1 rounded-md text-xs font-medium ${statusStyle(
                                                        store.status
                                                    )}`}
                                                >
                                                    {store.status}
                                                </span>
                                            </div>

                                            {/* ACTION */}
                                            <div className="p-4 text-right">
                                                <FaEllipsisV className="text-gray-400 cursor-pointer hover:text-gray-600" />
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}

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
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40"
                >
                    Next →
                </button>
            </div>

        </div>
    );
};

export default StoreList;
