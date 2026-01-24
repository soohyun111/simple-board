import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { PencilLine } from "lucide-react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import Swal from "sweetalert2";
import "../FreeBoard/Write.css";

export default function PhotoWrite() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);

  // 파일명의 한글/공백/특수문자 제거
  const normalizeFileName = (name: string) => {
    const ext = name.split(".").pop();
    return `${crypto.randomUUID()}.${ext}`;
  };

  const handleChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      // 게시글 먼저 생성
      const { data: post, error } = await supabase
        .from("photo_posts")
        .insert({ title, content })
        .select()
        .single();

      if (error || !post) {
        console.error(error);
        throw new Error("글 등록 실패");
      }

      //이미지 업로드
      let thumbnailUrl: string | null = null;

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i].originFileObj;
        if (!file) continue;

        const safeFileName = normalizeFileName(file.name);
        const filePath = `${post.id}/${safeFileName}`;

        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(filePath, file);

        if (uploadError) {
          console.error(uploadError);
          continue;
        }

        const { data } = supabase.storage.from("images").getPublicUrl(filePath);

        const imageUrl = data.publicUrl;

        if (i === 0) {
          thumbnailUrl = imageUrl;
        }

        await supabase.from("photo_images").insert({
          post_id: post.id,
          image_url: imageUrl,
          order_index: i,
        });
      }

      // 썸네일 업데이트
      if (thumbnailUrl) {
        await supabase
          .from("photo_posts")
          .update({ thumbnail_url: thumbnailUrl })
          .eq("id", post.id);
      }

      Swal.fire("글이 등록되었습니다.");
      navigate(`/photos?modal=${post.id}`);
    } catch (err) {
      console.error(err);
      Swal.fire("등록 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="write">
      <h2 className="write-title">
        <PencilLine />
        <span>사진게시판 - 글쓰기</span>
      </h2>

      <form className="write-form" onSubmit={handleSubmit}>
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
        >
          <Button icon={<UploadOutlined />}>사진 업로드</Button>
        </Upload>

        <div className="write-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate(-1)}
          >
            취소
          </button>
          <button type="submit" className="btn-submit">
            {loading ? "등록중..." : "등록"}
          </button>
        </div>
      </form>
    </section>
  );
}
