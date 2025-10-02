import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Login, SignUp, ForgotPassword } from "../../components";

const LoginRegister = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const modeParam = searchParams.get("mode");

  const [mode, setMode] = useState(modeParam || "login");

  useEffect(() => {
    if (
      modeParam &&
      ["login", "signup", "forgot-password"].includes(modeParam)
    ) {
      setMode(modeParam);
    }
  }, [modeParam]);

  const handleSwitch = (newMode) => {
    setMode(newMode);
    setSearchParams({ mode: newMode });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen">
      {mode === "login" ? (
        <div>
          <Login />
        </div>
      ) : mode === "signup" ? (
        <div>
          <SignUp />
        </div>
      ) : (
        <div>
          <ForgotPassword />
        </div>
      )}

      <div className="mt-8 mb-12 text-center">
        <p className="text-sm text-detail">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => handleSwitch("signup")}
                className="font-medium text-green-500 transition-colors hover:text-green-600"
              >
                Sign up here
              </button>
            </>
          ) : mode === "signup" ? (
            <>
              Already have an account?{" "}
              <button
                onClick={() => handleSwitch("login")}
                className="font-medium text-green-500 transition-colors hover:text-green-600"
              >
                Log in here
              </button>
            </>
          ) : (
            <>
              Remembered your password?{" "}
              <button
                onClick={() => handleSwitch("login")}
                className="font-medium text-green-500 transition-colors hover:text-green-600"
              >
                Back to login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default LoginRegister;
