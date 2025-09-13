import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Auth } from "@/components/Auth";
import { Onboarding } from "@/components/Onboarding";
import { Dashboard } from "@/components/Dashboard";
import { SoilScan } from "@/components/SoilScan";
import { PestScan } from "@/components/PestScan";
import { VoiceAdvisor } from "@/components/VoiceAdvisor";
import { Weather } from "@/components/Weather";
import { MarketPrices } from "@/components/MarketPrices";
import { Settings } from "@/components/Settings";
import { Notifications } from "@/components/Notifications";

const Index = () => {
  const { user, userProfile, loading, isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>("onboarding");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");

  useEffect(() => {
    // Set language from user profile if available
    if (userProfile?.preferred_language) {
      setSelectedLanguage(userProfile.preferred_language);
    }
  }, [userProfile]);

  const handleAuthSuccess = (user: any) => {
    setCurrentPage("onboarding");
  };

  const handleOnboardingComplete = (language: string) => {
    setSelectedLanguage(language);
    setCurrentPage("dashboard");
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleBack = () => {
    setCurrentPage("dashboard");
  };

  const handleLanguageChange = (language?: string) => {
    if (language) {
      setSelectedLanguage(language);
    } else {
      setCurrentPage("onboarding");
    }
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-magical flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  // Show onboarding for new users or language change
  if (currentPage === "onboarding") {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Show dashboard as home page
  if (currentPage === "dashboard") {
    return (
      <Dashboard 
        onNavigate={handleNavigate} 
        language={selectedLanguage} 
        onLanguageChange={handleLanguageChange}
        userProfile={userProfile}
      />
    );
  }

  // Handle feature pages
  if (currentPage === "soil") {
    return <SoilScan onBack={handleBack} language={selectedLanguage} />;
  }

  if (currentPage === "pest") {
    return <PestScan onBack={handleBack} language={selectedLanguage} />;
  }

  if (currentPage === "advisor") {
    return <VoiceAdvisor onBack={handleBack} language={selectedLanguage} />;
  }

  if (currentPage === "weather") {
    return <Weather onBack={handleBack} language={selectedLanguage} />;
  }

  if (currentPage === "market") {
    return <MarketPrices onBack={handleBack} language={selectedLanguage} />;
  }

  if (currentPage === "settings") {
    return (
      <Settings 
        onBack={handleBack} 
        language={selectedLanguage} 
        onLanguageChange={setSelectedLanguage}
        userProfile={userProfile}
      />
    );
  }

  if (currentPage === "notifications") {
    return <Notifications onBack={handleBack} language={selectedLanguage} />;
  }

  // Fallback to dashboard
  return (
    <Dashboard 
      onNavigate={handleNavigate} 
      language={selectedLanguage} 
      onLanguageChange={handleLanguageChange}
      userProfile={userProfile}
    />
  );
};

export default Index;
