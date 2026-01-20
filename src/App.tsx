import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Banner from "./components/Banner";
import Header from "./components/Header";
import SidebarPC from "./components/SidebarPC";
import SidebarMobile from "./components/SidebarMobile";
import Footer from "./components/Footer";
import List from "./Pages/List";
import Detail from "./Pages/Detail";
import Write from "./Pages/Write";
import Edit from "./Pages/Edit";

export default function App() {
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app">
       <Header isSidebarOpen={isSidebarOpen} onToggleSidebar={() => setIsSidebarOpen(prev => !prev)} />
      <Banner />

      <div className="app-body">
        <SidebarPC />
        <SidebarMobile isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}/>

        <main className="app-list">
          <Routes>
            <Route path="/" element={<List />} />
            <Route path="/write" element={<Write/>} />
            <Route path="/posts/:id" element={<Detail/>} />
            <Route path="/edit/:id" element={<Edit />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
    
  );
}


