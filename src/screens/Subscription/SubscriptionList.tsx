import React, { useState } from 'react'
import AddButton from '../../component/AddButton';
import Searchbar from '../../component/Searchbar';
import CardForStoreList from '../../component/CardForStoreList';
import { FaEllipsisV } from 'react-icons/fa';
import { useGetSubscriptionsQuery } from "../../app/api/SubscriptionSclices/SubscriptionSclices";
import type { Subscription } from '../../model/susbcription/ISubscription';
import { useNavigate } from "react-router-dom";

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
const SubscriptionList = () => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const tdBase =
    "relative p-4 text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-gradient-to-r after:from-teal-400 after:to-green-400";

  const { data: subscriptions = [], isLoading, error } =
    useGetSubscriptionsQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading subscriptions</div>;
  }

  const ITEMS_PER_PAGE = 8;

  const totalPages = Math.ceil(subscriptions.length / ITEMS_PER_PAGE);

  const paginatedStores = subscriptions.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );


  return (
    <div className="bg-white shadow-sm p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Suscription Management</h2>
        <AddButton
          label="Add New Subscription"
          type="button"
          onClick={() => navigate("/CreateSubscription")}
        />
      </div>

      <Searchbar />

      {/* TABLE */}
      <div className="rounded-t-3xl overflow-hidden">

        <table className="w-full text-sm border-separate border-spacing-y-3">
          {/* HEADER */}
          <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
            <tr>
              <th className="p-4 text-left">Subscription Name</th>
              <th className="p-4 text-left">Billing Type</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Feature</th>
              <th className="p-4 text-left">Created At</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>


          {/* BODY */}
          <tbody>
            {paginatedStores.map((subscription) => (
              <tr key={subscription.id} className="bg-white shadow-sm hover:shadow-md transition">

                <td className={`${tdBase} font-medium rounded-l-xl text-black`}>
                  {subscription.subscription_name}
                </td>

                <td className={tdBase}>
                  {subscription.billing_type}
                </td>

                <td className={tdBase}>
                  ${subscription.price}
                </td>

                <td className={tdBase}>
                  <div className="flex flex-wrap gap-2">
                    {subscription.feature &&
                      JSON.parse(subscription.feature).map(
                        (feature: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 text-xs font-medium rounded-full bg-teal-50 text-teal-600 border border-teal-200"
                          >
                            {feature}
                          </span>
                        )
                      )}
                  </div>
                </td>


                <td className={tdBase}>
                  {new Date(subscription.created_at).toLocaleDateString()}
                </td>
                <td className={tdBase}>
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200
                      ${Number(subscription.status) === 1
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                        : "bg-rose-50 text-rose-600 border border-rose-200"
                      }
                    `}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${Number(subscription.status) === 1
                        ? "bg-emerald-500"
                        : "bg-rose-500"
                        }`}
                    />
                    {Number(subscription.status) === 1 ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="relative p-4 rounded-r-xl text-right">
                  {/* right gradient */}
                  <span className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-teal-400 to-green-400 rounded-r-xl" />

                  {/* bottom gradient */}
                  <span className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-teal-400 to-green-400" />
                  <button onClick={() => navigate(`/CreateSubscription/${subscription.id}`)}>
                    <FaEllipsisV className="relative text-gray-400 cursor-pointer hover:text-gray-600" />
                  </button>
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
}

export default SubscriptionList