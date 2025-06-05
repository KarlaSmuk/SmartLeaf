import { Routes, Route } from "react-router-dom";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import PlantDetailPage from "./pages/PlantDetailPage";

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/plant/:id" element={<PlantDetailPage />} />
      </Route>
    </Routes>
  );
}

export default App;
