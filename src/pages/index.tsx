import React, { useEffect, useState } from "react";
import { ListTodo, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Todo = {
  id: string;
  title: string;
  is_complete: boolean;
  created_at: string;
};

export default function Index() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Erro ao buscar tarefas:", error);
    } else {
      setTodos((data as Todo[]) ?? []);
    }
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
    const { error } = await supabase
      .from("todos")
      .insert({ title: trimmed, is_complete: false });
    setSubmitting(false);
    if (error) {
      console.error("Erro ao inserir tarefa:", error);
      return;
    }
    setText("");
    await load();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);
    if (error) {
      console.error("Erro ao excluir tarefa:", error);
      return;
    }
    await load();
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-12 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 ring-1 ring-cyan-400/30">
            <ListTodo className="h-7 w-7 text-cyan-400" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Minhas <span className="text-cyan-400">Tarefas</span>
          </h1>
          <p className="mt-3 text-zinc-400">
            Organize o seu dia e acompanhe o seu progresso.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="mx-auto mb-10">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="O que você precisa fazer hoje?"
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
                <ListTodo className="h-5 w-5" />
              )}
              Adicionar
            </button>
          </div>
        </form>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          </div>
        ) : todos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-800 px-8 py-16 text-center">
            <ListTodo className="mx-auto mb-4 h-10 w-10 text-zinc-700" />
            <p className="text-zinc-500">
              Sua lista está vazia. Adicione uma tarefa para começar!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {todos.map((todo) => (
              <article
                key={todo.id}
                className="group flex items-center gap-4 rounded-xl border border-zinc-800/50 bg-zinc-900/80 p-4 transition-all hover:bg-zinc-900"
              >
                <p className="flex-1 leading-relaxed text-zinc-100">
                  {todo.title}
                </p>

                <button
                  onClick={() => handleDelete(todo.id)}
                  aria-label="Remover tarefa"
                  className="rounded-lg p-2 text-zinc-500 opacity-0 transition hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100 focus:opacity-100"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}