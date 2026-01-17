import { Link } from "react-router-dom";
import { Logs, Search } from "lucide-react";
import "./List.css";

type List = {
  id: number;        // 번호
  title: string;     // 제목
  author: string;    // 작성자
  createdAt: string; // 작성일
  views: number;     // 조회수
};

const dummyPosts: List[] = [
  {
    id: 1,
    title: "첫 번째 게시글입니다",
    author: "김**",
    createdAt: "2026-01-13",
    views: 12,
  },
  {
    id: 2,
    title: "두 번째 게시글입니다",
    author: "이**",
    createdAt: "2026-01-14",
    views: 34,
  },
  {
    id: 3,
    title: "세 번째 게시글입니다",
    author: "박**",
    createdAt: "2026-01-15",
    views: 8,
  },
];

export default function List() {
  return (
    <div className="board-container">
      {/* 헤더 */}
      <div className="board-header">
        <div className="title-group">
        <Logs /><h2 className="board-title">자유게시판</h2></div>

        <form className="search-form">
          <div className="search-input-wrapper">
            <Search className="search-icon" />
              <input type="text" placeholder="검색어를 입력하세요" className="search-input"/>
          </div>
          <button className="search-button">검색</button>
        </form>
      </div>

      {/* 테이블 */}
      <div className="board-table-wrapper">
        <table className="board-table">
          <thead>
            <tr>
              <th>번호</th>
              <th className="post-title">제목</th>
              <th>작성자</th>
              <th>작성일</th>
              <th>조회수</th>
            </tr>
          </thead>


          <tbody>
            {dummyPosts.map((post) => (
              <tr key={post.id}>
                <td>{post.id}</td>
                <td className="post-title">
                  <Link to={`/posts/${post.id}`} className="title-link">
                    {post.title}
                  </Link>
                </td>
                <td>{post.author}</td>
                <td>{post.createdAt}</td>
                <td>{post.views}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    {/* 하단 영역 */}
      <div className="board-footer">
        
        <div className="pagination">
          <button>{"≪"}</button>
          <button>{"<"}</button>
          <button className="active">1</button>
          <button>2</button>
          <button>3</button>
          <button>{">"}</button>
          <button>{"≫"}</button>
        </div>
      </div>
    </div>
  );
}
