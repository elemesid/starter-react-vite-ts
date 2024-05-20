import React, { ReactNode, useState } from "react";

export interface IUnsavedWarnContext {
  warnWhen?: boolean;
  setWarnWhen?: (value: boolean) => void;
}

export const UnsavedWarnContext = React.createContext<IUnsavedWarnContext>({});

export const UnsavedWarnContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [warnWhen, setWarnWhen] = useState(false);

  return <UnsavedWarnContext.Provider value={{ warnWhen, setWarnWhen }}>{children}</UnsavedWarnContext.Provider>;
};
