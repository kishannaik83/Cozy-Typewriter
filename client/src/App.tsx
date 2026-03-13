import { useState, useEffect } from "react";
import IntroScreen from "@/components/IntroScreen";
import MoodSelection from "@/pages/MoodSelection";
import TypewriterExperience from "@/pages/TypewriterExperience";

type Screen = "intro" | "mood" | "typewriter";

const SESSION_KEY = "cozy_intro_seen";

export default function App() {
  const introSeen = sessionStorage.getItem(SESSION_KEY) === "1";
  const [screen, setScreen] = useState<Screen>(introSeen ? "mood" : "intro");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  function handleIntroComplete() {
    sessionStorage.setItem(SESSION_KEY, "1");
    setScreen("mood");
  }

  function handleMoodSelect(mood: string) {
    setSelectedMood(mood);
    setScreen("typewriter");
  }

  function handleBack() {
    setSelectedMood(null);
    setScreen("mood");
  }

  function handleLogoClick() {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.reload();
  }

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ 
      minHeight: isMobile ? "100dvh" : "100vh",
      height: isMobile ? "100dvh" : "auto", 
      backgroundColor: "#fffaeb", 
      fontFamily: "Nunito, sans-serif", 
      overflowY: isMobile ? "hidden" : "auto", 
      position: "relative" 
    }}>
      {screen === "intro" && (
        <IntroScreen onComplete={handleIntroComplete} />
      )}
      {screen === "mood" && (
        <MoodSelection onMoodSelect={handleMoodSelect} onLogoClick={handleLogoClick} />
      )}
      {screen === "typewriter" && selectedMood && (
        <TypewriterExperience 
          mood={selectedMood} 
          onBack={handleBack} 
          onMoodChange={(m) => setSelectedMood(m)}
        />
      )}
    </div>
  );
}
