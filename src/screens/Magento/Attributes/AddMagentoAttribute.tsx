import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useCreateAttributeMutation, type AttributeOption } from "../../../app/api/MagentoSlices/Attributes";

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
    const [createAttribute, { isLoading }] = useCreateAttributeMutation();

    // Form state
    const [label, setLabel] = useState("");
    const [attributeCode, setAttributeCode] = useState("");
    const [frontendInput, setFrontendInput] = useState("text");
    const [isRequired, setIsRequired] = useState(false);
    const [scope, setScope] = useState("store");
    const [options, setOptions] = useState<AttributeOption[]>([{ label: "", value: "" }]);

    const showOptions = frontendInput === "select" || frontendInput === "multiselect";

    // Auto generate attribute code from label
    const handleLabelChange = (val: string) => {
        setLabel(val);
    };

    const addOption = () => {
        setOptions([...options, { label: "", value: "" }]);
    };

    const removeOption = (index: number) => {
        setOptions(options.filter((_, i) => i !== index));
    };

    const updateOption = (index: number, field: "label" | "value", val: string) => {
        const updated = [...options];
        updated[index][field] = val;
        // Auto fill value from label
        if (field === "label") {
            updated[index].value = val.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
        }
        setOptions(updated);
    };

    const handleSubmit = async () => {
        if (!label.trim()) return alert("Default Label is required!");
        if (!attributeCode.trim()) return alert("Attribute Code is required!");

        try {
            const payload: any = {
                attribute_code: attributeCode,
                label: label,
                frontend_input: frontendInput,
                is_required: isRequired,
                scope: scope,
            };

            if (showOptions) {
                payload.options = options.filter(o => o.label.trim() !== "");
            }

            await createAttribute(payload).unwrap();
            alert("Attribute created successfully!");
            navigate("/MagentoAttributesLits");
        } catch (err) {
            alert("Error creating attribute!");
            console.error(err);
        }
    };

    const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-50 transition-all";
    const labelClass = "block text-sm font-medium text-gray-700 mb-2";

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="bg-white rounded-xl shadow-sm p-8">

                {/* HEADER */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">New Product Attribute</h2>
                        <p className="text-sm text-gray-400 mt-1">Create a new Magento attribute</p>
                    </div>
                    <button
                        onClick={() => navigate("/MagentoAttributesLits")}
                        className="px-4 py-2 rounded-full border border-gray-200 text-gray-500 text-sm hover:bg-gray-50 transition-colors"
                    >
                        ← Back
                    </button>
                </div>

                {/* ATTRIBUTE PROPERTIES */}
                <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 pb-2 border-b border-gray-100">
                        Attribute Properties
                    </h3>
                    <div className="space-y-5">

                        {/* Default Label */}
                        <div>
                            <label className={labelClass}>
                                Default Label <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={label}
                                onChange={(e) => handleLabelChange(e.target.value)}
                                className={inputClass}
                                placeholder="e.g. Clothing Material"
                            />
                        </div>

                        {/* Catalog Input Type */}
                        <div>
                            <label className={labelClass}>Catalog Input Type for Store Owner</label>
                            <select
                                value={frontendInput}
                                onChange={(e) => setFrontendInput(e.target.value)}
                                className={inputClass}
                            >
                                {INPUT_TYPES.map((type) => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Values Required */}
                        <div>
                            <label className={labelClass}>Values Required</label>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsRequired(false)}
                                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all border ${!isRequired
                                            ? "bg-gradient-to-r from-teal-400 to-green-400 text-white border-transparent"
                                            : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                                        }`}
                                >
                                    No
                                </button>
                                <button
                                    onClick={() => setIsRequired(true)}
                                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all border ${isRequired
                                            ? "bg-gradient-to-r from-teal-400 to-green-400 text-white border-transparent"
                                            : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                                        }`}
                                >
                                    Yes
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                {/* ADVANCED ATTRIBUTE PROPERTIES */}
                <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 pb-2 border-b border-gray-100">
                        Advanced Attribute Properties
                    </h3>
                    <div className="space-y-5">

                        {/* Attribute Code */}
                        <div>
                            <label className={labelClass}>Attribute Code</label>
                            <input
                                type="text"
                                value={attributeCode}
                                onChange={(e) => setAttributeCode(e.target.value.slice(0, 60))}
                                className={inputClass}
                                placeholder="e.g. clothing_material"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                Used internally. No spaces, max 60 characters.
                            </p>
                        </div>

                        {/* Scope */}
                        <div>
                            <label className={labelClass}>Scope</label>
                            <select
                                value={scope}
                                onChange={(e) => setScope(e.target.value)}
                                className={inputClass}
                            >
                                {SCOPE_OPTIONS.map((s) => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-400 mt-1">
                                Declare attribute value saving scope.
                            </p>
                        </div>

                    </div>
                </div>

                {/* OPTIONS — sirf select/multiselect pe */}
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
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-400 to-green-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Creating..." : "Save Attribute"}
                </button>

            </div>
        </div>
    );
}

export default AddMagentoAttribute;