import { FileText, LayoutGrid, Settings, User } from "lucide-react";
import LloydsIcon from "../assets/LloydsIcon.svg";

const Sidebar = ({ activePage, setActivePage }) => {
  const navItems = [
    { id: "home", icon: LayoutGrid, label: "Dashboard" },
    { id: "team", icon: User, label: "My Team" },
    { id: "docs", icon: FileText, label: "Documents" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav
      className="w-25 dark:bg-slate-800/50 border-r border-slate-200 dark:border-slate-700 flex flex-col items-center pb-5"
      style={{ background: "#11b67a" }}
    >
      <a href="#" className="mb-3 bg-white py-4 px-2">
        <img src={LloydsIcon} className="logo" alt="LLoyds" />
      </a>
      <ul className="flex-1 flex flex-col items-center space-y-4">
        {navItems.map((item) => (
          <li key={item.id}>
            <a
              href="#"
              title={item.label}
              onClick={(e) => {
                e.preventDefault();
                setActivePage(item.id);
              }}
              className={`flex items-center justify-center p-3 rounded-lg transition-colors ${
                activePage === item.id
                  ? "bg-white text-black"
                  : "text-white hover:bg-black dark:text-white dark:hover:bg-black"
              }`}
            >
              <item.icon className="h-6 w-6" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
