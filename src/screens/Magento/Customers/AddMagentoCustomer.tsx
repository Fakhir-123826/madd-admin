import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Input from "../../../component/Inputs Feilds/Input";
import {
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useGetCustomerByIdQuery,
} from "../../../app/api/MagentoSlices/CustomerSlice";

const AddMagentoCustomer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const isViewMode = location.pathname.startsWith("/customers/");
  const isEditMode = !!id && location.pathname.startsWith("/AddMagentoCustomer/");

  // ✅ Get customer by ID directly
  const { data: customerData } = useGetCustomerByIdQuery(Number(id), {
    skip: !id,
  });

  const [createCustomer, { isLoading: isCreating }] = useCreateCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    gender: "1",
    website_id: "1",
    group_id: "1",
  });

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Pre-fill form in edit/view mode
  useEffect(() => {
    if (customerData?.data) {  // ✅ .data add karo
      const c = customerData.data; // ✅ shortcut
      setFormData({
        firstname: c.firstname || "",
        lastname: c.lastname || "",
        email: c.email || "",
        gender: String(c.gender || "1"),
        website_id: String(c.website_id || "1"),
        group_id: String(c.group_id || "1"),
      });
    }
  }, [customerData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      let result: any;

      if (isEditMode) {
        result = await updateCustomer({
          id: Number(id),
          data: {
            firstname: formData.firstname,
            lastname: formData.lastname,
            email: formData.email,
            gender: Number(formData.gender),
            website_id: Number(formData.website_id),
            group_id: Number(formData.group_id),
          },
        });
      } else {
        result = await createCustomer({
          customer: {
            email: formData.email,
            firstname: formData.firstname,
            lastname: formData.lastname,
            website_id: Number(formData.website_id),
            group_id: Number(formData.group_id),
          },
          password: password,
        }); // ✅ unwrap() hata diya
      }

      console.log("Full result:", result); // ✅ dekho kya aata hai

      // ✅ error check karo
      if (result?.error) {
        const errData = result.error?.data;
        const validationErrors = errData?.details?.validation_errors;
        const message = validationErrors?.length
          ? validationErrors.join(", ")
          : errData?.details?.message ||
          errData?.message ||
          "Something went wrong.";
        setError(message);
        return; // ✅ redirect mat karo
      }

      // ✅ response ka success check karo
      const data = result?.data;
      if (data?.success === false) {
        const valErrors = data?.details?.validation_errors;
        setError(
          valErrors?.length
            ? valErrors.join(", ")
            : data?.details?.message || data?.message || "Something went wrong."
        );
        return; // ✅ redirect mat karo
      }

      // ✅ sirf tab redirect karo jab sab theek ho
      setSuccess(data?.message || "Saved successfully!");
      setTimeout(() => navigate("/MagentoCustomerList"), 1500);

    } catch (err: any) {
      console.log("Catch error:", err);
      setError("Something went wrong. Please try again.");
    }
  };


  const tdLabel = "block text-sm font-semibold mb-2 text-gray-700";
  const selectClass = "w-full border border-gray-300 rounded-md px-3 py-3 text-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition";

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">
          {isViewMode ? "View Customer" : isEditMode ? "Edit Customer" : "Create Customer"}
        </h2>
        <button
          onClick={() => navigate("/MagentoCustomerList")}
          className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
        >
          ← Back to List
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* SUCCESS */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
          <span>✓</span> {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Section 1 - Basic Info */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="Enter first name"
              disabled={isViewMode}
            />
            <Input
              label="Last Name"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="Enter last name"
              disabled={isViewMode}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              disabled={isViewMode}
            />

            {/* Gender */}
            <div className="mb-4">
              <label className={tdLabel}>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={isViewMode}
                className={selectClass}
              >
                <option value="1">Male</option>
                <option value="2">Female</option>
                <option value="3">Not Specified</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2 - Account Info */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Website ID */}
            <div className="mb-4">
              <label className={tdLabel}>Website</label>
              <select
                name="website_id"
                value={formData.website_id}
                onChange={handleChange}
                disabled={isViewMode}
                className={selectClass}
              >
                <option value="1">Main Website</option>
                <option value="2">Store 1</option>
                <option value="3">Store 2</option>
              </select>
            </div>

            {/* Group ID */}
            <div className="mb-4">
              <label className={tdLabel}>Customer Group</label>
              <select
                name="group_id"
                value={formData.group_id}
                onChange={handleChange}
                disabled={isViewMode}
                className={selectClass}
              >
                <option value="1">General</option>
                <option value="2">Wholesale</option>
                <option value="3">Retailer</option>
              </select>
            </div>
          </div>

          {/* Password - only on create */}
          {!isEditMode && !isViewMode && (
            <div className="mt-2">
              <Input
                label="Password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        {!isViewMode && (
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white text-sm shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #2dd4bf, #22c55e)" }}
            >
              {isCreating || isUpdating ? "Processing..." : isEditMode ? "Update Customer" : "Create Customer"}
            </button>
          </div>
        )}

      </form>
    </div>
  );
};

export default AddMagentoCustomer;