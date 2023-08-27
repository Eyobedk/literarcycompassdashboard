import { createContext } from "react";

export const AppContext = createContext({
  presetName: "",
  cloudName: "",
});

export const AppProvider = ({ children }) => {
  // const deleteKey = "";

  const presetName = "e3jaubid";
  const cloudName = "forfeta";

  const value = {
    presetName,
    cloudName,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
