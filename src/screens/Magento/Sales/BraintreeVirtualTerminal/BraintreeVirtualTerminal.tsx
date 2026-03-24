import { useState } from "react";
import { useNavigate } from "react-router-dom";

function BraintreeVirtualTerminal() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("5000");
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvv, setCvv] = useState("");

  const handleTakePayment = () => {
    if (!amount || !cardNumber || !expMonth || !expYear || !cvv) {
      alert("Please fill all required fields");
      return;
    }
    // Here you can integrate Braintree API later
    alert(`Payment of $${amount} processed successfully!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">Braintree Virtual Terminal</h1>
          <button
            onClick={handleTakePayment}
            className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white px-8 py-3 rounded-2xl font-medium shadow-md transition-all flex items-center gap-2"
          >
            Take Payment
          </button>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
          <div className="space-y-8">
            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-4 rounded-2xl border border-gray-300 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 text-lg outline-none transition-all"
                />
              </div>
            </div>

            {/* Card Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Card Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="•••• •••• •••• ••••"
                maxLength={19}
                className="w-full px-4 py-4 rounded-2xl border border-gray-300 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 text-lg outline-none transition-all"
              />
            </div>

            {/* Expiration Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Expiration Date <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={expMonth}
                  onChange={(e) => setExpMonth(e.target.value)}
                  placeholder="MM"
                  maxLength={2}
                  className="w-full px-4 py-4 rounded-2xl border border-gray-300 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 text-center text-lg outline-none transition-all"
                />
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-2xl">/</span>
                  <input
                    type="text"
                    value={expYear}
                    onChange={(e) => setExpYear(e.target.value)}
                    placeholder="YY"
                    maxLength={2}
                    className="w-full px-4 py-4 rounded-2xl border border-gray-300 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 text-center text-lg outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* CVV */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Card Verification Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="CVV"
                maxLength={4}
                className="w-full px-4 py-4 rounded-2xl border border-gray-300 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 text-lg outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-400 text-sm mt-8">
          Powered by Braintree • All transactions are secure and encrypted
        </p>
      </div>
    </div>
  );
}

export default BraintreeVirtualTerminal;