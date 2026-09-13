export default function TopBar() {
  return (
    <div className="topbar">
      <div className="topbar-inner">
        <div className="topbar-left">
          <span className="govt-badge">GOVT OF INDIA</span>
          <span>Ministry of Consumer Affairs, Food &amp; Public Distribution</span>
          <span className="divider">|</span>
          <span>Department of Consumer Affairs (DOCA)</span>
        </div>
        <div className="topbar-right">
          <span className="live-feed">
            <span className="dot" /> Agmarknet AI Live Feeds Active
          </span>
          <span>National Farm-to-Fork Grid • Verified</span>
        </div>
      </div>
    </div>
  );
}
