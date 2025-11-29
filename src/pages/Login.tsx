import {  useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../contexts/useGameStore";

export function Login() {
  const [name, setName] = useState("");
  const setPlayerName = useGameStore((s) => s.setPlayerName);
  const startGame = useGameStore((s) => s.startGame);
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setPlayerName(name.trim());
    startGame();
    navigate("/game");
  };

  return (
    <div className="min-h-screen bg-mmx-bg text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-mmx-card rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-semibold mb-2">Welcome back</h1>
        <p className="text-sm text-gray-400 mb-6">
          Enter your name to start playing
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              className="w-full rounded-xl bg-black/60 border border-neutral-700 px-3 py-2 outline-none focus:border-mmx-orange focus:ring-1 focus:ring-mmx-orange"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Type your name"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-mmx-orange text-white font-medium hover:brightness-110 transition disabled:opacity-60"
            disabled={!name.trim()}
          >
            Start playing
          </button>
        </form>
      </div>
    </div>
  );
}
