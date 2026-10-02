import { Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { ComingSoon } from "./pages/ComingSoon";
import { Dashboard } from "./pages/Dashboard";
import { MeetingDetail } from "./pages/MeetingDetail";
import { SharedMeeting } from "./pages/SharedMeeting";

export default function App() {
  return (
    <Routes>
      <Route path="/shared/:token" element={<SharedMeeting />} />
      <Route element={<AppShell />}>
        <Route index element={<Dashboard />} />
        <Route path="/calls/:id" element={<MeetingDetail />} />
        <Route path="/team-calls" element={<ComingSoon title="Team Calls" />} />
        <Route path="/playlists" element={<ComingSoon title="Playlists" />} />
        <Route path="/alerts" element={<ComingSoon title="Alerts" />} />
        <Route path="/deals" element={<ComingSoon title="Deals" />} />
        <Route path="*" element={<ComingSoon title="Page not found" />} />
      </Route>
    </Routes>
  );
}
