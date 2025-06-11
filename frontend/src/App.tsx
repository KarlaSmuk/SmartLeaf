import { Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import PlantDetailPage from "./pages/PlantDetailPage";
import { useHomeAssistantWebSocket } from "./hooks/useHomeAssistantWebSocket";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { handleAlert } from "./utils/handleAlert";

function App() {
  const { latestAlert } = useHomeAssistantWebSocket();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (latestAlert) {
      handleAlert(
        latestAlert.data.friendly_name ?? "Sensor alert",
        enqueueSnackbar
      );
    }
  }, [latestAlert, enqueueSnackbar]);
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/plant/:id" element={<PlantDetailPage />} />
      </Routes>
    </>
  );
}

export default App;
