import { useNavigate } from "react-router-dom";
import { useGameStore } from "../contexts/useGameStore";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { GameList } from "../components/GameList";

export function Leaderboard() {
  const navigate = useNavigate();
  const playerName = useGameStore((s) => s.playerName);
  const history = useGameStore((s) => s.history);
  const logout = useGameStore((s) => s.logout);
  const lastGame = history[0];
  const correct = lastGame.correctAnswers;

  let endTitle = "";
  let endSubtitle = "";

  if (correct <= 1) {
    endTitle = "Wow... that was rough!";
    endSubtitle = `Come on, ${playerName}, you can totally do better`;
  } else if (correct <= 3) {
    endTitle = "Not bad, but you can do better!";
    endSubtitle = `You're warming up, ${playerName}. One more round?`;
  } else if (correct === 4) {
    endTitle = "So close to perfection!";
    endSubtitle = `You were one step away, ${playerName}. Go get that 5/5!`;
  } else {
    endTitle = "You're a legend!";
    endSubtitle = `Seriously, ${playerName}, you totally nailed it`;
  }


  const handlePlayAgain = () => {
    navigate("/game");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/profile");
  };


  return (
    <div className="h-screen bg-mmx-bg text-white p-4 short:py-4 tall:py-42 w-screen">
      {/* Last game result */}
      <div className="flex flex-col gap-y-4 h-full justify-center">

        {lastGame && (
          <Card
            padding="sm"
            className="max-h-1/3 flex flex-col gap-y-6 justify-between w-full mx-auto md:w-1/2 md:min-w-[600px]"
          >
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-mmx-orange">{endTitle}</h1>
              <p className="text-gray-400">{endSubtitle}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1 text-center">
                <p className="text-3xl font-bold text-mmx-orange">{lastGame.score}</p>
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

            <div className="flex flex-col gap-3 md:flex-row">
              <Button
                onClick={handlePlayAgain}
                className="w-full md:flex-1"
              >
                Play again
              </Button>

              <div className="flex gap-3 md:w-auto w-full md:flex-none">
                <Button
                  onClick={handleProfile}
                  variant="secondary"
                  className="w-2/3 md:w-auto"
                >
                  Profile
                </Button>

                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-1/3 md:w-auto"
                >
                  Logout
                </Button>
              </div>

            </div>

          </Card>

        )}

        <Card
              padding="sm"
              className="max-h-[70vh] overflow-y-auto w-full mx-auto md:w-1/2 md:min-w-[600px] pt-0 mmx-scroll"
            >
              <h2 className="text-md flex items-center gap-2 sticky top-0 bg-mmx-card py-4">
                <span>🏆</span>
                <span>Top scores</span>
              </h2>

              <GameList
                games={history}
                variant="leaderboard"
                lastGameId={lastGame?.id ?? null}
              />
            </Card>

      </div>
    </div>
  );
}
