import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaChevronDown, FaChevronUp, FaPlus, FaSearch, FaTimes } from "react-icons/fa";

const websites = ["Main Website", "my web site", "neo.exp"];
const customerGroups = ["NOT LOGGED IN", "General", "Wholesale", "Retailer", "MY group 2"];
const storeViews = [
    { website: "Main Website", store: "Main Website Store", views: ["Default Store View"] },
    { website: "my web site", store: null, views: [] },
    { website: "neo.exp", store: "raw mart", views: ["nina"] },
];

const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <div className="flex items-center gap-2">
        <button type="button" onClick={onChange}
            className={`relative w-11 h-6 rounded-full transition-all duration-300 ${value ? "bg-teal-400" : "bg-gray-300"}`}>
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${value ? "left-5" : "left-0.5"}`} />
        </button>
        <span className="text-xs text-gray-500">{value ? "Yes" : "No"}</span>
    </div>
);

const Accordion = ({ title, open, onToggle, children }: { title: string; open: boolean; onToggle: () => void; children: React.ReactNode }) => (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <button onClick={onToggle}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-all">
            <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
            {open ? <FaChevronUp className="text-gray-400 text-xs" /> : <FaChevronDown className="text-gray-400 text-xs" />}
        </button>
        {open && <div className="border-t border-gray-100">{children}</div>}
    </div>
);

const inputClass = (err?: boolean) =>
    `w-full px-3 py-2.5 rounded-xl border text-xs text-gray-700 outline-none transition-all bg-gray-50 focus:bg-white
    ${err ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-teal-400"}`;

const FieldRow = ({ label, required, children, hint }: { label: string; required?: boolean; children: React.ReactNode; hint?: string }) => (
    <div className="grid grid-cols-4 items-start gap-4">
        <div className="flex items-center justify-end gap-1 pt-2.5">
            <label className="text-xs font-semibold text-gray-600 text-right">{label}</label>
            {required && <span className="text-red-500 text-xs">*</span>}
        </div>
        <div className="col-span-3">
            {children}
            {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
        </div>
    </div>
);

const CheckList = ({ items, selected, onToggle, error }: { items: string[]; selected: string[]; onToggle: (v: string) => void; error?: boolean }) => (
    <div className={`border rounded-xl overflow-hidden bg-gray-50 ${error ? "border-red-300" : "border-gray-200"}`}>
        {items.map((item, i) => (
            <label key={item}
                className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-blue-50/40 transition-all
                    ${i !== items.length - 1 ? "border-b border-gray-100" : ""}`}>
                <input type="checkbox" checked={selected.includes(item)} onChange={() => onToggle(item)}
                    className="accent-teal-500 w-3.5 h-3.5 flex-shrink-0" />
                <span className="text-xs text-gray-700">{item}</span>
            </label>
        ))}
    </div>
);

const AddMagentoCartPriceRule = () => {
    const navigate = useNavigate();
    const [touched, setTouched] = useState(false);
    const [success, setSuccess] = useState("");

    // Accordions
    const [openRuleInfo, setOpenRuleInfo] = useState(true);
    const [openConditions, setOpenConditions] = useState(false);
    const [openActions, setOpenActions] = useState(false);
    const [openLabels, setOpenLabels] = useState(false);
    const [openCoupons, setOpenCoupons] = useState(false);

    // Rule Information
    const [ruleName, setRuleName] = useState("");
    const [description, setDescription] = useState("");
    const [active, setActive] = useState(true);
    const [selectedWebsites, setSelectedWebsites] = useState<string[]>([]);
    const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
    const [coupon, setCoupon] = useState("no_coupon");
    const [couponCode, setCouponCode] = useState("");
    const [usesPerCustomer, setUsesPerCustomer] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [priority, setPriority] = useState("");
    const [publicRss, setPublicRss] = useState(true);

    // Actions
    const [apply, setApply] = useState("percent");
    const [discountAmount, setDiscountAmount] = useState("0");
    const [maxQty, setMaxQty] = useState("0");
    const [discountQtyStep, setDiscountQtyStep] = useState("");
    const [applyToShipping, setApplyToShipping] = useState(false);
    const [discardSubsequent, setDiscardSubsequent] = useState(true);
    const [freeShipping, setFreeShipping] = useState("");

    // Labels
    const [defaultLabel, setDefaultLabel] = useState("");
    const [storeLabels, setStoreLabels] = useState<Record<string, string>>({});

    // Coupon Codes
    const [couponQty, setCouponQty] = useState("");
    const [codeLength, setCodeLength] = useState("12");
    const [codeFormat, setCodeFormat] = useState("alphanumeric");
    const [codePrefix, setCodePrefix] = useState("");
    const [codeSuffix, setCodeSuffix] = useState("");
    const [dashEvery, setDashEvery] = useState("0");

    const toggleList = (list: string[], setList: (v: string[]) => void, val: string) => {
        setList(list.includes(val) ? list.filter(v => v !== val) : [...list, val]);
    };

    const nameErr = touched && !ruleName.trim();
    const websiteErr = touched && selectedWebsites.length === 0;
    const groupErr = touched && selectedGroups.length === 0;
    const discountErr = touched && !discountAmount;

    const handleSave = () => {
        setTouched(true);
        if (!ruleName.trim() || selectedWebsites.length === 0 || selectedGroups.length === 0) {
            setOpenRuleInfo(true);
            return;
        }
        setSuccess("Cart price rule saved successfully!");
        setTimeout(() => navigate(-1), 1500);
    };

    return (
        <div className="space-y-4">

            {/* TOP BAR */}
            <div className="bg-white rounded-xl shadow-sm px-6 py-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-gray-500 text-xs hover:bg-gray-50 transition-all">
                        <FaArrowLeft className="text-xs" /> Back
                    </button>
                    <div>
                        <h2 className="text-base font-semibold text-gray-800">New Cart Price Rule</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Create a new cart price rule</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={() => { setRuleName(""); setDescription(""); setSelectedWebsites([]); setSelectedGroups([]); setTouched(false); setSuccess(""); }}
                        className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition-all">
                        Reset
                    </button>
                    <button onClick={handleSave}
                        className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition-all">
                        Save and Continue Edit
                    </button>
                    <button onClick={handleSave}
                        className="px-5 py-2.5 rounded-xl text-white text-xs font-semibold hover:opacity-90 transition-all"
                        style={{ background: "linear-gradient(to right, #2dd4bf, #22c55e)" }}>
                        Save
                    </button>
                </div>
            </div>

            {/* SUCCESS */}
            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
                    <span>✓</span> {success}
                </div>
            )}

            {/* ───── RULE INFORMATION ───── */}
            <Accordion title="Rule Information" open={openRuleInfo} onToggle={() => setOpenRuleInfo(!openRuleInfo)}>
                <div className="p-6 space-y-5 max-w-3xl">
                    <FieldRow label="Rule Name" required>
                        <input type="text" value={ruleName} onChange={e => setRuleName(e.target.value)}
                            onBlur={() => setTouched(true)} placeholder="Enter rule name" className={inputClass(nameErr)} />
                        {nameErr && <div className="mt-1.5 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200"><p className="text-xs text-amber-700">This is a required field.</p></div>}
                    </FieldRow>

                    <FieldRow label="Description">
                        <textarea value={description} onChange={e => setDescription(e.target.value)}
                            rows={3} placeholder="Enter description" className={`${inputClass()} resize-none`} />
                    </FieldRow>

                    <FieldRow label="Active" required>
                        <Toggle value={active} onChange={() => setActive(!active)} />
                    </FieldRow>

                    <FieldRow label="Websites" required>
                        <CheckList items={websites} selected={selectedWebsites}
                            onToggle={v => toggleList(selectedWebsites, setSelectedWebsites, v)} error={websiteErr} />
                        {websiteErr && <p className="text-xs text-red-500 mt-1">Please select at least one website.</p>}
                    </FieldRow>

                    <FieldRow label="Customer Groups" required>
                        <CheckList items={customerGroups} selected={selectedGroups}
                            onToggle={v => toggleList(selectedGroups, setSelectedGroups, v)} error={groupErr} />
                        {groupErr && <p className="text-xs text-red-500 mt-1">Please select at least one customer group.</p>}
                    </FieldRow>

                    <FieldRow label="Coupon" required>
                        <select value={coupon} onChange={e => setCoupon(e.target.value)} className={inputClass()}>
                            <option value="no_coupon">No Coupon</option>
                            <option value="specific">Specific Coupon</option>
                            <option value="auto">Auto Generated</option>
                        </select>
                    </FieldRow>

                    {coupon === "specific" && (
                        <FieldRow label="Coupon Code" required>
                            <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value)}
                                placeholder="Enter coupon code" className={inputClass()} />
                        </FieldRow>
                    )}

                    <FieldRow label="Uses per Customer" hint="Usage limit enforced for logged in customers only.">
                        <input type="number" value={usesPerCustomer} onChange={e => setUsesPerCustomer(e.target.value)}
                            className={inputClass()} />
                    </FieldRow>

                    <FieldRow label="From">
                        <input type="date" value={from} onChange={e => setFrom(e.target.value)} className={inputClass()} />
                    </FieldRow>

                    <FieldRow label="To">
                        <input type="date" value={to} onChange={e => setTo(e.target.value)} className={inputClass()} />
                    </FieldRow>

                    <FieldRow label="Priority">
                        <input type="number" value={priority} onChange={e => setPriority(e.target.value)}
                            placeholder="0" className={inputClass()} />
                    </FieldRow>

                    <FieldRow label="Public In RSS Feed">
                        <Toggle value={publicRss} onChange={() => setPublicRss(!publicRss)} />
                    </FieldRow>
                </div>
            </Accordion>

            {/* ───── CONDITIONS ───── */}
            <Accordion title="Conditions" open={openConditions} onToggle={() => setOpenConditions(!openConditions)}>
                <div className="p-6">
                    <p className="text-xs font-semibold text-gray-600 mb-4">
                        Apply the rule only if the following conditions are met (leave blank for all products).
                    </p>
                    <div className="border-t border-gray-100 pt-4">
                        <p className="text-xs text-gray-600">
                            If <span className="font-bold">ALL</span> of these conditions are <span className="font-bold">TRUE</span>:
                        </p>
                        <div className="mt-3 ml-4 flex items-center gap-2">
                            <button className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center hover:bg-teal-600 transition-all">
                                <FaPlus className="text-white text-[8px]" />
                            </button>
                            <span className="text-xs text-gray-400">Add condition</span>
                        </div>
                    </div>
                </div>
            </Accordion>

            {/* ───── ACTIONS ───── */}
            <Accordion title="Actions" open={openActions} onToggle={() => setOpenActions(!openActions)}>
                <div className="p-6 space-y-5 max-w-3xl">
                    <FieldRow label="Apply">
                        <select value={apply} onChange={e => setApply(e.target.value)} className={inputClass()}>
                            <option value="percent">Percent of product price discount</option>
                            <option value="fixed">Fixed amount discount</option>
                            <option value="fixed_cart">Fixed amount discount for whole cart</option>
                            <option value="buy_x_get_y">Buy X get Y free (discount amount is Y)</option>
                        </select>
                    </FieldRow>

                    <FieldRow label="Discount Amount" required>
                        <input type="number" value={discountAmount} onChange={e => setDiscountAmount(e.target.value)}
                            placeholder="0" className={inputClass(discountErr)} />
                        {discountErr && <div className="mt-1.5 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200"><p className="text-xs text-amber-700">This is a required field.</p></div>}
                    </FieldRow>

                    <FieldRow label="Maximum Qty Discount is Applied To">
                        <input type="number" value={maxQty} onChange={e => setMaxQty(e.target.value)}
                            placeholder="0" className={inputClass()} />
                    </FieldRow>

                    <FieldRow label="Discount Qty Step (Buy X)">
                        <input type="number" value={discountQtyStep} onChange={e => setDiscountQtyStep(e.target.value)}
                            className={inputClass()} />
                    </FieldRow>

                    <FieldRow label="Apply to Shipping Amount" hint="Discount amount is applied to subtotal only">
                        <Toggle value={applyToShipping} onChange={() => setApplyToShipping(!applyToShipping)} />
                    </FieldRow>

                    <FieldRow label="Discard subsequent rules">
                        <Toggle value={discardSubsequent} onChange={() => setDiscardSubsequent(!discardSubsequent)} />
                    </FieldRow>

                    {/* Cart item conditions */}
                    <div className="pt-2 border-t border-gray-100">
                        <p className="text-xs font-semibold text-gray-600 mb-4">
                            Apply the rule only to cart items matching the following conditions (leave blank for all items).
                        </p>
                        <p className="text-xs text-gray-600">
                            If <span className="font-bold">ALL</span> of these conditions are <span className="font-bold">TRUE</span>:
                        </p>
                        <div className="mt-3 ml-4 flex items-center gap-2">
                            <button className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center hover:bg-teal-600 transition-all">
                                <FaPlus className="text-white text-[8px]" />
                            </button>
                            <span className="text-xs text-gray-400">Add condition</span>
                        </div>
                    </div>

                    <FieldRow label="Free Shipping">
                        <select value={freeShipping} onChange={e => setFreeShipping(e.target.value)} className={inputClass()}>
                            <option value="">-- Please Select --</option>
                            <option value="no">No</option>
                            <option value="matching">For matching items only</option>
                            <option value="all">For shipment with matching items</option>
                        </select>
                    </FieldRow>
                </div>
            </Accordion>

            {/* ───── LABELS ───── */}
            <Accordion title="Labels" open={openLabels} onToggle={() => setOpenLabels(!openLabels)}>
                <div className="p-6 space-y-5 max-w-3xl">
                    <FieldRow label="Default Rule Label for All Store Views">
                        <input type="text" value={defaultLabel} onChange={e => setDefaultLabel(e.target.value)}
                            placeholder="Enter default label" className={inputClass()} />
                    </FieldRow>

                    <div className="pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-2 mb-4">
                            <p className="text-xs font-semibold text-gray-700">Store View Specific Labels</p>
                        </div>
                        <div className="space-y-4">
                            {storeViews.map(sw => (
                                <div key={sw.website}>
                                    <p className="text-xs font-semibold text-gray-600 mb-2">{sw.website}</p>
                                    {sw.store && <p className="text-xs text-gray-500 mb-2 ml-3">{sw.store}</p>}
                                    {sw.views.map(view => (
                                        <div key={view} className="grid grid-cols-4 items-center gap-4 ml-4">
                                            <label className="text-xs text-gray-500 text-right">{view}</label>
                                            <div className="col-span-3">
                                                <input type="text"
                                                    value={storeLabels[view] || ""}
                                                    onChange={e => setStoreLabels(prev => ({ ...prev, [view]: e.target.value }))}
                                                    className={inputClass()} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Accordion>

            {/* ───── MANAGE COUPON CODES ───── */}
            <Accordion title="Manage Coupon Codes" open={openCoupons} onToggle={() => setOpenCoupons(!openCoupons)}>
                <div className="p-6 space-y-5 max-w-3xl">
                    <FieldRow label="Coupon Qty" required>
                        <input type="number" value={couponQty} onChange={e => setCouponQty(e.target.value)}
                            className={inputClass(touched && !couponQty)} />
                    </FieldRow>

                    <FieldRow label="Code Length" required hint="Excluding prefix, suffix and separators.">
                        <input type="number" value={codeLength} onChange={e => setCodeLength(e.target.value)}
                            className={inputClass()} />
                    </FieldRow>

                    <FieldRow label="Code Format" required>
                        <select value={codeFormat} onChange={e => setCodeFormat(e.target.value)} className={inputClass()}>
                            <option value="alphanumeric">Alphanumeric</option>
                            <option value="alphabetical">Alphabetical</option>
                            <option value="numeric">Numeric</option>
                        </select>
                    </FieldRow>

                    <FieldRow label="Code Prefix">
                        <input type="text" value={codePrefix} onChange={e => setCodePrefix(e.target.value)}
                            className={inputClass()} />
                    </FieldRow>

                    <FieldRow label="Code Suffix">
                        <input type="text" value={codeSuffix} onChange={e => setCodeSuffix(e.target.value)}
                            className={inputClass()} />
                    </FieldRow>

                    <FieldRow label="Dash Every X Characters" hint="If empty no separation.">
                        <input type="number" value={dashEvery} onChange={e => setDashEvery(e.target.value)}
                            placeholder="0" className={inputClass()} />
                    </FieldRow>

                    <div className="grid grid-cols-4 gap-4">
                        <div />
                        <div className="col-span-3">
                            <button className="px-5 py-2.5 rounded-xl text-white text-xs font-semibold hover:opacity-90 transition-all"
                                style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
                                Generate
                            </button>
                        </div>
                    </div>

                    {/* Coupon codes table */}
                    <div className="border-t border-gray-100 pt-5">
                        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                                <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-semibold"
                                    style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
                                    <FaSearch className="text-xs" /> Search
                                </button>
                                <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-blue-500 text-xs font-medium hover:bg-gray-50">
                                    <FaTimes className="text-xs" /> Reset Filter
                                </button>
                                <span className="text-xs text-gray-400"><span className="font-semibold text-gray-700">0</span> records found</span>
                            </div>
                        </div>

                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
                                        <th className="px-4 py-3 text-left w-10">
                                            <input type="checkbox" className="w-3.5 h-3.5 accent-white" />
                                        </th>
                                        {["Coupon Code", "Created", "Used", "Times Used"].map(h => (
                                            <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide whitespace-nowrap">{h}</th>
                                        ))}
                                    </tr>
                                    {/* Inline filter row */}
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className="px-4 py-2" />
                                        <td className="px-3 py-2">
                                            <input type="text" placeholder="Coupon code"
                                                className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-xs outline-none focus:border-teal-400 bg-white" />
                                        </td>
                                        <td className="px-3 py-2">
                                            <div className="space-y-1">
                                                <input type="date" placeholder="From"
                                                    className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-xs outline-none focus:border-teal-400 bg-white" />
                                                <input type="date" placeholder="To"
                                                    className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-xs outline-none focus:border-teal-400 bg-white" />
                                            </div>
                                        </td>
                                        <td className="px-3 py-2">
                                            <select className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-xs outline-none focus:border-teal-400 bg-white">
                                                <option value="">Any</option>
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                            </select>
                                        </td>
                                        <td className="px-3 py-2">
                                            <div className="space-y-1">
                                                <input type="number" placeholder="From"
                                                    className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-xs outline-none focus:border-teal-400 bg-white" />
                                                <input type="number" placeholder="To"
                                                    className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-xs outline-none focus:border-teal-400 bg-white" />
                                            </div>
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan={5} className="text-center py-8 text-gray-400 text-xs">
                                            We couldn't find any records.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Accordion>

        </div>
    );
};

export default AddMagentoCartPriceRule;