import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/Card";
import { ArrowRight, RotateCcw, X } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type ResultKey = "strong_fit" | "likely_fit" | "exploratory";

interface Question {
  id: string;
  text: string;
  options: string[];
}

function computeResult(answers: Record<string, number>): ResultKey {
  const q1 = answers.q1;
  const q2 = answers.q2;
  const q3 = answers.q3;

  // Under 10 employees → exploratory regardless
  if (q3 === 0) return "exploratory";

  // Haven't started yet + small company signals → exploratory
  if (q1 === 3 && q3 <= 1) return "exploratory";

  // Strong fit: experienced with AI (tried/piloted/need strategy), clear blocker, right company size
  if (q1 <= 2 && q2 <= 2 && (q3 === 1 || q3 === 2)) return "strong_fit";

  return "likely_fit";
}

export function SelfAssessment() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<ResultKey | null>(null);

  const questions = t("home.selfAssessment.questions", {
    returnObjects: true,
  }) as Question[];

  const handleAnswer = (optionIndex: number) => {
    const question = questions[currentQuestion];
    const newAnswers = { ...answers, [question.id]: optionIndex };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setResult(computeResult(newAnswers));
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
  };

  const handleClose = () => {
    setIsOpen(false);
    handleReset();
  };

  if (!isOpen) {
    return (
      <div className="text-center">
        <Button
          variant="cta-outline"
          size="lg"
          onClick={() => setIsOpen(true)}
        >
          {t("home.selfAssessment.cta")}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card variant="elevated" className="relative">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {result === null ? (
          <>
            {/* Progress */}
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
                <span>{t("home.selfAssessment.headline")}</span>
                <span>
                  {currentQuestion + 1} / {questions.length}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{
                    width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Question */}
            <h3 className="mb-6 text-xl font-semibold text-foreground">
              {questions[currentQuestion].text}
            </h3>

            {/* Options */}
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className={cn(
                    "w-full rounded-lg border border-border p-4 text-left text-sm transition-colors",
                    "hover:border-primary hover:bg-primary/5",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Result */}
            <div className="mb-2">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                {t(`home.selfAssessment.results.${result}.label`)}
              </span>
            </div>

            <h3 className="mb-4 text-2xl font-bold text-foreground">
              {t(`home.selfAssessment.results.${result}.heading`)}
            </h3>

            <p className="mb-8 text-muted-foreground leading-relaxed">
              {t(`home.selfAssessment.results.${result}.body`)}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button variant="cta" size="lg" asChild>
                <Link to="/contact">
                  {t(`home.selfAssessment.results.${result}.cta`)}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={handleReset}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Retake
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
