import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function UserDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  if (!user) {
    navigate('/userlist');
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header with Username and Status */}
      <div className="bg-gradient-to-r from-teal-400 to-green-400 text-white p-6 rounded-t-xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{user.username}</h1>
            <p className="text-sm opacity-90 mt-1">Last active: {user.lastLogin}</p>
          </div>
          <span className="px-4 py-2 bg-white text-teal-600 rounded-full text-sm font-semibold">
            {user.status}
          </span>
        </div>
      </div>

      {/* User Info Section */}
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">User Info</h2>
        
        {/* Info Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200 mb-6">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Email</th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Phone Number</th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Role</th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Joining Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="p-4 text-gray-800">{user.email}</td>
                <td className="p-4 text-gray-800">{user.phone}</td>
                <td className="p-4 text-gray-800">{user.role}</td>
                <td className="p-4 text-gray-800">{user.joiningDate}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Assigned Groups */}
        <div className="mb-6">
          <h3 className="text-md font-semibold mb-3">Assigned Groups</h3>
          <div className="flex flex-wrap gap-2">
            {user.assignedGroups?.map((group: string, index: number) => (
              <span
                key={index}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {group}
              </span>
            ))}
          </div>
        </div>

        {/* Assigned Role Description */}
        <div>
          <h3 className="text-md font-semibold mb-3">Assigned Role:</h3>
          <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
            {user.roleDescription}
          </p>
        </div>

        {/* Back Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={() => navigate('/userlist')}
            className="px-6 py-2 bg-gradient-to-r from-teal-400 to-green-400 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Back to List
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserDetails;