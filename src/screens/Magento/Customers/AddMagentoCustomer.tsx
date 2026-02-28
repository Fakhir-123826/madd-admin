import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Input from "../../../component/Inputs Feilds/Input";
import AddButton from "../../../component/AddButton";
import {
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useGetCustomersQuery,
} from "../../../app/api/CustomerSlice/CustomerSlice";

const AddMagentoCustomer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const isViewMode = location.pathname.includes("/customers/");
  const isEditMode = !!id && !isViewMode;

  const { data } = useGetCustomersQuery();

  const [createCustomer, { isLoading: isCreating }] =
    useCreateCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] =
    useUpdateCustomerMutation();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    gender: 1,
  });

  useEffect(() => {
    if (id && data?.items) {
      const customer = data.items.find(
        (c: any) => c.id === Number(id)
      );

      if (customer) {
        setFormData({
          firstname: customer.firstname,
          lastname: customer.lastname,
          email: customer.email,
          gender: customer.gender || 1,
        });
      }
    }
  }, [id, data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (isEditMode) {
        await updateCustomer({
          id: Number(id),
          customer: formData,
        }).unwrap();
      } else {
        await createCustomer({
          customer: formData,
        }).unwrap();
      }

      navigate("/MagentoCustomerList");
    } catch (error) {
      console.error("Error saving customer:", error);
    }
  };

  return (
    <div className="bg-white shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-6">
        {isViewMode
          ? "View Customer"
          : isEditMode
          ? "Edit Customer"
          : "Create Customer"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 px-10 rounded-xl space-y-6"
      >
        {/* Customer Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="First Name"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            disabled={isViewMode}
            placeholder="Enter first name"
          />

          <Input
            label="Last Name"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            disabled={isViewMode}
            placeholder="Enter last name"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isViewMode}
            placeholder="Enter email"
          />

          {/* Gender Select Styled Like Input */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={isViewMode}
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition"
            >
              <option value={1}>Male</option>
              <option value={2}>Female</option>
            </select>
          </div>
        </div>

        {/* Status Section */}
        {!isViewMode && (
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked />
              Active Customer
            </label>
          </div>
        )}

        {/* Submit */}
        {!isViewMode && (
          <div className="mt-6">
            <AddButton
              label={
                isCreating || isUpdating
                  ? "Processing..."
                  : isEditMode
                  ? "Update Customer"
                  : "Create Customer"
              }
              type="submit"
              onClick={() => {}}
            />
          </div>
        )}
      </form>
    </div>
  );
};

export default AddMagentoCustomer;