"use client";

import Header from "@/app/components/Header/Header";
import Cover from "@/app/components/Cover/Cover";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export type BibleBook = {
  name: string;
  abbrev: string;
  chapters: string[][];
};

export default function ReadPage() {
  const { version, bookabbrev, chapter } = useParams();

  const [bible, setBible] = useState<BibleBook[]>([]);
  const chapterNumber = Number(chapter);

  useEffect(() => {
    if (!version) return;

    fetch(`/bible/${version}.json`)
      .then((res) => res.json())
      .then(setBible);
  }, [version]);

  const book = bible.find((b) => b.abbrev === bookabbrev);
  const bookIndex = bible.findIndex((b) => b.abbrev === bookabbrev);

  if (!book || isNaN(chapterNumber)) return null;

  const verses = book.chapters[chapterNumber - 1] ?? [];

  return (
    <main className="flex w-full max-w-[400px] min-h-screen flex-col mx-auto pt-4 pb-14">
      <Header
        book={book}
        bookIndex={bookIndex}
        chapter={chapterNumber}
      />

      <h1 className="text-3xl px-4 mt-8">
        {book.name} {chapterNumber}
      </h1>
      
      <div className="flex flex-col text-xl gap-2 mt-4 px-2">
        {verses.map((text, index) => (
          <p key={index} className="px-2">
            {index + 1}. {text}
          </p>
        ))}
      </div>

      <Cover bookIndex={bookIndex} />
    </main>
  );
}
