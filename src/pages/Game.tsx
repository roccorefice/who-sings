import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../contexts/useGameStore";
import { Card } from "../components/Card";
import mxm_logo from "../assets/mxm_orange_logo.png";
import ws_logo from "../assets/ws_logo.png";
import { Button } from "../components/Button";
import { generateQuizQuestions } from "../utils/helper";
import { CircularTimer } from "../components/CircularTimer";

export function Game() {
    const navigate = useNavigate();
    const hasLoadedQuestions = useRef(false);

    // Zustand store
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

    const currentQuestion = questions[currentQuestionIndex];
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);


    const TOTAL_QUESTIONS = 5;
    const POINTS_PER_CORRECT = 10;
    const TIME_PER_QUESTION = 20;

    const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
    const timerRef = useRef<number | null>(null);


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

    useEffect(() => {
        if (!questions.length) return;

        setTimeLeft(TIME_PER_QUESTION);

        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        timerRef.current = window.setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [currentQuestionIndex, questions.length, TIME_PER_QUESTION]);

    useEffect(() => {
        if (timeLeft === 0) {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            handleTimeOut();
        }
    }, [timeLeft]);




    const handleTimeOut = () => {
        if (selectedAnswer) return;
        handleNext();
    };


    const handleAnswer = (answer: string) => {
        if (selectedAnswer) return;

        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

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
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
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
                            <Button
                                onClick={() => navigate("/login")}
                                size="md"
                                className="mt-4"
                            >
                                Back to Login
                            </Button>
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
            <div className="w-full h-full short:h-full tall:h-2/3 md:w-1/2 md:min-w-[600px] bg-mmx-card rounded-2xl p-6 shadow-xl space-y-8 relative">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <img
                                src={mxm_logo}
                                alt="Musixmatch"
                                className="w-auto h-6 rounded-md"
                            />
                            <img
                                src={ws_logo}
                                alt="Musixmatch"
                                className="w-auto h-6 rounded-md"
                            />
                        </div>
                    </div>
                    <Button
                        onClick={handleLogout}
                        variant="ghost"
                        size="sm"
                        className="rounded-md"
                    >
                        Log out
                    </Button>
                </div>

                <div>
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-[-16px]">
                        Question {currentQuestionIndex + 1} of {questions.length}
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 h-1 bg-neutral-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-mmx-orange transition-all duration-300"
                                style={{
                                    width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                                }}
                            />
                        </div>

                        <CircularTimer
                            timeLeft={timeLeft}
                            totalTime={TIME_PER_QUESTION}
                            size={56}
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



                <Button
                    onClick={handleNext}
                    disabled={!selectedAnswer}
                    className="absolute bottom-6 left-6 right-6 md:h-16"
                >
                    {currentQuestionIndex < questions.length - 1
                        ? "Next question →"
                        : "Finish game 🏁"}
                </Button>
            </div>
        </div>
    );
}