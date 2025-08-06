import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TrackingPage from "./pages/TrackingPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { TrackingProvider } from "./context/TrackingContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <TrackingProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route
                  path="/tracking/:trackingId?"
                  element={<TrackingPage />}
                />
                <Route path="/login" element={<LoginPage />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </TrackingProvider>
    </AuthProvider>
  );
}

export default App;
