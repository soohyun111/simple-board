import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { PencilLine } from "lucide-react";
import Swal from "sweetalert2";
import "./Write.css";

export default function Edit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    // 수정할 게시글 조회
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("title, content")
        .eq("id", postId)
        .single();

      if (error) {
        Swal.fire("게시글을 불러올 수 없습니다.");
        navigate(-1);
        return;
      }

      setTitle(data.title);
      setContent(data.content);
      setLoading(false);
    };

    fetchPost();
  }, [id, postId, navigate]);

  const handleUpdate = async (e: React.FormEvent) => {
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

    const { error } = await supabase
      .from("posts")
      .update({ title, content })
      .eq("id", Number(id));

    if (error) {
      Swal.fire("글 수정 실패");
      console.error(error);
      return;
    }

    Swal.fire("글이 수정되었습니다.");
    navigate(`/posts/${id}`);
  };

  return (
    <section className="write">
      <h2 className="write-title">
        <PencilLine />
        <span>글 수정하기</span>
      </h2>

      <form className="write-form" onSubmit={handleUpdate}>
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
            onClick={() => navigate(-1)}
          >
            취소
          </button>
          <button type="submit" className="btn-submit">
            {loading ? "수정중..." : "수정"}
          </button>
        </div>
      </form>
    </section>
  );
}
