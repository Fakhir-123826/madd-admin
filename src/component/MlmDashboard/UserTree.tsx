import React, { useState } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import { FaUserCircle, FaEnvelope, FaPhone, FaCalendarAlt, FaDollarSign, FaChartBar, FaUsers, FaStar } from 'react-icons/fa';

type Member = {
  id: string;
  name: string;
  rank: string;
  joinedDate: string;
  email: string;
  phone: string;
  sponsoredBy?: string;
  earnings: string;
  salesVolume?: string;
  recruits?: number;
  type: "distributor" | "member";
  children?: Member[];
};

const UserTree = () => {
  const [selectedUser, setSelectedUser] = useState<Member | null>(null);

  // MOCK DATA
  const treeData: Member = {
    id: "#249484",
    name: "Distributor A",
    rank: "Gold",
    joinedDate: "23 July 2025",
    email: "info@gmail.com",
    phone: "+92 3595 6785",
    earnings: "3756$",
    salesVolume: "3756$",
    recruits: 375,
    type: "distributor",
    children: [
      {
        id: "1",
        name: "Member 1",
        rank: "Gold",
        earnings: "1266$",
        type: "member",
        joinedDate: "24 July 2025",
        email: "m1@mail.com",
        phone: "0300 0000001",
        sponsoredBy: "Distributor A",
        children: [
          {
            id: "1-1",
            name: "Sub Member 1",
            rank: "Silver",
            earnings: "900$",
            type: "member",
            joinedDate: "26 July 2025",
            email: "sub1@mail.com",
            phone: "0300 0000002",
            sponsoredBy: "Member 1",
          },
        ],
      },
      {
        id: "2",
        name: "Member 2",
        rank: "Gold",
        earnings: "1266$",
        type: "member",
        joinedDate: "25 July 2025",
        email: "m2@mail.com",
        phone: "0300 0000003",
        sponsoredBy: "Distributor A",
      },
    ],
  };

  const NodeComponent = ({ node }: { node: Member }) => {
    const isSelected = selectedUser?.id === node.id;
    
    return (
      <div
        onClick={() => setSelectedUser(node)}
        className={`cursor-pointer transition-all ${
          isSelected 
            ? 'border-2 border-green-500 rounded-xl shadow-lg' 
            : 'border-2 border-transparent hover:border-gray-200'
        }`}
      >
        <div className="bg-white rounded-lg p-3 min-w-[180px] shadow-sm hover:shadow-md transition-shadow">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <FaUserCircle className="w-8 h-8 text-gray-500" />
            <div>
              <h3 className="font-medium text-gray-900">{node.name}</h3>
              <p className="text-xs text-gray-500">{node.id}</p>
            </div>
          </div>

          {/* Rank Badge */}
          <div className="mb-2">
            <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium">
              {node.rank}
            </span>
          </div>

          {/* Earnings */}
          <div className="flex items-center gap-1 text-sm text-gray-700">
            <FaDollarSign className="w-3 h-3 text-gray-500" />
            <span>{node.earnings}</span>
          </div>

          {/* Join Date */}
          <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
            <FaCalendarAlt className="w-3 h-3" />
            <span>{node.joinedDate}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderTree = (node: Member) => {
    if (!node.children || node.children.length === 0) {
      return (
        <TreeNode label={<NodeComponent node={node} />} />
      );
    }

    return (
      <TreeNode label={<NodeComponent node={node} />}>
        {node.children.map((child) => renderTree(child))}
      </TreeNode>
    );
  };

  return (
    <div className="p-6 pb-20 bg-white rounded-xl min-h-screen">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Company Network Tree</h1>
        <p className="text-gray-500 text-sm">Click on any user to view details</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Tree Section */}
        <div className="flex-1 bg-white rounded-lg p-4">
          <div className="overflow-auto max-h-[700px]">
            <Tree
              lineWidth="1.5px"
              lineColor="#d1d5db"
              lineBorderRadius="8px"
              label={<NodeComponent node={treeData} />}
            >
              {treeData.children?.map((child) => renderTree(child))}
            </Tree>
          </div>
        </div>

        {/* Detail Panel */}
        <div className="lg:w-80">
          {!selectedUser ? (
            <div className="bg-white rounded-lg border p-6 text-center">
              <FaUserCircle className="w-16 h-16 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">Select a user to view details</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border-2 border-green-500 p-5 space-y-4 shadow-lg">
              
              {/* Profile Header */}
              <div className="text-center pb-3 border-b">
                <FaUserCircle className="w-16 h-16 mx-auto text-gray-500 mb-2" />
                <h2 className="text-xl font-semibold text-gray-900">{selectedUser.name}</h2>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                    {selectedUser.rank}
                  </span>
                  <span className="text-xs text-gray-500">{selectedUser.type}</span>
                </div>
              </div>

              {/* Info List */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <FaEnvelope className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{selectedUser.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FaPhone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{selectedUser.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FaStar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{selectedUser.sponsoredBy || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FaCalendarAlt className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Joined: {selectedUser.joinedDate}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 pt-3">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-500">Earnings</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedUser.earnings}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-500">Sales</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedUser.salesVolume || '0$'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded col-span-2">
                  <p className="text-xs text-gray-500">Recruits</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedUser.recruits || 0}</p>
                </div>
              </div>

              {/* Downline List */}
              {selectedUser.children && selectedUser.children.length > 0 && (
                <div className="pt-3 border-t">
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FaUsers className="w-4 h-4" />
                    Direct Downline
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedUser.children.map((child) => (
                      <div key={child.id} 
                        className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer transition-colors border border-transparent hover:border-green-500"
                        onClick={() => setSelectedUser(child)}
                      >
                        <div className="flex items-center gap-2">
                          <FaUserCircle className="w-6 h-6 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-800 text-sm">{child.name}</p>
                            <p className="text-xs text-gray-500">{child.rank}</p>
                          </div>
                        </div>
                        <span className="text-xs font-medium text-gray-700">{child.earnings}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserTree;