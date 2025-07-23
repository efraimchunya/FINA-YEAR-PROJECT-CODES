import React, { useState, createContext, useContext } from "react";

const TabsContext = createContext();

export function Tabs({ defaultValue, children }) {
  const [active, setActive] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }) {
  return <div className={`flex border-b ${className}`}>{children}</div>;
}

export function TabsTrigger({ value, children, className }) {
  const { active, setActive } = useContext(TabsContext);
  const isActive = active === value;
  return (
    <button
      onClick={() => setActive(value)}
      className={`px-4 py-2 cursor-pointer border-b-2 ${
        isActive ? "border-blue-600 font-semibold" : "border-transparent"
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className }) {
  const { active } = useContext(TabsContext);
  return active === value ? <div className={className}>{children}</div> : null;
}
