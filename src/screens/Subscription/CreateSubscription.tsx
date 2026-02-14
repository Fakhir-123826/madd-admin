import React, { useEffect, useState } from "react";
import Input from "../../component/Inputs Feilds/Input";
import AddButton from "../../component/AddButton";
import {
    useCreateSubscriptionMutation,
    useUpdateSubscriptionMutation,
    useGetSubscriptionQuery,
} from "../../app/api/SubscriptionSclices/SubscriptionSclices";
import { useNavigate, useParams } from "react-router-dom";

const CreateSubscription = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const isEdit = Boolean(id);

    const { data } = useGetSubscriptionQuery(Number(id), {
        skip: !isEdit,
    });

    const [createSubscription] = useCreateSubscriptionMutation();
    const [updateSubscription] = useUpdateSubscriptionMutation();

    const [formData, setFormData] = useState({
        subscription_name: "",
        billing_type: "",
        price: "",
        feature: "",
        status: true,
    });

    const [featuresList, setFeaturesList] = useState<string[]>([]);

    // 🔥 Fill form when editing
    useEffect(() => {
        if (data) {
            setFormData({
                subscription_name: data.subscription_name,
                billing_type: data.billing_type,
                price: String(data.price),
                feature: "",
                status: data.status,
            });

            if (data.feature) {
                setFeaturesList(JSON.parse(data.feature));
            }
        }
    }, [data]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        setFormData({
            ...formData,
            [name]:
                type === "checkbox"
                    ? (e.target as HTMLInputElement).checked
                    : value,
        });
    };

    const handleAddFeature = () => {
        if (!formData.feature.trim()) return;

        setFeaturesList([...featuresList, formData.feature.trim()]);
        setFormData({ ...formData, feature: "" });
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        const payload = {
            subscription_name: formData.subscription_name,
            billing_type: formData.billing_type,
            price: Number(formData.price),
            feature: JSON.stringify(featuresList),
            status: formData.status,
        };

        try {
            if (isEdit) {
                await updateSubscription({ id: Number(id), data: payload }).unwrap();
            } else {
                await createSubscription(payload).unwrap();
            }

            navigate("/SubscriptionList");
        } catch (error) {
            console.error("Error:", error);
        }
    }

    return (
        <div className="bg-white shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Subscription Basic Info</h2>
                <AddButton
                    label={isEdit ? "Update Subscription" : "Create Subscription"}
                    type="button"
                    onClick={()=> {
                        handleSubmit()
                        console.log("pop")
                    }}
                />
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 px-10 rounded-xl space-y-6">

                {/* Subscription Name + Billing Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Subscription Name"
                        name="subscription_name"
                        placeholder="Pro Plan"
                        value={formData.subscription_name}
                        onChange={handleChange}
                    />

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                            Billing Type
                        </label>
                        <select
                            name="billing_type"
                            value={formData.billing_type}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition"
                        >
                            <option value="">Select Billing Type</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>
                </div>

                {/* Price + Feature Input */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">

                    {/* Price (unchanged size) */}
                    <Input
                        label="Price"
                        name="price"
                        type="number"
                        placeholder="29"
                        value={formData.price}
                        onChange={handleChange}
                    />

                    {/* Feature + Button Together */}
                    <div className="flex items-end gap-3">

                        <div className="flex-1">
                            <Input
                                label="Feature"
                                name="feature"
                                placeholder="Enter feature"
                                value={formData.feature}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex-1">
                            <div className="relative -top-5">
                                <AddButton
                                    label="Add 12"
                                    type="button" 
                                    onClick={handleAddFeature}
                                />
                            </div>

                        </div>


                    </div>
                </div>

                {/* Features List - Tag Style */}
                {featuresList.length > 0 && (
                    <div>
                        <h4 className="font-semibold mb-3 text-gray-700">
                            Added Features
                        </h4>

                        <div className="flex flex-wrap gap-2">
                            {featuresList.map((feature, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium"
                                >
                                    {feature}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Modern Toggle Switch */}
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                    <span className="text-sm font-semibold text-gray-700">
                        Active Subscription
                    </span>

                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            name="status"
                            checked={formData.status}
                            onChange={handleChange}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-teal-400 rounded-full peer peer-checked:bg-teal-500 transition"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
                    </label>
                </div>

            </form>

        </div>
    );
};

export default CreateSubscription;
