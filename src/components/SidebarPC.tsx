import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  House,
  Logs,
  Image,
  ExternalLink,
  PencilLine,
  FileHeart,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import Swal from "sweetalert2";
import LoginPC from "./LoginPC";
import "./SidebarPC.css";

export default function SidebarPC() {
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

    navigate(getWritePath());
  }

  return (
    <div className="sidebar-container">
      <div className="sidebar-wrapper">
        <div className="sidebar">
          <LoginPC />
          <nav className="sidebar-nav">
            <Link to="/" className="sidebar-item">
              <House />
              <span className="sidebar-text">홈</span>
            </Link>

            <Link to="/posts" className="sidebar-item">
              <Logs />
              <span className="sidebar-text">자유게시판</span>
            </Link>

            <Link to="/photos" className="sidebar-item">
              <Image />
              <span className="sidebar-text">사진게시판</span>
            </Link>

            <Link to="/guestBooks" className="sidebar-item">
              <FileHeart />
              <span className="sidebar-text">방명록</span>
            </Link>
          </nav>

          <nav className="sidebar-nav">
            <div className="sidebar-header">
              <ExternalLink size={15} />
              <h2 className="sidebar-title">바로가기</h2>
            </div>

            <a
              className="sidebar-item"
              href="https://www.instagram.com/"
              target="_blank"
            >
              <span className="sidebar-text">인스타그램</span>
            </a>

            <a className="sidebar-item" href="https://x.com/" target="_blank">
              <span className="sidebar-text">X (트위터)</span>
            </a>

            <a
              className="sidebar-item"
              href="https://section.blog.naver.com/"
              target="_blank"
            >
              <span className="sidebar-text">네이버 블로그</span>
            </a>
          </nav>
          <aside>
            <button className="write-button" onClick={handleWriteClick}>
              <PencilLine />
              <span>글쓰기</span>
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
