'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if admin is already logged in
    const token = localStorage.getItem('admin_token');
    
    if (token) {
      // If logged in, go to dashboard
      router.push('/admin/dashboard');
    } else {
      // If not logged in, redirect to main portal
      router.push('/');
    }
  }, [router]);

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "#F0F0EE",
      fontFamily: "system-ui",
      color: "#261312"
    }}>
      <div>Redirecting...</div>
    </div>
  );
}
