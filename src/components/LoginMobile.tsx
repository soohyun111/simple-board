import { useState } from "react";
import { supabase } from "../lib/supabase";
import { X } from "lucide-react";
import "./LoginMobile.css";

type Props = {
  open: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
};

export default function LoginMobile({ open, onClose, onLoginSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      setLoading(false);
      return;
    }

    setEmail("");
    setPassword("");
    setLoading(false);
    onLoginSuccess();
  }

  if (!open) return null;

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={30} />
        </button>

        <h2 className="login-title">관리자 로그인</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="login-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
}
