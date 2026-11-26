"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export const RichTextEditor = ({
  content,
  setContent,
  placeholder,
}: {
  content: string;
  setContent: (value: string) => void;
  placeholder?: string;
}) => {
  return (
    <>
      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        placeholder={placeholder}
        className="rounded-md shadow-sm"
        modules={{
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            ["blockquote"],
            [{ list: "bullet" }],
            [{ align: [] }, { indent: "-1" }, { indent: "+1" }],
            ["clean"],
          ],
        }}
      />
      <style>{`
        .ql-container.ql-snow {
          border: 1px solid hsl(var(--border));
          border-radius: 0 0 calc(var(--radius) - 2px) calc(var(--radius) - 2px);
        }
          
        .ql-toolbar.ql-snow {
          border: 1px solid hsl(var(--border));
          border-radius: calc(var(--radius) - 2px) calc(var(--radius) - 2px) 0 0;
        }
      `}</style>
    </>
  );
};
