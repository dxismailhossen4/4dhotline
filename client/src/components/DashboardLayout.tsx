import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/useMobile";
import { House, LogOut, PanelLeft, ShieldCheck } from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from "./DashboardLayoutSkeleton";

const menuItems = [
  { icon: ShieldCheck, label: "Review queue", path: "/admin" },
  { icon: House, label: "Public website", path: "/" },
];
const SIDEBAR_WIDTH_KEY = "sidebar-width";
const DEFAULT_WIDTH = 280;
const MIN_WIDTH = 200;
const MAX_WIDTH = 440;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });
  const { loading, user } = useAuth();

  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  if (loading) return <DashboardLayoutSkeleton />;
  if (!user) return <div className="grid min-h-screen place-items-center bg-[#09090d]"><Button>Sign in to continue</Button></div>;

  return <SidebarProvider style={{ "--sidebar-width": `${sidebarWidth}px` } as CSSProperties}><DashboardLayoutContent setSidebarWidth={setSidebarWidth}>{children}</DashboardLayoutContent></SidebarProvider>;
}

function DashboardLayoutContent({ children, setSidebarWidth }: { children: React.ReactNode; setSidebarWidth: (width: number) => void }) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isResizing) return;
      const left = sidebarRef.current?.getBoundingClientRect().left ?? 0;
      const width = event.clientX - left;
      if (width >= MIN_WIDTH && width <= MAX_WIDTH) setSidebarWidth(width);
    };
    const handleMouseUp = () => setIsResizing(false);
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, setSidebarWidth]);

  return <><div className="relative" ref={sidebarRef}><Sidebar collapsible="icon" className="border-r border-white/8 bg-[#0d0d14] text-white" disableTransition={isResizing}><SidebarHeader className="h-20 justify-center"><div className="flex items-center gap-3 px-3"><button onClick={toggleSidebar} className="grid h-8 w-8 place-items-center rounded-lg text-white/55 hover:bg-white/8 hover:text-white" aria-label="Toggle navigation"><PanelLeft className="h-4 w-4" /></button>{!isCollapsed && <span className="font-[var(--font-display)] font-semibold tracking-[-0.04em]">Kimi Agent</span>}</div></SidebarHeader><SidebarContent><SidebarMenu className="px-3 py-2">{menuItems.map(item => <SidebarMenuItem key={item.path}><SidebarMenuButton isActive={location === item.path} onClick={() => setLocation(item.path)} tooltip={item.label} className="h-10 text-white/60 hover:bg-white/8 hover:text-white data-[active=true]:bg-[#7b68ff]/15 data-[active=true]:text-[#c6c0ff]"><item.icon className="h-4 w-4" /><span>{item.label}</span></SidebarMenuButton></SidebarMenuItem>)}</SidebarMenu></SidebarContent><SidebarFooter className="p-3"><DropdownMenu><DropdownMenuTrigger asChild><button className="flex w-full items-center gap-3 rounded-lg px-1 py-1 text-left hover:bg-white/8"><Avatar className="h-9 w-9 border border-white/12"><AvatarFallback className="bg-[#7b68ff]/15 text-xs text-[#c6c0ff]">{user?.name?.charAt(0).toUpperCase() ?? "A"}</AvatarFallback></Avatar>{!isCollapsed && <div className="min-w-0"><p className="truncate text-sm font-medium text-white">{user?.name ?? "Administrator"}</p><p className="mt-1 truncate text-xs text-white/40">{user?.email ?? ""}</p></div>}</button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive"><LogOut className="mr-2 h-4 w-4" />Sign out</DropdownMenuItem></DropdownMenuContent></DropdownMenu></SidebarFooter></Sidebar><div className={`absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-[#8e7eff]/40 ${isCollapsed ? "hidden" : ""}`} onMouseDown={() => !isCollapsed && setIsResizing(true)} /></div><SidebarInset className="bg-[#09090d]">{isMobile && <div className="sticky top-0 z-40 flex h-14 items-center border-b border-white/8 bg-[#09090d]/95 px-3 backdrop-blur"><SidebarTrigger className="text-white" /><span className="ml-3 text-sm text-white/80">Membership review</span></div>}<main className="flex-1">{children}</main></SidebarInset></>;
}
