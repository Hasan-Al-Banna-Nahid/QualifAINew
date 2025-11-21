import {
  IoHomeOutline,
  IoSettingsOutline,
  IoLaptopOutline,
} from "react-icons/io5";

import { ReactNode } from "react";
import HomePage from "../Home/Home";

export type ISidebarType = {
  name: string;
  href: string;
  icon: ReactNode;
  show?: boolean;
  element?: ReactNode;
};

export const sidebarRoutes: ISidebarType[] = [
  {
    name: "Home",
    href: "/",
    icon: <IoHomeOutline />,
    element: <HomePage />,
  },
  { name: "Dashboard", href: "/dashboard", icon: <IoLaptopOutline /> },
  { name: "Settings", href: "/settings", icon: <IoSettingsOutline /> },
  { name: "Admin", href: "/admin", icon: <IoSettingsOutline />, show: false },
];
