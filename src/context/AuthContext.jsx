import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const API_BASE = "https://e-commerce-api-3wara.vercel.app";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const [pendingRegistration, setPendingRegistration] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "فشل تسجيل الدخول");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return true;
    } catch (err) {
      setError(err.message || "حدث خطأ، حاول مرة أخرى");
      return false;
    } finally {
      setLoading(false);
    }
  };



  // ---------- REGISTER ----------
  const register = async ({ username, email, password, phone }) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/auth/register/send-otp`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, phone }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.errors?.[0] || data.message || "فشل إنشاء الحساب"
        );
      }

      setPendingRegistration({ username, email, password, phone });
      return true;
    } catch (err) {
      setError(err.message || "حدث خطأ، حاول مرة أخرى");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resendRegisterOtp = async (email) => {
    setLoading(true);
    setError("");
    try {
      const payload =
        pendingRegistration?.email === email
          ? pendingRegistration
          : { email };

      const res = await fetch(`${API_BASE}/auth/register/send-otp`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "تعذر إعادة إرسال الكود");
      }

      return true;
    } catch (err) {
      setError(err.message || "حدث خطأ، حاول مرة أخرى");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyRegisterOtp = async (email, otp) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/auth/register/verify-otp`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.errors?.[0] || data.message || "الكود غير صحيح"
        );
      }

      // in case the API logs the user in directly after verification
      if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
      }

      setPendingRegistration(null);
      return true;
    } catch (err) {
      setError(err.message || "حدث خطأ، حاول مرة أخرى");
      return false;
    } finally {
      setLoading(false);
    }
  };



  
  const forgotPasswordSendOtp = async (email) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password/send-otp`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "تعذر إرسال كود إعادة التعيين");
      }

      return true;
    } catch (err) {
      setError(err.message || "حدث خطأ، حاول مرة أخرى");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email, otp, newPassword) => {
    setLoading(true);
    setError("");
    try {
      // ملحوظة: اسم الـ endpoint ده افتراضي، لازم يتأكد من الـ Swagger docs
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.errors?.[0] || data.message || "تعذر تغيير كلمة المرور"
        );
      }

      return true;
    } catch (err) {
      setError(err.message || "حدث خطأ، حاول مرة أخرى");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/users/${user._id}`, {
        method: "PATCH",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "فشل تحديث البيانات");
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      return true;
    } catch (err) {
      setError(err.message || "حدث خطأ، حاول مرة أخرى");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        login,
        logout,
        updateProfile,
        register,
        resendRegisterOtp,
        verifyRegisterOtp,
        pendingRegistration,
        forgotPasswordSendOtp,
        resetPassword,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}