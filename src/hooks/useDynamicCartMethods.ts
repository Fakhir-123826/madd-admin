import { useEffect, useState } from "react";
import { useGetPaymentMethodsQuery, useGetShippingMethodsQuery, type ShippingAddress } from "../app/api/CartSlices/CartApi";

interface UseDynamicCartMethodsProps {
    vendorUuid: string;
    storeUuid: string;
    customerId: number | string;
    shippingAddress?: ShippingAddress;
    enabled?: boolean;
}

export const useDynamicCartMethods = ({
    vendorUuid,
    storeUuid,
    customerId,
    shippingAddress,
    enabled = true,
}: UseDynamicCartMethodsProps) => {
    const [shouldFetchShipping, setShouldFetchShipping] = useState(false);
    
    // Fetch payment methods
    const {
        data: paymentMethods = [],
        isLoading: paymentLoading,
        error: paymentError,
        refetch: refetchPayment,
    } = useGetPaymentMethodsQuery(
        {
            vendor_uuid: vendorUuid,
            store_uuid: storeUuid,
            customer_id: Number(customerId),
        },
        { skip: !enabled || !vendorUuid || !storeUuid || !customerId }
    );
    
    // Fetch shipping methods (only when shipping address is provided)
    const {
        data: shippingMethods = [],
        isLoading: shippingLoading,
        error: shippingError,
        refetch: refetchShipping,
    } = useGetShippingMethodsQuery(
        {
            vendor_uuid: vendorUuid,
            store_uuid: storeUuid,
            customer_id: Number(customerId),
            shipping_address: shippingAddress || {
                country_id: "US",
                region: "California",
                city: "",
                postcode: "",
                street: "",
                firstname: "",
                lastname: "",
                telephone: "",
            },
        },
        { skip: !enabled || !vendorUuid || !storeUuid || !customerId || !shippingAddress || !shippingAddress.country_id }
    );
    
    // Refetch shipping methods when shipping address changes
    useEffect(() => {
        if (shippingAddress && shippingAddress.country_id && shippingAddress.postcode) {
            refetchShipping();
        }
    }, [shippingAddress, refetchShipping]);
    
    return {
        paymentMethods,
        paymentLoading,
        paymentError,
        shippingMethods,
        shippingLoading,
        shippingError,
        refetchPayment,
        refetchShipping,
    };
};