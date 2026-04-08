import React, { useState, useCallback } from "react";
const API_KEY = "PASTE_YOUR_KEY_HERE";

const JOB_BOARDS = [
  { name: "LinkedIn", url: "https://www.linkedin.com/jobs/search/?keywords={query}&location={location}", icon: "in" },
  { name: "Indeed", url: "https://www.indeed.com/jobs?q={query}&l={location}", icon: "id" },
  { name: "Glassdoor", url: "https://www.glassdoor.com/Job/jobs.htm?sc.keyword={query}", icon: "gd" },
  { name: "Wellfound", url: "https://wellfound.com/jobs?role={query}", icon: "wf" },
];

const RESUME_TEMPLATE = `Sachin Jadhav
Lexington, MA | Open to relocation | No sponsorship required
LinkedIn: linkedin.com/in/sachinkumar | MBA – ESCP Europe (Top 1%)

PROFESSIONAL SUMMARY
Senior transformation and operations leader with 20+ years of global experience driving process excellence, GBS strategy, and digital enablement. Proven record of 90% error reduction and 65% profitability improvement on complex programs.

EXPERIENCE
Director, Service Commercial & Global Transformation | Buehler AG, Switzerland | 2020–2024
• Owned GBS strategy and digital enablement across global operations
• Led cross-functional transformation initiatives with measurable P&L impact

Senior PMO & Program Leadership | SR Technics | 2015–2020
• Achieved 90% operational error reduction on critical aviation programs
• Delivered 65% profitability improvement on major aviation contract

Senior Operations Leader | Maersk | 2010–2015
• Led global supply chain transformation across 12 markets

EDUCATION
MBA – ESCP Europe (Top 1% of class)

CERTIFICATIONS
Lean Six Sigma Yellow Belt | PSM I | APQC Process Frameworks (VSM)
Design Thinking – Cornell | Strategic Cost Management – IIM Ahmedabad
Harvard & MIT Executive Programs (in progress)`;

const callClaude = async (system, userContent) => {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system,
      messages: [{ role: "user", content: userContent }],
    }),
  });
  const data = await response.json();
  return data.content?.[0]?.text || "Error generating response.";
};

const TABS = [
  { id: "search", label: "01 · Search" },
  { id: "resume", label: "02 · Resume" },
  { id: "cover", label: "03 · Cover Letter" },
  { id: "fit", label: "04 · Fit Score" },
];

const styles = {
  wrap: {
    minHeight: "100vh",
    background: "#07080f",
    fontFamily: "'Georgia', 'Times New Roman', serif",
    color: "#e2ddd4",
  },
  header: {
    borderBottom: "1px solid #1e1e30",
    padding: "28px 40px 20px",
    background: "linear-gradient(180deg, #0d0e1c 0%, #07080f 100%)",
  },
  eyebrow: {
    fontSize: "10px",
    letterSpacing: "4px",
    color: "#454560",
    textTransform: "uppercase",
    marginBottom: "6px",
  },
  h1: {
    margin: 0,
    fontSize: "26px",
    fontWeight: "400",
    color: "#e2ddd4",
    letterSpacing: "-0.5px",
  },
  gold: { color: "#c9a84c", fontStyle: "italic" },
  tabBar: {
    display: "flex",
    borderBottom: "1px solid #1e1e30",
    padding: "0 40px",
    background: "#07080f",
  },
  body: { padding: "36px 40px", maxWidth: "860px" },
  label: {
    display: "block",
    fontSize: "10px",
    letterSpacing: "3px",
    color: "#454560",
    marginBottom: "8px",
    textTransform: "uppercase",
  },
  input: {
    width: "100%",
    background: "#0d0e1c",
    border: "1px solid #1e1e30",
    color: "#e2ddd4",
    padding: "12px 16px",
    fontSize: "14px",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    background: "#0d0e1c",
    border: "1px solid #1e1e30",
    color: "#e2ddd4",
    padding: "16px",
    fontSize: "13px",
    fontFamily: "inherit",
    outline: "none",
    resize: "vertical",
    boxSizing: "border-box",
    lineHeight: "1.7",
  },
  btnPrimary: {
    border: "none",
    padding: "13px 32px",
    fontSize: "10px",
    letterSpacing: "3px",
    textTransform: "uppercase",
    cursor: "pointer",
    fontFamily: "inherit",
    fontWeight: "700",
    transition: "all 0.2s",
  },
  output: {
    background: "#0d0e1c",
    border: "1px solid #1e1e30",
    padding: "24px",
    fontSize: "12px",
    lineHeight: "1.9",
    color: "#c2bead",
    whiteSpace: "pre-wrap",
    fontFamily: "'Courier New', monospace",
    margin: 0,
    maxHeight: "480px",
    overflowY: "auto",
  },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" },
  hint: { color: "#454560", fontSize: "13px", lineHeight: "1.8", marginBottom: "28px", fontStyle: "italic" },
};

function TabButton({ id, label, active, onClick }) {
  return (
    <button
      onClick={() => onClick(id)}
      style={{
        background: "none",
        border: "none",
        padding: "15px 20px 13px",
        color: active ? "#c9a84c" : "#3a3a58",
        borderBottom: active ? "2px solid #c9a84c" : "2px solid transparent",
        cursor: "pointer",
        fontSize: "11px",
        letterSpacing: "2px",
        textTransform: "uppercase",
        fontFamily: "inherit",
        transition: "color 0.2s",
      }}
    >
      {label}
    </button>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      style={{
        background: copied ? "#0d1f0d" : "none",
        border: "1px solid " + (copied ? "#3a7a3a" : "#1e1e30"),
        color: copied ? "#3a7a3a" : "#454560",
        padding: "6px 14px",
        fontSize: "10px",
        letterSpacing: "2px",
        cursor: "pointer",
        fontFamily: "inherit",
        textTransform: "uppercase",
        transition: "all 0.2s",
      }}
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

function OutputBlock({ label, text }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <span style={styles.label}>{label}</span>
        <CopyButton text={text} />
      </div>
      <pre style={styles.output}>{text}</pre>
    </div>
  );
}

function ActionButton({ onClick, disabled, loading, label, loadingLabel }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles.btnPrimary,
        background: disabled ? "#0d0e1c" : "#c9a84c",
        color: disabled ? "#2a2a44" : "#07080f",
        cursor: disabled ? "not-allowed" : "pointer",
        marginBottom: "28px",
      }}
    >
      {loading ? loadingLabel : label}
    </button>
  );
}

// ── TAB 1: Search ──────────────────────────────────────────────
function SearchTab() {
  const [query, setQuery] = useState("Senior Director Process Excellence");
  const [location, setLocation] = useState("Boston, MA");
  const [launched, setLaunched] = useState(false);

  const launch = () => {
    JOB_BOARDS.forEach((b) => {
      const url = b.url.replace("{query}", encodeURIComponent(query)).replace("{location}", encodeURIComponent(location));
      window.open(url, "_blank");
    });
    setLaunched(true);
  };

  return (
    <div>
      <p style={styles.hint}>Launch simultaneous searches across all major job boards with one click.</p>
      <div style={styles.grid2}>
        <div>
          <label style={styles.label}>Job Title / Keywords</label>
          <input value={query} onChange={(e) => setQuery(e.target.value)} style={styles.input}
            onFocus={(e) => (e.target.style.borderColor = "#c9a84c")}
            onBlur={(e) => (e.target.style.borderColor = "#1e1e30")} />
        </div>
        <div>
          <label style={styles.label}>Location</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} style={styles.input}
            onFocus={(e) => (e.target.style.borderColor = "#c9a84c")}
            onBlur={(e) => (e.target.style.borderColor = "#1e1e30")} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px", marginBottom: "28px" }}>
        {JOB_BOARDS.map((b) => (
          <div key={b.name} style={{ background: "#0d0e1c", border: "1px solid #1e1e30", padding: "16px", textAlign: "center" }}>
            <div style={{ fontSize: "17px", fontWeight: "700", color: "#c9a84c", marginBottom: "4px" }}>{b.icon}</div>
            <div style={{ fontSize: "10px", color: "#454560", letterSpacing: "2px" }}>{b.name}</div>
          </div>
        ))}
      </div>
      <button onClick={launch} style={{ ...styles.btnPrimary, background: launched ? "#0d1f0d" : "#c9a84c", color: launched ? "#3a7a3a" : "#07080f" }}>
        {launched ? "✓ Searches Launched" : "Launch All Searches →"}
      </button>
      {launched && <p style={{ marginTop: "14px", color: "#3a6a3a", fontSize: "12px", fontStyle: "italic" }}>4 tabs opened. Find a good role? Use the Resume, Cover Letter, or Fit Score tabs.</p>}
    </div>
  );
}

// ── TAB 2: Resume ──────────────────────────────────────────────
function ResumeTab() {
  const [jd, setJd] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = useCallback(async () => {
    if (!jd.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const text = await callClaude(
        `You are an expert executive resume writer. Tailor the provided resume to the job description. Keep the same person's real experience but reorder bullets, adjust keywords, and sharpen the summary to match the JD. Output ONLY the tailored resume text, no preamble. Keep it concise and ATS-optimized.`,
        `BASE RESUME:\n${RESUME_TEMPLATE}\n\nJOB DESCRIPTION:\n${jd}\n\nGenerate a tailored resume that matches this role.`
      );
      setResult(text);
    } catch {
      setResult("Error: Could not connect to Claude API.");
    }
    setLoading(false);
  }, [jd]);

  return (
    <div>
      <p style={styles.hint}>Paste a job description and Claude tailors your resume with the right keywords and emphasis.</p>
      <div style={{ marginBottom: "20px" }}>
        <label style={styles.label}>Job Description</label>
        <textarea value={jd} onChange={(e) => setJd(e.target.value)} rows={9} placeholder="Paste the full job description here..." style={styles.textarea}
          onFocus={(e) => (e.target.style.borderColor = "#c9a84c")}
          onBlur={(e) => (e.target.style.borderColor = "#1e1e30")} />
      </div>
      <ActionButton onClick={generate} disabled={loading || !jd.trim()} loading={loading} label="Generate Tailored Resume →" loadingLabel="Generating..." />
      {result && <OutputBlock label="Tailored Resume" text={result} />}
    </div>
  );
}

// ── TAB 3: Cover Letter ────────────────────────────────────────
function CoverLetterTab() {
  const [jd, setJd] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = useCallback(async () => {
    if (!jd.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const text = await callClaude(
        `You are an expert executive cover letter writer. Write a compelling, concise cover letter (3-4 paragraphs) that connects the candidate's experience directly to the role. Avoid generic openers. Lead with a strong hook. Output ONLY the cover letter text, no preamble or subject line.`,
        `CANDIDATE RESUME:\n${RESUME_TEMPLATE}\n\nCOMPANY: ${company || "the company"}\nROLE: ${role || "this position"}\n\nJOB DESCRIPTION:\n${jd}\n\nWrite a tailored cover letter for this role.`
      );
      setResult(text);
    } catch {
      setResult("Error: Could not connect to Claude API.");
    }
    setLoading(false);
  }, [jd, company, role]);

  return (
    <div>
      <p style={styles.hint}>Get a sharp, executive-level cover letter tailored to the specific role and company.</p>
      <div style={styles.grid2}>
        <div>
          <label style={styles.label}>Company Name</label>
          <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Cabot Corporation" style={styles.input}
            onFocus={(e) => (e.target.style.borderColor = "#c9a84c")}
            onBlur={(e) => (e.target.style.borderColor = "#1e1e30")} />
        </div>
        <div>
          <label style={styles.label}>Role Title</label>
          <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Senior Director, Process Excellence" style={styles.input}
            onFocus={(e) => (e.target.style.borderColor = "#c9a84c")}
            onBlur={(e) => (e.target.style.borderColor = "#1e1e30")} />
        </div>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <label style={styles.label}>Job Description</label>
        <textarea value={jd} onChange={(e) => setJd(e.target.value)} rows={8} placeholder="Paste the full job description here..." style={styles.textarea}
          onFocus={(e) => (e.target.style.borderColor = "#c9a84c")}
          onBlur={(e) => (e.target.style.borderColor = "#1e1e30")} />
      </div>
      <ActionButton onClick={generate} disabled={loading || !jd.trim()} loading={loading} label="Generate Cover Letter →" loadingLabel="Writing..." />
      {result && <OutputBlock label="Cover Letter" text={result} />}
    </div>
  );
}

// ── TAB 4: Fit Scorer ──────────────────────────────────────────
function FitScorerTab() {
  const [jd, setJd] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);

  const analyze = useCallback(async () => {
    if (!jd.trim()) return;
    setLoading(true);
    setResult("");
    setScore(null);
    try {
      const text = await callClaude(
        `You are a senior executive recruiter. Analyze how well a candidate's profile matches a job description. 
Output your analysis in this exact format:

FIT SCORE: [number 0-100]

STRONG MATCHES:
• [point]
• [point]
• [point]

GAPS TO ADDRESS:
• [point]
• [point]

RECOMMENDED TALKING POINTS:
• [point]
• [point]

VERDICT: [2-3 sentence summary on whether to apply and how to position]`,
        `CANDIDATE RESUME:\n${RESUME_TEMPLATE}\n\nJOB DESCRIPTION:\n${jd}\n\nAnalyze the fit and provide a score.`
      );
      setResult(text);
      const match = text.match(/FIT SCORE:\s*(\d+)/);
      if (match) setScore(parseInt(match[1]));
    } catch {
      setResult("Error: Could not connect to Claude API.");
    }
    setLoading(false);
  }, [jd]);

  const scoreColor = score >= 75 ? "#4a8a4a" : score >= 50 ? "#c9a84c" : "#8a3a3a";
  const scoreLabel = score >= 75 ? "Strong Fit" : score >= 50 ? "Moderate Fit" : "Weak Fit";

  return (
    <div>
      <p style={styles.hint}>Paste a job description and get an instant fit score, gap analysis, and talking points before you apply.</p>
      <div style={{ marginBottom: "20px" }}>
        <label style={styles.label}>Job Description</label>
        <textarea value={jd} onChange={(e) => setJd(e.target.value)} rows={9} placeholder="Paste the full job description here..." style={styles.textarea}
          onFocus={(e) => (e.target.style.borderColor = "#c9a84c")}
          onBlur={(e) => (e.target.style.borderColor = "#1e1e30")} />
      </div>
      <ActionButton onClick={analyze} disabled={loading || !jd.trim()} loading={loading} label="Analyze Fit →" loadingLabel="Analyzing..." />
      {score !== null && (
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px", padding: "20px 24px", background: "#0d0e1c", border: `1px solid ${scoreColor}` }}>
          <div style={{ fontSize: "48px", fontWeight: "700", color: scoreColor, lineHeight: 1 }}>{score}</div>
          <div>
            <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#454560", textTransform: "uppercase", marginBottom: "4px" }}>Fit Score</div>
            <div style={{ fontSize: "16px", color: scoreColor, fontStyle: "italic" }}>{scoreLabel}</div>
          </div>
          <div style={{ flex: 1, height: "6px", background: "#1e1e30", marginLeft: "12px" }}>
            <div style={{ width: `${score}%`, height: "100%", background: scoreColor, transition: "width 0.6s ease" }} />
          </div>
        </div>
      )}
      {result && <OutputBlock label="Full Analysis" text={result} />}
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState("search");

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <div style={styles.eyebrow}>Career Intelligence Suite</div>
        <h1 style={styles.h1}>
          Job Search <span style={styles.gold}>&amp; Application</span> Engine
        </h1>
      </div>
      <div style={styles.tabBar}>
        {TABS.map((t) => (
          <TabButton key={t.id} id={t.id} label={t.label} active={activeTab === t.id} onClick={setActiveTab} />
        ))}
      </div>
      <div style={styles.body}>
        {activeTab === "search" && <SearchTab />}
        {activeTab === "resume" && <ResumeTab />}
        {activeTab === "cover" && <CoverLetterTab />}
        {activeTab === "fit" && <FitScorerTab />}
      </div>
    </div>
  );
}
