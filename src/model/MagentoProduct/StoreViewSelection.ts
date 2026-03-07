export interface Website {
    id: number;
    code: string;
    name: string;
    default_group_id: number;
}

export interface Store {
    id: number;
    code: string;
    name: string;
    website_id: number;
    store_group_id: number;
    is_active: number;
}


export interface StoreView {
    id: number;
    code: string;
    name: string;
    website_id: number;
    store_group_id: number;
    is_active: number;
}


export type StoreViewSelection =
    | { type: "all" }
    | { type: "website"; website: Website }
    | { type: "store"; store: Store }
    | { type: "storeView"; storeView: StoreView };

