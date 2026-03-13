import { useEffect, useRef, useState } from "react";

interface Note {
  text: string;
  rot: number;
  delay: number;
  // Positioning
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  translateX?: string;
}

const NOTES: Note[] = [
  { text: "slow down", top: "6%",    left: "50%",  translateX: "-50%", rot: 2,  delay: 1.5 }, // Top Center
  { text: "breathe",   top: "20%",   left: "5%",                       rot: -4, delay: 0   }, // Mid Left
  { text: "pause",     top: "20%",   right: "5%",                      rot: 3,  delay: 3.2 }, // Mid Right
  { text: "reflect",   bottom: "16%", left: "6%",                       rot: -3, delay: 2.1 }, // Bottom Left
  { text: "unwind",    bottom: "16%", right: "6%",                      rot: 2,  delay: 0.8 }, // Bottom Right
  { text: "gentle",    bottom: "4%",  left: "50%",  translateX: "-50%", rot: 1,  delay: 4.2 }, // Bottom Center
];

function FloatingNote({ note }: { note: Note }) {
  const [nudge, setNudge] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 130) {
        const force = (130 - dist) / 130;
        setNudge({
          x: -(dx / (dist || 1)) * 25 * force,
          y: -(dy / (dist || 1)) * 25 * force,
        });
      } else {
        setNudge({ x: 0, y: 0 });
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const baseStyle: React.CSSProperties = {
    position: "fixed",
    top: note.top,
    bottom: note.bottom,
    left: note.left,
    right: note.right,
    zIndex: 0,
    pointerEvents: "none",
    userSelect: "none",
  };

  return (
    <div ref={ref} style={baseStyle}>
      <div
        style={{
          background: "#F6EEDB",
          padding: "6px 14px",
          borderRadius: "3px",
          boxShadow: "0 3px 12px rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.02)",
          fontFamily: "'Courier Prime', 'Special Elite', monospace",
          fontSize: "clamp(10px, 0.75vw, 12.5px)",
          color: "rgba(32,11,10,0.42)",
          border: "1px solid rgba(213,199,166,0.18)",
          whiteSpace: "nowrap",
          transform: `translate(calc(${note.translateX || '0px'} + ${nudge.x}px), ${nudge.y}px) rotate(${note.rot}deg)`,
          transition: "transform 1.1s cubic-bezier(0.2,0.8,0.2,1)",
          animation: `drift 9s ease-in-out ${note.delay}s infinite alternate`,
        }}
      >
        {note.text}
      </div>
    </div>
  );
}

export default function FloatingNotes() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {NOTES.map((n, i) => {
          // Responsive positions to avoid center interaction area on mobile
          // Upper background: 0-15%, Lower background: 85-100%
          const pos = { ...n };
          if (isMobile) {
            if (i === 0) { // slow down
              pos.top = "calc(68px + env(safe-area-inset-top))";
              pos.left = "50%";
              pos.translateX = "-50%";
            }
            if (i === 1) pos.top = "calc(10% + env(safe-area-inset-top))"; // breathe
            if (i === 2) pos.top = "calc(11% + env(safe-area-inset-top))"; // pause
            if (i === 3) pos.bottom = "calc(12% + env(safe-area-inset-bottom))"; // reflect
            if (i === 4) pos.bottom = "calc(13% + env(safe-area-inset-bottom))"; // unwind
            if (i === 5) pos.bottom = "calc(55px + env(safe-area-inset-bottom))";  // gentle
          }
          
          return <FloatingNote key={i} note={pos} />;
        })}
      </div>
      <style>{`
        @keyframes drift {
          0%   { translate: 0px  0px;  }
          33%  { translate: 1px -6px;  }
          66%  { translate: -2px 3px;  }
          100% { translate: 1px -9px;  }
        }
      `}</style>
    </>
  );
}
