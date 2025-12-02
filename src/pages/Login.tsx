import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../contexts/useGameStore";
import { Card } from "../components/Card";
import ws_logo from "../assets/ws_logo.png";
import { Button } from "../components/Button";

export function Login() {
  const [name, setName] = useState("");
  const setPlayerName = useGameStore((s) => s.setPlayerName);
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setPlayerName(name.trim());
      navigate("/game");
    }
  };

  return (
    <div className="min-h-screen bg-mmx-bg flex items-center justify-center px-4 w-screen">
      <div className="w-full max-w-md">
        {/* Logo e titolo */}
        <div className="text-center mb-8 space-y-2">
          <img
            src={ws_logo}
            alt="Musixmatch"
            className="w-[260px] h-auto block rounded-2xl m-auto"
          />
          <p className="text-white italic font-semibold text-md mt-0">
            Guess the artist from the lyrics!
          </p>
        </div>

        <Card className="w-[320px] md:w-full m-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm text-white/60 mb-2"
              >
                Enter your name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-mmx-orange focus:border-transparent transition"
                required
                minLength={3}
                maxLength={20}
              />
            </div>

            <Button
              type="submit"
              fullWidth
              disabled={name.trim().length < 3}
            >
              PLAY!
            </Button>
          </form>
        </Card>

        {/* Footer con powered by */}
        <div className="pt-16 text-center">
          <p className="text-xs text-gray-500">
            Powered by{" "}
            <a
              href="https://github.com/roccorefice"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Rocco Orefice
            </a>
          </p>
          <p className="text-xs text-gray-500">
            for a{" "}
            <a
              href="https://www.musixmatch.com/it"
              target="_blank"
              rel="noopener noreferrer"
              className="text-mmx-orange hover:underline"
            >
              Musixmatch
            </a>
            {" "}test
          </p>
        </div>
      </div>
    </div>
  );
}