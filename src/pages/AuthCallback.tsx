import { useEffect, useRef, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../lib/auth";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [status, setStatus] = useState<"pending" | "done" | "error">(
    "pending",
  );
  const ran = useRef(false);

  const token = searchParams.get("token");
  const error = searchParams.get("error");

  useEffect(() => {
    if (ran.current) {
      return;
    }
    ran.current = true;

    if (error) {
      setStatus("error");
      return;
    }

    if (!token) {
      setStatus("error");
      return;
    }

    login(token)
      .then(() => setStatus("done"))
      .catch(() => setStatus("error"));
  }, [token, error, login]);

  if (status === "done") {
    return <Navigate to="/dashboard" replace />;
  }

  if (status === "error") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <p className="text-gray-500">Signing you in...</p>
    </div>
  );
}
