import React, { useMemo, useState } from "react";
import UsersTable from "../Components/users/UsersTable";
import UserDrawer from "../Components/users/UserDrawer";

/* Theme */
const COLORS = {
  bg: "#0B0B0F",
  bg2: "#12131A",
  card: "#161821",
  text: "#E6E8F0",
  text2: "#A3A7B7",
  ring: "rgba(110,86,207,0.25)",
  gold: "#D4AF37",
  purple: "#6E56CF",
};

/* ---- mock users (testing) ---- */
const USERS = [
  {
    id: "u_1001",
    userId: "#SSL1001",
    name: "Natali Craig",
    email: "natali@example.com",
    avatar: "https://i.pravatar.cc/64?img=47",
    role: "User",
    tier: "Free",
    subscription: {
      status: "Active",
      plan: "Soul Access (Free)",
      nextInvoiceAt: null,
      amount: 0,
    },
    lastActive: "Just now",
    joinedAt: "2025-02-02",
    brokerId: null,
    invoices: [{ id: "inv_1", date: "2025-07-02", amount: 0, status: "paid" }],
    devices: [
      {
        id: "d1",
        device: "iPhone 14",
        os: "iOS 17",
        lastSeen: "Today 10:12",
        location: "NY, USA",
      },
    ],
    notes: "Interested in finance content.",
    audit: [
      {
        id: "a1",
        when: "2025-08-01 11:20",
        action: "Profile updated",
        by: "User",
      },
    ],
  },
  {
    id: "u_1002",
    userId: "#SSL1002",
    name: "Jerry Maguire",
    email: "jerry@example.com",
    avatar: "https://i.pravatar.cc/64?img=12",
    role: "Broker",
    tier: "Paid",
    subscription: {
      status: "Active",
      plan: "Soul Starter",
      nextInvoiceAt: "2025-09-05",
      amount: 19.95,
    },
    lastActive: "A minute ago",
    joinedAt: "2025-04-18",
    brokerId: "BRK-03991",
    invoices: [
      { id: "inv_21", date: "2025-08-05", amount: 19.95, status: "paid" },
      { id: "inv_22", date: "2025-07-05", amount: 19.95, status: "paid" },
    ],
    devices: [
      {
        id: "d2",
        device: "Galaxy S23",
        os: "Android 14",
        lastSeen: "Today 08:51",
        location: "LA, USA",
      },
    ],
    notes: "Top broker; 12 activations.",
    audit: [
      {
        id: "a2",
        when: "2025-08-05 09:01",
        action: "Invoice paid",
        by: "System",
      },
      {
        id: "a3",
        when: "2025-08-01 15:45",
        action: "Broker payout issued",
        by: "Finance",
      },
    ],
  },
  {
    id: "u_1003",
    userId: "#SSL1003",
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "https://i.pravatar.cc/64?img=13",
    role: "User",
    tier: "VIP",
    subscription: {
      status: "Active",
      plan: "SOUL LEGACY INNER CIRCLE",
      nextInvoiceAt: "2025-09-01",
      amount: 49.95,
    },
    lastActive: "1 hour ago",
    joinedAt: "2025-01-09",
    brokerId: null,
    invoices: [
      { id: "inv_31", date: "2025-08-01", amount: 49.95, status: "paid" },
      { id: "inv_32", date: "2025-07-01", amount: 49.95, status: "paid" },
    ],
    devices: [
      {
        id: "d3",
        device: "MacBook Air M2",
        os: "macOS 14",
        lastSeen: "Yesterday",
        location: "London, UK",
      },
    ],
    notes: "VIP—attends most events.",
    audit: [
      {
        id: "a4",
        when: "2025-07-28 12:08",
        action: "Upgraded to VIP",
        by: "User",
      },
    ],
  },
  {
    id: "u_1004",
    userId: "#SSL1004",
    name: "Alex Benjamin",
    email: "alex@example.com",
    avatar: "https://i.pravatar.cc/64?img=11",
    role: "Admin",
    tier: "Paid",
    subscription: {
      status: "Active",
      plan: "Soul Starter",
      nextInvoiceAt: "2025-09-03",
      amount: 19.95,
    },
    lastActive: "Yesterday",
    joinedAt: "2025-05-10",
    brokerId: null,
    invoices: [
      { id: "inv_41", date: "2025-08-03", amount: 19.95, status: "paid" },
    ],
    devices: [
      {
        id: "d4",
        device: "iPad Pro",
        os: "iPadOS 17",
        lastSeen: "Today 06:24",
        location: "Dubai, UAE",
      },
    ],
    notes: "Admin user.",
    audit: [
      {
        id: "a5",
        when: "2025-08-10 10:02",
        action: "Role changed to Admin",
        by: "SuperAdmin",
      },
    ],
  },
  {
    id: "u_1005",
    userId: "#SSL1005",
    name: "Sam Carter",
    email: "sam@example.com",
    avatar: "https://i.pravatar.cc/64?img=5",
    role: "User",
    tier: "Trial",
    subscription: {
      status: "Trial",
      plan: "Soul Starter (Trial)",
      nextInvoiceAt: "2025-08-28",
      amount: 0,
    },
    lastActive: "2 days ago",
    joinedAt: "2025-08-20",
    brokerId: "BRK-22220",
    invoices: [],
    devices: [
      {
        id: "d5",
        device: "Pixel 7",
        os: "Android 14",
        lastSeen: "2 days ago",
        location: "Karachi, PK",
      },
    ],
    notes: "Trial from broker.",
    audit: [
      {
        id: "a6",
        when: "2025-08-20 14:33",
        action: "Trial started",
        by: "System",
      },
    ],
  },
  {
    id: "u_1006",
    userId: "#SSL1006",
    name: "Maria Lopez",
    email: "mlopez@example.com",
    avatar: "https://i.pravatar.cc/64?img=32",
    role: "User",
    tier: "Paid",
    subscription: {
      status: "Cancelled",
      plan: "Soul Starter",
      nextInvoiceAt: null,
      amount: 0,
    },
    lastActive: "3 days ago",
    joinedAt: "2025-03-04",
    brokerId: null,
    invoices: [
      { id: "inv_61", date: "2025-07-04", amount: 19.95, status: "refunded" },
      { id: "inv_62", date: "2025-06-04", amount: 19.95, status: "paid" },
    ],
    devices: [
      {
        id: "d6",
        device: "Windows PC",
        os: "Windows 11",
        lastSeen: "3 days ago",
        location: "Madrid, ES",
      },
    ],
    notes: "Cancelled after refund.",
    audit: [
      {
        id: "a7",
        when: "2025-07-05 10:51",
        action: "Subscription cancelled",
        by: "Support",
      },
    ],
  },
];

/* small derived KPIs (header tiles) */
const deriveKpis = (list) => {
  const total = list.length;
  const paid = list.filter((u) => u.tier === "Paid").length;
  const vip = list.filter((u) => u.tier === "VIP").length;
  const trial = list.filter((u) => u.tier === "Trial").length;
  const cancelled = list.filter(
    (u) => u.subscription.status === "Cancelled"
  ).length;
  return [
    { label: "Total Users", value: total.toLocaleString() },
    { label: "Paid", value: paid.toLocaleString() },
    { label: "VIP", value: vip.toLocaleString() },
    { label: "Trial", value: trial.toLocaleString() },
    { label: "Cancelled", value: cancelled.toLocaleString() },
  ];
};

const UsersPage = () => {
  const [users, setUsers] = useState(USERS);
  const [drawerUser, setDrawerUser] = useState(null);
  const kpis = useMemo(() => deriveKpis(users), [users]);

  return (
    <div className="space-y-5">
      {/* header */}
      <div className="flex items-center justify-between">
        <h1
          className="text-xl md:text-2xl font-semibold"
          style={{ color: COLORS.text }}
        >
          Users & Memberships
        </h1>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="rounded-2xl p-4"
            style={{
              backgroundColor: COLORS.card,
              border: `1px solid ${COLORS.ring}`,
            }}
          >
            <div className="text-xs" style={{ color: COLORS.text2 }}>
              {k.label}
            </div>
            <div
              className="mt-1 text-2xl font-semibold"
              style={{ color: COLORS.text }}
            >
              {k.value}
            </div>
            <div
              className="mt-3 h-1 rounded-full"
              style={{
                background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.purple})`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Users table (list/filters/bulk ops) */}
      <UsersTable
        data={users}
        onOpenUser={(u) => setDrawerUser(u)}
        onUpdateUser={(updated) =>
          setUsers((arr) => arr.map((u) => (u.id === updated.id ? updated : u)))
        }
      />

      {/* User Drawer (profile, membership, invoices, devices, notes, audit) */}
      <UserDrawer user={drawerUser} onClose={() => setDrawerUser(null)} />
    </div>
  );
};

export default UsersPage;
