import { useState } from "react";
import { Sparkles, Loader2, Copy, RotateCcw, Wand2 } from "lucide-react";
import { DASH } from "@/constants/testIds";
import { toast } from "sonner";

const PRESETS = [
  { label: "Twitter / X post", prompt: "Write a punchy Twitter post about" },
  { label: "LinkedIn opener", prompt: "Write a LinkedIn opener about" },
  { label: "Cold email", prompt: "Write a short cold email pitching" },
  { label: "Landing headline", prompt: "Write 3 landing page headlines for" },
  { label: "Newsletter intro", prompt: "Write a newsletter intro paragraph about" },
];

const MODELS = [
  { id: "gog-prose", label: "GoG Prose v1" },
  { id: "gog-snap", label: "GoG Snap (short-form)" },
  { id: "gog-narrative", label: "GoG Narrative (long-form)" },
];

export default function AIGenerator() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("gog-prose");
  const [tone, setTone] = useState("confident");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const generate = () => {
    if (!prompt.trim()) { toast.error("Add a prompt first"); return; }
    setLoading(true);
    setOutput("");
    // mock generation — will be replaced with real LLM
    const seed = `${prompt.trim()}`;
    setTimeout(() => {
      const mock = sample(seed, tone, model);
      setOutput(mock);
      setLoading(false);
    }, 1200);
  };

  const reset = () => { setPrompt(""); setOutput(""); };
  const copy = async () => { try { await navigator.clipboard.writeText(output); toast.success("Copied"); } catch (e) {} };

  return (
    <div className="grid lg:grid-cols-12 gap-5">
      <div className="lg:col-span-5 space-y-4">
        <div className="dash-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
            <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">Prompt studio</p>
          </div>
          <h2 className="font-display text-3xl text-[var(--ink)]">Compose with your brand voice.</h2>
          <p className="text-[var(--muted)] text-sm mt-2">Mock generator for now — hooked up to a real LLM in the next iteration.</p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="grid gap-1">
              <label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Model</label>
              <select className="dash-input" value={model} onChange={(e) => setModel(e.target.value)}>
                {MODELS.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
              </select>
            </div>
            <div className="grid gap-1">
              <label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Tone</label>
              <select className="dash-input" value={tone} onChange={(e) => setTone(e.target.value)}>
                <option value="confident">Confident</option>
                <option value="playful">Playful</option>
                <option value="editorial">Editorial</option>
                <option value="sharp">Sharp</option>
              </select>
            </div>
          </div>

          <div className="mt-3 grid gap-1">
            <label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Prompt</label>
            <textarea data-testid={DASH.aiPrompt} rows={7} className="dash-input" placeholder="e.g. Write a punchy intro for a brand strategy newsletter…" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          </div>

          <div className="mt-3 flex gap-2">
            <button data-testid={DASH.aiGenerate} onClick={generate} disabled={loading} className="dash-btn inline-flex items-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating</> : <><Wand2 className="w-4 h-4" /> Generate</>}
            </button>
            <button onClick={reset} className="dash-btn-ghost inline-flex items-center gap-1.5"><RotateCcw className="w-3.5 h-3.5" /> Reset</button>
          </div>
        </div>

        <div className="dash-card p-5">
          <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">Presets</p>
          <div className="mt-3 grid grid-cols-1 gap-2">
            {PRESETS.map((p) => (
              <button key={p.label} onClick={() => setPrompt(p.prompt + " ")} className="text-left rounded-lg border border-[var(--line)] px-3 py-2 hover:bg-[var(--paper-2)]">
                <p className="text-[var(--ink)] text-sm">{p.label}</p>
                <p className="text-[var(--muted)] text-xs mt-0.5">{p.prompt}…</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-7">
        <div className="dash-card p-5 min-h-[600px] relative">
          <div className="flex items-center justify-between mb-4">
            <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">Output</p>
            <div className="flex gap-2">
              <button onClick={copy} disabled={!output} className="dash-btn-ghost inline-flex items-center gap-1.5 disabled:opacity-40"><Copy className="w-3.5 h-3.5" /> Copy</button>
            </div>
          </div>
          <div data-testid={DASH.aiOutput} className="prose max-w-none whitespace-pre-wrap text-[var(--ink-2)] leading-relaxed font-sans text-[15px] min-h-[400px]">
            {loading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-3 bg-[var(--paper-3)] rounded w-2/3" />
                <div className="h-3 bg-[var(--paper-3)] rounded w-5/6" />
                <div className="h-3 bg-[var(--paper-3)] rounded w-1/2" />
                <div className="h-3 bg-[var(--paper-3)] rounded w-3/4" />
                <div className="h-3 bg-[var(--paper-3)] rounded w-2/3" />
              </div>
            ) : output ? output : (
              <div className="flex flex-col items-center justify-center text-center h-full text-[var(--muted)] mt-20">
                <Sparkles className="w-10 h-10 mb-3 text-[var(--muted)]" />
                <p className="font-display italic text-3xl text-[var(--ink-2)]">Your generated copy will appear here.</p>
                <p className="text-sm mt-2 max-w-sm">Pick a preset on the left or type a prompt to begin.</p>
              </div>
            )}
          </div>
          <p className="font-mono text-[10px] text-[var(--muted)] tracking-widest mt-5">MOCK MODE — LLM INTEGRATION COMING IN PHASE 4</p>
        </div>
      </div>
    </div>
  );
}

function sample(seed, tone, model) {
  const toneMap = {
    confident: "There's a quiet kind of confidence in work that just works.",
    playful: "Look, we'll just say it — most agencies are vibes-coding their way through your brief.",
    editorial: "In a market saturated with mediocrity, restraint is the new statement.",
    sharp: "Stop overthinking. Ship the thing. Then ship the next one.",
  };
  const intro = toneMap[tone] || toneMap.confident;
  return `${intro}\n\nTopic: ${seed}\n\nHere's a draft (mock):\n\n—\n\n1.  The hook — a line that interrupts the scroll.\n2.  The promise — the outcome they actually care about.\n3.  The proof — a number, a name, or a screenshot.\n4.  The call — one specific action, no fluff.\n\n—\n\nModel: ${model} • Tone: ${tone}\n\nThis is a placeholder generation. Connect a real LLM (OpenAI / Anthropic / Gemini) to make this live — the wiring is already in lib/api.js.`;
}
