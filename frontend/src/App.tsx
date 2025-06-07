import { Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import PlantDetailPage from "./pages/PlantDetailPage";
import { PushSetup } from "./components/PushSetup";

function App() {
  return (
    <>
      <PushSetup />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/plant/:id" element={<PlantDetailPage />} />
      </Routes>
    </>
  );
}

export default App;
