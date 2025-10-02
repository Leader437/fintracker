import { useForm } from "react-hook-form";
import { Button, Heading, Input } from "../index";
import { Link } from "react-router-dom";

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const SubmitFunc = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Signup data:", data);
  };

  const password = watch("password");

  return (
    <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full space-y-8">
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(SubmitFunc)}>
          <div className="px-6 py-10 space-y-4 bg-white shadow-lg rounded-xl w-[90vw] max-w-[350px]">
            <Heading className="mb-8 text-3xl">Sign Up</Heading>

            <div className="mb-10">
              <Input
                label="Full Name"
                type="text"
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

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
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="mb-10">
              <Input
                label="Password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="mb-10">
              <Input
                label="Confirm Password"
                type="password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <div>
              <Button type="submit" size="sm" className="w-full">
                Create Account
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
