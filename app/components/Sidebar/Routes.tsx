import {
  IoHomeOutline,
  IoSettingsOutline,
  IoLaptopOutline,
  IoPeopleOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";

import { ReactNode } from "react";
import HomePage from "../Home/Home";

export type ISidebarType = {
  name: string;
  href: string;
  icon: ReactNode;
  show?: boolean;
  requiresAuth?: boolean;
  element?: ReactNode;
};

export const sidebarRoutes: ISidebarType[] = [
  // {
  //   name: "Home",
  //   href: "/",
  //   icon: <IoHomeOutline />,
  //   element: <HomePage />,
  //   requiresAuth: false,
  // },
  {
    name: "Dashboard",
    href: "/qualifai",
    icon: <IoLaptopOutline />,
    requiresAuth: true,
  },
  {
    name: "Clients",
    href: "/clients",
    icon: <IoPeopleOutline />,
    requiresAuth: true,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: <IoSettingsOutline />,
    requiresAuth: true,
  },
  {
    name: "Admin",
    href: "/admin",
    icon: <IoShieldCheckmarkOutline />,
    show: false,
    requiresAuth: true,
  },
];
