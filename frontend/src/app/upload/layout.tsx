export default function UploadLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,transparent)]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}