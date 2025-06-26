import { Suspense, lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";

// layouts
import DashboardLayout from "../layouts/dashboard";
import MainLayout from "../layouts/main/index";
// config
import { DEFAULT_PATH } from "../config";
import LoadingScreen from "../components/LoadingScreen";

const Loadable = (Component) => (props) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: "/auth",
      element: <MainLayout />,
      children: [
        { element: <LoginPage />, path: "login" },
        { path: "register", element: <RegisterPage /> },
        { path: "reset-password", element: <ResetPasswordPage /> },
        { path: "new-password", element: <NewPasswordPage /> },
        { path: "verify-otp", element: <VerifyPage /> }
      ]
    },
    {
      path: "/",
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to={DEFAULT_PATH} replace />, index: true },
        { path: "chat", element: <GeneralApp /> },
        { path: "settings", element: <Settings /> },
        { path: "progress", element: <ProgressDashboard /> },
        { path: "kid", element: <Kid /> },
        { path: "game", element: <Game /> },
        { path: "mathgame", element: <MathGame /> },
        { path: "englishgame", element: <EnglishGame /> },
        { path: "store", element: <Store /> },
        { path: "course", element: <Course /> },
        { path: "slide/:slideId", element: <Slide /> },
        { path: "app", element: <LearningHub /> },
        { path: "leaderboard", element: <Leaderboard /> },
        { path: "dailyquest", element: <DailyQuests /> },
        { path: "videolesson", element: <VideoLesson /> },
        { path: "social", element: <Social /> },
        { path: "group", element: <GroupPage /> },
        { path: "call", element: <CallPage /> },
        { path: "notification", element: <Notification /> },
        { path: "profile", element: <ProfilePage /> },
        { path: "parent-dashboard", element: <ParentDashboard /> },
        { path: "teacher-dashboard", element: <TeacherDashboard /> },
        { path: "404", element: <Page404 /> },
        { path: "*", element: <Navigate to="/404" replace /> },
      ],
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}

const LoginPage = Loadable(lazy(() => import("../pages/auth/Login")));
const RegisterPage = Loadable(lazy(() => import("../pages/auth/Register")));
const ResetPasswordPage = Loadable(lazy(() => import("../pages/auth/ResetPassword")));
const Settings = Loadable(lazy(() => import("../pages/dashboard/Settings")));
const CallPage = Loadable(lazy(() => import("../pages/dashboard/Call")))
const Kid = Loadable(lazy(() => import("../pages/learning/KidsOverUI")))
const GeneralApp = Loadable(lazy(() => import("../pages/dashboard/GeneralApp")))
const Game = Loadable(lazy(() => import("../pages/game/GameCenter")))
const Course = Loadable(lazy(() => import("../pages/learning/GenerateCourse")))
const Slide = Loadable(lazy(() => import("../pages/learning/Slideshow")))
const Store = Loadable(lazy(() => import("../pages/game/VirtualStore")))
const Leaderboard = Loadable(lazy(() => import("../pages/learning/LeaderBoard")))
const MathGame = Loadable(lazy(() => import("../pages/game/MathGame")))
const EnglishGame = Loadable(lazy(() => import("../pages/game/EnglishGame")))
const DailyQuests = Loadable(lazy(() => import("../pages/learning/DailyQuets")))
const VideoLesson = Loadable(lazy(() => import("../pages/learning/VideoLesson")))
const Social = Loadable(lazy(() => import("../pages/dashboard/SocialFeed")))
const LearningHub = Loadable(lazy(() => import("../pages/learning/LearningHub")))
const GroupPage = Loadable(lazy(() => import("../pages/dashboard/Group")))
const ProfilePage = Loadable(lazy(() => import("../pages/dashboard/Profile")))
const ParentDashboard = Loadable(lazy(() => import("../pages/dashboard/ParentDashboard")))
const TeacherDashboard = Loadable(lazy(() => import("../pages/dashboard/TeacherPortal")));
const NewPasswordPage = Loadable(lazy(() => import("../pages/auth/NewPassword")));
const VerifyPage = Loadable(lazy(() => import("../pages/auth/Verify")));
const Notification = Loadable(lazy(() => import("../pages/learning/Notification")));
const Page404 = Loadable(lazy(() => import("../pages/Page404")));
const ProgressDashboard = Loadable(lazy(() => import("../components/ProgressDashboard")));
