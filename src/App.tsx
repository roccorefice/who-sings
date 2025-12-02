import { Routes, Route, Navigate } from "react-router-dom";
import { useGameStore } from "./contexts/useGameStore";
import { Login } from "./pages/Login";
import { Game } from "./pages/Game";
import { Leaderboard } from "./pages/Leaderboard";
import type { JSX } from "react";


function RequirePlayer({ children }: { children: JSX.Element }) {
  const playerName = useGameStore((s) => s.playerName);
  if (!playerName) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/game"
          element={
            <RequirePlayer>
              <Game />
            </RequirePlayer>
          }
        />

        <Route
          path="/leaderboard"
          element={
            <RequirePlayer>
              <Leaderboard />
            </RequirePlayer>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
  );
}

export default App;
