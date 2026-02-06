type SigninSuggestionProps = {
  onGoogleClick?: () => void;
  onAppleClick?: () => void;
  onSignupClick?: () => void;
};

const SigninSuggestion = ({
  onGoogleClick,
  onAppleClick,
  onSignupClick,
}: SigninSuggestionProps) => {
  return (
    <div className="w-full flex flex-col gap-4">
      
      {/* Google */}
      <button
        onClick={onGoogleClick}
        className="flex items-center justify-center gap-3 h-11 border border-gray-400 rounded-sm hover:bg-gray-50 transition"
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
          className="h-5 w-5 relative right-25 "
        />
        <span className="text-sm font-medium">
          Continue with Google
        </span>
      </button>

      {/* Apple */}
      <button
        onClick={onAppleClick}
        className="flex items-center justify-center gap-3 h-11 rounded-lg border border-gray-400 hover:bg-gray-50 transition"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 relative right-25"
          fill="currentColor"
        >
          <path d="M16.365 1.43c0 1.14-.44 2.21-1.15 3.03-.86.96-2.25 1.71-3.51 1.61-.14-1.1.43-2.28 1.13-3.05.78-.88 2.16-1.53 3.53-1.59zM20.39 17.29c-.46 1.03-.68 1.49-1.27 2.42-.83 1.29-2 2.9-3.45 2.91-1.3.01-1.64-.85-3.38-.85s-2.11.83-3.39.86c-1.44.02-2.53-1.43-3.36-2.72-2.3-3.56-2.54-7.74-1.12-9.93 1-1.55 2.58-2.46 4.07-2.46 1.54 0 2.51.86 3.38.86.84 0 2.14-1.06 3.71-.9.66.03 2.52.27 3.72 2.04-0.1.06-2.22 1.29-2.2 3.84.02 3.05 2.66 4.06 2.69 4.07z" />
        </svg>

        <span className="text-sm font-medium">
          Continue with Apple
        </span>
      </button>

      {/* Signup */}
      <p className="text-sm text-center text-gray-600 font-bold">
        Don’t have an account?{" "}
        <span
          onClick={onSignupClick}
          className="text-blue-600 font-medium cursor-pointer hover:underline"
        >
          Sign up
        </span>
      </p>
    </div>
  );
};

export default SigninSuggestion;
