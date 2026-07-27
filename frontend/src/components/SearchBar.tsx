import type { ChangeEvent } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    onChange(e.target.value);

  return (
    <input
      className="input"
      type="search"
      placeholder="Search tasks by title…"
      value={value}
      onChange={handleChange}
      aria-label="Search tasks by title"
      style={{ maxWidth: 320 }}
    />
  );
}
