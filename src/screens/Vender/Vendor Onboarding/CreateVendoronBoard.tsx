import React, { useState } from "react";
import AddButton from "../../../component/AddButton";
import StepProgress from "../../../component/Store/StepProgress";
import Input from "../../../component/Inputs Feilds/Input";

type StoreFormState = {
    storeName: string;
    storeId: string;
    address: string;
    country: string;
    city: string;
    postalCode: string;
    email: string;
    phone: string;
    status: "active" | "inactive" | "hold";
    pickupPoint: string;
};

const CreateVendoronBoard: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<number>(0);

    const [usePlatformSubdomain, setUsePlatformSubdomain] = useState<boolean>(true);
    const [domain, setDomain] = useState<string>("vendorname.madd.com");
    const [domainStatus, setDomainStatus] = useState<"connected" | "disconnected">("connected");
    const [sslStatus, setSslStatus] = useState<"verified" | "unverified">("verified");

    const [erpProvider, setErpProvider] = useState<string>("");
    const [apiKey, setApiKey] = useState<string>("");
    const [erpStatus, setErpStatus] = useState<"connected" | "disconnected">("connected");


    const [form, setForm] = useState<StoreFormState>({
        storeName: "",
        storeId: "",
        address: "",
        country: "",
        city: "",
        postalCode: "",
        email: "",
        phone: "",
        status: "active",
        pickupPoint: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div>
            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Stores Management</h2>
                <AddButton />
            </div>

            {/* ######################################## */}
            {/* ##############First Step################ */}
            {/* ######################################## */}
            {currentStep === 0 && (
                <div className="bg-white p-6 px-12 rounded-xl shadow-sm space-y-6 my-1">
                    {/* STEPS */}
                    <StepProgress
                        currentStep={currentStep}
                        steps={[
                            { label: "Basic Details" },
                            { label: "Store Branding & Setup" },
                            { label: "Domain" },
                            { label: "ERP Integration" },
                            { label: "Pick up" },
                        ]}
                    />

                    <div className="font-bold">Basic Info</div>

                    {/* STORE BASIC INFO */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Vendor Name"
                            name="storeName"
                            placeholder="Blossom Flowers"
                            value={form.storeName}
                            onChange={handleChange}
                        />

                        <Input
                            label="Businuss Type"
                            name="storeId"
                            placeholder="23435465"
                            value={form.storeId}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Email"
                            name="storeName"
                            placeholder="Blossom Flowers"
                            value={form.storeName}
                            onChange={handleChange}
                        />

                        <Input
                            label="Phone Number"
                            name="storeId"
                            placeholder="23435465"
                            value={form.storeId}
                            onChange={handleChange}
                        />
                    </div>


                    <div>
                        <h3 className="text-xs font-medium mb-2">Store Logo</h3>

                        <div className="h-28 w-28 rounded-lg overflow-hidden border-gray-300 flex items-center justify-center bg-gray-100">
                            <img
                                src="/store.png"
                                alt="Store Logo"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            )}


            {/* ######################################## */}
            {/* ##############Second Step################ */}
            {/* ######################################## */}
            {currentStep === 1 && (
                <div className="bg-white p-6 px-12 rounded-xl shadow-sm space-y-6 my-1">
                    {/* STEPS */}
                    <StepProgress
                        currentStep={currentStep}
                        steps={[
                            { label: "Basic Details" },
                            { label: "Store Branding & Setup" },
                            { label: "Domain" },
                            { label: "ERP Integration" },
                            { label: "Pick up" },
                        ]}
                    />

                    <div className="font-bold">Store Info</div>

                    {/* STORE BASIC INFO */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Store Name"
                            name="storeName"
                            placeholder="Blossom Flowers"
                            value={form.storeName}
                            onChange={handleChange}
                        />

                        <Input
                            label="Store ID"
                            name="storeId"
                            placeholder="23435465"
                            value={form.storeId}
                            onChange={handleChange}
                        />
                    </div>

                    {/* ADDRESS */}
                    <Input
                        label="Address"
                        name="address"
                        placeholder="New, Street #3 Main road"
                        value={form.address}
                        onChange={handleChange}
                    />

                    {/* COUNTRY / CITY / POSTAL */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Input
                            label="Time zone"
                            name="country"
                            placeholder="USA"
                            value={form.country}
                            onChange={handleChange}
                        />

                        <Input
                            label="Currency"
                            name="city"
                            placeholder="New York"
                            value={form.city}
                            onChange={handleChange}
                        />

                        <Input
                            label="Language"
                            name="postalCode"
                            placeholder="246774"
                            value={form.postalCode}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            )}
            {/* ######################################## */}
            {/* ##############Third Step################ */}
            {/* ######################################## */}
            {currentStep === 2 && (
                <div className="bg-white p-6 px-12 rounded-xl shadow-sm space-y-6 my-1">
                    {/* STEPS */}
                    <StepProgress
                        currentStep={currentStep}
                        steps={[
                            { label: "Basic Details" },
                            { label: "Store Branding & Setup" },
                            { label: "Domain" },
                            { label: "ERP Integration" },
                            { label: "Pick up" },
                        ]}
                    />

                    {/* DOMAIN SETUP */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold">Domain Setup</h3>

                        {/* SWITCH */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setUsePlatformSubdomain(!usePlatformSubdomain)}
                                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors
        ${usePlatformSubdomain ? "bg-blue-500" : "bg-gray-300"}`}
                            >
                                <div
                                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform
          ${usePlatformSubdomain ? "translate-x-6" : "translate-x-0"}`}
                                />
                            </button>

                            <span className="text-sm text-gray-700">
                                Use platform subdomain?
                            </span>
                        </div>

                        {/* DOMAIN INPUT */}
                        <div className="max-w-md">
                            <label className="text-sm font-medium text-gray-700">Domain</label>
                            <input
                                type="text"
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                                disabled={usePlatformSubdomain}
                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-3
                 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400
                 disabled:bg-gray-100"
                            />
                        </div>

                        {/* STATUS */}
                        <div className="flex items-center gap-12">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Domain verification status</p>
                                <span className="px-4 py-1 rounded-full text-sm bg-green-100 text-green-700">
                                    {domainStatus === "connected" ? "Connected" : "Disconnected"}
                                </span>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600 mb-1">SSL Status</p>
                                <span className="px-4 py-1 rounded-full text-sm bg-green-100 text-green-700">
                                    {sslStatus === "verified" ? "Verified" : "Unverified"}
                                </span>
                            </div>
                        </div>

                        {/* DNS BUTTON */}
                        <button className="mt-4 inline-flex items-center justify-center rounded-md
                     bg-blue-500 px-6 py-3 text-white text-sm font-medium
                     hover:bg-blue-600 transition">
                            DNS instructions
                        </button>
                    </div>



                </div>
            )}


            {/* ######################################## */}
            {/* ##############Fourth Step################ */}
            {/* ######################################## */}
            {currentStep === 3 && (
                <div className="bg-white p-6 px-12 rounded-xl shadow-sm space-y-6 my-1">
                    {/* STEPS */}
                    <StepProgress
                        currentStep={currentStep}
                        steps={[
                            { label: "Basic Details" },
                            { label: "Store Branding & Setup" },
                            { label: "Domain" },
                            { label: "ERP Integration" },
                            { label: "Pick up" },
                        ]}
                    />

                    {/* ERP INTEGRATION */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold">ERP Integration</h3>

                        {/* ERP PROVIDER */}
                        <div className="max-w-md">
                            <label className="text-sm font-medium text-gray-700">
                                Choose ERP provider
                            </label>

                            <select
                                value={erpProvider}
                                onChange={(e) => setErpProvider(e.target.value)}
                                className="mt-1 w-full rounded-md border border-gray-300
                 px-3 py-3 text-sm outline-none
                 focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="">Choose</option>
                                <option value="sap">SAP</option>
                                <option value="oracle">Oracle</option>
                                <option value="odoo">Odoo</option>
                            </select>
                        </div>

                        {/* API KEY */}
                        <div className="max-w-md">
                            <label className="text-sm font-medium text-gray-700">
                                API key input
                            </label>

                            <input
                                type="text"
                                placeholder="Enter API key"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                className="mt-1 w-full rounded-md border border-gray-300
                 px-3 py-3 text-sm outline-none
                 focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        {/* STATUS */}
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Status</p>
                            <span className="inline-block px-4 py-1 rounded-full
                     text-sm bg-green-100 text-green-700">
                                {erpStatus === "connected" ? "Connected" : "Disconnected"}
                            </span>
                        </div>

                        {/* TEST BUTTON */}
                        <button
                            className="mt-4 inline-flex items-center justify-center
               rounded-md bg-blue-500 px-6 py-3
               text-white text-sm font-medium
               hover:bg-blue-600 transition"
                        >
                            Test Connection
                        </button>
                    </div>

                </div>
            )}

            {/* ######################################## */}
            {/* ##############Fifth Step################ */}
            {/* ######################################## */}
            {currentStep === 4 && (
                <div className="bg-white p-6 px-12 rounded-xl shadow-sm space-y-6 my-1">
                    {/* STEPS */}
                    <StepProgress
                        currentStep={currentStep}
                        steps={[
                            { label: "Basic Details" },
                            { label: "Store Branding & Setup" },
                            { label: "Domain" },
                            { label: "ERP Integration" },
                            { label: "Pick up" },
                        ]}
                    />

                    <div className="font-bold">Store Info</div>

                    {/* STORE BASIC INFO */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Store Name"
                            name="storeName"
                            placeholder="Blossom Flowers"
                            value={form.storeName}
                            onChange={handleChange}
                        />

                        <Input
                            label="Store ID"
                            name="storeId"
                            placeholder="23435465"
                            value={form.storeId}
                            onChange={handleChange}
                        />
                    </div>

                    {/* ADDRESS */}
                    <Input
                        label="Address"
                        name="address"
                        placeholder="New, Street #3 Main road"
                        value={form.address}
                        onChange={handleChange}
                    />

                    {/* COUNTRY / CITY / POSTAL */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Input
                            label="Time zone"
                            name="country"
                            placeholder="USA"
                            value={form.country}
                            onChange={handleChange}
                        />

                        <Input
                            label="Currency"
                            name="city"
                            placeholder="New York"
                            value={form.city}
                            onChange={handleChange}
                        />

                        <Input
                            label="Language"
                            name="postalCode"
                            placeholder="246774"
                            value={form.postalCode}
                            onChange={handleChange}
                        />
                    </div>
                </div>

            )}
            <div className="flex justify-between pt-6">
                <button
                    disabled={currentStep === 0}
                    onClick={() => setCurrentStep((s) => s - 1)}
                    className="px-6 py-2 rounded-md border text-sm disabled:opacity-50"
                >
                    Back
                </button>

                <button
                    disabled={currentStep === 4}
                    onClick={() => setCurrentStep((s) => s + 1)}
                    className="px-6 py-2 rounded-md bg-blue-500 text-white text-sm disabled:opacity-50"
                >
                    Next
                </button>
            </div>

        </div>
    );
};

export default CreateVendoronBoard;
