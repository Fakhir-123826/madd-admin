// 

// const VendorOnboard = () => {
//   return (
//     <div>
        
//     </div>
//   )
// }

// export default VendorOnboard


import React from "react";

const InfoCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* HEADER */}
      <div className="px-6 py-4 bg-gradient-to-r from-teal-400 to-green-400 text-white font-medium">
        {title}
      </div>

      {/* BODY */}
      <div className="p-6">{children}</div>
    </div>
  );
};

const VendorOnboard = () => {
  return (
    <div className="space-y-6">
      {/* BASIC INFO */}
      <InfoCard title="Basic Info">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
          <div>
            <p className="text-gray-500">Vendor Name</p>
            <p className="font-medium">John Smith</p>
          </div>

          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium">info@gmail.com</p>
          </div>

          <div>
            <p className="text-gray-500">Phone Number</p>
            <p className="font-medium">+91 35356 99</p>
          </div>

          <div>
            <p className="text-gray-500">Address</p>
            <p className="font-medium">Address here</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-gray-500 text-sm mb-2">Store Logo</p>
          <div className="h-12 w-32 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
            Logo
          </div>
        </div>
      </InfoCard>

      {/* STORE INFO */}
      <InfoCard title="Store Info">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
          <div>
            <p className="text-gray-500">Store Name</p>
            <p className="font-medium">Blossom Store</p>
          </div>

          <div>
            <p className="text-gray-500">Store URL</p>
            <p className="font-medium">URL here</p>
          </div>

          <div>
            <p className="text-gray-500">Location</p>
            <p className="flex items-center gap-1 font-medium">
              📍 Street #3 main road
            </p>
          </div>

          <div>
            <p className="text-gray-500">Time Zone</p>
            <p className="font-medium">USA Time zone</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mt-6">
          <div>
            <p className="text-gray-500">Currency</p>
            <p className="font-medium">USDT</p>
          </div>

          <div>
            <p className="text-gray-500">Language</p>
            <p className="font-medium">French</p>
          </div>
        </div>
      </InfoCard>

      {/* DOMAIN SETUP */}
      <InfoCard title="Domain Setup">
        <div className="space-y-4 text-sm">
          <div>
            <p className="text-gray-500">Using Platform Subdomain</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-500">Domain</p>
              <p className="font-medium">Domain URL</p>
            </div>

            <div>
              <p className="text-gray-500">Domain Verification Status</p>
              <span className="inline-block px-4 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                Connected
              </span>
            </div>

            <div>
              <p className="text-gray-500">SSL Status</p>
              <span className="inline-block px-4 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                Verified
              </span>
            </div>
          </div>
        </div>
      </InfoCard>

      {/* ERP INTEGRATION */}
      <InfoCard title="ERP Integration">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <p className="text-gray-500">ERP Provider</p>
            <p className="font-medium">Provider Name</p>
          </div>

          <div>
            <p className="text-gray-500">API Key</p>
            <p className="font-medium">API here</p>
          </div>

          <div>
            <p className="text-gray-500">Status</p>
            <span className="inline-block px-4 py-1 rounded-full bg-green-100 text-green-700 text-xs">
              Verified
            </span>
          </div>
        </div>
      </InfoCard>
    </div>
  );
};

export default VendorOnboard;
