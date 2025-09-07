    import { useId } from "react";

    const Input = ({ label, type = "text", className = "", ...props }) => {
    const id = useId();

    return (
        <div className={`relative w-full ${label ? "mt-4" : ""}`}>
        <input
            id={id}
            type={type}
            placeholder=" " // 👈 this is crucial so label knows when input is empty
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
        </div>
    );
    };

    export default Input;
