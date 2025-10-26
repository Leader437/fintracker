import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Heading, Input } from "../index";
import { Link } from "react-router-dom";
import { BiEdit } from "react-icons/bi";

const Signup = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [imageError, setImageError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const SubmitFunc = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Signup data:", { ...data, profileImage });
  };

  const password = watch("password");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageError("");

    if (file) {
      // Check file size (2MB = 2 * 1024 * 1024 bytes)
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        setImageError("Image size must be less than 2MB");
        setProfileImage(null);
        e.target.value = "";
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        setImageError("Please upload an image file");
        setProfileImage(null);
        e.target.value = "";
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full space-y-8">
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(SubmitFunc)}>
          <div className="px-6 py-10 space-y-4 bg-white shadow-lg rounded-xl w-[90vw] max-w-[350px]">
            <Heading className="mb-8 text-3xl">Sign Up</Heading>

            {/* Profile Picture Upload */}
            <div className="flex justify-center mb-10">
              <div className="relative group">
                <input
                  type="file"
                  id="profilePicture"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="profilePicture"
                  className="relative block w-24 h-24 overflow-hidden transition-all border-2 border-gray-300 rounded-full cursor-pointer hover:border-accent"
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-100">
                      <svg
                        className="w-12 h-12 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center transition-opacity bg-black/20 rounded-full opacity-0 bg-opacity-60 group-hover:opacity-100">
                    <BiEdit className="text-2xl text-white" />
                  </div>
                </label>
              </div>
            </div>
            {imageError && (
              <p className="text-sm text-center text-red-600">
                {imageError}
              </p>
            )}

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
