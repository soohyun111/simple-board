import { Routes, Route } from "react-router-dom";
import Banner from "./components/Banner";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import List from "./Pages/List";
import Detail from "./Pages/Detail";
import Write from "./Pages/Write";

export default function App() {
  return (

    <div className="app">
      <Header />
      <Banner />

      <div className="app-body">
        <Sidebar />

        <main className="app-list">
          <Routes>
            <Route path="/" element={<List />} />
            <Route path="/posts/:id" element={<Detail/>} />
            <Route path="/write" element={<Write/>} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
    
  );
}


