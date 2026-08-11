"use client";

import { useRef, useState } from "react";

export type AttachmentItem = {
  name: string;
  type: string;
  size: string;
};

export default function AttachmentManager({ attachments }: { attachments: AttachmentItem[] }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [localAttachments, setLocalAttachments] = useState(attachments);

  return (
    <section className="rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-black text-night">Documents</h2>
        <button type="button" onClick={() => inputRef.current?.click()} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-black text-night">
          Ajouter
        </button>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            setLocalAttachments((current) => [
              ...current,
              {
                name: file.name,
                type: file.type || "Fichier",
                size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
              },
            ]);
            event.target.value = "";
          }}
        />
      </div>

      <div className="mt-5 space-y-3">
        {localAttachments.map((attachment) => (
          <article key={attachment.name} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div>
              <h3 className="font-black text-night">{attachment.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{attachment.type}</p>
            </div>
            <span className="text-sm font-bold text-slate-500">{attachment.size}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
