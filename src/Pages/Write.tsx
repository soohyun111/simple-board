import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { PencilLine } from "lucide-react";
import "./Write.css";

export default function Write() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  /* 유효성 검사*/
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
      alert("제목을 입력해주세요.");
      return;
    } else if(!author){
      alert("작성자를 입력해주세요.");
      return;
    }else if(!content){
      alert("내용을 입력해주세요");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          title,
          author,
          content,
        },
      ])
    .select()
    .single();


    if (error) {
      alert("글 등록 실패");
      console.error(error);
      return;
    }

    alert("글이 등록되었습니다.");
    navigate(`/posts/${data.id}`);
  };

  return (
    <section className="write">
        <h2 className="write-title"><PencilLine /><span>글쓰기</span></h2>

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
          <label>작성자</label>
          <input
            type="text"
            placeholder="이름을 입력하세요"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
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
          <Link to ="/" type="button" className="btn-cancel">
            취소
          </Link>
          <button type="submit" className="btn-submit">
            {loading ? "등록중..." : "등록"}
          </button>
        </div>
      </form>
    </section>
  );
}
