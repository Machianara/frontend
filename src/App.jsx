import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLocation,
  Navigate,
} from "react-router-dom";

// Impor Provider
import { LocaleProvider } from "./contexts/LocaleContext";
import { ThemeProvider } from "./contexts/ThemeContext";

// Impor Halaman
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Ticketing from "./Pages/Ticketing";
import Support from "./Pages/Support";
import Predict from "./Pages/Predict";
import ChatAi from "./Pages/ChatAI";
import Settings from "./Pages/Settings";
import AdminPage from "./Pages/AdminPage";

import ChatCopilot from "./components/fragments/chatCopilot";

import SmoothScroll from "./components/fragments/lenis";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

const RootLayout = () => {
  const location = useLocation();
  const path = location.pathname;

  const hideChatPaths = [
    "/chatai",
    "/login",
    "/register",
    "/admin",
    "/settings",
    "/dashboard",
    "/predict",
    "/ticketing",
    "/support",
  ];
  const shouldShowChat = !hideChatPaths.includes(path);

  const disableSmoothScrollPaths = [
    "/dashboard",
    "/admin",
    "/ticketing",
    "/support",
    "/predict",
    "/chatai",
    "/settings",
    "/login",
  ];

  const isSmoothScrollDisabled = disableSmoothScrollPaths.some((p) =>
    path.startsWith(p)
  );

  // Konten Utama
  const content = (
    <>
      <Outlet />
      {shouldShowChat && <ChatCopilot />}
    </>
  );

  if (isSmoothScrollDisabled) {
    return <div className="native-scroll-layout">{content}</div>;
  }

  return <SmoothScroll>{content}</SmoothScroll>;
};

function App() {
  const router = createBrowserRouter([
    {
      element: <RootLayout />,
      children: [
        { path: "/", element: <Home /> }, 
        { path: "/login", element: <Login /> },
        {
          element: <ProtectedRoute />,
          children: [
            { path: "/dashboard", element: <Dashboard /> },
            { path: "/predict", element: <Predict /> },
            { path: "/ticketing", element: <Ticketing /> },
            { path: "/support", element: <Support /> },
            { path: "/chatai", element: <ChatAi /> },
            { path: "/Settings", element: <Settings /> },
            { path: "/admin", element: <AdminPage /> },
          ],
        },
      ],
    },
  ]);

  return (
    <ThemeProvider>
      <LocaleProvider>
        <RouterProvider router={router} />
      </LocaleProvider>
    </ThemeProvider>
  );
}

export default App;
