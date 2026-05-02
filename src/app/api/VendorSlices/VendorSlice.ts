import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    vendors: [],
    selectedVendor: null,
    vendorStats: null,
    pendingApplications: [],
};

const vendorSlice = createSlice({
    name: "vendor",
    initialState,

    reducers: {
        /*
        =========================================
        SET ALL VENDORS
        =========================================
        */
        setVendors: (state, action) => {
            state.vendors = action.payload;
        },

        /*
        =========================================
        SET SINGLE VENDOR
        =========================================
        */
        setSelectedVendor: (state, action) => {
            state.selectedVendor = action.payload;
        },

        /*
        =========================================
        SET VENDOR STATISTICS
        =========================================
        */
        setVendorStats: (state, action) => {
            state.vendorStats = action.payload;
        },

        /*
        =========================================
        SET PENDING APPLICATIONS
        =========================================
        */
        setPendingApplications: (state, action) => {
            state.pendingApplications = action.payload;
        },

        /*
        =========================================
        CLEAR ALL
        =========================================
        */
        clearVendors: (state) => {
            state.vendors = [];
            state.selectedVendor = null;
            state.vendorStats = null;
            state.pendingApplications = [];
        },
    },
});

export const {
    setVendors,
    setSelectedVendor,
    setVendorStats,
    setPendingApplications,
    clearVendors,
} = vendorSlice.actions;

export default vendorSlice.reducer;