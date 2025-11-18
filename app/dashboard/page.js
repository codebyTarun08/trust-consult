'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard/profile');
  }, [router]);

  return null; // No need to render anything
};

export default Dashboard;