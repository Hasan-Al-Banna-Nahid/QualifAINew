interface Route {
  name: string;
  href: string;
  show?: boolean;
}

export const routes: Route[] = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Clients", href: "/clients", show: true },
  { name: "Settings", href: "/settings", show: true },
];
