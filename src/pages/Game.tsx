import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../contexts/useGameStore";
import { generateQuizQuestions } from "../services/mxm";
import { Card } from "../components/Card";
import mxm_logo from "../assets/mxm_orange_logo.png";
import ws_logo from "../assets/ws_logo.png";

const TOTAL_QUESTIONS = 5;
const POINTS_PER_CORRECT = 10;

export function Game() {
    const navigate = useNavigate();
    const hasLoadedQuestions = useRef(false);

    // Zustand store
    const score = useGameStore((s) => s.score);
    const status = useGameStore((s) => s.status);
    const questions = useGameStore((s) => s.questions);
    const currentQuestionIndex = useGameStore((s) => s.currentQuestionIndex);
    const addScore = useGameStore((s) => s.addScore);
    const incrementCorrectAnswers = useGameStore((s) => s.incrementCorrectAnswers);
    const resetGame = useGameStore((s) => s.resetGame);
    const startGame = useGameStore((s) => s.startGame);
    const nextQuestion = useGameStore((s) => s.nextQuestion);
    const finishGame = useGameStore((s) => s.finishGame);
    const setQuestions = useGameStore((s) => s.setQuestions);
    const setStatus = useGameStore((s) => s.setStatus);

    // Local state
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Carica domande all'inizio (solo una volta)
    useEffect(() => {
        if (hasLoadedQuestions.current) return;
        hasLoadedQuestions.current = true;

        const loadQuestions = async () => {
            try {
                setStatus("loading");
                setError(null);
                const quizQuestions = await generateQuizQuestions(TOTAL_QUESTIONS, "us");

                if (quizQuestions.length < TOTAL_QUESTIONS) {
                    throw new Error(`Only ${quizQuestions.length} questions available`);
                }

                setQuestions(quizQuestions);
                startGame();
            } catch (error) {
                console.error("Error loading questions:", error);
                setError(error instanceof Error ? error.message : "Failed to load questions");
                setStatus("inactive");
            }
        };

        loadQuestions();
    }, []);

    const currentQuestion = questions[currentQuestionIndex];

    const handleAnswer = (answer: string) => {
        if (selectedAnswer) return; // Già risposto

        setSelectedAnswer(answer);
        const correct = answer === currentQuestion.correctArtist;
        setIsCorrect(correct);

        if (correct) {
            addScore(POINTS_PER_CORRECT);
            incrementCorrectAnswers();
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            nextQuestion();
            setSelectedAnswer(null);
            setIsCorrect(null);
        } else {
            finishGame();
            navigate("/leaderboard");
        }
    };

    const handleLogout = () => {
        resetGame();
        navigate("/login");
    };

    // Loading state
    if (status === "loading" || questions.length === 0) {
        return (
            <div className="min-h-screen w-screen bg-mmx-bg text-white flex items-center justify-center px-4">
                <div className="text-center space-y-4">
                    {error ? (
                        <>
                            <div className="text-red-500 text-5xl mb-4">⚠️</div>
                            <p className="text-xl font-semibold text-red-400">{error}</p>
                            <button
                                onClick={() => navigate("/login")}
                                className="mt-4 px-6 py-2 rounded-xl bg-mmx-orange text-white font-medium hover:brightness-110 transition"
                            >
                                Back to Login
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-mmx-orange border-t-transparent mx-auto" />
                            <p className="text-gray-400">Loading questions...</p>
                        </>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-mmx-bg text-white flex items-center justify-center p-4 w-screen">
            <div className="w-full h-full md:h-2/3 md:w-1/2 md:min-w-[600px] bg-mmx-card rounded-2xl p-6 shadow-xl space-y-8 relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <img
                                src={mxm_logo}
                                alt="Musixmatch"
                                className="w-fit h-6 rounded-md"
                            />
                            <img
                                src={ws_logo}
                                alt="Musixmatch"
                                className="w-fit h-6 rounded-md"
                            />
                        </div>
                    </div>
                    <button
                        className="px-3 py-1 text-sm rounded-md bg-black/50 hover:bg-neutral-700 transition"
                        onClick={handleLogout}
                    >
                        Log out
                    </button>
                </div>

                {/* Progress */}
                <div>
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                        <span>
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </span>
                        <span>Score: {score}</span>
                    </div>
                    <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-mmx-orange transition-all duration-300"
                            style={{
                                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                            }}
                        />
                    </div>
                </div>

                {/* Lyric snippet */}
                <Card className="p-0 gap-y-2 grid ">
                    <p className="text-lg font-medium text-center leading-relaxed italic">
                        "{currentQuestion.snippet}"
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 text-center w-full">
                            Song: {currentQuestion.trackName}
                        </span>
                    </div>
                </Card>

                {/* Answer options */}
                <div className="space-y-3">
                    {currentQuestion.options.map((option) => {
                        const isSelected = selectedAnswer === option;
                        const isCorrectAnswer = option === currentQuestion.correctArtist;
                        const showResult = selectedAnswer !== null;

                        let buttonClass =
                            "w-full text-left px-4 py-3 rounded-xl border transition-all ";

                        if (!showResult) {
                            buttonClass +=
                                "border-neutral-700 bg-black/40 hover:border-mmx-orange hover:bg-black/60";
                        } else if (isCorrectAnswer) {
                            buttonClass +=
                                "border-green-500 bg-green-500/20 font-medium";
                        } else if (isSelected && !isCorrect) {
                            buttonClass +=
                                "border-red-500 bg-red-500/20 font-medium";
                        } else {
                            buttonClass += "border-neutral-700 bg-black/20 opacity-50";
                        }

                        return (
                            <button
                                key={option}
                                className={buttonClass}
                                disabled={selectedAnswer !== null}
                                onClick={() => handleAnswer(option)}
                            >
                                <span className="flex items-center justify-between">
                                    <span>{option}</span>
                                    {showResult && isCorrectAnswer && (
                                        <span className="text-green-500 text-xl">✓</span>
                                    )}
                                    {showResult && isSelected && !isCorrect && (
                                        <span className="text-red-500 text-xl">✗</span>
                                    )}
                                </span>
                            </button>
                        );
                    })}
                </div>

                

                {/* Next button */}
                <button
                    className="w-auto absolute bottom-6 left-6 right-6 h-auto md:h-16 py-3 rounded-xl bg-mmx-orange text-white font-medium hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    onClick={handleNext}
                    disabled={!selectedAnswer}
                >
                    {currentQuestionIndex < questions.length - 1
                        ? "Next Question →"
                        : "Finish Game 🏁"}
                </button>
            </div>
        </div>
    );
}