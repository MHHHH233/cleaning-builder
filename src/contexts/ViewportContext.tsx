"use client";

import React, { createContext, useContext } from "react";

export type ViewportMode = "desktop" | "tablet" | "mobile";

const ViewportContext = createContext<ViewportMode>("desktop");

export const ViewportProvider: React.FC<{
  mode: ViewportMode;
  children: React.ReactNode;
}> = ({ mode, children }) => {
  return (
    <ViewportContext.Provider value={mode}>
      {children}
    </ViewportContext.Provider>
  );
};

export const useViewport = () => useContext(ViewportContext);
