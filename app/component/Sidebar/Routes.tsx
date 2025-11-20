import {
  IoHomeOutline,
  IoSettingsOutline,
  IoLaptopOutline,
} from "react-icons/io5";

export const sidebarRoutes = [
  {
    name: "Home",
    href: "/",
    icon: <IoHomeOutline />,
  },
  { name: "Dashboard", href: "/dashboard", icon: <IoLaptopOutline /> },
  { name: "Settings", href: "/settings", icon: <IoSettingsOutline /> },
  { name: "Admin", href: "/admin", icon: <IoSettingsOutline />, show: false },
];
