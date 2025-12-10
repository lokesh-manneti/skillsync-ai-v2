import { UploadWizard } from "@/components/features/upload/UploadWizard";
import { Navbar } from "@/components/layout/Navbar";

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar />
      <main className="pt-24 px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-heading font-bold text-slate-900">Let's build your profile</h1>
          <p className="text-slate-500 mt-2">Follow the steps to get your personalized roadmap.</p>
        </div>
        <UploadWizard />
      </main>
    </div>
  );
}