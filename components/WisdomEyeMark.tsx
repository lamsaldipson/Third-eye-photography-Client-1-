// An original, stylized linework mark — a single watchful eye above a
// curled brow line. It nods to the valley's temple iconography without
// reproducing any specific artwork: pared down to geometry, used once,
// and rendered in a single ink color so it reads as a mark, not an icon.
export default function WisdomEyeMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4 45C21 20 45 8 60 8C75 8 99 20 116 45C99 70 75 82 60 82C45 82 21 70 4 45Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="60" cy="45" r="14" stroke="currentColor" strokeWidth="2" />
      <circle cx="60" cy="45" r="3.5" fill="currentColor" />
      <path
        d="M46 62C50 66 55 68 60 68"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
