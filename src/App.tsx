import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import RoleGuard from "@/components/RoleGuard";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PlayerProfile from "./pages/PlayerProfile";
import ClubProfile from "./pages/ClubProfile";
import SearchPlayers from "./pages/SearchPlayers";
import SearchClubs from "./pages/SearchClubs";
import SearchStaff from "./pages/SearchStaff";
import StaffProfile from "./pages/StaffProfile";
import Trials from "./pages/Trials";
import Messages from "./pages/Messages";
import Highlights from "./pages/Highlights";
import ClubDashboard from "./pages/ClubDashboard";
import MyProfile from "./pages/MyProfile";
import MyStaffProfile from "./pages/MyStaffProfile";
import Connections from "./pages/Connections";
import Rankings from "./pages/Rankings";
import ActivityFeed from "./pages/ActivityFeed";
import Feed from "./pages/Feed";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/onboarding" element={<Onboarding />} />

            {/* Shared routes (all roles) */}
            <Route path="/feed" element={<Feed />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/highlights" element={<Highlights />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/activity" element={<ActivityFeed />} />
            <Route path="/player/:id" element={<PlayerProfile />} />
            <Route path="/club/:id" element={<ClubProfile />} />
            <Route path="/staff/:id" element={<StaffProfile />} />

            {/* Player-only routes */}
            <Route path="/my-profile" element={
              <RoleGuard allowed={["player"]}>
                <MyProfile />
              </RoleGuard>
            } />
            <Route path="/search-clubs" element={
              <RoleGuard allowed={["player", "physiotherapist", "coach", "analyst", "scout", "nutritionist", "mental_coach"]}>
                <SearchClubs />
              </RoleGuard>
            } />

            {/* Club-only routes */}
            <Route path="/dashboard" element={
              <RoleGuard allowed={["club"]}>
                <ClubDashboard />
              </RoleGuard>
            } />
            <Route path="/search" element={
              <RoleGuard allowed={["club", "scout"]}>
                <SearchPlayers />
              </RoleGuard>
            } />
            <Route path="/search-staff" element={
              <RoleGuard allowed={["club"]}>
                <SearchStaff />
              </RoleGuard>
            } />
            <Route path="/rankings" element={
              <RoleGuard allowed={["club", "scout"]}>
                <Rankings />
              </RoleGuard>
            } />

            {/* Player & Club routes */}
            <Route path="/trials" element={
              <RoleGuard allowed={["player", "club"]}>
                <Trials />
              </RoleGuard>
            } />

            {/* Staff-only routes */}
            <Route path="/my-staff-profile" element={
              <RoleGuard allowed={["physiotherapist", "coach", "analyst", "scout", "nutritionist", "mental_coach"]}>
                <MyStaffProfile />
              </RoleGuard>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;