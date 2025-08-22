import React, { useMemo, useState } from "react";
import ContentTable from "../Components/content/ContentTable";
import ContentDrawer from "../Components/content/ContentDrawer";
import ContentDetails from "../Components/content/ContentDetails";

const COLORS = {
  text: "#E6E8F0",
  card: "#161821",
  ring: "rgba(110,86,207,0.25)",
  gold: "#D4AF37",
  purple: "#6E56CF",
};

/* ---- Mock seed data (replace with API later) ---- */
const SEED = [
  {
    id: "c_1001",
    title: "Mastering Your First Rental",
    category: "Real Estate",
    type: "video",
    status: "Published",
    tier: ["Paid", "VIP"],
    duration: 30, // minutes
    createdAt: "2025-07-14",
    scheduledAt: null,
    tags: ["property", "beginners"],
    collection: "Real Estate 101",
    views: 1845,
    watchTime: 17.2, // avg mins
    listens: 0,
    cover: "https://images.unsplash.com/photo-1505692794403-34d4982f88aa?q=80&w=1200&auto=format&fit=crop",
    mediaUrl: "#",
  },
  {
    id: "c_1002",
    title: "Pitch Deck Template (Download)",
    category: "Finance",
    type: "download",
    status: "Published",
    tier: ["Free", "Paid", "VIP"],
    duration: 0,
    createdAt: "2025-07-25",
    scheduledAt: null,
    tags: ["template", "fundraising"],
    collection: "Startup Toolkit",
    views: 921,
    watchTime: 0,
    listens: 0,
    cover: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200&auto=format&fit=crop",
    mediaUrl: "#",
  },
  {
    id: "c_1003",
    title: "Acting Warmups with Calvin (Podcast)",
    category: "Acting & Entertainment",
    type: "audio",
    status: "Published",
    tier: ["Paid", "VIP"],
    duration: 24,
    createdAt: "2025-08-05",
    scheduledAt: null,
    tags: ["podcast", "voice"],
    collection: "Calvin’s Corner",
    views: 0,
    watchTime: 0,
    listens: 1332,
    cover: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?q=80&w=1200&auto=format&fit=crop",
    mediaUrl: "#",
  },
  {
    id: "c_1004",
    title: "Luxury Branding Moves (Article)",
    category: "Acting & Entertainment",
    type: "article",
    status: "Draft",
    tier: ["Paid", "VIP"],
    duration: 8,
    createdAt: "2025-08-18",
    scheduledAt: null,
    tags: ["branding", "luxury"],
    collection: "Brand Builder",
    views: 0,
    watchTime: 0,
    listens: 0,
    cover: "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop",
    mediaUrl: "#",
  },
  {
    id: "c_1005",
    title: "High-Yield Savings: What’s New",
    category: "Finance",
    type: "video",
    status: "Scheduled",
    tier: ["Paid", "VIP"],
    duration: 18,
    createdAt: "2025-08-19",
    scheduledAt: "2025-08-25 10:00",
    tags: ["banking", "interest"],
    collection: "Money Moves",
    views: 0,
    watchTime: 0,
    listens: 0,
    cover: "https://images.unsplash.com/photo-1494173853739-c21f58b16055?q=80&w=1200&auto=format&fit=crop",
    mediaUrl: "#",
  },
];

const ContentPage = () => {
  const [items, setItems] = useState(SEED);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [details, setDetails] = useState(null);

  const collections = useMemo(
    () => Array.from(new Set(items.map((i) => i.collection).filter(Boolean))),
    [items]
  );

  const onCreate = () => {
    setEditing(null);
    setDrawerOpen(true);
  };

  const onEdit = (row) => {
    setEditing(row);
    setDrawerOpen(true);
  };

  const onSave = (record) => {
    setItems((prev) => {
      const exists = prev.some((x) => x.id === record.id);
      if (exists) return prev.map((x) => (x.id === record.id ? record : x));
      return [{ ...record, id: `c_${Math.floor(Math.random() * 9000) + 1000}` }, ...prev];
    });
    setDrawerOpen(false);
  };

  const onExport = (rows) => {
    const headers = [
      "ID",
      "Title",
      "Category",
      "Type",
      "Status",
      "Tiers",
      "Duration(min)",
      "Created",
      "Scheduled",
      "Tags",
      "Collection",
      "Views",
      "WatchTime(min)",
      "Listens",
    ];
    const lines = (rows.length ? rows : items).map((r) => [
      r.id,
      r.title,
      r.category,
      r.type,
      r.status,
      (r.tier || []).join("|"),
      r.duration || 0,
      r.createdAt || "",
      r.scheduledAt || "",
      (r.tags || []).join("|"),
      r.collection || "",
      r.views || 0,
      r.watchTime || 0,
      r.listens || 0,
    ]);
    const csv = [headers, ...lines]
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `content_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-semibold" style={{ color: COLORS.text }}>
          Content (Coaching & Podcasts)
        </h1>
        <button
          onClick={onCreate}
          className="px-3 py-2 rounded-xl text-sm font-medium"
          style={{
            background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.purple})`,
            color: "#0B0B0F",
          }}
        >
          New Content
        </button>
      </div>

      <ContentTable
        data={items}
        onEdit={onEdit}
        onDetails={(r) => setDetails(r)}
        onExport={onExport}
        onBulkDelete={(ids) => setItems((prev) => prev.filter((x) => !ids.includes(x.id)))}
        onBulkPublish={(ids) =>
          setItems((prev) => prev.map((x) => (ids.includes(x.id) ? { ...x, status: "Published" } : x)))
        }
        onBulkUnpublish={(ids) =>
          setItems((prev) => prev.map((x) => (ids.includes(x.id) ? { ...x, status: "Draft" } : x)))
        }
      />

      <ContentDrawer
        open={drawerOpen}
        initial={editing}
        collections={collections}
        onClose={() => setDrawerOpen(false)}
        onSave={onSave}
      />

      <ContentDetails
        item={details}
        onClose={() => setDetails(null)}
        onEdit={() => {
          setEditing(details);
          setDetails(null);
          setDrawerOpen(true);
        }}
      />
    </div>
  );
};

export default ContentPage;
