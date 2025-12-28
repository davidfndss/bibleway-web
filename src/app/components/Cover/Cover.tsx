"use client";

import FindBookgroupDivisionByIndex from "@/app/utils/BookGroupDivision";

export default function Cover(props: { bookIndex: number }) {
  const groupDivision = FindBookgroupDivisionByIndex(props.bookIndex);

  return (
    <>
        <div className="px-4 mt-6 grayscale transition opacity-70 hover:grayscale-0 hover:opacity-100">
            <img src={`/img/group-${groupDivision}-cover.png`} className={`rounded-xl w-full`} alt="Book Cover" />
        </div>
    </>
  );
}
