import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { Logs, Search } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import Swal from "sweetalert2";
import "./List.css";

type Post = {
  id: number;
  title: string;
  created_at: string;
  views: number;
};

const pageSize = 10;
const pageGroupSize = 5;

export default function List() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [post, setPost] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // 새로고침, 뒤로가기를 눌러도 검색어와 페이지 유지
  const page = Number(searchParams.get("page")) || 1;
  const searchKeyword = searchParams.get("keyword") || "";

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const [keyword, setKeyword] = useState("");

  // 게시글 목록 조회
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from("posts")
        .select("id, title, created_at, views", { count: "exact" })
        .order("id", { ascending: false });

      if (searchKeyword.trim() !== "") {
        query = query.ilike("title", `%${searchKeyword}%`);
      }
      const { data, error, count } = await query.range(from, to);

      if (error) {
        console.error(error);
        Swal.fire("게시물을 불러오지 못했습니다.");
        return;
      }

      setPost(data ?? []);
      setTotalCount(count ?? 0);
      setLoading(false);
    };

    fetchPost();
  }, [searchKeyword, page]);

  // 검색 버튼 클릭 시 목록 재조회
  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();

    setSearchParams({
      page: "1",
      keyword,
    });
  };

  // 검색 기록은 유지한 채 페이지네이션 이동
  const movePage = (newPage: number) => {
    setSearchParams({
      page: String(newPage),
      keyword: searchKeyword,
    });
  };

  // 현재 페이지가 페이지네이션의 중앙에 위치하도록 계산
  const half = Math.floor(pageGroupSize / 2);

  let startPage = Math.max(1, page - half);
  const endPage = Math.min(totalPages, startPage + pageGroupSize - 1);

  if (endPage - startPage + 1 < pageGroupSize) {
    startPage = Math.max(1, endPage - pageGroupSize + 1);
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="board-container">
      <div className="board-header">
        <div className="title-group">
          <Logs />
          <h2 className="board-title">자유게시판</h2>
        </div>

        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              className="search-input"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <button className="search-button" type="submit">
            검색
          </button>
        </form>
      </div>

      <div className="board-table-wrapper">
        <table className="board-table">
          <thead>
            <tr>
              <th className="post-id">번호</th>
              <th className="post-title">제목</th>
              <th className="post-date">작성일</th>
              <th className="post-view">조회수</th>
            </tr>
          </thead>

          <tbody>
            {post.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty">
                  게시글이 없습니다.
                </td>
              </tr>
            ) : (
              post.map((post) => (
                <tr
                  key={post.id}
                  className="post-link"
                  onClick={() =>
                    navigate(
                      `/posts/${post.id}?page=${page}&keyword=${searchKeyword}`,
                    )
                  }
                >
                  <td className="post-id">{post.id}</td>
                  <td
                    className="post-title"
                    data-pc={
                      post.title.length > 20
                        ? post.title.slice(0, 20) + "..."
                        : post.title
                    }
                    data-mobile={
                      post.title.length > 10
                        ? post.title.slice(0, 10) + "..."
                        : post.title
                    }
                  ></td>
                  <td className="post-date">
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                  <td className="post-view">{post.views ?? 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="board-footer">
        <div className="pagination">
          <button disabled={page === 1} onClick={() => movePage(1)}>
            {"≪"}
          </button>
          <button disabled={page === 1} onClick={() => movePage(page - 1)}>
            {"<"}
          </button>

          {Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i,
          ).map((p) => (
            <button
              key={p}
              className={p === page ? "active" : ""}
              onClick={() => movePage(p)}
            >
              {p}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => movePage(page + 1)}
          >
            {">"}
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => movePage(totalPages)}
          >
            {"≫"}
          </button>
        </div>
      </div>
    </div>
  );
}
