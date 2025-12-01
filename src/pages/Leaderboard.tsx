import { useNavigate } from "react-router-dom";
import { useGameStore } from "../contexts/useGameStore";
import { Card } from "../components/Card";

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
    <div className="h-screen bg-mmx-bg text-white p-4 md:py-52 w-screen">
      {/* Last game result */}
      <div className="flex flex-col gap-y-4 h-full justify-center">

        {lastGame && (
          <Card padding="sm" className="!h-1/3 flex flex-col gap-y-6  justify-between w-full mx-auto  md:h-auto md:w-1/2 md:min-w-[600px]">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-mmx-orange">Game Over!</h1>
              <p className="text-gray-400">Great job, {playerName}! 🎵</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1 text-center">
                <p className="text-3xl font-bold text-mmx-orange">
                  {lastGame.score}
                </p>
                <p className="text-sm text-gray-400">Points</p>
              </div>
              <div className="space-y-1 text-center">
                <p className="text-3xl font-bold">
                  {lastGame.correctAnswers}/{lastGame.totalQuestions}
                </p>
                <p className="text-sm text-gray-400">Correct</p>
              </div>
              <div className="space-y-1 text-center">
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
                Play Again
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-3 rounded-xl bg-neutral-800 text-white font-medium hover:bg-neutral-700 transition"
              >
                Logout
              </button>
            </div>
          </Card>
        )}

        {/* Game history */}
        <Card
          padding="sm"
          className="max-h-[70vh] overflow-y-auto w-full mx-auto md:w-1/2 md:min-w-[600px] pt-0 mmx-scroll"
        >
          <h2 className="text-md flex items-center gap-2 sticky top-0 bg-mmx-card py-4">
            <span>🏆</span>
            <span>Top scores</span>
          </h2>

          {history.length === 0 ? (
            <p className="text-center text-gray-400 py-8">
              No games played yet. Start your first game!
            </p>
          ) : (
            <div className="space-y-2">
              {[...history]
                .sort((a, b) => b.score - a.score)
                .map((game, index) => (
                  <div
                    key={game.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-neutral-800 hover:border-neutral-700 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${index === 0
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
                        {Math.round((game.correctAnswers / game.totalQuestions) * 100)}%
                        accuracy
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </Card>

      </div>
    </div>
  );
}

//  { "state": { "playerName": "Rocco", "history": [{ "id": "a735e766-848e-4238-a599-ccec48afdf5a", "date": "2025-12-01T15:13:43.922Z", "score": 20, "totalQuestions": 5, "correctAnswers": 2 }] }, "version": 0 }

// { "state": { "playerName": "Rocco", "history": [{ "id": "a735e766-848e-4238-a599-ccec48afdf5a", "date": "2025-12-01T15:13:43.922Z", "score": 20, "totalQuestions": 5, "correctAnswers": 2 }, { "id": "aef404f8-fea9-4ed4-b964-1c9656671373", "date": "2025-12-01T15:08:24.971Z", "score": 0, "totalQuestions": 5, "correctAnswers": 0 }, { "id": "aef404f8-fea9-4ed4-b964-1c9656671373", "date": "2025-12-01T15:08:24.971Z", "score": 0, "totalQuestions": 5, "correctAnswers": 0 }, { "id": "aef404f8-fea9-4ed4-b964-1c9656671373", "date": "2025-12-01T15:08:24.971Z", "score": 0, "totalQuestions": 5, "correctAnswers": 0 }, { "id": "aef404f8-fea9-4ed4-b964-1c9656671373", "date": "2025-12-01T15:08:24.971Z", "score": 0, "totalQuestions": 5, "correctAnswers": 0 }, { "id": "aef404f8-fea9-4ed4-b964-1c9656671373", "date": "2025-12-01T15:08:24.971Z", "score": 0, "totalQuestions": 5, "correctAnswers": 0 }, { "id": "aef404f8-fea9-4ed4-b964-1c9656671373", "date": "2025-12-01T15:08:24.971Z", "score": 0, "totalQuestions": 5, "correctAnswers": 0 }, { "id": "aef404f8-fea9-4ed4-b964-1c9656671373", "date": "2025-12-01T15:08:24.971Z", "score": 0, "totalQuestions": 5, "correctAnswers": 0 }, { "id": "aef404f8-fea9-4ed4-b964-1c9656671373", "date": "2025-12-01T15:08:24.971Z", "score": 0, "totalQuestions": 5, "correctAnswers": 0 }, { "id": "aef404f8-fea9-4ed4-b964-1c9656671373", "date": "2025-12-01T15:08:24.971Z", "score": 0, "totalQuestions": 5, "correctAnswers": 0 }, { "id": "aef404f8-fea9-4ed4-b964-1c9656671373", "date": "2025-12-01T15:08:24.971Z", "score": 0, "totalQuestions": 5, "correctAnswers": 0 }, { "id": "aef404f8-fea9-4ed4-b964-1c9656671373", "date": "2025-12-01T15:08:24.971Z", "score": 0, "totalQuestions": 5, "correctAnswers": 0 }, { "id": "aef404f8-fea9-4ed4-b964-1c9656671373", "date": "2025-12-01T15:08:24.971Z", "score": 0, "totalQuestions": 5, "correctAnswers": 0 }, { "id": "aef404f8-fea9-4ed4-b964-1c9656671373", "date": "2025-12-01T15:08:24.971Z", "score": 0, "totalQuestions": 5, "correctAnswers": 0 }, { "id": "aef404f8-fea9-4ed4-b964-1c9656671373", "date": "2025-12-01T15:08:24.971Z", "score": 0, "totalQuestions": 5, "correctAnswers": 0 }, { "id": "aef404f8-fea9-4ed4-b964-1c9656671373", "date": "2025-12-01T15:08:24.971Z", "score": 0, "totalQuestions": 5, "correctAnswers": 0 }] }, "version": 0 }