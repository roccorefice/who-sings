import { useNavigate } from "react-router-dom";
import { useGameStore } from "../contexts/useGameStore";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { GameList } from "../components/GameList";

export function Profile() {
    const navigate = useNavigate();
    const playerName = useGameStore((s) => s.playerName);
    const history = useGameStore((s) => s.history);
    const logout = useGameStore((s) => s.logout);

    const myGames = history.filter((game) => game.playerName === playerName);

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
                <div className="flex items-center justify-between">
                    <div className="w-1/2 justify-start">
                        <h1 className="text-3xl font-bold text-mmx-orange">Profile</h1>
                    </div>
                    <div className="flex gap-2 w-1/2 justify-end self-start">
                        <Button onClick={() => navigate("/leaderboard")} variant="secondary" size="sm">
                            Back
                        </Button>
                        <Button onClick={handleLogout} variant="ghost" size="sm">
                            Logout
                        </Button>
                    </div>
                </div>

                <Card className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center space-y-2">
                        <p className="text-4xl font-bold text-mmx-orange">{totalGames}</p>
                        <p className="text-sm text-gray-400">Games played</p>
                    </div>
                    <div className="text-center space-y-2">
                        <p className="text-4xl font-bold text-mmx-orange">{bestScore}</p>
                        <p className="text-sm text-gray-400">Best score</p>
                    </div>
                    <div className="text-center space-y-2">
                        <p className="text-4xl font-bold">{avgScore}</p>
                        <p className="text-sm text-gray-400">Avg score</p>
                    </div>
                    <div className="text-center space-y-2">
                        <p className="text-4xl font-bold">{avgAccuracy}%</p>
                        <p className="text-sm text-gray-400">Avg accuracy</p>
                    </div>
                </Card>

                <div className="flex gap-3">
                    <Button onClick={() => navigate("/leaderboard")} variant="secondary" className="flex-1">
                        View leaderboard
                    </Button>
                    <Button onClick={() => navigate("/game")} className="flex-1">
                        Play new game
                    </Button>
                </div>

                <Card padding="sm" className="max-h-[70vh] overflow-y-auto w-full mx-auto md:w-1/2 md:min-w-[600px] pt-0 mmx-scroll">
                    <h2 className="text-md flex items-center gap-2 sticky top-0 bg-mmx-card py-4">
                        <span>📊</span>
                        <span>Your game history</span>
                    </h2>
                    <GameList games={myGames} variant="myGames" />
                </Card>

            </div >
        </div >
    );
}