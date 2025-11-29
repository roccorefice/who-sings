import { useNavigate } from "react-router-dom";
import { useGameStore } from "../contexts/useGameStore";

export function Leaderboard() {
  const navigate = useNavigate();
  const playerName = useGameStore((s) => s.playerName);
  const history = useGameStore((s) => s.history);
  const logout = useGameStore((s) => s.logout);

  const lastGame = history[0];

  const handlePlayAgain = () => {
    navigate("/game");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-mmx-bg text-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl space-y-6">
        {/* Last game result */}
        {lastGame && (
          <div className="bg-mmx-card rounded-2xl p-8 shadow-xl text-center space-y-4">
            <h1 className="text-3xl font-bold text-mmx-orange">Game Over!</h1>
            <p className="text-gray-400">Great job, {playerName}! 🎵</p>

            <div className="grid grid-cols-3 gap-4 py-6">
              <div className="space-y-1">
                <p className="text-3xl font-bold text-mmx-orange">
                  {lastGame.score}
                </p>
                <p className="text-sm text-gray-400">Points</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold">
                  {lastGame.correctAnswers}/{lastGame.totalQuestions}
                </p>
                <p className="text-sm text-gray-400">Correct</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold">
                  {Math.round(
                    (lastGame.correctAnswers / lastGame.totalQuestions) * 100
                  )}
                  %
                </p>
                <p className="text-sm text-gray-400">Accuracy</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePlayAgain}
                className="flex-1 py-3 rounded-xl bg-mmx-orange text-white font-medium hover:brightness-110 transition"
              >
                Play Again 🎮
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-3 rounded-xl bg-neutral-800 text-white font-medium hover:bg-neutral-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Game history */}
        <div className="bg-mmx-card rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>🏆</span>
            <span>Your Game History</span>
          </h2>

          {history.length === 0 ? (
            <p className="text-center text-gray-400 py-8">
              No games played yet. Start your first game!
            </p>
          ) : (
            <div className="space-y-2">
              {history.map((game, index) => (
                <div
                  key={game.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-neutral-800 hover:border-neutral-700 transition"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0
                          ? "bg-mmx-orange text-white"
                          : "bg-neutral-800 text-gray-400"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {new Date(game.date).toLocaleDateString("it-IT", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-xs text-gray-400">
                        {game.correctAnswers}/{game.totalQuestions} correct
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-mmx-orange">
                      {game.score} pts
                    </p>
                    <p className="text-xs text-gray-400">
                      {Math.round(
                        (game.correctAnswers / game.totalQuestions) * 100
                      )}
                      % accuracy
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}