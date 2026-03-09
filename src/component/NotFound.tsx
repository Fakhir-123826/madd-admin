import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const NotFound = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(10);
  const [dots, setDots] = useState<{ x: number; y: number; size: number; delay: number }[]>([]);

  useEffect(() => {
    // Floating dots generate karo
    setDots(
      Array.from({ length: 18 }, (_, i) => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 2,
        delay: Math.random() * 4,
      }))
    );
  }, []);

  useEffect(() => {
    if (count <= 0) {
      navigate("/");
      return;
    }
    const timer = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100 relative overflow-hidden"
      style={{ fontFamily: "'Segoe UI', sans-serif" }}
    >
      {/* Floating background dots */}
      {dots.map((dot, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-20 animate-pulse"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: dot.size,
            height: dot.size,
            background: "linear-gradient(135deg, #38bdf8, #3b82f6)",
            animationDelay: `${dot.delay}s`,
            animationDuration: `${2 + dot.delay}s`,
          }}
        />
      ))}

      {/* Blurred bg circles */}
      <div
        className="absolute w-96 h-96 rounded-full opacity-10"
        style={{
          background: "linear-gradient(135deg, #38bdf8, #22d3ee)",
          filter: "blur(80px)",
          top: "-5rem",
          right: "-5rem",
        }}
      />
      <div
        className="absolute w-80 h-80 rounded-full opacity-10"
        style={{
          background: "linear-gradient(135deg, #3b82f6, #38bdf8)",
          filter: "blur(80px)",
          bottom: "-5rem",
          left: "-5rem",
        }}
      />

      {/* Card */}
      <div
        className="bg-white rounded-2xl shadow-lg relative z-10 overflow-hidden"
        style={{ width: 480, maxWidth: "90vw" }}
      >
        {/* Top gradient bar */}
        <div
          className="h-1.5 w-full"
          style={{
            background: "linear-gradient(to right, #38bdf8, #22d3ee, #3b82f6)",
          }}
        />

        <div className="p-10 flex flex-col items-center text-center">

          {/* 404 big number */}
          <div className="relative mb-2">
            <span
              className="font-black select-none"
              style={{
                fontSize: 120,
                lineHeight: 1,
                background: "linear-gradient(135deg, #38bdf8 0%, #3b82f6 60%, #22d3ee 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-6px",
              }}
            >
              404
            </span>
            {/* shadow text behind */}
            <span
              className="absolute inset-0 font-black select-none"
              style={{
                fontSize: 120,
                lineHeight: 1,
                color: "transparent",
                WebkitTextStroke: "1px #e0f2fe",
                letterSpacing: "-6px",
                transform: "translate(4px, 4px)",
                zIndex: -1,
              }}
            >
              404
            </span>
          </div>

          {/* Icon */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
            style={{
              background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
              border: "1.5px solid #bae6fd",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                fill="url(#iconGrad)"
              />
              <defs>
                <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Text */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Page Not Found
          </h2>
          <p className="text-sm text-gray-400 mb-1">
            The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Countdown */}
          <div className="flex items-center gap-2 mt-3 mb-8">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #38bdf8, #3b82f6)",
              }}
            >
              {count}
            </div>
            <span className="text-xs text-gray-400">
              Redirecting to dashboard...
            </span>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 w-full">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-all"
            >
              ← Go Back
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 py-3 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
              style={{
                background: "linear-gradient(to right, #38bdf8, #22d3ee, #3b82f6)",
              }}
            >
              Dashboard →
            </button>
          </div>

        </div>

        {/* Bottom subtle bar */}
        <div className="px-10 py-4 border-t border-gray-50 flex items-center justify-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#38bdf8" }}
          />
          <span className="text-xs text-gray-300">MADD Admin Portal</span>
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#3b82f6" }}
          />
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default NotFound;