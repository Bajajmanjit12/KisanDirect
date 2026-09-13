import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function AuthModal({ mode = "login", onClose, onSuccess }) {
  const { login, register } = useAuth();

  const [authMode, setAuthMode] = useState(mode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (authMode === "login") {
        login({ email, password });
      } else {
        if (!name.trim()) {
          throw new Error("Please enter your name");
        }

        register({
          name,
          email,
          password,
          role,
        });
      }

      onSuccess?.();
      onClose?.();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="auth-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <h2>{authMode === "login" ? "Welcome Back" : "Create Account"}</h2>

        <p>
          {authMode === "login"
            ? "Login to continue to KisanDirect"
            : "Register as a Buyer, Farmer, or Admin"}
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {authMode === "register" && (
            <label>
              Full Name
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your name"
                required
              />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
            />
          </label>

          {authMode === "register" && (
            <label>
              Register As
              <select
                value={role}
                onChange={(event) => setRole(event.target.value)}
              >
                <option value="buyer">Buyer</option>
                <option value="farmer">Farmer / FPO</option>
                <option value="admin">Admin</option>
              </select>
            </label>
          )}

          <button className="btn primary auth-submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : authMode === "login"
              ? "Login"
              : "Create Account"}
          </button>
        </form>

        <div className="auth-switch">
          {authMode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setAuthMode("register");
                  setError("");
                }}
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  setError("");
                }}
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}