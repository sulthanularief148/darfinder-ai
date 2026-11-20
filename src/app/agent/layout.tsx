import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

// Auth guard: all /agent/* routes require an authenticated user.
// The middleware also checks this, but this is a second layer of defense.
export default async function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?redirect=/agent/dashboard');
  }

  return <>{children}</>;
}
