import React from 'react'
import { FaPlus } from 'react-icons/fa'

const AddButton = () => {
    return (
        <div> <button
            className="
                flex items-center gap-3
                px-6 py-1
                rounded-full
                bg-gradient-to-r from-teal-400 to-green-500
                text-white text-sm font-medium
                shadow-md
                hover:from-teal-500 hover:to-green-600
                transition-all
                hover:cursor-pointer
            "
        >
            {/* ICON CIRCLE */}
            <span className="relative -left-5 flex items-center justify-center w-10 h-10 rounded-full bg-white">
                <FaPlus className="text-teal-500 text-sm" />
            </span>

            Add New Store
        </button></div>
    )
}

export default AddButton