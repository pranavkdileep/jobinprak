"use client";

import { useEffect, useState } from "react";

const phrases = [
  "Job Search",
  "Realtime Job Notification",
  "Resume",
  "Ai Email Gen",
];

export function TypingHeroTitle() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const phrase = phrases[phraseIndex];
  const text = phrase.slice(0, charIndex);

  useEffect(() => {
    const isComplete = charIndex === phrase.length;
    const isEmpty = charIndex === 0;
    const delay = isDeleting ? 45 : isComplete ? 1200 : 85;

    const timeout = window.setTimeout(() => {
      if (!isDeleting && isComplete) {
        setIsDeleting(true);
        return;
      }

      if (isDeleting && isEmpty) {
        setIsDeleting(false);
        setPhraseIndex((current) => (current + 1) % phrases.length);
        return;
      }

      setCharIndex((current) => current + (isDeleting ? -1 : 1));
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [charIndex, isDeleting, phrase.length]);

  return (
    <h1
      className="mb-6 font-headline text-[clamp(2.7rem,11vw,5.8rem)] font-bold leading-[0.98] tracking-[-0.08em] text-on-background md:tracking-[-0.075em]"
      aria-label={`One Platform ${phrase}`}
    >
      <span className="block">One Platform For</span>
      <span className="block min-h-[1em] text-primary">
        {text}
        <span className="ml-1 inline-block animate-pulse text-primary" aria-hidden="true">
          _
        </span>
      </span>
    </h1>
  );
}
