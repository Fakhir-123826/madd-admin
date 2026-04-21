import { useState } from "react";
import { useNavigate } from "react-router-dom";

function BraintreeVirtualTerminal() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("5000");
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validateCardNumber = (num: string) => {
    const cleaned = num.replace(/\s/g, '');
    return cleaned.length >= 15 && cleaned.length <= 16 && /^\d+$/.test(cleaned);
  };

  const validateExpiry = (month: string, year: string) => {
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    const m = parseInt(month);
    const y = parseInt(year);
    
    if (isNaN(m) || isNaN(y)) return false;
    if (m < 1 || m > 12) return false;
    if (y < currentYear) return false;
    if (y === currentYear && m < currentMonth) return false;
    return true;
  };

  const validateCVV = (cvv: string) => {
    return cvv.length >= 3 && cvv.length <= 4 && /^\d+$/.test(cvv);
  };

  const handleTakePayment = () => {
    // Validate required fields
    if (!amount) {
      setErrorMessage("Please enter an amount");
      setShowErrorModal(true);
      return;
    }

    if (!cardNumber) {
      setErrorMessage("Please enter card number");
      setShowErrorModal(true);
      return;
    }

    if (!validateCardNumber(cardNumber)) {
      setErrorMessage("Please enter a valid card number (15-16 digits)");
      setShowErrorModal(true);
      return;
    }

    if (!expMonth || !expYear) {
      setErrorMessage("Please enter expiration date");
      setShowErrorModal(true);
      return;
    }

    if (!validateExpiry(expMonth, expYear)) {
      setErrorMessage("Please enter a valid expiration date");
      setShowErrorModal(true);
      return;
    }

    if (!cvv) {
      setErrorMessage("Please enter CVV");
      setShowErrorModal(true);
      return;
    }

    if (!validateCVV(cvv)) {
      setErrorMessage("Please enter a valid CVV (3-4 digits)");
      setShowErrorModal(true);
      return;
    }

    // Format card number for display (masked)
    const maskedCard = "•••• •••• •••• " + cardNumber.slice(-4);
    
    // Show success modal
    setShowSuccessModal(true);
  };

  const handleCloseModals = () => {
    setShowSuccessModal(false);
    setShowErrorModal(false);
    setErrorMessage("");
    
    // Reset form after successful payment
    if (showSuccessModal) {
      setAmount("5000");
      setCardNumber("");
      setExpMonth("");
      setExpYear("");
      setCvv("");
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\s/g, '');
    if (raw.length <= 16) {
      setCardNumber(formatCardNumber(raw));
    }
  };

  const handleExpMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 2) {
      setExpMonth(value);
    }
  };

  const handleExpYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 2) {
      setExpYear(value);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setCvv(value);
    }
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
                  placeholder="0.00"
                  step="0.01"
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
                onChange={handleCardNumberChange}
                placeholder="•••• •••• •••• ••••"
                className="w-full px-4 py-4 rounded-2xl border border-gray-300 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 text-lg outline-none transition-all font-mono"
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
                  onChange={handleExpMonthChange}
                  placeholder="MM"
                  maxLength={2}
                  className="w-full px-4 py-4 rounded-2xl border border-gray-300 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 text-center text-lg outline-none transition-all"
                />
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-2xl">/</span>
                  <input
                    type="text"
                    value={expYear}
                    onChange={handleExpYearChange}
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
                type="password"
                value={cvv}
                onChange={handleCvvChange}
                placeholder="CVV"
                maxLength={4}
                className="w-full px-4 py-4 rounded-2xl border border-gray-300 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 text-lg outline-none transition-all font-mono"
              />
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-400 text-sm mt-8">
          Powered by Braintree • All transactions are secure and encrypted
        </p>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 transform animate-slideUp">
            <div className="p-8 text-center">
              {/* Success Icon */}
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Payment Successful!</h3>
              
              <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                <p className="text-sm text-gray-500 mb-1">Amount Charged</p>
                <p className="text-3xl font-bold text-gray-800">${parseFloat(amount).toFixed(2)}</p>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-400">Card: {cardNumber || '•••• •••• •••• ••••'}</p>
                  <p className="text-xs text-gray-400 mt-1">Transaction ID: {Math.random().toString(36).substring(2, 15).toUpperCase()}</p>
                  <p className="text-xs text-gray-400 mt-1">Date: {new Date().toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleCloseModals}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all"
                >
                  New Payment
                </button>
                <button
                  onClick={() => {
                    handleCloseModals();
                    navigate("/transactions");
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all"
                >
                  View Transactions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 transform animate-slideUp">
            <div className="p-8 text-center">
              {/* Error Icon */}
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Payment Failed</h3>
              
              <p className="text-gray-600 mb-8">{errorMessage}</p>
              
              <button
                onClick={handleCloseModals}
                className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add custom CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default BraintreeVirtualTerminal;