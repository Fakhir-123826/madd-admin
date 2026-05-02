// src/screens/Config/Themes.tsx
import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaStar, FaSync, FaEye, FaPalette } from "react-icons/fa";
import {
    useGetThemesQuery,
    useCreateThemeMutation,
    useUpdateThemeMutation,
    useDeleteThemeMutation,
    useSetDefaultThemeMutation,
    type Theme,
} from "../../app/api/ConfigSlices/ConfigApi";

const Themes = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    const { data, isLoading, refetch } = useGetThemesQuery();
    const [createTheme, { isLoading: isCreating }] = useCreateThemeMutation();
    const [updateTheme, { isLoading: isUpdating }] = useUpdateThemeMutation();
    const [deleteTheme] = useDeleteThemeMutation();
    const [setDefaultTheme] = useSetDefaultThemeMutation();

    const themes = data?.data ?? [];

    const showToast = (type: "success" | "error", msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSubmit = async (formData: Partial<Theme>) => {
        try {
            if (selectedTheme) {
                await updateTheme({ id: selectedTheme.id, data: formData }).unwrap();
                showToast("success", "Theme updated successfully");
            } else {
                await createTheme(formData).unwrap();
                showToast("success", "Theme created successfully");
            }
            setIsModalOpen(false);
            setSelectedTheme(null);
            refetch();
        } catch (error: any) {
            showToast("error", error?.data?.message || "Failed to save theme");
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this theme?")) {
            try {
                await deleteTheme(id).unwrap();
                showToast("success", "Theme deleted successfully");
                refetch();
            } catch (error: any) {
                showToast("error", error?.data?.message || "Failed to delete theme");
            }
        }
    };

    const handleSetDefault = async (id: number) => {
        try {
            await setDefaultTheme(id).unwrap();
            showToast("success", "Default theme updated successfully");
            refetch();
        } catch (error: any) {
            showToast("error", error?.data?.message || "Failed to set default theme");
        }
    };

    const filteredThemes = themes.filter(theme =>
        theme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        theme.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-teal-500" />
            </div>
        );
    }

    const defaultTheme = themes.find(t => t.is_default);

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
                    <h2 className="text-lg font-semibord text-gray-800">Themes</h2>
                    <p className="text-sm text-gray-500">Manage store themes and appearance</p>
                    {defaultTheme && (
                        <p className="text-xs text-teal-600 mt-1">Default Theme: {defaultTheme.name} v{defaultTheme.version}</p>
                    )}
                </div>
                <div className="flex gap-3">
                    <button onClick={() => refetch()} className="h-10 w-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-teal-500 transition">
                        <FaSync className="text-sm" />
                    </button>
                    <button
                        onClick={() => {
                            setSelectedTheme(null);
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-green-400 text-white text-sm font-medium hover:opacity-90 transition"
                    >
                        <FaPlus className="text-xs" /> Upload Theme
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-6 max-w-sm">
                <input
                    type="text"
                    placeholder="Search by theme name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-4 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredThemes.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-400">
                        No themes found
                    </div>
                ) : (
                    filteredThemes.map((theme) => (
                        <div key={theme.id} className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                            {/* Preview Image */}
                            <div className="h-40 bg-gradient-to-r from-purple-400 to-pink-400 relative">
                                {theme.preview_image ? (
                                    <img src={theme.preview_image} alt={theme.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <FaPalette className="text-white text-4xl opacity-50" />
                                    </div>
                                )}
                                {theme.is_default && (
                                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                                        <FaStar className="text-xs" /> Default
                                    </div>
                                )}
                            </div>

                            <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{theme.name}</h3>
                                        <p className="text-xs text-gray-400">v{theme.version}</p>
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => {
                                                setSelectedTheme(theme);
                                                setIsModalOpen(true);
                                            }}
                                            className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition"
                                            title="Edit"
                                        >
                                            <FaEdit className="text-sm" />
                                        </button>
                                        {!theme.is_default && (
                                            <button onClick={() => handleDelete(theme.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                                                <FaTrash className="text-sm" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                    {theme.description || "No description provided"}
                                </p>

                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                    <div className="flex gap-2">
                                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${theme.is_active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                                            {theme.is_active ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                    {!theme.is_default && theme.is_active && (
                                        <button
                                            onClick={() => handleSetDefault(theme.id)}
                                            className="text-xs text-teal-600 hover:text-teal-700 flex items-center gap-1"
                                        >
                                            <FaStar className="text-xs" /> Set as Default
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Theme Modal */}
            <ThemeModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setSelectedTheme(null); }}
                theme={selectedTheme}
                onSave={handleSubmit}
                isLoading={isCreating || isUpdating}
            />
        </div>
    );
};

// Theme Modal Component
const ThemeModal = ({ isOpen, onClose, theme, onSave, isLoading }: any) => {
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        version: "1.0.0",
        description: "",
        preview_image: "",
        thumbnail: "",
        is_active: true,
        config: {},
    });

    React.useEffect(() => {
        if (theme) {
            setFormData({
                name: theme.name,
                slug: theme.slug,
                version: theme.version,
                description: theme.description || "",
                preview_image: theme.preview_image || "",
                thumbnail: theme.thumbnail || "",
                is_active: theme.is_active,
                config: theme.config || {},
            });
        } else {
            setFormData({
                name: "",
                slug: "",
                version: "1.0.0",
                description: "",
                preview_image: "",
                thumbnail: "",
                is_active: true,
                config: {},
            });
        }
    }, [theme]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const generateSlug = () => {
        const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        setFormData(prev => ({ ...prev, slug }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
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
                        <h2 className="text-lg font-bold">{theme ? "Edit Theme" : "Upload Theme"}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Theme Name *</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Slug *</label>
                                <div className="flex gap-2">
                                    <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="flex-1 px-3 py-2 border rounded-lg" />
                                    <button type="button" onClick={generateSlug} className="px-3 py-2 bg-gray-100 rounded-lg">Gen</button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Version *</label>
                                <input type="text" name="version" value={formData.version} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Preview Image URL</label>
                            <input type="url" name="preview_image" value={formData.preview_image} onChange={handleChange} placeholder="https://..." className="w-full px-3 py-2 border rounded-lg" />
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

export default Themes;