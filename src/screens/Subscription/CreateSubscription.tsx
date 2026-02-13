import React from 'react'
import Input from '../../component/Inputs Feilds/Input'

const CreateSubscription = () => {
    return (
        <div>
            <div className="font-bold">Basic Info</div>

            {/* STORE BASIC INFO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Vendor Name"
                    name="storeName"
                    placeholder="Blossom Flowers"
                    value=""
                    onChange={()=>{}}
                />

                <Input
                    label="Businuss Type"
                    name="storeId"
                    placeholder="23435465"
                    value=""
                    onChange={()=>{}}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Email"
                    name="storeName"
                    placeholder="Blossom Flowers"
                    value=""
                    onChange={()=>{}}
                />

                <Input
                    label="Phone Number"
                    name="storeId"
                    placeholder="23435465"
                    value=""
                    onChange={()=>{}}
                />
            </div>


            <div>
                <h3 className="text-xs font-medium mb-2">Store Logo</h3>

                <div className="h-28 w-28 rounded-lg overflow-hidden border-gray-300 flex items-center justify-center bg-gray-100">
                    <img
                        src="/store.png"
                        alt="Store Logo"
                        className="h-full w-full object-cover"
                    />
                </div>
            </div>
        </div>
   
  )
}

export default CreateSubscription