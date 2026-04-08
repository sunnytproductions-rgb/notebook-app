import { useState, useEffect, useRef, useCallback } from "react";

const STORAGE_KEY = "notebook-app-data";
const SETTINGS_KEY = "notebook-app-settings";

const defaultData = { textbooks: [] };
const defaultSettings = { apiKey: "", theme: "light" };

function loadData() { try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : defaultData; } catch { return defaultData; } }
function saveData(d) { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); }
function loadSettings() { try { const r = localStorage.getItem(SETTINGS_KEY); return r ? JSON.parse(r) : defaultSettings; } catch { return defaultSettings; } }
function saveSettings(s) { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); }

// Icons
const Icons = {
  Book: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>,
  Trash: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>,
  ChevDown: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m6 9 6 6 6-6"/></svg>,
  Menu: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M3 12h18"/><path d="M3 6h18"/><path d="M3 18h18"/></svg>,
  Folder: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="#FFB347" stroke="#FFB347" strokeWidth="1"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  Doc: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M14 2v6h6"/></svg>,
  Section: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h8"/></svg>,
  Back: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>,
  Settings: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Upload: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  Sparkle: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"/></svg>,
  AI: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  Image: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  File: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M14 2v6h6"/></svg>,
  X: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>,
  Home: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Edit: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
};

const ACCENT = { pink: "#F4A5B8", lavender: "#C3B1E1", mint: "#A8E6CF", sky: "#A0D2F0", peach: "#FFB347", butter: "#FDE68A" };

export default function NotebookApp() {
  const [data, setData] = useState(loadData);
  const [settings, setSettings] = useState(loadSettings);
  const [sel, setSel] = useState({ textbook: null, chapter: null, section: null });
  const [exp, setExp] = useState({});
  const [sq, setSq] = useState("");
  const [sr, setSr] = useState(null);
  const [modal, setModal] = useState(null);
  const [sbOpen, setSbOpen] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [view, setView] = useState("notebook"); // notebook | sources | settings
  const [processing, setProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => { saveData(data); }, [data]);
  useEffect(() => { saveSettings(settings); }, [settings]);

  // Auto-select first textbook
  useEffect(() => {
    if (data.textbooks.length > 0 && !sel.textbook) {
      const tb = data.textbooks[0], ch = tb.chapters?.[0], sec = ch?.sections?.[0];
      setSel({ textbook: tb.id, chapter: ch?.id || null, section: sec?.id || null });
      setExp({ [tb.id]: true, ...(ch ? { [ch.id]: true } : {}) });
    }
  }, []);

  // Search
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
  const addTB = (name, author) => {
    const id = crypto.randomUUID();
    ud(d => d.textbooks.push({ id, name, author: author || "", summary: "", chapters: [], sources: [] }));
    setSel({ textbook: id, chapter: null, section: null });
    setExp(p => ({ ...p, [id]: true }));
  };
  const addCH = (tid, name) => {
    const id = crypto.randomUUID();
    ud(d => { const t = d.textbooks.find(x => x.id === tid); if (t) { if (!t.chapters) t.chapters = []; t.chapters.push({ id, name, summary: "", sections: [] }); } });
    setSel(p => ({ ...p, chapter: id, section: null }));
    setExp(p => ({ ...p, [tid]: true, [id]: true }));
  };
  const addSEC = (tid, cid, name) => {
    const id = crypto.randomUUID();
    ud(d => { const c = d.textbooks.find(x => x.id === tid)?.chapters?.find(x => x.id === cid); if (c) { if (!c.sections) c.sections = []; c.sections.push({ id, name, summary: "", bulletNotes: [], inDepthNotes: "" }); } });
    setSel({ textbook: tid, chapter: cid, section: id });
    setExp(p => ({ ...p, [tid]: true, [cid]: true }));
  };
  const del = (type, ids) => {
    ud(d => {
      if (type === "textbook") d.textbooks = d.textbooks.filter(t => t.id !== ids.tbId);
      else if (type === "chapter") { const t = d.textbooks.find(x => x.id === ids.tbId); if (t) t.chapters = t.chapters.filter(c => c.id !== ids.chId); }
      else { const c = d.textbooks.find(x => x.id === ids.tbId)?.chapters?.find(x => x.id === ids.chId); if (c) c.sections = c.sections.filter(s => s.id !== ids.secId); }
    });
    if (type === "textbook") setSel({ textbook: null, chapter: null, section: null });
    else if (type === "chapter") setSel(p => ({ ...p, chapter: null, section: null }));
    else setSel(p => ({ ...p, section: null }));
  };
  const uSEC = (f, v) => ud(d => { const s = d.textbooks.find(x => x.id === sel.textbook)?.chapters?.find(x => x.id === sel.chapter)?.sections?.find(x => x.id === sel.section); if (s) s[f] = v; });
  const uCH = (f, v) => ud(d => { const c = d.textbooks.find(x => x.id === sel.textbook)?.chapters?.find(x => x.id === sel.chapter); if (c) c[f] = v; });
  const uTB = (f, v) => ud(d => { const t = d.textbooks.find(x => x.id === sel.textbook); if (t) t[f] = v; });
  const togExp = (id) => setExp(p => ({ ...p, [id]: !p[id] }));
  const selSec = (tid, cid, sid) => { setSel({ textbook: tid, chapter: cid, section: sid }); setExp(p => ({ ...p, [tid]: true, [cid]: true })); setView("notebook"); setSq(""); setSr(null); };

  // File handling for drag-and-drop (browser mode)
  const handleFiles = useCallback(async (fileList) => {
    if (!sel.textbook) {
      setStatusMsg("Please select or create a notebook first");
      setTimeout(() => setStatusMsg(""), 3000);
      return;
    }

    const files = Array.from(fileList);
    const sources = [];

    for (const file of files) {
      const isImage = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';

      if (isImage) {
        const base64 = await fileToBase64(file);
        sources.push({ id: crypto.randomUUID(), name: file.name, type: 'image', mimeType: file.type, base64, size: file.size, addedAt: Date.now() });
      } else if (isPdf) {
        const base64 = await fileToBase64(file);
        sources.push({ id: crypto.randomUUID(), name: file.name, type: 'pdf', base64, size: file.size, addedAt: Date.now() });
      } else {
        const text = await file.text();
        sources.push({ id: crypto.randomUUID(), name: file.name, type: 'text', content: text, size: file.size, addedAt: Date.now() });
      }
    }

    ud(d => {
      const tb = d.textbooks.find(x => x.id === sel.textbook);
      if (tb) {
        if (!tb.sources) tb.sources = [];
        tb.sources.push(...sources);
      }
    });

    setStatusMsg(`Added ${sources.length} source${sources.length > 1 ? 's' : ''}`);
    setTimeout(() => setStatusMsg(""), 3000);
    setView("sources");
  }, [sel.textbook]);

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  // Electron file picker
  const handleElectronPick = async () => {
    if (!window.electronAPI?.selectFiles) return;
    const files = await window.electronAPI.selectFiles();
    if (files.length === 0) return;

    const sources = files.map(f => ({ id: crypto.randomUUID(), ...f, addedAt: Date.now() }));
    ud(d => {
      const tb = d.textbooks.find(x => x.id === sel.textbook);
      if (tb) {
        if (!tb.sources) tb.sources = [];
        tb.sources.push(...sources);
      }
    });
    setStatusMsg(`Added ${sources.length} source${sources.length > 1 ? 's' : ''}`);
    setTimeout(() => setStatusMsg(""), 3000);
  };

  // AI: Process a single source
  const processSource = async (source) => {
    if (!settings.apiKey) {
      setView("settings");
      setStatusMsg("Please enter your Gemini API key first");
      setTimeout(() => setStatusMsg(""), 3000);
      return;
    }

    setProcessing(true);
    setStatusMsg("AI is reading your source...");

    try {
      let result;
      if (window.electronAPI?.processSource) {
        result = await window.electronAPI.processSource(source, settings.apiKey);
      } else {
        // Browser mode: call Claude API directly
        result = await callGeminiAPI(source, settings.apiKey);
      }

      if (result.success) {
        const notes = result.data;
        // Create a new section with the AI-generated notes
        const sectionName = notes.suggestedTitle || source.name.replace(/\.[^.]+$/, '');

        // Make sure we have a chapter to put the section in
        let chapterId = sel.chapter;
        if (!chapterId) {
          chapterId = crypto.randomUUID();
          ud(d => {
            const tb = d.textbooks.find(x => x.id === sel.textbook);
            if (tb) {
              if (!tb.chapters) tb.chapters = [];
              tb.chapters.push({ id: chapterId, name: "AI Generated Notes", summary: "", sections: [] });
            }
          });
          setExp(p => ({ ...p, [sel.textbook]: true, [chapterId]: true }));
          setSel(p => ({ ...p, chapter: chapterId }));
        }

        const sectionId = crypto.randomUUID();
        ud(d => {
          const ch = d.textbooks.find(x => x.id === sel.textbook)?.chapters?.find(x => x.id === chapterId);
          if (ch) {
            ch.sections.push({
              id: sectionId,
              name: sectionName,
              summary: notes.summary || "",
              bulletNotes: notes.bulletNotes || [],
              inDepthNotes: notes.inDepthNotes || "",
            });
          }
        });
        setSel({ textbook: sel.textbook, chapter: chapterId, section: sectionId });
        setExp(p => ({ ...p, [sel.textbook]: true, [chapterId]: true }));
        setView("notebook");
        setStatusMsg("Notes generated!");
      } else {
        setStatusMsg(`Error: ${result.error}`);
      }
    } catch (err) {
      setStatusMsg(`Error: ${err.message}`);
    }

    setProcessing(false);
    setTimeout(() => setStatusMsg(""), 5000);
  };

  // AI: Generate notes from all sources
  const generateFromAllSources = async () => {
    if (!settings.apiKey) {
      setView("settings");
      setStatusMsg("Please enter your Gemini API key first");
      setTimeout(() => setStatusMsg(""), 3000);
      return;
    }

    const sources = cTB?.sources || [];
    if (sources.length === 0) {
      setStatusMsg("Add some sources first!");
      setTimeout(() => setStatusMsg(""), 3000);
      return;
    }

    setProcessing(true);
    setStatusMsg("AI is analyzing all your sources...");

    try {
      let result;
      if (window.electronAPI?.generateNotes) {
        result = await window.electronAPI.generateNotes(sources, "", settings.apiKey);
      } else {
        result = await callGeminiGenerateNotes(sources, settings.apiKey);
      }

      if (result.success && result.data.chapters) {
        ud(d => {
          const tb = d.textbooks.find(x => x.id === sel.textbook);
          if (tb) {
            for (const ch of result.data.chapters) {
              const chId = crypto.randomUUID();
              const sections = (ch.sections || []).map(s => ({
                id: crypto.randomUUID(),
                name: s.name,
                summary: s.summary || "",
                bulletNotes: s.bulletNotes || [],
                inDepthNotes: s.inDepthNotes || "",
              }));
              tb.chapters.push({ id: chId, name: ch.name, summary: ch.summary || "", sections });
            }
          }
        });
        setView("notebook");
        setStatusMsg("Notes generated from all sources!");
      } else {
        setStatusMsg(`Error: ${result.error || 'Could not generate notes'}`);
      }
    } catch (err) {
      setStatusMsg(`Error: ${err.message}`);
    }

    setProcessing(false);
    setTimeout(() => setStatusMsg(""), 5000);
  };

  // Browser-mode Gemini API call
  const callGeminiAPI = async (source, apiKey) => {
    const parts = [];
    if (source.type === 'image') {
      parts.push({ inlineData: { mimeType: source.mimeType, data: source.base64 } });
      parts.push({ text: 'This is an image from a textbook or study material. Extract and analyze all content. Provide:\n1. A summary\n2. Key concepts as bullet points\n3. Detailed notes\n\nRespond ONLY with valid JSON, no markdown code blocks:\n{"summary": "...", "bulletNotes": ["..."], "inDepthNotes": "...", "suggestedTitle": "..."}' });
    } else if (source.type === 'pdf') {
      parts.push({ inlineData: { mimeType: 'application/pdf', data: source.base64 } });
      parts.push({ text: 'Analyze this PDF document. Provide:\n1. A summary\n2. Key concepts as bullet points\n3. Detailed notes\n\nRespond ONLY with valid JSON, no markdown code blocks:\n{"summary": "...", "bulletNotes": ["..."], "inDepthNotes": "...", "suggestedTitle": "..."}' });
    } else {
      parts.push({ text: `Analyze this text:\n\n---\n${source.content}\n---\n\nProvide:\n1. A summary\n2. Key concepts as bullet points\n3. Detailed notes\n\nRespond ONLY with valid JSON, no markdown code blocks:\n{"summary": "...", "bulletNotes": ["..."], "inDepthNotes": "...", "suggestedTitle": "..."}` });
    }

    const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts }] })
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      return { success: false, error: err.error?.message || `API error ${resp.status}` };
    }

    const json = await resp.json();
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return { success: true, data: JSON.parse(match[0]) };
    return { success: true, data: { summary: text, bulletNotes: [], inDepthNotes: text } };
  };

  const callGeminiGenerateNotes = async (sources, apiKey) => {
    const parts = [];
    for (const source of sources) {
      if (source.type === 'image') {
        parts.push({ inlineData: { mimeType: source.mimeType, data: source.base64 } });
      } else if (source.type === 'pdf') {
        parts.push({ inlineData: { mimeType: 'application/pdf', data: source.base64 } });
      } else {
        parts.push({ text: `[Source: ${source.name}]\n${source.content}` });
      }
    }
    parts.push({ text: 'Based on all sources above, generate comprehensive study notes organized into chapters and sections.\n\nRespond ONLY with valid JSON, no markdown code blocks:\n{"chapters": [{"name": "...", "summary": "...", "sections": [{"name": "...", "summary": "...", "bulletNotes": ["..."], "inDepthNotes": "..."}]}]}' });

    const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts }] })
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      return { success: false, error: err.error?.message || `API error ${resp.status}` };
    }

    const json = await resp.json();
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return { success: true, data: JSON.parse(match[0]) };
    return { success: false, error: 'Could not parse response' };
  };

  // Drag and drop handlers
  const onDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setDragOver(true); };
  const onDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setDragOver(false); };
  const onDrop = (e) => { e.preventDefault(); e.stopPropagation(); setDragOver(false); if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files); };

  const removeSource = (sourceId) => {
    ud(d => {
      const tb = d.textbooks.find(x => x.id === sel.textbook);
      if (tb && tb.sources) tb.sources = tb.sources.filter(s => s.id !== sourceId);
    });
  };

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      style={{ display: "flex", height: "100vh", fontFamily: "'Nunito', sans-serif", background: "linear-gradient(135deg, #E8D5F5 0%, #F0E0F7 20%, #D5E8F5 40%, #E0F0E8 60%, #F5E8D5 80%, #F7E0E8 100%)", color: "#5D4E6D", overflow: "hidden", position: "relative" }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Patrick+Hand&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .nc { animation: fadeIn 0.3s ease-out both; }
        .si:hover { background: rgba(255,255,255,0.6) !important; }
        .btn:hover { transform: scale(1.03); filter: brightness(1.05); }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #D5C8E8; border-radius: 99px; }
      `}</style>

      {/* Drag overlay */}
      {dragOver && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(195,177,225,0.4)", backdropFilter: "blur(8px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          <div style={{ background: "white", borderRadius: 24, padding: "40px 60px", boxShadow: "0 20px 60px rgba(93,78,109,0.2)", border: "3px dashed #C3B1E1", textAlign: "center" }}>
            <Icons.Upload />
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 12, color: "#5D4E6D" }}>Drop files here</div>
            <div style={{ fontSize: 14, color: "#9B8BB4", marginTop: 4 }}>PDFs, images, text files</div>
          </div>
        </div>
      )}

      {/* Status message */}
      {statusMsg && (
        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 9998, background: processing ? "rgba(195,177,225,0.95)" : "rgba(168,230,207,0.95)", color: "#fff", padding: "10px 24px", borderRadius: 99, fontSize: 14, fontWeight: 700, boxShadow: "0 4px 20px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: 10, animation: "fadeIn 0.3s ease-out" }}>
          {processing && <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />}
          {statusMsg}
        </div>
      )}

      {/* Sidebar */}
      <div style={{ width: sbOpen ? 250 : 0, minWidth: sbOpen ? 250 : 0, background: "rgba(255,255,255,0.65)", backdropFilter: "blur(16px)", borderRight: sbOpen ? "1px solid rgba(195,177,225,0.3)" : "none", display: "flex", flexDirection: "column", overflow: "hidden", transition: "width 0.3s, min-width 0.3s" }}>
        <div style={{ padding: "14px 14px 8px", display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => setSbOpen(false)} style={iconBtnStyle("#C3B1E1")}><Icons.Menu /></button>
          <span style={{ fontFamily: "Patrick Hand", fontWeight: 800, fontSize: 18, color: "#5D4E6D" }}>My Notebook</span>
        </div>

        {/* Nav buttons */}
        <div style={{ padding: "4px 10px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
          {[
            { icon: <Icons.Home />, label: "Notebooks", onClick: () => setView("notebook") },
            { icon: <Icons.Upload />, label: "Sources", onClick: () => setView("sources") },
            { icon: <Icons.Search />, label: "Search", onClick: () => setShowSearch(s => !s) },
            { icon: <Icons.Settings />, label: "Settings", onClick: () => setView("settings") },
          ].map((item, i) => (
            <button key={i} className="si" onClick={item.onClick} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "8px 12px", borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600, color: "#5D4E6D" }}>{item.icon}{item.label}</button>
          ))}
        </div>

        {showSearch && (
          <div style={{ padding: "0 12px 8px", animation: "fadeIn 0.2s" }}>
            <input autoFocus placeholder="Search notes..." value={sq} onChange={e => setSq(e.target.value)} style={searchInputStyle} />
            {sr && <div style={{ marginTop: 6, maxHeight: 160, overflowY: "auto" }}>
              {sr.length === 0 && <div style={{ fontSize: 12, color: "#9B8BB4", padding: 8 }}>No results</div>}
              {sr.map((r, i) => (
                <button key={i} className="si" onClick={() => { if (r.type === "section") selSec(r.tbId, r.chId, r.item.id); else if (r.type === "chapter") { setSel(p => ({ ...p, textbook: r.tbId, chapter: r.item.id, section: null })); setExp(p => ({ ...p, [r.tbId]: true, [r.item.id]: true })); } else { setSel(p => ({ ...p, textbook: r.item.id, chapter: null, section: null })); setExp(p => ({ ...p, [r.item.id]: true })); } setSq(""); setSr(null); setView("notebook"); }} style={{ display: "block", width: "100%", textAlign: "left", padding: "6px 10px", borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", fontFamily: "inherit", fontSize: 12, color: "#5D4E6D" }}>
                  <div style={{ fontWeight: 700 }}>{r.item.name}</div>
                  <div style={{ fontSize: 10, color: "#9B8BB4" }}>{r.path}</div>
                </button>
              ))}
            </div>}
          </div>
        )}

        <div style={{ padding: "0 16px", marginBottom: 6 }}>
          <div style={{ borderTop: "1px dashed #D5C8E8", textAlign: "center" }}>
            <span style={{ position: "relative", top: -9, background: "rgba(255,255,255,0.65)", padding: "0 10px", fontSize: 10, fontWeight: 700, color: "#B4A3CC", letterSpacing: 1.5, textTransform: "uppercase" }}>Notebooks</span>
          </div>
        </div>

        {/* Tree */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 8px 12px" }}>
          {data.textbooks.map(tb => (
            <div key={tb.id} style={{ marginBottom: 2 }}>
              <div className="si" style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", borderRadius: 10, cursor: "pointer", background: sel.textbook === tb.id && !sel.chapter ? "rgba(255,179,71,0.15)" : "transparent" }} onClick={() => { togExp(tb.id); setSel({ textbook: tb.id, chapter: null, section: null }); setView("notebook"); }}>
                <span style={{ transition: "transform 0.2s", transform: exp[tb.id] ? "rotate(0deg)" : "rotate(-90deg)", color: "#C3B1E1" }}><Icons.ChevDown /></span>
                <Icons.Folder />
                <span style={{ flex: 1, fontSize: 13, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tb.name}</span>
                <button onClick={e => { e.stopPropagation(); setModal({ type: "addChapter", tbId: tb.id }); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#B4A3CC", padding: 2, display: "flex" }}><Icons.Plus /></button>
              </div>
              {exp[tb.id] && tb.chapters?.map(ch => (
                <div key={ch.id} style={{ marginLeft: 18 }}>
                  <div className="si" style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 8, cursor: "pointer", background: sel.chapter === ch.id && !sel.section ? "rgba(195,177,225,0.15)" : "transparent" }} onClick={() => { togExp(ch.id); setSel({ textbook: tb.id, chapter: ch.id, section: null }); setView("notebook"); }}>
                    <span style={{ transition: "transform 0.2s", transform: exp[ch.id] ? "rotate(0deg)" : "rotate(-90deg)", color: "#C3B1E1" }}><Icons.ChevDown /></span>
                    <span style={{ color: "#C3B1E1" }}><Icons.Doc /></span>
                    <span style={{ flex: 1, fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ch.name}</span>
                    <button onClick={e => { e.stopPropagation(); setModal({ type: "addSection", tbId: tb.id, chId: ch.id }); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#B4A3CC", padding: 2, display: "flex" }}><Icons.Plus /></button>
                  </div>
                  {exp[ch.id] && ch.sections?.map(sec => (
                    <div key={sec.id} className="si" onClick={() => selSec(tb.id, ch.id, sec.id)} style={{ marginLeft: 18, display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 8, cursor: "pointer", background: sel.section === sec.id ? "rgba(168,230,207,0.2)" : "transparent" }}>
                      <span style={{ color: "#A8E6CF" }}><Icons.Section /></span>
                      <span style={{ flex: 1, fontSize: 12, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sec.name}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
          <button onClick={() => setModal({ type: "addTextbook" })} className="btn" style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "9px 14px", marginTop: 8, borderRadius: 10, border: "2px dashed #D5C8E8", background: "transparent", cursor: "pointer", color: "#B4A3CC", fontSize: 12, fontWeight: 700, fontFamily: "inherit", transition: "all 0.2s" }}><Icons.Plus /> Add Notebook</button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Toolbar */}
        <div style={{ padding: "10px 20px", display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.5)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(195,177,225,0.2)" }}>
          {!sbOpen && <button onClick={() => setSbOpen(true)} style={iconBtnStyle("#C3B1E1")}><Icons.Menu /></button>}
          <button onClick={() => { if (sel.section) setSel(p => ({ ...p, section: null })); else if (sel.chapter) setSel(p => ({ ...p, chapter: null })); else if (sel.textbook) setSel(p => ({ ...p, textbook: null })); }} style={iconBtnStyle("#C3B1E1")}><Icons.Back /></button>

          <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.6)", borderRadius: 14, padding: 3, border: "1px solid rgba(195,177,225,0.2)" }}>
            {[
              { icon: <Icons.Home />, tip: "Notebooks", color: ACCENT.sky, act: () => setView("notebook") },
              { icon: <Icons.Upload />, tip: "Sources", color: ACCENT.lavender, act: () => setView("sources") },
              { icon: <Icons.AI />, tip: "Generate Notes", color: ACCENT.mint, act: () => { if (cTB?.sources?.length > 0) generateFromAllSources(); else { setView("sources"); setStatusMsg("Add sources first, then generate!"); setTimeout(() => setStatusMsg(""), 3000); } } },
              { icon: <Icons.Plus />, tip: "Add", color: ACCENT.peach, act: () => { if (sel.chapter) setModal({ type: "addSection", tbId: sel.textbook, chId: sel.chapter }); else if (sel.textbook) setModal({ type: "addChapter", tbId: sel.textbook }); else setModal({ type: "addTextbook" }); } },
              { icon: <Icons.Settings />, tip: "Settings", color: ACCENT.pink, act: () => setView("settings") },
            ].map((b, i) => (
              <button key={i} onClick={b.act} title={b.tip} className="btn" style={{ width: 36, height: 36, borderRadius: 10, border: "none", background: b.color, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", boxShadow: `0 2px 8px ${b.color}44` }}>{b.icon}</button>
            ))}
          </div>

          <div style={{ flex: 1 }} />
          {cTB && <span style={{ fontSize: 13, fontWeight: 600, color: "#9B8BB4" }}>{cTB.name}{cCH ? ` > ${cCH.name}` : ""}{cSEC ? ` > ${cSEC.name}` : ""}</span>}
        </div>

        {/* Content area */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {view === "settings" ? (
            <SettingsView settings={settings} setSettings={setSettings} />
          ) : view === "sources" ? (
            <SourcesView
              textbook={cTB}
              onPickFiles={window.electronAPI?.selectFiles ? handleElectronPick : null}
              onFileInput={handleFiles}
              onProcess={processSource}
              onRemove={removeSource}
              onGenerateAll={generateFromAllSources}
              processing={processing}
              hasApiKey={!!settings.apiKey}
            />
          ) : (
            <NotebookView
              cTB={cTB} cCH={cCH} cSEC={cSEC}
              sel={sel} setSel={setSel} setExp={setExp} setView={setView}
              uTB={uTB} uCH={uCH} uSEC={uSEC} del={del} selSec={selSec}
              addTB={() => setModal({ type: "addTextbook" })}
            />
          )}
        </div>
      </div>

      {modal && <AddModal modal={modal} onClose={() => setModal(null)} onAdd={(n, x) => { if (modal.type === "addTextbook") addTB(n, x); else if (modal.type === "addChapter") addCH(modal.tbId, n); else addSEC(modal.tbId, modal.chId, n); setModal(null); }} />}
    </div>
  );
}

// =========== NOTEBOOK VIEW ===========
function NotebookView({ cTB, cCH, cSEC, sel, setSel, setExp, setView, uTB, uCH, uSEC, del, selSec, addTB }) {
  return (
    <div style={{ margin: "20px auto", maxWidth: 800, minHeight: "calc(100vh - 120px)", background: "rgba(255,255,255,0.75)", backdropFilter: "blur(8px)", borderRadius: 20, border: "1px solid rgba(195,177,225,0.25)", boxShadow: "0 8px 40px rgba(147,130,180,0.1)", backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, rgba(195,177,225,0.15) 31px, rgba(195,177,225,0.15) 32px)", backgroundSize: "100% 32px", backgroundPosition: "0 60px", padding: "28px 40px 40px", position: "relative" }}>
      <div style={{ position: "absolute", left: 70, top: 0, bottom: 0, width: 2, background: "rgba(244,165,184,0.2)", pointerEvents: "none" }} />

      {cSEC ? (
        <div className="nc" style={{ paddingLeft: 20 }}>
          <EH value={cSEC.name} onChange={v => uSEC("name", v)} />
          <div style={{ marginBottom: 24 }}>
            <SH color={ACCENT.lavender}>Summary</SH>
            <EA value={cSEC.summary} onChange={v => uSEC("summary", v)} placeholder="Write a summary of key concepts..." />
          </div>
          <div style={{ marginBottom: 24 }}>
            <SH color={ACCENT.pink}>Key Points</SH>
            <BN items={cSEC.bulletNotes || []} onChange={v => uSEC("bulletNotes", v)} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <SH color={ACCENT.mint}>In-Depth Notes</SH>
            <EA value={cSEC.inDepthNotes || ""} onChange={v => uSEC("inDepthNotes", v)} placeholder="Write detailed notes..." large />
          </div>
          <button onClick={() => del("section", { tbId: sel.textbook, chId: sel.chapter, secId: sel.section })} className="btn" style={deleteBtnStyle}><Icons.Trash /> Delete Section</button>
        </div>
      ) : cCH ? (
        <div className="nc" style={{ paddingLeft: 20 }}>
          <EH value={cCH.name} onChange={v => uCH("name", v)} />
          <div style={{ marginBottom: 24 }}>
            <SH color={ACCENT.lavender}>Chapter Summary</SH>
            <EA value={cCH.summary || ""} onChange={v => uCH("summary", v)} placeholder="Write a chapter summary..." />
          </div>
          <SH color={ACCENT.mint}>Sections ({cCH.sections?.length || 0})</SH>
          <div style={{ display: "grid", gap: 10, marginTop: 8 }}>
            {cCH.sections?.map(sec => (
              <button key={sec.id} onClick={() => selSec(sel.textbook, sel.chapter, sec.id)} className="btn" style={cardBtnStyle(ACCENT.mint)}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{sec.name}</div>
                <div style={{ fontSize: 12, color: "#9B8BB4", lineHeight: 1.5 }}>{sec.summary?.slice(0, 120)}{sec.summary?.length > 120 ? "..." : ""}</div>
              </button>
            ))}
          </div>
          <button onClick={() => del("chapter", { tbId: sel.textbook, chId: sel.chapter })} className="btn" style={{ ...deleteBtnStyle, marginTop: 20 }}><Icons.Trash /> Delete Chapter</button>
        </div>
      ) : cTB ? (
        <div className="nc" style={{ paddingLeft: 20 }}>
          <EH value={cTB.name} onChange={v => uTB("name", v)} />
          <div style={{ marginBottom: 20 }}>
            <SH color={ACCENT.lavender}>Author</SH>
            <EA value={cTB.author || ""} onChange={v => uTB("author", v)} placeholder="Author name..." />
          </div>
          <div style={{ marginBottom: 24 }}>
            <SH color={ACCENT.pink}>Summary</SH>
            <EA value={cTB.summary || ""} onChange={v => uTB("summary", v)} placeholder="Write a textbook summary..." />
          </div>

          {cTB.sources?.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <SH color={ACCENT.sky}>Sources ({cTB.sources.length})</SH>
              <button onClick={() => setView("sources")} className="btn" style={{ padding: "8px 20px", borderRadius: 99, border: "none", background: ACCENT.sky, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>View & Manage Sources</button>
            </div>
          )}

          <SH color={ACCENT.mint}>Chapters ({cTB.chapters?.length || 0})</SH>
          <div style={{ display: "grid", gap: 10, marginTop: 8 }}>
            {cTB.chapters?.map(ch => (
              <button key={ch.id} onClick={() => { setSel(p => ({ ...p, chapter: ch.id, section: null })); setExp(p => ({ ...p, [ch.id]: true })); }} className="btn" style={cardBtnStyle(ACCENT.lavender)}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{ch.name}</div>
                <div style={{ fontSize: 12, color: "#9B8BB4" }}>{ch.sections?.length || 0} sections</div>
              </button>
            ))}
          </div>
          <button onClick={() => del("textbook", { tbId: sel.textbook })} className="btn" style={{ ...deleteBtnStyle, marginTop: 20 }}><Icons.Trash /> Delete Notebook</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📓</div>
          <div style={{ fontFamily: "Patrick Hand", fontWeight: 700, fontSize: 28, color: "#5D4E6D", marginBottom: 8 }}>My Study Notebook</div>
          <div style={{ fontSize: 14, color: "#9B8BB4", marginBottom: 20, maxWidth: 400, lineHeight: 1.6 }}>
            Drop textbook chapters, images, or notes here and AI will generate study notes for you. Like NotebookLM, but yours.
          </div>
          <button onClick={addTB} className="btn" style={{ padding: "12px 32px", borderRadius: 99, border: "none", background: ACCENT.lavender, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 4px 16px ${ACCENT.lavender}44` }}>Create Your First Notebook</button>
        </div>
      )}
    </div>
  );
}

// =========== SOURCES VIEW ===========
function SourcesView({ textbook, onPickFiles, onFileInput, onProcess, onRemove, onGenerateAll, processing, hasApiKey }) {
  const fileInputRef = useRef(null);
  const sources = textbook?.sources || [];

  if (!textbook) {
    return (
      <div style={{ margin: "40px auto", maxWidth: 600, textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📎</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#5D4E6D", marginBottom: 8 }}>No notebook selected</div>
        <div style={{ fontSize: 14, color: "#9B8BB4" }}>Select or create a notebook to add sources</div>
      </div>
    );
  }

  return (
    <div style={{ margin: "20px auto", maxWidth: 700, padding: "0 20px" }}>
      <div className="nc" style={{ background: "rgba(255,255,255,0.75)", borderRadius: 20, padding: "28px 32px", border: "1px solid rgba(195,177,225,0.25)", boxShadow: "0 8px 40px rgba(147,130,180,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h2 style={{ fontFamily: "Patrick Hand", fontSize: 24, fontWeight: 800, margin: 0, color: "#5D4E6D" }}>Sources</h2>
            <div style={{ fontSize: 13, color: "#9B8BB4", marginTop: 2 }}>{textbook.name} — {sources.length} source{sources.length !== 1 ? 's' : ''}</div>
          </div>
          {sources.length > 0 && hasApiKey && (
            <button onClick={onGenerateAll} disabled={processing} className="btn" style={{ padding: "10px 24px", borderRadius: 99, border: "none", background: processing ? "#D5C8E8" : ACCENT.mint, color: "#fff", fontSize: 13, fontWeight: 700, cursor: processing ? "default" : "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8, boxShadow: `0 4px 16px ${ACCENT.mint}44` }}>
              <Icons.AI /> Generate Notes from All
            </button>
          )}
        </div>

        {/* Upload zone */}
        <div
          onClick={() => onPickFiles ? onPickFiles() : fileInputRef.current?.click()}
          style={{ border: "2px dashed #C3B1E1", borderRadius: 16, padding: "32px 20px", textAlign: "center", cursor: "pointer", background: "rgba(195,177,225,0.06)", transition: "all 0.2s", marginBottom: 20 }}
          onMouseOver={e => { e.currentTarget.style.borderColor = "#A8E6CF"; e.currentTarget.style.background = "rgba(168,230,207,0.08)"; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = "#C3B1E1"; e.currentTarget.style.background = "rgba(195,177,225,0.06)"; }}
        >
          <Icons.Upload />
          <div style={{ fontSize: 15, fontWeight: 700, color: "#5D4E6D", marginTop: 8 }}>
            {onPickFiles ? "Click to select files" : "Click to upload or drag & drop"}
          </div>
          <div style={{ fontSize: 13, color: "#9B8BB4", marginTop: 4 }}>PDFs, images (JPG/PNG), text files, markdown</div>
          <input ref={fileInputRef} type="file" multiple accept=".pdf,.txt,.md,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx" style={{ display: "none" }} onChange={e => { if (e.target.files.length > 0) onFileInput(e.target.files); e.target.value = ''; }} />
        </div>

        {/* Source list */}
        {sources.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px 0", color: "#9B8BB4", fontSize: 14 }}>
            No sources yet. Drop files here or click upload to get started.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {sources.map(source => (
              <div key={source.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 14, background: "rgba(255,255,255,0.6)", border: "1px solid rgba(195,177,225,0.2)" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: source.type === 'image' ? "rgba(244,165,184,0.15)" : source.type === 'pdf' ? "rgba(160,210,240,0.15)" : "rgba(195,177,225,0.15)", color: source.type === 'image' ? ACCENT.pink : source.type === 'pdf' ? ACCENT.sky : ACCENT.lavender }}>
                  {source.type === 'image' ? <Icons.Image /> : <Icons.File />}
                </div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#5D4E6D", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{source.name}</div>
                  <div style={{ fontSize: 11, color: "#9B8BB4" }}>{source.type.toUpperCase()} — {formatSize(source.size)}</div>
                </div>
                <button onClick={() => onProcess(source)} disabled={processing || !hasApiKey} className="btn" style={{ padding: "6px 14px", borderRadius: 99, border: "none", background: processing ? "#D5C8E8" : ACCENT.lavender, color: "#fff", fontSize: 11, fontWeight: 700, cursor: processing ? "default" : "pointer", fontFamily: "inherit" }}>
                  <Icons.AI /> Process
                </button>
                <button onClick={() => onRemove(source.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#D5C8E8", padding: 4, display: "flex" }} onMouseOver={e => e.currentTarget.style.color = ACCENT.pink} onMouseOut={e => e.currentTarget.style.color = "#D5C8E8"}><Icons.Trash /></button>
              </div>
            ))}
          </div>
        )}

        {!hasApiKey && sources.length > 0 && (
          <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 12, background: "rgba(255,179,71,0.1)", border: "1px solid rgba(255,179,71,0.3)", fontSize: 13, color: "#5D4E6D" }}>
            Add your free Gemini API key in Settings to process sources with AI.
          </div>
        )}
      </div>
    </div>
  );
}

// =========== SETTINGS VIEW ===========
function SettingsView({ settings, setSettings }) {
  const [key, setKey] = useState(settings.apiKey || "");
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSettings(p => ({ ...p, apiKey: key }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ margin: "20px auto", maxWidth: 600, padding: "0 20px" }}>
      <div className="nc" style={{ background: "rgba(255,255,255,0.75)", borderRadius: 20, padding: "28px 32px", border: "1px solid rgba(195,177,225,0.25)", boxShadow: "0 8px 40px rgba(147,130,180,0.1)" }}>
        <h2 style={{ fontFamily: "Patrick Hand", fontSize: 24, fontWeight: 800, margin: "0 0 20px", color: "#5D4E6D" }}>Settings</h2>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", fontSize: 14, fontWeight: 700, color: "#5D4E6D", marginBottom: 8 }}>Gemini API Key (Free)</label>
          <div style={{ fontSize: 12, color: "#9B8BB4", marginBottom: 10, lineHeight: 1.5 }}>
            Required for AI note generation. Get your free key from{" "}
            <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener" style={{ color: ACCENT.lavender }}>Google AI Studio</a>
          </div>
          <input
            type="password"
            value={key}
            onChange={e => setKey(e.target.value)}
            placeholder="AIza..."
            style={{ width: "100%", padding: "11px 16px", borderRadius: 14, border: "2px solid #D5C8E8", outline: "none", fontFamily: "inherit", fontSize: 14, background: "rgba(255,255,255,0.8)", boxSizing: "border-box", color: "#5D4E6D" }}
            onFocus={e => e.target.style.borderColor = ACCENT.lavender}
            onBlur={e => e.target.style.borderColor = "#D5C8E8"}
          />
          <button onClick={save} className="btn" style={{ marginTop: 12, padding: "10px 28px", borderRadius: 99, border: "none", background: saved ? ACCENT.mint : ACCENT.lavender, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s" }}>
            {saved ? "Saved!" : "Save Key"}
          </button>
        </div>

        <div style={{ borderTop: "1px dashed #D5C8E8", paddingTop: 20 }}>
          <label style={{ display: "block", fontSize: 14, fontWeight: 700, color: "#5D4E6D", marginBottom: 8 }}>How it works</label>
          <div style={{ fontSize: 13, color: "#9B8BB4", lineHeight: 1.8 }}>
            1. Create a notebook for your subject<br/>
            2. Upload sources — drag & drop PDFs, textbook photos, or paste notes<br/>
            3. Click "Process" on a source to generate notes from it<br/>
            4. Or click "Generate Notes from All" to create organized notes from everything<br/>
            5. Edit and organize your notes however you like
          </div>
        </div>

        <div style={{ borderTop: "1px dashed #D5C8E8", paddingTop: 20, marginTop: 20 }}>
          <label style={{ display: "block", fontSize: 14, fontWeight: 700, color: "#5D4E6D", marginBottom: 8 }}>Data</label>
          <div style={{ fontSize: 13, color: "#9B8BB4", marginBottom: 12 }}>All data is stored locally on your device. Nothing is sent to any server except Google Gemini API calls for note generation.</div>
          <button onClick={() => { if (confirm("Delete all data? This cannot be undone.")) { localStorage.removeItem(STORAGE_KEY); window.location.reload(); } }} className="btn" style={deleteBtnStyle}><Icons.Trash /> Clear All Data</button>
        </div>
      </div>
    </div>
  );
}

// =========== SHARED COMPONENTS ===========
function SH({ children, color }) {
  return <div style={{ fontSize: 15, fontWeight: 800, color, marginBottom: 8, fontFamily: "Patrick Hand, Nunito", textDecoration: "underline", textDecorationColor: `${color}44`, textUnderlineOffset: 4 }}>{children}</div>;
}

function EH({ value, onChange }) {
  const [ed, setEd] = useState(false);
  const [d, setD] = useState(value);
  useEffect(() => setD(value), [value]);
  if (ed) return <input autoFocus value={d} onChange={e => setD(e.target.value)} onBlur={() => { onChange(d); setEd(false); }} onKeyDown={e => { if (e.key === "Enter") { onChange(d); setEd(false); } }} style={{ fontFamily: "Patrick Hand", fontWeight: 800, fontSize: 24, border: "none", borderBottom: "2px solid #C3B1E1", outline: "none", background: "transparent", color: "#5D4E6D", width: "100%", marginBottom: 20 }} />;
  return <h1 onClick={() => setEd(true)} style={{ fontFamily: "Patrick Hand", fontWeight: 800, fontSize: 24, cursor: "pointer", margin: "0 0 20px", color: "#5D4E6D", borderBottom: "2px solid transparent", transition: "border-color 0.2s" }} onMouseOver={e => e.currentTarget.style.borderBottom = "2px dashed #C3B1E1"} onMouseOut={e => e.currentTarget.style.borderBottom = "2px solid transparent"}>{value}</h1>;
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
  const colors = [ACCENT.pink, ACCENT.lavender, ACCENT.mint, ACCENT.peach, ACCENT.sky, ACCENT.butter];
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: 99, marginTop: 7, flexShrink: 0, background: colors[i % 6] }} />
          {ei === i ? <input autoFocus value={d} onChange={e => setD(e.target.value)} onBlur={() => { const n = [...items]; n[i] = d; onChange(n); setEi(-1); }} onKeyDown={e => { if (e.key === "Enter") { const n = [...items]; n[i] = d; onChange(n); setEi(-1); } }} style={{ flex: 1, border: "none", borderBottom: "1.5px solid #C3B1E1", outline: "none", background: "transparent", fontFamily: "inherit", fontSize: 14, padding: "2px 0", lineHeight: 1.7, color: "#5D4E6D" }} />
          : <div onClick={() => { setEi(i); setD(item); }} style={{ flex: 1, fontSize: 14, lineHeight: 1.7, cursor: "pointer", padding: "2px 0", borderRadius: 4, color: "#5D4E6D" }} onMouseOver={e => e.currentTarget.style.background = "rgba(195,177,225,0.08)"} onMouseOut={e => e.currentTarget.style.background = "transparent"}>{item}</div>}
          <button onClick={() => onChange(items.filter((_, j) => j !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: "#D5C8E8", padding: 2, marginTop: 4, display: "flex", flexShrink: 0 }} onMouseOver={e => e.currentTarget.style.color = ACCENT.pink} onMouseOut={e => e.currentTarget.style.color = "#D5C8E8"}><Icons.Trash /></button>
        </div>
      ))}
      <button onClick={() => { onChange([...items, "New note"]); setEi(items.length); setD("New note"); }} className="btn" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", borderRadius: 99, border: "none", background: "rgba(168,230,207,0.25)", color: "#6BC4A0", fontSize: 12, fontWeight: 700, cursor: "pointer", marginTop: 6, fontFamily: "inherit", transition: "all 0.2s" }}><Icons.Plus /> Add note</button>
    </div>
  );
}

function AddModal({ modal, onClose, onAdd }) {
  const [n, setN] = useState("");
  const [x, setX] = useState("");
  const label = modal.type === "addTextbook" ? "Notebook" : modal.type === "addChapter" ? "Chapter" : "Section";
  const accent = modal.type === "addTextbook" ? ACCENT.peach : modal.type === "addChapter" ? ACCENT.lavender : ACCENT.mint;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(93,78,109,0.25)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)", borderRadius: 24, padding: "28px 32px", width: 360, boxShadow: "0 20px 60px rgba(93,78,109,0.15)", border: "1px solid rgba(195,177,225,0.3)", animation: "fadeIn 0.25s ease-out" }}>
        <h3 style={{ fontFamily: "Patrick Hand", fontWeight: 800, fontSize: 20, margin: "0 0 16px", color: "#5D4E6D" }}>Add {label}</h3>
        <input autoFocus placeholder={`${label} name`} value={n} onChange={e => setN(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && n.trim()) onAdd(n.trim(), x.trim()); }} style={{ width: "100%", padding: "11px 16px", borderRadius: 14, border: `2px solid ${accent}`, outline: "none", fontFamily: "inherit", fontSize: 14, marginBottom: 10, background: "rgba(255,255,255,0.8)", boxSizing: "border-box", color: "#5D4E6D" }} />
        {modal.type === "addTextbook" && <input placeholder="Author (optional)" value={x} onChange={e => setX(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && n.trim()) onAdd(n.trim(), x.trim()); }} style={{ width: "100%", padding: "11px 16px", borderRadius: 14, border: "2px solid #D5C8E8", outline: "none", fontFamily: "inherit", fontSize: 14, marginBottom: 10, background: "rgba(255,255,255,0.8)", boxSizing: "border-box", color: "#5D4E6D" }} />}
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <button onClick={onClose} className="btn" style={{ flex: 1, padding: "11px 0", borderRadius: 99, border: "2px solid #D5C8E8", background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "inherit", color: "#9B8BB4", transition: "all 0.2s" }}>Cancel</button>
          <button onClick={() => { if (n.trim()) onAdd(n.trim(), x.trim()); }} disabled={!n.trim()} className="btn" style={{ flex: 1, padding: "11px 0", borderRadius: 99, border: "none", background: n.trim() ? accent : "#D5C8E8", color: "#fff", cursor: n.trim() ? "pointer" : "default", fontSize: 13, fontWeight: 700, fontFamily: "inherit", transition: "all 0.2s", boxShadow: n.trim() ? `0 4px 14px ${accent}44` : "none" }}>Add {label}</button>
        </div>
      </div>
    </div>
  );
}

// =========== HELPERS ===========
function formatSize(bytes) {
  if (!bytes) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

const iconBtnStyle = (color) => ({ width: 34, height: 34, borderRadius: 10, border: "none", background: `${color}25`, color, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" });
const searchInputStyle = { width: "100%", padding: "8px 14px", borderRadius: 99, border: "2px solid #C3B1E1", outline: "none", background: "rgba(255,255,255,0.8)", fontFamily: "inherit", fontSize: 13, color: "#5D4E6D", boxSizing: "border-box" };
const deleteBtnStyle = { display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", borderRadius: 99, border: "1.5px solid rgba(244,165,184,0.4)", background: "transparent", color: "#D4889A", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" };
const cardBtnStyle = (color) => ({ textAlign: "left", padding: "14px 18px", borderRadius: 16, border: `1.5px solid ${color}66`, background: "rgba(255,255,255,0.6)", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" });
