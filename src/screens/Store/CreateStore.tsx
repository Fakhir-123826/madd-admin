import AddButton from '../../component/AddButton'
import StepProgress from '../../component/Store/StepProgress';

const CreateStore = () => {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Stores Management</h2>
        <AddButton />
      </div>


      <div className="bg-white p-6 px-12 rounded-xl shadow-sm space-y-6">
        <StepProgress
          currentStep={0}
          steps={[
            { label: "Store Info" },
            { label: "Timings" },
            { label: "Pick up" },
          ]}
        />
        <div className='font-bold'>
          Store Info
        </div>
        {/* STORE BASIC INFO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>

            <label className="text-sm font-medium">Store Name</label>
            <input
              type="text"
              placeholder="Blossom Flowers"
              className="mt-1 w-full rounded-md
                            border border-gray-300
                            px-3 py-3 text-md
                            outline-none
                            focus:border-blue-400
                            focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Store ID</label>
            <input
              type="text"
              placeholder="23435465"
              className="mt-1 w-full rounded-md
                            border border-gray-300
                            px-3 py-3 text-md
                            outline-none
                            focus:border-blue-400
                            focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea
            placeholder="Description"
            rows={4}
            className="mt-1 w-full rounded-md
                            border border-gray-300
                            px-3 py-3 text-md
                            outline-none
                            focus:border-blue-400
                            focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* ADDRESS */}
        <div>
          <label className="text-sm font-medium">Address</label>
          <input
            type="text"
            placeholder="New, Street #3 Main road"
            className="mt-1 w-full rounded-md
                            border border-gray-300
                            px-3 py-3 text-md
                            outline-none
                            focus:border-blue-400
                            focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* COUNTRY / CITY / POSTAL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-sm font-medium">Country</label>
            <input
              type="text"
              placeholder="USA"
              className="mt-1 w-full rounded-md
                            border border-gray-300
                            px-3 py-3 text-md
                            outline-none
                            focus:border-blue-400
                            focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="text-sm font-medium">City</label>
            <input
              type="text"
              placeholder="New York"
              className="mt-1 w-full rounded-md
                            border border-gray-300
                            px-3 py-3 text-md
                            outline-none
                            focus:border-blue-400
                            focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Postal Code</label>
            <input
              type="text"
              placeholder="246774"
              className="mt-1 w-full rounded-md
                            border border-gray-300
                            px-3 py-3 text-md
                            outline-none
                            focus:border-blue-400
                            focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* CONTACT INFO */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Contact Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                placeholder="info@gmail.com"
                className="mt-1 w-full rounded-md
                            border border-gray-300
                            px-3 py-3 text-md
                            outline-none
                            focus:border-blue-400
                            focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Phone Number</label>
              <input
                type="text"
                placeholder="+91 63942 4838"
                className="mt-1 w-full rounded-md
                            border border-gray-300
                            px-3 py-3 text-md
                            outline-none
                            focus:border-blue-400
                            focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>

        {/* STORE STATUS */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Store Status</h3>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="status" className="accent-teal-500" />
              Active
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="status" className="accent-gray-400" />
              Inactive
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="status" className="accent-gray-400" />
              On Hold
            </label>
          </div>
        </div>

        {/* STORE LOGO */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Store Logo</h3>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-md bg-gray-100 flex items-center justify-center text-xs text-gray-400">
              Logo
            </div>
            <button className="text-sm text-teal-500 hover:underline">
              Change Logo
            </button>
          </div>
        </div>
      </div>



      <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
        <StepProgress
          currentStep={1}
          steps={[
            { label: "Store Info" },
            { label: "Timings" },
            { label: "Pick up" },
          ]}
        />
        {/* STORE AVAILABILITY */}
        <div>
          <h3 className="text-sm font-semibold mb-4">Store Availability</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-700">Opening Time</label>
              <input
                type="text"
                placeholder="9:00 am"
                className="mt-1 w-full rounded-md
                            border border-gray-300
                            px-3 py-3 text-md
                            outline-none
                            focus:border-blue-400
                            focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">Closing Time</label>
              <input
                type="text"
                placeholder="11:00 pm"
                className="mt-1 w-full rounded-md
                            border border-gray-300
                            px-3 py-3 text-md
                            outline-none
                            focus:border-blue-400
                            focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>

        {/* BREAK TIME */}
        <div>
          <h3 className="text-sm font-semibold mb-4">Break Time</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-700">From</label>
              <input
                type="text"
                placeholder="6:00 pm"
                className="mt-1 w-full rounded-md
                            border border-gray-300
                            px-3 py-3 text-md
                            outline-none
                            focus:border-blue-400
                            focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">To</label>
              <input
                type="text"
                placeholder="7:00 pm"
                className="mt-1 w-full rounded-md
                            border border-gray-300
                            px-3 py-3 text-md
                            outline-none
                            focus:border-blue-400
                            focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>
      </div>



      <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
        <StepProgress
          currentStep={2}
          steps={[
            { label: "Store Info" },
            { label: "Timings" },
            { label: "Pick up" },
          ]}
        />
        {/* PICK UP */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Pick up</h3>

          {/* TOGGLE */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-5 bg-blue-500 rounded-full relative">
              <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
            </div>
            <span className="text-sm text-gray-700">Pickup Availability</span>
          </div>

          {/* PICKUP POINT NAME */}
          <div className="mb-4">
            <label className="text-sm text-gray-700">Pick up point name</label>
            <input
              type="text"
              placeholder="6 am"
              className="mt-1 w-full rounded-md
                            border border-gray-300
                            px-3 py-3 text-md
                            outline-none
                            focus:border-blue-400
                            focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* ADDRESS */}
          <div>
            <label className="text-sm text-gray-700">Address</label>
            <input
              type="text"
              placeholder="6 am"
              className="mt-1 w-full rounded-md
                            border border-gray-300
                            px-3 py-3 text-md
                            outline-none
                            focus:border-blue-400
                            focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* AVAILABILITY DAYS */}
        <div>
          <h3 className="text-sm font-semibold mb-4">Availability Days</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-3">
            <div>
              <label className="text-sm text-gray-700">From</label>
              <input
                type="text"
                placeholder="Monday"
                className="mt-1 w-full rounded-md
                            border border-gray-300
                            px-3 py-3 text-md
                            outline-none
                            focus:border-blue-400
                            focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">To</label>
              <input
                type="text"
                placeholder="Friday"
                className="mt-1 w-full rounded-md
                            border border-gray-300
                            px-3 py-3 text-md
                            outline-none
                            focus:border-blue-400
                            focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* WHOLE WEEK */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-5 bg-blue-500 rounded-full relative">
              <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
            </div>
            <span className="text-sm text-gray-700">Whole Week</span>
          </div>
        </div>

        {/* AVAILABILITY TIME */}
        <div>
          <h3 className="text-sm font-semibold mb-4">Availability Time</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-700">From</label>
              <input
                type="text"
                placeholder="6 am"
                className="mt-1 w-full rounded-md
                            border border-gray-300
                            px-3 py-3 text-md
                            outline-none
                            focus:border-blue-400
                            focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">To</label>
              <input
                type="text"
                placeholder="7 pm"
                className="mt-1 w-full rounded-md
                            border border-gray-300
                            px-3 py-3 text-md
                            outline-none
                            focus:border-blue-400
                            focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>

        {/* ADDITIONAL INFO */}
        <div>
          <label className="text-sm text-gray-700">
            Additional Information (Optional)
          </label>
          <textarea
            placeholder="Information"
            className="mt-1 w-full rounded-md
                            border border-gray-300
                            px-3 py-3 text-md
                            outline-none
                            focus:border-blue-400
                            focus:ring-2 focus:ring-blue-400
                            min-h-[120px]"
          />
        </div>
      </div>


    </>
  );
};


export default CreateStore