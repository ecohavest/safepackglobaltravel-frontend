import React, { createContext, useState, useContext, useEffect } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in by verifying token presence
    const token = localStorage.getItem("admin_token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    console.log("Login attempt:", username, password);
    try {
      const response = await fetch(
        "https://ghost.safepackglobaltravel.com/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem("admin_token", data.token);
          setIsAuthenticated(true);
          return true;
        }
      }
      // If login fails or token not received
      setIsAuthenticated(false); // Ensure state is updated on failure
      localStorage.removeItem("admin_token"); // Clear any stale token
      return false;
    } catch (error) {
      console.error("Login error:", error);
      setIsAuthenticated(false);
      localStorage.removeItem("admin_token");
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin_token");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Example of wrapping an API call to include the JWT token
/*
export const fetchTrackingData = async () => {
  const token = localStorage.getItem("admin_token");
  if (!token) {
    // Handle cases where token is not available (e.g., redirect to login)
    console.error("No admin token found");
    return null; // Or throw an error
  }

  try {
    const response = await fetch("/api/admin/tracking", { // Example endpoint
      method: "GET", // Or POST, PUT, DELETE as needed
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      // body: JSON.stringify(payload), // For POST/PUT requests
    });

    if (!response.ok) {
      // Handle non-successful responses (e.g., 401, 403, 500)
      if (response.status === 401) {
        // Maybe trigger logout or token refresh logic
        console.error("Unauthorized, token might be invalid or expired.");
      }
      throw new Error(`API call failed with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching tracking data:", error);
    return null; // Or throw error
  }
};
*/
