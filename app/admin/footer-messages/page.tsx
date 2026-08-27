import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Function to securely fetch messages on the server
async function getFooterMessages() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data, error } = await supabase
    .from('footer_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching footer messages:', error);
    return [];
  }

  return data;
}

export default async function AdminFooterMessagesPage() {
  const messages = await getFooterMessages();

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8 border-b-2 border-[#0A0A0A] pb-4">
        <h1 className="text-3xl font-bold text-[#0A0A0A]">
          Footer Messages
        </h1>
        <span className="bg-[#293241] text-white px-3 py-1 text-sm font-bold border-2 border-[#0A0A0A]">
          {messages.length} Total
        </span>
      </div>

      <div className="bg-white border-2 border-[#0A0A0A] shadow-[4px_4px_0px_0px_#0A0A0A]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#293241] text-white">
              <th className="p-4 border-r-2 border-[#0A0A0A] font-bold uppercase text-xs tracking-wider">
                Email Address
              </th>
              <th className="p-4 font-bold uppercase text-xs tracking-wider">
                Date Received
              </th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 ? (
              <tr>
                <td colSpan={2} className="p-8 text-center text-gray-500 font-medium">
                  No footer messages yet. Check back later!
                </td>
              </tr>
            ) : (
              messages.map((msg: any) => (
                <tr key={msg.id} className="border-b-2 border-[#0A0A0A] hover:bg-gray-50 transition-colors">
                  <td className="p-4 border-r-2 border-[#0A0A0A] font-medium text-[#C62828]">
                    {msg.email}
                  </td>
                  <td className="p-4 text-gray-600 text-sm">
                    {new Date(msg.created_at).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}