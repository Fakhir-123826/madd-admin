import { FaPlus } from "react-icons/fa";

interface AddButtonProps {
  label: string;
  type?: "button" | "submit";
  onClick?: () => void;
}

const AddButton = ({ label, onClick ,type = "button"}: AddButtonProps) => {
  return (
    <div>
      <button
        onClick={onClick}
        type={type}
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

        {label}
      </button>
    </div>
  );
};

export default AddButton;
