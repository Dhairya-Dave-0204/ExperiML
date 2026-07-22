import React, { useState, useEffect } from "react";
import {
  FlaskConical,
  ArrowRight,
  Database,
  Activity,
  Cpu,
  Target,
  Package,
  CheckCircle2,
  GitCompare,
  Repeat,
  Zap,
  Menu,
  X,
  Network,
  Braces,
  Settings2,
  BarChart4,
  ChevronRight,
  GitPullRequest,
  FolderKanban,
  TerminalSquare,
  Server,
  Layers,
  HardDrive,
  GitCommit,
  Box,
  FileCode2,
  Timer,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* ExperiML — Landing Page (V5 Final Design)                          */
/* ------------------------------------------------------------------ */

// We extract live components to prevent full-page re-renders
const LiveHeroWidget = () => {
  const [epoch, setEpoch] = useState(42);
  const [gpuUtil, setGpuUtil] = useState(82);
  const [loss, setLoss] = useState(0.0145);

  useEffect(() => {
    const interval = setInterval(() => {
      setGpuUtil(Math.floor(Math.random() * (95 - 78 + 1) + 78));
      setEpoch((prev) => (prev < 50 ? prev + 1 : 42));
      setLoss((prev) => Math.max(0.009, prev - 0.0002));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="xm-hero-widget">
      <div className="xm-hero-widget-header">
        <div>
          <div
            className="xm-heading"
            style={{ fontSize: "16px", fontWeight: "700" }}
          >
            starwood-ecommerce-logs
          </div>
          <div
            className="xm-mono"
            style={{
              fontSize: "12px",
              color: "var(--text-secondary)",
              marginTop: "6px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Database size={12} /> dataset: v4.2.1{" "}
            <span style={{ color: "var(--border)" }}>|</span> 3 active
            experiments
          </div>
        </div>
        <Activity size={20} color="var(--text-secondary)" />
      </div>

      <div className="xm-run-item active">
        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
          <div
            className="xm-pulse-dot"
            style={{ "--dot-color": "var(--primary)" }}
          />
          <div>
            <div
              className="xm-heading"
              style={{ fontSize: "15px", fontWeight: "600" }}
            >
              xgboost-revenue-v3
            </div>
            <div
              className="xm-mono"
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                marginTop: "4px",
              }}
            >
              eta: 0.01 · max_depth: 6
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            className="xm-mono"
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "var(--primary)",
            }}
          >
            Loss: {loss.toFixed(4)}
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "var(--text-secondary)",
              marginTop: "4px",
              display: "flex",
              gap: "8px",
              justifyContent: "flex-end",
            }}
          >
            <span>Epoch {epoch}/50</span>
            <span style={{ color: "var(--accent)" }}>GPU: {gpuUtil}%</span>
          </div>
        </div>
      </div>

      <div className="xm-run-item" style={{ marginTop: "12px" }}>
        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "var(--success)",
            }}
          />
          <div>
            <div
              className="xm-heading"
              style={{ fontSize: "15px", fontWeight: "600" }}
            >
              rf-baseline-v1
            </div>
            <div
              className="xm-mono"
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                marginTop: "4px",
              }}
            >
              n_estimators: 100
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            className="xm-mono"
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "var(--text)",
            }}
          >
            F1: 0.8912
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "var(--success)",
              marginTop: "4px",
              display: "flex",
              gap: "4px",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <CheckCircle2 size={12} /> Completed in 4m 12s
          </div>
        </div>
      </div>
    </div>
  );
};

const DagNode = ({ icon: Icon, title, meta, active, success }) => (
  <div
    className={`xm-dag-node ${active ? "active" : ""} ${success ? "success" : ""}`}
  >
    <div className="xm-dag-icon">
      <Icon size={18} />
    </div>
    <div>
      <div
        className="xm-heading"
        style={{ fontSize: "14px", fontWeight: "700" }}
      >
        {title}
      </div>
      <div
        className="xm-mono"
        style={{
          fontSize: "11px",
          color: "var(--text-secondary)",
          marginTop: "4px",
        }}
      >
        {meta}
      </div>
    </div>
  </div>
);

function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const NAV_LINKS = [
    { label: "Product", href: "#product" },
    { label: "Capabilities", href: "#capabilities" },
    { label: "Lineage", href: "#signature" },
    { label: "Workspace", href: "#workspace" },
  ];

  return (
    <div className="xm-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

        :root {
          --primary: #2563EB;
          --primary-dark: #1D4ED8;
          --primary-soft: #EFF6FF;
          --secondary: #0EA5E9;
          --accent: #06B6D4;
          --bg: #FAFAFA;
          --surface: #FFFFFF;
          --soft: #F1F5F9;
          --border: #E2E8F0;
          --border-hover: #CBD5E1;
          --text: #0F172A;
          --text-secondary: #475569;
          --success: #10B981;
          --success-soft: #D1FAE5;
          --warning: #F59E0B;
          --warning-soft: #FEF3C7;
          --danger: #EF4444;
          --danger-soft: #FEE2E2;
          
          --shadow-sm: 0 1px 2px rgba(15,23,42,0.04);
          --shadow-md: 0 4px 12px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.02);
          --shadow-lg: 0 16px 40px rgba(15,23,42,0.08), 0 4px 8px rgba(15,23,42,0.03);
          
          --radius-md: 8px;
          --radius-lg: 12px;
          --radius-xl: 16px;
          --radius-2xl: 24px;
          
          --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
          --transition-smooth: 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        /* Global & Typography */
        .xm-root {
          font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
          background-color: var(--bg);
          color: var(--text);
        }
        h1, h2, h3, h4, .xm-heading {
          font-family: 'Manrope', ui-sans-serif, system-ui, sans-serif;
          letter-spacing: -0.025em;
          margin: 0;
        }
        p { margin: 0; }
        .xm-mono {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
        }
        
        .xm-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        .xm-section { padding: 112px 0; }
        @media (max-width: 768px) { .xm-section { padding: 72px 0; } }

        /* Focus States for A11y */
        *:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 2px;
          border-radius: 2px;
        }

        /* Navigation */
        .xm-nav {
          position: sticky; top: 0; z-index: 50;
          backdrop-filter: blur(12px);
          background-color: rgba(250,250,250,0.85);
          border-bottom: 1px solid var(--border);
        }
        .xm-nav-inner { display: flex; align-items: center; justify-content: space-between; height: 68px; }
        .xm-logo { display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 19px; color: var(--text); text-decoration: none; }
        .xm-nav-links { display: flex; gap: 36px; }
        .xm-nav-link { font-size: 14px; font-weight: 500; color: var(--text-secondary); text-decoration: none; transition: color var(--transition-fast); }
        .xm-nav-link:hover { color: var(--text); }
        .xm-nav-actions { display: flex; align-items: center; gap: 16px; }
        .xm-nav-mobile-toggle { display: none; background: none; border: none; cursor: pointer; color: var(--text); padding: 4px; }
        
        @media (max-width: 768px) {
          .xm-nav-links, .xm-signin-desktop { display: none; }
          .xm-nav-mobile-toggle { display: block; }
        }

        /* Premium Button Interactions */
        .xm-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          font-size: 14px; font-weight: 600; border-radius: var(--radius-md); padding: 10px 18px;
          cursor: pointer; text-decoration: none; border: 1px solid transparent;
          position: relative; overflow: hidden;
          transition: all var(--transition-smooth);
        }
        .xm-btn .lucide { transition: transform var(--transition-smooth); }
        
        .xm-btn-primary { 
          background-color: var(--primary); color: #fff; 
          box-shadow: 0 1px 2px rgba(37,99,235,0.15), inset 0 1px 0 rgba(255,255,255,0.15); 
        }
        .xm-btn-primary::after {
          content: ""; position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          transform: skewX(-20deg); transition: left 500ms ease;
        }
        .xm-btn-primary:hover { 
          background-color: var(--primary-dark); 
          box-shadow: 0 4px 12px rgba(37,99,235,0.25), inset 0 1px 0 rgba(255,255,255,0.2); 
        }
        .xm-btn-primary:hover::after { left: 200%; }
        .xm-btn-primary:hover .lucide { transform: translateX(3px); }

        .xm-btn-ghost { color: var(--text); border-color: var(--border); background: var(--surface); box-shadow: var(--shadow-sm); }
        .xm-btn-ghost:hover { background-color: var(--soft); border-color: var(--border-hover); color: var(--primary); }
        
        .xm-btn-white { background-color: #fff; color: var(--primary); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .xm-btn-white:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.15); }
        .xm-btn-white:hover .lucide { transform: translateX(3px); }

        /* Headers & Badges */
        .xm-story-header { text-align: center; max-width: 680px; margin: 0 auto 64px; }
        .xm-story-header.left { text-align: left; margin: 0 0 48px 0; max-width: 800px; }
        .xm-badge { 
          display: inline-flex; align-items: center; gap: 6px; 
          font-size: 12.5px; font-weight: 600; font-family: 'JetBrains Mono', monospace;
          color: var(--primary); background: var(--primary-soft); 
          padding: 4px 12px; border-radius: 999px; margin-bottom: 20px;
        }
        .xm-title { font-size: 38px; line-height: 1.15; font-weight: 800; color: var(--text); margin-bottom: 18px; }
        .xm-subtitle { font-size: 17px; line-height: 1.65; color: var(--text-secondary); font-weight: 400; }

        /* Hero Section */
        .xm-hero { position: relative; overflow: hidden; padding: 100px 0; border-bottom: 1px solid var(--border); background: linear-gradient(180deg, #FFFFFF 0%, var(--bg) 100%); }
        .xm-hero-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 56px; align-items: center; }
        @media (max-width: 992px) { .xm-hero-grid { grid-template-columns: 1fr; } }
        
        /* Hero Widget & Live Indicators */
        .xm-hero-widget {
          background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-xl);
          box-shadow: var(--shadow-lg); padding: 24px;
        }
        .xm-hero-widget-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
        .xm-run-item { 
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px; border-radius: var(--radius-md); border: 1px solid transparent;
          transition: background-color var(--transition-fast); cursor: default;
        }
        .xm-run-item:hover { background-color: var(--soft); }
        .xm-run-item.active { background-color: var(--primary-soft); border-color: #BFDBFE; }
        
        .xm-pulse-dot {
          width: 10px; height: 10px; border-radius: 50%; background: var(--dot-color);
          box-shadow: 0 0 0 0 rgba(37,99,235,0.4);
          animation: pulse 2s infinite cubic-bezier(0.66, 0, 0, 1);
        }
        @keyframes pulse {
          to { box-shadow: 0 0 0 10px rgba(37,99,235,0); }
        }

        /* Problem/Solution Split */
        .xm-split { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: var(--radius-2xl); overflow: hidden; }
        @media (max-width: 768px) { .xm-split { grid-template-columns: 1fr; } }
        .xm-split-pane { background: var(--surface); padding: 56px; }
        @media (max-width: 768px) { .xm-split-pane { padding: 40px 24px; } }
        .xm-split-pane.darker { background: var(--soft); }

        /* Bento Grid Capabilities */
        .xm-bento-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        @media (max-width: 992px) { .xm-bento-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 768px) { .xm-bento-grid { grid-template-columns: 1fr; } }
        .xm-bento-card {
          background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-xl);
          padding: 32px; transition: all var(--transition-smooth);
          display: flex; flex-direction: column; height: 100%;
        }
        .xm-bento-card:hover { border-color: var(--primary); box-shadow: var(--shadow-md); transform: translateY(-2px); }
        .xm-bento-card.wide { grid-column: span 2; }
        @media (max-width: 992px) { .xm-bento-card.wide { grid-column: span 1; } }
        .xm-icon-wrapper { width: 44px; height: 44px; border-radius: 10px; background: var(--primary-soft); display: flex; align-items: center; justify-content: center; margin-bottom: 20px; color: var(--primary); }
        
        .xm-mini-ui {
          margin-top: auto; padding-top: 24px;
        }
        .xm-mini-ui-box {
          background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-md);
          padding: 12px; font-size: 12px; font-family: 'JetBrains Mono', monospace; color: var(--text-secondary);
          display: flex; flex-direction: column; gap: 8px;
        }

        /* Interactive DAG */
        .xm-dag-container {
          background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-2xl);
          padding: 80px 40px; display: flex; flex-direction: column; align-items: center;
          position: relative; overflow: hidden; box-shadow: var(--shadow-sm);
        }
        @media (max-width: 768px) { .xm-dag-container { padding: 40px 16px; overflow-x: auto; align-items: flex-start; } }
        .xm-dag-bg {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.4;
          background-image: radial-gradient(var(--border) 1px, transparent 1px); background-size: 24px 24px;
        }
        .xm-dag-row { display: flex; justify-content: center; gap: 32px; position: relative; z-index: 2; width: 100%; }
        @media (max-width: 768px) { .xm-dag-row { justify-content: flex-start; min-width: 600px; } }
        
        .xm-dag-node {
          background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg);
          padding: 16px; min-width: 220px; display: flex; align-items: flex-start; gap: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02); transition: all var(--transition-smooth);
        }
        .xm-dag-node:hover { border-color: var(--primary); transform: translateY(-2px); box-shadow: var(--shadow-md); }
        .xm-dag-node.active { border-color: var(--accent); background: #F0FDFA; }
        .xm-dag-node.active .xm-dag-icon { background: #CCFBF1; color: var(--accent); }
        .xm-dag-node.success { border-color: var(--success); background: var(--success-soft); }
        .xm-dag-node.success .xm-dag-icon { background: var(--surface); color: var(--success); }
        
        .xm-dag-icon { width: 36px; height: 36px; border-radius: 8px; background: var(--soft); display: flex; align-items: center; justify-content: center; color: var(--text-secondary); flex-shrink: 0; }
        
        /* Connectors */
        .xm-dag-path-vertical { height: 32px; width: 2px; background: var(--border); margin: 0 auto; position: relative; z-index: 1; }
        .xm-dag-branch {
          display: flex; width: 100%; max-width: 480px; margin: 0 auto;
          position: relative; height: 32px; z-index: 1;
        }
        .xm-dag-branch::before {
          content: ""; position: absolute; top: 0; left: 50%; width: 2px; height: 16px; background: var(--border); transform: translateX(-50%);
        }
        .xm-dag-branch::after {
          content: ""; position: absolute; top: 16px; left: 10%; right: 10%; height: 2px; background: var(--border);
        }
        .xm-dag-drops {
          display: flex; justify-content: space-between; width: 100%; max-width: 480px; margin: 0 auto;
          position: relative; height: 16px; z-index: 1; padding: 0 10%;
        }
        .xm-dag-drops div { width: 2px; height: 100%; background: var(--border); }
        
        .xm-dag-merge {
          display: flex; width: 100%; max-width: 480px; margin: 0 auto;
          position: relative; height: 32px; z-index: 1;
        }
        .xm-dag-merge::before {
          content: ""; position: absolute; bottom: 0; left: 50%; width: 2px; height: 16px; background: var(--border); transform: translateX(-50%);
        }
        .xm-dag-merge::after {
          content: ""; position: absolute; bottom: 16px; left: 10%; right: 10%; height: 2px; background: var(--border);
        }

        /* Reproducibility Diff Viewer */
        .xm-repro-diff { background: #0F172A; border-radius: var(--radius-xl); overflow: hidden; color: #E2E8F0; font-family: 'JetBrains Mono', monospace; font-size: 13px; box-shadow: var(--shadow-lg); }
        .xm-repro-header { background: #1E293B; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; }
        .xm-repro-row { display: flex; padding: 8px 20px; border-bottom: 1px solid #1E293B; flex-wrap: wrap; }
        @media (max-width: 600px) { .xm-repro-row { flex-direction: column; gap: 4px; } }
        .xm-repro-row:last-child { border: none; }
        .xm-repro-col { flex: 1; min-width: 200px; }
        .xm-diff-remove { background: rgba(220, 38, 38, 0.15); color: #FCA5A5; }
        .xm-diff-add { background: rgba(16, 185, 129, 0.15); color: #6EE7B7; }
        .xm-diff-meta { color: #94A3B8; font-size: 11px; padding: 12px 20px; background: #0B1120; border-bottom: 1px solid #1E293B; display: flex; gap: 16px; }

        /* ML Workspace Dashboard Preview */
        .xm-dash {
          background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-xl);
          overflow: hidden; box-shadow: var(--shadow-lg);
          display: grid; grid-template-columns: 240px 1fr;
        }
        @media (max-width: 900px) { .xm-dash { grid-template-columns: 1fr; } }
        .xm-dash-sidebar { border-right: 1px solid var(--border); background: var(--bg); padding: 24px 16px; }
        @media (max-width: 900px) { .xm-dash-sidebar { border-right: none; border-bottom: 1px solid var(--border); display: flex; overflow-x: auto; gap: 8px; padding: 16px; } }
        .xm-dash-main { padding: 40px; }
        @media (max-width: 768px) { .xm-dash-main { padding: 24px; } }
        
        .xm-metric-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
        @media (max-width: 1024px) { .xm-metric-grid { grid-template-columns: repeat(2, 1fr); } }
        .xm-metric-card { border: 1px solid var(--border); padding: 16px; border-radius: var(--radius-lg); }
        
        .xm-ml-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 24px; }
        @media (max-width: 1024px) { .xm-ml-grid { grid-template-columns: 1fr; } }
        .xm-panel { border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px; }
        
        /* Specific ML Charts */
        .xm-chart-line { stroke: var(--primary); stroke-width: 2; fill: none; stroke-linecap: round; stroke-linejoin: round; }
        .xm-chart-area { fill: var(--primary-soft); }
        .xm-bar-row { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; font-size: 12px; }
        .xm-bar-bg { flex: 1; background: var(--soft); height: 8px; border-radius: 4px; overflow: hidden; }
        .xm-bar-fill { background: var(--primary); height: 100%; border-radius: 4px; }

        /* Final CTA */
        .xm-cta-section { padding: 0 24px 112px; }
        .xm-cta-box {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          border-radius: var(--radius-2xl); padding: 80px 40px; text-align: center; color: #fff;
          position: relative; overflow: hidden; box-shadow: var(--shadow-lg);
        }
        @media (max-width: 768px) { .xm-cta-box { padding: 56px 24px; } }
        .xm-cta-box::before {
          content: ""; position: absolute; inset: 0; opacity: 0.1;
          background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 24px 24px;
        }
        .xm-cta-content { position: relative; z-index: 2; max-width: 720px; margin: 0 auto; }
        
        /* Footer */
        .xm-footer { border-top: 1px solid var(--border); padding: 80px 0 32px; background: var(--surface); }
        .xm-footer-grid { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 40px; }
        .xm-footer-links-group { display: flex; gap: 80px; flex-wrap: wrap; }
        @media (max-width: 768px) { .xm-footer-links-group { gap: 40px; } }
      `}</style>

      {/* --- Navigation --- */}
      <header className="xm-nav">
        <div className="xm-container xm-nav-inner">
          <a href="#" className="xm-logo" aria-label="ExperiML Home">
            <Network size={24} strokeWidth={2.5} color="var(--primary)" />
            ExperiML
          </a>
          <nav className="xm-nav-links" aria-label="Main Navigation">
            {NAV_LINKS.map((link) => (
              <a key={link.label} href={link.href} className="xm-nav-link">
                {link.label}
              </a>
            ))}
          </nav>
          <div className="xm-nav-actions">
            <a href="#" className="xm-btn xm-btn-ghost xm-signin-desktop">
              Sign In
            </a>
            <a href="#" className="xm-btn xm-btn-primary">
              Start Building <ArrowRight size={16} />
            </a>
            <button
              className="xm-nav-mobile-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* --- 1. Hero --- */}
        <section className="xm-hero">
          <div className="xm-container xm-hero-grid">
            <div>
              <div className="xm-badge">ML Experiment Management</div>
              <h1
                className="xm-title"
                style={{ fontSize: "clamp(40px, 5vw, 56px)" }}
              >
                Engineering discipline <br />
                for Machine Learning.
              </h1>
              <p
                className="xm-subtitle"
                style={{ marginBottom: "40px", maxWidth: "540px" }}
              >
                Stop treating ML experiments like throwaway scripts. ExperiML
                provides a structured workspace for datasets, hyperparameter
                tracking, model lineage, and absolute reproducibility.
              </p>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <a
                  href="#"
                  className="xm-btn xm-btn-primary"
                  style={{ padding: "14px 28px", fontSize: "15px" }}
                >
                  Deploy Workspace <ArrowRight size={18} />
                </a>
                <a
                  href="#"
                  className="xm-btn xm-btn-ghost"
                  style={{ padding: "14px 28px", fontSize: "15px" }}
                >
                  Documentation
                </a>
              </div>
            </div>

            <LiveHeroWidget />
          </div>
        </section>

        {/* --- 2. Narrative: Problem vs Solution --- */}
        <section className="xm-section" id="product">
          <div className="xm-container">
            <div className="xm-split">
              <div className="xm-split-pane darker">
                <GitPullRequest
                  size={32}
                  color="var(--warning)"
                  style={{ marginBottom: "24px" }}
                />
                <h3 className="xm-title" style={{ fontSize: "26px" }}>
                  The Messy Reality
                </h3>
                <p className="xm-subtitle">
                  Most ML work lives across fragmented Jupyter notebooks, local
                  folders, and untracked CSVs. Datasets get overwritten,
                  hyperparameters are forgotten, and reproducing last week’s
                  "best model" relies heavily on guesswork.
                </p>
              </div>
              <div className="xm-split-pane">
                <Database
                  size={32}
                  color="var(--primary)"
                  style={{ marginBottom: "24px" }}
                />
                <h3 className="xm-title" style={{ fontSize: "26px" }}>
                  The Engineered Standard
                </h3>
                <p className="xm-subtitle">
                  We treat ML like software engineering. By isolating datasets,
                  enforcing immutable experiment logging, and linking models
                  directly to their generating parameters, ExperiML ensures
                  bit-for-bit reproducibility.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- 3. Capabilities Section --- */}
        <section
          className="xm-section"
          id="capabilities"
          style={{ background: "var(--surface)" }}
        >
          <style>{`
    /* Aggressive CSS fix to completely prevent grid overlapping */
    #capabilities .xm-bento-grid { 
      display: grid; 
      grid-template-columns: repeat(3, 1fr); 
      gap: 32px;
      grid-auto-flow: row; /* Force strict row placement */
      grid-auto-rows: min-content; /* Force the grid row to wrap exactly around the tallest card */
      align-items: stretch;
    }
    @media (max-width: 992px) { #capabilities .xm-bento-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 768px) { #capabilities .xm-bento-grid { grid-template-columns: 1fr; } }
    
    #capabilities .xm-bento-card {
      background: var(--surface); 
      border: 1px solid var(--border); 
      border-radius: var(--radius-xl);
      padding: 32px; 
      transition: all var(--transition-smooth);
      display: flex; 
      flex-direction: column;
      min-height: 100%; /* Tells the browser the card can never be smaller than its content */
      box-sizing: border-box;
      position: relative;
    }
    
    #capabilities .xm-bento-card.wide { grid-column: span 2; }
    @media (max-width: 992px) { #capabilities .xm-bento-card.wide { grid-column: span 1; } }
  `}</style>

          <div className="xm-container">
            <div className="xm-story-header left">
              <h2 className="xm-title">Core Platform Capabilities</h2>
              <p className="xm-subtitle">
                Everything required to transition from local hacking to
                production-grade tracking.
              </p>
            </div>

            <div className="xm-bento-grid">
              <div className="xm-bento-card wide">
                <div className="xm-icon-wrapper">
                  <Activity size={22} />
                </div>
                <h4
                  className="xm-heading"
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    marginBottom: "12px",
                  }}
                >
                  Automated Experiment Tracking
                </h4>
                <p className="xm-subtitle" style={{ fontSize: "15px" }}>
                  Log parameters, metrics, and artifacts automatically as runs
                  execute. Compare results side by side and see exactly what
                  changed between them.
                </p>
                <div className="xm-mini-ui">
                  <div className="xm-mini-ui-box">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        color: "var(--text)",
                      }}
                    >
                      <strong>run: xgboost-v3</strong>{" "}
                      <span style={{ color: "var(--success)" }}>F1: 0.942</span>
                    </div>
                    <div>
                      <span style={{ color: "var(--primary)" }}>•</span>{" "}
                      artifacts: model.pkl (42MB), logs.json
                    </div>
                    <div>
                      <span style={{ color: "var(--primary)" }}>•</span> params:{" "}
                      {`{eta: 0.01, depth: 6, subsample: 0.8}`}
                    </div>
                  </div>
                </div>
              </div>

              <div className="xm-bento-card">
                <div className="xm-icon-wrapper">
                  <FolderKanban size={22} />
                </div>
                <h4
                  className="xm-heading"
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    marginBottom: "12px",
                  }}
                >
                  Project Management
                </h4>
                <p className="xm-subtitle" style={{ fontSize: "15px" }}>
                  Group datasets, experiments, and models neatly under unified
                  project workspaces.
                </p>
                <div className="xm-mini-ui">
                  <div className="xm-mini-ui-box" style={{ gap: "4px" }}>
                    <div style={{ color: "var(--text)" }}>
                      📁 ecommerce-recsys
                    </div>
                    <div style={{ paddingLeft: "16px" }}>
                      ├─ 📊 datasets (3)
                    </div>
                    <div style={{ paddingLeft: "16px" }}>
                      ├─ 🧪 experiments (142)
                    </div>
                    <div style={{ paddingLeft: "16px" }}>
                      └─ 📦 registry (2 deployed)
                    </div>
                  </div>
                </div>
              </div>

              <div className="xm-bento-card">
                <div className="xm-icon-wrapper">
                  <HardDrive size={22} />
                </div>
                <h4
                  className="xm-heading"
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    marginBottom: "12px",
                  }}
                >
                  Dataset Versioning
                </h4>
                <p className="xm-subtitle" style={{ fontSize: "15px" }}>
                  Upload and lock dataset versions tied directly to the
                  inference results they produced.
                </p>
                <div className="xm-mini-ui">
                  <div className="xm-mini-ui-box">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "var(--text)", fontWeight: 600 }}>
                        users_cleaned.csv
                      </span>
                      <span
                        style={{
                          background: "var(--soft)",
                          padding: "2px 6px",
                          borderRadius: "4px",
                        }}
                      >
                        v2.1.4
                      </span>
                    </div>
                    <div>sha256: 8f4e2a...9b1c</div>
                    <div>size: 1.4GB • linked runs: 42</div>
                  </div>
                </div>
              </div>

              <div className="xm-bento-card">
                <div className="xm-icon-wrapper">
                  <Box size={22} />
                </div>
                <h4
                  className="xm-heading"
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    marginBottom: "12px",
                  }}
                >
                  Model Registry
                </h4>
                <p className="xm-subtitle" style={{ fontSize: "15px" }}>
                  Store weights and architecture logs securely, perfectly
                  versioned and traced to their original run.
                </p>
                <div className="xm-mini-ui">
                  <div className="xm-mini-ui-box">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        color: "var(--text)",
                      }}
                    >
                      <strong>resnet-50-final</strong>
                      <span style={{ color: "var(--success)" }}>
                        ● Production
                      </span>
                    </div>
                    <div>stage: Serving (API-East)</div>
                    <div>lineage: run_8f2b1</div>
                  </div>
                </div>
              </div>

              <div className="xm-bento-card">
                <div className="xm-icon-wrapper">
                  <Target size={22} />
                </div>
                <h4
                  className="xm-heading"
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    marginBottom: "12px",
                  }}
                >
                  Batch Predictions
                </h4>
                <p className="xm-subtitle" style={{ fontSize: "15px" }}>
                  Generate and evaluate predictions from any historically
                  trained model directly in the platform.
                </p>
                <div className="xm-mini-ui">
                  <div className="xm-mini-ui-box">
                    <div>
                      job_status:{" "}
                      <span style={{ color: "var(--primary)" }}>Completed</span>
                    </div>
                    <div>rows_processed: 10,000</div>
                    <div>avg_confidence: 0.982</div>
                    <div style={{ color: "var(--text)" }}>
                      output: s3://bucket/preds.csv
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- 4. Reproducibility Focus --- */}
        <section className="xm-section" style={{ background: "var(--soft)" }}>
          <div
            className="xm-container"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
              gap: "64px",
              alignItems: "center",
            }}
          >
            <div>
              <div
                className="xm-badge"
                style={{ background: "var(--surface)" }}
              >
                Version Control for ML
              </div>
              <h2 className="xm-title">Never lose a configuration again.</h2>
              <p className="xm-subtitle" style={{ marginBottom: "24px" }}>
                Because a model is only as good as your ability to recreate it.
                ExperiML tracks seed values, environment variables,
                dependencies, and parameter diffs so you know exactly why `v3`
                outperformed `v2`.
              </p>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    fontSize: "15px",
                    color: "var(--text)",
                  }}
                >
                  <CheckCircle2 size={20} color="var(--success)" />{" "}
                  Deterministic seed & environment tracking
                </li>
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    fontSize: "15px",
                    color: "var(--text)",
                  }}
                >
                  <CheckCircle2 size={20} color="var(--success)" /> Automated
                  Hyperparameter diff visualization
                </li>
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    fontSize: "15px",
                    color: "var(--text)",
                  }}
                >
                  <CheckCircle2 size={20} color="var(--success)" /> Python &
                  CUDA dependency logging
                </li>
              </ul>
            </div>

            {/* Reproducibility Visual */}
            <div className="xm-repro-diff">
              <div className="xm-repro-header">
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <TerminalSquare size={16} color="#94A3B8" />{" "}
                  <span>Compare: baseline vs active</span>
                </div>
                <div style={{ fontSize: "11px", color: "#64748B" }}>
                  14m ago
                </div>
              </div>
              <div className="xm-diff-meta">
                <span>env: ubuntu-20.04</span>
                <span>seed: 42</span>
              </div>
              <div className="xm-repro-row xm-diff-remove">
                <div className="xm-repro-col">- python: 3.9.12</div>
                <div className="xm-repro-col">- cuda: 11.3</div>
              </div>
              <div className="xm-repro-row xm-diff-add">
                <div className="xm-repro-col">+ python: 3.10.4</div>
                <div className="xm-repro-col">+ cuda: 11.6</div>
              </div>
              <div className="xm-repro-row">
                <div className="xm-repro-col">
                  &nbsp;&nbsp;dataset_hash: "a1b2c3d"
                </div>
                <div className="xm-repro-col">
                  &nbsp;&nbsp;dataset_hash: "a1b2c3d"
                </div>
              </div>
              <div className="xm-repro-row xm-diff-remove">
                <div className="xm-repro-col">- learning_rate: 0.1</div>
                <div className="xm-repro-col">- max_depth: 3</div>
              </div>
              <div className="xm-repro-row xm-diff-add">
                <div className="xm-repro-col">+ learning_rate: 0.01</div>
                <div className="xm-repro-col">+ max_depth: 6</div>
              </div>
              <div className="xm-repro-row">
                <div className="xm-repro-col">
                  &nbsp;&nbsp;n_estimators: 100
                </div>
                <div className="xm-repro-col">&nbsp;&nbsp;subsample: 0.8</div>
              </div>
            </div>
          </div>
        </section>

        {/* --- 5. Signature Section: Experiment Lineage (DAG) --- */}
        <section
          className="xm-section"
          id="signature"
          style={{ background: "var(--surface)" }}
        >
          <div className="xm-container">
            <div className="xm-story-header">
              <h2 className="xm-title">Complete Experiment Lineage</h2>
              <p className="xm-subtitle">
                Understand exactly how a model was built. ExperiML maps the
                entire lifecycle from raw data ingestion to artifact
                generation—visually and programmatically.
              </p>
            </div>

            <div className="xm-dag-container">
              <div className="xm-dag-bg" />

              {/* Level 1: Raw Data & Preprocessing */}
              <div className="xm-dag-row">
                <DagNode
                  icon={Server}
                  title="Raw Data Ingestion"
                  meta="s3://datalake/logs.csv"
                />
                <DagNode
                  icon={FileCode2}
                  title="Feature Engineering"
                  meta="script: clean_v2.py"
                />
              </div>

              <div className="xm-dag-path-vertical" />

              {/* Level 2: Training Dataset */}
              <div className="xm-dag-row">
                <DagNode
                  icon={Database}
                  title="Training Dataset"
                  meta="v4.2.1 · 2.4GB · Locked"
                />
              </div>

              <div className="xm-dag-branch" />
              <div className="xm-dag-drops">
                <div />
                <div />
                <div />
              </div>

              {/* Level 3: Experiments */}
              <div className="xm-dag-row" style={{ gap: "16px" }}>
                <DagNode
                  icon={Cpu}
                  title="rf-baseline"
                  meta="Completed · F1: 0.89"
                />
                <DagNode
                  icon={Activity}
                  title="xgboost-v2"
                  meta="Failed · OOM Error"
                />
                <DagNode
                  icon={Timer}
                  title="xgboost-v3"
                  meta="Active (E42) · F1: 0.94"
                  active
                />
              </div>

              <div className="xm-dag-merge" />

              {/* Level 4: Evaluation */}
              <div className="xm-dag-row">
                <DagNode
                  icon={Target}
                  title="Model Evaluation"
                  meta="Winner: xgboost-v3 (Promoted)"
                  success
                />
              </div>

              <div className="xm-dag-path-vertical" />

              {/* Level 5: Registry */}
              <div className="xm-dag-row">
                <DagNode
                  icon={Package}
                  title="Model Registry"
                  meta="Tag: Production · v3.0.0"
                />
              </div>
            </div>
          </div>
        </section>

        {/* --- 6. ML Workspace Dashboard Preview --- */}
        <section
          className="xm-section"
          id="workspace"
          style={{
            background: "var(--soft)",
            borderTop: `1px solid var(--border)`,
          }}
        >
          <div className="xm-container">
            <div className="xm-story-header">
              <h2 className="xm-title">Designed for Data Science</h2>
              <p className="xm-subtitle">
                Not just another generic SaaS grid. Get deep insights into
                epochs, validation loss, feature importance, and hyperparameter
                tuning all within your dashboard.
              </p>
            </div>

            <div className="xm-dash">
              {/* Sidebar */}
              <div className="xm-dash-sidebar">
                <div
                  className="xm-mono"
                  style={{
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    marginBottom: "20px",
                    paddingLeft: "12px",
                  }}
                >
                  WORKSPACE
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    minWidth: "max-content",
                  }}
                >
                  <div
                    className="xm-btn-ghost"
                    style={{
                      justifyContent: "flex-start",
                      border: "none",
                      background: "transparent",
                    }}
                  >
                    <Layers size={18} /> Projects
                  </div>
                  <div
                    className="xm-btn-ghost"
                    style={{
                      justifyContent: "flex-start",
                      border: "none",
                      background: "transparent",
                    }}
                  >
                    <Database size={18} /> Datasets
                  </div>
                  <div
                    className="xm-btn-ghost"
                    style={{
                      justifyContent: "flex-start",
                      border: "none",
                      background: "var(--primary-soft)",
                      color: "var(--primary)",
                    }}
                  >
                    <Activity size={18} /> Experiments
                  </div>
                  <div
                    className="xm-btn-ghost"
                    style={{
                      justifyContent: "flex-start",
                      border: "none",
                      background: "transparent",
                    }}
                  >
                    <Package size={18} /> Model Registry
                  </div>
                  <div
                    className="xm-btn-ghost"
                    style={{
                      justifyContent: "flex-start",
                      border: "none",
                      background: "transparent",
                    }}
                  >
                    <Settings2 size={18} /> Environment
                  </div>
                </div>
              </div>

              {/* Main Workspace Area */}
              <div className="xm-dash-main">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "32px",
                    flexWrap: "wrap",
                    gap: "16px",
                  }}
                >
                  <div>
                    <h3
                      className="xm-heading"
                      style={{ fontSize: "22px", fontWeight: "700" }}
                    >
                      xgboost-revenue-v3
                    </h3>
                    <div
                      className="xm-mono"
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                        marginTop: "4px",
                      }}
                    >
                      <GitCommit
                        size={12}
                        style={{ display: "inline", verticalAlign: "middle" }}
                      />{" "}
                      8f2b1a9 • run_49201
                    </div>
                  </div>
                  <div
                    className="xm-badge"
                    style={{
                      margin: 0,
                      background: "var(--success-soft)",
                      color: "var(--success)",
                    }}
                  >
                    <CheckCircle2 size={14} /> Training Complete
                  </div>
                </div>

                {/* Metrics */}
                <div className="xm-metric-grid">
                  <div className="xm-metric-card">
                    <div
                      className="xm-mono"
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                        marginBottom: "10px",
                      }}
                    >
                      VALIDATION LOSS
                    </div>
                    <div
                      className="xm-heading"
                      style={{ fontSize: "28px", fontWeight: "700" }}
                    >
                      0.0142
                    </div>
                  </div>
                  <div className="xm-metric-card">
                    <div
                      className="xm-mono"
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                        marginBottom: "10px",
                      }}
                    >
                      F1 SCORE
                    </div>
                    <div
                      className="xm-heading"
                      style={{
                        fontSize: "28px",
                        fontWeight: "700",
                        color: "var(--primary)",
                      }}
                    >
                      0.9420
                    </div>
                  </div>
                  <div
                    className="xm-metric-card"
                    style={{ gridColumn: "span 2" }}
                  >
                    <div
                      className="xm-mono"
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                        marginBottom: "10px",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>TRAINING LOSS (EPOCHS)</span>
                      <span style={{ color: "var(--primary)" }}>Live</span>
                    </div>
                    <svg
                      viewBox="0 0 200 40"
                      style={{
                        width: "100%",
                        height: "40px",
                        overflow: "visible",
                      }}
                      aria-label="Training Loss Chart"
                      role="img"
                    >
                      <path
                        className="xm-chart-area"
                        d="M0,40 L0,30 L20,25 L40,15 L60,20 L80,10 L100,12 L120,5 L140,8 L160,2 L180,4 L200,0 L200,40 Z"
                      />
                      <path
                        className="xm-chart-line"
                        d="M0,30 L20,25 L40,15 L60,20 L80,10 L100,12 L120,5 L140,8 L160,2 L180,4 L200,0"
                      />
                    </svg>
                  </div>
                </div>

                {/* Deep ML Visuals */}
                <div className="xm-ml-grid">
                  <div className="xm-panel">
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        marginBottom: "24px",
                      }}
                    >
                      <BarChart4 size={18} color="var(--text-secondary)" />
                      <span
                        className="xm-heading"
                        style={{ fontSize: "16px", fontWeight: "700" }}
                      >
                        Feature Importance (SHAP)
                      </span>
                    </div>
                    <div>
                      {[
                        { label: "user_lifetime_value", val: 92 },
                        { label: "recent_purchases_7d", val: 78 },
                        { label: "session_duration_avg", val: 54 },
                        { label: "cart_abandonment_rate", val: 32 },
                        { label: "email_click_rate", val: 18 },
                      ].map((feat) => (
                        <div key={feat.label} className="xm-bar-row">
                          <div
                            className="xm-mono"
                            style={{
                              width: "150px",
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {feat.label}
                          </div>
                          <div className="xm-bar-bg">
                            <div
                              className="xm-bar-fill"
                              style={{ width: `${feat.val}%` }}
                            ></div>
                          </div>
                          <div
                            className="xm-mono"
                            style={{
                              width: "30px",
                              textAlign: "right",
                              color: "var(--text-secondary)",
                            }}
                          >
                            {feat.val}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    className="xm-panel"
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        marginBottom: "20px",
                      }}
                    >
                      <Settings2 size={18} color="var(--text-secondary)" />
                      <span
                        className="xm-heading"
                        style={{ fontSize: "16px", fontWeight: "700" }}
                      >
                        Hyperparameters
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        flex: 1,
                        justifyContent: "center",
                      }}
                    >
                      {[
                        { k: "learning_rate", v: "0.01" },
                        { k: "max_depth", v: "6" },
                        { k: "subsample", v: "0.8" },
                        { k: "objective", v: '"binary:logistic"' },
                      ].map((param) => (
                        <div
                          key={param.k}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "10px 14px",
                            background: "var(--soft)",
                            borderRadius: "8px",
                          }}
                        >
                          <span
                            className="xm-mono"
                            style={{
                              fontSize: "13px",
                              color: "var(--text-secondary)",
                            }}
                          >
                            {param.k}
                          </span>
                          <span
                            className="xm-mono"
                            style={{ fontSize: "13px", fontWeight: "600" }}
                          >
                            {param.v}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- 7. Final Call to Action --- */}
        <section
          className="xm-cta-section"
          style={{ background: "var(--soft)" }}
        >
          <div className="xm-container">
            <div className="xm-cta-box">
              <div className="xm-cta-content">
                <h2
                  style={{
                    fontSize: "clamp(32px, 4vw, 42px)",
                    fontWeight: 800,
                    marginBottom: "24px",
                    letterSpacing: "-0.02em",
                    fontFamily: "'Manrope', sans-serif",
                  }}
                >
                  Engineering discipline for your ML lifecycle.
                </h2>
                <p
                  style={{
                    fontSize: "18px",
                    opacity: 0.9,
                    marginBottom: "40px",
                    lineHeight: 1.6,
                  }}
                >
                  From the first dataset upload to the final production model,
                  ExperiML guarantees bit-for-bit reproducibility. Stop losing
                  your best configurations and start building with confidence.
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <a
                    href="#"
                    className="xm-btn xm-btn-white"
                    style={{ padding: "14px 32px", fontSize: "15px" }}
                  >
                    Create Free Workspace <ArrowRight size={18} />
                  </a>
                </div>
                <div
                  className="xm-mono"
                  style={{ marginTop: "24px", fontSize: "13px", opacity: 0.7 }}
                >
                  Free for individuals and students. No credit card required.
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="xm-footer">
        <div className="xm-container xm-footer-grid">
          <div>
            <a
              href="#"
              className="xm-logo"
              style={{ marginBottom: "20px" }}
              aria-label="ExperiML Home"
            >
              <Network size={22} strokeWidth={2.5} color="var(--primary)" />
              ExperiML
            </a>
            <p
              className="xm-subtitle"
              style={{ fontSize: "15px", maxWidth: "320px" }}
            >
              The disciplined experiment management platform for data scientists
              and ML engineers.
            </p>
          </div>
          <div className="xm-footer-links-group">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <strong
                style={{
                  fontSize: "14px",
                  fontFamily: "'Manrope', sans-serif",
                  color: "var(--text)",
                }}
              >
                Platform
              </strong>
              <a href="#" className="xm-nav-link">
                Experiment Tracking
              </a>
              <a href="#" className="xm-nav-link">
                Model Registry
              </a>
              <a href="#" className="xm-nav-link">
                Dataset Versioning
              </a>
              <a href="#" className="xm-nav-link">
                Integrations
              </a>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <strong
                style={{
                  fontSize: "14px",
                  fontFamily: "'Manrope', sans-serif",
                  color: "var(--text)",
                }}
              >
                Resources
              </strong>
              <a href="#" className="xm-nav-link">
                Documentation
              </a>
              <a href="#" className="xm-nav-link">
                Python SDK
              </a>
              <a href="#" className="xm-nav-link">
                API Reference
              </a>
              <a href="#" className="xm-nav-link">
                Changelog
              </a>
            </div>
          </div>
        </div>
        <div
          className="xm-container"
          style={{
            marginTop: "80px",
            paddingTop: "32px",
            borderTop: `1px solid var(--border)`,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            fontSize: "13px",
            color: "var(--text-secondary)",
          }}
        >
          <span>© 2026 ExperiML. GTU Final-year project.</span>
          <span
            className="xm-mono"
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "var(--success)",
              }}
            />
            All systems operational
          </span>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
