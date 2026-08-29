import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import logo from "../assets/logo.jpeg";

const LoginPage = () => {
  const { login } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Publisher Portal</h1>
        <p className="text-gray-500 mt-2 max-w-md">
          Secure your stall at Sri Lanka's largest literary event.
        </p>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-10 text-center">
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="ReserveX Logo"
            className="h-16 w-auto object-contain"
          />
        </div>

        <h2 className="text-xl font-semibold mb-2">Welcome</h2>
        <p className="text-gray-500 text-sm mb-8">
          Click below to sign in securely via Asgardeo.
        </p>

        <button
          onClick={login}
          className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          🔐 Login with Asgardeo
        </button>

        <p className="text-xs text-gray-400 mt-6 border-t pt-4">
          Secured by OpenID Connect (OIDC)
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
