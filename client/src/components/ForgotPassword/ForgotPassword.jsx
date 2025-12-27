import { useForm } from "react-hook-form";
import { Button, Heading, Input } from "../index";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { authAPI } from "../../services/api";
import { toast } from "react-toastify";



const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState(1); // 1: email, 2: otp, 3: reset
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const navigate = useNavigate();

  // Phase 1: Email submit handler
  const onSubmitEmail = async (data) => {
    setLoading(true);
    try {
      await authAPI.forgotPassword({ email: data.email });
      setEmail(data.email);
      setPhase(2);
      toast.success("OTP sent to your email. Please check your inbox.");
      setValue("otp", "");
    } catch (err) {
      toast.error(err.message || "Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Phase 2: OTP verify handler
  const onSubmitOTP = async (data) => {
    setLoading(true);
    try {
      const res = await authAPI.verifyOTP({ email, otp: data.otp });
      setResetToken(res.data); // backend returns resetToken in data
      setPhase(3);
      toast.success("OTP verified. Please enter your new password.");
      setValue("password", "");
    } catch (err) {
      toast.error(err.message || "Invalid OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Phase 3: Password reset handler
  const onSubmitReset = async (data) => {
    setLoading(true);
    try {
      await authAPI.resetPassword({ resetToken, newPassword: data.password });
      toast.success("Password reset successful! You can now log in.");
      reset();
      setPhase(1);
      setEmail("");
      setResetToken("");
      navigate("/auth?mode=login");
    } catch (err) {
      toast.error(err.message || "Failed to reset password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full space-y-8">
        {/* Phase 1: Email Form */}
        {phase === 1 && (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmitEmail)}>
            <div className="px-6 py-10 space-y-4 bg-white shadow-lg rounded-xl w-[90vw] max-w-[350px]">
              <Heading className="mb-12 text-3xl">Reset Password</Heading>
              <div className="mb-10">
                <Input
                  label="Email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  disabled={loading}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
              <div>
                <Button type="submit" size="sm" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Submit"}
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* Phase 2: OTP Form */}
        {phase === 2 && (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmitOTP)}>
            <div className="px-6 py-10 space-y-4 bg-white shadow-lg rounded-xl w-[90vw] max-w-[350px]">
              <Heading className="mb-8 text-2xl">Verify OTP</Heading>
              <Input
                label="Email"
                type="email"
                value={email}
                disabled
              />
              <Input
                label="OTP"
                type="text"
                {...register("otp", { required: "OTP is required" })}
                disabled={loading}
              />
              {errors.otp && <p className="text-sm text-red-500">{errors.otp.message}</p>}
              <Button type="submit" size="sm" className="w-full" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>
          </form>
        )}

        {/* Phase 3: Reset Password Form */}
        {phase === 3 && (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmitReset)}>
            <div className="px-6 py-10 space-y-4 bg-white shadow-lg rounded-xl w-[90vw] max-w-[350px]">
              <Heading className="mb-8 text-2xl">Set New Password</Heading>
              <Input
                label="Email"
                type="email"
                value={email}
                disabled
              />
              <Input
                label="New Password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
                disabled={loading}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              <Button type="submit" size="sm" className="w-full" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
