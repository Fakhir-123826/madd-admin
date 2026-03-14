import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaChevronDown, FaChevronUp } from "react-icons/fa";

const AddMagentoSource = () => {
  const navigate = useNavigate();

  // General
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [isEnabled, setIsEnabled] = useState(true);
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [usePickup, setUsePickup] = useState(false);

  // Contact Info
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fax, setFax] = useState("");

  // Address Data
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [postcode, setPostcode] = useState("");

  const [touched, setTouched] = useState(false);
  const [success, setSuccess] = useState("");

  const [openSection, setOpenSection] = useState<number | null>(1); // 1 = General open by default

  const toggleSection = (section: number) => {
    setOpenSection(openSection === section ? null : section);
  };

  const nameErr = touched && !name.trim();
  const codeErr = touched && !code.trim();
  const postcodeErr = touched && !postcode.trim();

  const inputClass = (err?: boolean) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm text-gray-700 outline-none transition-all bg-gray-50 focus:bg-white
    ${err ? "border-red-400 focus:border-red-400" : "border-gray-300 focus:border-teal-500"}`;

  const selectClass = "w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-700 bg-gray-50 focus:border-teal-500 outline-none";

  const handleSave = () => {
    setTouched(true);
    if (!name.trim() || !code.trim() || !postcode.trim()) return;

    setSuccess("Source saved successfully!");
    setTimeout(() => navigate("/MagentoInventorySourcesList"), 1500);
  };

  return (
    <div className="space-y-6 pb-10">

      {/* TOP BAR */}
      <div className="bg-white rounded-xl shadow-sm px-6 py-4 flex items-center justify-between flex-wrap gap-3 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/MagentoInventorySourcesList")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-50">
            <FaArrowLeft className="text-sm" /> Back
          </button>
          <h2 className="text-lg font-semibold text-gray-800">New Source</h2>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-50">
            Reset
          </button>
          <button onClick={handleSave}
            className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2"
            style={{ background: "linear-gradient(to right, #f97316, #ea580c)" }}>
            Save & Continue <FaChevronDown className="text-xs" />
          </button>
        </div>
      </div>

      {/* SUCCESS */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-5 py-3 rounded-xl">
          ✓ {success}
        </div>
      )}

      {/* ACCORDION FORM */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        {/* General */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection(1)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
          >
            <h3 className="text-base font-semibold text-gray-800">General</h3>
            {openSection === 1 ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
          </button>
          {openSection === 1 && (
            <div className="px-6 pb-6 space-y-6">
              {/* Name */}
              <div className="grid md:grid-cols-4 gap-4 items-start">
                <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
                  Name <span className="text-red-500">*</span>
                </label>
                <div className="md:col-span-3">
                  <input value={name} onChange={e => setName(e.target.value)} onBlur={() => setTouched(true)}
                    className={inputClass(nameErr)} placeholder="Enter source name" />
                  {nameErr && <p className="mt-1 text-xs text-red-600">This is a required field.</p>}
                </div>
              </div>

              {/* Code */}
              <div className="grid md:grid-cols-4 gap-4 items-start">
                <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
                  Code <span className="text-red-500">*</span>
                </label>
                <div className="md:col-span-3">
                  <input value={code} onChange={e => setCode(e.target.value)} onBlur={() => setTouched(true)}
                    className={inputClass(codeErr)} placeholder="Enter unique code" />
                  {codeErr && <p className="mt-1 text-xs text-red-600">This is a required field.</p>}
                </div>
              </div>

              {/* Is Enabled */}
              <div className="grid md:grid-cols-4 gap-4 items-start">
                <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
                  Is Enabled
                </label>
                <div className="md:col-span-3 flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={isEnabled} onChange={() => setIsEnabled(!isEnabled)}
                      className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                  </label>
                  <span className="text-sm text-gray-700">Yes</span>
                  <p className="text-xs text-gray-500 ml-4">The Default Source must be enabled. A default source is required for single source merchants and product migration.</p>
                </div>
              </div>

              {/* Description */}
              <div className="grid md:grid-cols-4 gap-4 items-start">
                <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
                  Description
                </label>
                <div className="md:col-span-3">
                  <textarea value={description} onChange={e => setDescription(e.target.value)}
                    className={`${inputClass()} min-h-[80px] resize-y`} placeholder="Enter description" />
                </div>
              </div>

              {/* Latitude & Longitude */}
              <div className="grid md:grid-cols-4 gap-4 items-start">
                <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
                  Latitude
                </label>
                <div className="md:col-span-3">
                  <input type="number" value={latitude} onChange={e => setLatitude(e.target.value)}
                    className={inputClass()} placeholder="Enter latitude" />
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4 items-start">
                <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
                  Longitude
                </label>
                <div className="md:col-span-3">
                  <input type="number" value={longitude} onChange={e => setLongitude(e.target.value)}
                    className={inputClass()} placeholder="Enter longitude" />
                </div>
              </div>

              {/* Use Pickup Location */}
              <div className="grid md:grid-cols-4 gap-4 items-start">
                <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
                  Use as Pickup Location
                </label>
                <div className="md:col-span-3 flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={usePickup} onChange={() => setUsePickup(!usePickup)}
                      className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                  </label>
                  <span className="text-sm text-gray-700">Yes</span>
                  <p className="text-xs text-gray-500 ml-4">The Default Source cannot be used for In-Store Pickup Delivery.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection(2)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
          >
            <h3 className="text-base font-semibold text-gray-800">Contact Info</h3>
            {openSection === 2 ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
          </button>
          {openSection === 2 && (
            <div className="px-6 pb-6 space-y-6">
              <div className="grid md:grid-cols-4 gap-4 items-start">
                <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
                  Contact Name
                </label>
                <div className="md:col-span-3">
                  <input value={contactName} onChange={e => setContactName(e.target.value)}
                    className={inputClass()} placeholder="Enter contact name" />
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4 items-start">
                <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
                  Email
                </label>
                <div className="md:col-span-3">
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className={inputClass()} placeholder="Enter email" />
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4 items-start">
                <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
                  Phone
                </label>
                <div className="md:col-span-3">
                  <input value={phone} onChange={e => setPhone(e.target.value)}
                    className={inputClass()} placeholder="Enter phone number" />
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4 items-start">
                <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
                  Fax
                </label>
                <div className="md:col-span-3">
                  <input value={fax} onChange={e => setFax(e.target.value)}
                    className={inputClass()} placeholder="Enter fax number" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Address Data */}
        <div>
          <button
            onClick={() => toggleSection(3)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
          >
            <h3 className="text-base font-semibold text-gray-800">Address Data</h3>
            {openSection === 3 ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
          </button>
          {openSection === 3 && (
            <div className="px-6 pb-6 space-y-6">
              <div className="grid md:grid-cols-4 gap-4 items-start">
                <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
                  Country <span className="text-red-500">*</span>
                </label>
                <div className="md:col-span-3">
                  <select value={country} onChange={e => setCountry(e.target.value)} className={selectClass}>
                    <option>--Please Select--</option>
                    <option>Pakistan</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4 items-start">
                <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
                  State/Province
                </label>
                <div className="md:col-span-3">
                  <input value={state} onChange={e => setState(e.target.value)}
                    className={inputClass()} placeholder="Enter state/province" />
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4 items-start">
                <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
                  City
                </label>
                <div className="md:col-span-3">
                  <input value={city} onChange={e => setCity(e.target.value)}
                    className={inputClass()} placeholder="Enter city" />
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4 items-start">
                <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
                  Street
                </label>
                <div className="md:col-span-3">
                  <input value={street} onChange={e => setStreet(e.target.value)}
                    className={inputClass()} placeholder="Enter street address" />
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4 items-start">
                <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
                  Postcode <span className="text-red-500">*</span>
                </label>
                <div className="md:col-span-3">
                  <input value={postcode} onChange={e => setPostcode(e.target.value)} onBlur={() => setTouched(true)}
                    className={inputClass(postcodeErr)} placeholder="Enter postcode" />
                  {postcodeErr && <p className="mt-1 text-xs text-red-600">This is a required field.</p>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddMagentoSource;