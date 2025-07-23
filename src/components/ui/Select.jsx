import React, { useState, useRef, useEffect } from "react";

export function Select({ children, onChange, value, className, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    window.addEventListener("click", onClickOutside);
    return () => window.removeEventListener("click", onClickOutside);
  }, []);

  return (
    <div className={`relative inline-block w-48 ${className}`} ref={ref}>
      <SelectTrigger onClick={() => setOpen(!open)}>
        <SelectValue>{value || placeholder || "Select..."}</SelectValue>
      </SelectTrigger>
      {open && <SelectContent onChange={(val) => { onChange(val); setOpen(false); }}>{children}</SelectContent>}
    </div>
  );
}

export function SelectTrigger({ children, onClick, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left border rounded px-3 py-2 bg-white cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}

export function SelectValue({ children, className }) {
  return <span className={`block truncate ${className}`}>{children}</span>;
}

export function SelectContent({ children, onChange, className }) {
  return (
    <ul
      className={`absolute mt-1 w-full bg-white border rounded shadow-lg max-h-60 overflow-auto z-10 ${className}`}
    >
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { onSelect: onChange })
      )}
    </ul>
  );
}

export function SelectItem({ children, value, onSelect, className }) {
  return (
    <li
      onClick={() => onSelect && onSelect(value)}
      className={`cursor-pointer px-3 py-2 hover:bg-blue-100 ${className}`}
      role="option"
      tabIndex={0}
    >
      {children}
    </li>
  );
}
