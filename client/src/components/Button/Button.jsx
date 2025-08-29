import "./Button.css";

const Button = ({ children, onclick }) => {
  return (
    <button className="button" onClick={onclick}>
      <span className="shadow" />
      <span className="edge" />
      <div className="front">
        <span>{children}</span>
      </div>
    </button>
  );
};

export default Button;
