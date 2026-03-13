import { useEffect, useState, useRef, useCallback } from "react";
import typewriterImg from "@assets/typewriter_small.webp";
import introImg from "@assets/typewriter_intro.png";

function createAudioCtx(): AudioContext | null {
  try { return new (window.AudioContext || (window as any).webkitAudioContext)(); }
  catch { return null; }
}

function playKeyPress(ctx: AudioContext | null) {
  if (!ctx) return;
  try {
    const sz = ctx.sampleRate * 0.04;
    const buf = ctx.createBuffer(1, sz, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < sz; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sz * 0.15));
    const src = ctx.createBufferSource(); src.buffer = buf;
    const filt = ctx.createBiquadFilter(); filt.type = "bandpass"; filt.frequency.value = 1200 + Math.random() * 400; filt.Q.value = 0.8;
    const gain = ctx.createGain(); gain.gain.setValueAtTime(0.35, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
    src.connect(filt); filt.connect(gain); gain.connect(ctx.destination);
    src.start(); src.stop(ctx.currentTime + 0.07);
  } catch {}
}

interface Props {
  onComplete: () => void;
}

/**
 * Centered Intro Sequence with Unified Container:
 * 1. Typing: Title types in the center.
 * 2. Illustration: Title moves up, illustration pops in below with tight spacing (28px).
 * 3. Merge: Large illustration slides horizontally to the left side of the title.
 * 4. Fly: The combined logo unit moves to its final destination (Top-Left or Top-Center).
 */

export default function IntroScreen({ onComplete }: Props) {
  const [phase, setPhase] = useState<
    "typing" | "illustration" | "merge" | "fly" | "done"
  >("typing");
  const [displayText, setDisplayText] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const fullText = "Cozy Typewriter";
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudio = useCallback(() => {
    if (!audioCtxRef.current) audioCtxRef.current = createAudioCtx();
    if (audioCtxRef.current?.state === "suspended") audioCtxRef.current.resume();
    return audioCtxRef.current;
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Phase 1: Typing
    let currentIdx = 0;
    const typeInterval = setInterval(() => {
      // Logic for typing sound
      if (currentIdx < fullText.length) {
        playKeyPress(getAudio());
      }

      if (currentIdx <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIdx));
        currentIdx++;
      } else {
        clearInterval(typeInterval);
        setPhase("illustration");
      }
    }, 60);
    return () => clearInterval(typeInterval);
  }, [fullText, getAudio]);

  useEffect(() => {
    if (phase === "illustration") {
      const t = setTimeout(() => setPhase("merge"), 1800);
      return () => clearTimeout(t);
    }
    if (phase === "merge") {
      const t = setTimeout(() => setPhase("fly"), 450);
      return () => clearTimeout(t);
    }
    if (phase === "fly") {
      const t = setTimeout(() => {
        setPhase("done");
        onComplete();
      }, 900);
      return () => clearTimeout(t);
    }
  }, [phase, onComplete]);

  // Derived states
  const showIllust = phase === "illustration";
  const isMerged = phase === "merge" || phase === "fly" || phase === "done";
  const isFlying = phase === "fly" || phase === "done";

  // Transition settings
  const springConfig = "cubic-bezier(0.22, 1, 0.36, 1)";
  
  // Unified Container Positioning
  const containerTop = isFlying 
    ? (isMobile ? `calc(18px + env(safe-area-inset-top))` : "18px") 
    : "50%";
  
  // Desktop still uses absolute positioning, Mobile uses full-width flex
  const containerLeft = isMobile ? "0" : (isFlying ? "20px" : "50%");
  const containerWidth = isMobile ? "100%" : "max-content";
  
  const containerTransform = isMobile 
    ? (isFlying ? "none" : "translateY(-50%)") 
    : (isFlying ? "none" : "translate(-50%, -50%)");

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#fffaeb",
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(213,199,166,0.18) 31px, rgba(213,199,166,0.18) 32px)",
        backgroundSize: "100% 32px",
        zIndex: 1000,
        overflow: "hidden",
        touchAction: "none",
      }}
    >
      {/* 
          UNIFIED INTRO CONTAINER
          Ensures H1 and Illustration stay logically grouped and perfectly centered.
      */}
      <div
        style={{
          position: "fixed",
          top: containerTop,
          left: containerLeft,
          width: containerWidth,
          transform: containerTransform,
          display: "flex",
          flexDirection: isMerged ? "row" : "column",
          alignItems: "center",
          justifyContent: "center", // Perfectly centers children on mobile
          gap: isMerged ? (isMobile ? "12px" : "15px") : "0px",
          transition: `all ${phase === "merge" ? "0.3s" : "0.8s"} ${springConfig}`,
          zIndex: 1100,
          whiteSpace: "nowrap",
        }}
      >
        <div 
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // Use width/opacity instead of display:none to keep layout stable
            width: isMerged ? (isMobile ? "32px" : "clamp(34px, 4.5vw, 68px)") : "0px",
            opacity: isMerged ? 1 : 0,
            overflow: "hidden",
            transition: `width 0.4s ${springConfig}, opacity 0.3s ease`,
            flexShrink: 0,
          }}
        >
          <img
            src={typewriterImg}
            alt="Logo Icon"
            style={{
              height: isFlying 
                ? (isMobile ? "18px" : "clamp(16px, 1.4vw, 20px)") 
                : (isMobile ? "32px" : "clamp(34px, 4.5vw, 68px)"),
              width: "auto",
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>

        <h1
          style={{
            fontFamily: "Libre Baskerville, serif",
            fontSize: isFlying ? "clamp(14px, 1.4vw, 18px)" : "clamp(26px, 4.5vw, 56px)",
            fontWeight: 700,
            color: "#200B0A",
            letterSpacing: "-0.5px",
            margin: 0,
            lineHeight: 1,
            transition: `all 0.6s ${springConfig}`,
          }}
        >
          {displayText}
          {phase === "typing" && (
            <span style={{ 
              animation: "blink 1s infinite", 
              fontWeight: 300,
              color: "#200B0A",
              marginLeft: "2px"
            }}>|</span>
          )}
        </h1>

        {!isMerged && (
          <div
            style={{
              opacity: showIllust ? 1 : 0,
              height: showIllust ? "auto" : "0px",
              marginTop: showIllust ? "28px" : "0px",
              visibility: showIllust ? "visible" : "hidden",
              overflow: "hidden",
              transform: showIllust ? "scale(1)" : "scale(0.95)",
              transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
              pointerEvents: "none",
            }}
          >
            <img
              src={introImg}
              alt="Introduction"
              style={{
                width: "clamp(260px, 32vw, 420px)",
                maxHeight: "55vh",
                objectFit: "contain",
                animation: showIllust ? "vibratePop 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both" : "none",
                display: "block",
              }}
            />
          </div>
        )}
      </div>

      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        
        @keyframes vibratePop {
          0% { transform: scale(0.95); opacity: 0; }
          40% { transform: scale(1.02); opacity: 1; }
          50% { transform: scale(1) translateX(1px); }
          60% { transform: scale(1) translateX(-1px); }
          70% { transform: scale(1) translateX(0.5px); }
          100% { transform: scale(1) translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
