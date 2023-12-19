import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material";

export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: {
              dark: "#3c3382",
              main: "#766AFF",
              light: "#aca8ff",
              divider: "#F2F4F7",
            },
            secondary: {
              main: "#9d83ff",
              dark: "#4e437f",
              light: "#c8b6ff",
            },
            background: {
              default: "#000000",
            },
            red: {
              main: "#db4f4a",
            },
            green: {
              main: "#4cceac",
            },
            text: {
              main: "#6c737f",
            },
            accent: {
              main: "#c8b6ff",
            },
          }
        : {
            primary: {
              dark: "#766AFF",
              main: "#aca8ff",
              light: "#ccaefc",
              divider: "#F2F4F7",
            },
            secondary: {
              main: "#708aff",
              dark: "#4e61b3",
              light: "#b8c5ff",
            },
            background: {
              default: "#ffffff",
            },
            red: {
              main: "#db4f4a",
            },
            green: {
              main: "#4cceac",
            },
            text: {
              main: "#6c737f",
            },
          }),
    },
    typography: {
      fontFamily: ["Source Sans Pro", "sams-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Source Sans Pro", "sams-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Source Sans Pro", "sams-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Source Sans Pro", "sams-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Source Sans Pro", "sams-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Source Sans Pro", "sams-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Source Sans Pro", "sams-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  // Determine if the current user is on an admin page
  const isAdmin =
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/admin");

  const [mode, setMode] = useState(() => {
    if (isAdmin) {
      const storedMode = window.localStorage.getItem("theme");
      return storedMode ? storedMode : "dark";
    } else {
      return "dark"; // Always use dark mode for non-admin pages
    }
  });

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        if (isAdmin) {
          setMode((prev) => {
            const newMode = prev === "light" ? "dark" : "light";
            if (typeof window !== "undefined") {
              window.localStorage.setItem("theme", newMode);
            }
            return newMode;
          });
        }
      },
    }),
    [isAdmin]
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return [theme, colorMode];
};
