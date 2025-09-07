import line from "../../assets/underline.svg";

const Heading = ({ children, className='' }) => {
  return (
    <div className={`flex flex-col max-w-fit ${className}`}>
      <h1 className="pl-1 text-2xl font-bold heading">{children}</h1>
      <img src={line} alt="" />
    </div>
  );
};

export default Heading;
