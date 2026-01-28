import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import LoadingSpinner from "../../components/LoadingSpinner";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./PhotoDetail.css";

type Props = {
  postId: number;
  onClose: () => void;
  onViewUpdate: (id: number) => void;
  onDelete: (id: number) => void;
};

type PhotoImage = {
  id: number;
  image_url: string;
  order_index: number;
  created_at: string;
  views: number;
};

interface PhotoPost {
  id: number;
  title: string;
  content: string;
  created_at: string;
  views: number;
}

export default function PhotoDetail({
  postId,
  onClose,
  onViewUpdate,
  onDelete,
}: Props) {
  const navigate = useNavigate();

  const [post, setPost] = useState<PhotoPost | null>(null);
  const [images, setImages] = useState<PhotoImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const hasIncreased = useRef<number | null>(null);

  // 로그인 확인 여부 (버튼 노출)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(!!data.session);
    });
  }, []);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);

      // 조회수 증가
      if (hasIncreased.current !== postId) {
        const { error: rpcError } = await supabase.rpc(
          "increment_photo_views",
          {
            post_id: postId,
          },
        );

        if (!rpcError) {
          onViewUpdate(postId);
          hasIncreased.current = postId;
        } else {
          console.error("조회수 증가 실패:", rpcError);
        }
      }

      const { data: postData, error } = await supabase
        .from("photo_posts")
        .select("*")
        .eq("id", postId)
        .single();

      if (error || !postData) return;

      const { data: imageData } = await supabase
        .from("photo_images")
        .select("*")
        .eq("post_id", postId)
        .order("order_index");

      setPost(postData);
      setImages(imageData || []);
      setLoading(false);
    };

    fetchDetail();
  }, [postId, onViewUpdate]);

  // ESC로 창 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  // 모달이 열릴 때 바깥쪽 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

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

    try {
      await supabase.from("photo_images").delete().eq("post_id", post.id);
      await supabase.from("photo_posts").delete().eq("id", post.id);

      Swal.fire("삭제되었습니다.");
      onDelete(post.id);
      onClose();
    } catch (err) {
      console.error(err);
      Swal.fire("삭제에 실패했습니다.");
    }
  };

  if (!post) return null;

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={30} />
        </button>

        {images.length === 1 && (
          <img src={images[0].image_url} className="modal-image" />
        )}

        {images.length > 1 && (
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            className="photo-swiper"
          >
            {images.map((img) => (
              <SwiperSlide key={img.id}>
                <img src={img.image_url} className="modal-image" />
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {images.length === 0 && (
          <div className="photo-placeholder">No Image</div>
        )}

        <div className="photo-modal-body">
          <h2 className="photo-modal-title">{post.title}</h2>
          <p className="photo-modal-content">{post.content}</p>
        </div>
        <div className="photo-modal-meta">
          <span>{new Date(post.created_at).toLocaleDateString()}</span>
          <span>조회수 {post.views ?? 0}</span>
          <span>
            {isLoggedIn && (
              <div className="modal-right-buttons">
                <button
                  className="btn"
                  onClick={() => navigate(`/photoEdit/${post.id}`)}
                >
                  수정
                </button>
                <button className="btn delete" onClick={handleDelete}>
                  삭제
                </button>
              </div>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
