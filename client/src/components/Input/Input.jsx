import { useId, useState } from "react";
import { LuEye, LuEyeClosed } from "react-icons/lu";

const Input = ({ label, type = "text", className = "", ...props }) => {
    const id = useId();
    const [showPassword, setShowPassword] = useState(false);
    
    const isPasswordType = type === "password";
    const inputType = isPasswordType && showPassword ? "text" : type;

    return (
        <div className={`relative w-full ${label ? "mt-4" : ""}`}>
            <input
                id={id}
                type={inputType}
                placeholder=" " // this is crucial so label knows when input is empty
                className={`
                    peer
                    w-full
                    border-b
                    border-[#4A4C4D]
                    bg-transparent
                    text-[#242625]
                    font-display
                    focus:outline-none
                    focus:border-[#7de983]
                    transition-colors duration-300
                    ${isPasswordType ? 'pr-8' : ''}
                    ${className}
                `}
                {...props}
            />
            {label && (
                <label
                    htmlFor={id}
                    className={`
                        absolute left-0 
                        transition-all duration-300
                        peer-placeholder-shown:top-0
                        peer-placeholder-shown:text-sm
                        peer-placeholder-shown:text-[#4A4C4D59]
                        -top-4 text-xs text-detail font-display
                    `}
                >
                    {label}
                </label>
            )}
            {isPasswordType && (
                <button
                    type="button"
                    className="absolute top-0 right-0 flex items-center justify-center w-6 h-6 text-gray-400 transition-colors hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? (
                        <LuEye className="w-4 h-4" />
                    ) : (
                        <LuEyeClosed className="w-4 h-4" />
                    )}
                </button>
            )}
        </div>
    );
};

export default Input;
