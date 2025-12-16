"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./payments.css";

interface Payment {
  id: string;
  payment_type: string;
  amount: number;
  status: string;
  due_date: string | null;
  paid_at: string | null;
  payment_method: string | null;
  notes: string | null;
  bid_id: string | null;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("portal_token");
    const job = localStorage.getItem("portal_job");

    if (!token || !job) {
      router.push("/");
      return;
    }

    fetchPayments(token, JSON.parse(job).id);
  }, [router]);

  const fetchPayments = async (token: string, jobId: string) => {
    try {
      const res = await fetch(`/api/payments?job_id=${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (paymentId: string) => {
    setProcessingPayment(paymentId);
    
    // This would integrate with Stripe, Square, etc.
    // For now, just show an alert
    alert("Payment processing would integrate with your payment provider (Stripe, Square, etc.)");
    
    setProcessingPayment(null);
  };

  const getTotalAmount = () => {
    return payments.reduce((sum, p) => sum + p.amount, 0);
  };

  const getPaidAmount = () => {
    return payments
      .filter(p => p.status.toLowerCase() === "paid")
      .reduce((sum, p) => sum + p.amount, 0);
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid": return "status-paid";
      case "pending": return "status-pending";
      case "overdue": return "status-overdue";
      default: return "status-pending";
    }
  };

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  const totalAmount = getTotalAmount();
  const paidAmount = getPaidAmount();
  const remainingAmount = totalAmount - paidAmount;
  const percentPaid = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;

  return (
    <div className="payments-page">
      <header className="page-header">
        <div className="header-content">
          <button onClick={() => router.push("/dashboard")} className="btn-back">
            ← Back to Dashboard
          </button>
          <h1>Payments</h1>
        </div>
      </header>

      <main className="page-main">
        <div className="container">
          {payments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💳</div>
              <h2>No Payment Schedule Yet</h2>
              <p>Payment information will appear here once your project begins.</p>
            </div>
          ) : (
            <>
              {/* Payment Summary */}
              <div className="payment-summary">
                <div className="summary-card">
                  <div className="summary-label">Total Project Cost</div>
                  <div className="summary-amount">
                    ${totalAmount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>

                <div className="summary-card">
                  <div className="summary-label">Paid to Date</div>
                  <div className="summary-amount paid">
                    ${paidAmount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>

                <div className="summary-card">
                  <div className="summary-label">Remaining Balance</div>
                  <div className="summary-amount remaining">
                    ${remainingAmount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="progress-container">
                <div className="progress-label">
                  Payment Progress: {percentPaid.toFixed(0)}% Complete
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${percentPaid}%` }}
                  ></div>
                </div>
              </div>

              {/* Payment Schedule */}
              <div className="payments-list">
                <h2>Payment Schedule</h2>
                {payments.map((payment) => (
                  <div key={payment.id} className="payment-card">
                    <div className="payment-header">
                      <div>
                        <h3>{payment.payment_type}</h3>
                        <div className={`status-badge ${getStatusClass(payment.status)}`}>
                          {payment.status}
                        </div>
                      </div>
                      <div className="payment-amount">
                        ${payment.amount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </div>

                    <div className="payment-details">
                      {payment.due_date && (
                        <div className="detail-row">
                          <span className="detail-label">Due Date:</span>
                          <span className="detail-value">
                            {new Date(payment.due_date).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {payment.paid_at && (
                        <div className="detail-row">
                          <span className="detail-label">Paid On:</span>
                          <span className="detail-value">
                            {new Date(payment.paid_at).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {payment.payment_method && (
                        <div className="detail-row">
                          <span className="detail-label">Method:</span>
                          <span className="detail-value">{payment.payment_method}</span>
                        </div>
                      )}
                    </div>

                    {payment.notes && (
                      <div className="payment-notes">
                        <strong>Notes:</strong> {payment.notes}
                      </div>
                    )}

                    {payment.status.toLowerCase() === "pending" && (
                      <div className="payment-footer">
                        <button
                          onClick={() => handlePayment(payment.id)}
                          disabled={processingPayment === payment.id}
                          className="btn-pay"
                        >
                          {processingPayment === payment.id ? "Processing..." : "Make Payment"}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
