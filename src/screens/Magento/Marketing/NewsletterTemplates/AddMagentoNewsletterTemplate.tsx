import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const AddMagentoNewsletterTemplate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [templateName, setTemplateName] = useState(isEdit ? "MIV new template is here" : "");
  const [subject, setSubject] = useState(isEdit ? "this is possible by grok" : "");
  const [senderName, setSenderName] = useState(isEdit ? "custom support" : "");
  const [senderEmail, setSenderEmail] = useState(isEdit ? "support@example.com" : "");
  const [content, setContent] = useState(isEdit ? "<p>Follow this link to unsubscribe: <a href=\"{{var unsubscribe_link}}\">Unsubscribe here</a></p><p>Powered by grok 😏</p>" : "");
  const [styles, setStyles] = useState(isEdit ? "p { color: #333; }" : "");

  const [touched, setTouched] = useState(false);
  const [success, setSuccess] = useState("");

  const nameErr = touched && !templateName.trim();
  const subjectErr = touched && !subject.trim();
  const senderNameErr = touched && !senderName.trim();
  const senderEmailErr = touched && !senderEmail.trim();

  const inputClass = (err?: boolean) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm text-gray-700 outline-none transition-all bg-gray-50 focus:bg-white
    ${err ? "border-red-400" : "border-gray-300 focus:border-blue-500"}`;

  const handleSave = () => {
    setTouched(true);
    if (!templateName.trim() || !subject.trim() || !senderName.trim() || !senderEmail.trim() || !content.trim()) return;

    setSuccess(`Newsletter template ${isEdit ? "updated" : "saved"} successfully!`);
    setTimeout(() => navigate("/MagentoNewsletterTemplatesList"), 1500);
  };

  return (
    <div className="space-y-6 pb-10">

      {/* TOP BAR same */}
      <div className="bg-white rounded-xl shadow-sm px-6 py-4 flex items-center justify-between flex-wrap gap-3 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/MagentoNewsletterTemplatesList")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-50">
            <FaArrowLeft className="text-sm" /> Back
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            {isEdit ? "Edit Newsletter Template" : "New Newsletter Template"}
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

      {/* SUCCESS */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-5 py-3 rounded-xl">
          ✓ {success}
        </div>
      )}

      {/* MAIN FORM */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6 space-y-8">

        <h3 className="text-base font-semibold text-gray-800 border-b border-gray-200 pb-2">Template Information</h3>

        {/* Template Name */}
        <div className="grid md:grid-cols-4 gap-4 items-start">
          <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
            Template Name <span className="text-red-500">*</span>
          </label>
          <div className="md:col-span-3">
            <input value={templateName} onChange={e => setTemplateName(e.target.value)} onBlur={() => setTouched(true)}
              className={inputClass(nameErr)} />
            {nameErr && <p className="mt-1 text-xs text-red-600">This is a required field.</p>}
          </div>
        </div>

        {/* Template Subject */}
        <div className="grid md:grid-cols-4 gap-4 items-start">
          <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
            Template Subject <span className="text-red-500">*</span>
          </label>
          <div className="md:col-span-3">
            <input value={subject} onChange={e => setSubject(e.target.value)} onBlur={() => setTouched(true)}
              className={inputClass(subjectErr)} />
            {subjectErr && <p className="mt-1 text-xs text-red-600">This is a required field.</p>}
          </div>
        </div>

        {/* Sender Name */}
        <div className="grid md:grid-cols-4 gap-4 items-start">
          <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
            Sender Name <span className="text-red-500">*</span>
          </label>
          <div className="md:col-span-3">
            <input value={senderName} onChange={e => setSenderName(e.target.value)} onBlur={() => setTouched(true)}
              className={inputClass(senderNameErr)} placeholder="e.g. Custom Support" />
            {senderNameErr && <p className="mt-1 text-xs text-red-600">This is a required field.</p>}
          </div>
        </div>

        {/* Sender Email */}
        <div className="grid md:grid-cols-4 gap-4 items-start">
          <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
            Sender Email <span className="text-red-500">*</span>
          </label>
          <div className="md:col-span-3">
            <input type="email" value={senderEmail} onChange={e => setSenderEmail(e.target.value)} onBlur={() => setTouched(true)}
              className={inputClass(senderEmailErr)} placeholder="support@example.com" />
            {senderEmailErr && <p className="mt-1 text-xs text-red-600">This is a required field.</p>}
          </div>
        </div>

        {/* Template Content - contentEditable div (zero dependency) */}
        <div className="grid md:grid-cols-4 gap-4 items-start">
          <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
            Template Content <span className="text-red-500">*</span>
          </label>
          <div className="md:col-span-3 space-y-2">
            {/* Toolbar mock - simple buttons for basic formatting */}
            <div className="flex flex-wrap gap-2 p-2 bg-gray-100 border border-b-0 border-gray-300 rounded-t-xl">
              <button 
                type="button" 
                onClick={() => document.execCommand("bold")}
                className="px-3 py-1 text-xs font-bold border rounded hover:bg-gray-200"
              >
                B
              </button>
              <button 
                type="button" 
                onClick={() => document.execCommand("italic")}
                className="px-3 py-1 text-xs italic border rounded hover:bg-gray-200"
              >
                I
              </button>
              <button 
                type="button" 
                onClick={() => document.execCommand("underline")}
                className="px-3 py-1 text-xs underline border rounded hover:bg-gray-200"
              >
                U
              </button>
              <button 
                type="button" 
                onClick={() => {
                  const url = prompt("Enter link URL:");
                  if (url) document.execCommand("createLink", false, url);
                }}
                className="px-3 py-1 text-xs border rounded hover:bg-gray-200"
              >
                Link
              </button>
              <button 
                type="button" 
                onClick={() => document.execCommand("insertUnorderedList")}
                className="px-3 py-1 text-xs border rounded hover:bg-gray-200"
              >
                • List
              </button>
              {/* Variable insert button */}
              <button 
                type="button" 
                onClick={() => {
                  const varName = prompt("Enter variable (e.g. unsubscribe_link):");
                  if (varName) {
                    document.execCommand("insertHTML", false, `{{var ${varName}}}`);
                  }
                }}
                className="px-3 py-1 text-xs border rounded hover:bg-gray-200 ml-auto"
              >
                Insert Var
              </button>
            </div>

            {/* Editable area */}
            <div
              contentEditable
              className="min-h-[300px] p-4 border border-gray-300 rounded-b-xl bg-white focus:outline-none focus:border-teal-400 text-sm prose max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
              onInput={(e) => setContent(e.currentTarget.innerHTML)}
              onBlur={() => setTouched(true)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Tip: Ctrl+B (bold), Ctrl+I (italic), Ctrl+U (underline), Ctrl+K (link)
            </p>
            {touched && !content.trim() && (
              <p className="mt-1 text-xs text-red-600">This is a required field.</p>
            )}
          </div>
        </div>

        {/* Template Styles */}
        <div className="grid md:grid-cols-4 gap-4 items-start">
          <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
            Template Styles
          </label>
          <div className="md:col-span-3">
            <textarea 
              value={styles} 
              onChange={e => setStyles(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm text-gray-700 outline-none bg-white min-h-[120px] font-mono resize-y" 
              rows={4} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMagentoNewsletterTemplate;