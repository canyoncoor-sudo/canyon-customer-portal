"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./quotes.css";

interface Bid {
  id: string;
  bid_name: string;
  description: string;
  amount: number;
  status: string;
  file_url: string | null;
  accepted_at: string | null;
  notes: string | null;
  created_at: string;
}

export default function QuotesPage() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingBid, setAcceptingBid] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("portal_token");
    const job = localStorage.getItem("portal_job");

    if (!token || !job) {
      router.push("/");
      return;
    }

    fetchBids(token, JSON.parse(job).id);
  }, [router]);

  const fetchBids = async (token: string, jobId: string) => {
    try {
      const res = await fetch(`/api/bids?job_id=${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        setBids(data.bids || []);
      }
    } catch (error) {
      console.error("Error fetching bids:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptBid = async (bidId: string) => {
    const token = localStorage.getItem("portal_token");
    setAcceptingBid(bidId);

    try {
      const res = await fetch(`/api/bids/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bid_id: bidId }),
      });

      if (res.ok) {
        // Refresh bids
        const job = localStorage.getItem("portal_job");
        fetchBids(token!, JSON.parse(job!).id);
      }
    } catch (error) {
      console.error("Error accepting bid:", error);
    } finally {
      setAcceptingBid(null);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted": return "status-accepted";
      case "pending": return "status-pending";
      case "rejected": return "status-rejected";
      case "paid": return "status-paid";
      default: return "status-pending";
    }
  };

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="quotes-page">
      <header className="page-header">
        <div className="header-content">
          <button onClick={() => router.push("/dashboard")} className="btn-back">
            ← Back to Dashboard
          </button>
          <h1>Quotes & Bids</h1>
        </div>
      </header>

      <main className="page-main">
        <div className="container">
          {bids.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📄</div>
              <h2>No Quotes Yet</h2>
              <p>Your contractor will send quotes for your review.</p>
            </div>
          ) : (
            <div className="bids-list">
              {bids.map((bid) => (
                <div key={bid.id} className="bid-card">
                  <div className="bid-header">
                    <div>
                      <h3>{bid.bid_name}</h3>
                      <div className={`status-badge ${getStatusClass(bid.status)}`}>
                        {bid.status}
                      </div>
                    </div>
                    <div className="bid-amount">
                      ${bid.amount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </div>

                  {bid.description && (
                    <p className="bid-description">{bid.description}</p>
                  )}

                  {bid.notes && (
                    <div className="bid-notes">
                      <strong>Notes:</strong> {bid.notes}
                    </div>
                  )}

                  <div className="bid-footer">
                    <div className="bid-date">
                      Submitted: {new Date(bid.created_at).toLocaleDateString()}
                      {bid.accepted_at && (
                        <> • Accepted: {new Date(bid.accepted_at).toLocaleDateString()}</>
                      )}
                    </div>

                    <div className="bid-actions">
                      {bid.file_url && (
                        <a
                          href={bid.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary"
                        >
                          View PDF
                        </a>
                      )}
                      {bid.status.toLowerCase() === "pending" && (
                        <button
                          onClick={() => handleAcceptBid(bid.id)}
                          disabled={acceptingBid === bid.id}
                          className="btn-accept"
                        >
                          {acceptingBid === bid.id ? "Accepting..." : "Accept Bid"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
