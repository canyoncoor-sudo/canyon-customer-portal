"use client";

import { useState } from "react";

export default function Home() {
  const [field1, setField1] = useState("");
  const [field2, setField2] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setStatus("Verifying...");
    setLoading(true);

    // Detect if this is an admin login (email format in field1)
    const isAdminLogin = field1.includes("@");

    if (isAdminLogin) {
      // Admin login flow
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: field1, password: field2 }),
        });

        const data = await res.json();

        if (!res.ok) {
          setStatus(data.error || 'Login failed');
          setLoading(false);
          return;
        }

        localStorage.setItem('admin_token', data.token);
        setStatus("✓ Access Granted - Redirecting...");
        
        setTimeout(() => {
          window.location.href = '/admin/dashboard';
        }, 500);
      } catch (err) {
        setStatus('An error occurred. Please try again.');
        setLoading(false);
      }
    } else {
      // Customer login flow
      const r = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: field1, code: field2 }),
      });
      const data = await r.json();
      
      if (!r.ok) {
        setStatus(data.error || "Unable to verify.");
        setLoading(false);
        return;
      }

      localStorage.setItem("portal_token", data.token);
      localStorage.setItem("portal_job", JSON.stringify(data.job));
      setStatus("✓ Access Granted - Redirecting...");
      
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: 24, background: "#F0F0EE", color: "#261312", fontFamily: "system-ui" }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div style={{ background: "white", borderRadius: 16, padding: 18, border: "1px solid rgba(38,19,18,.10)" }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: "#567A8D" }}>Canyon Construction Inc.</div>
          <h1 style={{ margin: "6px 0 6px" }}>Portal Access</h1>
          <p style={{ margin: 0, opacity: 0.8 }}>
            Enter your credentials to access the portal.
          </p>
        </div>

        <div style={{ background: "white", borderRadius: 16, padding: 18, border: "1px solid rgba(38,19,18,.10)", marginTop: 14 }}>
          <h2 style={{ marginTop: 0 }}>Login</h2>

          <label style={{ fontWeight: 800 }}>Email or Project Address</label>
          <input
            value={field1}
            onChange={(e) => setField1(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="projects@canyonconstructioninc.com or 123 Main St"
            style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid rgba(38,19,18,.2)", margin: "6px 0 12px" }}
          />

          <label style={{ fontWeight: 800 }}>Password or Access Code</label>
          <input
            type="password"
            value={field2}
            onChange={(e) => setField2(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter password or CANYON-XXXX"
            style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid rgba(38,19,18,.2)", margin: "6px 0 12px" }}
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ 
              background: "#712A18", 
              color: "#F0F0EE", 
              fontWeight: 900, 
              padding: "12px 14px", 
              borderRadius: 12, 
              border: 0, 
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Verifying...' : 'Access Portal'}
          </button>

          <div style={{ marginTop: 10, fontWeight: 800, color: status.includes("✓") ? "#567A8D" : "#712A18" }}>{status}</div>
        </div>
      </div>
    </div>
  );
}
