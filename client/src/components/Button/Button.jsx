import "./Button.css";

const Button = ({
  children,
  type = "button",                    // passing default values incase we don't provide them when using the component
  bgColor = "",                       // in current project's case there's only one bgColor and one textColor and button style is a bit complex so i already hard coded it in css
  textColor = "",
  size = "md",                       // incase we want to have different sizes of button
  className = "",                     // incase we wan't to pass some specific tailwind style
  ...props                               // any attribute like we pass to this Button component will be passed to the button element e.g. onclick
}) => {
  return (
    <button type={type} className={`button font-display ${bgColor} ${textColor} ${className}`} {...props}>
      <span className="shadow" />
      <span className="edge" />
      <div className={`front text-${size}`}>
        <span className="whitespace-nowrap">{children}</span>
      </div>
    </button>
  );
};

export default Button;
