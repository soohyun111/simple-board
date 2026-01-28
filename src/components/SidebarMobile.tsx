import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  House,
  Logs,
  Image,
  ExternalLink,
  PencilLine,
  FileHeart,
  X,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import Swal from "sweetalert2";
import "./SidebarMobile.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SidebarMobile({ isOpen, onClose }: Props) {
  const location = useLocation();
  const navigate = useNavigate();

  // 현재 URL에 따라 글쓰기 페이지 경로를 결정
  const getWritePath = () => {
    if (location.pathname.includes("/photo")) return "/photoWrite";
    return "/write";
  };

  // 로그인 여부 확인 (글쓰기)
  async function handleWriteClick() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      Swal.fire("로그인 후 이용해주세요.");
      return;
    }

    onClose();
    navigate(getWritePath());
  }

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "show" : ""}`}
        onClick={onClose}
      />

      <aside className={`sidebar-mobile ${isOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={onClose}>
          <X />
        </button>

        <div className="sidebar-container">
          <div className="sidebar-wrapper">
            <nav className="sidebar-nav">
              <Link to="/" className="sidebar-item" onClick={onClose}>
                <House />
                <span className="sidebar-text">홈</span>
              </Link>

              <Link to="/posts" className="sidebar-item" onClick={onClose}>
                <Logs />
                <span className="sidebar-text">자유게시판</span>
              </Link>

              <Link to="/photos" className="sidebar-item" onClick={onClose}>
                <Image />
                <span className="sidebar-text">사진게시판</span>
              </Link>

              <Link to="/guestBooks" className="sidebar-item" onClick={onClose}>
                <FileHeart />
                <span className="sidebar-text">방명록</span>
              </Link>

              <div className="sidebar-header" onClick={onClose}>
                <ExternalLink size={15} />
                <h2 className="sidebar-title">바로가기</h2>
              </div>

              <a
                className="sidebar-item"
                href="https://www.instagram.com/"
                target="_blank"
                onClick={onClose}
              >
                <span className="sidebar-text">인스타그램</span>
              </a>

              <a
                className="sidebar-item"
                href="https://x.com/"
                target="_blank"
                onClick={onClose}
              >
                <span className="sidebar-text">X (트위터)</span>
              </a>

              <a
                className="sidebar-item"
                href="https://section.blog.naver.com/"
                target="_blank"
                onClick={onClose}
              >
                <span className="sidebar-text">네이버 블로그</span>
              </a>

              <aside>
                <button className="write-button" onClick={handleWriteClick}>
                  <PencilLine />
                  <span>글쓰기</span>
                </button>
              </aside>
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}
