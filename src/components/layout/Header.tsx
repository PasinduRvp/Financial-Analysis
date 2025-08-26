import { Link, useLocation } from "react-router-dom";
import { FileText, Home, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const Header = () => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: TrendingUp },
    { name: "Monthly Report", href: "/monthly-report", icon: FileText },
    { name: "Yearly Report", href: "/yearly-report", icon: FileText },
  ];

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
  <div className="container mx-auto px-4 py-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {/* Logo / Home link */}
        <a
          href="/"
          className="w-10 h-10 bg-gradient-to-br from-primary to-primary-hover rounded-lg flex items-center justify-center"
        >
          <Home className="w-6 h-6 text-primary-foreground" />
        </a>

        {/* Title */}
        <div>
          <h1 className="text-xl font-bold text-foreground">FinDash</h1>
          <p className="text-sm font-bold text-muted-foreground">
            Fast, simple, and powerful financial dashboards.
          </p>
        </div>
      </div>

          <nav className="flex space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
