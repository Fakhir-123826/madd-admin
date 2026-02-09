import { type FC } from "react";
import { FaEllipsisV, FaMapMarkerAlt } from "react-icons/fa";

type StoreCardProps = {
  name: string;
  id: string;
  location: string;
  status: string;
  onView?: () => void;
};

const statusStyle = {
  Active: "bg-purple-100 text-purple-600",
  Inactive: "bg-gray-200 text-gray-500",
};

const CardForStoreList: FC<StoreCardProps> = ({
  name,
  id,
  location,
  status,
  onView,
}) => {
  return (
    <div className="relative w-[300px] rounded-2xl bg-white shadow-md p-5">
      {/* Top row */}
      <div className="flex items-start justify-between">
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full status`}  //${statusStyle[status]}
         >
          {status}
        </span>

        <FaEllipsisV className="text-gray-400 cursor-pointer hover:text-gray-600" />
      </div>

      {/* Avatar */}
      <div className="flex justify-center mt-4">
        <div className="h-24 w-24 rounded-full bg-gray-100" />
      </div>

      {/* Info */}
      <div className="text-center mt-4">
        <h3 className="font-semibold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-500">ID: #{id}</p>

        <div className="flex items-center justify-center gap-1 mt-2 text-sm text-gray-500">
          <FaMapMarkerAlt className="text-gray-400" />
          <span>{location}</span>
        </div>
      </div>

      {/* Button */}
      <div className="mt-5 flex justify-center">
        <button
          onClick={onView}
          className="px-6 py-2 rounded-full bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition"
        >
          View Store
        </button>
      </div>
    </div>
  );
};

export default CardForStoreList;
