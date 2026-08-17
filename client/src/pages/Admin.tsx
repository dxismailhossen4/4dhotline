import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { Check, Clipboard, Clock3, Loader2, ShieldCheck, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

function statusTone(status: "pending" | "approved" | "active") {
  if (status === "active") return "border-emerald-300/20 bg-emerald-300/10 text-emerald-200";
  if (status === "approved") return "border-violet-300/20 bg-violet-300/10 text-violet-100";
  return "border-amber-200/15 bg-amber-100/8 text-amber-100";
}

export default function Admin() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [issuedCodes, setIssuedCodes] = useState<Record<number, string>>({});
  const utils = trpc.useUtils();
  const applications = trpc.admin.applications.useQuery(undefined, {
    enabled: Boolean(user?.role === "admin"),
    refetchOnWindowFocus: false,
  });
  const approveMutation = trpc.admin.approve.useMutation({
    onSuccess: result => {
      setIssuedCodes(current => ({ ...current, [result.id]: result.code }));
      utils.admin.applications.invalidate();
      toast.success("Application approved. Share the activation code securely.");
    },
    onError: error => toast.error(error.message),
  });

  if (loading) return <div className="grid min-h-screen place-items-center bg-[#09090d] text-white/50"><Loader2 className="h-5 w-5 animate-spin" /></div>;
  if (!isAuthenticated) {
    return <main className="grid min-h-screen place-items-center bg-[#09090d] px-5 text-center text-white"><div className="max-w-md"><ShieldCheck className="mx-auto h-9 w-9 text-[#9d92ff]" /><h1 className="mt-5 font-[var(--font-display)] text-4xl font-semibold tracking-[-0.05em]">Administrator sign-in required</h1><p className="mt-4 text-sm leading-6 text-white/48">Sign in with the membership administrator account to review applications.</p><Button onClick={startLogin} className="mt-7 rounded-full bg-white text-[#191722] hover:bg-[#ece9ff]">Sign in</Button></div></main>;
  }
  if (user?.role !== "admin") {
    return <main className="grid min-h-screen place-items-center bg-[#09090d] px-5 text-center text-white"><div className="max-w-md"><ShieldCheck className="mx-auto h-9 w-9 text-[#ffcc7d]" /><h1 className="mt-5 font-[var(--font-display)] text-4xl font-semibold tracking-[-0.05em]">This page is restricted</h1><p className="mt-4 text-sm leading-6 text-white/48">Your signed-in account does not have administrator privileges.</p><Button onClick={() => navigate("/")} className="mt-7 rounded-full bg-white text-[#191722] hover:bg-[#ece9ff]">Return home</Button></div></main>;
  }

  const pendingCount = applications.data?.filter(application => application.status === "pending").length ?? 0;

  return <DashboardLayout><div className="min-h-[calc(100vh-2rem)] bg-[#09090d] px-1 py-5 text-white sm:px-5 sm:py-8"><div className="mx-auto max-w-6xl"><div className="flex flex-col justify-between gap-7 border-b border-white/8 pb-8 md:flex-row md:items-end"><div><p className="eyebrow"><ShieldCheck className="h-3.5 w-3.5" /> ADMINISTRATOR CONSOLE</p><h1 className="mt-4 font-[var(--font-display)] text-4xl font-semibold tracking-[-0.055em] md:text-6xl">Membership review queue</h1><p className="mt-4 max-w-xl text-sm leading-6 text-white/48">Approve a request to generate a one-time activation code. The code appears once here; share it only through your trusted channel.</p></div><div className="rounded-2xl border border-white/9 bg-white/[0.025] px-5 py-4"><p className="text-xs tracking-[0.14em] text-white/40">PENDING REVIEW</p><strong className="mt-1 block font-[var(--font-display)] text-3xl tracking-[-0.04em] text-[#a69aff]">{pendingCount}</strong></div></div>
      <div className="mt-8 overflow-hidden rounded-3xl border border-white/9 bg-[#0d0d14]"><div className="grid grid-cols-[1.35fr_0.9fr_auto] gap-4 border-b border-white/8 px-5 py-4 text-[10px] font-medium tracking-[0.14em] text-white/35 md:px-7"><span>APPLICANT</span><span>STATUS</span><span className="text-right">ACTION</span></div>{applications.isLoading ? <div className="flex items-center justify-center gap-3 px-6 py-16 text-sm text-white/45"><Loader2 className="h-4 w-4 animate-spin" /> Loading applications</div> : applications.data?.length ? applications.data.map(application => <div className="grid grid-cols-[1.35fr_0.9fr_auto] gap-4 border-b border-white/8 px-5 py-5 last:border-0 md:px-7" key={application.id}><div className="min-w-0"><p className="truncate font-medium text-white">{application.name}</p><p className="mt-1 truncate text-xs text-white/45">{application.email}</p><p className="mt-1 text-xs text-white/30">{application.phone} · #{application.id}</p></div><div className="flex items-start"><Badge className={`border px-2.5 py-1 text-[10px] font-medium capitalize ${statusTone(application.status)}`}>{application.status === "pending" && <Clock3 className="mr-1 h-3 w-3" />}{application.status === "active" && <Check className="mr-1 h-3 w-3" />}{application.status}</Badge></div><div className="flex flex-col items-end gap-2">{application.status === "pending" ? <Button size="sm" disabled={approveMutation.isPending} onClick={() => approveMutation.mutate({ id: application.id })} className="rounded-full bg-[#7b68ff] px-3 text-xs text-white hover:bg-[#8c7bff]">Approve</Button> : issuedCodes[application.id] ? <div className="flex items-center gap-2"><code className="rounded-lg bg-black/30 px-2 py-1.5 text-xs tracking-[0.16em] text-[#c7c1ff]">{issuedCodes[application.id]}</code><Button size="icon" variant="ghost" className="h-7 w-7 text-white/55 hover:bg-white/8 hover:text-white" aria-label="Copy activation code" onClick={() => { navigator.clipboard.writeText(issuedCodes[application.id]); toast.success("Activation code copied."); }}><Clipboard className="h-3.5 w-3.5" /></Button></div> : <span className="text-xs text-white/35">{application.status === "active" ? "Activated" : "Code issued"}</span>}</div></div>) : <div className="px-6 py-16 text-center"><Users className="mx-auto h-5 w-5 text-white/25" /><p className="mt-4 text-sm text-white/45">No membership requests yet.</p></div>}</div></div></div></DashboardLayout>;
}
