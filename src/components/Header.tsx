import logo from "../img/logo.png";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header-group">
        <a href="/"> <img src={logo}/> </a>
      </div>
    </header>
  );
}