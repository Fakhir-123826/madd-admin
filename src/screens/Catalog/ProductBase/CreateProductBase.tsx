import { useParams } from "react-router-dom";
import AddButton from "../../../component/AddButton";

const CreateProductBase = () => {
  const { id } = useParams();
   const isEdit = Boolean(id);
  return (
    <div>
      <div className="bg-white shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Product Base Basic Info</h2>
          <AddButton
            label={isEdit ? "Update Product Base" : "Create Product Base"}
            type="button"
            onClick={() => {
              console.log("pop")
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default CreateProductBase