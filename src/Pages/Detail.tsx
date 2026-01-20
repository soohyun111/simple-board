import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { NotepadText } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import Swal from "sweetalert2";
import "./Detail.css";

type Post = {
  id: number;        
  title: string;   
  content: string;  
  author: string;    
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

  const page = Number(searchParams.get("page")) || 1;
  const searchKeyword = searchParams.get("keyword") ||"";

  const lastFetchedId = useRef<string | null>(null);

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

  const handleDelete = async () => {
  if (!post) return;

  const result = await Swal.fire({
      title: "정말 삭제하시겠습니까?",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
      customClass: { confirmButton: "swal-delete-btn"},
    });

    if (!result.isConfirmed) return;

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", post?.id);

  if (error) {
    console.error(error);
    Swal.fire("삭제에 실패했습니다.");
    return;
  }

  Swal.fire("삭제되었습니다.");
  navigate("/");
};

  if (loading) {
    return <LoadingSpinner />
  }

  if (!post) {
    return <div>게시글이 존재하지 않습니다.</div>;
  }

  return (
    <div className="detail">
      <h1 className="detail-title"><NotepadText /><span>{post.title}</span></h1>

      <div className="detail-meta">
        <span>작성자: {post.author}</span>
        <span>작성일: {new Date(post.created_at).toLocaleDateString()}</span>
        <span>조회수: {post.views ?? 0}</span>
      </div>

      <div className="detail-content">
        <p> {post.content} </p>
      </div>
      
      <div className="detail-actions">
        <div className="left-buttons">
          <button className="btn" disabled={!prevPost} onClick={() => prevPost && navigate(`/posts/${prevPost.id}`)}> {"< 이전글"} </button>
          <button className="btn" onClick={() => navigate(`/?page=${page}&keyword=${searchKeyword}`)}>목록</button>
          <button className="btn" disabled={!nextPost} onClick={() => nextPost && navigate(`/posts/${nextPost.id}`)}>{"다음글 >"}</button>
        </div>

        <div className="right-buttons">
          <button 
          className="btn" onClick={() => navigate(`/edit/${post.id}`)}>수정</button>
          <button className="btn delete" onClick={handleDelete}>삭제</button>
        </div>
      </div>
    </div>
  );}