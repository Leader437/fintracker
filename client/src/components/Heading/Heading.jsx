import line from "../../assets/underline.svg";

const Heading = ({ children }) => {
  return (
    <div className="flex flex-col max-w-fit">
      <h1 className="pl-1 text-2xl font-bold heading">{children}</h1>
      <img src={line} alt="" />
    </div>
  );
};

export default Heading;
