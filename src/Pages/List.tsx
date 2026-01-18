import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
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

export default function List() {
  const navigate = useNavigate();
  
  const [ post, setPost ] = useState<Post[]>([]);
  const [ loading, setLoading ] = useState(true);

  const [ page, setPage ] = useState(1);
  const [ totalCount, setTotalCouont ] = useState(0);
  const totalPages = Math.ceil(totalCount / pageSize);

  const [ keyword, setKeyword ] = useState("");
  const [ searchKeyword, setSeachKeyword ] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from("posts")
        .select("id, title, author, created_at, views", { count: "exact" })
        .order("id", { ascending: false });

      if (keyword.trim() !== "") {
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

  const handleSearch = () => {
    setPage(1);
    setSeachKeyword(keyword);
  };

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
          <button className="search-button" onClick={handleSearch}>검색</button>
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
              <tr key={post.id} className="post-link" onClick={() => navigate(`/posts/${post.id}`)}>
                <td>{post.id}</td>
                <td className="post-title">{post.title}</td>
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
          <button disabled={page === 1} onClick={() => setPage(1)}>{"≪"}</button>
          <button disabled={page === 1} onClick={() => setPage((p) => p-1)}>{"<"}</button>

          {Array.from({ length: totalPages}, (_, i) => i+1).map((p)=>(
            <button key={p} className={p === page ? "active": ""} onClick={() => setPage(p)}>{p}</button>
          ))}

          <button disabled={page === totalPages} onClick={() => setPage((p) => p+1)}>{">"}</button>
          <button disabled={page === totalPages} onClick={() => setPage(totalPages)}>{"≫"}</button>
        </div>
      </div>
    </div>
  );
}
