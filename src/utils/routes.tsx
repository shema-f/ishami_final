import { createBrowserRouter, Navigate } from "react-router";
import { lazy } from "react";
import Root from "../components/Root";
import AdminLayout from "../components/AdminLayout";

// Eagerly load Home (the landing page users see first)
import Home from "../pages/Home";

// Lazy-load everything else — code-split into separate chunks
const AIAssistant = lazy(() => import("../pages/AIAssistant"));
const Quiz = lazy(() => import("../pages/Quiz"));
const Resources = lazy(() => import("../pages/Resources"));
const Leaderboard = lazy(() => import("../pages/Leaderboard"));
const Auth = lazy(() => import("../pages/Auth"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));
const Irembo = lazy(() => import("../pages/Irembo"));
const NotFound = lazy(() => import("../pages/NotFound"));
const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"));
const Terms = lazy(() => import("../pages/Terms"));
const CookiePolicy = lazy(() => import("../pages/CookiePolicy"));
const Profile = lazy(() => import("../pages/Profile"));
const Certificate = lazy(() => import("../pages/Certificate"));
const TestPayment = lazy(() => import("../pages/TestPayment"));
const Simulation = lazy(() => import("../pages/Simulation"));
const ScenarioSelect = lazy(() => import("../simulation/ui/ScenarioSelect"));
const SharedChat = lazy(() => import("../pages/SharedChat"));
const Blog = lazy(() => import("../pages/Blog"));
const Bookmarks = lazy(() => import("../pages/Bookmarks"));
const Notifications = lazy(() => import("../pages/Notifications"));

// Admin Pages
const AdminDashboard = lazy(() => import("../pages/admin/Dashboard"));
const AdminUsers = lazy(() => import("../pages/admin/Users"));
const AdminQuestions = lazy(() => import("../pages/admin/Questions"));
const AdminPayments = lazy(() => import("../pages/admin/Payments"));
const AdminIremboApplications = lazy(() => import("../pages/admin/IremboApplications"));
const AdminResources = lazy(() => import("../pages/admin/Resources"));
const AdminArticles = lazy(() => import("../pages/admin/Articles"));
const AdminAnalytics = lazy(() => import("../pages/admin/Analytics"));
const AdminNotifications = lazy(() => import("../pages/admin/Notifications"));
const AdminFraudLogs = lazy(() => import("../pages/admin/FraudLogs"));
const AdminApiKeys = lazy(() => import("../pages/admin/ApiKeys"));
const ApiDocs = lazy(() => import("../pages/ApiDocs"));
const Developers = lazy(() => import("../pages/Developers"));

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
      { path: "shared/:token", Component: SharedChat },
      { path: "blog", Component: Blog },
      { path: "blog/:slug", Component: Blog },
      { path: "blog/bookmarks", Component: Bookmarks },
      { path: "blog/notifications", Component: Notifications },
      { path: "api-docs", Component: ApiDocs },
      { path: "developers", Component: Developers },
      { path: "*", Component: NotFound },
    ],
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: "dashboard", Component: AdminDashboard },
      { path: "users", Component: AdminUsers },
      { path: "questions", Component: AdminQuestions },
      { path: "payments", Component: AdminPayments },
      { path: "irembo", Component: AdminIremboApplications },
      { path: "resources", Component: AdminResources },
      { path: "articles", Component: AdminArticles },
      { path: "analytics", Component: AdminAnalytics },
      { path: "notifications", Component: AdminNotifications },
      { path: "fraud-logs", Component: AdminFraudLogs },
      { path: "api-keys", Component: AdminApiKeys },
      { path: "*", Component: () => <div className="p-8 text-center">Page coming soon...</div> },
    ],
  },
]);
