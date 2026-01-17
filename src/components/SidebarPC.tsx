import { Link } from "react-router-dom";
import { House, Bell, Logs, Image, ExternalLink, PencilLine} from "lucide-react";
import "./SidebarPC.css";

export default function SidebarPC() {
  return (
    <div className="sidebar-container">
      <div className="sidebar-wrapper">
        <div className="sidebar">
                <nav className="sidebar-nav">
                  <Link to ="/" className="sidebar-item">
                    <House /><span className="sidebar-text">홈</span>
                  </Link>

                  <Link to ="/" className="sidebar-item">
                    <Bell /><span className="sidebar-text">공지사항</span>
                  </Link>

                  <Link to ="/" className="sidebar-item sidebar-item-active">
                    <Logs /><span className="sidebar-text">자유게시판</span>
                  </Link>

                  <Link to ="/" className="sidebar-item">
                   <Image /><span className="sidebar-text">사진게시판</span>
                  </Link>
                </nav>

                <nav className="sidebar-nav">
                  <div className="sidebar-header">
                    <ExternalLink size={15}/><h2 className="sidebar-title">바로가기</h2>
                  </div>

                  <a className="sidebar-item" href="https://www.instagram.com/" target='_blank'>
                    <span className="sidebar-text">인스타그램</span>
                  </a>

                  <a className="sidebar-item" href="https://x.com/" target='_blank'>
                   <span className="sidebar-text">X (트위터)</span>
                  </a>

                  <a className="sidebar-item" href="https://section.blog.naver.com/" target='_blank'>
                   <span className="sidebar-text">네이버 블로그</span>
                  </a>
                </nav>
                <Link to ="/Write" className="write-button"><PencilLine /><span>글쓰기</span></Link>   
        </div>
      </div>
    </div>
  );
}
