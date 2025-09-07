import { useId } from "react";
import "./Select.css";

const Select = ({ label, options, className = "", ref, name, size = "md", ...props }) => {
  const id = useId();

  return (
    <div className="select-wrapper">
      {label && (
        <label
          htmlFor={id}
          className="block mb-1 text-sm font-display text-detail"
        >
          {label}
        </label>
      )}
      <select
        id={id}
        name={name}
        ref={ref}
        className={`select font-display ${className} text-${size}`}
        {...props}
      >
        {options?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
