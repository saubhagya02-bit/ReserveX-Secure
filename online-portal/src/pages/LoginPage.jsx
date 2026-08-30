import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import logo from "../assets/logo.jpeg";

const LoginPage = () => {
  const { login } = useContext(AuthContext);

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Check for access-denied message after Asgardeo redirects
    const storedMessage = sessionStorage.getItem("portalAccessError");
    const storedType = sessionStorage.getItem("portalAccessType");

    if (storedMessage && storedType === "vendor-only") {
      setErrorMessage(storedMessage);

      // Remove only after successfully reading it
      sessionStorage.removeItem("portalAccessError");
      sessionStorage.removeItem("portalAccessType");
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Publisher Portal</h1>

        <p className="text-gray-500 mt-2 max-w-md">
          Secure your stall at Sri Lanka's largest literary event.
        </p>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="ReserveX Logo"
            className="h-16 w-auto object-contain"
          />
        </div>

        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Welcome</h2>

          <p className="text-gray-500 text-sm mb-6">
            Click below to sign in securely via Asgardeo.
          </p>
        </div>

        {/* ACCESS DENIED ALERT */}
        {errorMessage && (
          <div
            className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4"
            role="alert"
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
                  <svg
                    className="h-5 w-5 text-red-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.366-.446.957-.446 1.323 0l7.1 8.65c.554.675.073 1.651-.794 1.651H1.95c-.867 0-1.348-.976-.794-1.651l7.1-8.65zM9 7a1 1 0 10-2 0v2a1 1 0 102 0V7zm-1 6a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              {/* Message */}
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-800">
                  Access Restricted
                </h3>

                <p className="mt-1 text-sm leading-5 text-red-700">
                  {errorMessage}
                </p>
              </div>

              {/* Close */}
              <button
                type="button"
                onClick={() => setErrorMessage("")}
                className="text-red-400 hover:text-red-600 text-xl leading-none"
                aria-label="Close message"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Login Button */}
        <button
          onClick={login}
          className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-200"
        >
          🔐 Login with Asgardeo
        </button>

        <p className="text-xs text-gray-400 mt-6 border-t pt-4 text-center">
          Secured by OpenID Connect (OIDC)
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
