import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  CircleCheck,
  Code2,
  Fingerprint,
  KeyRound,
  Loader2,
  LockKeyhole,
  Sparkles,
  TerminalSquare,
} from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

type Modal = "apply" | "activate" | null;

const steps = [
  {
    number: "01",
    icon: TerminalSquare,
    title: "Plan the work",
    text: "Turn an ambiguous goal into an auditable execution plan with deliberate checkpoints.",
  },
  {
    number: "02",
    icon: Code2,
    title: "Build with context",
    text: "Keep research, source files, and implementation decisions close to the work they inform.",
  },
  {
    number: "03",
    icon: Fingerprint,
    title: "Ship with confidence",
    text: "Make reviewable changes, verify key paths, and leave a clear record for the next iteration.",
  },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();
  const [modal, setModal] = useState<Modal>(null);
  const [applicationId, setApplicationId] = useState<number | null>(null);
  const [applicationForm, setApplicationForm] = useState({ name: "", email: "", phone: "" });
  const [activationForm, setActivationForm] = useState({ id: "", code: "" });

  const utils = trpc.useUtils();
  const membership = trpc.membership.mine.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchOnWindowFocus: false,
  });
  const applyMutation = trpc.membership.submitRequest.useMutation({
    onSuccess: result => {
      setApplicationId(result.applicationId ?? null);
      setActivationForm(current => ({ ...current, id: String(result.applicationId ?? "") }));
      toast.success("Your application has been submitted.");
    },
    onError: error => toast.error(error.message),
  });
  const activateMutation = trpc.membership.activate.useMutation({
    onSuccess: () => {
      toast.success("Membership is active. Welcome to the workspace.");
      setModal(null);
      utils.membership.mine.invalidate();
    },
    onError: error => toast.error(error.message),
  });

  const submitApplication = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    applyMutation.mutate(applicationForm);
  };

  const submitActivation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    activateMutation.mutate({ id: Number(activationForm.id), code: activationForm.code });
  };

  const statusLabel = membership.data?.status
    ? membership.data.status.charAt(0).toUpperCase() + membership.data.status.slice(1)
    : "No application";

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#07070b] text-[#f8f7f3] selection:bg-[#7864ff] selection:text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_82%_8%,rgba(117,94,255,0.22),transparent_24%),radial-gradient(circle_at_12%_48%,rgba(66,190,196,0.08),transparent_26%)]" />
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-10 md:py-7">
        <button className="brand-mark" onClick={() => scrollTo("top")} aria-label="Back to the top">
          <span className="brand-orb">K</span>
          <span>Kimi Agent</span>
        </button>
        <nav className="hidden items-center gap-7 text-sm text-white/62 md:flex" aria-label="Primary navigation">
          <button className="nav-link" onClick={() => scrollTo("workflow")}>Workflow</button>
          <button className="nav-link" onClick={() => scrollTo("membership")}>Membership</button>
          <button className="nav-link" onClick={() => scrollTo("access")}>Access</button>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-white/50" aria-label="Checking sign-in status" />
          ) : isAuthenticated ? (
            <>
              {user?.role === "admin" && (
                <Button variant="ghost" onClick={() => navigate("/admin")} className="hidden text-white/70 hover:bg-white/8 hover:text-white sm:inline-flex">
                  Review queue
                </Button>
              )}
              <Button variant="ghost" onClick={logout} className="hidden text-white/70 hover:bg-white/8 hover:text-white sm:inline-flex">
                Sign out
              </Button>
              <button className="user-chip" onClick={() => scrollTo("access")}>
                <span>{user?.name?.slice(0, 1).toUpperCase() ?? "M"}</span>
                <span className="hidden max-w-24 truncate sm:inline">{user?.name ?? "Member"}</span>
              </button>
            </>
          ) : (
            <Button variant="ghost" onClick={startLogin} className="text-white/70 hover:bg-white/8 hover:text-white">Sign in</Button>
          )}
          <Button onClick={() => setModal("apply")} className="rounded-full bg-[#7b68ff] px-4 text-white shadow-[0_12px_30px_rgba(119,98,255,0.25)] hover:bg-[#8c7bff] sm:px-5">
            Apply <ArrowUpRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </header>

      <main id="top" className="relative z-10">
        <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-24 pt-16 md:grid-cols-[1.25fr_0.75fr] md:px-10 md:pb-32 md:pt-24">
          <div className="max-w-4xl">
            <div className="eyebrow"><Sparkles className="h-3.5 w-3.5" /> BUILT FOR SERIOUS KNOWLEDGE WORK</div>
            <h1 className="mt-6 max-w-4xl font-[var(--font-display)] text-5xl font-semibold leading-[0.95] tracking-[-0.065em] text-white sm:text-6xl md:text-8xl">
              Move from intent <span className="text-[#8e7eff]">to impact.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-white/58 md:text-lg">
              A calm, capable environment for agentic coding and knowledge work. Start with the work that matters, then make every decision traceable.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button onClick={() => setModal("apply")} size="lg" className="rounded-full bg-white px-6 text-[#15131c] hover:bg-[#ece9ff]">
                Request membership <ArrowUpRight className="ml-1.5 h-4 w-4" />
              </Button>
              <Button onClick={() => scrollTo("workflow")} size="lg" variant="outline" className="rounded-full border-white/15 bg-white/[0.03] px-6 text-white hover:bg-white/10 hover:text-white">
                Explore the workflow <ArrowDownRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-xs font-medium text-white/40">
              <span className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#8e7eff]" /> Deliberate execution</span>
              <span className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#8e7eff]" /> Secure review</span>
              <span className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#8e7eff]" /> Human-controlled access</span>
            </div>
          </div>
          <div className="relative min-h-[370px] self-end">
            <div className="hero-orbit hero-orbit-one" />
            <div className="hero-orbit hero-orbit-two" />
            <div className="relative mt-5 overflow-hidden rounded-[2rem] border border-white/10 bg-[#101018]/85 p-4 shadow-[0_30px_90px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-5">
              <div className="flex items-center justify-between border-b border-white/8 pb-4 text-[11px] font-medium tracking-[0.12em] text-white/40">
                <span>WORKSPACE / 03</span><span className="rounded-full bg-[#84eacb]/15 px-2 py-1 text-[#84eacb]">READY</span>
              </div>
              <div className="space-y-4 py-5">
                <div className="rounded-2xl bg-white/[0.05] p-4">
                  <div className="flex items-center gap-2 text-xs text-white/45"><span className="h-2 w-2 rounded-full bg-[#8e7eff]" /> RESEARCH THREAD</div>
                  <p className="mt-3 text-sm leading-6 text-white/85">Map the operating model, identify the leverage points, and turn the decision into work.</p>
                </div>
                <div className="flex gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#7b68ff] text-xs font-bold">K</span>
                  <div className="min-w-0 flex-1 rounded-2xl rounded-tl-sm bg-[#201e31] px-4 py-3 text-sm leading-6 text-white/72">I drafted the implementation path and kept the sources attached to each choice.</div>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-white/9 bg-black/20 px-3 py-3 text-xs text-white/36"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#84eacb]" /> Agent is ready for the next instruction</div>
              </div>
            </div>
          </div>
        </section>

        <section id="workflow" className="border-y border-white/8 bg-white/[0.018]">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
            <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
              <div>
                <p className="eyebrow">THE OPERATING RHYTHM</p>
                <h2 className="mt-5 max-w-2xl font-[var(--font-display)] text-4xl font-semibold leading-[0.98] tracking-[-0.055em] text-white md:text-6xl">The room between a thought and a shipped result.</h2>
              </div>
              <p className="max-w-xs text-sm leading-6 text-white/48">Designed for people who want the agent to accelerate judgment, not replace it.</p>
            </div>
            <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-white/9 bg-white/9 md:grid-cols-3">
              {steps.map(({ number, icon: Icon, title, text }) => (
                <article className="group bg-[#0b0b12] p-7 transition-colors hover:bg-[#10101a] md:p-8" key={number}>
                  <div className="flex items-center justify-between"><span className="text-xs font-medium tracking-[0.16em] text-[#8e7eff]">{number}</span><Icon className="h-5 w-5 text-white/38 transition-transform duration-200 group-hover:-translate-y-1 group-hover:text-white" /></div>
                  <h3 className="mt-20 font-[var(--font-display)] text-2xl font-semibold tracking-[-0.045em] text-white">{title}</h3>
                  <p className="mt-3 max-w-xs text-sm leading-6 text-white/48">{text}</p>
                  <button className="mt-7 flex items-center gap-1 text-xs font-semibold text-white/68 transition-colors hover:text-[#a69aff]" onClick={() => setModal("apply")}>Start here <ArrowUpRight className="h-3.5 w-3.5" /></button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="membership" className="mx-auto grid max-w-7xl gap-10 px-5 py-24 md:grid-cols-[0.85fr_1.15fr] md:px-10 md:py-32">
          <div>
            <p className="eyebrow">MEMBERSHIP</p>
            <h2 className="mt-5 font-[var(--font-display)] text-4xl font-semibold leading-[0.98] tracking-[-0.055em] text-white md:text-6xl">A quieter kind of access.</h2>
            <p className="mt-6 max-w-sm text-sm leading-7 text-white/52">Membership starts with a short request and a human review. When approved, you receive a one-time activation code to complete access.</p>
          </div>
          <div className="membership-panel">
            <div className="flex items-start justify-between gap-6 border-b border-white/9 pb-6">
              <div><p className="text-xs font-medium tracking-[0.14em] text-[#a398ff]">EARLY ACCESS</p><h3 className="mt-3 font-[var(--font-display)] text-3xl font-semibold tracking-[-0.045em] text-white">Membership workspace</h3></div>
              <LockKeyhole className="h-5 w-5 text-white/42" />
            </div>
            <div className="grid gap-4 py-7 sm:grid-cols-2">
              <p className="feature-line"><CircleCheck className="h-4 w-4" /> Structured requests and plans</p>
              <p className="feature-line"><CircleCheck className="h-4 w-4" /> Research-aware execution</p>
              <p className="feature-line"><CircleCheck className="h-4 w-4" /> Membership status tracking</p>
              <p className="feature-line"><CircleCheck className="h-4 w-4" /> Administrator review queue</p>
            </div>
            <div className="flex flex-col gap-4 border-t border-white/9 pt-6 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm leading-6 text-white/48">Apply when you are ready to bring a meaningful project.</p><Button onClick={() => setModal("apply")} className="rounded-full bg-[#7b68ff] text-white hover:bg-[#8c7bff]">Request access <ArrowUpRight className="ml-1 h-4 w-4" /></Button></div>
          </div>
        </section>

        <section id="access" className="border-t border-white/8 bg-[#0b0b11]">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-5 py-16 md:flex-row md:items-center md:px-10 md:py-20">
            <div><p className="eyebrow">YOUR ACCESS</p><h2 className="mt-4 font-[var(--font-display)] text-3xl font-semibold tracking-[-0.045em] text-white">{isAuthenticated ? `Hello, ${user?.name ?? "member"}.` : "Bring your identity when you are ready."}</h2><p className="mt-3 max-w-lg text-sm leading-6 text-white/48">{isAuthenticated ? "Your account is signed in. Membership applications are matched to the email on your account." : "Sign in after approval to see the application associated with your membership email."}</p></div>
            <div className="min-w-full rounded-2xl border border-white/9 bg-white/[0.025] p-5 sm:min-w-[350px] md:max-w-sm">
              <div className="flex items-center justify-between"><span className="text-xs font-medium tracking-[0.14em] text-white/42">MEMBERSHIP STATUS</span><KeyRound className="h-4 w-4 text-[#a398ff]" /></div>
              <div className="mt-4 flex items-end justify-between"><strong className="font-[var(--font-display)] text-2xl font-semibold tracking-[-0.04em] text-white">{membership.isLoading ? "Checking…" : statusLabel}</strong>{membership.data?.id && <span className="text-xs text-white/38">Application #{membership.data.id}</span>}</div>
              <div className="mt-5 flex gap-2">
                {!isAuthenticated ? <Button onClick={startLogin} className="flex-1 rounded-full bg-white text-[#15131c] hover:bg-[#ece9ff]">Sign in</Button> : membership.data?.status === "approved" ? <Button onClick={() => { setActivationForm(current => ({ ...current, id: String(membership.data?.id ?? "") })); setModal("activate"); }} className="flex-1 rounded-full bg-[#7b68ff] text-white hover:bg-[#8c7bff]">Activate membership</Button> : <Button onClick={() => setModal("activate")} variant="outline" className="flex-1 rounded-full border-white/15 bg-transparent text-white hover:bg-white/8 hover:text-white">Enter activation code</Button>}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 text-xs text-white/34 md:flex-row md:items-center md:justify-between md:px-10"><span>© {new Date().getFullYear()} Kimi Agent Membership</span><span>Built for thoughtful work, reviewed by people.</span></footer>

      <Dialog open={modal === "apply"} onOpenChange={open => !open && setModal(null)}>
        <DialogContent className="border-white/10 bg-[#11111a] text-white sm:max-w-md">
          <DialogHeader><DialogTitle className="font-[var(--font-display)] text-3xl tracking-[-0.04em]">Request membership</DialogTitle><DialogDescription className="leading-6 text-white/48">Tell us where to associate your access request. Applications remain pending until an administrator approves them.</DialogDescription></DialogHeader>
          {applicationId ? <div className="mt-4 rounded-2xl border border-[#8e7eff]/30 bg-[#8e7eff]/10 p-5"><p className="text-xs font-medium tracking-[0.14em] text-[#b9b1ff]">APPLICATION RECEIVED</p><p className="mt-2 font-[var(--font-display)] text-3xl font-semibold text-white">#{applicationId}</p><p className="mt-3 text-sm leading-6 text-white/58">Save this number. Once approved, enter it with the six-digit activation code provided by your administrator.</p><Button className="mt-5 rounded-full bg-white text-[#16141f] hover:bg-[#ece9ff]" onClick={() => setModal("activate")}>I have a code</Button></div> : <form className="mt-3 space-y-4" onSubmit={submitApplication}><div className="space-y-2"><Label htmlFor="name">Full name</Label><Input id="name" required value={applicationForm.name} onChange={event => setApplicationForm({ ...applicationForm, name: event.target.value })} className="border-white/12 bg-white/[0.04] text-white placeholder:text-white/25" placeholder="Your name" /></div><div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" required value={applicationForm.email} onChange={event => setApplicationForm({ ...applicationForm, email: event.target.value })} className="border-white/12 bg-white/[0.04] text-white placeholder:text-white/25" placeholder="you@example.com" /></div><div className="space-y-2"><Label htmlFor="phone">Phone</Label><Input id="phone" required value={applicationForm.phone} onChange={event => setApplicationForm({ ...applicationForm, phone: event.target.value })} className="border-white/12 bg-white/[0.04] text-white placeholder:text-white/25" placeholder="+1 555 000 0000" /></div><Button disabled={applyMutation.isPending} type="submit" className="mt-2 w-full rounded-full bg-[#7b68ff] text-white hover:bg-[#8c7bff]">{applyMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Submit request</Button></form>}
        </DialogContent>
      </Dialog>

      <Dialog open={modal === "activate"} onOpenChange={open => !open && setModal(null)}>
        <DialogContent className="border-white/10 bg-[#11111a] text-white sm:max-w-md"><DialogHeader><DialogTitle className="font-[var(--font-display)] text-3xl tracking-[-0.04em]">Activate access</DialogTitle><DialogDescription className="leading-6 text-white/48">Enter the application number and the six-digit code supplied after approval.</DialogDescription></DialogHeader><form className="mt-3 space-y-4" onSubmit={submitActivation}><div className="space-y-2"><Label htmlFor="application-id">Application number</Label><Input id="application-id" type="number" min="1" required value={activationForm.id} onChange={event => setActivationForm({ ...activationForm, id: event.target.value })} className="border-white/12 bg-white/[0.04] text-white" placeholder="123" /></div><div className="space-y-2"><Label htmlFor="code">Activation code</Label><Input id="code" inputMode="numeric" maxLength={6} required value={activationForm.code} onChange={event => setActivationForm({ ...activationForm, code: event.target.value.replace(/\D/g, "") })} className="border-white/12 bg-white/[0.04] text-white tracking-[0.32em]" placeholder="000000" /></div><Button disabled={activateMutation.isPending} type="submit" className="mt-2 w-full rounded-full bg-[#7b68ff] text-white hover:bg-[#8c7bff]">{activateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Activate membership</Button></form></DialogContent>
      </Dialog>
    </div>
  );
}
