import React from "react";

type Member = {
  id: number;
  memberName: string;
  sponsorName: string;
  joinDate: string;
  country: string;
};

const members: Member[] = [
  {
    id: 1,
    memberName: "Hair oil",
    sponsorName: "SKU here",
    joinDate: "24 Aug 2025",
    country: "Pakistan",
  },
  {
    id: 2,
    memberName: "Hair oil",
    sponsorName: "SKU here",
    joinDate: "24 Aug 2025",
    country: "Pakistan",
  },
  {
    id: 3,
    memberName: "Hair oil",
    sponsorName: "SKU here",
    joinDate: "24 Aug 2025",
    country: "Pakistan",
  },
  {
    id: 4,
    memberName: "Hair oil",
    sponsorName: "SKU here",
    joinDate: "24 Aug 2025",
    country: "Pakistan",
  },
];

const MemberGrowthOverview: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      {/* Heading */}
      <h3 className="text-lg font-semibold text-gray-700 mb-6">
        August Overview
      </h3>

      {/* Table Header */}
      <div className="grid grid-cols-4 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-6 py-3">
        <div className="text-center">Member Name</div>
        <div className="text-center">Sponsor Name</div>
        <div className="text-center">Join Date</div>
        <div className="text-center">Country</div>
      </div>

      {/* Table Rows */}
      <div className="mt-3 space-y-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="grid grid-cols-4 items-center border border-gray-200 rounded-lg px-6 py-4 text-sm text-gray-700 hover:shadow-md transition duration-200 bg-white"
          >
            <div className="text-center font-medium">
              {member.memberName}
            </div>

            <div className="text-center">
              {member.sponsorName}
            </div>

            <div className="text-center">
              {member.joinDate}
            </div>

            <div className="text-center">
              {member.country}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberGrowthOverview;
