import { Link } from "react-router-dom";
import { PencilLine } from "lucide-react";
import "./Write.css";

export default function Write() {
  return (
    <section className="write">
        <h2 className="write-title"><PencilLine /><span>글쓰기</span></h2>

      <form className="write-form">
        <div className="write-field">
          <label>제목</label>
          <input
            type="text"
            placeholder="제목을 입력하세요"
          />
        </div>

        <div className="write-field">
          <label>작성자</label>
          <input
            type="text"
            placeholder="이름을 입력하세요"
          />
        </div>

        <div className="write-field">
          <label>내용</label>
          <textarea
            placeholder="내용을 입력하세요"
            rows={10}
          />
        </div>

        <div className="write-actions">
          <Link to ="/" type="button" className="btn-cancel">
            취소
          </Link>
          <button type="submit" className="btn-submit">
            등록
          </button>
        </div>
      </form>
    </section>
  );
}
