import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { PencilLine } from "lucide-react";
import Swal from "sweetalert2";
import "./Write.css";

export default function Write() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!title) {
      Swal.fire("제목을 입력해주세요.");
      return;
    }
    if (!content) {
      Swal.fire("내용을 입력해주세요");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("posts")
      .insert([{ title, content }])
      .select()
      .single();

    if (error) {
      Swal.fire("글 등록 실패");
      console.error(error);
      return;
    }

    Swal.fire("글이 등록되었습니다.");
    navigate(`/posts/${data.id}`);
  };

  return (
    <section className="write">
      <h2 className="write-title">
        <PencilLine />
        <span>자유게시판 - 글쓰기</span>
      </h2>

      <form className="write-form" onSubmit={handleSubmit}>
        <div className="write-field">
          <label>제목</label>
          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="write-field">
          <label>내용</label>
          <textarea
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
          />
        </div>

        <div className="write-actions">
          <button
            type="button"
            className="btn-cancel"
            disabled={loading}
            onClick={() => navigate("-1")}
          >
            취소
          </button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "등록중..." : "등록"}
          </button>
        </div>
      </form>
    </section>
  );
}
