import { useState, useEffect } from "react";
import typewriterImg from "@assets/typewriter_small.webp";
import FloatingNotes from "@/components/FloatingNotes";

interface Props {
  onMoodSelect: (mood: string) => void;
  onLogoClick: () => void;
}

const moods = [
  { id: "happy",      emoji: "😄", label: "Happy"     },
  { id: "sad",        emoji: "😔", label: "Sad"        },
  { id: "calm",       emoji: "🌿", label: "Calm"       },
  { id: "motivated",  emoji: "🔥", label: "Motivated"  },
  { id: "thoughtful", emoji: "💭", label: "Thoughtful" },
  { id: "lonely",     emoji: "🌙", label: "Lonely"     },
];

const moodTints: Record<string, string> = {
  happy:      "rgba(255,220,100,0.12)",
  sad:        "rgba(140,160,200,0.10)",
  calm:       "rgba(140,200,160,0.10)",
  motivated:  "rgba(240,140, 80,0.10)",
  thoughtful: "rgba(180,150,220,0.10)",
  lonely:     "rgba(120,140,185,0.10)",
};

const HEADING = "What's your mood today?";

export default function MoodSelection({ onMoodSelect, onLogoClick }: Props) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [headingText, setHeadingText] = useState("");
  const [showCursor, setShowCursor]   = useState(true);
  const [showButtons, setShowButtons] = useState(false);
  const [bgTint, setBgTint]           = useState("transparent");
  const [isMobile, setIsMobile]       = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* Typewriter animation for the heading */
  useEffect(() => {
    const cursorTimer = setTimeout(() => setShowCursor(true), 200);
    const startTimer  = setTimeout(() => {
      let i = 0;
      const iv = setInterval(() => {
        if (i < HEADING.length) {
          setHeadingText(HEADING.slice(0, i + 1));
          i++;
        } else {
          clearInterval(iv);
          setTimeout(() => {
            setShowCursor(false);
            setShowButtons(true);
          }, 300);
        }
      }, 52);
      return () => clearInterval(iv);
    }, 400);

    return () => { clearTimeout(cursorTimer); clearTimeout(startTimer); };
  }, []);

  function handleMoodClick(moodId: string) {
    setSelectedMood(moodId);
    setBgTint(moodTints[moodId] || "transparent");
    setTimeout(() => setBgTint("transparent"), 1400);
    setTimeout(() => onMoodSelect(moodId), 320);
  }

  return (
    <div
      style={{
        height: isMobile ? "100dvh" : "100vh",
        backgroundColor: "#fffaeb",
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(213,199,166,0.18) 31px, rgba(213,199,166,0.18) 32px)",
        backgroundSize: "100% 32px",
        fontFamily: "Nunito, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile 
          ? "calc(80px + env(safe-area-inset-top)) 16px 40px" 
          : "120px clamp(16px, 5vw, 28px) 80px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        touchAction: "none",
      }}
    >
      {/* Mood tint overlay */}
      <div style={{
        position: "fixed", inset: 0,
        backgroundColor: bgTint,
        pointerEvents: "none",
        transition: "background-color 1.2s ease",
        zIndex: 0,
      }} />

      <FloatingNotes />

      <button
        onClick={onLogoClick}
        title="Replay intro"
        style={{
          position: "fixed", 
          top: `calc(18px + env(safe-area-inset-top))`, 
          left: isMobile ? "50%" : "20px",
          transform: isMobile ? "translateX(-50%)" : "none",
          display: "flex", alignItems: "center", gap: "10px",
          background: "transparent", border: "none", cursor: "pointer",
          padding: "4px 6px", borderRadius: "8px", zIndex: 110,
          transition: "opacity 0.2s ease",
          animation: "fadeIn 0.4s ease forwards",
        }}
        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = "0.65"}
        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = "1"}
      >
        <img src={typewriterImg} alt="logo" style={{ width: "22px", objectFit: "contain" }} />
        <span style={{ 
          fontFamily: "Libre Baskerville, serif", 
          fontSize: "clamp(14px,1.4vw,18px)", 
          fontWeight: 700, color: "#200B0A", letterSpacing: "-0.5px", whiteSpace: "nowrap" 
        }}>
          Cozy Typewriter
        </span>
      </button>

      {/* Main content */}
      <div
        style={{
          width: "100%",
          maxWidth: isMobile ? "560px" : "800px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 1,
          animation: "fadeIn 0.6s ease forwards 0.2s",
          opacity: 0,
        }}
      >
        {/* Typewriter-animated heading */}
        <h1
          style={{
            fontFamily: "Libre Baskerville, serif",
            fontSize: "clamp(28px, 5vw, 52px)",
            fontWeight: 700,
            color: "#200B0A",
            textAlign: "center",
            maxWidth: isMobile ? "280px" : "none",
            margin: `0 auto ${isMobile ? "clamp(16px, 3.5vh, 28px)" : "clamp(32px, 5vh, 48px)"}`,
            letterSpacing: "-0.5px",
            lineHeight: 1.22,
            minHeight: "1.2em",
            whiteSpace: isMobile ? "normal" : "nowrap",
          }}
        >
          {headingText}
          {showCursor && (
            <span style={{
              display: "inline-block",
              width: "clamp(3px,0.35vw,5px)",
              height: "0.85em",
              backgroundColor: "#200B0A",
              marginLeft: "3px",
              verticalAlign: "middle",
              borderRadius: "1px",
              animation: showButtons ? "none" : "blink 0.72s step-end infinite",
            }} />
          )}
        </h1>

        {/* Mood buttons */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(10px,1.8vh,18px)",
            width: "100%",
            maxWidth: "560px",
          }}
        >
          {moods.map((mood, index) => (
            <button
              key={mood.id}
              data-testid={`button-mood-${mood.id}`}
              onClick={() => handleMoodClick(mood.id)}
              style={{
                height: "clamp(54px,5.5vw,74px)",
                background: selectedMood === mood.id ? "#D5C7A6" : "#F2E9D3",
                border: "1px solid #D5C7A6",
                borderRadius: "clamp(14px,1.6vw,22px)",
                display: "flex", alignItems: "center", justifyContent: "flex-start",
                padding: "0 clamp(14px,1.8vw,24px)",
                gap: "clamp(10px,1.3vw,16px)",
                cursor: "pointer",
                fontFamily: "Nunito, sans-serif",
                fontSize: "clamp(14px,1.3vw,18px)",
                fontWeight: 600,
                color: "#200B0A",
                boxShadow: "0px 2px 8px rgba(0,0,0,0.06)",
                transform: selectedMood === mood.id ? "scale(0.96)" : "scale(1)",
                transition: "transform 0.18s ease, box-shadow 0.2s ease, background 0.18s ease",
                animation: showButtons
                  ? `slideRiseIn 0.5s cubic-bezier(0.34,1.4,0.64,1) ${index * 65}ms both`
                  : "none",
                opacity: showButtons ? undefined : 0,
              }}
              onMouseEnter={e => {
                if (selectedMood !== mood.id) {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = "#E8DCC0";
                  el.style.boxShadow = "0px 6px 18px rgba(0,0,0,0.12)";
                  el.style.transform = "scale(1.03) translateY(-1px)";
                  const emojiEl = el.querySelector(".mood-emoji") as HTMLElement;
                  if (emojiEl) emojiEl.style.animation = "emojiPop 0.35s cubic-bezier(0.34,1.56,0.64,1) both";
                }
              }}
              onMouseLeave={e => {
                if (selectedMood !== mood.id) {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = "#F2E9D3";
                  el.style.boxShadow = "0px 2px 8px rgba(0,0,0,0.06)";
                  el.style.transform = "scale(1)";
                  const emojiEl = el.querySelector(".mood-emoji") as HTMLElement;
                  if (emojiEl) emojiEl.style.animation = "none";
                }
              }}
              onMouseDown={e => { (e.currentTarget as HTMLElement).style.transform = "scale(0.95)"; }}
              onMouseUp={e => { if (selectedMood !== mood.id) (e.currentTarget as HTMLElement).style.transform = "scale(1.03)"; }}
            >
              <span
                className="mood-emoji"
                style={{
                  fontSize: "clamp(20px,2.2vw,28px)",
                  lineHeight: 1,
                  display: "inline-block",
                  animation: showButtons
                    ? `emojiBounceIn 0.55s cubic-bezier(0.34,1.6,0.64,1) ${index * 65 + 110}ms both`
                    : "none",
                }}
              >
                {mood.emoji}
              </span>
              <span>{mood.label}</span>
            </button>
          ))}
        </div>

        {/* Footers */}
        <p style={{
          marginTop: "clamp(18px,3vh,32px)",
          fontFamily: "Nunito, sans-serif", fontSize: "12px",
          color: "#9E8A7E", textAlign: "center",
          animation: showButtons ? "fadeIn 0.6s ease 1.2s forwards" : "none",
          opacity: 0,
        }}>
          Written with warmth, one key at a time.
        </p>

        <div style={{
          position: "fixed",
          bottom: "max(16px, env(safe-area-inset-bottom))",
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "'Special Elite', cursive",
          fontSize: "clamp(9px, 2.5vw, 11px)",
          fontWeight: 400,
          letterSpacing: "2px",
          color: "#8D7B70",
          textAlign: "center",
          textTransform: "uppercase",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          zIndex: 5,
          opacity: 0.8
        }}>
          DESIGNED BY KISHAN NAIK
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideRiseIn {
          0%   { opacity: 0; transform: translateY(24px) rotate(-1.2deg) scale(0.92); }
          55%  { transform: translateY(-4px) rotate(0.4deg) scale(1.02); }
          80%  { transform: translateY(2px) rotate(-0.2deg) scale(0.99); }
          100% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
        }
        @keyframes emojiBounceIn {
          0%   { opacity: 0; transform: scale(0.3) rotate(-18deg) translateY(8px); }
          50%  { opacity: 1; transform: scale(1.35) rotate(7deg) translateY(-4px); }
          75%  { transform: scale(0.9) rotate(-3deg) translateY(2px); }
          100% { opacity: 1; transform: scale(1) rotate(0deg) translateY(0); }
        }
        @keyframes emojiPop {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.38) rotate(-8deg); }
          70%  { transform: scale(0.92) rotate(4deg); }
          100% { transform: scale(1.1) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
