import { createContext } from "react";

export const AppContext = createContext({
  presetName: "",
  cloudName: "",
});

export const AppProvider = ({ children }) => {
  // const deleteKey = "";

  const presetName = "xliy3xzm";
  const cloudName = "dyj66sruf";

  const value = {
    presetName,
    cloudName,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
