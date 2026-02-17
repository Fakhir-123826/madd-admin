import { useParams } from "react-router-dom";
import { useState } from "react";
import AutoCompleteMultiSelect from "./AutoCompleteMultiSelect";
import AddButton from "../AddButton";

const CreatelegalityControl = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"active" | "restricted">("restricted");

  const options = [
    { label: "Region", value: "region1" },
    { label: "Region 2", value: "region2" },
    { label: "Region 3", value: "region3" },
    { label: "Region 4", value: "region4" },
  ];

  return (
    <div className="bg-white shadow-sm p-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Legality Basic Info</h2>
        <AddButton
          label={isEdit ? "Update Legality" : "Create Legality"}
          type="button"
          onClick={() => console.log("submit")}
        />
      </div>

      {/* Select Restricted Regions */}
      <AutoCompleteMultiSelect
        label="Select Restricted Regions"
        options={options}
        selectedValues={selectedRegions}
        onChange={setSelectedRegions}
      />

      {/* Notes */}
      <div className="mb-4">
        <label className="text-sm text-gray-700 block mb-1">
          Add required certifications or notes
        </label>

        <div className="border border-gray-300 rounded-md p-3 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes"
            className="w-full outline-none resize-none"
            rows={4}
          />

          <div className="flex justify-end mt-2">
            <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">
              Upload 📎
            </button>
          </div>
        </div>
      </div>

      {/* Attachments */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2">Attachments</p>

        <div className="flex items-center gap-3 bg-gray-50 border rounded-md p-3">
          <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            PDF
          </div>

          <span className="text-sm text-gray-700 flex-1">
            Provisional Award Notice.pdf
          </span>

          <button className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
            Download ⬇
          </button>
        </div>
      </div>

      {/* Status Toggle */}
      <div className="mb-6">
        <p className="text-sm text-gray-700 mb-2">Mark Product as:</p>

        <div className="flex items-center gap-6">
          {/* Active */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={status === "active"}
              onChange={() => setStatus("active")}
            />
            <span className="text-sm text-gray-600">Active</span>
          </label>

          {/* Restricted */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={status === "restricted"}
              onChange={() => setStatus("restricted")}
            />
            <span className="text-sm text-gray-600">Restricted</span>
          </label>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-3">
        <button className="w-full bg-blue-500 text-white py-3 rounded-md font-medium hover:bg-blue-600 transition">
          Save Changes
        </button>

        <button className="w-full bg-gray-200 text-gray-700 py-3 rounded-md font-medium hover:bg-gray-300 transition">
          Discard Changes
        </button>
      </div>
    </div>
  );
};

export default CreatelegalityControl;
