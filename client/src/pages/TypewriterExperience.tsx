import { useState, useEffect, useRef, useCallback } from "react";
import html2canvas from "html2canvas";
import typewriterScreen from "@assets/typewriter_screen2.webp";

interface Props {
  mood: string;
  onBack: () => void;
  onMoodChange?: (mood: string) => void;
}

const moodData: Record<string, { label: string; emoji: string; quotes: string[] }> = {
  happy: {
    label: "Happy", emoji: "😊",
    quotes: [
      "Today is a good day to be alive. Let the sunshine reach your bones.",
      "Joy is not something that happens to you. It is something you grow, gently.",
      "There is magic in ordinary moments — a warm cup and a laughing friend.",
      "Let yourself feel the lightness. You have earned this quiet happiness.",
      "Smiling costs nothing, yet somehow it makes the whole world feel softer.",
      "Good things are coming your way. Open your heart to the simple light.",
      "You are a collection of every beautiful thing you have ever noticed.",
      "Leave some space in your day for wonder. It is a very good habit to have.",
      "Happiness is a quiet hum, a soft glow, a steady breath. Hold it close.",
      "The world is full of small miracles. Today, you are one of them."
    ],
  },
  sad: {
    label: "Sad", emoji: "😔",
    quotes: [
      "It is okay to feel heavy. Rain is just clouds being honest about how they feel.",
      "You do not have to be okay today. Surviving is more than enough.",
      "Even the longest night eventually makes room for morning light.",
      "Tears are the kindest thing a heart can do when words are not enough.",
      "Let yourself be sad. Feeling is not weakness — it is simply being human.",
      "Rest your heavy head. Tomorrow will hold a different kind of strength.",
      "Your sadness is a ocean. It is okay to float for a while until you find shore.",
      "Healing is not a straight line. It is a slow, messy, beautiful circling home.",
      "Be gentle with yourself. You are doing the best you can with a heavy heart.",
      "Sometimes the most brave thing you can do is simply allow yourself to feel."
    ],
  },
  calm: {
    label: "Calm", emoji: "🌿",
    quotes: [
      "Breathe in slowly. The world can wait. You are allowed to rest today.",
      "There is wisdom in stillness. Not every question needs an answer right now.",
      "Peace is not the absence of noise. It is a quiet corner found inside yourself.",
      "Rest without guilt. The most important thing right now is simply to be.",
      "Nothing needs fixing this moment. You are allowed to simply exist.",
      "Let the noise of the world fade. Tune into the steady rhythm of your breath.",
      "Softness is a power. Peace is a choice. Today, choose to be still.",
      "The garden of your mind grows best when you let the soil rest.",
      "You are enough, exactly as you are, in this very quiet moment.",
      "Listen to the silence. It has more to tell you than the noise ever will."
    ],
  },
  motivated: {
    label: "Motivated", emoji: "🔥",
    quotes: [
      "You have survived every hard day before this one. Today is no different.",
      "The only distance between here and there is a single step taken with intention.",
      "Discipline is love written as a letter to your future self.",
      "Start small, keep moving. The first step is always the most important.",
      "Your effort today is quietly building something that will matter tomorrow.",
      "Fire is born from friction. Your challenges are making you brighter.",
      "Do not look at the mountain. Just look at where you are putting your feet.",
      "You carry a spark that can light up a thousand dark halls. Keep going.",
      "Results are just the shadow of consistent, quiet, daily effort.",
      "Be the person your younger self would have looked up to today."
    ],
  },
  thoughtful: {
    label: "Thoughtful", emoji: "💭",
    quotes: [
      "We are all just trying to make sense of a world with no instruction manual.",
      "To think deeply is a rare gift. Not everyone is brave enough to sit with questions.",
      "Some thoughts are meant to settle slowly, like snow — into something clear.",
      "The questions you carry say more about you than the answers ever could.",
      "Wonder is not childish. It is the most honest response to being alive.",
      "Truth is usually found in the grey spaces between the black and white.",
      "Your perspective is a unique lens. No one else sees the world quite like you.",
      "Knowledge is a map, but curiosity is the compass that keeps you moving.",
      "To understand another is to walk through a doorway into a different world.",
      "Silence your tongue and open your ears. The stars are always speaking."
    ],
  },
  lonely: {
    label: "Lonely", emoji: "🌙",
    quotes: [
      "Loneliness means you know what connection feels like, and you miss it deeply.",
      "You carry every kind word ever spoken to you. You are never quite empty.",
      "Distance is just love waiting to close the gap. The right ones always return.",
      "Being alone and being lonely are two different things. You are not forgotten.",
      "Even a single candle flame is not alone — it lights up everything around it.",
      "The moon is alone every night, yet it still pulls the tides of the whole world.",
      "Your own company is a valid place to belong. Be a friend to yourself today.",
      "Somewhere, someone is looking at the same star and thinking of a heart like yours.",
      "This season of solitude is where the deepest parts of you are being written.",
      "You are never truly alone when you walk with the stories you have lived."
    ],
  },
};

const WhatsAppIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0, width: size, height: size }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 0 5.414 0 12.05c0 2.123.553 4.197 1.603 6.02L0 24l6.135-1.61a11.787 11.787 0 005.912 1.586h.005c6.632 0 12.05-5.413 12.05-12.049 0-3.212-1.25-6.232-3.522-8.508z" />
  </svg>
);

const XIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0, width: size, height: size }}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

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

function playCarriageReturn(ctx: AudioContext | null) {
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator(); const g = ctx.createGain();
    osc.type = "sine"; osc.frequency.setValueAtTime(880, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.12);
    g.gain.setValueAtTime(0.18, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc.connect(g); g.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 0.2);
  } catch {}
}

function modalBtn(): React.CSSProperties {
  return {
    height: "44px", borderRadius: "13px", background: "#F2E9D3",
    border: "1px solid rgba(213,199,166,0.5)", display: "flex",
    alignItems: "center", justifyContent: "center", gap: "7px",
    cursor: "pointer", color: "#200B0A", fontFamily: "Nunito, sans-serif",
    fontSize: "14px", fontWeight: 600, transition: "background 0.15s, transform 0.15s",
    whiteSpace: "nowrap" as const,
  };
}

function hover(e: React.MouseEvent, enter: boolean) {
  const el = e.currentTarget as HTMLElement;
  el.style.background = enter ? "#E8DCC0" : "#F2E9D3";
  el.style.transform = enter ? "translateY(-1px)" : "";
}

function ctrlBtn(active = false, disabled = false, circle = false): React.CSSProperties {
  return {
    height: "36px", padding: circle ? "0" : "0 16px", width: circle ? "36px" : "auto",
    background: active ? "rgba(213,199,166,0.3)" : "transparent", border: "1px solid rgba(213,199,166,0.45)",
    borderRadius: "10px", cursor: disabled ? "not-allowed" : "pointer", display: "flex", alignItems: "center",
    justifyContent: "center", gap: "7px", fontFamily: "Nunito, sans-serif", fontSize: "14px", fontWeight: 500,
    color: "#200B0A", opacity: disabled ? 0.4 : 1, transition: "all 0.18s ease", flexShrink: 0, whiteSpace: "nowrap" as const,
  };
}

export default function TypewriterExperience({ mood: initialMood, onBack, onMoodChange }: Props) {
  const [mood, setMood] = useState(initialMood);
  const moodInfo = moodData[mood] || moodData.calm;
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingDone, setTypingDone] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [quoteIndex, setQuoteIndex] = useState(() => {
    const list = moodData[mood]?.quotes || [];
    const sessionKey = `last_quote_${mood}`;
    const lastIdx = parseInt(sessionStorage.getItem(sessionKey) || "-1");
    let next = Math.floor(Math.random() * list.length);
    if (next === lastIdx && list.length > 1) {
      next = (next + 1) % list.length;
    }
    sessionStorage.setItem(sessionKey, next.toString());
    return next;
  });
  const [shakeX, setShakeX] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: "", visible: false });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, visible: true });
    toastTimerRef.current = setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 2000);
  }, []);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const charIndexRef = useRef(0);
  const lineCharsRef = useRef(0);
  const paperRef = useRef<HTMLDivElement>(null);
  const downloadCardRef = useRef<HTMLDivElement>(null);
  const soundEnabledRef = useRef(soundEnabled);
  useEffect(() => { soundEnabledRef.current = soundEnabled; }, [soundEnabled]);

  const getAudio = useCallback(() => {
    if (!audioCtxRef.current) audioCtxRef.current = createAudioCtx();
    if (audioCtxRef.current?.state === "suspended") audioCtxRef.current.resume();
    return audioCtxRef.current;
  }, []);

  useEffect(() => {
    if (paperRef.current) paperRef.current.scrollTop = paperRef.current.scrollHeight;
  }, [displayedText]);

  const startTyping = useCallback((idx: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    charIndexRef.current = 0; lineCharsRef.current = 0;
    setDisplayedText(""); setTypingDone(false); setIsTyping(true);
    const quote = moodInfo.quotes[idx % moodInfo.quotes.length];

    function typeNext() {
      const i = charIndexRef.current;
      if (i >= quote.length) { setIsTyping(false); setTypingDone(true); return; }
      const ch = quote[i];
      const isPunct = [".", "!", "?", ",", ";"].includes(ch);
      setDisplayedText(prev => prev + ch);
      if (ch === " " && lineCharsRef.current >= 28) {
        if (soundEnabledRef.current) playCarriageReturn(getAudio());
        lineCharsRef.current = 0;
        const x = Math.random() > 0.5 ? 1.4 : -1.4;
        setShakeX(x); setIsShaking(true);
        setTimeout(() => { setShakeX(0); setIsShaking(false); }, 130);
      } else {
        lineCharsRef.current += 1;
        if (soundEnabledRef.current) playKeyPress(getAudio());
        const x = (Math.random() - 0.5) * 1.6;
        setShakeX(x); setIsShaking(true);
        setTimeout(() => { setShakeX(0); setIsShaking(false); }, 65);
      }
      charIndexRef.current += 1;
      let delay = 42 + Math.random() * 38;
      if (isPunct) delay += 110 + Math.random() * 160;
      timeoutRef.current = setTimeout(typeNext, delay);
    }
    typeNext();
  }, [moodInfo.quotes, getAudio]);

  useEffect(() => {
    if (!imgLoaded) return;
    startTyping(quoteIndex);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [imgLoaded, mood]); // Added mood as dependency

  function handleNewNote() {
    const list = moodInfo.quotes;
    if (list.length <= 1) return;
    
    let next = Math.floor(Math.random() * list.length);
    if (next === quoteIndex) {
      next = (next + 1) % list.length;
    }
    
    setQuoteIndex(next);
    sessionStorage.setItem(`last_quote_${mood}`, next.toString());
    startTyping(next);
    showToast("New note created");
  }

  const currentQuote = moodInfo.quotes[quoteIndex % moodInfo.quotes.length];
  const canShare = !isTyping && typingDone;

  /** Build a sticker-sized canvas (or 9:16) for export */
  async function buildCanvas(asSticker = false): Promise<HTMLCanvasElement | null> {
    if (!downloadCardRef.current) return null;
    
    // Adjust container temporarily for sticker vs full screen
    const originalStyle = downloadCardRef.current.style.cssText;
    if (asSticker) {
      downloadCardRef.current.style.height = "auto";
      downloadCardRef.current.style.minHeight = "400px";
      downloadCardRef.current.style.borderRadius = "30px";
      downloadCardRef.current.style.background = "transparent";
    }

    downloadCardRef.current.style.display = "flex";
    await new Promise(r => setTimeout(r, 150));
    
    try {
      const options: any = {
        scale: 3, 
        useCORS: true, 
        backgroundColor: asSticker ? null : "#FFFAEB",
      };
      
      // If sticker, we only want the content area, not the full 360x640 frame
      if (!asSticker) {
        options.width = 360;
        options.height = 640;
      }

      const canvas = await html2canvas(downloadCardRef.current, options);
      return canvas;
    } catch (e) { 
      console.error("Canvas generation failed:", e); 
      return null; 
    } finally { 
      if (downloadCardRef.current) {
        downloadCardRef.current.style.cssText = originalStyle;
        downloadCardRef.current.style.display = "none";
      }
    }
  }

  function triggerDownload(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }

  async function downloadAsImage() {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const canvas = await buildCanvas(false);
      if (!canvas) return;
      
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/png"));
      if (!blob) return;

      triggerDownload(blob, `cozy-note-${mood}.png`);
      showToast("Note saved to gallery");
    } catch (e) {
      console.error(e);
      showToast("Download failed");
    } finally { setIsDownloading(false); }
  }

  /** Share PNG via Web Share API or fallback to download + manual open */
  async function shareToInstagram() {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      // Generate the canvas with typewriter and quote
      const canvas = await buildCanvas(false);
      if (!canvas) {
        showToast("Export failed");
        return;
      }

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png", 1.0));
      if (!blob) {
        showToast("Export failed");
        return;
      }

      const fileName = `cozy-note-${mood}.png`;
      const file = new File([blob], fileName, { type: "image/png" });

      // Try to use Web Share API if supported for files
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: "Cozy Typewriter Note",
            text: `"${currentQuote}" — Shared from Cozy Typewriter`,
          });
          // Show "Open Instagram" button as a helpful shortcut anyway
          setDownloadComplete(true);
        } catch (err) {
          // If aborted, user just closed the sheet; if other error, fallback to download
          if ((err as Error).name !== "AbortError") {
            triggerDownload(blob, fileName);
            setDownloadComplete(true);
          }
        }
      } else {
        // Fallback for browsers that don't support file sharing (e.g., most desktop, old mobile)
        triggerDownload(blob, fileName);
        showToast("Note saved! Opening Instagram...");
        setDownloadComplete(true);
      }
    } catch (e) {
      console.error(e);
      showToast("Something went wrong");
    } finally {
      setIsDownloading(false);
    }
  }

  const openInstagram = () => {
    // Attempt to open Instagram app using deep link
    // Fallback to opening Instagram website if app is unavailable
    const instagramAppUrl = "instagram://camera";
    const instagramWebUrl = "https://www.instagram.com/";
    
    const start = Date.now();
    window.location.href = instagramAppUrl;

    // If the browser is still visible after a short delay, fallback to web
    setTimeout(() => {
      if (Date.now() - start < 2500 && document.visibilityState === "visible") {
        window.location.href = instagramWebUrl;
      }
    }, 2000);
  };

  function downloadAsTxt() {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([currentQuote], { type: "text/plain" }));
    a.download = `cozy-note-${mood}.txt`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    showToast("Note saved as text");
  }

  function shareWhatsapp() {
    window.open(`https://wa.me/?text=${encodeURIComponent('"' + currentQuote + '" — Cozy Typewriter')}`, "_blank");
    showToast("Quote saved");
  }

  function shareX() {
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent('"' + currentQuote + '" — Cozy Typewriter')}`, "_blank");
    showToast("Quote saved");
  }

  const canShareFiles = typeof navigator !== "undefined" && !!navigator.canShare;

  return (
    <div
      style={{
        minHeight: isMobile ? "100dvh" : "100vh",
        height: isMobile ? "100dvh" : "auto",
        backgroundColor: "#fffaeb",
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(213,199,166,0.18) 31px, rgba(213,199,166,0.18) 32px)",
        backgroundSize: "100% 32px",
        fontFamily: "Nunito, sans-serif",
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "flex-start",
        padding: isMobile 
          ? "calc(10px + env(safe-area-inset-top)) clamp(14px,4vw,22px) 0" // No bottom padding here, we'll handle it in footer
          : "20px clamp(14px,4vw,22px) 40px",
        boxSizing: "border-box", 
        overflow: "hidden", // Important for iOS height calculations
        position: "relative",
      }}
    >
      {/* Main Content Scrollable Area */}
      <div style={{ 
        width: "100%", 
        maxWidth: "720px", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        zIndex: 1,
        flex: 1, 
        minHeight: 0, // Allow shrinking
        justifyContent: "flex-start",
      }}>

        {/* Back button */}
        <div style={{ 
          width: "100%", 
          marginBottom: isMobile ? "12px" : "4px",
          animation: "fadeIn 0.35s ease forwards",
          display: "flex", // Ensure we can justify-content
          justifyContent: isMobile ? "flex-start" : "flex-start", // Already left-aligned, but let's make it tighter
        }}>
          <button
            onClick={onBack}
            style={{
              width: "38px",
              height: "34px",
              background: "#F2E9D3",
              border: "1px solid rgba(213,199,166,0.6)",
              borderRadius: "10px",
              cursor: "pointer",
              color: "#200B0A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s ease",
              // On desktop, we can position it absolutely or keep it in flow
              position: isMobile ? "static" : "absolute",
              left: isMobile ? "auto" : "20px",
              top: isMobile ? "auto" : "20px",
              zIndex: 10,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#E8DCC0"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#F2E9D3"; (e.currentTarget as HTMLElement).style.transform = "none"; }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, width: "15px", height: "15px" }}>
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
        </div>

        <h1 style={{
          fontFamily: "Libre Baskerville, serif", 
          fontSize: "clamp(26px,5vw,56px)",
          fontWeight: 700, 
          color: "#200B0A", 
          textAlign: "center", 
          lineHeight: 1.1,
          letterSpacing: "-0.5px",
          marginBottom: isMobile ? "4px" : "1px",
          animation: "fadeInDown 0.5s cubic-bezier(0.22,1,0.36,1) 0.05s both", 
          opacity: 0,
        }}>
          Your Little Note
        </h1>

        <p style={{
          fontFamily: "Nunito, sans-serif", 
          fontSize: "clamp(15px,1.6vw,19px)", 
          fontWeight: 400,
          color: "#4D3B37", 
          textAlign: "center", 
          marginBottom: isMobile ? "6px" : "2px",
          animation: "fadeIn 0.4s ease 0.14s both", 
          opacity: 0,
        }}>
          A few words for this moment.
        </p>

        <p data-testid="text-mood-indicator" style={{
          fontFamily: "Nunito, sans-serif", 
          fontSize: "13px", 
          fontWeight: 400,
          color: "#9E8A7E", 
          textAlign: "center", 
          marginBottom: isMobile ? "14px" : "6px",
          opacity: 0.8,
          animation: "fadeIn 0.4s ease 0.22s both",
        }}>
          Feeling {moodInfo.label} {moodInfo.emoji}
        </p>

        {/* Action bar */}
        <div style={{
          display: "flex", 
          flexDirection: "row",
          flexWrap: "nowrap", // Ensure one row
          alignItems: "center", 
          justifyContent: "center", 
          padding: isMobile ? "8px 10px" : "10px 16px", // Tighter padding for a better fit
          background: "rgba(242,233,211,0.42)", 
          borderRadius: "14px", 
          border: "1px solid rgba(213,199,166,0.22)",
          boxShadow: "0 4px 18px rgba(0,0,0,0.015)", 
          marginBottom: isMobile ? "28px" : "20px", // Increased margin to push typewriter down slightly
          animation: "fadeInUp 0.45s cubic-bezier(0.22,1,0.36,1) 0.28s both", 
          opacity: 0, 
          gap: isMobile ? "6px" : "14px", // Tighter gap to avoid overflow
          width: "100%", 
          maxWidth: isMobile ? "calc(100vw - 32px)" : "fit-content", 
          boxSizing: "border-box",
          overflow: "hidden", // Removed horizontal scrolling
          flexShrink: 0, // Prevent container itself from shrinking
        }}>
          {/* Sound */}
          <button onClick={() => {
            const newState = !soundEnabled;
            setSoundEnabled(newState);
            showToast(newState ? "Sound turned on" : "Sound turned off");
          }} 
            style={{
              padding: isMobile ? "8px 10px" : "12px 18px", 
              width: "auto", 
              height: "auto",
              background: "#F2E9D3", 
              border: "1px solid rgba(213,199,166,0.55)",
              borderRadius: "10px", 
              cursor: "pointer", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              color: "#200B0A", 
              transition: "all 0.15s ease", 
              flex: isMobile ? "1 1 auto" : "0 0 auto",
              minWidth: 0,
              maxWidth: "max-content",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#E8DCC0"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#F2E9D3"; (e.currentTarget as HTMLElement).style.transform = "none"; }}
          >
            {soundEnabled
              ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, width: "18px", height: "18px", minWidth: "18px", minHeight: "18px" }}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
              : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, width: "18px", height: "18px", minWidth: "18px", minHeight: "18px" }}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
            }
          </button>

          {/* Change mood */}
          <button onClick={() => setIsMoodModalOpen(true)} 
            style={{ 
              padding: isMobile ? "8px 10px" : "12px 18px", 
              height: "auto",
              background: "#F2E9D3", 
              border: "1px solid rgba(213,199,166,0.55)",
              borderRadius: "10px", 
              cursor: "pointer", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              gap: "6px",
              color: "#200B0A", 
              fontFamily: "Nunito, sans-serif", 
              fontSize: isMobile ? "12px" : "15px", 
              fontWeight: 600,
              transition: "all 0.15s ease", 
              whiteSpace: "nowrap",
              flex: isMobile ? "1 1 auto" : "0 0 auto",
              minWidth: 0,
              maxWidth: "max-content",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#E8DCC0"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#F2E9D3"; (e.currentTarget as HTMLElement).style.transform = "none"; }}
            onMouseDown={e => { (e.currentTarget as HTMLElement).style.transform = "scale(0.96)"; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, width: "18px", height: "18px", minWidth: "18px", minHeight: "18px" }}><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg>
            Change Mood
          </button>

          {/* Share */}
          <button onClick={() => setIsShareOpen(true)} disabled={!canShare} 
            style={{ 
              padding: isMobile ? "8px 10px" : "12px 18px", 
              height: "auto",
              background: "#F2E9D3", 
              border: "1px solid rgba(213,199,166,0.55)",
              borderRadius: "10px", 
              cursor: canShare ? "pointer" : "not-allowed", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              gap: "6px",
              color: "#200B0A", 
              fontFamily: "Nunito, sans-serif", 
              fontSize: isMobile ? "12px" : "15px", 
              fontWeight: 600,
              transition: "all 0.15s ease", 
              opacity: canShare ? 1 : 0.5, 
              whiteSpace: "nowrap",
              flex: isMobile ? "1 1 auto" : "0 0 auto",
              minWidth: 0,
              maxWidth: "max-content",
            }}
            onMouseEnter={e => { if (canShare) { (e.currentTarget as HTMLElement).style.background = "#E8DCC0"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; } }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#F2E9D3"; (e.currentTarget as HTMLElement).style.transform = "none"; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, width: "18px", height: "18px", minWidth: "18px", minHeight: "18px" }}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            Share
          </button>

          {/* New Note */}
          <button onClick={handleNewNote} disabled={isTyping} 
            style={{ 
              padding: isMobile ? "8px 10px" : "12px 18px", 
              height: "auto",
              background: "#F2E9D3", 
              border: "1px solid rgba(213,199,166,0.55)",
              borderRadius: "10px", 
              cursor: isTyping ? "not-allowed" : "pointer", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              gap: "6px",
              color: "#200B0A", 
              fontFamily: "Nunito, sans-serif", 
              fontSize: isMobile ? "12px" : "15px", 
              fontWeight: 600,
              transition: "all 0.15s ease", 
              opacity: isTyping ? 0.5 : 1, 
              whiteSpace: "nowrap",
              flex: isMobile ? "1 1 auto" : "0 0 auto",
              minWidth: 0,
              maxWidth: "max-content",
            }}
            onMouseEnter={e => { if (!isTyping) { (e.currentTarget as HTMLElement).style.background = "#E8DCC0"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; } }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#F2E9D3"; (e.currentTarget as HTMLElement).style.transform = "none"; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, width: "18px", height: "18px", minWidth: "18px", minHeight: "18px" }}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            New Note
          </button>
        </div>

        {/* Typewriter + paper */}
        <div
          style={{
            position: "relative", 
            // Calculated width: takes near full width but scales down if the screen is too short (max 62% of viewport height)
            width: isMobile ? "min(98vw, calc((100dvh - 200px) * 1.45))" : "min(90vw, 780px)", 
            animation: "zoomFadeIn 0.6s cubic-bezier(0.22,1,0.36,1) 0.45s both", 
            opacity: 0,
            filter: "drop-shadow(0px 10px 26px rgba(0,0,0,0.10))",
            transform: isShaking ? `translateX(${shakeX}px) translateY(${isShaking ? -0.5 : 0}px)` : "translateX(0) translateY(0)",
            transition: isShaking ? "none" : "transform 0.1s ease",
          }}
        >
          <img
            src={typewriterScreen}
            alt="Vintage typewriter"
            onLoad={() => setImgLoaded(true)}
            style={{ 
              width: "100%", 
              height: "auto", 
              display: "block", 
              animation: isTyping ? "typewriter-vibrate 0.12s linear infinite" : "none"
            }}
          />
          <div
            ref={paperRef}
            data-testid="text-typewriter-output"
            style={{
              position: "absolute", top: "2%", left: "14%", width: "70%", height: "35%",
              overflowY: "scroll", overflowX: "hidden", padding: "4px 6px",
              boxSizing: "border-box", scrollbarWidth: "none", msOverflowStyle: "none",
            } as React.CSSProperties}
          >
            <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: "14px", lineHeight: "1.55", letterSpacing: "0.4px", color: "#200B0A", wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
              {displayedText}
              <span style={{ display: "inline-block", width: "1.5px", height: "14px", backgroundColor: "#200B0A", marginLeft: "1px", verticalAlign: "middle", animation: "blink 0.75s step-end infinite" }} />
            </div>
          </div>
        </div>

        {/* Status */}
        <p style={{ marginTop: isMobile ? "10px" : "4px", fontFamily: "Nunito, sans-serif", fontSize: "12px", color: "#9E8A7E", textAlign: "center", minHeight: "18px", animation: "fadeIn 0.4s ease 0.7s both", opacity: 0 }}>
          {isTyping ? "Your note is being written…" : typingDone ? "Your note is ready." : ""}
        </p>
      </div>

      {/* ── MOOD MODAL ── */}
      {isMoodModalOpen && (
        <div 
          onClick={(e) => { if(e.target === e.currentTarget) setIsMoodModalOpen(false); }}
          style={{
            position: "fixed", inset: 0, 
            backgroundColor: "rgba(77, 59, 55, 0.35)", // Softer espresso overlay
            backdropFilter: "blur(6px)", display: "flex", alignItems: "center",
            justifyContent: "center", zIndex: 1000, padding: "16px",
            animation: "fadeIn 0.25s ease"
          }}
        >
          <div style={{
            backgroundColor: "#FFFAEB", borderRadius: "24px", width: "100%", maxWidth: "420px",
            padding: "24px", position: "relative",
            boxShadow: "0 22px 50px rgba(77, 59, 55, 0.18)",
            animation: "modalSlideUp 0.38s cubic-bezier(0.22,1,0.36,1)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontFamily: "Nunito, sans-serif", fontSize: "18px", fontWeight: 700, color: "#200B0A", margin: 0 }}>
                What's your mood today?
              </h2>
              <button 
                onClick={() => setIsMoodModalOpen(false)}
                style={{ background: "transparent", border: "none", cursor: "pointer", padding: "4px", color: "#9E8A7E", transition: "all 0.15s ease", borderRadius: "50%" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(213,199,166,0.3)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {Object.entries(moodData).map(([key, data]) => (
                <button
                  key={key}
                  className="mood-modal-btn"
                  onClick={() => {
                    setMood(key);
                    setQuoteIndex(Math.floor(Math.random() * data.quotes.length));
                    setIsMoodModalOpen(false);
                    if (onMoodChange) onMoodChange(key);
                    showToast("Mood updated");
                  }}
                  style={{
                    padding: "12px 16px",
                    background: mood === key ? "#EBDDBE" : "#F2E9D3", // Lighter selected state
                    border: mood === key ? "1.5px solid #D5C7A6" : "1px solid rgba(213,199,166,0.6)",
                    borderRadius: "10px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    transition: "all 0.18s ease",
                    boxShadow: mood === key ? "inset 0 1px 3px rgba(77, 59, 55, 0.04)" : "0px 2px 6px rgba(0,0,0,0.04)",
                    transform: mood === key ? "scale(0.98)" : "scale(1)"
                  }}
                  onMouseEnter={e => { 
                    if (mood !== key) {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = "#E8DCC0";
                      el.style.transform = "translateY(-1px) scale(1.02)";
                    }
                  }}
                  onMouseLeave={e => { 
                    if (mood !== key) {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = "#F2E9D3";
                      el.style.transform = "scale(1)";
                    }
                  }}
                  onMouseDown={e => { (e.currentTarget as HTMLElement).style.transform = "scale(0.96)"; }}
                >
                  <span style={{ fontSize: "18px" }}>{data.emoji}</span>
                  <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "14px", fontWeight: 600, color: "#200B0A" }}>
                    {data.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SAVE MODAL ── */}
      {isShareOpen && (
        <div
          onClick={e => { 
            if (e.target === e.currentTarget) {
              setIsShareOpen(false);
              setDownloadComplete(false);
            }
          }}
          style={{
            position: "fixed", inset: 0, backgroundColor: "rgba(32,11,10,0.45)",
            backdropFilter: "blur(6px)", display: "flex", alignItems: "center",
            justifyContent: "center", zIndex: 1000, padding: "16px",
            animation: "fadeIn 0.25s ease",
            overflowY: "auto",
          }}
        >
          <div style={{
            backgroundColor: "#FFFAEB", borderRadius: "24px", width: "100%", maxWidth: "390px",
            padding: "28px 24px 24px", position: "relative",
            boxShadow: "0 28px 70px rgba(32,11,10,0.22)",
            animation: "modalSlideUp 0.38s cubic-bezier(0.22,1,0.36,1)",
          }}>
            {/* Close */}
            <button
              onClick={() => {
                setIsShareOpen(false);
                setDownloadComplete(false);
              }}
              style={{ position: "absolute", top: "20px", right: "20px", background: "transparent", border: "none", cursor: "pointer", color: "#9E8A7E", padding: "4px", borderRadius: "50%", transition: "background 0.15s", lineHeight: 0 }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(213,199,166,0.4)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>

            {/* Title — left aligned */}
            <h2 style={{ fontFamily: "Nunito, sans-serif", fontSize: "19px", color: "#200B0A", textAlign: "left", marginBottom: "18px", fontWeight: 700, letterSpacing: "-0.3px" }}>Save or Share</h2>

            {/* ── Large quote card — fills modal width ── */}
            <div style={{
              width: "100%", aspectRatio: "9 / 16", maxHeight: "320px",
              backgroundColor: "#FEFAF0", margin: "0 auto 20px",
              borderRadius: "16px", border: "1px solid #D5C7A6",
              boxShadow: "0 4px 18px rgba(213,199,166,0.22), 0 1px 4px rgba(0,0,0,0.05)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              padding: "28px 24px", boxSizing: "border-box", gap: "18px",
            }}>
              {/* Decorative diamonds */}
              <div style={{ fontSize: "16px", color: "#C4A97A", letterSpacing: "10px", lineHeight: 1 }}>✦ ✦ ✦</div>

              {/* Quote paper area */}
              <div style={{
                fontFamily: "'Courier Prime', monospace", fontSize: "clamp(10px,2vw,13px)",
                lineHeight: "1.75", color: "#200B0A", textAlign: "center",
                background: "#F2E9D3", padding: "16px 14px", borderRadius: "10px", width: "100%",
                border: "1px solid rgba(213,199,166,0.35)", boxSizing: "border-box" as const,
              }}>
                {currentQuote}
              </div>

              {/* Card footer */}
              <div style={{ fontFamily: "Nunito, sans-serif", fontSize: "8px", color: "#B8A99E" }}>Written with Cozy Typewriter</div>
            </div>

            {/* ── Buttons ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

              {/* Share to Stories / Open Instagram — full width */}
              {downloadComplete ? (
                <button
                  onClick={openInstagram}
                  style={{ ...modalBtn(), justifyContent: "center", height: "48px", width: "100%" }}
                  onMouseEnter={e => hover(e, true)}
                  onMouseLeave={e => hover(e, false)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, width: "16px", height: "16px" }}>
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4.5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                  </svg>
                  Open Instagram
                </button>
              ) : (
                <button
                  onClick={shareToInstagram}
                  disabled={isDownloading}
                  style={{ ...modalBtn(), justifyContent: "center", height: "48px", width: "100%", opacity: isDownloading ? 0.6 : 1 }}
                  onMouseEnter={e => hover(e, true)}
                  onMouseLeave={e => hover(e, false)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, width: "16px", height: "16px" }}>
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4.5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                  </svg>
                  {isDownloading ? "Preparing…" : "Share to Stories"}
                </button>
              )}

              {/* WhatsApp + X */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <button onClick={shareWhatsapp} style={{ ...modalBtn(), justifyContent: "center" }} onMouseEnter={e => hover(e, true)} onMouseLeave={e => hover(e, false)}>
                  <WhatsAppIcon size={16} /> WhatsApp
                </button>
                <button onClick={shareX} style={{ ...modalBtn(), justifyContent: "center" }} onMouseEnter={e => hover(e, true)} onMouseLeave={e => hover(e, false)}>
                  <XIcon size={16} /> X
                </button>
              </div>

              {/* Save TXT + Download */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <button onClick={downloadAsTxt} style={{ ...modalBtn(), justifyContent: "center" }} onMouseEnter={e => hover(e, true)} onMouseLeave={e => hover(e, false)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, width: "16px", height: "16px" }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                  Save TXT
                </button>
                <button onClick={downloadAsImage} disabled={isDownloading} style={{ ...modalBtn(), justifyContent: "center", opacity: isDownloading ? 0.6 : 1 }} onMouseEnter={e => hover(e, true)} onMouseLeave={e => hover(e, false)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, width: "16px", height: "16px" }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  {isDownloading ? "Saving…" : "Download"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Hidden 9:16 card for image export ── */}
      <div ref={downloadCardRef} style={{
        display: "none", position: "fixed", left: "-9999px", top: "0",
        width: "360px", height: "640px",
        backgroundColor: "#FFFAEB",
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(213,199,166,0.18) 31px, rgba(213,199,166,0.18) 32px)",
        backgroundSize: "100% 32px",
        flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "40px 30px", boxSizing: "border-box", gap: "20px",
      }}>
        <div style={{ textAlign: "center", width: "100%" }}>
          <h1 style={{ fontFamily: "Libre Baskerville, serif", fontSize: "32px", color: "#200B0A", margin: "0 0 4px", fontWeight: 700 }}>Your Little Note</h1>
          <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "14px", color: "#4D3B37", margin: "0 0 12px" }}>A moment of quiet reflection.</p>
          <div style={{ fontSize: "16px", color: "#C4A97A", letterSpacing: "8px" }}>✦ ✦ ✦</div>
        </div>

        <div style={{ position: "relative", width: "100%", maxWidth: "320px", filter: "drop-shadow(0px 10px 24px rgba(0,0,0,0.12))", marginTop: "10px" }}>
          <img src={typewriterScreen} style={{ width: "100%", height: "auto", display: "block" }} />
          <div style={{
            position: "absolute", top: "2%", left: "14%", width: "70%", height: "35%",
            padding: "2px 4px", boxSizing: "border-box", overflow: "hidden"
          }}>
            <div style={{ 
              fontFamily: "'Courier Prime', monospace", 
              fontSize: "12px", 
              lineHeight: "1.55", 
              letterSpacing: "0.2px", 
              color: "#200B0A", 
              wordBreak: "break-word", 
              whiteSpace: "pre-wrap" 
            }}>
              {currentQuote}
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "30px", width: "100%" }}>
          <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "12px", color: "#9E8A7E", fontWeight: 500 }}>Written with Cozy Typewriter</p>
        </div>
      </div>

      {/* ── TOAST NOTIFICATION ── */}
      {toast.visible && (
        <div style={{
          position: "fixed",
          bottom: "max(100px, calc(env(safe-area-inset-bottom) + 80px))",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#F2E9D3",
          border: "1px solid #D5C7A6",
          padding: "10px 20px",
          borderRadius: "12px",
          boxShadow: "0 8px 30px rgba(77, 59, 55, 0.12)",
          zIndex: 2000,
          animation: "toastFadeIn 0.3s ease-out forwards",
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <span style={{ 
            fontFamily: "Nunito, sans-serif", 
            fontSize: "13.5px", 
            fontWeight: 600, 
            color: "#200B0A",
            letterSpacing: "0.2px"
          }}>
            {toast.message}
          </span>
        </div>
      )}

      <style>{`
        @keyframes fadeInDown { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeInUp   { from { opacity:0; transform:translateY(10px);  } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn     { from { opacity:0; } to { opacity:1; } }
        @keyframes zoomFadeIn { from { opacity:0; transform:scale(0.92); } to { opacity:1; transform:scale(1); } }
        @keyframes modalSlideUp { from { opacity:0; transform:translateY(28px) scale(0.96); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes toastFadeIn { 
          0% { opacity: 0; transform: translate(-50%, 20px); } 
          100% { opacity: 1; transform: translate(-50%, 0); } 
        }
        @keyframes typewriter-vibrate {
          0% { transform: translateX(0); }
          25% { transform: translateX(0.5px); }
          75% { transform: translateX(-0.5px); }
          100% { transform: translateX(0); }
        }
        @keyframes blink      { 0%,100% { opacity:1; } 50% { opacity:0; } }
        [data-testid="text-typewriter-output"]::-webkit-scrollbar { display:none; }
        
        .footer-responsive {
          position: fixed;
          bottom: max(16px, env(safe-area-inset-bottom));
          left: 50%;
          transform: translateX(-50%);
          z-index: 5;
        }

        @media (min-width: 1024px) {
          .footer-responsive {
            position: relative;
            bottom: auto;
            left: auto;
            transform: none;
            margin-top: 50px;
            padding-bottom: max(40px, env(safe-area-inset-bottom));
          }
        }
      `}</style>
    </div>
  );
}
