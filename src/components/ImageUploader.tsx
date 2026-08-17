import { useCallback, useRef, useState } from "react";
import { Upload, X, Loader2, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const MAX_MB = 8;

async function uploadFile(file: File, folder: string): Promise<string | null> {
  if (!file.type.startsWith("image/")) {
    toast.error("Envie apenas arquivos de imagem.");
    return null;
  }
  if (file.size > MAX_MB * 1024 * 1024) {
    toast.error(`Imagem muito grande (máx. ${MAX_MB}MB).`);
    return null;
  }
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type,
    upsert: false,
  });
  if (error) {
    toast.error(error.message);
    return null;
  }
  return `/api/public/media/${path}`;
}

interface Props {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  multiple?: boolean;
  label?: string;
}

export function ImageUploader({ value, onChange, folder = "uploads", multiple = false, label }: Props) {
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const list = Array.from(files);
    if (!list.length) return;
    setBusy(true);
    const uploaded: string[] = [];
    for (const f of multiple ? list : list.slice(0, 1)) {
      const url = await uploadFile(f, folder);
      if (url) uploaded.push(url);
    }
    setBusy(false);
    if (!uploaded.length) return;
    onChange(multiple ? [...value, ...uploaded] : [uploaded[0]!]);
    toast.success(uploaded.length > 1 ? "Imagens enviadas." : "Imagem enviada.");
  }, [folder, multiple, onChange, value]);

  const remove = (url: string) => onChange(value.filter(v => v !== url));

  return (
    <div>
      {label && (
        <label className="block text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">{label}</label>
      )}

      <div
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); void handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
        className={`cursor-pointer border border-dashed px-6 py-8 text-center transition-colors ${drag ? "border-foreground bg-secondary/60" : "border-border hover:border-foreground"}`}
      >
        {busy ? (
          <Loader2 className="h-5 w-5 mx-auto animate-spin" />
        ) : (
          <Upload className="h-5 w-5 mx-auto text-muted-foreground" />
        )}
        <p className="mt-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
          {busy ? "Enviando…" : "Arraste a imagem ou clique para escolher"}
        </p>
        <p className="mt-1 text-[10px] text-muted-foreground">JPG, PNG ou WEBP · até {MAX_MB}MB</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={e => { if (e.target.files) void handleFiles(e.target.files); e.target.value = ""; }}
        />
      </div>

      {value.length > 0 && (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {value.map(url => (
            <div key={url} className="relative aspect-[3/4] bg-muted overflow-hidden group">
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => remove(url)}
                aria-label="Remover imagem"
                className="absolute top-1 right-1 bg-background/90 border border-border p-1"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <input
          value={urlInput}
          onChange={e => setUrlInput(e.target.value)}
          placeholder="ou cole uma URL de imagem"
          className="flex-1 border border-border px-3 py-2 text-xs bg-transparent"
        />
        <button
          type="button"
          onClick={() => {
            const u = urlInput.trim();
            if (!u) return;
            onChange(multiple ? [...value, u] : [u]);
            setUrlInput("");
          }}
          className="border border-border px-3 text-xs uppercase tracking-[0.18em] inline-flex items-center gap-1"
        >
          <LinkIcon className="h-3 w-3" /> Usar
        </button>
      </div>
    </div>
  );
}
