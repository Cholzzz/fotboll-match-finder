import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole, UserRole } from "@/hooks/useUserRole";

interface RoleGuardProps {
  children: ReactNode;
  allowed: UserRole[];
}

const RoleGuard = ({ children, allowed }: RoleGuardProps) => {
  const { user, loading: authLoading } = useAuth();
  const { role, isLoading: roleLoading, isStaff, isClub } = useUserRole();

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (role && !allowed.includes(role)) {
    // Redirect to appropriate home
    if (isStaff) return <Navigate to="/my-staff-profile" replace />;
    if (isClub) return <Navigate to="/dashboard" replace />;
    return <Navigate to="/feed" replace />;
  }

  return <>{children}</>;
};

export default RoleGuard;
