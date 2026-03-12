import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const defaultTemplates = [
  "New Order (Default)",
  "Order Confirmation",
  "Password Reset",
  "Contact Form",
  "Welcome Email",
  // aur jitne chahiye add kar lena
];

const AddMagentoEmailTemplate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [templateName, setTemplateName] = useState(isEdit ? "Nena3" : "");
  const [subject, setSubject] = useState(isEdit ? '{{trans "Your %store_name email and password has been changed" store_name=$storefront_name}}' : "");
  const [content, setContent] = useState(isEdit ? "<p>Hello {{var customer_name}},</p><p>Your email has been changed...</p>" : "");
  const [styles, setStyles] = useState(isEdit ? "body { font-family: Arial; }" : "");
  const [selectedDefault, setSelectedDefault] = useState("");

  const [touched, setTouched] = useState(false);
  const [success, setSuccess] = useState("");

  const nameErr = touched && !templateName.trim();
  const subjectErr = touched && !subject.trim();
  const contentErr = touched && !content.trim();

  const inputClass = (err?: boolean) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm text-gray-700 outline-none transition-all bg-gray-50 focus:bg-white
    ${err ? "border-red-400 focus:border-red-400" : "border-gray-300 focus:border-blue-500"}`;

  const textareaClass = (err?: boolean) =>
    `w-full px-4 py-3 rounded-xl border text-sm text-gray-700 outline-none transition-all bg-gray-50 focus:bg-white min-h-[200px] font-mono
    ${err ? "border-red-400 focus:border-red-400" : "border-gray-300 focus:border-blue-500"}`;

  const handleLoadDefault = () => {
    if (!selectedDefault) return;
    // yahan real mein default template load karna (mock ke liye simple text)
    setContent(`<h1>Welcome to ${selectedDefault}</h1><p>This is default content...</p>`);
    setSubject(`{{trans "${selectedDefault}"}}`);
  };

  const handleSave = () => {
    setTouched(true);
    if (!templateName.trim() || !subject.trim() || !content.trim()) return;

    setSuccess(`Template has been ${isEdit ? "updated" : "saved"} successfully!`);
    setTimeout(() => navigate("/MagentoEmailTemplatesList"), 1500);
  };

  return (
    <div className="space-y-6 pb-10">

      {/* TOP BAR */}
      <div className="bg-white rounded-xl shadow-sm px-6 py-4 flex items-center justify-between flex-wrap gap-3 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/MagentoEmailTemplatesList")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-50">
            <FaArrowLeft className="text-sm" /> Back
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            {isEdit ? "Edit Email Template" : "New Email Template"}
          </h2>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-50">
            Reset
          </button>
          <button className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-50">
            Convert to Plain Text
          </button>
          <button className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-50">
            Preview Template
          </button>
          <button onClick={handleSave}
            className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all"
            style={{ background: "linear-gradient(to right, #f97316, #ea580c)" }}>
            Save Template
          </button>
        </div>
      </div>

      {/* SUCCESS MSG */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-5 py-3 rounded-xl">
          ✓ {success}
        </div>
      )}

      {/* MAIN FORM CARD */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        {/* LOAD DEFAULT SECTION */}
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Load Default Template</h3>
          <div className="flex items-end gap-4 max-w-xl">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Template</label>
              <select
                value={selectedDefault}
                onChange={e => setSelectedDefault(e.target.value)}
                className={inputClass()}
              >
                <option value="">-- Select Default Template --</option>
                {defaultTemplates.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleLoadDefault}
              disabled={!selectedDefault}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Load Template
            </button>
          </div>
        </div>

        {/* TEMPLATE INFORMATION */}
        <div className="p-6 space-y-6">
          <h3 className="text-base font-semibold text-gray-800 pb-2 border-b border-gray-200">Template Information</h3>

          {/* Template Name */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
            <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
              Template Name <span className="text-red-500">*</span>
            </label>
            <div className="md:col-span-3">
              <input
                type="text"
                value={templateName}
                onChange={e => setTemplateName(e.target.value)}
                onBlur={() => setTouched(true)}
                className={inputClass(nameErr)}
              />
              {nameErr && <p className="mt-1.5 text-xs text-red-600">This is a required field.</p>}
            </div>
          </div>

          {/* Template Subject */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
            <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
              Template Subject <span className="text-red-500">*</span>
            </label>
            <div className="md:col-span-3">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  onBlur={() => setTouched(true)}
                  className={inputClass(subjectErr) + " flex-1"}
                />
                <button className="px-4 py-2.5 rounded-xl bg-gray-100 border border-gray-300 text-sm text-gray-700 hover:bg-gray-200 whitespace-nowrap">
                  Insert Variable...
                </button>
              </div>
              {subjectErr && <p className="mt-1.5 text-xs text-red-600">This is a required field.</p>}
            </div>
          </div>

          {/* Template Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
            <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
              Template Content <span className="text-red-500">*</span>
            </label>
            <div className="md:col-span-3">
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                onBlur={() => setTouched(true)}
                className={textareaClass(contentErr)}
                rows={10}
              />
              {contentErr && <p className="mt-1.5 text-xs text-red-600">This is a required field.</p>}
              <div className="mt-2 flex justify-end">
                <button className="px-4 py-2 rounded-xl bg-gray-100 border border-gray-300 text-sm text-gray-700 hover:bg-gray-200">
                  Insert Variable...
                </button>
              </div>
            </div>
          </div>

          {/* Template Styles */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
            <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
              Template Styles
            </label>
            <div className="md:col-span-3">
              <textarea
                value={styles}
                onChange={e => setStyles(e.target.value)}
                className={textareaClass()}
                rows={6}
                placeholder="body { background: #f8f8f8; } p { color: #333; }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMagentoEmailTemplate;