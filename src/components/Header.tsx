import { Menu, X } from "lucide-react";
import logo from "../img/logo.png";
import "./Header.css";

interface HeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}


export default function Header({isSidebarOpen, onToggleSidebar}: HeaderProps) {
  return (
    <header className="header">
      <button className="mobile-menu-button" onClick={onToggleSidebar}> 
        {isSidebarOpen ? <X /> : <Menu />}
      </button>

      <div className="header-group">
        <a href="/"> <img src={logo}/> </a>
      </div>
    </header>
  );
}