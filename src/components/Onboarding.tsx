import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import appLogo from "@/assets/app-logo.png";

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "hi", name: "हिंदी", flag: "🇮🇳" },
  { code: "ta", name: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "తెలుగు", flag: "🇮🇳" },
];

const tutorialSlides = [
  {
    icon: "🧪",
    title: "Soil Analysis",
    description: "Upload soil images and get instant crop recommendations tailored to your land."
  },
  {
    icon: "🎤",
    title: "Voice Assistant", 
    description: "Ask questions in your language and get expert farming advice instantly."
  },
  {
    icon: "📱",
    title: "Offline Access",
    description: "Access your past advisories and recommendations even without internet."
  }
];

interface OnboardingProps {
  onComplete: (language: string) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [tutorialIndex, setTutorialIndex] = useState(0);

  const handleLanguageSelect = (langCode: string) => {
    setSelectedLanguage(langCode);
    setStep(1);
  };

  const handleTutorialComplete = () => {
    onComplete(selectedLanguage);
  };

  if (step === 0) {
    return (
      <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center p-6">
        <div className="text-center mb-8">
          <img src={appLogo} alt="SmartCropAdvisor" className="w-24 h-24 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">SmartCropAdvisor</h1>
          <p className="text-white/90 text-lg">Smart guidance for smart farming</p>
        </div>

        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-strong">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-center mb-6">Choose Your Language</h2>
            <div className="space-y-3">
              {languages.map((lang) => (
                <Button
                  key={lang.code}
                  variant="outline"
                  className="w-full h-14 text-left justify-start bg-white hover:bg-accent transition-smooth"
                  onClick={() => handleLanguageSelect(lang.code)}
                >
                  <span className="text-2xl mr-4">{lang.flag}</span>
                  <span className="text-lg font-medium">{lang.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center p-6">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-strong">
        <CardContent className="p-8 text-center">
          <div className="text-6xl mb-6">{tutorialSlides[tutorialIndex].icon}</div>
          <h2 className="text-2xl font-bold mb-4">{tutorialSlides[tutorialIndex].title}</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            {tutorialSlides[tutorialIndex].description}
          </p>
          
          <div className="flex justify-center mb-8 space-x-2">
            {tutorialSlides.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-smooth ${
                  index === tutorialIndex ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          <div className="flex justify-between">
            {tutorialIndex > 0 ? (
              <Button
                variant="outline"
                onClick={() => setTutorialIndex(tutorialIndex - 1)}
                className="transition-smooth"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            ) : (
              <div />
            )}

            {tutorialIndex < tutorialSlides.length - 1 ? (
              <Button
                onClick={() => setTutorialIndex(tutorialIndex + 1)}
                className="bg-gradient-primary hover:bg-primary-hover transition-smooth"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleTutorialComplete}
                className="bg-gradient-primary hover:bg-primary-hover transition-smooth"
              >
                Get Started
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}