import { useState } from "react";
import { Zap, Mail, Lock, User, Phone } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const {
    login,
    register,
    resendRegisterOtp,
    verifyRegisterOtp,
    forgotPasswordSendOtp,
    resetPassword,
    loading,
    error,
  } = useAuth();





  const [view, setView] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");


  const [otp, setOtp] = useState("");
  const [otpMode, setOtpMode] = useState("register");
  const [cooldown, setCooldown] = useState(0);


  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const startCooldown = () => {
    setCooldown(30);
    const timer = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const ok = await register({ username, email, password, phone });
    if (ok) {
      setOtpMode("register");
      setOtp("");
      startCooldown();
      setView("verify-otp");
    }
  };

  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    if (otpMode === "reset") {
      setView("reset-password");
      return;
    }
    const ok = await verifyRegisterOtp(email, otp);
    if (ok) setView("login");
  };

  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    const ok =
      otpMode === "register"
        ? await resendRegisterOtp(email)
        : await forgotPasswordSendOtp(email);
    if (ok) startCooldown();
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    const ok = await forgotPasswordSendOtp(email);
    if (ok) {
      setOtpMode("reset");
      setOtp("");
      startCooldown();
      setView("verify-otp");
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    if (newPassword !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }
    const ok = await resetPassword(email, otp, newPassword);
    if (ok) {
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setView("login");
    }
  };


  if (view === "login") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-4 pt-12 pb-16">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="text-indigo-600 fill-indigo-600" size={28} />
          <h1 className="text-3xl font-bold text-indigo-600">Koda Store</h1>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mt-4">Welcome back</h2>
        <p className="text-gray-500 mt-1 mb-8">Sign in to your account</p>

        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => setView("forgot-password")}
                className="text-sm text-indigo-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <p className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setView("register")}
                className="text-indigo-600 font-medium hover:underline"
              >
                Sign up
              </button>
            </p>
          </form>
        </div>
      </div>
    );
  }



  if (view === "register") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-4 pt-12 pb-16">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="text-indigo-600 fill-indigo-600" size={28} />
          <h1 className="text-3xl font-bold text-indigo-600">Koda Store</h1>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mt-4">
          Create an account
        </h2>
        <p className="text-gray-500 mt-1 mb-8">Join us and start shopping</p>

        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-6">
          <form onSubmit={handleRegisterSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe"
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+123456789"
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setView("login")}
                className="text-indigo-600 font-medium hover:underline"
              >
                Sign in
              </button>
            </p>
          </form>
        </div>
      </div>
    );
  }





  if (view === "verify-otp") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-4 pt-12 pb-16">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="text-indigo-600 fill-indigo-600" size={28} />
          <h1 className="text-3xl font-bold text-indigo-600">Koda Store</h1>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mt-4">Verify code</h2>
        <p className="text-gray-500 mt-1 mb-8 text-center">
          Enter the 6-digit code sent to{" "}
          <span className="font-medium">{email}</span>
        </p>

        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-6">
          <form onSubmit={handleVerifyOtpSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                OTP Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                required
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="000000"
                className="w-full text-center tracking-[0.5em] text-lg font-semibold px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>

            <p className="text-center text-sm text-gray-500">
              Didn't get the code?{" "}
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={cooldown > 0 || loading}
                className="text-indigo-600 font-medium hover:underline disabled:text-gray-400 disabled:no-underline"
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
              </button>
            </p>
          </form>
        </div>
      </div>
    );
  }

 




  if (view === "forgot-password") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-4 pt-12 pb-16">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="text-indigo-600 fill-indigo-600" size={28} />
          <h1 className="text-3xl font-bold text-indigo-600">Koda Store</h1>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mt-4">
          Forgot Password?
        </h2>
        <p className="text-gray-500 mt-1 mb-8">
          Enter your email and we'll send you a reset code
        </p>

        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-6">
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition"
            >
              {loading ? "Sending..." : "Send Reset Code"}
            </button>

            <p className="text-center text-sm text-gray-500">
              Remember your password?{" "}
              <button
                type="button"
                onClick={() => setView("login")}
                className="text-indigo-600 font-medium hover:underline"
              >
                Sign in
              </button>
            </p>
          </form>
        </div>
      </div>
    );
  }

 



  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-4 pt-12 pb-16">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="text-indigo-600 fill-indigo-600" size={28} />
        <h1 className="text-3xl font-bold text-indigo-600">Koda Store</h1>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mt-4">Reset Password</h2>
      <p className="text-gray-500 mt-1 mb-8">Choose a new password</p>

      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-6">
        <form onSubmit={handleResetPasswordSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {(localError || error) && (
            <p className="text-sm text-red-500 text-center">
              {localError || error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
