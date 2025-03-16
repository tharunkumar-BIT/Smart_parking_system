import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import SlotStatus from "./pages/SlotStatus";
import { AuthProvider, useAuth } from "./Authenticator"; // Import AuthProvider
import Loader from "./Loader";

function App() {
  return (
    <Router>
      <AuthProvider>
        <MainRoutes />
      </AuthProvider>
    </Router>
  );
}

function MainRoutes() {
  const { isAuthenticated, loading, logs, userData} = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      {isAuthenticated ? (
        <>
          <Route path="/dashboard" element={<Dashboard logs={logs} userData={userData} />} />
          <Route path="/slotstatus" element={<SlotStatus logs={logs} />} />
        </>
      ) : (
        <Route path="*" element={<Login />} /> // Redirect unauthorized users to login
      )}
    </Routes>
  );
}

export default App;
