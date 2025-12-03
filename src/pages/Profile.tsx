import { useNavigate } from "react-router-dom";
import { useGameStore } from "../contexts/useGameStore";
import { Card } from "../components/Card";
import { Button } from "../components/Button";

export function Profile() {
    const navigate = useNavigate();
    const playerName = useGameStore((s) => s.playerName);
    const history = useGameStore((s) => s.history);
    const logout = useGameStore((s) => s.logout);

    // Filtra solo le partite dell'utente corrente
    const myGames = history.filter((game) => game.playerName === playerName);

    // Calcola statistiche
    const totalGames = myGames.length;
    const totalScore = myGames.reduce((sum, game) => sum + game.score, 0);
    const totalCorrect = myGames.reduce((sum, game) => sum + game.correctAnswers, 0);
    const totalQuestions = myGames.reduce((sum, game) => sum + game.totalQuestions, 0);
    const avgScore = totalGames > 0 ? Math.round(totalScore / totalGames) : 0;
    const avgAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    const bestScore = totalGames > 0 ? Math.max(...myGames.map((g) => g.score)) : 0;

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="h-screen bg-mmx-bg text-white p-4  w-screen">
            <div className="flex flex-col gap-y-4 h-full justify-center max-h-1/3 w-full mx-auto md:w-1/2 md:min-w-[600px]">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-mmx-orange">Profile</h1>
                        <p className="text-gray-400 mt-1">Welcome back, {playerName}!</p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={() => navigate("/leaderboard")} variant="secondary" size="md">
                            ← Back
                        </Button>
                        <Button onClick={handleLogout} variant="ghost" size="md">
                            Logout
                        </Button>
                    </div>
                </div>

                {/* Statistics */}
                <Card className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center space-y-2">
                        <p className="text-4xl font-bold text-mmx-orange">{totalGames}</p>
                        <p className="text-sm text-gray-400">Games Played</p>
                    </div>
                    <div className="text-center space-y-2">
                        <p className="text-4xl font-bold text-mmx-orange">{bestScore}</p>
                        <p className="text-sm text-gray-400">Best Score</p>
                    </div>
                    <div className="text-center space-y-2">
                        <p className="text-4xl font-bold">{avgScore}</p>
                        <p className="text-sm text-gray-400">Avg Score</p>
                    </div>
                    <div className="text-center space-y-2">
                        <p className="text-4xl font-bold">{avgAccuracy}%</p>
                        <p className="text-sm text-gray-400">Avg Accuracy</p>
                    </div>
                </Card>

                <div className="flex gap-3">
                    <Button onClick={() => navigate("/leaderboard")} variant="secondary" className="flex-1">
                        View Leaderboard
                    </Button>
                    <Button onClick={() => navigate("/game")} className="flex-1">
                        Play New Game
                    </Button>
                </div>

                <Card padding="sm" className="max-h-[60vh] overflow-y-auto mmx-scroll pt-0">

                    <h2 className="text-md flex items-center gap-2 sticky top-0 bg-mmx-card py-4">
                        <span>📊</span>
                        <span>Your Game History</span>
                    </h2>

                    {myGames.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-400 mb-4">No games played yet!</p>
                            <Button onClick={() => navigate("/game")}>Start Your First Game</Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {myGames
                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .map((game, index) => (
                                    <div
                                        key={game.id}
                                        className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-neutral-800 hover:border-neutral-700 transition"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-mmx-orange/10 flex items-center justify-center">
                                                <span className="text-xl font-bold text-mmx-orange">
                                                    #{myGames.length - index}
                                                </span>
                                            </div>
                                            <div>
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
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-lg font-bold text-mmx-orange">{game.score} pts</p>
                                            <p className="text-xs text-gray-400">
                                                {game.correctAnswers}/{game.totalQuestions} correct •{" "}
                                                {Math.round((game.correctAnswers / game.totalQuestions) * 100)}%
                                            </p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </Card>


            </div >
        </div >
    );
}