export interface Subscription {
  id: number;
  subscription_name: string;
  billing_type: string;
  price: number;
  feature: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}
