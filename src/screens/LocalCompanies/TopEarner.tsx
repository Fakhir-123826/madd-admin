import React from "react";

interface TopEarnerData {
  rank: string;
  name: string;
  memberId: string;
  level: string;
  earnings: string;
}

const TopEarner: React.FC = () => {
  const data: TopEarnerData[] = [
    {
      rank: "1st",
      name: "Christine Brooks",
      memberId: "#M10234",
      level: "Gold Leader",
      earnings: "$4,500",
    },
    {
      rank: "2nd",
      name: "John Martinez",
      memberId: "#M10235",
      level: "Silver Leader",
      earnings: "$3,850",
    },
    {
      rank: "3rd",
      name: "Sarah Johnson",
      memberId: "#M10236",
      level: "Bronze Leader",
      earnings: "$3,200",
    },
    {
      rank: "4th",
      name: "Michael Chen",
      memberId: "#M10237",
      level: "Rising Star",
      earnings: "$2,750",
    },
    {
      rank: "5th",
      name: "Emily White",
      memberId: "#M10238",
      level: "New Leader",
      earnings: "$2,100",
    },
  ];

  const getRankColor = (rank: string): string => {
    if (rank === "1st") return "text-yellow-600 font-semibold";
    if (rank === "2nd") return "text-gray-600 font-semibold";
    if (rank === "3rd") return "text-orange-600 font-semibold";
    return "text-gray-500";
  };

  const getLevelBadge = (level: string): string => {
    if (level.includes("Gold")) return "bg-yellow-100 text-yellow-700";
    if (level.includes("Silver")) return "bg-gray-100 text-gray-700";
    if (level.includes("Bronze")) return "bg-orange-100 text-orange-700";
    return "bg-blue-100 text-blue-700";
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Top Earners
        </h2>

        <button className="bg-gradient-to-r from-teal-400 to-green-500 text-white text-sm px-4 py-2 rounded-lg hover:shadow-md transition-shadow">
          This Year
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-100 text-gray-600 rounded-lg">
              <th className="px-4 py-3 font-medium">Rank</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Member ID</th>
              <th className="px-4 py-3 font-medium">Level/Rank</th>
              <th className="px-4 py-3 font-medium text-right">Earnings</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {data.map((item: TopEarnerData, index: number) => (
              <tr
                key={index}
                className="border-b border-gray-100 last:border-none hover:bg-gray-50/50 transition-colors"
              >
                <td className={`px-4 py-4 ${getRankColor(item.rank)}`}>
                  {item.rank}
                </td>
                <td className="px-4 py-4 font-medium">{item.name}</td>
                <td className="px-4 py-4 text-gray-500">
                  {item.memberId}
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${getLevelBadge(item.level)}`}>
                    {item.level}
                  </span>
                </td>
                <td className="px-4 py-4 text-right font-semibold text-gray-800">
                  {item.earnings}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopEarner;