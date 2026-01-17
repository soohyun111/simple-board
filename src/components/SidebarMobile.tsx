import { Link } from "react-router-dom";
import { House, Bell, Logs, Image, ExternalLink, PencilLine, X} from "lucide-react";
import "./SidebarMobile.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SidebarMobile({ isOpen, onClose }: Props) {
  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? "show" : ""}`} onClick={onClose}/>

        <aside className={`sidebar-mobile ${isOpen ? "open" : ""}`}>
            <button className="close-btn" onClick={onClose}><X /></button>

        <div className="sidebar-container">
        <div className="sidebar-wrapper">
        
                <nav className="sidebar-nav">
                  <Link to ="/" className="sidebar-item" onClick={onClose}>
                    <House /><span className="sidebar-text">홈</span>
                  </Link>

                  <Link to ="/" className="sidebar-item" onClick={onClose}>
                    <Bell /><span className="sidebar-text">공지사항</span>
                  </Link>

                  <Link to ="/" className="sidebar-item sidebar-item-active" onClick={onClose}>
                    <Logs /><span className="sidebar-text">자유게시판</span>
                  </Link>

                  <Link to ="/" className="sidebar-item" onClick={onClose}>
                   <Image /><span className="sidebar-text">사진게시판</span>
                  </Link>

                  <div className="sidebar-header" onClick={onClose}>
                    <ExternalLink size={15}/><h2 className="sidebar-title">바로가기</h2>
                  </div>

                  <a className="sidebar-item" href="https://www.instagram.com/" target='_blank'onClick={onClose}>
                    <span className="sidebar-text">인스타그램</span>
                  </a>

                  <a className="sidebar-item" href="https://x.com/" target='_blank' onClick={onClose}>
                   <span className="sidebar-text">X (트위터)</span>
                  </a>

                  <a className="sidebar-item" href="https://section.blog.naver.com/" target='_blank' onClick={onClose}>
                   <span className="sidebar-text">네이버 블로그</span>
                  </a>
                  
                  <Link to ="/Write" className="write-button" onClick={onClose}><PencilLine /><span>글쓰기</span></Link>
                </nav>
                   
        </div>
      </div>
    
    </aside>
    </>
  );
}
