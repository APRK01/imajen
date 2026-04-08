"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface FilterContextType {
  activeTopic: string;
  setActiveTopic: (topic: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [activeTopic, setActiveTopic] = useState("All Art");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("home");

  React.useEffect(() => {
    (window as any).setActiveTopic = setActiveTopic;
  }, []);

  return (
    <FilterContext.Provider value={{ 
      activeTopic, 
      setActiveTopic, 
      searchQuery, 
      setSearchQuery,
      activeTab,
      setActiveTab
    }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
}
