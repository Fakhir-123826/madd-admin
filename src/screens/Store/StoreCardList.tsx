import { FaPlus, FaEllipsisV, FaSearch, FaFilter, FaRedo } from "react-icons/fa";
import AddButton from "../../component/AddButton";
import Searchbar from "../../component/Searchbar";
import { useState } from "react";
import CardForStoreList from "../../component/CardForStoreList";

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


const StoreCardList = () => {
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
                <AddButton />
            </div>

            <Searchbar />

            {/* CARD GRID */}<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 justify-items-center">

                {paginatedStores.map((store, i) => (
                    <CardForStoreList
                        key={i}
                        name={store.name}
                        id={store.storeId}
                        location={store.location}
                        status={store.status}
                        onView={() => console.log("View store", store.storeId)}
                    />
                ))}
            </div>


            {/* PAGINATION */}
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

export default StoreCardList;

