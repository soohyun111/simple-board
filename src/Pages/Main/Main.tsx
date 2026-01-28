import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { Logs, FileHeart, Image } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import PhotoDetail from "../PhotoBoard/PhotoDetail";
import Banner from "../../components/Banner";
import "./Main.css";

interface FreePost {
  id: number;
  title: string;
  created_at: string;
}

interface PhotoPost {
  id: number;
  thumbnail_url: string;
}

interface GuestBook {
  id: number;
  author: string;
  content: string;
}

export default function Main() {
  const [freePosts, setFreePosts] = useState<FreePost[]>([]);
  const [photoPosts, setPhotoPosts] = useState<PhotoPost[]>([]);
  const [guestBooks, setGuestBooks] = useState<GuestBook[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [photoLimit, setPhotoLimit] = useState(5);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const mq = window.matchMedia("(max-width: 768px)");
    const updatePhotoLimit = () => {
      setPhotoLimit(mq.matches ? 4 : 5);
    };

    updatePhotoLimit();
    mq.addEventListener("change", updatePhotoLimit);

    const fetchData = async () => {
      setLoading(true);
      const [free, photo, guest] = await Promise.all([
        supabase
          .from("posts")
          .select("id, title, created_at")
          .order("created_at", { ascending: false })
          .limit(4),

        supabase
          .from("photo_posts")
          .select("id, thumbnail_url")
          .order("created_at", { ascending: false })
          .limit(photoLimit),

        supabase
          .from("guestbooks")
          .select("id, author, content")
          .order("created_at", { ascending: false })
          .limit(4),
      ]);

      if (ignore) return;

      if (free.data) setFreePosts(free.data);
      if (photo.data) setPhotoPosts(photo.data);
      if (guest.data) setGuestBooks(guest.data);

      setLoading(false);
      mq.removeEventListener("change", updatePhotoLimit);
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [photoLimit]);

  // 글자 수 많으면 자르기
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  // 삭제 후 리스트 바로 갱신
  const handleDelete = (id: number) => {
    setPhotoPosts((prev) => prev.filter((p) => p.id !== id));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="main-board-container">
      <div className="main">
        <Banner />
        <section className="main-board">
          <header className="main-board-header">
            <h2 className="main-board-title">
              <Image />
              사진게시판
            </h2>
            <Link to="/photos" className="more">
              더보기 →
            </Link>
          </header>

          <div className="main-photo-grid">
            {photoPosts.map((photo) => (
              <img
                key={photo.id}
                src={photo.thumbnail_url}
                loading="lazy"
                onClick={() => setSelectedPostId(photo.id)}
              />
            ))}
          </div>
          {selectedPostId && (
            <PhotoDetail
              postId={selectedPostId}
              onClose={() => setSelectedPostId(null)}
              onViewUpdate={() => {}}
              onDelete={handleDelete}
            />
          )}
        </section>
        <div className="top-row">
          <section className="main-board">
            <div className="main-board-header">
              <h2 className="main-board-title">
                <Logs />
                자유게시판
              </h2>
              <Link to="/posts" className="more">
                더보기 →
              </Link>
            </div>

            <ul className="main-free-list">
              {freePosts.map((post) => (
                <li key={post.id}>
                  <Link to={`/posts/${post.id}`} className="free-link">
                    {truncateText(post.title, 20)}
                  </Link>

                  <span className="main-date">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="main-board">
            <header className="main-board-header">
              <h2 className="main-board-title">
                <FileHeart />
                방명록
              </h2>
              <Link to="/guestBooks" className="more">
                더보기 →
              </Link>
            </header>

            <ul className="main-guestbook-list">
              {guestBooks.map((g) => (
                <li key={g.id}>
                  <strong> {truncateText(g.author, 8)}</strong> :{" "}
                  {truncateText(g.content, 20)}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
