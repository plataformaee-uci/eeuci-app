import Link from "next/link";

// Logo oficial de EE-UCI (insignia circular + texto).
export function Logo({
  href = "/",
  className = "",
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2.5 ${className}`}
    >
      <span className="inline-flex h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-white/20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.jpeg"
          alt="Logo EE-UCI"
          className="h-full w-full scale-[1.08] object-cover"
        />
      </span>
      <span className="text-lg font-black tracking-tight text-white">
        EE-UCI
      </span>
    </Link>
  );
}
