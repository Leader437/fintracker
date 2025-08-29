import { NavLink } from "react-router-dom";
import { GiExpense } from "react-icons/gi";
import { BiExport } from "react-icons/bi";
import { TiFolderOpen } from "react-icons/ti";
import { VscAccount } from "react-icons/vsc";
import "./Sidebar.css";

const Sidebar = () => {
  const menuLinks = [
    { to: "/current-expenses", label: "Current Expenses", icon: <GiExpense /> },
    {
      to: "/previous-expenses",
      label: "Previous Expenses",
      icon: <TiFolderOpen />,
    },
    { to: "/export", label: "Export", icon: <BiExport /> },
    { to: "/account", label: "Account", icon: <VscAccount /> },
  ];

  return (
    <div className="w-full lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:h-screen px-2 sm:px-4 py-4 lg:py-6 bg-secondary transition-all lg:w-[25vw] lg:max-w-[300px] 2xl:max-w-[340px]">
      <h1 className="text-2xl font-bold lg:text-4xl text-primary">
        Fin<span className="text-accent">Tracker</span>
      </h1>
      <ul className="fixed bottom-0 left-0 right-0 flex justify-around h-14 lg:static bg-secondary lg:mt-10 lg:block">
        {menuLinks.map((link) => (
          <li key={link.to} className="py-5 lg:py-0 lg:my-10 sidebar-link">
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-2 text-xl lg:text-lg font-medium ${
                  isActive ? "text-accent" : ""
                }`
              }
            >
              {link.icon}
              <p className="hidden link-label lg:pt-0.5 text-primary lg:inline whitespace-nowrap">
                {link.label}
              </p>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
