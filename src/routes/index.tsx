import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lightbulb, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/")({
  component: Index,
});

type Insight = {
  id: string;
  text: string;
  created_at: string;
};

function Index() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("insights")
      .select("*")
      .order("created_at", { ascending: false });
    setInsights((data as Insight[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    setSubmitting(true);
    const { data, error } = await supabase
      .from("insights")
      .insert({ text: trimmed })
      .select()
      .single();
    setSubmitting(false);
    if (!error && data) {
      setInsights((prev) => [data as Insight, ...prev]);
      setText("");
    }
  };

  const handleDelete = async (id: string) => {
    const prev = insights;
    setInsights((cur) => cur.filter((i) => i.id !== id));
    const { error } = await supabase.from("insights").delete().eq("id", id);
    if (error) setInsights(prev);
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <header className="mb-12 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 ring-1 ring-cyan-400/30">
            <Lightbulb className="h-7 w-7 text-cyan-400" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Mural de <span className="text-cyan-400">Insights</span>
          </h1>
          <p className="mt-3 text-zinc-400">
            Compartilhe uma ideia. Ela aparece no mural instantaneamente.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="mx-auto mb-14 max-w-2xl">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Qual é o seu insight de hoje?"
              maxLength={280}
              className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900/60 px-5 py-3 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
            />
            <button
              type="submit"
              disabled={submitting || !text.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-zinc-950 shadow-[0_0_30px_-5px_rgba(34,211,238,0.5)] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Lightbulb className="h-5 w-5" />
              )}
              Publicar
            </button>
          </div>
        </form>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          </div>
        ) : insights.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-zinc-800 px-8 py-16 text-center">
            <Lightbulb className="mx-auto mb-4 h-10 w-10 text-zinc-700" />
            <p className="text-zinc-500">
              Nenhum insight ainda. Seja o primeiro a iluminar o mural.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {insights.map((insight) => (
              <article
                key={insight.id}
                className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 transition hover:border-cyan-400/40 hover:bg-zinc-900"
              >
                <button
                  onClick={() => handleDelete(insight.id)}
                  aria-label="Remover insight"
                  className="absolute right-3 top-3 rounded-lg p-1.5 text-zinc-500 opacity-0 transition hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <p className="pr-6 text-zinc-100 leading-relaxed whitespace-pre-wrap break-words">
                  {insight.text}
                </p>
                <time className="mt-4 block text-xs text-zinc-500">
                  {new Date(insight.created_at).toLocaleString("pt-BR")}
                </time>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
