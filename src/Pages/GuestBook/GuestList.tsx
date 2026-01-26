import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { FileHeart } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import Swal from "sweetalert2";
import "./GuestList.css";

type Guestbook = {
  id: number;
  author: string;
  content: string;
  password: string;
  created_at: string;
};

const pageSize = 10;
const pageGroupSize = 5;

export default function GuestList() {
  const [list, setList] = useState<Guestbook[]>([]);
  const [loading, setLoading] = useState(true);

  const [author, setAuthor] = useState("");
  const [password, setPassword] = useState("");
  const [content, setContent] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // 방명록 조회
  useEffect(() => {
    const fetchGuestbook = async () => {
      setLoading(true);

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
        .from("guestbooks")
        .select("*", { count: "exact" })
        .order("id", { ascending: false })
        .range(from, to);

      if (error) {
        Swal.fire("방명록을 불러오지 못했습니다.");
        setLoading(false);
        return;
      }

      setList(data ?? []);
      setTotalCount(count ?? 0);
      setLoading(false);
    };

    fetchGuestbook();
  }, [page]);

  // 등록
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!author) {
      Swal.fire("작성자를 입력해주세요.");
      return;
    }
    if (!content) {
      Swal.fire("내용을 입력해주세요");
      return;
    }
    if (!password) {
      Swal.fire("비밀번호를 입력해주세요.");
      return;
    }

    const tempItem: Guestbook = {
      id: Date.now(), // 임시 ID
      author,
      content,
      password,
      created_at: new Date().toISOString(),
    };

    setList((prev) => [tempItem, ...prev]);

    const { data, error } = await supabase
      .from("guestbooks")
      .insert({ author, password, content })
      .select()
      .single();

    if (error) {
      Swal.fire("등록 실패");
      setList((prev) => prev.filter((item) => item.id !== tempItem.id));
      return;
    }

    setList((prev) =>
      prev.map((item) => (item.id === tempItem.id ? data : item)),
    );

    setAuthor("");
    setPassword("");
    setContent("");

    Swal.fire("등록되었습니다.");
  };

  // 삭제
  const handleDelete = async (id: number) => {
    await Swal.fire({
      title: "정말로 삭제하시겠습니까?",
      input: "password",
      inputPlaceholder: "비밀번호를 입력하세요.",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
      customClass: { confirmButton: "swal-delete-btn" },
      preConfirm: async (inputPassword) => {
        if (!inputPassword) {
          Swal.showValidationMessage("비밀번호를 입력해주세요.");
          return;
        }

        const { data } = await supabase
          .from("guestbooks")
          .select("password")
          .eq("id", id)
          .single();

        if (!data || data.password !== inputPassword) {
          Swal.showValidationMessage("비밀번호가 틀렸습니다.");
          return;
        }

        setList((prev) => prev.filter((item) => item.id !== id));

        const { error } = await supabase
          .from("guestbooks")
          .delete()
          .eq("id", id);

        if (error) {
          Swal.showValidationMessage("삭제 실패");
          return;
        }
        return true;
      },
    });
  };

  // 수정
  const handleEdit = async (item: Guestbook) => {
    const originalContent = item.content;

    await Swal.fire({
      title: "방명록 수정",
      html: `
      <textarea id="content" class="swal2-textarea">${item.content}</textarea>
      <input id="password" type="password" class="swal2-input" placeholder="비밀번호" />
    `,
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
      preConfirm: async () => {
        const content = (
          document.getElementById("content") as HTMLTextAreaElement
        ).value;
        const password = (
          document.getElementById("password") as HTMLInputElement
        ).value;
        if (!content) {
          Swal.showValidationMessage("내용을 입력하세요");
          return;
        }
        if (!password) {
          Swal.showValidationMessage("비밀번호를 입력하세요");
          return;
        }
        const { data } = await supabase
          .from("guestbooks")
          .select("password")
          .eq("id", item.id)
          .single();

        if (!data || data.password !== password) {
          Swal.showValidationMessage("비밀번호가 틀렸습니다.");
          return;
        }

        setList((prev) =>
          prev.map((g) => (g.id === item.id ? { ...g, content } : g)),
        );

        const { error } = await supabase
          .from("guestbooks")
          .update({ content })
          .eq("id", item.id);

        if (error) {
          setList((prev) =>
            prev.map((g) =>
              g.id === item.id ? { ...g, content: originalContent } : g,
            ),
          );
          Swal.showValidationMessage("수정에 실패했습니다.");
          return;
        }
        return true;
      },
    });
  };

  // 페이지 이동
  const movePage = (newPage: number) => {
    setPage(newPage);
  };

  // 현재 페이지가 페이지네이션의 중앙에 위치하도록 계산
  const half = Math.floor(pageGroupSize / 2);

  let startPage = Math.max(1, page - half);
  const endPage = Math.min(totalPages, startPage + pageGroupSize - 1);

  if (endPage - startPage + 1 < pageGroupSize) {
    startPage = Math.max(1, endPage - pageGroupSize + 1);
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="board-container">
      <div className="board-header">
        <div className="title-group">
          <FileHeart />
          <h2 className="board-title">방명록</h2>
        </div>
      </div>

      <form className="guestbook-container" onSubmit={handleSubmit}>
        <div className="guestbook-form">
          <div className="form-row">
            <input
              type="text"
              placeholder="작성자"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />

            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-row">
            <textarea
              placeholder="내용을 입력하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "등록중..." : "등록"}
            </button>
          </div>
        </div>
      </form>

      <div className="guestbook-list">
        {list.length === 0 ? (
          <p className="empty">방명록이 없습니다.</p>
        ) : (
          list.map((item) => (
            <div key={item.id} className="guestbook-item">
              <div className="item-header">
                <span className="author">{item.author}</span>
                <span className="date">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>

              <p className="content">{item.content}</p>

              <div className="actions">
                <button className="edit" onClick={() => handleEdit(item)}>
                  수정
                </button>
                <button
                  className="delete"
                  onClick={() => handleDelete(item.id)}
                >
                  삭제
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="board-footer">
        <div className="pagination">
          <button disabled={page === 1} onClick={() => movePage(1)}>
            {"≪"}
          </button>
          <button disabled={page === 1} onClick={() => movePage(page - 1)}>
            {"<"}
          </button>

          {Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i,
          ).map((p) => (
            <button
              key={p}
              className={p === page ? "active" : ""}
              onClick={() => movePage(p)}
            >
              {p}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => movePage(page + 1)}
          >
            {">"}
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => movePage(totalPages)}
          >
            {"≫"}
          </button>
        </div>
      </div>
    </div>
  );
}
