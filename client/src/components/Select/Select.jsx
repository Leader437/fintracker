import { useId } from "react"

const Select = ({
    label,
    options,
    className = '',
    ref,
    name,
    ...props
}) => {
  const id = useId();

  return (
    <div>
        {label && <label htmlFor={id}>{label}</label>}
        <select id={id} className={`${className}`} {...props} ref={ref} name={name}>
            {options?.map(option => (                                // '?' here is optional chaining to map the array means if there's undefined or null in array than just return undefined without an error, if there's some value in array than map it, if we don't apply some kind of check, looping an empty array through errors
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    </div>
  )
}

export default Select