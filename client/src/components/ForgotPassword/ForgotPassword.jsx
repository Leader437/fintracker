import { useForm } from "react-hook-form";
import { Button, Heading, Input } from "../index";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const SubmitFunc = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Reset password data:", data);
  };

  return (
    <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full space-y-8">
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(SubmitFunc)}>
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
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Button type="submit" size="sm" className="w-full">
                Submit
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
