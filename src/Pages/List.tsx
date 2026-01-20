import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Logs, Search } from "lucide-react";
import "./List.css";

type Post = {
  id: number;        
  title: string;    
  author: string;    
  created_at: string; 
  views: number;     
};

const pageSize = 10;
const pageGroupSize = 5;

export default function List() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [ post, setPost ] = useState<Post[]>([]);
  const [ loading, setLoading ] = useState(true);
  const [ totalCount, setTotalCouont ] = useState(0);

  const page = Number(searchParams.get("page")) || 1;
  const searchKeyword = searchParams.get("keyword") ||"";

  const totalPages = Math.ceil(totalCount / pageSize);

  const [ keyword, setKeyword ] = useState("");


  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from("posts")
        .select("id, title, author, created_at, views", { count: "exact" })
        .order("id", { ascending: false });

      if (searchKeyword.trim() !== "") {
        query = query.ilike("title", `%${searchKeyword}%`);
      }   
      const { data, error, count } = await query.range(from, to);

         if(error){
          console.error(error);
          alert("게시물을 불러오지 못했습니다.");
          return;
        } 

        setPost(data ?? []);
        setTotalCouont(count ?? 0);
        setLoading(false);   
    };

    fetchPost();
  }, [searchKeyword, page]);

  const handleSearch = (e? : React.FormEvent) => {
    e?.preventDefault();

    setSearchParams({
      page: "1", 
      keyword,
    });
  };

  const movePage = (newPage: number) => {
    setSearchParams({
      page : String(newPage),
      keyword : searchKeyword,
    });
  }

  const half = Math.floor(pageGroupSize / 2);

  let startPage = Math.max(1, page - half);
  const endPage = Math.min(totalPages, startPage + pageGroupSize - 1);

  if (endPage - startPage + 1 < pageGroupSize) {
        startPage = Math.max(1, endPage - pageGroupSize + 1);
      }

  if (loading) return <p>로딩중...</p> //추후 수정

  return (
    <div className="board-container">
      <div className="board-header">
        <div className="title-group">
        <Logs /><h2 className="board-title">자유게시판</h2></div>

        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <Search className="search-icon" />
              <input 
                type="text" placeholder="검색어를 입력하세요" className="search-input" 
                value={keyword} 
                onChange={(e) => setKeyword(e.target.value)}/>
          </div>
          <button className="search-button" type="submit">검색</button>
        </form>
      </div>

      <div className="board-table-wrapper">
        <table className="board-table">
          <thead>
            <tr>
              <th>번호</th>
              <th className="post-title">제목</th>
              <th>작성자</th>
              <th>작성일</th>
              <th>조회수</th>
            </tr>
          </thead>

          <tbody>
            {post.length === 0 ?(
              <tr>
                <td colSpan={5} className="empty" >게시글이 없습니다.</td>
              </tr>
            ) : (
            post.map((post) => (
              <tr key={post.id} className="post-link" onClick={() => navigate(`/posts/${post.id}?page=${page}&keyword=${searchKeyword}`)}>
                <td>{post.id}</td>
                <td className="post-title">{post.title.length > 15 ? post.title.slice(0, 15) + "..." : post.title}</td>
                <td>{post.author}</td>
                <td>{new Date(post.created_at).toLocaleDateString()}</td>
                <td>{post.views ?? 0}</td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="board-footer">

        <div className="pagination">
          <button disabled={page === 1} onClick={() => movePage(1)}>{"≪"}</button>
          <button disabled={page === 1} onClick={() => movePage(page - 1)}>{"<"}</button>

          {Array.from({ length: endPage - startPage + 1}, (_, i) => startPage + i).map((p)=>(
            <button key={p} className={p === page ? "active": ""} onClick={() => movePage(p)}>{p}</button>
          ))}

          <button disabled={page === totalPages} onClick={() => movePage(page + 1)}>{">"}</button>
          <button disabled={page === totalPages} onClick={() => movePage(totalPages)}>{"≫"}</button>
        </div>
      </div>
    </div>
  );
}
