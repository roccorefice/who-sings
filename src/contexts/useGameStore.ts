import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { QuizQuestion } from "../models/Quiz";

type GameStatus = "inactive" | "loading" | "inProgress" | "finished";

export interface PlayedGame {
  id: string;
  date: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
}

interface GameState {
  playerName: string;
  score: number;
  currentQuestionIndex: number;
  status: GameStatus;
  history: PlayedGame[];
  questions: QuizQuestion[];
  correctAnswers: number;
}

interface GameActions {
  setPlayerName: (name: string) => void;
  setQuestions: (questions: QuizQuestion[]) => void;
  setStatus: (status: GameStatus) => void;
  startGame: () => void;
  addScore: (points: number) => void;
  incrementCorrectAnswers: () => void;
  nextQuestion: () => void;
  finishGame: () => void;
  resetGame: () => void;
  logout: () => void;
}

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      // STATE
      playerName: "",
      score: 0,
      currentQuestionIndex: 0,
      status: "inactive",
      history: [],
      questions: [],
      correctAnswers: 0,

      // ACTIONS
      setPlayerName: (name) => set({ playerName: name }),
      setQuestions: (questions) => set({ questions }),
      setStatus: (status) => set({ status }),
      startGame: () =>
        set({
          score: 0,
          currentQuestionIndex: 0,
          correctAnswers: 0,
          status: "inProgress",
        }),
      addScore: (points) => set((state) => ({ score: state.score + points })),
      incrementCorrectAnswers: () =>
        set((state) => ({ correctAnswers: state.correctAnswers + 1 })),
      nextQuestion: () =>
        set((state) => ({
          currentQuestionIndex: state.currentQuestionIndex + 1,
        })),
      finishGame: () => {
        const { score, history, questions, correctAnswers } = get();
        const newGame: PlayedGame = {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          score,
          totalQuestions: questions.length,
          correctAnswers,
        };
        set({
          status: "finished",
          history: [newGame, ...history].slice(0, 50),
        });
      },
      resetGame: () =>
        set({
          score: 0,
          currentQuestionIndex: 0,
          correctAnswers: 0,
          questions: [],
          status: "inactive",
        }),
      logout: () =>
        set({
          playerName: "",
          score: 0,
          currentQuestionIndex: 0,
          correctAnswers: 0,
          status: "inactive",
          questions: [],
        }),
    }),
    {
      name: "who-sings-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        playerName: state.playerName,
        history: state.history,
      }),
    }
  )
);