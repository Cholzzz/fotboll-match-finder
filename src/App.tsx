import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PlayerProfile from "./pages/PlayerProfile";
import ClubProfile from "./pages/ClubProfile";
import SearchPlayers from "./pages/SearchPlayers";
import SearchStaff from "./pages/SearchStaff";
import StaffProfile from "./pages/StaffProfile";
import Trials from "./pages/Trials";
import Messages from "./pages/Messages";
import Highlights from "./pages/Highlights";
import ClubDashboard from "./pages/ClubDashboard";
import PerformanceTests from "./pages/PerformanceTests";
import NutritionPlan from "./pages/NutritionPlan";
import MyProfile from "./pages/MyProfile";
import MyStaffProfile from "./pages/MyStaffProfile";
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
            <Route path="/" element={<Index />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/player/:id" element={<PlayerProfile />} />
            <Route path="/club/:id" element={<ClubProfile />} />
            <Route path="/search" element={<SearchPlayers />} />
            <Route path="/search-staff" element={<SearchStaff />} />
            <Route path="/staff/:id" element={<StaffProfile />} />
            <Route path="/trials" element={<Trials />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/highlights" element={<Highlights />} />
            <Route path="/dashboard" element={<ClubDashboard />} />
            <Route path="/performance" element={<PerformanceTests />} />
            <Route path="/nutrition" element={<NutritionPlan />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;