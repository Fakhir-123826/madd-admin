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

    const tdBase =
        "relative p-4 text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-gradient-to-r after:from-teal-400 after:to-green-400";

    const ITEMS_PER_PAGE = 8;
    const [page, setPage] = useState(1);

    const totalPages = Math.ceil(stores.length / ITEMS_PER_PAGE);

    const paginatedStores = stores.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );
    return (
        <div className="bg-white shadow-sm p-6">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Stores Management</h2>
                <AddButton
                    label="Add New Store"
                    type="button" 
                    onClick={() => console.log("Clicked")}
                />
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
                            <tr
                                key={i}
                                className="bg-white shadow-sm hover:shadow-md transition"
                            >
                                {/* NAME */}
                                <td className={`${tdBase} font-medium text-black rounded-l-xl`}>
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-full bg-gray-300" />
                                        {store.name}
                                    </div>
                                </td>

                                {/* EMAIL */}
                                <td className={tdBase}>
                                    {store.location}@gmail.com
                                </td>

                                {/* LOCATION */}
                                <td className={tdBase}>
                                    📍 {store.location}
                                </td>

                                {/* PLAN / PICKUP */}
                                <td className={tdBase}>
                                    {store.pickup ? "Yes" : "No"}
                                </td>



                                {/* STATUS */}
                                <td className={tdBase}>
                                    <span
                                        className={`px-3 py-1 rounded-md text-xs font-medium ${statusStyle(
                                            store.status
                                        )}`}
                                    >
                                        {store.status}
                                    </span>
                                </td>

                                {/* ACTION */}
                                <td className="relative p-4 text-right rounded-r-xl">
                                    {/* RIGHT GRADIENT */}
                                    <span className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-teal-400 to-green-400 rounded-r-xl" />

                                    {/* BOTTOM GRADIENT */}
                                    <span className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-teal-400 to-green-400" />

                                    <FaEllipsisV className="relative text-gray-400 cursor-pointer hover:text-gray-600" />
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
