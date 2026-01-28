import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";
import "./LoginPC.css";

export default function LoginPC() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
  }

  // 로그아웃
  async function handleLogout() {
    await supabase.auth.signOut();

    setEmail("");
    setPassword("");
    setError(null);
    setIsSubmitting(false);
  }

  // 로그인 이후
  if (user) {
    return (
      <main className="admin-login">
        <div className="admin-login-welcome">
          <p>
            <strong>{user.email}</strong>님, 환영합니다.
          </p>

          <div className="admin-login-actions">
            <button
              className="admin-logout-button"
              onClick={() => navigate("/")}
            >
              홈으로
            </button>
            <button className="admin-logout-button" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        </div>
      </main>
    );
  }

  // 로그인 전
  return (
    <main className="admin-login">
      <form className="admin-login-form" onSubmit={handleSubmit}>
        <h1 className="admin-login-title">관리자 로그인</h1>

        <input
          className="admin-login-input"
          type="email"
          placeholder="이메일 주소"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          required
        />

        <input
          className="admin-login-input"
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        {error && <p className="admin-login-error">{error}</p>}

        <button
          className="admin-login-button"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </main>
  );
}
