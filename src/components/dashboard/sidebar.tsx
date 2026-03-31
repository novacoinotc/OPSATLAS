"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  LogOut,
  Shield,
  ChevronRight,
  Menu,
  X,
  Wallet,
  ChevronDown,
} from "lucide-react";
import { cn, getCompanyFromClabe } from "@/lib/utils";
import { useState, Suspense } from "react";

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role: string;
  };
}

const GAMINGO_CLABES = [
  "684180327012000020",
  "684180327012000033",
  "684180327012000046",
  "684180327012000059",
  "684180327012000062",
  "684180327012000075",
  "684180327012000088",
  "684180327012000091",
  "684180327012000101",
  "684180327012000114",
];

const OASAT_CLABES = [
  "684180327011000021",
  "684180327011000034",
  "684180327011000047",
  "684180327011000050",
  "684180327011000063",
  "684180327011000076",
  "684180327011000089",
  "684180327011000092",
  "684180327011000102",
  "684180327011000115",
];

function SidebarContent({ user }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [clabesOpen, setClabesOpen] = useState(false);

  const currentClabe = searchParams.get("clabe");

  const content = (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent-blue flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg bg-gradient-to-r from-accent-light to-accent-blue-light bg-clip-text text-transparent">
              OPSATLAS
            </h1>
            <p className="text-[10px] text-muted uppercase tracking-widest">
              Payment Monitor
            </p>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto lg:hidden p-2 rounded-xl hover:bg-accent/10 text-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {/* Dashboard */}
        <Link
          href="/dashboard"
          onClick={() => setMobileOpen(false)}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
            pathname === "/dashboard" && !currentClabe
              ? "bg-accent/10 text-accent-light border border-accent/20"
              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
          )}
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
          {pathname === "/dashboard" && !currentClabe && (
            <ChevronRight className="w-3 h-3 ml-auto" />
          )}
        </Link>

        {/* Cuentas CLABE */}
        <button
          onClick={() => setClabesOpen(!clabesOpen)}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 w-full",
            currentClabe
              ? "bg-accent/10 text-accent-light border border-accent/20"
              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
          )}
        >
          <Wallet className="w-4 h-4" />
          Cuentas CLABE
          <ChevronDown
            className={cn(
              "w-3 h-3 ml-auto transition-transform",
              clabesOpen && "rotate-180"
            )}
          />
        </button>

        {clabesOpen && (
          <div className="ml-2 space-y-0.5 fade-in">
            {/* Gamingo */}
            <p className="px-4 py-1.5 text-[10px] font-semibold text-accent-light uppercase tracking-wider">
              Gamingo
            </p>
            {GAMINGO_CLABES.map((clabe) => (
              <Link
                key={clabe}
                href={`/dashboard?clabe=${clabe}`}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-mono transition-all",
                  currentClabe === clabe
                    ? "bg-accent/10 text-accent-light"
                    : "text-muted hover:text-muted-foreground hover:bg-white/5"
                )}
              >
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full shrink-0",
                  currentClabe === clabe ? "bg-accent-light" : "bg-muted/50"
                )} />
                ...{clabe.slice(-6)}
              </Link>
            ))}

            {/* Oasat */}
            <p className="px-4 py-1.5 text-[10px] font-semibold text-accent-blue-light uppercase tracking-wider mt-2">
              Oasat
            </p>
            {OASAT_CLABES.map((clabe) => (
              <Link
                key={clabe}
                href={`/dashboard?clabe=${clabe}`}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-mono transition-all",
                  currentClabe === clabe
                    ? "bg-accent-blue/10 text-accent-blue-light"
                    : "text-muted hover:text-muted-foreground hover:bg-white/5"
                )}
              >
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full shrink-0",
                  currentClabe === clabe ? "bg-accent-blue-light" : "bg-muted/50"
                )} />
                ...{clabe.slice(-6)}
              </Link>
            ))}
          </div>
        )}

        {/* Usuarios */}
        {user.role === "ADMIN" && (
          <Link
            href="/users"
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
              pathname === "/users"
                ? "bg-accent/10 text-accent-light border border-accent/20"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            )}
          >
            <Users className="w-4 h-4" />
            Usuarios
            {pathname === "/users" && (
              <ChevronRight className="w-3 h-3 ml-auto" />
            )}
          </Link>
        )}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent/20 to-accent-blue/20 flex items-center justify-center text-accent-light text-xs font-bold shrink-0">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-[11px] text-muted truncate">{user.email}</p>
          </div>
          <span
            className={cn(
              "text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0",
              user.role === "ADMIN"
                ? "bg-accent/15 text-accent-light"
                : "bg-accent-blue/15 text-accent-blue-light"
            )}
          >
            {user.role}
          </span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-danger hover:bg-danger/5 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2.5 rounded-xl glass border border-border"
      >
        <Menu className="w-5 h-5 text-foreground" />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-72 glass-strong border-r border-border flex flex-col z-50 lg:hidden transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {content}
      </aside>

      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 glass-strong border-r border-border flex-col z-50">
        {content}
      </aside>
    </>
  );
}

export function Sidebar({ user }: SidebarProps) {
  return (
    <Suspense>
      <SidebarContent user={user} />
    </Suspense>
  );
}
