
import { useForm } from "react-hook-form";
import { Button, Heading, Input } from "../index";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../features/auth/authSlice";
import { toast } from "react-toastify";


const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register: formRegister, handleSubmit, formState: { errors } } = useForm();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const SubmitFunc = async (data) => {
    try {
      await dispatch(login(data)).unwrap();
      toast.success("Login successful! Welcome back.");
      navigate("/");
    } catch (err) {
      // err is a string from rejectWithValue
      toast.error(err || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full space-y-8">
        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(SubmitFunc)}>
          <div className="px-6 py-10 space-y-4 bg-white shadow-lg rounded-xl w-[90vw] max-w-[350px]">
            <Heading className="mb-8 text-3xl">Login</Heading>
            {/* Email Field */}
            <div className="mb-10">
                <Input
                  label="Email"
                  type="email"
                  {...formRegister("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
              {errors.email && (              // error.email will be present only if there is some validation error
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-10">
              <div className="relative">
                <Input
                  label="Password"
                  type="password"
                  {...formRegister("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-start">
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-green-500 transition-colors hover:text-green-600"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                size="sm"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;