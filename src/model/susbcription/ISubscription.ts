// ISubscription.ts
export interface Subscription {
    id: number;
    subscription_name: string;
    billing_type: 'monthly' | 'yearly' | 'one-time';
    price: number;
    feature: string[] | Record<string, any>;
    status: number; // 1 = active, 0 = inactive
    created_at: string;
    updated_at: string;
    description?: string;
    setup_fee?: number;
    transaction_fee_percentage?: number;
    transaction_fee_fixed?: number;
    commission_rate?: number;
    max_products?: number;
    max_stores?: number;
    max_users?: number;
    bandwidth_limit_mb?: number;
    storage_limit_mb?: number;
    trial_period_days?: number;
    is_default?: boolean;
    sort_order?: number;
}