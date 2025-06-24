import React, { useState, useEffect } from 'react';
import { loadQuestionsFromCSV } from './data/questions';
import { QuizState, Question } from './types/yacht';
import QuizStart from './components/QuizStart';
import QuestionCard from './components/QuestionCard';
import QuizResults from './components/QuizResults';
import InfiniteStats from './components/InfiniteStats';
import FeedbackModal from './components/FeedbackModal';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

function App() {
    const [quizState, setQuizState] = useState<QuizState>({
        currentQuestion: 0,
        score: 0,
        answers: [],
        isComplete: false,
        timeStarted: 0,
        isInfiniteMode: false,
        totalQuestions: 0,
        correctStreak: 0,
    });
    const [quizMode, setQuizMode] = useState<'standard' | 'infinite' | null>(null);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [infiniteStats, setInfiniteStats] = useState({ score: 0, totalAnswered: 0, correctStreak: 0 });

    const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
    const [lastAnswerWasCorrect, setLastAnswerWasCorrect] = useState(false);
    const [currentQuestionExplanation, setCurrentQuestionExplanation] = useState<string | undefined>(undefined);

    const [allQuestions, setAllQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            const questionsData = await loadQuestionsFromCSV();
            setAllQuestions(questionsData);
            setIsLoading(false);
        };

        fetchQuestions();
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (quizMode && !quizState.isComplete) {
            interval = setInterval(() => {
                setTimeElapsed(Math.floor((Date.now() - quizState.timeStarted) / 1000));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [quizMode, quizState.isComplete, quizState.timeStarted]);

    const startQuiz = (mode: 'standard' | 'infinite') => {
        setQuizMode(mode);
        let newQuestions = shuffleArray(allQuestions);

        if (mode === 'standard') {
            newQuestions = newQuestions.slice(0, 20);
        }

        setQuestions(newQuestions);
        const isInfinite = mode === 'infinite';

        setQuizState({
            currentQuestion: 0,
            score: 0,
            answers: isInfinite ? [] : new Array(newQuestions.length).fill(null),
            isComplete: false,
            timeStarted: Date.now(),
            isInfiniteMode: isInfinite,
            totalQuestions: isInfinite ? 0 : newQuestions.length,
            correctStreak: 0,
        });

        if (isInfinite) {
            setInfiniteStats({ score: 0, totalAnswered: 0, correctStreak: 0 });
        }
        setTimeElapsed(0);
    };

    const handleAnswer = (answer: string | string[] | number | number[]) => {
        if (quizMode === 'standard') {
            const newAnswers = [...quizState.answers];
            newAnswers[quizState.currentQuestion] = answer;
            setQuizState(prev => ({ ...prev, answers: newAnswers }));
        } else if (quizMode === 'infinite') {
            const currentQuestion = questions[quizState.currentQuestion];
            const isCorrect = JSON.stringify(answer) === JSON.stringify(currentQuestion.correctAnswer);

            let explanation = currentQuestion.explanation;

            if (!isCorrect) {
                if (currentQuestion.type === 'ordering' && currentQuestion.orderItems && Array.isArray(currentQuestion.correctAnswer)) {
                    const correctOrder = (currentQuestion.correctAnswer as number[]).map(index => currentQuestion.orderItems![index]).join(' → ');
                    explanation = `The correct order was: ${correctOrder}. ${explanation || ''}`;
                } else if (currentQuestion.type === 'cloze' && currentQuestion.clozeText && Array.isArray(currentQuestion.correctAnswer)) {
                    let filledText = currentQuestion.clozeText;
                    (currentQuestion.correctAnswer as string[]).forEach(word => {
                        filledText = filledText.replace('[BLANK]', `${word}`);
                    });
                    explanation = `Correct answer: ${filledText}. ${explanation || ''}`;
                } else if (currentQuestion.type === 'matching' && currentQuestion.matchingPairs) {
                    const correctPairs = currentQuestion.matchingPairs.map(pair => `${pair.left} → ${pair.right}`).join(', ');
                    explanation = `The correct matches were: ${correctPairs}. ${explanation || ''}`;
                }
            }

            setInfiniteStats(prev => ({
                score: isCorrect ? prev.score + 1 : prev.score,
                totalAnswered: prev.totalAnswered + 1,
                correctStreak: isCorrect ? prev.correctStreak + 1 : 0
            }));

            setLastAnswerWasCorrect(isCorrect);
            setCurrentQuestionExplanation(explanation);
            setShowAnswerFeedback(true);
        }
    };

    const handleNextQuestion = () => {
        setShowAnswerFeedback(false);
        nextQuestion();
    };

    const nextQuestion = () => {
        if (quizMode === 'standard') {
            if (quizState.currentQuestion < questions.length - 1) {
                setQuizState(prev => ({ ...prev, currentQuestion: prev.currentQuestion + 1 }));
            } else {
                finishQuiz();
            }
        } else if (quizMode === 'infinite') {
            const nextIndex = (quizState.currentQuestion + 1) % questions.length;
            if (nextIndex === 0) {
                // Reshuffle when we loop back to the start
                setQuestions(shuffleArray(questions));
            }
            setQuizState(prev => ({
                ...prev,
                currentQuestion: nextIndex
            }));
        }
    };

    const previousQuestion = () => {
        if (quizMode === 'standard' && quizState.currentQuestion > 0) {
            setQuizState(prev => ({ ...prev, currentQuestion: prev.currentQuestion - 1 }));
        }
    };

    const finishQuiz = () => {
        let score = 0;
        questions.forEach((question, index) => {
            if (JSON.stringify(quizState.answers[index]) === JSON.stringify(question.correctAnswer)) {
                score++;
            }
        });
        setQuizState(prev => ({ ...prev, score, isComplete: true }));
    };

    const restartQuiz = () => {
        setQuizMode(null);
        setQuizState({
            currentQuestion: 0,
            score: 0,
            answers: [],
            isComplete: false,
            timeStarted: 0,
            isInfiniteMode: false,
            totalQuestions: 0,
            correctStreak: 0,
        });
        setTimeElapsed(0);
    };

    const stopInfiniteMode = () => restartQuiz();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
                <div className="text-xl font-semibold text-gray-700">Loading questions...</div>
            </div>
        );
    }

    if (!quizMode) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
                <QuizStart onStart={startQuiz} totalQuestions={allQuestions.length} isLoading={isLoading} />
            </div>
        );
    }

    if (quizState.isComplete && quizMode === 'standard') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
                <QuizResults
                    score={quizState.score}
                    totalQuestions={questions.length}
                    timeElapsed={timeElapsed}
                    questions={questions}
                    userAnswers={quizState.answers}
                    onRestart={restartQuiz}
                />
            </div>
        );
    }

    const currentQuestion = questions[quizState.currentQuestion];
    const hasAnswer = quizMode === 'standard' && quizState.answers[quizState.currentQuestion] !== null && quizState.answers[quizState.currentQuestion] !== undefined;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
            <div className="max-w-6xl mx-auto">
                {quizMode === 'infinite' && (
                    <InfiniteStats {...infiniteStats} timeElapsed={timeElapsed} />
                )}
                {currentQuestion && (
                    <div className="mb-6">
                        <QuestionCard
                            question={currentQuestion}
                            questionNumber={quizMode === 'standard' ? quizState.currentQuestion + 1 : infiniteStats.totalAnswered + 1}
                            totalQuestions={quizMode === 'standard' ? questions.length : undefined}
                            onAnswer={handleAnswer}
                            userAnswer={quizMode === 'standard' ? quizState.answers[quizState.currentQuestion] : undefined}
                            isInfiniteMode={quizMode === 'infinite'}
                        />
                    </div>
                )}

                <div className={`flex items-center max-w-4xl mx-auto ${quizMode === 'standard' ? 'justify-between' : 'justify-center'}`}>
                    {quizMode === 'standard' ? (
                        <>
                            <button
                                onClick={previousQuestion}
                                disabled={quizState.currentQuestion === 0}
                                className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${quizState.currentQuestion === 0
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg'
                                    }`}>
                                <ChevronLeft className="w-5 h-5 mr-2" />
                                Previous
                            </button>

                            <div className="text-center">
                                <div className="text-sm text-gray-500 mb-1">Time Elapsed</div>
                                <div className="text-lg font-semibold text-gray-700">
                                    {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
                                </div>
                            </div>

                            <button
                                onClick={nextQuestion}
                                disabled={!hasAnswer}
                                className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${!hasAnswer
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : quizState.currentQuestion === questions.length - 1
                                            ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg'
                                            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg'
                                    }`}>
                                {quizState.currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next'}
                                <ChevronRight className="w-5 h-5 ml-2" />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={stopInfiniteMode}
                            className="flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg">
                            <X className="w-5 h-5 mr-2" />
                            End Run
                        </button>
                    )}
                </div>
            </div>
            <FeedbackModal
                show={showAnswerFeedback}
                isCorrect={lastAnswerWasCorrect}
                explanation={currentQuestionExplanation}
                onNext={handleNextQuestion}
            />
        </div>
    );
}

export default App;