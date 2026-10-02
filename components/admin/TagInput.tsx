"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

export default function TagInput({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
}) {
  const [input, setInput] = useState("");

  function add() {
    const v = input.trim();
    if (!v) return;
    onChange([...values, v]);
    setInput("");
  }

  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-xs uppercase tracking-wide text-[#6B6B6B]">
        {label}
      </label>
      <div className="mb-2 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="w-full rounded-xl border-2 border-[#010100] bg-white px-3 py-2.5 text-sm outline-none focus:bg-[#E3E1E0]"
        />
        <button
          type="button"
          onClick={add}
          className="rounded-xl border-2 border-[#010100] bg-[#922842] px-3 text-white"
        >
          <Plus size={16} />
        </button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {values.map((v, i) => (
            <span
              key={i}
              className="flex items-center gap-1.5 rounded-full border border-[#010100] bg-[#E3E1E0] px-3 py-1 text-xs"
            >
              {v}
              <button
                type="button"
                onClick={() => onChange(values.filter((_, idx) => idx !== i))}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
