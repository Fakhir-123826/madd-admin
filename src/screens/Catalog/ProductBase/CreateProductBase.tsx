import { useParams } from "react-router-dom";

const CreateProductBase = () => {
  const { id } = useParams();
  return (
    <div>ProductBase</div>
  )
}

export default CreateProductBase