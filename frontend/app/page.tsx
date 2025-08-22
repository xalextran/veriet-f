import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';

export default async function RootPage() {
  const user = await currentUser();
  
  // Redirect authenticated users to dashboard
  if (user) {
    redirect('/dashboard');
  }
  
  // For unauthenticated users, redirect to sign-in
  // (You can change this to your external landing page later)
  redirect('/sign-in');
}
