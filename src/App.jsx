import { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "notebook-app-data";

const defaultData = {
  textbooks: [
    {
      id: "tb-1", name: "Introduction to Psychology", author: "Dr. Sarah Mitchell",
      summary: "A comprehensive overview of psychological principles, theories, and research methods.",
      chapters: [
        {
          id: "ch-1", name: "The Science of Mind",
          summary: "Explores the foundations of psychology as a scientific discipline.",
          sections: [
            {
              id: "sec-1", name: "What is Psychology?",
              summary: "Psychology is the scientific study of mind and behavior, encompassing conscious and unconscious phenomena.",
              bulletNotes: [
                "Psychology derives from Greek: psyche (soul) + logos (study)",
                "Modern psychology established by Wilhelm Wundt in 1879",
                "Four major goals: describe, explain, predict, change behavior",
                "Subfields include clinical, cognitive, developmental, social"
              ],
              inDepthNotes: "Psychology as a discipline has evolved dramatically since its philosophical roots. Early thinkers like Aristotle and Descartes pondered the relationship between mind and body, but it wasn't until the late 19th century that psychology emerged as a distinct scientific field.\n\nWundt's laboratory in Leipzig marked the formal beginning of experimental psychology, introducing systematic observation and measurement to the study of consciousness."
            },
            {
              id: "sec-2", name: "Research Methods",
              summary: "Overview of how psychologists design and conduct scientific studies.",
              bulletNotes: [
                "Experimental method: manipulate IV, measure DV",
                "Correlational studies: relationships without causation",
                "Case studies: in-depth individual analysis",
                "Surveys: large-scale data collection"
              ],
              inDepthNotes: "The experimental method remains the gold standard for establishing causal relationships in psychology."
            }
          ]
        },
        {
          id: "ch-2", name: "Biological Foundations",
          summary: "How the brain and nervous system influence behavior and mental processes.",
          sections: [
            {
              id: "sec-3", name: "Neurons and Neurotransmitters",
              summary: "The basic building blocks of the nervous system and chemical messaging.",
              bulletNotes: [
                "Neurons: specialized cells that transmit electrical signals",
                "Three types: sensory, motor, and interneurons",
                "Key neurotransmitters: serotonin, dopamine, GABA",
                "Synaptic gap: where chemical transmission occurs"
              ],
              inDepthNotes: "The human brain contains approximately 86 billion neurons, each forming thousands of synaptic connections."
            }
          ]
        }
      ]
    }
  ]
};

function loadData() { try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : defaultData; } catch { return defaultData; } }
function saveData(d) { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); }

const Stickers = {
  Heart: ({ size = 18, color = "#F4A5B8", style = {} }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
  ),
  Star: ({ size = 16, color = "#FFB347", style = {} }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  ),
  Sparkle: ({ size = 14, color = "#C3B1E1", style = {} }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}><path d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41L12 0Z"/></svg>
  ),
  Cloud: ({ size = 32, color = "#E0E7FF", style = {} }) => (
    <svg width={size} height={size * 0.65} viewBox="0 0 64 42" fill={color} style={style}><ellipse cx="32" cy="28" rx="28" ry="14" opacity="0.7"/><ellipse cx="20" cy="22" rx="18" ry="16"/><ellipse cx="44" cy="22" rx="18" ry="16"/><ellipse cx="32" cy="16" rx="16" ry="15"/></svg>
  ),
  Rainbow: ({ size = 28, style = {} }) => (
    <svg width={size} height={size * 0.6} viewBox="0 0 48 28" style={style}>
      <path d="M4 28C4 14.75 14.75 4 28 4C41.25 4 48 14.75 48 28" fill="none" stroke="#F4A5B8" strokeWidth="3" opacity="0.7"/>
      <path d="M8 28C8 16.95 16.95 8 28 8C39.05 8 44 16.95 44 28" fill="none" stroke="#FFB347" strokeWidth="3" opacity="0.7"/>
      <path d="M12 28C12 19.16 19.16 12 28 12C36.84 12 40 19.16 40 28" fill="none" stroke="#FDE68A" strokeWidth="3" opacity="0.7"/>
      <path d="M16 28C16 21.37 21.37 16 28 16C34.63 16 36 21.37 36 28" fill="none" stroke="#A8E6CF" strokeWidth="3" opacity="0.7"/>
    </svg>
  ),
};

function FloatingSparkles() {
  const sparkles = Array.from({ length: 10 }, (_, i) => ({
    left: `${8 + (i * 9) % 88}%`, top: `${12 + ((i * 23) % 75)}%`,
    delay: `${i * 0.5}s`, size: 8 + (i % 3) * 3,
    color: ["#F4A5B8", "#C3B1E1", "#A8E6CF", "#FFB347", "#A0D2F0"][i % 5],
    opacity: 0.2 + (i % 3) * 0.08
  }));
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {sparkles.map((s, i) => (
        <div key={i} style={{ position: "absolute", left: s.left, top: s.top, opacity: s.opacity, animation: `sparkleFloat 3s ease-in-out ${s.delay} infinite alternate` }}>
          <Stickers.Sparkle size={s.size} color={s.color} />
        </div>
      ))}
    </div>
  );
}

const TBI = {
  Home: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Add: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>,
  Book: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  Settings: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Trash: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>,
  ChevDown: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m6 9 6 6 6-6"/></svg>,
  Plus: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>,
  Menu: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M3 12h18"/><path d="M3 6h18"/><path d="M3 18h18"/></svg>,
  Folder: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="#FFB347" stroke="#FFB347" strokeWidth="1"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  Doc: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M14 2v6h6"/></svg>,
  Section: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h8"/></svg>,
  Back: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>,
  HeartO: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
};

const tbColors = ["#A0D2F0", "#C3B1E1", "#A8E6CF", "#F4A5B8", "#FFB347"];

export default function NotebookApp() {
  const [data, setData] = useState(loadData);
  const [sel, setSel] = useState({ textbook: null, chapter: null, section: null });
  const [exp, setExp] = useState({});
  const [sq, setSq] = useState("");
  const [sr, setSr] = useState(null);
  const [modal, setModal] = useState(null);
  const [sbOpen, setSbOpen] = useState(true);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => { saveData(data); }, [data]);
  useEffect(() => {
    if (data.textbooks.length > 0 && !sel.textbook) {
      const tb = data.textbooks[0], ch = tb.chapters?.[0], sec = ch?.sections?.[0];
      setSel({ textbook: tb.id, chapter: ch?.id || null, section: sec?.id || null });
      setExp({ [tb.id]: true, ...(ch ? { [ch.id]: true } : {}) });
    }
  }, []);

  useEffect(() => {
    if (!sq.trim()) { setSr(null); return; }
    const q = sq.toLowerCase(), res = [];
    data.textbooks.forEach(tb => {
      if (tb.name.toLowerCase().includes(q)) res.push({ type: "textbook", item: tb, path: tb.name });
      tb.chapters?.forEach(ch => {
        if (ch.name.toLowerCase().includes(q)) res.push({ type: "chapter", item: ch, tbId: tb.id, path: `${tb.name} > ${ch.name}` });
        ch.sections?.forEach(sec => {
          if ([sec.name, sec.summary, sec.inDepthNotes, ...(sec.bulletNotes || [])].join(" ").toLowerCase().includes(q))
            res.push({ type: "section", item: sec, tbId: tb.id, chId: ch.id, path: `${tb.name} > ${ch.name} > ${sec.name}` });
        });
      });
    });
    setSr(res);
  }, [sq, data]);

  const cTB = data.textbooks.find(t => t.id === sel.textbook);
  const cCH = cTB?.chapters?.find(c => c.id === sel.chapter);
  const cSEC = cCH?.sections?.find(s => s.id === sel.section);

  const ud = (fn) => setData(p => { const n = JSON.parse(JSON.stringify(p)); fn(n); return n; });
  const addTB = (n, a) => ud(d => d.textbooks.push({ id: crypto.randomUUID(), name: n, author: a || "", summary: "", chapters: [] }));
  const addCH = (tid, n) => ud(d => { const t = d.textbooks.find(x => x.id === tid); if (t) t.chapters.push({ id: crypto.randomUUID(), name: n, summary: "", sections: [] }); });
  const addSEC = (tid, cid, n) => ud(d => { const c = d.textbooks.find(x => x.id === tid)?.chapters?.find(x => x.id === cid); if (c) c.sections.push({ id: crypto.randomUUID(), name: n, summary: "", bulletNotes: [], inDepthNotes: "" }); });
  const del = (type, ids) => ud(d => {
    if (type === "textbook") d.textbooks = d.textbooks.filter(t => t.id !== ids.tbId);
    else if (type === "chapter") { const t = d.textbooks.find(x => x.id === ids.tbId); if (t) t.chapters = t.chapters.filter(c => c.id !== ids.chId); }
    else { const c = d.textbooks.find(x => x.id === ids.tbId)?.chapters?.find(x => x.id === ids.chId); if (c) c.sections = c.sections.filter(s => s.id !== ids.secId); }
  });
  const uSEC = (f, v) => ud(d => { const s = d.textbooks.find(x => x.id === sel.textbook)?.chapters?.find(x => x.id === sel.chapter)?.sections?.find(x => x.id === sel.section); if (s) s[f] = v; });
  const uCH = (f, v) => ud(d => { const c = d.textbooks.find(x => x.id === sel.textbook)?.chapters?.find(x => x.id === sel.chapter); if (c) c[f] = v; });
  const uTB = (f, v) => ud(d => { const t = d.textbooks.find(x => x.id === sel.textbook); if (t) t[f] = v; });
  const togExp = (id) => setExp(p => ({ ...p, [id]: !p[id] }));
  const selSec = (tid, cid, sid) => { setSel({ textbook: tid, chapter: cid, section: sid }); setExp(p => ({ ...p, [tid]: true, [cid]: true })); setSq(""); setSr(null); };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Nunito', sans-serif", background: "linear-gradient(135deg, #E8D5F5 0%, #F0E0F7 20%, #D5E8F5 40%, #E0F0E8 60%, #F5E8D5 80%, #F7E0E8 100%)", color: "#5D4E6D", overflow: "hidden", position: "relative" }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Patrick+Hand&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes sparkleFloat { 0% { transform: translateY(0) scale(1); opacity: 0.3; } 100% { transform: translateY(-8px) scale(1.15); opacity: 0.5; } }
        @keyframes gentleBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .nc { animation: fadeIn 0.3s ease-out both; }
        .si:hover { background: rgba(255,255,255,0.6) !important; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #D5C8E8; border-radius: 99px; }
      `}</style>

      {/* Sidebar */}
      <div style={{ width: sbOpen ? 230 : 0, minWidth: sbOpen ? 230 : 0, background: "rgba(255,255,255,0.65)", backdropFilter: "blur(16px)", borderRight: sbOpen ? "1px solid rgba(195,177,225,0.3)" : "none", display: "flex", flexDirection: "column", overflow: "hidden", transition: "width 0.3s cubic-bezier(.4,0,.2,1), min-width 0.3s cubic-bezier(.4,0,.2,1)" }}>
        <div style={{ padding: "18px 16px 10px", display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setSbOpen(false)} style={{ width: 32, height: 32, borderRadius: 10, border: "none", background: "rgba(195,177,225,0.25)", color: "#9B8BB4", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><TBI.Menu /></button>
        </div>
        <div style={{ padding: "4px 12px 8px" }}>
          {[{ icon: <TBI.Folder />, label: "Notebooks" }, { icon: <Stickers.Heart size={17} color="#F4A5B8" />, label: "Stickers" }, { icon: <span style={{ fontSize: 16 }}>📋</span>, label: "Quick Notes" }, { icon: <span style={{ color: "#56C8D8" }}><TBI.Search /></span>, label: "Search", onClick: () => setShowSearch(s => !s) }].map((item, i) => (
            <button key={i} className="si" onClick={item.onClick} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 12px", borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 600, color: "#5D4E6D", transition: "background 0.15s" }}>{item.icon}{item.label}</button>
          ))}
        </div>
        {showSearch && (
          <div style={{ padding: "0 12px 8px", animation: "fadeIn 0.2s ease-out" }}>
            <input autoFocus placeholder="Search notes..." value={sq} onChange={e => setSq(e.target.value)} style={{ width: "100%", padding: "8px 14px", borderRadius: 99, border: "2px solid #C3B1E1", outline: "none", background: "rgba(255,255,255,0.8)", fontFamily: "inherit", fontSize: 13, color: "#5D4E6D", boxSizing: "border-box" }} />
            {sr && <div style={{ marginTop: 6, maxHeight: 160, overflowY: "auto" }}>
              {sr.length === 0 && <div style={{ fontSize: 12, color: "#9B8BB4", padding: 8 }}>No results</div>}
              {sr.map((r, i) => (
                <button key={i} className="si" onClick={() => { if (r.type === "section") selSec(r.tbId, r.chId, r.item.id); else if (r.type === "chapter") { setSel(p => ({ ...p, textbook: r.tbId, chapter: r.item.id, section: null })); setExp(p => ({ ...p, [r.tbId]: true, [r.item.id]: true })); } else { setSel(p => ({ ...p, textbook: r.item.id, chapter: null, section: null })); setExp(p => ({ ...p, [r.item.id]: true })); } setSq(""); setSr(null); }} style={{ display: "block", width: "100%", textAlign: "left", padding: "6px 10px", borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", fontFamily: "inherit", fontSize: 12, color: "#5D4E6D" }}>
                  <div style={{ fontWeight: 700 }}>{r.item.name}</div>
                  <div style={{ fontSize: 10, color: "#9B8BB4" }}>{r.path}</div>
                </button>
              ))}
            </div>}
          </div>
        )}
        <div style={{ padding: "0 20px", marginBottom: 8 }}>
          <div style={{ borderTop: "1px dashed #D5C8E8", position: "relative", textAlign: "center" }}>
            <span style={{ position: "relative", top: -9, background: "rgba(255,255,255,0.65)", padding: "0 10px", fontSize: 10, fontWeight: 700, color: "#B4A3CC", letterSpacing: 1.5, textTransform: "uppercase" }}>Favorites</span>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "0 10px 12px" }}>
          {data.textbooks.map(tb => (
            <div key={tb.id} style={{ marginBottom: 4 }}>
              <div className="si" style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 10px", borderRadius: 10, cursor: "pointer", background: sel.textbook === tb.id && !sel.chapter ? "rgba(255,179,71,0.15)" : "transparent", transition: "background 0.15s" }} onClick={() => { togExp(tb.id); setSel({ textbook: tb.id, chapter: null, section: null }); }}>
                <span style={{ transition: "transform 0.2s", transform: exp[tb.id] ? "rotate(0deg)" : "rotate(-90deg)", color: "#C3B1E1" }}><TBI.ChevDown /></span>
                <TBI.Folder />
                <span style={{ flex: 1, fontSize: 13, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tb.name}</span>
                <button onClick={e => { e.stopPropagation(); setModal({ type: "addChapter", tbId: tb.id }); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#B4A3CC", padding: 2, display: "flex" }}><TBI.Plus /></button>
              </div>
              {exp[tb.id] && tb.chapters?.map(ch => (
                <div key={ch.id} style={{ marginLeft: 20 }}>
                  <div className="si" style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", borderRadius: 8, cursor: "pointer", background: sel.chapter === ch.id && !sel.section ? "rgba(195,177,225,0.15)" : "transparent", transition: "background 0.15s" }} onClick={() => { togExp(ch.id); setSel({ textbook: tb.id, chapter: ch.id, section: null }); }}>
                    <span style={{ transition: "transform 0.2s", transform: exp[ch.id] ? "rotate(0deg)" : "rotate(-90deg)", color: "#C3B1E1" }}><TBI.ChevDown /></span>
                    <span style={{ color: "#C3B1E1" }}><TBI.Doc /></span>
                    <span style={{ flex: 1, fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ch.name}</span>
                    <button onClick={e => { e.stopPropagation(); setModal({ type: "addSection", tbId: tb.id, chId: ch.id }); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#B4A3CC", padding: 2, display: "flex" }}><TBI.Plus /></button>
                  </div>
                  {exp[ch.id] && ch.sections?.map(sec => (
                    <div key={sec.id} className="si" onClick={() => selSec(tb.id, ch.id, sec.id)} style={{ marginLeft: 20, display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 8, cursor: "pointer", background: sel.section === sec.id ? "rgba(168,230,207,0.2)" : "transparent", transition: "background 0.15s" }}>
                      <span style={{ color: "#A8E6CF" }}><TBI.Section /></span>
                      <span style={{ flex: 1, fontSize: 12, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sec.name}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
          <button onClick={() => setModal({ type: "addTextbook" })} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "9px 14px", marginTop: 8, borderRadius: 10, border: "2px dashed #D5C8E8", background: "transparent", cursor: "pointer", color: "#B4A3CC", fontSize: 12, fontWeight: 700, fontFamily: "inherit" }} onMouseOver={e => { e.currentTarget.style.borderColor = "#C3B1E1"; e.currentTarget.style.background = "rgba(195,177,225,0.1)"; }} onMouseOut={e => { e.currentTarget.style.borderColor = "#D5C8E8"; e.currentTarget.style.background = "transparent"; }}><TBI.Plus /> Add Textbook</button>
        </div>
        <div style={{ padding: "8px 16px 16px", display: "flex", gap: 8, alignItems: "center" }}>
          <Stickers.Rainbow size={28} /><Stickers.Star size={14} color="#FDE68A" /><Stickers.Heart size={12} color="#F4A5B8" />
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
        <FloatingSparkles />
        {/* Toolbar */}
        <div style={{ padding: "12px 20px", display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.5)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(195,177,225,0.2)", position: "relative", zIndex: 2 }}>
          {!sbOpen && <button onClick={() => setSbOpen(true)} style={{ width: 34, height: 34, borderRadius: 10, border: "none", background: "rgba(195,177,225,0.2)", color: "#9B8BB4", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginRight: 4 }}><TBI.Menu /></button>}
          <button onClick={() => { if (sel.section) setSel(p => ({ ...p, section: null })); else if (sel.chapter) setSel(p => ({ ...p, chapter: null })); else if (sel.textbook) setSel(p => ({ ...p, textbook: null })); }} style={{ width: 34, height: 34, borderRadius: 10, border: "none", background: "rgba(195,177,225,0.15)", color: "#9B8BB4", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><TBI.Back /></button>
          <div style={{ display: "flex", gap: 0, background: "rgba(255,255,255,0.6)", borderRadius: 14, padding: 4, border: "1px solid rgba(195,177,225,0.2)", marginLeft: 8 }}>
            {[{ icon: <TBI.Home />, tip: "Home", act: () => setSel({ textbook: null, chapter: null, section: null }) }, { icon: <TBI.Search />, tip: "Search", act: () => { setSbOpen(true); setShowSearch(s => !s); } }, { icon: <TBI.Add />, tip: "Add", act: () => { if (sel.chapter) setModal({ type: "addSection", tbId: sel.textbook, chId: sel.chapter }); else if (sel.textbook) setModal({ type: "addChapter", tbId: sel.textbook }); else setModal({ type: "addTextbook" }); } }, { icon: <TBI.Book />, tip: "Notebooks", act: () => setSbOpen(s => !s) }, { icon: <TBI.Settings />, tip: "Settings" }].map((b, i) => (
              <button key={i} onClick={b.act} title={b.tip} style={{ width: 38, height: 38, borderRadius: 10, border: "none", background: tbColors[i], color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.15s, box-shadow 0.15s", boxShadow: `0 2px 8px ${tbColors[i]}44` }} onMouseOver={e => { e.currentTarget.style.transform = "scale(1.08)"; e.currentTarget.style.boxShadow = `0 4px 14px ${tbColors[i]}66`; }} onMouseOut={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = `0 2px 8px ${tbColors[i]}44`; }}>{b.icon}</button>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <button style={{ width: 34, height: 34, borderRadius: 10, border: "none", background: "rgba(244,165,184,0.15)", color: "#F4A5B8", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><TBI.HeartO /></button>
          <button style={{ width: 34, height: 34, borderRadius: 10, border: "none", background: "rgba(195,177,225,0.15)", color: "#9B8BB4", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><TBI.Settings /></button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", position: "relative", zIndex: 1 }}>
          <div style={{ margin: "20px auto", maxWidth: 800, minHeight: "calc(100vh - 120px)", background: "rgba(255,255,255,0.75)", backdropFilter: "blur(8px)", borderRadius: 20, border: "1px solid rgba(195,177,225,0.25)", boxShadow: "0 8px 40px rgba(147,130,180,0.1)", backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, rgba(195,177,225,0.15) 31px, rgba(195,177,225,0.15) 32px)", backgroundSize: "100% 32px", backgroundPosition: "0 60px", padding: "28px 40px 40px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 70, top: 0, bottom: 0, width: 2, background: "rgba(244,165,184,0.2)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: 16, right: 30, pointerEvents: "none" }}><Stickers.Cloud size={48} color="#E0E7FF" /><div style={{ position: "absolute", top: 8, left: 20 }}><Stickers.Sparkle size={10} color="#C3B1E1" /></div></div>

            {cSEC ? (
              <div className="nc" style={{ paddingLeft: 20 }}>
                <div style={{ position: "relative", display: "inline-block", marginBottom: 24 }}>
                  <div style={{ position: "absolute", inset: "-8px -20px", borderRadius: 20, background: "rgba(195,177,225,0.15)", zIndex: 0 }} />
                  <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10 }}>
                    <Stickers.Heart size={20} color="#F4A5B8" style={{ animation: "gentleBob 2s ease-in-out infinite" }} />
                    <EH value={cSEC.name} onChange={v => uSEC("name", v)} />
                  </div>
                </div>
                <Stickers.Heart size={14} color="#F4A5B8" style={{ position: "absolute", right: 100, top: 90, opacity: 0.5, animation: "gentleBob 2.5s ease-in-out infinite" }} />
                <div style={{ marginBottom: 28 }}>
                  <SH icon={<Stickers.Star size={16} color="#FFB347" />} color="#C3B1E1">Key Concepts:</SH>
                  <EA value={cSEC.summary} onChange={v => uSEC("summary", v)} placeholder="Write a summary of key concepts..." />
                </div>
                <div style={{ marginBottom: 28 }}>
                  <SH icon={<Stickers.Star size={16} color="#FFB347" />} color="#F4A5B8">Important Facts:</SH>
                  <BN items={cSEC.bulletNotes || []} onChange={v => uSEC("bulletNotes", v)} />
                </div>
                <Stickers.Cloud size={40} color="#E0F0E8" style={{ position: "absolute", right: 40, top: "50%", opacity: 0.5 }} />
                <div style={{ marginBottom: 28 }}>
                  <SH icon={<Stickers.Star size={16} color="#FFB347" />} color="#A8E6CF">In-Depth Notes:</SH>
                  <EA value={cSEC.inDepthNotes || ""} onChange={v => uSEC("inDepthNotes", v)} placeholder="Write detailed notes..." large />
                </div>
                <button onClick={() => { del("section", { tbId: sel.textbook, chId: sel.chapter, secId: sel.section }); setSel(p => ({ ...p, section: null })); }} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", borderRadius: 99, border: "1.5px solid rgba(244,165,184,0.4)", background: "transparent", color: "#D4889A", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginTop: 12 }}><TBI.Trash /> Delete Section</button>
              </div>
            ) : cCH ? (
              <div className="nc" style={{ paddingLeft: 20 }}>
                <div style={{ position: "relative", display: "inline-block", marginBottom: 24 }}>
                  <div style={{ position: "absolute", inset: "-8px -20px", borderRadius: 20, background: "rgba(195,177,225,0.15)" }} />
                  <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10 }}>
                    <Stickers.Star size={20} color="#FFB347" style={{ animation: "gentleBob 2s ease-in-out infinite" }} />
                    <EH value={cCH.name} onChange={v => uCH("name", v)} />
                  </div>
                </div>
                <div style={{ marginBottom: 28 }}><SH icon={<Stickers.Star size={16} color="#FFB347" />} color="#C3B1E1">Chapter Summary:</SH><EA value={cCH.summary || ""} onChange={v => uCH("summary", v)} placeholder="Write a chapter summary..." /></div>
                <SH icon={<Stickers.Star size={16} color="#FFB347" />} color="#A8E6CF">Sections ({cCH.sections?.length || 0}):</SH>
                <div style={{ display: "grid", gap: 10, marginTop: 8 }}>
                  {cCH.sections?.map(sec => (
                    <button key={sec.id} onClick={() => selSec(sel.textbook, sel.chapter, sec.id)} style={{ textAlign: "left", padding: "14px 18px", borderRadius: 16, border: "1.5px solid rgba(168,230,207,0.4)", background: "rgba(255,255,255,0.6)", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }} onMouseOver={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(168,230,207,0.3)"; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseOut={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
                      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{sec.name}</div>
                      <div style={{ fontSize: 12, color: "#9B8BB4", lineHeight: 1.5 }}>{sec.summary?.slice(0, 120)}{sec.summary?.length > 120 ? "..." : ""}</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : cTB ? (
              <div className="nc" style={{ paddingLeft: 20 }}>
                <div style={{ position: "relative", display: "inline-block", marginBottom: 24 }}>
                  <div style={{ position: "absolute", inset: "-8px -20px", borderRadius: 20, background: "rgba(255,179,71,0.1)" }} />
                  <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10 }}>
                    <Stickers.Heart size={20} color="#F4A5B8" style={{ animation: "gentleBob 2s ease-in-out infinite" }} />
                    <EH value={cTB.name} onChange={v => uTB("name", v)} />
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}><SH icon={<Stickers.Star size={16} color="#FFB347" />} color="#C3B1E1">Author:</SH><EA value={cTB.author || ""} onChange={v => uTB("author", v)} placeholder="Author name..." /></div>
                <div style={{ marginBottom: 28 }}><SH icon={<Stickers.Star size={16} color="#FFB347" />} color="#F4A5B8">Summary:</SH><EA value={cTB.summary || ""} onChange={v => uTB("summary", v)} placeholder="Write a textbook summary..." /></div>
                <SH icon={<Stickers.Star size={16} color="#FFB347" />} color="#A8E6CF">Chapters ({cTB.chapters?.length || 0}):</SH>
                <div style={{ display: "grid", gap: 10, marginTop: 8 }}>
                  {cTB.chapters?.map(ch => (
                    <button key={ch.id} onClick={() => { setSel(p => ({ ...p, chapter: ch.id, section: null })); setExp(p => ({ ...p, [ch.id]: true })); }} style={{ textAlign: "left", padding: "14px 18px", borderRadius: 16, border: "1.5px solid rgba(195,177,225,0.4)", background: "rgba(255,255,255,0.6)", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }} onMouseOver={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(195,177,225,0.3)"; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseOut={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
                      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{ch.name}</div>
                      <div style={{ fontSize: 12, color: "#9B8BB4" }}>{ch.sections?.length || 0} sections</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, textAlign: "center" }}>
                <div style={{ position: "relative", marginBottom: 20 }}>
                  <Stickers.Cloud size={80} color="#E0E7FF" />
                  <Stickers.Heart size={24} color="#F4A5B8" style={{ position: "absolute", top: -5, right: -5, animation: "gentleBob 2s ease-in-out infinite" }} />
                  <Stickers.Sparkle size={12} color="#FDE68A" style={{ position: "absolute", top: -10, left: 10 }} />
                </div>
                <div style={{ fontFamily: "Patrick Hand, Nunito", fontWeight: 700, fontSize: 28, color: "#5D4E6D", marginBottom: 8 }}>My Study Notes</div>
                <div style={{ fontSize: 14, color: "#9B8BB4", marginBottom: 20 }}>Select a notebook or create one to get started!</div>
                <Stickers.Rainbow size={48} />
              </div>
            )}
            <div style={{ position: "absolute", bottom: 16, right: 30, display: "flex", gap: 10, alignItems: "end", pointerEvents: "none", opacity: 0.5 }}>
              <Stickers.Heart size={12} color="#F4A5B8" /><Stickers.Rainbow size={32} />
            </div>
          </div>
        </div>
      </div>

      {modal && <AddModal modal={modal} onClose={() => setModal(null)} onAdd={(n, x) => { if (modal.type === "addTextbook") addTB(n, x); else if (modal.type === "addChapter") addCH(modal.tbId, n); else addSEC(modal.tbId, modal.chId, n); setModal(null); }} />}
    </div>
  );
}

function SH({ children, icon, color }) {
  return <div style={{ fontSize: 15, fontWeight: 800, color, marginBottom: 8, display: "flex", alignItems: "center", gap: 6, fontFamily: "Patrick Hand, Nunito", textDecoration: "underline", textDecorationColor: `${color}44`, textUnderlineOffset: 4 }}>{icon} {children}</div>;
}

function EH({ value, onChange }) {
  const [ed, setEd] = useState(false);
  const [d, setD] = useState(value);
  useEffect(() => setD(value), [value]);
  if (ed) return <input autoFocus value={d} onChange={e => setD(e.target.value)} onBlur={() => { onChange(d); setEd(false); }} onKeyDown={e => { if (e.key === "Enter") { onChange(d); setEd(false); } }} style={{ fontFamily: "Patrick Hand, Nunito", fontWeight: 800, fontSize: 24, border: "none", borderBottom: "2px solid #C3B1E1", outline: "none", background: "transparent", color: "#5D4E6D", width: "100%" }} />;
  return <h1 onClick={() => setEd(true)} style={{ fontFamily: "Patrick Hand, Nunito", fontWeight: 800, fontSize: 24, cursor: "pointer", margin: 0, color: "#5D4E6D", borderBottom: "2px solid transparent", transition: "border-color 0.2s" }} onMouseOver={e => e.currentTarget.style.borderBottom = "2px dashed #C3B1E1"} onMouseOut={e => e.currentTarget.style.borderBottom = "2px solid transparent"}>{value}</h1>;
}

function EA({ value, onChange, placeholder, large }) {
  const [ed, setEd] = useState(false);
  const [d, setD] = useState(value);
  const ref = useRef(null);
  useEffect(() => setD(value), [value]);
  useEffect(() => { if (ed && ref.current) { ref.current.style.height = "auto"; ref.current.style.height = ref.current.scrollHeight + "px"; } }, [ed, d]);
  if (ed) return <textarea ref={ref} autoFocus value={d} onChange={e => setD(e.target.value)} onBlur={() => { onChange(d); setEd(false); }} placeholder={placeholder} style={{ width: "100%", border: "2px solid #C3B1E1", borderRadius: 14, padding: "12px 16px", fontFamily: "inherit", fontSize: 14, lineHeight: 1.8, resize: "none", outline: "none", background: "rgba(255,255,255,0.6)", color: "#5D4E6D", minHeight: large ? 140 : 50, boxSizing: "border-box" }} />;
  return <div onClick={() => setEd(true)} style={{ fontSize: 14, lineHeight: 1.8, color: value ? "#5D4E6D" : "#B4A3CC", cursor: "pointer", padding: "4px 0", whiteSpace: "pre-wrap", borderRadius: 8, transition: "background 0.15s", minHeight: 20 }} onMouseOver={e => e.currentTarget.style.background = "rgba(195,177,225,0.08)"} onMouseOut={e => e.currentTarget.style.background = "transparent"}>{value || placeholder}</div>;
}

function BN({ items, onChange }) {
  const [ei, setEi] = useState(-1);
  const [d, setD] = useState("");
  const colors = ["#F4A5B8", "#C3B1E1", "#A8E6CF", "#FFB347", "#A0D2F0", "#FDE68A"];
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: 99, marginTop: 7, flexShrink: 0, background: colors[i % 6] }} />
          {ei === i ? <input autoFocus value={d} onChange={e => setD(e.target.value)} onBlur={() => { const n = [...items]; n[i] = d; onChange(n); setEi(-1); }} onKeyDown={e => { if (e.key === "Enter") { const n = [...items]; n[i] = d; onChange(n); setEi(-1); } }} style={{ flex: 1, border: "none", borderBottom: "1.5px solid #C3B1E1", outline: "none", background: "transparent", fontFamily: "inherit", fontSize: 14, padding: "2px 0", lineHeight: 1.7, color: "#5D4E6D" }} />
          : <div onClick={() => { setEi(i); setD(item); }} style={{ flex: 1, fontSize: 14, lineHeight: 1.7, cursor: "pointer", padding: "2px 0", borderRadius: 4, color: "#5D4E6D" }} onMouseOver={e => e.currentTarget.style.background = "rgba(195,177,225,0.08)"} onMouseOut={e => e.currentTarget.style.background = "transparent"}>{item}</div>}
          <button onClick={() => onChange(items.filter((_, j) => j !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: "#D5C8E8", padding: 2, marginTop: 4, display: "flex", flexShrink: 0 }} onMouseOver={e => e.currentTarget.style.color = "#F4A5B8"} onMouseOut={e => e.currentTarget.style.color = "#D5C8E8"}><TBI.Trash /></button>
        </div>
      ))}
      <button onClick={() => { onChange([...items, "New note"]); setEi(items.length); setD("New note"); }} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", borderRadius: 99, border: "none", background: "rgba(168,230,207,0.25)", color: "#6BC4A0", fontSize: 12, fontWeight: 700, cursor: "pointer", marginTop: 6, fontFamily: "inherit" }} onMouseOver={e => e.currentTarget.style.background = "rgba(168,230,207,0.4)"} onMouseOut={e => e.currentTarget.style.background = "rgba(168,230,207,0.25)"}><TBI.Plus /> Add note</button>
    </div>
  );
}

function AddModal({ modal, onClose, onAdd }) {
  const [n, setN] = useState("");
  const [x, setX] = useState("");
  const label = modal.type === "addTextbook" ? "Textbook" : modal.type === "addChapter" ? "Chapter" : "Section";
  const accent = modal.type === "addTextbook" ? "#FFB347" : modal.type === "addChapter" ? "#C3B1E1" : "#A8E6CF";
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(93,78,109,0.25)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)", borderRadius: 24, padding: "28px 32px", width: 360, boxShadow: "0 20px 60px rgba(93,78,109,0.15)", border: "1px solid rgba(195,177,225,0.3)", animation: "fadeIn 0.25s ease-out" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <Stickers.Star size={18} color="#FFB347" />
          <h3 style={{ fontFamily: "Patrick Hand, Nunito", fontWeight: 800, fontSize: 20, margin: 0, color: "#5D4E6D" }}>Add {label}</h3>
        </div>
        <input autoFocus placeholder={`${label} name`} value={n} onChange={e => setN(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && n.trim()) onAdd(n.trim(), x.trim()); }} style={{ width: "100%", padding: "11px 16px", borderRadius: 14, border: `2px solid ${accent}`, outline: "none", fontFamily: "inherit", fontSize: 14, marginBottom: 10, background: "rgba(255,255,255,0.8)", boxSizing: "border-box", color: "#5D4E6D" }} />
        {modal.type === "addTextbook" && <input placeholder="Author (optional)" value={x} onChange={e => setX(e.target.value)} style={{ width: "100%", padding: "11px 16px", borderRadius: 14, border: "2px solid #D5C8E8", outline: "none", fontFamily: "inherit", fontSize: 14, marginBottom: 10, background: "rgba(255,255,255,0.8)", boxSizing: "border-box", color: "#5D4E6D" }} />}
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "11px 0", borderRadius: 99, border: "2px solid #D5C8E8", background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "inherit", color: "#9B8BB4" }}>Cancel</button>
          <button onClick={() => { if (n.trim()) onAdd(n.trim(), x.trim()); }} disabled={!n.trim()} style={{ flex: 1, padding: "11px 0", borderRadius: 99, border: "none", background: n.trim() ? accent : "#D5C8E8", color: "#fff", cursor: n.trim() ? "pointer" : "default", fontSize: 13, fontWeight: 700, fontFamily: "inherit", transition: "background 0.2s", boxShadow: n.trim() ? `0 4px 14px ${accent}44` : "none" }}>Add {label}</button>
        </div>
      </div>
    </div>
  );
}
