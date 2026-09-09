import { NavBar } from "@/components/nav/NavBar";

/**
 * Admin uses the public header so navigation remains familiar, with the
 * restricted admin destinations added alongside the public destinations.
 */
export function AdminNav() {
  return <NavBar admin />;
}
