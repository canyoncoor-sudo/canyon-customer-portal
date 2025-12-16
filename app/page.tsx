"use client";

import { useState } from "react";

export default function Home() {
  const [address, setAddress] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("");
  const [job, setJob] = useState<any>(null);

  const verify = async () => {
    setStatus("Verifying...");
    const r = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, code }),
    });
    const data = await r.json();
    if (!r.ok) return setStatus(data.error || "Unable to verify.");

    localStorage.setItem("portal_token", data.token);
    localStorage.setItem("portal_job", JSON.stringify(data.job));
    setJob(data.job);
    setStatus("✓ Access Granted");
  };

  return (
    <div style={{ minHeight: "100vh", padding: 24, background: "#F0F0EE", color: "#261312", fontFamily: "system-ui" }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div style={{ background: "white", borderRadius: 16, padding: 18, border: "1px solid rgba(38,19,18,.10)" }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: "#567A8D" }}>🏗️ Canyon Construction Inc.</div>
          <h1 style={{ margin: "6px 0 6px" }}>Customer Portal</h1>
          <p style={{ margin: 0, opacity: 0.8 }}>Enter your project address and access code to view your project information.</p>
        </div>

        <div style={{ background: "white", borderRadius: 16, padding: 18, border: "1px solid rgba(38,19,18,.10)", marginTop: 14 }}>
          <h2 style={{ marginTop: 0 }}>Access Your Project</h2>

          <label style={{ fontWeight: 800 }}>Project Address</label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123 Main St"
            style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid rgba(38,19,18,.2)", margin: "6px 0 12px" }}
          />

          <label style={{ fontWeight: 800 }}>Access Code</label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="CANYON-1024"
            style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid rgba(38,19,18,.2)", margin: "6px 0 12px" }}
          />

          <button
            onClick={verify}
            style={{ background: "#712A18", color: "#F0F0EE", fontWeight: 900, padding: "12px 14px", borderRadius: 12, border: 0, cursor: "pointer" }}
          >
            View Project
          </button>

          <div style={{ marginTop: 10, fontWeight: 800 }}>{status}</div>

          {job && (
            <div style={{ marginTop: 12, padding: 12, borderRadius: 12, background: "rgba(86,122,141,.10)" }}>
              <div style={{ fontWeight: 900 }}>{job.customer_name}</div>
              <div style={{ opacity: 0.85 }}>Address: {job.job_address}</div>
              <div style={{ opacity: 0.85 }}>Status: {job.status}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
