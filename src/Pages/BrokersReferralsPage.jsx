import React, { useState } from "react";
import BrokersBoard from "../Components/brokers/BrokersBoard";
import BrokerDrawer from "../Components/brokers/BrokerDrawer";
import BrokerDetails from "../Components/brokers/BrokerDetails";

const COLORS = {
  text: "#E6E8F0",
  text2: "#A3A7B7",
  ring: "rgba(110,86,207,0.25)",
  gold: "#D4AF37",
  purple: "#6E56CF",
};

/** ---------- Mock Seed Data ---------- */
const SEED_BROKERS = [
  {
    id: "br_1001",
    name: "Alex Benjamin",
    email: "alex.benjamin@example.com",
    phone: "+1 212 555 0117",
    avatar: "https://i.pravatar.cc/64?img=11",
    status: "Active",            // Active | Inactive
    kyc: "Approved",             // Pending | Approved | Rejected
    activations: 68,
    earnings: 2040,              // total commissions earned ($)
    commissionRate: 0.10,        // 10% recurring
    activationFee: 30,           // $30 per activation (one-time)
    lastActive: "2025-08-20",
    joinedAt: "2025-05-10",
    chargebacks: 1,
    performance: {               // simple series demo
      months: ["Mar","Apr","May","Jun","Jul","Aug"],
      activations: [5, 8, 11, 13, 14, 17],
      earnings:    [90, 240, 390, 460, 420, 440],
    },
    payouts: [
      { id: "po_501", period: "Jul 2025", amount: 480, status: "Paid", paidAt: "2025-08-02" },
      { id: "po_502", period: "Aug 2025", amount: 520, status: "Pending" },
    ],
    history: [
      { ts: "2025-08-18 10:22", text: "Activation #68 (VIP member)" },
      { ts: "2025-08-10 14:05", text: "KYC document refreshed" },
      { ts: "2025-07-29 09:11", text: "Chargeback resolved" },
    ],
    resources: [
      { title: "PTM Discount Pitch Deck", url: "#", type: "pdf" },
      { title: "SSL Offer Training (Video)", url: "#", type: "video" },
      { title: "FAQ & Objection Handling", url: "#", type: "doc" },
    ],
  },
  {
    id: "br_1002",
    name: "Jerry Maguire",
    email: "jerry.m@example.com",
    phone: "+1 415 555 0188",
    avatar: "https://i.pravatar.cc/64?img=12",
    status: "Active",
    kyc: "Pending",
    activations: 31,
    earnings: 780,
    commissionRate: 0.08,
    activationFee: 30,
    lastActive: "2025-08-19",
    joinedAt: "2025-06-01",
    chargebacks: 0,
    performance: { months:["Mar","Apr","May","Jun","Jul","Aug"], activations:[2,4,5,7,6,7], earnings:[40,70,110,160,170,230] },
    payouts: [{ id:"po_601", period:"Aug 2025", amount:220, status:"Pending" }],
    history: [{ ts:"2025-08-12 16:42", text:"Requested KYC verification link resend" }],
    resources: [{ title:"Starter Script", url:"#", type:"doc" }],
  },
  {
    id: "br_1003",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+44 20 7946 0991",
    avatar: "https://i.pravatar.cc/64?img=13",
    status: "Inactive",
    kyc: "Rejected",
    activations: 9,
    earnings: 180,
    commissionRate: 0.07,
    activationFee: 30,
    lastActive: "2025-07-05",
    joinedAt: "2025-05-03",
    chargebacks: 0,
    performance: { months:["Mar","Apr","May","Jun","Jul","Aug"], activations:[1,2,3,2,1,0], earnings:[20,30,50,40,40,0] },
    payouts: [{ id:"po_701", period:"Jun 2025", amount:60, status:"Paid", paidAt:"2025-07-01" }],
    history: [{ ts:"2025-07-10 12:11", text:"KYC rejected – address mismatch" }],
    resources: [{ title:"KYC Checklist", url:"#", type:"pdf" }],
  },
];

const BrokersReferralsPage = () => {
  const [brokers, setBrokers] = useState(SEED_BROKERS);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [active, setActive] = useState(null);
  const [activationFeeRule, setActivationFeeRule] = useState(30); // $30 default

  const onCreate = () => { setEditing(null); setDrawerOpen(true); };
  const onEdit = (broker) => { setEditing(broker); setDrawerOpen(true); };
  const onSelect = (broker) => setActive(broker);

  const upsert = (record) => {
    setBrokers(prev => {
      const exists = prev.some(b => b.id === record.id);
      if (exists) return prev.map(b => (b.id === record.id ? record : b));
      const id = `br_${Math.floor(Math.random()*9000)+1000}`;
      return [{ ...record, id }, ...prev];
    });
    setDrawerOpen(false);
  };

  const onExport = (rows) => {
    const headers = ["ID","Name","Email","Phone","Status","KYC","Activations","Earnings","CommissionRate","ActivationFee","Chargebacks","LastActive","JoinedAt"];
    const source = rows?.length ? rows : brokers;
    const lines = source.map(b => [
      b.id, b.name, b.email, b.phone, b.status, b.kyc, b.activations, b.earnings,
      `${Math.round((b.commissionRate||0)*100)}%`, b.activationFee, b.chargebacks, b.lastActive, b.joinedAt
    ]);
    const csv = [headers, ...lines].map(r => r.map(v => `"${String(v ?? "").replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type:"text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `brokers_${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const updateBroker = (id, patch) => {
    setBrokers(prev => prev.map(b => (b.id === id ? { ...b, ...patch } : b)));
    setActive(a => (a && a.id === id ? { ...a, ...patch } : a));
  };

  const markPayoutPaid = (brokerId, payoutId) => {
    setBrokers(prev => prev.map(b => {
      if (b.id !== brokerId) return b;
      const payouts = (b.payouts || []).map(p => p.id === payoutId ? { ...p, status:"Paid", paidAt: new Date().toISOString().slice(0,10) } : p);
      return { ...b, payouts };
    }));
    setActive(a => {
      if (!a || a.id !== brokerId) return a;
      const payouts = (a.payouts || []).map(p => p.id === payoutId ? { ...p, status:"Paid", paidAt: new Date().toISOString().slice(0,10) } : p);
      return { ...a, payouts };
    });
  };

  const addPayoutStatement = (brokerId) => {
    setBrokers(prev => prev.map(b => {
      if (b.id !== brokerId) return b;
      const next = { id:`po_${Math.floor(Math.random()*9000)+100}`, period:"Sep 2025", amount: 300, status:"Pending" };
      return { ...b, payouts: [next, ...(b.payouts||[])] };
    }));
    setActive(a => {
      if (!a || a.id !== brokerId) return a;
      const next = { id:`po_${Math.floor(Math.random()*9000)+100}`, period:"Sep 2025", amount: 300, status:"Pending" };
      return { ...a, payouts: [next, ...(a.payouts||[])] };
    });
  };

  return (
    <div className="space-y-5">
      {/* Top bar: title + rules quick edit */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-semibold" style={{ color: COLORS.text }}>
          Brokers & Referrals
        </h1>
        <div className="flex items-center gap-2">
          <div className="rounded-xl px-3 py-2 text-xs" style={{ backgroundColor:"#12131A", border:`1px solid ${COLORS.ring}`, color: COLORS.text }}>
            Activation Fee:&nbsp;
            <input
              type="number"
              min={0}
              value={activationFeeRule}
              onChange={(e) => setActivationFeeRule(Number(e.target.value || 0))}
              className="w-16 rounded-md px-2 py-1 text-xs outline-none"
              style={{ backgroundColor:"#0B0B0F", border:`1px solid ${COLORS.ring}` }}
              aria-label="Activation fee rule"
            />
            <span className="ml-1" style={{ color: COLORS.text2 }}>/ activation</span>
          </div>
        </div>
      </div>

      <BrokersBoard
        data={brokers}
        onCreate={onCreate}
        onEdit={onEdit}
        onSelect={onSelect}
        onExport={onExport}
      />

      <BrokerDrawer
        open={drawerOpen}
        initial={editing}
        onClose={() => setDrawerOpen(false)}
        onSave={(record) => upsert({ ...record, activationFee: activationFeeRule })}
      />

      {active && (
        <BrokerDetails
          broker={active}
          onClose={() => setActive(null)}
          onEdit={() => { setEditing(active); setActive(null); setDrawerOpen(true); }}
          onUpdate={(patch) => updateBroker(active.id, patch)}
          onMarkPaid={(payoutId) => markPayoutPaid(active.id, payoutId)}
          onAddPayout={() => addPayoutStatement(active.id)}
          onExportOne={() => onExport([active])}
        />
      )}
    </div>
  );
};

export default BrokersReferralsPage;
