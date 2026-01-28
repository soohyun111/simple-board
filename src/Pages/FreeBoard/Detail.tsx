import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { NotepadText } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import Swal from "sweetalert2";
import "./Detail.css";

type Post = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  views: number;
};

export default function Detail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const [post, setPost] = useState<Post | null>(null);
  const [prevPost, setPrevPost] = useState<Post | null>(null);
  const [nextPost, setNextPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 다시 List로 돌아갈 때 검색어와 현재 페이지 유지
  const page = Number(searchParams.get("page")) || 1;
  const searchKeyword = searchParams.get("keyword") || "";

  // React StrictMode에서 useEffect가 2번 실행되는 경우를 대비
  const lastFetchedId = useRef<string | null>(null);

  // 로그인 확인 여부 (버튼 노출)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(!!data.session);
    });
  }, []);

  // 게시글 상세조회
  useEffect(() => {
    if (!id) return;

    if (lastFetchedId.current === id) return;
    lastFetchedId.current = id;

    const postId = Number(id);

    const fetchPostAndIncrement = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", postId)
        .single();

      if (error || !data) {
        console.error(error);
        Swal.fire("게시글을 불러오지 못했습니다");
        navigate(-1);
        return;
      }

      // 조회수 증가
      const { error: updateError } = await supabase
        .from("posts")
        .update({ views: (data.views || 0) + 1 })
        .eq("id", postId);

      if (updateError) {
        console.error("조회수 업데이트 실패:", updateError);
        setPost(data);
      } else {
        setPost({ ...data, views: (data.views || 0) + 1 });
      }

      // 이전글/다음글 조회
      const { data: prev } = await supabase
        .from("posts")
        .select("*")
        .lt("id", postId)
        .order("id", { ascending: false })
        .limit(1)
        .maybeSingle();

      const { data: next } = await supabase
        .from("posts")
        .select("*")
        .gt("id", postId)
        .order("id", { ascending: true })
        .limit(1)
        .maybeSingle();

      setPrevPost(prev);
      setNextPost(next);
      setLoading(false);
    };

    fetchPostAndIncrement();
  }, [id, navigate]);

  // 게시글 삭제
  const handleDelete = async () => {
    if (!post) return;

    const result = await Swal.fire({
      title: "정말 삭제하시겠습니까?",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
      customClass: { confirmButton: "swal-delete-btn" },
    });

    if (!result.isConfirmed) return;

    const { error } = await supabase.from("posts").delete().eq("id", post?.id);

    if (error) {
      console.error(error);
      Swal.fire("삭제에 실패했습니다.");
      return;
    }

    Swal.fire("삭제되었습니다.");
    navigate(`/posts/?page=${page}&keyword=${searchKeyword}`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!post) {
    return <div>게시글이 존재하지 않습니다.</div>;
  }

  return (
    <div className="detail">
      <h1 className="detail-title">
        <NotepadText />
        <span>{post.title}</span>
      </h1>

      <div className="detail-meta">
        <span>작성일: {new Date(post.created_at).toLocaleDateString()}</span>
        <span>조회수: {post.views ?? 0}</span>
      </div>

      <div className="detail-content">
        <p> {post.content} </p>
      </div>

      <div className="detail-actions">
        <div className="left-buttons">
          <button
            className="btn"
            disabled={!prevPost}
            onClick={() => prevPost && navigate(`/posts/${prevPost.id}`)}
          >
            {" "}
            {"< 이전글"}{" "}
          </button>
          <button
            className="btn"
            onClick={() =>
              navigate(`/posts/?page=${page}&keyword=${searchKeyword}`)
            }
          >
            목록
          </button>
          <button
            className="btn"
            disabled={!nextPost}
            onClick={() => nextPost && navigate(`/posts/${nextPost.id}`)}
          >
            {"다음글 >"}
          </button>
        </div>

        {isLoggedIn && (
          <div className="right-buttons">
            <button
              className="btn"
              onClick={() => navigate(`/edit/${post.id}`)}
            >
              수정
            </button>
            <button className="btn delete" onClick={handleDelete}>
              삭제
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
