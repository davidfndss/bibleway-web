"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

type ModalType = "book" | "chapter" | "version" | null;

export type BibleBook = {
  name: string;
  abbrev: string;
  chapters: string[][];
};

type HeaderProps = {
  book: BibleBook;
  bookIndex: number;
  chapter: number;
};

export default function Header({ book, bookIndex, chapter }: HeaderProps) {
  const router = useRouter();
  const { version } = useParams();

  const [modal, setModal] = useState<ModalType>(null);
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);

  const VERSION_NAMES: Record<string, string> = {
    aa: "Almeida Atualizada",
    nvi: "Nova Versão Internacional",
    acf: "Almeida Corrigida Fiel",
  };

  const versions = ["aa", "nvi", "acf"];

  /* ===========================
     BUSCA DOS LIVROS
  ============================ */
  useEffect(() => {
    if (!version) return;

    fetch(`/bible/${version}.json`)
      .then((res) => res.json())
      .then(setBooks);
  }, [version]);

  /* ===========================
     NAVEGAÇÃO
  ============================ */
  function goTo(bookAbbrev: string, chapter: number) {
    router.push(`/${version}/${bookAbbrev}/${chapter}`);
    setModal(null);
    setSelectedBook(null);
  }

  function changeVersion(newVersion: string) {
    router.push(`/${newVersion}/${book.abbrev}/${chapter}`);
    setModal(null);
  }

  function goPrev() {
    // Capítulo anterior no mesmo livro
    if (chapter > 1) {
      router.push(`/${version}/${book.abbrev}/${chapter - 1}`);
      return;
    }

    // Livro anterior
    if (bookIndex > 0) {
      const prevBook = books[bookIndex - 1];
      const lastChapter = prevBook.chapters.length;
      router.push(`/${version}/${prevBook.abbrev}/${lastChapter}`);
    }
  }

  function goNext() {
    const totalChapters = book.chapters.length;

    // Próximo capítulo no mesmo livro
    if (chapter < totalChapters) {
      router.push(`/${version}/${book.abbrev}/${chapter + 1}`);
      return;
    }

    // Próximo livro
    if (bookIndex < books.length - 1) {
      const nextBook = books[bookIndex + 1];
      router.push(`/${version}/${nextBook.abbrev}/1`);
    }
  }

  /* ===========================
     SETAS DO TECLADO ⬅️ ➡️
  ============================ */
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Não navega se algum modal estiver aberto
      if (modal) return;

      // Evita conflito se estiver digitando em input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key === "ArrowLeft") {
        goPrev();
      }

      if (e.key === "ArrowRight") {
        goNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [chapter, bookIndex, books, modal]);

  const currentBook = selectedBook ?? book;
  const totalChapters = currentBook.chapters.length;

  return (
    <>
      <header className="w-full py-2 px-4 flex justify-between items-center z-20 relative">
        {/* ⬅️ ANTERIOR */}
        <i
          className="bi bi-chevron-left text-3xl cursor-pointer"
          onClick={goPrev}
        />

        <div className="flex gap-2">
          <button
            className="border rounded-md py-1 px-6 text-sm"
            onClick={() => {
              setSelectedBook(null);
              setModal("book");
            }}
          >
            {currentBook.name.toUpperCase().substring(0, 17)}
            <i className="bi bi-chevron-down text-xs ml-1" />
          </button>

          <button
            className="border rounded-md py-1 px-6 text-sm"
            onClick={() => setModal("chapter")}
          >
            {chapter}
            <i className="bi bi-chevron-down text-xs ml-1" />
          </button>

          <button
            className="h-10 w-10 flex items-center justify-center border cursor-pointer rounded-md"
            onClick={() => setModal("version")}
          >
            <i className="bi bi-book text-xl" />
          </button>
        </div>

        {/* ➡️ PRÓXIMO */}
        <i
          className="bi bi-chevron-right text-3xl cursor-pointer"
          onClick={goNext}
        />
      </header>

      {/* ===========================
          MODAL
      ============================ */}
      {modal && (
        <div className="fixed inset-0 z-50 flex">
          <div className="bg-zinc-200 w-full max-w-[400px] mx-auto h-full p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {modal === "book" && "Livros"}
                {modal === "chapter" && "Capítulos"}
                {modal === "version" && "Versão da Bíblia"}
              </h2>
              <i
                className="bi bi-x text-3xl cursor-pointer"
                onClick={() => {
                  setModal(null);
                  setSelectedBook(null);
                }}
              />
            </div>

            {/* CAPÍTULOS */}
            {modal === "chapter" &&
              Array.from({ length: totalChapters }).map((_, i) => (
                <button
                  key={i}
                  className="w-full py-3 px-2 border-b border-zinc-400 text-left"
                  onClick={() => goTo(currentBook.abbrev, i + 1)}
                >
                  Capítulo {i + 1}
                </button>
              ))}

            {/* LIVROS */}
            {modal === "book" &&
              books.map((b) => (
                <button
                  key={b.abbrev}
                  className={`w-full flex gap-2 py-3 px-2 border-b border-zinc-400 text-left ${
                    selectedBook?.abbrev === b.abbrev
                      ? "bg-zinc-400/50 rounded-lg"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedBook(b);
                    setModal("chapter");
                  }}
                >
                  <span className="opacity-60 w-10 text-center rounded-xl bg-zinc-300">
                    {b.abbrev}
                  </span>
                  <span>{b.name}</span>
                </button>
              ))}

            {/* VERSÕES */}
            {modal === "version" &&
              versions.map((v) => (
                <button
                  key={v}
                  className={`w-full py-3 px-2 border-b border-zinc-400 cursor-pointer text-left uppercase ${
                    v === version ? "bg-zinc-400/50 rounded-lg" : ""
                  }`}
                  onClick={() => changeVersion(v)}
                >
                  {VERSION_NAMES[v]}
                </button>
              ))}
          </div>
        </div>
      )}
    </>
  );
}
