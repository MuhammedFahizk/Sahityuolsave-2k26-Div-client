// components/public/news/Prosecontent.jsx
"use client";

import { useEffect, useRef } from "react";

export default function ProseContent({ html }) {
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      // Ensure all paragraphs wrap properly
      const paragraphs = contentRef.current.querySelectorAll('p');
      paragraphs.forEach(p => {
        p.style.wordWrap = 'break-word';
        p.style.whiteSpace = 'normal';
        p.style.overflowWrap = 'break-word';
      });
    }
  }, [html]);

  return (
    <div 
      ref={contentRef}
      className="news-prose-content"
      dangerouslySetInnerHTML={{ __html: html }}
      style={{
        color: "var(--text-primary)",
        lineHeight: 1.8,
        fontSize: "16px",
        wordWrap: "break-word",
        whiteSpace: "normal",
        overflowWrap: "break-word",
        maxWidth: "100%",
      }}
    />
  );
}