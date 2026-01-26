import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Banner from "./components/Banner";
import Header from "./components/Header";
import SidebarPC from "./components/SidebarPC";
import SidebarMobile from "./components/SidebarMobile";
import Footer from "./components/Footer";
import List from "./Pages/FreeBoard/List";
import Detail from "./Pages/FreeBoard/Detail";
import Write from "./Pages/FreeBoard/Write";
import Edit from "./Pages/FreeBoard/Edit";
import PhotoList from "./Pages/PhotoBoard/PhotoList";
import PhotoWrite from "./Pages/PhotoBoard/PhotoWrite";
import PhotoEdit from "./Pages/PhotoBoard/PhotoEdit";
import GuestBook from "./Pages/GuestBook/GuestList";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app">
      <Header
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />
      <Banner />

      <div className="app-body">
        <SidebarPC />
        <SidebarMobile
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="app-list">
          <Routes>
            <Route path="/posts" element={<List />} />
            <Route path="/posts/:id" element={<Detail />} />
            <Route path="/write" element={<Write />} />
            <Route path="/edit/:id" element={<Edit />} />

            <Route path="/photos" element={<PhotoList />} />
            <Route path="/photoWrite" element={<PhotoWrite />} />
            <Route path="/photoEdit/:id" element={<PhotoEdit />} />

            <Route path="/guestBooks" element={<GuestBook />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  );
}
