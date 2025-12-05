import type { Game } from "../models/Game";

type GameListProps = {
  games: Game[];
  variant: "leaderboard" | "myGames";
  lastGameId?: string | null;
};

export function GameList({ games, variant, lastGameId }: GameListProps) {
  if (!games.length) {
    return (
      <p className="text-center text-gray-400 py-8">
        No games played yet. Start your first game!
      </p>
    );
  }

  const sortedGames =
    variant === "leaderboard"
      ? [...games].sort((a, b) => b.score - a.score)
      : [...games].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

  return (
    <div className={variant === "leaderboard" ? "space-y-2" : "space-y-3"}>
      {sortedGames.map((game, index) => {
        const isLastGame =
          variant === "leaderboard" &&
          games.length > 1 &&
          lastGameId &&
          game.id === lastGameId;

        const accuracy = Math.round(
          (game.correctAnswers / game.totalQuestions) * 100
        );

        const rank =
          variant === "leaderboard"
            ? index + 1
            : games.length - index;

        return (
          <div
            key={game.id}
            className={`flex items-center justify-between p-4 rounded-xl bg-black/40 border transition ${
              isLastGame
                ? "border-mmx-orange border-2"
                : "border-neutral-800 hover:border-neutral-700"
            }`}
          >
            <div className="flex items-center gap-4">
              {variant === "leaderboard" ? (
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    index === 0
                      ? "bg-mmx-orange text-white"
                      : "bg-neutral-800 text-gray-400"
                  }`}
                >
                  {rank}
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-mmx-orange/10 flex items-center justify-center">
                  <span className="text-xl font-bold text-mmx-orange">
                    #{rank}
                  </span>
                </div>
              )}

              <div>
                {variant === "leaderboard" && game.playerName && (
                  <span className="block text-md text-gray-300 mb-1 uppercase">
                    <span className="font-medium">{game.playerName}</span>
                  </span>
                )}

                {variant === "leaderboard" ? (
                  <>
                    <span className="block text-sm text-gray-300 font-medium">
                      {new Date(game.date).toLocaleDateString("it-IT", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-gray-300">
                      {new Date(game.date).toLocaleDateString("it-IT", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(game.date).toLocaleTimeString("it-IT", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="block text-md md:text-lg font-bold text-mmx-orange">
                {game.score} pts
              </span>

              {variant === "leaderboard" ? (
                <>
                  <span className="pt-2 block text-sm text-gray-300/70">
                    {accuracy}% accuracy
                  </span>
                  <span className="pt-1 block text-sm text-gray-300/70">
                    {game.correctAnswers}/{game.totalQuestions} correct
                  </span>
                </>
              ) : (
                <p className="text-xs text-gray-400">
                  {game.correctAnswers}/{game.totalQuestions} correct • {accuracy}%
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
