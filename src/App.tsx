import Banner from "./components/Banner";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import List from "./components/List";

import "./index.css";

export default function App() {
  return (
    <div className="app">
      <Header />
      <Banner />

      <div className="app-body">
        <Sidebar />

        <main className="app-list">
          <List />
        </main>
      </div>

      <Footer />
    </div>
  );
}
