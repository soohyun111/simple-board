import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { Image, Search } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import Swal from "sweetalert2";
import PhotoDetail from "./PhotoDetail";
import "./PhotoList.css";
import "../FreeBoard/List";

type PhotoPost = {
  id: number;
  title: string;
  content: string;
  thumbnail_url: string;
  created_at: string;
  views: number;
};

const pageSize = 9;
const pageGroupSize = 5;

export default function PhotoList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [posts, setPosts] = useState<PhotoPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  // 새로고침, 뒤로가기를 눌러도 검색어와 페이지 유지
  const page = Number(searchParams.get("page")) || 1;
  const searchKeyword = searchParams.get("keyword") || "";

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const [keyword, setKeyword] = useState("");

  // 조회수를 로컬 상태에서 즉시 업데이트하는 함수
  const handleViewUpdate = (postId: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, views: (post.views || 0) + 1 } : post,
      ),
    );
  };

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from("photo_posts")
        .select("*", { count: "exact" })
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

      setPosts(data ?? []);
      setTotalCount(count ?? 0);
      setLoading(false);
    };

    fetchPhotos();
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
          <Image /> <h2 className="photo-title">사진게시판</h2>
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

      <section className="photo-list">
        {posts.length === 0 ? (
          <p className="empty">게시글이 없습니다.</p>
        ) : (
          <div className="photo-grid">
            {posts.map((post) => (
              <div
                key={post.id}
                className="photo-card"
                onClick={() => {
                  setSelectedPostId(post.id);
                }}
              >
                <div className="photo-thumb">
                  {post.thumbnail_url ? (
                    <img src={post.thumbnail_url} alt={post.title} />
                  ) : (
                    <div className="photo-placeholder">No Image</div>
                  )}
                </div>

                <div className="photo-card-body">
                  <h3 className="photo-card-title">{post.title}</h3>

                  <p className="photo-card-desc">
                    {post.content.length > 60
                      ? post.content.slice(0, 60) + "..."
                      : post.content}
                  </p>

                  <div className="photo-card-meta">
                    <span>
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                    <span>조회수 {post.views ?? 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {selectedPostId && (
          <PhotoDetail
            postId={selectedPostId}
            onClose={() => setSelectedPostId(null)}
            onViewUpdate={handleViewUpdate}
          />
        )}
      </section>

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
