import { useState } from "react";
import {
    FaCog, FaBook, FaRocket, FaChartBar, FaLifeRing,
    FaHeadset, FaExternalLinkAlt, FaExclamationTriangle,
    FaCreditCard, FaArrowRight, FaCheckCircle,
    FaFlask
} from "react-icons/fa";

const MagentoPaymentServices = () => {

    return (
        <div className="space-y-6 p-5">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-gray-800">Payment Services</h1>
                </div>
                <button
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-all"
                >
                    <FaCog className={`transition-transform duration-300 rotate-90`} />
                    Settings
                </button>
            </div>

            {/* WELCOME BANNER */}
            <p className="text-sm font-bold ml-2 mb-[5px]">Home</p>
            <div className="rounded-xl shadow-sm overflow-hidden"
                style={{ background: "linear-gradient(135deg, #38bdf8 0%, #3b82f6 50%, #6366f1 100%)" }}>
                <div className="flex items-center justify-between px-8 py-7">
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-white mb-2">Welcome to Payment Services</h2>
                        <p className="text-white/80 text-sm max-w-xl leading-relaxed">
                            Payment Services provides a fully integrated payment solution, enabling you to instantly
                            accept payments from your customers along with reporting tools to manage operations with minimal effort.
                        </p>
                        <a href="https://experienceleague.adobe.com/en/docs/commerce/payment-services/introduction"
                            target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-4 px-5 py-2 bg-white text-blue-600 text-sm font-semibold rounded-xl hover:bg-blue-50 transition-all">
                            Learn More <FaArrowRight className="text-xs" />
                        </a>
                    </div>
                    <div className="hidden md:flex items-center gap-4 pr-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                            <FaCreditCard className="text-white text-2xl" />
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
                            <FaCheckCircle className="text-white text-xl" />
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                            <FaChartBar className="text-white text-lg" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* Sandbox Card */}
                <div className="relative overflow-hidden rounded-2xl border border-sky-100 bg-sky-50/60 p-6">
                    <div className="flex justify-between items-start h-full">
                        <div className="max-w-[75%]">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Process Sandbox Payments
                            </h3>

                            <p className="text-sm text-gray-500 leading-relaxed mb-5">
                                Use Payment Services in test mode to validate your setup and
                                onboarding process before moving to production.
                            </p>

                            <button
                                className="px-5 py-2 text-sm font-semibold rounded-lg text-white transition-all hover:opacity-90"
                                style={{
                                    background:
                                        "linear-gradient(to right, #38bdf8, #3b82f6)",
                                }}
                            >
                                Sandbox Onboarding
                            </button>
                        </div>

                        {/* Illustration */}
                        <div className="hidden md:flex items-center justify-center">
                            <div
                                className="w-24 h-24 rounded-2xl flex items-center justify-center"
                                style={{
                                    background:
                                        "linear-gradient(to right, #38bdf8, #3b82f6)",
                                }}
                            >
                                <FaFlask className="text-white text-4xl" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Live Payments Card */}
                <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-blue-50/60 p-6">
                    <div className="flex justify-between items-start h-full">
                        <div className="max-w-[75%]">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Process Live Payments
                            </h3>

                            <p className="text-sm text-gray-500 leading-relaxed mb-5">
                                Complete your setup and start accepting real customer
                                payments. No charges until you go live.
                            </p>

                            <button
                                className="px-5 py-2 text-sm font-semibold rounded-lg text-white transition-all hover:opacity-90"
                                style={{
                                    background:
                                        "linear-gradient(to right, #38bdf8, #3b82f6)",
                                }}
                            >
                                Get Live Payments
                            </button>
                        </div>

                        {/* Illustration */}
                        <div className="hidden md:flex items-center justify-center">
                            <div
                                className="w-24 h-24 rounded-2xl flex items-center justify-center"
                                style={{
                                    background:
                                        "linear-gradient(to right, #38bdf8, #3b82f6)",
                                }}
                            >
                                <FaCreditCard className="text-white text-4xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* LEARN */}
            <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Learn</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { icon: FaBook, title: "Read Documentation", desc: "Latest user and developer docs for Payment Services", link: "https://experienceleague.adobe.com/en/docs/commerce/payment-services/introduction", color: "from-sky-400 to-blue-500" },
                        { icon: FaRocket, title: "How to Onboard", desc: "Everything you need to set up and start using Payment Services", link: "https://experienceleague.adobe.com/en/docs/commerce/payment-services/get-started/onboard", color: "from-teal-400 to-green-500" },
                        { icon: FaChartBar, title: "Understand Financial Reports", desc: "In-depth explanation of cash flow management reporting available in Payment Services", link: "https://experienceleague.adobe.com/en/docs/commerce/payment-services/reporting/order-payment-status", color: "from-violet-400 to-purple-500" },
                    ].map((card, i) => (
                        <a key={i} href={card.link} target="_blank" rel="noopener noreferrer"
                            className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all group border border-gray-100 hover:border-gray-200">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${card.color} flex items-center justify-center mb-3`}>
                                <card.icon className="text-white text-sm" />
                            </div>
                            <h4 className="text-sm font-semibold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">{card.title}</h4>
                            <p className="text-xs text-gray-400 leading-relaxed">{card.desc}</p>
                            <div className="flex items-center gap-1 mt-3 text-xs text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                Visit <FaExternalLinkAlt className="text-[10px]" />
                            </div>
                        </a>
                    ))}
                </div>
            </div>

            {/* HELP */}
            <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Help</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { icon: FaLifeRing, title: "Visit Help Center", desc: "See troubleshooting and maintenance info in the Commerce Help Center knowledge base.", link: "https://experienceleague.adobe.com/en/docs/commerce-knowledge-base/kb/overview", color: "from-sky-400 to-blue-500" },
                        { icon: FaHeadset, title: "Get Support", desc: "Contact support for assistance with Payment Services.", link: "https://experienceleague.adobe.com/en/docs/commerce-knowledge-base/kb/overview", color: "from-teal-400 to-green-500" },
                    ].map((card, i) => (
                        <a key={i} href={card.link} target="_blank" rel="noopener noreferrer"
                            className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all group border border-gray-100 hover:border-gray-200 flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${card.color} flex items-center justify-center flex-shrink-0`}>
                                <card.icon className="text-white text-sm" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                                    {card.title}
                                    <FaExternalLinkAlt className="text-[10px] text-gray-300 group-hover:text-blue-400 transition-colors" />
                                </h4>
                                <p className="text-xs text-gray-400 leading-relaxed">{card.desc}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MagentoPaymentServices;