import React from "react";
import { MdPlayCircleFilled, MdSync, MdEvent, MdPayments, MdPodcasts } from "react-icons/md";

const COLORS = {
  card: "#161821",
  text: "#E6E8F0",
  text2: "#A3A7B7",
  ring: "rgba(110,86,207,0.25)",
  gold: "#D4AF37",
  purple: "#6E56CF",
};

const iconFor = (title) => {
  if (/publish|video|coaching/i.test(title)) return <MdPlayCircleFilled size={18} />;
  if (/ptm|sync/i.test(title)) return <MdSync size={18} />;
  if (/event/i.test(title)) return <MdEvent size={18} />;
  if (/payout|payment/i.test(title)) return <MdPayments size={18} />;
  if (/podcast/i.test(title)) return <MdPodcasts size={18} />;
  return <MdPlayCircleFilled size={18} />;
};

const ActivityFeed = ({ items = [] }) => {
  return (
    <div
      className="rounded-2xl p-4 sm:p-5"
      style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.ring}` }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold" style={{ color: COLORS.text }}>
          Activity Feed
        </h3>
        <span className="text-xs" style={{ color: COLORS.text2 }}>
          Latest updates
        </span>
      </div>

      <ul className="mt-2 space-y-3">
        {items.map((it) => (
          <li key={it.id} className="flex items-start gap-3">
            <span
              className="w-9 h-9 rounded-xl grid place-items-center shrink-0"
              style={{
                background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.purple})`,
                color: "#0B0B0F",
              }}
            >
              {iconFor(it.title)}
            </span>
            <div className="flex-1">
              <div className="text-sm" style={{ color: COLORS.text }}>
                {it.title}
              </div>
              <div className="text-xs" style={{ color: COLORS.text2 }}>
                {it.by} • {it.when}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityFeed;
