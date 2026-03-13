import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/authStore";
import { mockUsers } from "../data/mockUsers";

export function Login() {
  const navigate = useNavigate();
  const { user, loginError, login, loginAs, clearLoginError } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [quickLoginId, setQuickLoginId] = useState("");

  useEffect(() => {
    if (user) {
      if (user.role === "Manager") {
        navigate("/", { replace: true });
      } else {
        navigate("/employee-skills", { replace: true });
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    clearLoginError();
  }, [email, password, clearLoginError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickLoginId) {
      if (useAuthStore.getState().loginAs(quickLoginId)) {
        const u = useAuthStore.getState().user;
        if (u?.role === "Manager") navigate("/", { replace: true });
        else navigate("/employee-skills", { replace: true });
      }
      return;
    }
    if (login(email, password)) {
      const u = useAuthStore.getState().user;
      if (u?.role === "Manager") navigate("/", { replace: true });
      else navigate("/employee-skills", { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">In Time Pro</h1>
            <p className="text-sm text-gray-500 mt-1">Skill Matrix</p>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Sign in</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="quick-login" className="block text-sm font-medium text-gray-700 mb-2">
                Quick login (demo)
              </label>
              <select
                id="quick-login"
                value={quickLoginId}
                onChange={(e) => setQuickLoginId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select user...</option>
                {mockUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or use credentials</span>
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. john.doe@company.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoComplete="username"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="e.g. manager123"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoComplete="current-password"
              />
            </div>
            {loginError && (
              <p className="text-sm text-red-600" role="alert">
                {loginError}
              </p>
            )}
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Sign in
            </button>
          </form>
          <p className="mt-4 text-xs text-gray-500 text-center">
            Demo: Manager john.doe@company.com / manager123. Employees: any emp email / employee123
          </p>
        </div>
      </div>
    </div>
  );
}
