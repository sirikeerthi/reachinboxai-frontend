import { Navigate } from "react-router-dom";
import { googleLoginUrl } from "../lib/api";
import { useAuth } from "../lib/auth";

export default function Login() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Login</h1>
        <a
          href={googleLoginUrl()}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-50 px-4 py-3 font-medium text-gray-800 transition hover:bg-green-100"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11A11.99 11.99 0 0 0 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28V6.61H1.27A11.99 11.99 0 0 0 0 12c0 1.93.46 3.76 1.27 5.39l4-3.11z"
            />
            <path
              fill="#EA4335"
              d="M12 4.76c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.32 0 3.26 2.69 1.27 6.61l4 3.11C6.22 6.87 8.87 4.76 12 4.76z"
            />
          </svg>
          Login with Google
        </a>
      </div>
    </div>
  );
}
