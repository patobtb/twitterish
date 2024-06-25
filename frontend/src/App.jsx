import { 
  Navigate,
  Route,
  Routes 
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignupPage from "./pages/auth/signup/SignUpPage";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import LoadingSpinner from "./components/common/LoadingSpinner";

function App() {
  const {data: authUser, isLoading} = useQuery({
    queryKey: ["authUser"], // Unique key for the query function to cache the data in localStorage or sessionStorage (if enabled)
    queryFn: async () => {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();

        if (data.error) {
          return null;
        }
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch user");
        }

        console.log("authUser: ", data);
        return data;
      } catch (error) {
        console.error(error.message);
        throw new Error(error);
      }
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg"/>
      </div>
    )
  }

  return (
    <>
    <div className='flex max-w-6xl mx-auto'>
      {/* Common component, because its not wrapped with Routes */}
      {authUser && <Sidebar />}
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
        <Route path="/notifications" element={authUser ? <NotificationPage /> : <Navigate to="/login" />} />
        <Route path="/profile/:userName" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
      {authUser && <RightPanel />}
      <Toaster />
    </div>
    </>
  )
}

export default App
