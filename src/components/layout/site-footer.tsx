import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-saffron-100 bg-teal-950 text-teal-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-white">Dukaan Mitra AI</p>
          <p className="mt-1 text-sm text-teal-200">
            Voice-first inventory for India&apos;s kirana stores
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/dashboard" className="hover:text-white">
            Dashboard
          </Link>
          <Link href="/how-it-works" className="hover:text-white">
            How it works
          </Link>
          <Link href="/settings" className="hover:text-white">
            Settings
          </Link>
        </div>
        <p className="text-xs text-teal-400">
          Built by Aryan Choudhary for Google Cloud Rapid Agent Hackathon
        </p>
      </div>
    </footer>
  );
}
