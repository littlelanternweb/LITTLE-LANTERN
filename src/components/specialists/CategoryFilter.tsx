"use client";

import { useRouter, useSearchParams } from "next/navigation";

const CATEGORY_GROUPS = [
  {
    label: "Counselling",
    options: [
      "General Counsellor",
      "Child & Adolescent Counsellor",
      "Parent & Family Counsellor",
      "Career Counsellor"
    ]
  },
  {
    label: "Psychology",
    options: [
      "Clinical Psychologist",
      "Child Psychologist",
      "Educational Psychologist"
    ]
  },
  {
    label: "Special Education & Therapy",
    options: [
      "Special / Remedial Educator",
      "Learning Support Specialist",
      "Behaviour Therapist",
      "ABA Therapist"
    ]
  },
  {
    label: "Education",
    options: [
      "Teacher / Faculty ( KG to 10)"
    ]
  },
  {
    label: "Allied Therapies",
    options: [
      "Occupational Therapist",
      "Speech & Language Therapist",
      "Audiologist"
    ]
  }
];

export function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set("category", e.target.value);
    } else {
      params.delete("category");
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="mt-8 max-w-sm mx-auto">
      <div className="relative">
        <select
          value={currentCategory}
          onChange={handleChange}
          className="appearance-none w-full px-5 py-3.5 bg-white border-2 border-slate-100 hover:border-slate-200 rounded-xl text-slate-700 text-[15px] font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary shadow-[0_2px_12px_rgb(0,0,0,0.02)] transition-all cursor-pointer"
        >
          <option value="">All Professionals</option>
          {CATEGORY_GROUPS.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-slate-400">
          <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
