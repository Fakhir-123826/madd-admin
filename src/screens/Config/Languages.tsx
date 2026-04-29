// src/screens/Config/Languages.tsx
import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaSync, FaGlobe } from "react-icons/fa";
import {
    useGetLanguagesQuery,
    useCreateLanguageMutation,
    useUpdateLanguageMutation,
    useDeleteLanguageMutation,
    type Language,
} from "../../app/api/ConfigSlices/ConfigApi";

const Languages = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    const { data, isLoading, refetch } = useGetLanguagesQuery();
    const [createLanguage, { isLoading: isCreating }] = useCreateLanguageMutation();
    const [updateLanguage, { isLoading: isUpdating }] = useUpdateLanguageMutation();
    const [deleteLanguage] = useDeleteLanguageMutation();

    const languages = data?.data ?? [];

    const showToast = (type: "success" | "error", msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSubmit = async (formData: Partial<Language>) => {
        try {
            if (selectedLanguage) {
                await updateLanguage({ id: selectedLanguage.id, data: formData }).unwrap();
                showToast("success", "Language updated successfully");
            } else {
                await createLanguage(formData).unwrap();
                showToast("success", "Language created successfully");
            }
            setIsModalOpen(false);
            setSelectedLanguage(null);
            refetch();
        } catch (error: any) {
            showToast("error", error?.data?.message || "Failed to save language");
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this language?")) {
            try {
                await deleteLanguage(id).unwrap();
                showToast("success", "Language deleted successfully");
                refetch();
            } catch (error: any) {
                showToast("error", error?.data?.message || "Failed to delete language");
            }
        }
    };

    const filteredLanguages = languages.filter(lang =>
        lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lang.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lang.native_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-teal-500" />
            </div>
        );
    }

    const defaultLanguage = languages.find(l => l.is_default);

    return (
        <div>
            {toast && (
                <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
                    ${toast.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                    <span>{toast.type === "success" ? "✓" : "✕"}</span>
                    {toast.msg}
                </div>
            )}

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">Languages</h2>
                    <p className="text-sm text-gray-500">Manage supported languages for your store</p>
                    {defaultLanguage && (
                        <p className="text-xs text-teal-600 mt-1">Default Language: {defaultLanguage.name} ({defaultLanguage.code})</p>
                    )}
                </div>
                <div className="flex gap-3">
                    <button onClick={() => refetch()} className="h-10 w-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-teal-500 transition">
                        <FaSync className="text-sm" />
                    </button>
                    <button
                        onClick={() => {
                            setSelectedLanguage(null);
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-green-400 text-white text-sm font-medium hover:opacity-90 transition"
                    >
                        <FaPlus className="text-xs" /> Add Language
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-6 max-w-sm">
                <input
                    type="text"
                    placeholder="Search by language name, code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-4 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLanguages.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-400">
                        No languages found
                    </div>
                ) : (
                    filteredLanguages.map((language) => (
                        <div key={language.id} className="border rounded-xl p-5 shadow-sm hover:shadow-md transition-all hover:border-teal-200">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-400 to-green-400 flex items-center justify-center">
                                        <FaGlobe className="text-white text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 text-lg">{language.name}</h3>
                                        <p className="text-xs text-gray-400">{language.native_name}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => {
                                            setSelectedLanguage(language);
                                            setIsModalOpen(true);
                                        }}
                                        className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition"
                                    >
                                        <FaEdit className="text-sm" />
                                    </button>
                                    {!language.is_default && (
                                        <button onClick={() => handleDelete(language.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                                            <FaTrash className="text-sm" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2 mb-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Code:</span>
                                    <span className="font-mono text-gray-700">{language.code}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Direction:</span>
                                    <span className={`px-2 py-0.5 rounded text-xs ${language.direction === "rtl" ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-600"}`}>
                                        {language.direction.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                <div className="flex gap-2">
                                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${language.is_active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                                        {language.is_active ? "Active" : "Inactive"}
                                    </span>
                                    {language.is_default && (
                                        <span className="px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-600">
                                            Default
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs text-gray-400">
                                    Updated: {new Date(language.updated_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Language Modal */}
            <LanguageModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setSelectedLanguage(null); }}
                language={selectedLanguage}
                onSave={handleSubmit}
                isLoading={isCreating || isUpdating}
                languages={languages}
            />
        </div>
    );
};

// Language Modal Component
const LanguageModal = ({ isOpen, onClose, language, onSave, isLoading, languages }: any) => {
    const [formData, setFormData] = useState({
        code: "",
        name: "",
        native_name: "",
        direction: "ltr" as "ltr" | "rtl",
        is_default: false,
        is_active: true,
    });

    React.useEffect(() => {
        if (language) {
            setFormData({
                code: language.code,
                name: language.name,
                native_name: language.native_name,
                direction: language.direction,
                is_default: language.is_default,
                is_active: language.is_active,
            });
        } else {
            setFormData({
                code: "",
                name: "",
                native_name: "",
                direction: "ltr",
                is_default: false,
                is_active: true,
            });
        }
    }, [language]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.is_default && !language?.is_default) {
            const hasDefault = languages.some((l: Language) => l.is_default && l.id !== language?.id);
            if (hasDefault && !confirm("This will remove default from the existing default language. Continue?")) {
                return;
            }
        }
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full">
                    <div className="h-1 bg-gradient-to-r from-teal-400 to-green-400 rounded-t-2xl" />
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between">
                        <h2 className="text-lg font-bold">{language ? "Edit Language" : "Add Language"}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Code *</label>
                                <input type="text" name="code" value={formData.code} onChange={handleChange} required placeholder="en" className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Direction</label>
                                <select name="direction" value={formData.direction} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
                                    <option value="ltr">LTR (Left to Right)</option>
                                    <option value="rtl">RTL (Right to Left)</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Name *</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="English" className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Native Name *</label>
                            <input type="text" name="native_name" value={formData.native_name} onChange={handleChange} required placeholder="English" className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <span>Set as Default Language</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" name="is_default" checked={formData.is_default} onChange={handleChange} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-teal-500"></div>
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <span>Active</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-teal-500"></div>
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5"></div>
                            </label>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg border">Cancel</button>
                            <button type="submit" disabled={isLoading} className="flex-1 py-2 rounded-lg bg-gradient-to-r from-teal-400 to-green-400 text-white">
                                {isLoading ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Languages;