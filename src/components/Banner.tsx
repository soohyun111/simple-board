import banner from "../img/banner.jpg";
import "./Banner.css";

export default function Banner() {
  return (
    <div className="banner">
      <img src={banner} className="banner-image" />
    </div>
  );
}
