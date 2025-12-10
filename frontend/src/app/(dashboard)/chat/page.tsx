import { ChatInterface } from "@/components/features/chat/ChatInterface";

export default function ChatPage() {
  return (
    <div className="max-w-4xl mx-auto h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-slate-900">AI Career Mentor</h1>
        <p className="text-slate-500">Your personal guide to mastering your roadmap.</p>
      </div>
      
      <ChatInterface />
    </div>
  );
}