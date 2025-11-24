"use client";

import { useRef } from "react";
import { toPng } from "html-to-image";

interface CertificatProps {
  fullname: string;
  date: string;
  onSend?: (dataUrl: string) => Promise<void>;
}

export default function Certificat({
  fullname,
  date,
  onSend,
}: CertificatProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!ref.current) return;
    // const dataUrl = await toPng(ref.current);
    if (onSend) await onSend("");
  };

  return (
    <div>
      <div
        ref={ref}
        style={{
          width: 1080,
          height: 1350,
          padding: 30,
          background: "#f5f5f5",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: 64 }}>Certificat d'engagement</h1>
        <p style={{ fontSize: 48 }}>{fullname}</p>
        <p style={{ fontSize: 36 }}>Engagé le {date}</p>
      </div>

      <button
        onClick={handleSend}
        style={{
          marginTop: 20,
          padding: "12px 24px",
          fontSize: 18,
          cursor: "pointer",
        }}
      >
        Envoyer par email
      </button>
    </div>
  );
}
