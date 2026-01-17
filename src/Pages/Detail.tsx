import { useNavigate, useParams } from "react-router-dom";
import { NotepadText } from "lucide-react";
import "./Detail.css";

export default function Detail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const postId = Number(id);

    const prevId = postId > 1 ? postId - 1 : null;
    const nextId = postId + 1; // 데이터 연결 후 수정
    
  return (
    <div className="detail">
      <h1 className="detail-title"><NotepadText /><span>게시글 제목입니다</span></h1>

      <div className="detail-meta">
        <span>작성자: 홍길동</span>
        <span>작성일: 2026-01-17</span>
        <span>조회수: 123</span>
      </div>

      <div className="detail-content">
        <p>
          여기는 게시글 내용입니다.  <br />
          여러 줄의 텍스트가 들어갈 수 있고, <br /> 
          나중에 API로 불러오게 될 영역입니다.
        </p>
      </div>

      <div className="detail-actions">
        <div className="left-buttons">
          <button className="btn" disabled={!prevId} onClick={() => prevId && navigate(`/posts/${prevId}`)}> {"< 이전글"} </button>
          <button className="btn" onClick={() => navigate("/")}>목록</button>
          <button className="btn" disabled={!nextId} onClick={() => nextId && navigate(`/posts/${nextId}`)}>{"다음글 >"}</button>
        </div>

        <div className="right-buttons">
          <button className="btn">수정</button>
          <button className="btn delete">삭제</button>
        </div>
      </div>
    </div>
  );
}