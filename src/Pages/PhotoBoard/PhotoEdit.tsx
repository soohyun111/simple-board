import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { PencilLine } from "lucide-react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import Swal from "sweetalert2";
import "../FreeBoard/Write.css";

export default function PhotoEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(true);

  // 파일명의 한글/공백/특수문자 제거
  const normalizeFileName = (name: string) => {
    const ext = name.split(".").pop();
    return `${crypto.randomUUID()}.${ext}`;
  };

  // 기존 게시글 + 이미지 불러오기
  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      const { data: post } = await supabase
        .from("photo_posts")
        .select("title, content")
        .eq("id", postId)
        .single();

      if (!post) {
        Swal.fire("게시글을 불러올 수 없습니다.");
        navigate(-1);
        return;
      }

      const { data: images } = await supabase
        .from("photo_images")
        .select("*")
        .eq("post_id", postId)
        .order("order_index");

      setTitle(post.title);
      setContent(post.content);

      setFileList(
        (images ?? []).map((img) => ({
          uid: String(img.id),
          name: img.image_url.split("/").pop() || "image",
          status: "done",
          url: img.image_url,
        })),
      );
      setLoading(false);
    };
    fetchPost();
  }, [postId, navigate]);

  const handleChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };

  // 휴지통 클릭 시 실제 삭제
  const handleRemove = async (file: UploadFile) => {
    try {
      if (!file.url) {
        setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
        return true;
      }

      const { error } = await supabase
        .from("photo_images")
        .delete()
        .eq("id", Number(file.uid));

      if (error) throw error;

      setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
      return true;
    } catch (err) {
      console.error("이미지 삭제 에러:", err);
      Swal.fire("이미지 삭제 실패");
      return false;
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      Swal.fire("제목을 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      Swal.fire("내용을 입력해주세요.");
      return;
    }
    if (fileList.length === 0) {
      Swal.fire("사진을 한 장 이상 선택해주세요.");
      return;
    }

    setLoading(true);

    try {
      await supabase
        .from("photo_posts")
        .update({ title, content })
        .eq("id", postId);

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        if (!file.originFileObj) continue;

        const origin = file.originFileObj;
        const safeName = normalizeFileName(origin.name);
        const path = `${postId}/${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(path, origin);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("images").getPublicUrl(path);

        await supabase.from("photo_images").insert({
          post_id: postId,
          image_url: data.publicUrl,
          storage_path: path,
          order_index: i,
        });
      }

      const { data: latestImages } = await supabase
        .from("photo_images")
        .select("image_url")
        .eq("post_id", postId)
        .order("order_index", { ascending: true })
        .limit(1);

      if (latestImages && latestImages.length > 0) {
        const newThumbnail = latestImages[0].image_url;
        await supabase
          .from("photo_posts")
          .update({ thumbnail_url: newThumbnail })
          .eq("id", postId);
      }

      Swal.fire("글이 수정되었습니다.");
      navigate(`/photos?modal=${postId}`);
    } catch (err) {
      console.error(err);
      Swal.fire("수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  return (
    <section className="write">
      <h2 className="write-title">
        <PencilLine />
        <span>사진게시판 - 글 수정</span>
      </h2>

      <form className="write-form" onSubmit={handleUpdate}>
        <div className="write-field">
          <label>제목</label>
          <input
            type="text"
            placeholder="제목을 입력하세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="write-field">
          <label>내용</label>
          <textarea
            placeholder="내용을 입력하세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
          />
        </div>

        <Upload
          listType="picture"
          multiple
          accept="image/*"
          fileList={fileList}
          beforeUpload={() => false}
          onChange={handleChange}
          onRemove={handleRemove}
        >
          <Button icon={<UploadOutlined />}>사진 추가/삭제</Button>
        </Upload>

        <div className="write-actions">
          <button
            type="button"
            className="btn-cancel"
            disabled={loading}
            onClick={() => navigate(-1)}
          >
            취소
          </button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "수정중..." : "수정"}
          </button>
        </div>
      </form>
    </section>
  );
}
