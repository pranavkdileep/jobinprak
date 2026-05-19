"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const locations = [
  { value: "kochi", label: "Kochi", subtitle: "IN · KL" },
  { value: "trivandrum", label: "Trivandrum", subtitle: "IN · KL" },
] as const;

interface LocationSelectProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function LocationSelect({ value, onChange }: LocationSelectProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(value ?? "");
  const [animPhase, setAnimPhase] = useState<"idle" | "entering" | "open" | "exiting">("idle");
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const selectedLocation = locations.find((l) => l.value === selected);

  const close = useCallback(() => {
    if (animPhase !== "idle" && animPhase !== "exiting") {
      setAnimPhase("exiting");
      setTimeout(() => {
        setOpen(false);
        setAnimPhase("idle");
        setActiveIndex(-1);
      }, 200);
    }
  }, [animPhase]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [close]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        triggerRef.current?.focus();
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev < locations.length - 1 ? prev + 1 : 0));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : locations.length - 1));
      }
      if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        selectLocation(locations[activeIndex].value);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, activeIndex]);

  useEffect(() => {
    if (open && listRef.current && activeIndex >= 0) {
      const item = listRef.current.children[activeIndex] as HTMLElement | undefined;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex, open]);

  function selectLocation(val: string) {
    setSelected(val);
    setActiveIndex(locations.findIndex((l) => l.value === val));
    onChange?.(val);
    close();
  }

  function toggleOpen() {
    if (open) {
      close();
    } else {
      setOpen(true);
      setAnimPhase("entering");
      requestAnimationFrame(() => setAnimPhase("open"));
      const idx = locations.findIndex((l) => l.value === selected);
      setActiveIndex(idx >= 0 ? idx : 0);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={toggleOpen}
        onFocus={(e) => {
          const parent = e.currentTarget.closest("label");
          parent?.classList.add("border-primary", "bg-white");
        }}
        onBlur={(e) => {
          const parent = e.currentTarget.closest("label");
          if (!open) {
            parent?.classList.remove("border-primary", "bg-white");
          }
        }}
        className="flex w-full items-center gap-3 rounded-xl border border-transparent bg-transparent px-0 py-0 text-left transition-none"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-activedescendant={activeIndex >= 0 ? `location-opt-${activeIndex}` : undefined}
      >
        <PinIcon className="size-5 shrink-0 text-on-surface-variant transition-colors duration-300 group-focus-within:text-primary" />
        <span
          className={`flex-1 font-mono text-xs uppercase tracking-[0.18em] transition-colors duration-300 ${
            selectedLocation ? "text-on-surface" : "text-on-surface-variant"
          }`}
        >
          {selectedLocation ? selectedLocation.label : "Location Coordinates"}
        </span>
        <ChevronIcon
          className={`size-4 shrink-0 text-on-surface-variant transition-all duration-300 ${
            open ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className={`absolute left-0 z-50 mt-2 origin-top overflow-hidden rounded-xl border bg-white shadow-electric transition-all duration-200 ${
            animPhase === "entering" || animPhase === "exiting"
              ? "scale-y-95 opacity-0"
              : "scale-y-100 opacity-100"
          } border-outline-variant`}
          style={{
            minWidth: "100%",
            width: "max-content",
            transformOrigin: "top",
            transitionTimingFunction:
              animPhase === "exiting" ? "cubic-bezier(0.4, 0, 1, 1)" : "cubic-bezier(0, 0, 0.2, 1)",
          }}
        >
          <ul
            ref={listRef}
            role="listbox"
            aria-label="Select location"
            className="py-1"
          >
            {locations.map((loc, index) => {
              const isSelected = loc.value === selected;
              const isActive = index === activeIndex;
              return (
                <li
                  key={loc.value}
                  id={`location-opt-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => selectLocation(loc.value)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`relative flex cursor-pointer items-center gap-3 px-4 py-3 transition-all duration-150 ${
                    isActive
                      ? "bg-primary/8 text-primary"
                      : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                  }`}
                >
                  <span
                    className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                      isSelected
                        ? "border-primary bg-primary"
                        : "border-outline-variant"
                    }`}
                  >
                    {isSelected && (
                      <svg className="size-3 text-white" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span className="flex flex-col">
                    <span
                      className={`font-mono text-xs uppercase tracking-[0.18em] ${
                        isSelected ? "font-semibold text-primary" : ""
                      }`}
                    >
                      {loc.label}
                    </span>
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-on-surface-variant/60">
                      {loc.subtitle}
                    </span>
                  </span>
                  {isSelected && (
                    <span className="ml-auto size-1.5 rounded-full bg-primary" />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function PinIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21s7-5.1 7-12A7 7 0 1 0 5 9c0 6.9 7 12 7 12Z" stroke="currentColor" strokeWidth="2" />
      <path d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function ChevronIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
