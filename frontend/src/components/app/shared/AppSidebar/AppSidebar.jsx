import {
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  X,
  FlaskConical,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/context/AuthContext";

const NAVIGATION_ITEMS = [
  {
    label: "Overview",
    to: ROUTES.APP,
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Projects",
    to: ROUTES.PROJECTS,
    icon: FolderKanban,
    end: false,
  },
];

function AppSidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");

  async function handleLogout() {
    try {
      await logout();

      toast.success("Signed out successfully.");

      navigate(ROUTES.HOME, { replace: true });
    } catch (error) {
      toast.error("Unable to sign out. Please try again.");
    }
  }

  function closeMobileSidebar() {
    setIsMobileOpen(false);
  }

  return (
    <>
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-4 border-b border-border bg-surface lg:hidden">
        <div className="flex items-center gap-2 ml-3 text-lg font-bold tracking-tight font-heading text-text">
          <FlaskConical size={24} strokeWidth={2.5} className="text-primary" />
          <span>ExperiML</span>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          aria-label="Open navigation"
          className="inline-flex items-center justify-center transition-colors duration-200 rounded-lg h-9 w-9 text-text-secondary hover:bg-surface-soft hover:text-text"
        >
          <Menu size={20} strokeWidth={2} />
        </button>
      </header>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-40 bg-black/65 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          w-64
          flex-col
          border-r
          border-border
          bg-surface
          transition-transform
          duration-300
          ease-out
          lg:static
          lg:z-auto
          lg:translate-x-0
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-border">
          <NavLink
            to={ROUTES.APP}
            onClick={closeMobileSidebar}
            className="flex items-center gap-2 text-lg font-bold tracking-tight font-heading text-text"
          >
            <FlaskConical
              size={24}
              strokeWidth={2.5}
              className="text-primary"
            />

            <span>ExperiML</span>
          </NavLink>

          <button
            type="button"
            onClick={closeMobileSidebar}
            aria-label="Close navigation"
            className="inline-flex items-center justify-center transition-colors duration-200 rounded-lg h-9 w-9 text-text-secondary hover:bg-surface-soft hover:text-text lg:hidden"
          >
            <X size={19} strokeWidth={2} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5">
          <div className="space-y-1">
            {NAVIGATION_ITEMS.map(({ label, to, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={closeMobileSidebar}
                className={({ isActive }) =>
                  `
                      flex
                      h-10
                      items-center
                      gap-3
                      rounded-lg
                      px-3
                      text-sm
                      font-medium
                      transition-colors
                      duration-200
                      ${
                        isActive
                          ? "bg-primary/20 text-primary"
                          : "text-text-secondary hover:bg-primary-light/40 hover:text-text"
                      }
                    `
                }
              >
                <Icon size={18} strokeWidth={2} />

                <span>{label}</span>
              </NavLink>
            ))}
          </div>

          {/* Secondary navigation */}
          <div className="my-5 border-t border-border" />

          <NavLink
            to={ROUTES.SETTINGS}
            onClick={closeMobileSidebar}
            className={({ isActive }) =>
              `
                flex
                h-10
                items-center
                gap-3
                rounded-lg
                px-3
                text-sm
                font-medium
                transition-colors
                duration-200
                ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-text-secondary hover:bg-primary-light/30 hover:text-text"
                }
              `
            }
          >
            <Settings size={18} strokeWidth={2} />

            <span>Settings</span>
          </NavLink>
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-lg">
            <div className="flex items-center justify-center text-xs font-semibold rounded-full h-9 w-9 shrink-0 bg-primary/10 text-primary">
              {getInitials(fullName || user?.email)}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium truncate text-text">
                {fullName || "User"}
              </p>

              <p className="text-xs truncate text-text-secondary">
                {user?.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center w-full h-10 gap-3 px-3 text-sm font-medium transition-colors duration-200 rounded-lg text-text-secondary hover:bg-primary-light/30 hover:text-text"
          >
            <LogOut size={18} strokeWidth={2} />

            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "U";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default AppSidebar;
