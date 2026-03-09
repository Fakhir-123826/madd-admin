import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    useCreateAttributeSetMutation,
    useUpdateAttributeSetMutation,
    useGetAttributeSetQuery,
    useGetAttributeSetsQuery,
} from "../../../app/api/MagentoSlices/AttributeSetApi";

function AddMagentoAttributeSet() {
    const navigate = useNavigate();
    const { id: paramId } = useParams();
    const isEditMode = !!paramId;
    const numericId = paramId ? Number(paramId) : 0;

    const [createAttributeSet, { isLoading: isCreating }] = useCreateAttributeSetMutation();
    const [updateAttributeSet, { isLoading: isUpdating }] = useUpdateAttributeSetMutation();

    const { data: attributeSetResponse, isLoading: isFetching } = useGetAttributeSetQuery(numericId, {
        skip: !isEditMode,
    });

    // Based On dropdown ke liye — sirf create mode mein
    const { data: allSetsResponse } = useGetAttributeSetsQuery({ page: 1, pageSize: 100 }, {
        skip: isEditMode,
    });
    const allSets = allSetsResponse?.data?.items ?? [];

    const existingSet = attributeSetResponse?.data;

    // Form state
    const [name, setName] = useState("");
    const [sortOrder, setSortOrder] = useState(0);
    const [skeletonId, setSkeletonId] = useState(4);
    const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Load existing data in edit mode
    useEffect(() => {
        if (isEditMode && existingSet) {
            setName(existingSet.attribute_set_name || "");
            setSortOrder(existingSet.sort_order || 0);
        }
    }, [isEditMode, existingSet]);

    const handleSubmit = async () => {
        if (!name.trim()) {
            setNotification({ type: "error", message: "Attribute Set Name is required!" });
            return;
        }

        try {
            if (isEditMode) {
                await updateAttributeSet({
                    id: numericId,
                    payload: {
                        attributeSet: {
                            attribute_set_name: name,
                            sort_order: sortOrder,
                            entity_type_id: existingSet?.entity_type_id ?? 4,
                        }
                    }
                }).unwrap();
                setNotification({ type: "success", message: "Attribute Set updated successfully!" });
            } else {
                await createAttributeSet({
                    attribute_set_name: name,
                    sort_order: sortOrder,
                    entity_type_code: "catalog_product",
                    entity_type_id: 0,
                    skeleton_id: skeletonId,
                }).unwrap();
                setNotification({ type: "success", message: "Attribute Set created successfully!" });
            }

            setTimeout(() => navigate("/MagentoAttributeSets"), 1500);
        } catch (err) {
            setNotification({
                type: "error",
                message: isEditMode ? "Error updating attribute set!" : "Error creating attribute set!"
            });
            console.error(err);
        }
    };

    const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-50 transition-all";
    const labelClass = "block text-sm font-medium text-gray-700 mb-2";

    if (isEditMode && isFetching) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-center py-20">
                <p className="text-gray-400 text-sm">Loading attribute set...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="p-8">

                {/* HEADER */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            {isEditMode ? "Edit Attribute Set" : "New Attribute Set"}
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">
                            {isEditMode ? `Editing ID: ${paramId}` : "Create a new Magento attribute set"}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/MagentoAttributeSets")}
                        className="px-4 py-2 rounded-full border border-gray-200 text-gray-500 text-sm hover:bg-gray-50 transition-colors"
                    >
                        ← Back
                    </button>
                </div>

                {/* NOTIFICATION */}
                {notification && (
                    <div className={`flex items-center justify-between px-4 py-3 rounded-xl mb-6 text-sm font-medium
                        ${notification.type === "success"
                            ? "bg-green-50 text-green-600 border border-green-200"
                            : "bg-red-50 text-red-500 border border-red-200"}`}
                    >
                        <span>{notification.message}</span>
                        <button
                            onClick={() => setNotification(null)}
                            className="text-lg leading-none opacity-60 hover:opacity-100"
                        >✕</button>
                    </div>
                )}

                {/* FORM */}
                <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 pb-2 border-b border-gray-100">
                        Attribute Set Properties
                    </h3>
                    <div className="space-y-5">

                        {/* ID — edit mode mein show karo */}
                        {isEditMode && (
                            <div>
                                <label className={labelClass}>Attribute Set ID</label>
                                <input
                                    type="text"
                                    value={paramId}
                                    className={`${inputClass} bg-gray-50 text-gray-400 cursor-not-allowed`}
                                    readOnly
                                />
                                <p className="text-xs text-gray-400 mt-1">ID cannot be changed.</p>
                            </div>
                        )}

                        {/* Name */}
                        <div>
                            <label className={labelClass}>
                                Attribute Set Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={inputClass}
                                placeholder="e.g. Clothing"
                            />
                        </div>

                        {/* Sort Order */}
                        <div>
                            <label className={labelClass}>Sort Order</label>
                            <input
                                type="number"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(Number(e.target.value))}
                                className={inputClass}
                                placeholder="e.g. 0"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                Controls display order in lists.
                            </p>
                        </div>

                        {/* Based On Dropdown — sirf create mode mein */}
                        {!isEditMode && (
                            <div>
                                <label className={labelClass}>
                                    Based On <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={skeletonId}
                                    onChange={(e) => setSkeletonId(Number(e.target.value))}
                                    className={inputClass}
                                >
                                    {allSets.length === 0 ? (
                                        <option value={4}>Default (ID: 4)</option>
                                    ) : (
                                        allSets.map((set:any) => (
                                            <option key={set.attribute_set_id} value={set.attribute_set_id}>
                                                {set.attribute_set_name} (ID: {set.attribute_set_id})
                                            </option>
                                        ))
                                    )}
                                </select>
                                <p className="text-xs text-gray-400 mt-1">
                                    New set will copy structure from selected attribute set.
                                </p>
                            </div>
                        )}

                    </div>
                </div>

                {/* SUBMIT */}
                <button
                    onClick={handleSubmit}
                    disabled={isCreating || isUpdating}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-400 to-green-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isCreating || isUpdating
                        ? (isEditMode ? "Updating..." : "Creating...")
                        : (isEditMode ? "Update Attribute Set" : "Save Attribute Set")}
                </button>

            </div>
        </div>
    );
}

export default AddMagentoAttributeSet;