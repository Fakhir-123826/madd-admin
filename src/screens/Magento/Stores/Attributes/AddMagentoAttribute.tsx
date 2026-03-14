import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaPlus, FaTrash } from "react-icons/fa";
import {
    useCreateAttributeMutation,
    useUpdateAttributeMutation,
    useGetAttributeQuery,
    type AttributeOption
} from "../../../../app/api/MagentoSlices/Attributes";

const INPUT_TYPES = [
    { value: "text", label: "Text Field" },
    { value: "textarea", label: "Text Area" },
    { value: "date", label: "Date" },
    { value: "boolean", label: "Yes/No" },
    { value: "multiselect", label: "Multiple Select" },
    { value: "select", label: "Dropdown" },
    { value: "price", label: "Price" },
    { value: "media_image", label: "Media Image" },
];

const SCOPE_OPTIONS = [
    { value: "store", label: "Store View" },
    { value: "website", label: "Website" },
    { value: "global", label: "Global" },
];

function AddMagentoAttribute() {
    const navigate = useNavigate();
    const { attribute_code: paramCode } = useParams();
    const isEditMode = !!paramCode;

    const [createAttribute, { isLoading: isCreating }] = useCreateAttributeMutation();
    const [updateAttribute, { isLoading: isUpdating }] = useUpdateAttributeMutation();

    // ✅ Yeh karo — naam change karo
    const { data: attributeResponse, isLoading: isFetching } = useGetAttributeQuery(paramCode!, {
        skip: !isEditMode,
    });

    const existingAttribute = attributeResponse?.data;
    const [label, setLabel] = useState("");
    const [attributeCode, setAttributeCode] = useState("");
    const [frontendInput, setFrontendInput] = useState("text");
    const [isRequired, setIsRequired] = useState(false);
    const [scope, setScope] = useState("store");
    const [options, setOptions] = useState<AttributeOption[]>([{ label: "", value: "" }]);
    const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const showOptions = frontendInput === "select" || frontendInput === "multiselect";

    // Edit mode — load existing data
    useEffect(() => {
        if (isEditMode && existingAttribute) {
            setLabel(existingAttribute.default_frontend_label || "");
            setAttributeCode(existingAttribute.attribute_code || "");
            setFrontendInput(existingAttribute.frontend_input || "text");
            setIsRequired(existingAttribute.is_required || false);
            setScope((existingAttribute as any).scope || "store");
            if (existingAttribute.options && existingAttribute.options.length > 0) {
                setOptions(existingAttribute.options);
            }
        }
    }, [isEditMode, existingAttribute]);

    const addOption = () => setOptions([...options, { label: "", value: "" }]);

    const removeOption = (index: number) => setOptions(options.filter((_, i) => i !== index));

    const updateOption = (index: number, field: "label" | "value", val: string) => {
        const updated = [...options];
        updated[index][field] = val;
        if (field === "label") {
            updated[index].value = val.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
        }
        setOptions(updated);
    };

    const handleSubmit = async () => {
        if (!label.trim()) {
            setNotification({ type: "error", message: "Default Label is required!" });
            return;
        }
        if (!isEditMode && !attributeCode.trim()) {
            setNotification({ type: "error", message: "Attribute Code is required!" });
            return;
        }

        try {
            if (isEditMode) {
                // ✅ Update — seedha fields, backend khud wrap karega
                const payload: any = {
                    default_frontend_label: label,
                    frontend_input: frontendInput,
                    is_required: isRequired,
                    scope,
                };
                if (showOptions) payload.options = options.filter(o => o.label.trim() !== "");

                await updateAttribute({ attribute_code: paramCode!, attribute: payload }).unwrap();
                setNotification({ type: "success", message: "Attribute updated successfully!" });

            } else {
                // ✅ Create — backend mein $data['label'] expect karta hai
                const payload: any = {
                    attribute_code: attributeCode,
                    label: label,
                    frontend_input: frontendInput,
                    is_required: isRequired,
                    scope,
                };
                if (showOptions) payload.options = options.filter(o => o.label.trim() !== "");

                await createAttribute(payload).unwrap();
                setNotification({ type: "success", message: "Attribute created successfully!" });
            }

            setTimeout(() => navigate("/MagentoAttributesLits"), 1500);

        } catch (err) {
            setNotification({ type: "error", message: isEditMode ? "Error updating attribute!" : "Error creating attribute!" });
            console.error(err);
        }
    };

    const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-50 transition-all";
    const labelClass = "block text-sm font-medium text-gray-700 mb-2";

    if (isEditMode && isFetching) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-center py-20">
                <p className="text-gray-400 text-sm">Loading attribute...</p>
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
                            {isEditMode ? "Edit Attribute" : "New Product Attribute"}
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">
                            {isEditMode ? `Editing: ${paramCode}` : "Create a new Magento attribute"}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/MagentoAttributesLits")}
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
                        <button onClick={() => setNotification(null)} className="text-lg leading-none opacity-60 hover:opacity-100">✕</button>
                    </div>
                )}

                {/* ATTRIBUTE PROPERTIES */}
                <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 pb-2 border-b border-gray-100">
                        Attribute Properties
                    </h3>
                    <div className="space-y-5">

                        <div>
                            <label className={labelClass}>Default Label <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                className={inputClass}
                                placeholder="e.g. Clothing Material"
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Catalog Input Type for Store Owner</label>
                            <select
                                value={frontendInput}
                                onChange={(e) => setFrontendInput(e.target.value)}
                                className={`${inputClass} ${isEditMode ? "bg-gray-50 text-gray-400 cursor-not-allowed" : ""}`}
                                disabled={isEditMode}
                            >
                                {INPUT_TYPES.map((type) => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </select>
                            {isEditMode && <p className="text-xs text-gray-400 mt-1">Input type cannot be changed after creation.</p>}
                        </div>

                        <div>
                            <label className={labelClass}>Values Required</label>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsRequired(false)}
                                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all border ${!isRequired ? "bg-gradient-to-r from-teal-400 to-green-400 text-white border-transparent" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"}`}
                                >No</button>
                                <button
                                    onClick={() => setIsRequired(true)}
                                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all border ${isRequired ? "bg-gradient-to-r from-teal-400 to-green-400 text-white border-transparent" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"}`}
                                >Yes</button>
                            </div>
                        </div>

                    </div>
                </div>

                {/* ADVANCED */}
                <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 pb-2 border-b border-gray-100">
                        Advanced Attribute Properties
                    </h3>
                    <div className="space-y-5">

                        <div>
                            <label className={labelClass}>Attribute Code</label>
                            <input
                                type="text"
                                value={isEditMode ? paramCode : attributeCode}
                                onChange={(e) => !isEditMode && setAttributeCode(e.target.value.slice(0, 60))}
                                className={`${inputClass} ${isEditMode ? "bg-gray-50 text-gray-400 cursor-not-allowed" : ""}`}
                                placeholder="e.g. clothing_material"
                                readOnly={isEditMode}
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                {isEditMode ? "Attribute code cannot be changed." : "Used internally. No spaces, max 60 characters."}
                            </p>
                        </div>

                        <div>
                            <label className={labelClass}>Scope</label>
                            <select value={scope} onChange={(e) => setScope(e.target.value)} className={inputClass}>
                                {SCOPE_OPTIONS.map((s) => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-400 mt-1">Declare attribute value saving scope.</p>
                        </div>

                    </div>
                </div>

                {/* OPTIONS */}
                {showOptions && (
                    <div className="mb-8">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 pb-2 border-b border-gray-100">
                            Manage Options
                        </h3>
                        <div className="space-y-3">
                            {options.map((option, index) => (
                                <div key={index} className="flex gap-3 items-center">
                                    <input
                                        type="text"
                                        value={option.label}
                                        onChange={(e) => updateOption(index, "label", e.target.value)}
                                        className={`${inputClass} flex-1`}
                                        placeholder="Label (e.g. Cotton)"
                                    />
                                    <input
                                        type="text"
                                        value={option.value}
                                        onChange={(e) => updateOption(index, "value", e.target.value)}
                                        className={`${inputClass} flex-1`}
                                        placeholder="Value (e.g. cotton)"
                                    />
                                    <button
                                        onClick={() => removeOption(index)}
                                        disabled={options.length === 1}
                                        className="p-3 text-red-400 hover:text-red-600 transition-colors disabled:opacity-30"
                                    >
                                        <FaTrash size={14} />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={addOption}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-teal-400 text-teal-500 text-sm hover:bg-teal-50 transition-colors"
                            >
                                <FaPlus size={12} />
                                Add Option
                            </button>
                        </div>
                    </div>
                )}

                {/* SUBMIT */}
                <button
                    onClick={handleSubmit}
                    disabled={isCreating || isUpdating}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-400 to-green-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isCreating || isUpdating
                        ? (isEditMode ? "Updating..." : "Creating...")
                        : (isEditMode ? "Update Attribute" : "Save Attribute")}
                </button>

            </div>
        </div>
    );
}

export default AddMagentoAttribute;