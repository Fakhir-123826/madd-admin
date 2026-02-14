
import { useState } from "react";
import AddButton from "../../../component/AddButton";
import Searchbar from "../../../component/Searchbar";
import { FaEllipsisV } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const stores = [
    {
        name: "Blossom Store",
        storeId: "8728394456133",
        location: "New York street #1, USA",
        createdAt: "23 july 2025",
        pickup: "Yes",
        status: "Active",
    },
    {
        name: "Blossom Store",
        storeId: "8728394456133",
        location: "New York street #1, USA",
        createdAt: "23 july 2025",
        pickup: "Yes",
        status: "Active",
    },
    {
        name: "Blossom Store",
        storeId: "8728394456133",
        location: "New York street #1, USA",
        createdAt: "23 july 2025",
        pickup: "Yes",
        status: "Inactive",
    },
    {
        name: "Blossom Store",
        storeId: "8728394456133",
        location: "New York street #1, USA",
        createdAt: "23 july 2025",
        pickup: "Yes",
        status: "Inactive",
    },
    {
        name: "Blossom Store",
        storeId: "8728394456133",
        location: "New York street #1, USA",
        createdAt: "23 july 2025",
        pickup: "Yes",
        status: "Inactive",
    },
    {
        name: "Blossom Store",
        storeId: "8728394456133",
        location: "New York street #1, USA",
        createdAt: "23 july 2025",
        pickup: "Yes",
        status: "Inactive",
    },

    {
        name: "Blossom Store",
        storeId: "8728394456133",
        location: "New York street #1, USA",
        createdAt: "23 july 2025",
        pickup: "Yes",
        status: "Inactive",
    },
    {
        name: "Blossom Store",
        storeId: "8728394456133",
        location: "New York street #1, USA",
        createdAt: "23 july 2025",
        pickup: "Yes",
        status: "Inactive",
    }, {
        name: "Blossom Store",
        storeId: "8728394456133",
        location: "New York street #1, USA",
        createdAt: "23 july 2025",
        pickup: "Yes",
        status: "Inactive",
    },
    {
        name: "Blossom Store",
        storeId: "8728394456133",
        location: "New York street #1, USA",
        createdAt: "23 july 2025",
        pickup: "Yes",
        status: "Inactive",
    },
    {
        name: "Blossom Store",
        storeId: "8728394456133",
        location: "New York street #1, USA",
        createdAt: "23 july 2025",
        pickup: "Yes",
        status: "Inactive",
    },
    {
        name: "Blossom Store",
        storeId: "8728394456133",
        location: "New York street #1, USA",
        createdAt: "23 july 2025",
        pickup: "Yes",
        status: "Inactive",
    },
    {
        name: "Blossom Store",
        storeId: "8728394456133",
        location: "New York street #1, USA",
        createdAt: "23 july 2025",
        pickup: "Yes",
        status: "Inactive",
    },
    {
        name: "Blossom Store",
        storeId: "8728394456133",
        location: "New York street #1, USA",
        createdAt: "23 july 2025",
        pickup: "Yes",
        status: "Inactive",
    },
    {
        name: "Blossom Store 5554554545",
        storeId: "8728394456133",
        location: "New York street #1, USA",
        createdAt: "23 july 2025",
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

        default:
            return "";
    }
};

const ProductSharingList  = () => {
   const navigate = useNavigate();
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
    <div>
      <div className="bg-white shadow-sm p-6">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Product Shearing</h2>
         <AddButton
            label= "Add New Product Shearing"
            type="button"
            onClick={() => navigate("/CreateProductSharing")}
          />
        </div>

        <Searchbar />


        {/* TABLE */}
        {/* TABLE */}
        <div className="rounded-t-3xl overflow-hidden">
          <table className="w-full text-sm border-separate border-spacing-y-3">
            {/* HEADER */}
            <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
              <tr>
                <th className="p-4 text-left">Vendor Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Phone Number</th>
                <th className="p-4 text-left">Plan Assigned</th>
                <th className="p-4 text-left">Created Date</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4"></th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {paginatedStores.map((store, i) => (
                <tr className="bg-white shadow-sm hover:shadow-md transition">
                  <td className={`${tdBase} font-medium rounded-l-xl text-black`}>
                    {store.name}
                  </td>

                  <td className={tdBase}>
                    {store.location + "@gmail.com"}
                  </td>

                  <td className={tdBase}>
                    📍 {store.location}
                  </td>

                  <td className={tdBase}>
                    {store.pickup ? "Yes" : "No"}
                  </td>

                  <td className={tdBase}>
                    {store.createdAt}
                  </td>

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
                  <td className="relative p-4 rounded-r-xl text-right">
                    {/* right gradient */}
                    <span className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-teal-400 to-green-400 rounded-r-xl" />

                    {/* bottom gradient */}
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



    </div>
  )
}

export default ProductSharingList