import React, { useState } from "react";
import {
    FiKey,
    FiServer,
    FiGrid,
    FiBriefcase,
    FiInfo,
    FiEye,
    FiEyeOff,
    FiSave,
    FiExternalLink,
    FiHelpCircle,
    FiX,
    FiCheckCircle,
    FiLock,
} from "react-icons/fi";

type Tab = "sandbox" | "production" | "saas" | "ims";

const tabs = [
    {
        id: "sandbox" as Tab,
        label: "Sandbox Keys",
        icon: <FiKey size={16} />,
        order: 1,
    },
    {
        id: "production" as Tab,
        label: "Production Keys",
        icon: <FiServer size={16} />,
        order: 2,
    },
    {
        id: "saas" as Tab,
        label: "SaaS Identifier",
        icon: <FiGrid size={16} />,
        order: 3,
    },
    {
        id: "ims" as Tab,
        label: "IMS Organization",
        icon: <FiBriefcase size={16} />,
        order: 4,
    },
];

interface KeyFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    multiline?: boolean;
    required?: boolean;
}

function KeyField({
    label,
    value,
    onChange,
    multiline = false,
    required = false,
}: KeyFieldProps) {
    const [show, setShow] = useState(false);

    return (
        <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
                <label className="text-xs uppercase font-semibold text-gray-600">
                    {label}
                </label>
                {required && (
                    <span className="text-red-500 text-xs">*</span>
                )}
            </div>

            <div className="relative">
                {multiline ? (
                    <textarea
                        rows={4}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder={`Enter ${label}`}
                    />
                ) : (
                    <input
                        type={show ? "text" : "password"}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder={`Enter ${label}`}
                    />
                )}

                {!multiline && (
                    <button
                        type="button"
                        onClick={() => setShow(!show)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                        {show ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                )}
            </div>
        </div>
    );
}

// IMS Guidance Modal Component with detailed content
function ImsGuidanceModal({ onClose }: { onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                            <FiHelpCircle className="text-white" size={16} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800">
                            Adobe Organization Email & API Setup Guide
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                        <p className="text-sm text-blue-800">
                            This guide explains how to create an Adobe organization account, set up a project, 
                            configure the required APIs, and obtain your Organization ID for integration purposes.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold">1</span>
                            Access Adobe Developer Console
                        </h3>
                        <ul className="space-y-2 ml-8">
                            <li className="text-sm text-gray-600">• Open your web browser.</li>
                            <li className="text-sm text-gray-600">
                                • Navigate to the Adobe Admin Console: 
                                <a href="https://adminconsole.adobe.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                                    https://adminconsole.adobe.com
                                </a>
                            </li>
                            <li className="text-sm text-gray-600">• Sign in using your Adobe credentials.</li>
                            <li className="text-sm text-gray-600">• If you do not have an account, select <strong>Create Account</strong> and complete the registration process.</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold">2</span>
                            Create a New Project
                        </h3>
                        <ul className="space-y-2 ml-8">
                            <li className="text-sm text-gray-600">• After logging in, access the Adobe Developer Console.</li>
                            <li className="text-sm text-gray-600">• Click <strong>Create New Project</strong>.</li>
                            <li className="text-sm text-gray-600">• Enter a meaningful project name.</li>
                            <li className="text-sm text-gray-600">• Save the project.</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold">3</span>
                            Configure Required APIs
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 ml-8">Inside the newly created project, you must configure two APIs.</p>
                        
                        <div className="ml-8 space-y-4">
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                <h4 className="font-medium text-gray-800 text-sm mb-2">API #1: OAuth Web Application</h4>
                                <ul className="space-y-1 text-sm text-gray-600">
                                    <li>• Open your project.</li>
                                    <li>• Click <strong>Add API</strong>.</li>
                                    <li>• Select <strong>OAuth Web App</strong>.</li>
                                    <li>• Configure Redirect URLs, Application details, Permissions and scopes.</li>
                                    <li>• Save the configuration.</li>
                                </ul>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                <h4 className="font-medium text-gray-800 text-sm mb-2">API #2: I/O Management API</h4>
                                <ul className="space-y-1 text-sm text-gray-600">
                                    <li>• Within the same project, click <strong>Add API</strong> again.</li>
                                    <li>• Select <strong>I/O Management API</strong>.</li>
                                    <li>• Complete the API setup process.</li>
                                    <li>• Save the configuration.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold">4</span>
                            Obtain Organization ID
                        </h3>
                        <ul className="space-y-2 ml-8">
                            <li className="text-sm text-gray-600">• Open your organization's details page.</li>
                            <li className="text-sm text-gray-600">• Locate the <strong>Organization ID</strong>.</li>
                            <li className="text-sm text-gray-600">• Example: <code className="bg-gray-100 px-2 py-1 rounded text-xs">344883FE6A1068F30A495E2A@AdobeOrg</code></li>
                            <li className="text-sm text-gray-600">• Copy the Organization ID exactly as displayed.</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold">5</span>
                            Save Configuration
                        </h3>
                        <ul className="space-y-2 ml-8">
                            <li className="text-sm text-gray-600">• Open the application or platform where Adobe integration is being configured.</li>
                            <li className="text-sm text-gray-600">• Paste the copied <strong>Organization ID</strong> into the designated field.</li>
                            <li className="text-sm text-gray-600">• Verify that all API configurations are completed successfully.</li>
                            <li className="text-sm text-gray-600">• Click <strong>Save</strong>.</li>
                        </ul>
                    </div>

                    <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                        <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                            <FiCheckCircle size={18} />
                            Verification Checklist
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div className="flex items-center gap-2 text-sm text-green-700">
                                <FiCheckCircle size={14} /> Adobe account created
                            </div>
                            <div className="flex items-center gap-2 text-sm text-green-700">
                                <FiCheckCircle size={14} /> Project created successfully
                            </div>
                            <div className="flex items-center gap-2 text-sm text-green-700">
                                <FiCheckCircle size={14} /> OAuth Web App API configured
                            </div>
                            <div className="flex items-center gap-2 text-sm text-green-700">
                                <FiCheckCircle size={14} /> I/O Management API configured
                            </div>
                            <div className="flex items-center gap-2 text-sm text-green-700">
                                <FiCheckCircle size={14} /> Organization ID copied correctly
                            </div>
                            <div className="flex items-center gap-2 text-sm text-green-700">
                                <FiCheckCircle size={14} /> Organization ID saved in application
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                        <h3 className="font-semibold text-amber-800 mb-2">Support Notes</h3>
                        <ul className="space-y-1 text-sm text-amber-700">
                            <li>• Ensure you are using an Adobe account with sufficient administrative permissions.</li>
                            <li>• Verify that both APIs are created within the same project.</li>
                            <li>• Double-check the Organization ID before saving to avoid authentication issues.</li>
                            <li>• If any API setup fails, review Adobe's permission and access requirements.</li>
                        </ul>
                    </div>
                </div>

                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-medium"
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function CommerceServicesConfig() {
    const [activeTab, setActiveTab] = useState<Tab>("sandbox");
    const [showImsGuidance, setShowImsGuidance] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Sandbox state
    const [sandboxPublicKey, setSandboxPublicKey] = useState("");
    const [sandboxPrivateKey, setSandboxPrivateKey] = useState("");

    // Production state
    const [productionPublicKey, setProductionPublicKey] = useState("");
    const [productionPrivateKey, setProductionPrivateKey] = useState("");

    // SaaS state
    const [project, setProject] = useState("");
    const [dataSpace, setDataSpace] = useState("");

    // IMS state (optional)
    const [imsOrganization, setImsOrganization] = useState("");

    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Check if sandbox section is complete
    const isSandboxComplete = () => {
        return sandboxPublicKey.trim() !== "" && sandboxPrivateKey.trim() !== "";
    };

    // Check if production section is complete
    const isProductionComplete = () => {
        return productionPublicKey.trim() !== "" && productionPrivateKey.trim() !== "";
    };

    // Check if SaaS section is complete
    const isSaaSComplete = () => {
        return project.trim() !== "" && dataSpace.trim() !== "";
    };

    // Get current section completion status based on active tab
    const isCurrentSectionComplete = () => {
        switch (activeTab) {
            case "sandbox":
                return isSandboxComplete();
            case "production":
                return isProductionComplete();
            case "saas":
                return isSaaSComplete();
            case "ims":
                return true; // IMS is optional
            default:
                return false;
        }
    };

    // Handle tab change with validation
    const handleTabChange = (tabId: Tab) => {
        const tabsOrder = ["sandbox", "production", "saas", "ims"];
        const currentIndex = tabsOrder.indexOf(activeTab);
        const targetIndex = tabsOrder.indexOf(tabId);

        // If moving to a previous tab, allow freely
        if (targetIndex < currentIndex) {
            setActiveTab(tabId);
            setShowImsGuidance(false);
            return;
        }

        // If moving to next tab, validate current section
        if (targetIndex > currentIndex) {
            if (!isCurrentSectionComplete()) {
                setErrorMessage(`Please complete the ${activeTab.toUpperCase()} section before proceeding.`);
                setShowErrorModal(true);
                return;
            }
        }

        // If moving to IMS from SaaS, check if SaaS is complete
        if (tabId === "ims" && !isSaaSComplete()) {
            setErrorMessage("Please complete the SAAS IDENTIFIER section before accessing IMS Organization.");
            setShowErrorModal(true);
            return;
        }

        setActiveTab(tabId);
        setShowImsGuidance(false);
    };

    // Handle save with sequential validation
    const saveData = () => {
        // For saving, we need all required sections to be complete in sequence
        if (!isSandboxComplete() && !isProductionComplete() && !isSaaSComplete()) {
            setErrorMessage("Please complete at least the Sandbox section first.");
            setShowErrorModal(true);
            return;
        }

        if (isSandboxComplete() && !isProductionComplete() && !isSaaSComplete()) {
            setErrorMessage("Please complete Production Keys section before saving.");
            setShowErrorModal(true);
            return;
        }

        if (isSandboxComplete() && isProductionComplete() && !isSaaSComplete()) {
            setErrorMessage("Please complete SaaS Identifier section before saving.");
            setShowErrorModal(true);
            return;
        }

        const configData = {
            sandbox: { publicKey: sandboxPublicKey, privateKey: sandboxPrivateKey },
            production: { publicKey: productionPublicKey, privateKey: productionPrivateKey },
            saas: { project, dataSpace },
            ims: { organization: imsOrganization },
        };
        console.log("Saved Configuration:", configData);
        setShowSuccessModal(true);
    };

    // Handle sandbox field changes - if incomplete, reset subsequent sections
    const handleSandboxChange = (field: string, value: string) => {
        if (field === "public") {
            setSandboxPublicKey(value);
        } else {
            setSandboxPrivateKey(value);
        }
        
        // If sandbox becomes incomplete, reset production and SaaS
        const newPublicKey = field === "public" ? value : sandboxPublicKey;
        const newPrivateKey = field === "private" ? value : sandboxPrivateKey;
        
        if ((newPublicKey === "" || newPrivateKey === "") && (productionPublicKey !== "" || productionPrivateKey !== "" || project !== "" || dataSpace !== "")) {
            setProductionPublicKey("");
            setProductionPrivateKey("");
            setProject("");
            setDataSpace("");
            setErrorMessage("Sandbox section is incomplete. Production and SaaS sections have been reset.");
            setShowErrorModal(true);
        }
    };

    // Handle production field changes - if incomplete, reset SaaS
    const handleProductionChange = (field: string, value: string) => {
        if (field === "public") {
            setProductionPublicKey(value);
        } else {
            setProductionPrivateKey(value);
        }
        
        // If production becomes incomplete, reset SaaS
        const newPublicKey = field === "public" ? value : productionPublicKey;
        const newPrivateKey = field === "private" ? value : productionPrivateKey;
        
        if ((newPublicKey === "" || newPrivateKey === "") && (project !== "" || dataSpace !== "")) {
            setProject("");
            setDataSpace("");
            setErrorMessage("Production section is incomplete. SaaS section has been reset.");
            setShowErrorModal(true);
        }
    };

    // Handle SaaS field changes
    const handleSaaSChange = (field: string, value: string) => {
        if (field === "project") {
            setProject(value);
        } else {
            setDataSpace(value);
        }
    };

    const openDocumentation = () => {
        window.open("https://developer.adobe.com/commerce/services/", "_blank");
    };

    const getSectionStatus = (tabId: Tab) => {
        switch (tabId) {
            case "sandbox":
                return isSandboxComplete() ? "complete" : "pending";
            case "production":
                return isProductionComplete() ? "complete" : isSandboxComplete() ? "pending" : "locked";
            case "saas":
                return isSaaSComplete() ? "complete" : isProductionComplete() ? "pending" : "locked";
            case "ims":
                return "optional";
            default:
                return "pending";
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case "sandbox":
                return (
                    <div className="animate-fadeIn">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Sandbox API Keys
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">
                                Configure your test environment credentials
                            </p>
                        </div>

                        <KeyField
                            label="Sandbox Public API Key"
                            value={sandboxPublicKey}
                            onChange={(val) => handleSandboxChange("public", val)}
                            required
                        />

                        <KeyField
                            label="Sandbox Private API Key"
                            value={sandboxPrivateKey}
                            onChange={(val) => handleSandboxChange("private", val)}
                            multiline
                            required
                        />

                        <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                            <div className="flex items-start gap-2">
                                <FiInfo className="text-amber-600 mt-0.5" size={16} />
                                <p className="text-xs text-amber-700">
                                    Sandbox keys are for testing only. Complete this section to unlock Production Keys.
                                </p>
                            </div>
                        </div>
                    </div>
                );

            case "production":
                return (
                    <div className="animate-fadeIn">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Production API Keys
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">
                                Configure your live environment credentials
                            </p>
                            {!isSandboxComplete() && (
                                <div className="mt-2 p-3 bg-gray-100 rounded-lg flex items-center gap-2">
                                    <FiLock size={14} className="text-gray-500" />
                                    <p className="text-xs text-gray-600">Complete Sandbox Keys first to unlock this section</p>
                                </div>
                            )}
                        </div>

                        <KeyField
                            label="Production Public API Key"
                            value={productionPublicKey}
                            onChange={(val) => handleProductionChange("public", val)}
                            required={isSandboxComplete()}
                        />

                        <KeyField
                            label="Production Private API Key"
                            value={productionPrivateKey}
                            onChange={(val) => handleProductionChange("private", val)}
                            multiline
                            required={isSandboxComplete()}
                        />

                        <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-200">
                            <div className="flex items-start gap-2">
                                <FiInfo className="text-red-600 mt-0.5" size={16} />
                                <p className="text-xs text-red-700">
                                    Never share production keys. Complete this section to unlock SaaS Identifier.
                                </p>
                            </div>
                        </div>
                    </div>
                );

            case "saas":
                return (
                    <div className="animate-fadeIn">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">
                                SaaS Identifier
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">
                                Connect your SaaS services configuration
                            </p>
                            {!isProductionComplete() && (
                                <div className="mt-2 p-3 bg-gray-100 rounded-lg flex items-center gap-2">
                                    <FiLock size={14} className="text-gray-500" />
                                    <p className="text-xs text-gray-600">Complete Production Keys first to unlock this section</p>
                                </div>
                            )}
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <label className="text-xs uppercase font-semibold text-gray-600">
                                    Project Name
                                </label>
                                <span className="text-red-500 text-xs">*</span>
                            </div>
                            <input
                                value={project}
                                onChange={(e) => handleSaaSChange("project", e.target.value)}
                                placeholder="e.g., my-commerce-project"
                                disabled={!isProductionComplete()}
                                className={`w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${!isProductionComplete() ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
                            />
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <label className="text-xs uppercase font-semibold text-gray-600">
                                    Data Space ID
                                </label>
                                <span className="text-red-500 text-xs">*</span>
                            </div>
                            <input
                                value={dataSpace}
                                onChange={(e) => handleSaaSChange("dataSpace", e.target.value)}
                                placeholder="e.g., ds_abc123def456"
                                disabled={!isProductionComplete()}
                                className={`w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${!isProductionComplete() ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
                            />
                        </div>

                        <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                            <div className="flex items-start gap-2">
                                <FiInfo className="text-purple-600 mt-0.5" size={16} />
                                <p className="text-xs text-purple-700">
                                    SaaS Identifier enables Product Recommendations, Live Search, and Catalog Service.
                                </p>
                            </div>
                        </div>
                    </div>
                );

            case "ims":
                return (
                    <div className="animate-fadeIn">
                        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    IMS Organization
                                </h2>
                                <p className="text-gray-500 text-sm mt-1">
                                    Adobe Identity Management System Configuration (Optional)
                                </p>
                            </div>
                            <button
                                onClick={() => setShowImsGuidance(true)}
                                className="flex items-center gap-2 px-3 py-1.5 border border-blue-200 rounded-lg text-blue-600 hover:bg-blue-50 transition-all text-sm"
                            >
                                <FiHelpCircle size={16} />
                                Guidance
                            </button>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <label className="text-xs uppercase font-semibold text-gray-600">
                                    IMS Organization ID
                                </label>
                                <span className="text-gray-400 text-xs">(Optional)</span>
                            </div>
                            <input
                                type="text"
                                value={imsOrganization}
                                onChange={(e) => setImsOrganization(e.target.value)}
                                placeholder="Enter IMS Organization ID (e.g., 344883FE6A1068F30A495E2A@AdobeOrg)"
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </div>

                        <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                            <div className="flex items-start gap-2">
                                <FiInfo className="text-indigo-600 mt-0.5" size={16} />
                                <p className="text-xs text-indigo-700">
                                    IMS Organization connects your Commerce instance with Adobe's authentication system. This field is optional.
                                </p>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-50 to-white px-4 sm:px-8 py-5 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                                    <FiServer className="text-white" size={20} />
                                </div>
                                <div>
                                    <h1 className="font-bold text-gray-800 text-lg sm:text-xl">
                                        Commerce Services Connector
                                    </h1>
                                    <p className="text-xs text-gray-500">
                                        Configure API credentials and service identifiers
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-64 border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50/50 p-3 overflow-x-auto">
                            <div className="flex md:flex-col gap-2 min-w-max md:min-w-0">
                                {tabs.map((tab) => {
                                    const status = getSectionStatus(tab.id);
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => handleTabChange(tab.id)}
                                            disabled={status === "locked"}
                                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap
                                                ${activeTab === tab.id
                                                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                                                    : status === "locked"
                                                    ? "text-gray-400 cursor-not-allowed bg-gray-100"
                                                    : "text-gray-600 hover:bg-gray-100"
                                                }`}
                                        >
                                            <span className={activeTab === tab.id ? "text-white" : status === "locked" ? "text-gray-400" : "text-gray-500"}>
                                                {tab.icon}
                                            </span>
                                            {tab.label}
                                            {status === "complete" && (
                                                <FiCheckCircle size={14} className="text-green-500 ml-auto" />
                                            )}
                                            {status === "optional" && (
                                                <span className="text-xs text-gray-400 ml-auto">Opt</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <main className="flex-1 p-4 sm:p-6 md:p-8">
                            {renderContent()}
                        </main>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-8 py-4 border-t border-gray-200 bg-gray-50/30">
                        <button
                            onClick={openDocumentation}
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all w-full sm:w-auto"
                        >
                            <FiExternalLink size={16} />
                            Learn More
                        </button>

                        <button
                            onClick={saveData}
                            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-md w-full sm:w-auto"
                        >
                            <FiSave size={16} />
                            Save Configuration
                        </button>
                    </div>
                </div>

                {/* Success Modal */}
                {showSuccessModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-fadeInUp">
                            <div className="p-6 text-center">
                                <div className="w-16 h-16 rounded-full bg-green-100 mx-auto flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    Configuration Saved!
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    Your Commerce Services settings have been successfully updated.
                                </p>
                                <button
                                    onClick={() => setShowSuccessModal(false)}
                                    className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-medium"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Modal */}
                {showErrorModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-fadeInUp">
                            <div className="p-6 text-center">
                                <div className="w-16 h-16 rounded-full bg-red-100 mx-auto flex items-center justify-center mb-4">
                                    <FiX size={28} className="text-red-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    Validation Error
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    {errorMessage}
                                </p>
                                <button
                                    onClick={() => setShowErrorModal(false)}
                                    className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-medium"
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* IMS Guidance Modal */}
                {showImsGuidance && (
                    <ImsGuidanceModal onClose={() => setShowImsGuidance(false)} />
                )}
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fadeInUp {
                    animation: fadeInUp 0.2s ease-out;
                }
            `}</style>
        </div>
    );
}