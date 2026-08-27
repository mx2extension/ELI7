'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Mail, Trash2 } from 'lucide-react';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    const { data } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false });
    if (data) setMessages(data);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">Inbox</h1>
      <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] p-6 shadow-[8px_8px_0px_#0A0A0A]">
        {messages.map((msg) => (
          <div key={msg.id} className="border-b-2 border-[#0A0A0A] py-4 last:border-0">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold">{msg.name}</h4>
                <p className="text-sm text-[#EE6C4D]">{msg.email}</p>
              </div>
              <span className="text-xs">{new Date(msg.created_at).toLocaleDateString()}</span>
            </div>
            <p className="mt-2 text-sm text-[#293241]/80">{msg.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}