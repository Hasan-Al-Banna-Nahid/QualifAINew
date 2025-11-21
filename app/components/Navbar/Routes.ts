// app/components/Navbar/routes.ts
interface Route {
  name: string;
  href: string;
  show?: boolean;
  requiresAuth?: boolean;
}

export const routes: Route[] = [
  { name: "Home", href: "/", requiresAuth: false },
  { name: "Dashboard", href: "/dashboard", requiresAuth: true },
  { name: "Clients", href: "/clients", show: true, requiresAuth: true },
  { name: "Settings", href: "/settings", show: true, requiresAuth: true },
];
