import line from "../../assets/underline.svg";

const Heading = ({ children, className='' }) => {
  return (
    <div className={`relative pb-2.5 flex flex-col max-w-fit ${className}`}>
      <h1 className="px-1 font-bold text-inherit heading whitespace-nowrap">{children}</h1>
      <img src={line} alt="underline" className="absolute bottom-0 left-0 w-full" />
    </div>
  );
};

export default Heading;
