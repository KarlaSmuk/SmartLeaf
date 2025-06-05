import { useEffect, useState } from "react";
import { clearAccessToken, getCurrentUser } from "../utils/auth";
import { UserContext } from "./UserContext";

export type User = {
  id: string;
  fullName: string;
  email: string;
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const fetchedUser = await getCurrentUser();
        setUser(fetchedUser);
      } catch (err) {
        console.error("Error fetching user in provider:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const logout = () => {
    clearAccessToken();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, loading, error }}>
      {children}
    </UserContext.Provider>
  );
}
