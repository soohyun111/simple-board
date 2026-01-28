import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";
import { Menu, X } from "lucide-react";
import logo from "../img/logo.png";
import LoginMobile from "./LoginMobile";
import "./Header.css";

interface HeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function Header({
  isSidebarOpen,
  onToggleSidebar,
}: HeaderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 로그아웃
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="header">
      <button className="mobile-menu-button" onClick={onToggleSidebar}>
        {isSidebarOpen ? <X /> : <Menu />}
      </button>

      <div className="header-group">
        <a href="/">
          <img src={logo} />
        </a>
      </div>

      <div className="header-login">
        {user ? (
          <button className="login-btn logout" onClick={handleLogout}>
            로그아웃
          </button>
        ) : (
          <button
            className="login-btn login"
            onClick={() => setLoginOpen(true)}
          >
            로그인
          </button>
        )}
      </div>

      <LoginMobile
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLoginSuccess={() => setLoginOpen(false)}
      />
    </header>
  );
}
