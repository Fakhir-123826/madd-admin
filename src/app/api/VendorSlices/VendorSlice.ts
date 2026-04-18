import { createSlice } from "@reduxjs/toolkit";

const vendorSlice = createSlice({
    name: "vendor",
    initialState: {
        vendors: [],
        selectedVendor: null,
    },
    reducers: {
        setVendors: (state, action) => {
            state.vendors = action.payload;
        },
        setSelectedVendor: (state, action) => {
            state.selectedVendor = action.payload;
        },
        clearVendors: (state) => {
            state.vendors = [];
            state.selectedVendor = null;
        },
    },
});

export const { setVendors, setSelectedVendor, clearVendors } = vendorSlice.actions;
export default vendorSlice.reducer;