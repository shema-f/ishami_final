import { createBrowserRouter } from "react-router";
import Root from "../components/Root";
import AdminLayout from "../components/AdminLayout";
import Home from "../pages/Home";
import AIAssistant from "../pages/AIAssistant";
import Quiz from "../pages/Quiz";
import Resources from "../pages/Resources";
import Leaderboard from "../pages/Leaderboard";
import Auth from "../pages/Auth";
import ResetPassword from "../pages/ResetPassword";
import Irembo from "../pages/Irembo";
import NotFound from "../pages/NotFound";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import Terms from "../pages/Terms";
import CookiePolicy from "../pages/CookiePolicy";
import Profile from "../pages/Profile";
import Certificate from "../pages/Certificate";
import TestPayment from "../pages/TestPayment";
import Simulation from "../pages/Simulation";
import ScenarioSelect from "../simulation/ui/ScenarioSelect";

// Admin Pages
import AdminDashboard from "../pages/admin/Dashboard";
import AdminUsers from "../pages/admin/Users";
import AdminQuestions from "../pages/admin/Questions";
import AdminPayments from "../pages/admin/Payments";
import AdminIremboApplications from "../pages/admin/IremboApplications";
import AdminResources from "../pages/admin/Resources";
import AdminNotifications from "../pages/admin/Notifications";
import AdminFraudLogs from "../pages/admin/FraudLogs";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "ai-assistant", Component: AIAssistant },
      { path: "quiz", Component: Quiz },
      { path: "resources", Component: Resources },
      { path: "leaderboard", Component: Leaderboard },
      { path: "auth", Component: Auth },
      { path: "reset", Component: ResetPassword },
      { path: "irembo", Component: Irembo },
      { path: "privacy", Component: PrivacyPolicy },
      { path: "terms", Component: Terms },
      { path: "cookies", Component: CookiePolicy },
      { path: "profile", Component: Profile },
      { path: "certificate", Component: Certificate },
      { path: "test-payment", Component: TestPayment },
      { path: "simulation", Component: ScenarioSelect },
      { path: "simulation/play", Component: Simulation },
      { path: "simulation/:scenarioId", Component: Simulation },
      { path: "*", Component: NotFound },
    ],
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { path: "dashboard", Component: AdminDashboard },
      { path: "users", Component: AdminUsers },
      { path: "questions", Component: AdminQuestions },
      { path: "payments", Component: AdminPayments },
      { path: "irembo", Component: AdminIremboApplications },
      { path: "resources", Component: AdminResources },
      { path: "notifications", Component: AdminNotifications },
      { path: "fraud-logs", Component: AdminFraudLogs },
      { path: "*", Component: () => <div className="p-8 text-center">Page coming soon...</div> },
    ],
  },
]);
