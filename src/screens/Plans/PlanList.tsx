// src/screens/Plans/PlanList.tsx
import { useState, useEffect } from "react";
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaStar,
    FaRegStar,
    FaToggleOn,
    FaToggleOff,
    FaSync,
    FaDollarSign,
    FaChartLine,
    FaUsers,
    FaBoxes,
    FaStore,
    FaCheck,
    FaTimes,
    FaGripVertical,
} from "react-icons/fa";
import {
    useGetPlansQuery,
    useGetPlanStatsQuery,
    useDeletePlanMutation,
    useSetDefaultPlanMutation,
    useTogglePlanActiveMutation,
    useUpdateSortOrderMutation,
    type Plan,
} from "../../app/api/PlanSlices/PlanApi";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../router";
import PageHeader from "../../component/PageHeader/Pageheaderfilterbar";
import type {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(price);
};

const getBillingLabel = (type: string, price: number) => {
    switch (type) {
        case "monthly":
            return `${fmtPrice(price)} / month`;
        case "yearly":
            return `${fmtPrice(price)} / year`;
        case "one-time":
            return fmtPrice(price);
        default:
            return fmtPrice(price);
    }
};

// ─── Sortable Plan Card Component ─────────────────────────────────────────────

const SortablePlanCard = ({
    plan,
    onEdit,
    onDelete,
    onToggleStatus,
    onSetDefault,
    isDeleting,
    isToggling,
}: {
    plan: Plan;
    onEdit: () => void;
    onDelete: () => void;
    onToggleStatus: () => void;
    onSetDefault: () => void;
    isDeleting: boolean;
    isToggling: boolean;
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: plan.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const isActive = plan.status === 1;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`border rounded-xl p-5 shadow-sm hover:shadow-md transition-all hover:border-teal-200 ${
                plan.is_default ? "border-teal-300 bg-teal-50/30" : ""
            }`}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div
                        {...attributes}
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
                    >
                        <FaGripVertical className="text-lg" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 text-lg">
                            {plan.subscription_name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                                plan.billing_type === "monthly"
                                    ? "bg-blue-100 text-blue-600"
                                    : plan.billing_type === "yearly"
                                    ? "bg-purple-100 text-purple-600"
                                    : "bg-green-100 text-green-600"
                            }`}>
                                {plan.billing_type}
                            </span>
                            {plan.is_default && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 flex items-center gap-1">
                                    <FaStar className="text-xs" /> Default
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex gap-1">
                    <button
                        onClick={onEdit}
                        className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition"
                        title="Edit"
                    >
                        <FaEdit className="text-sm" />
                    </button>
                    <button
                        onClick={onDelete}
                        disabled={isDeleting || plan.is_default}
                        className={`p-2 rounded-lg transition ${
                            plan.is_default
                                ? "text-gray-300 cursor-not-allowed"
                                : "text-red-500 hover:bg-red-50"
                        }`}
                        title={plan.is_default ? "Cannot delete default plan" : "Delete"}
                    >
                        <FaTrash className="text-sm" />
                    </button>
                    <button
                        onClick={onToggleStatus}
                        disabled={isToggling}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
                        title={isActive ? "Deactivate" : "Activate"}
                    >
                        {isActive ? (
                            <FaToggleOn className="text-lg text-emerald-500" />
                        ) : (
                            <FaToggleOff className="text-lg text-gray-400" />
                        )}
                    </button>
                </div>
            </div>

            {/* Price */}
            <div className="mb-4">
                <p className="text-2xl font-bold text-teal-600">
                    {getBillingLabel(plan.billing_type, plan.price)}
                </p>
                {plan.billing_type === "yearly" && (
                    <p className="text-xs text-gray-400">
                        Save {(plan.price / 12 - plan.price / 12 * 0.2).toFixed(0)}% compared to monthly
                    </p>
                )}
            </div>

            {/* Description */}
            {plan.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {plan.description}
                </p>
            )}

            {/* Features */}
            <div className="space-y-2 mb-4">
                {plan.feature && plan.feature.slice(0, 4).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                        <FaCheck className="text-emerald-500 text-xs flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                    </div>
                ))}
                {plan.feature && plan.feature.length > 4 && (
                    <p className="text-xs text-gray-400">
                        +{plan.feature.length - 4} more features
                    </p>
                )}
            </div>

            {/* Limits */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 text-center">
                <div>
                    <FaBoxes className="text-teal-500 mx-auto text-sm" />
                    <p className="text-xs text-gray-500 mt-1">Products</p>
                    <p className="text-sm font-semibold">{plan.max_products || "∞"}</p>
                </div>
                <div>
                    <FaStore className="text-teal-500 mx-auto text-sm" />
                    <p className="text-xs text-gray-500 mt-1">Stores</p>
                    <p className="text-sm font-semibold">{plan.max_stores || "∞"}</p>
                </div>
                <div>
                    <FaUsers className="text-teal-500 mx-auto text-sm" />
                    <p className="text-xs text-gray-500 mt-1">Users</p>
                    <p className="text-sm font-semibold">{plan.max_users || "∞"}</p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                {!plan.is_default && plan.status === 1 && (
                    <button
                        onClick={onSetDefault}
                        className="flex-1 text-xs text-yellow-600 hover:text-yellow-700 flex items-center justify-center gap-1"
                    >
                        <FaStar className="text-xs" /> Set as Default
                    </button>
                )}
                <button
                    onClick={onEdit}
                    className="flex-1 text-xs text-teal-600 hover:text-teal-700 flex items-center justify-center gap-1"
                >
                    <FaEdit className="text-xs" /> Edit Plan
                </button>
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const PlanList = () => {
    const navigate = useNavigate();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    const { data, isLoading, refetch } = useGetPlansQuery();
    const { data: statsData, refetch: refetchStats } = useGetPlanStatsQuery();
    const [deletePlan, { isLoading: isDeleting }] = useDeletePlanMutation();
    const [setDefaultPlan, { isLoading: isSettingDefault }] = useSetDefaultPlanMutation();
    const [togglePlanActive, { isLoading: isToggling }] = useTogglePlanActiveMutation();
    const [updateSortOrder, { isLoading: isUpdatingSort }] = useUpdateSortOrderMutation();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        if (data) {
            setPlans(data);
        }
    }, [data]);

    const stats = statsData;
    const showToast = (type: "success" | "error", msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3000);
    };

    const handleDelete = async (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete "${name}" plan?`)) {
            try {
                await deletePlan(id).unwrap();
                showToast("success", `Plan "${name}" deleted successfully`);
                refetch();
                refetchStats();
            } catch (error: any) {
                showToast("error", error?.data?.message || "Failed to delete plan");
            }
        }
    };

    const handleSetDefault = async (id: number, name: string) => {
        try {
            await setDefaultPlan(id).unwrap();
            showToast("success", `"${name}" is now the default plan`);
            refetch();
            refetchStats();
        } catch (error: any) {
            showToast("error", error?.data?.message || "Failed to set default plan");
        }
    };

    const handleToggleStatus = async (id: number, name: string, currentStatus: number) => {
        try {
            await togglePlanActive(id).unwrap();
            const newStatus = currentStatus === 1 ? "deactivated" : "activated";
            showToast("success", `Plan "${name}" ${newStatus}`);
            refetch();
            refetchStats();
        } catch (error: any) {
            showToast("error", error?.data?.message || "Failed to toggle plan status");
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        
        if (active.id !== over?.id) {
            const oldIndex = plans.findIndex((p) => p.id === active.id);
            const newIndex = plans.findIndex((p) => p.id === over?.id);
            
            const newPlans = arrayMove(plans, oldIndex, newIndex);
            setPlans(newPlans);
            
            // Prepare sort order update
            const orders = newPlans.map((plan, index) => ({
                id: plan.id,
                sort_order: index + 1,
            }));
            
            try {
                await updateSortOrder({ orders }).unwrap();
                showToast("success", "Plan order updated successfully");
                refetch();
            } catch (error: any) {
                showToast("error", error?.data?.message || "Failed to update order");
                setPlans(data || []);
            }
        }
    };

    if (isLoading && !plans.length) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-teal-500" />
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen p-6">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
                    ${toast.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                    <span>{toast.type === "success" ? "✓" : "✕"}</span>
                    {toast.msg}
                </div>
            )}

            {/* Stats Summary */}
            {stats && (
                <div className="mb-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-xl px-4 py-3">
                        <span className="text-xs text-gray-500">Total Plans</span>
                        <p className="text-xl font-bold text-teal-600">{stats.total_plans || 0}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl px-4 py-3">
                        <span className="text-xs text-gray-500">Active Plans</span>
                        <p className="text-xl font-bold text-emerald-600">{stats.active_plans || 0}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl px-4 py-3">
                        <span className="text-xs text-gray-500">Inactive Plans</span>
                        <p className="text-xl font-bold text-gray-600">{stats.inactive_plans || 0}</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl px-4 py-3">
                        <span className="text-xs text-gray-500">Vendor Subscriptions</span>
                        <p className="text-xl font-bold text-purple-600">{stats.vendor_subscriptions || 0}</p>
                    </div>
                    {stats.most_popular_plan && (
                        <div className="bg-yellow-50 rounded-xl px-4 py-3">
                            <span className="text-xs text-gray-500">Most Popular</span>
                            <p className="text-sm font-bold text-yellow-700 truncate">{stats.most_popular_plan.subscription_name}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">Subscription Plans</h2>
                    <p className="text-sm text-gray-500">Manage vendor subscription plans and pricing</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => refetch()}
                        className="h-10 w-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-teal-500 transition"
                    >
                        <FaSync className={`text-sm ${isUpdatingSort ? "animate-spin" : ""}`} />
                    </button>
                    <button
                        onClick={() => navigate(ROUTES.CREATE_PLAN)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-green-400 text-white text-sm font-medium hover:opacity-90 transition"
                    >
                        <FaPlus className="text-xs" /> Add New Plan
                    </button>
                </div>
            </div>

            {/* Plans Grid */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={plans.map(p => p.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {plans.map((plan) => (
                            <SortablePlanCard
                                key={plan.id}
                                plan={plan}
                                onEdit={() => navigate(`/plans/${plan.id}/edit`)}
                                onDelete={() => handleDelete(plan.id, plan.subscription_name)}
                                onToggleStatus={() => handleToggleStatus(plan.id, plan.subscription_name, plan.status)}
                                onSetDefault={() => handleSetDefault(plan.id, plan.subscription_name)}
                                isDeleting={isDeleting}
                                isToggling={isToggling}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {/* Empty State */}
            {plans.length === 0 && !isLoading && (
                <div className="text-center py-16 text-gray-300">
                    <FaChartLine className="text-4xl mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No subscription plans found.</p>
                    <button
                        onClick={() => navigate(ROUTES.CREATE_PLAN)}
                        className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-green-400 text-white text-sm font-medium"
                    >
                        Create your first plan
                    </button>
                </div>
            )}
        </div>
    );
};

export default PlanList;