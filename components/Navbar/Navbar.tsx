"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bell, Camera, LogOut, Menu, Search, UserRound, X } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useStudentAuth } from "@/components/auth/StudentAuthProvider";
import { backendFetch } from "@/lib/backend";

export default function Navbar() {
  const { user, loading, logout, refresh } = useStudentAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isHidden, setIsHidden] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Array<{ id: string; message: string; read: boolean; createdAt: string }>>([]);
  const avatarInput = useRef<HTMLInputElement>(null);

  // Hook into Framer Motion's global scroll values
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;

    // Hide navbar if scrolling down AND past threshold
    if (latest > previous && latest > 80) {
      setIsHidden(true);
      setIsSearchOpen(false); // Clean up search bar state when scrolling away
      setIsMenuOpen(false);   // Close mobile menu when scrolling away
    } else {
      setIsHidden(false);
    }
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const el = document.getElementById("publications");
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  const skipHomePreloader = () => {
    sessionStorage.setItem("skip-home-preloader", "true");
  };

  useEffect(() => {
    if (!user || user.role !== "student") {
      queueMicrotask(() => setNotifications([]));
      return;
    }
    backendFetch("notifications", { cache: "no-store" })
      .then((response) => response.json())
      .then((body) => setNotifications(body.notifications ?? []))
      .catch(() => setNotifications([]));
  }, [user]);

  async function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await backendFetch("profile/avatar", { method: "POST", body: formData });
    if (response.ok) await refresh();
    event.target.value = "";
  }

  async function openNotifications() {
    setIsNotificationsOpen((open) => !open);
    setIsAccountOpen(false);
    if (notifications.some((notification) => !notification.read)) {
      await backendFetch("notifications", { method: "PATCH" });
      setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
    }
  }

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={isHidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
      className="fixed top-0 left-0 right-0 z-40 w-full py-5 pointer-events-none backdrop-blur-sm"
    >
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-12 flex items-center justify-between w-full relative">

        {/* 1. LEFT SIDE: BRAND LOGO */}
        <Link
          href="/#top"
          onClick={skipHomePreloader}
          className="flex items-center gap-3 pointer-events-auto transition-transform duration-200 hover:scale-[1.02] z-10"
        >
          <Image
            src="/SHOE.png"
            alt="Lyceum-Northwestern University seal"
            width={56}
            height={56}
            className="h-14 w-14 sm:h-16 sm:w-16 object-contain"
          />
          <div className="flex flex-col justify-center leading-none">
            <span className="font-[family-name:var(--font-fraunces)] text-sm tracking-[0.2em] font-semibold text-[#922842]">
              LNU
            </span>
            <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.25em] font-medium text-[#010100] mt-1">
              ARCHIVES
            </span>
          </div>
        </Link>

        {/* 2. MIDDLE: CENTERED NAV LINKS (Desktop) */}
        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-auto hidden md:block z-10">
          <AnimatePresence mode="wait">
            {!isSearchOpen && (
              <motion.nav
                key="nav-links"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1 bg-[#E3E1E0]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#010100]/5 shadow-sm"
              >
                <Link
                  href="/#about"
                  onClick={skipHomePreloader}
                  className="px-4 py-2 text-[11px] font-[family-name:var(--font-mono)] uppercase tracking-widest text-[#6B6B6B] hover:text-[#791B37] transition-colors rounded-lg"
                >
                  About
                </Link>
                <Link
                  href="/Publications"
                  onClick={skipHomePreloader}
                  className="px-4 py-2 text-[11px] font-[family-name:var(--font-mono)] uppercase tracking-widest text-[#6B6B6B] hover:text-[#791B37] transition-colors rounded-lg"
                >
                  Publications
                </Link>
                <Link
                  href="/Programs"
                  className="px-4 py-2 text-[11px] font-[family-name:var(--font-mono)] uppercase tracking-widest text-[#6B6B6B] hover:text-[#791B37] transition-colors rounded-lg"
                >
                  Programs
                </Link>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>

        {/* 3. RIGHT SIDE: SEARCH BAR + CONTROLS */}
        <div className="flex items-center gap-5 pointer-events-auto h-12 z-20">

          {/* Expanded Search Input Field */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.form
                key="search-form"
                onSubmit={handleSearchSubmit}
                initial={{ opacity: 0, scale: 0.95, width: 120 }}
                animate={{ opacity: 1, scale: 1, width: typeof window !== "undefined" && window.innerWidth < 640 ? 220 : 360 }}
                exit={{ opacity: 0, scale: 0.95, width: 120 }}
                transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                className="flex items-center gap-2 rounded-xl border border-[#922842] bg-white px-3 py-1.5 shadow-md h-11"
              >
                <Search size={16} className="text-[#6B6B6B] flex-shrink-0" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search title, author..."
                  className="w-full bg-transparent text-sm outline-none text-[#010100] placeholder:text-[#8f8f8f]"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="p-1 text-[#6B6B6B] hover:text-[#010100] flex-shrink-0"
                  >
                    <X size={14} />
                  </button>
                )}

                <button
                  type="submit"
                  className="rounded-lg bg-[#922842] px-3 py-1.5 text-[11px] font-[family-name:var(--font-mono)] uppercase tracking-wider text-white hover:bg-[#791B37] transition-colors flex-shrink-0"
                >
                  Search
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Search Toggle Button */}
          <button
            type="button"
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              if (isMenuOpen) setIsMenuOpen(false);
            }}
            className={`rounded-xl p-2.5 shadow-sm transition-all flex items-center justify-center border h-11 w-11 flex-shrink-0 ${
              isSearchOpen
                ? "bg-white text-[#6B6B6B] border-[#010100]/10 hover:text-[#010100]"
                : "bg-[#922842] text-white border-transparent hover:bg-[#791B37]"
            }`}
            title={isSearchOpen ? "Close Search" : "Open Search"}
          >
            {isSearchOpen ? <X size={16} strokeWidth={2.5} /> : <Search size={16} strokeWidth={2.5} />}
          </button>

          {!loading && user && (
            // Bell + profile pic are grouped with a tight gap-2, so they read
            // as one "account cluster" — while the outer row's gap-5 keeps a
            // normal distance between that cluster and the search button.
            <div className="flex items-center gap-2">
              {user.role === "student" && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={openNotifications}
                    aria-label="Notifications"
                    className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#010100]/10 bg-white text-[#6B6B6B] shadow-sm transition-all hover:text-[#922842]"
                  >
                    <Bell size={16} strokeWidth={2.5} />
                    {notifications.some((notification) => !notification.read) && (
                      <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#922842]" />
                    )}
                  </button>
                  {isNotificationsOpen && (
                    <div className="absolute right-0 top-13 z-50 w-80 rounded-xl border border-[#010100]/10 bg-white p-3 shadow-xl">
                      <p className="px-2 pb-2 text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-widest text-[#6B6B6B]">Notifications</p>
                      {notifications.length ? notifications.map((notification) => (
                        <p key={notification.id} className="rounded-lg px-2 py-2 text-xs text-[#3d3d3c] hover:bg-[#E3E1E0]">{notification.message}</p>
                      )) : <p className="px-2 py-3 text-xs text-[#6B6B6B]">No request updates yet.</p>}
                    </div>
                  )}
                </div>
              )}

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsAccountOpen((open) => !open);
                    setIsNotificationsOpen(false);
                  }}
                  aria-label="Account menu"
                  className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-[#010100]/10 bg-white text-[#922842] shadow-sm transition-all hover:border-[#922842]"
                >
                  {user.avatarUrl ? <Image src={user.avatarUrl} alt="Profile" width={44} height={44} className="h-full w-full object-cover" /> : <UserRound size={18} />}
                </button>
                {isAccountOpen && (
                  <div className="absolute right-0 top-13 z-50 w-52 rounded-xl border border-[#010100]/10 bg-white p-2 shadow-xl">
                    <p className="px-3 py-2 text-xs font-medium text-[#010100]">{user.name}</p>
                    {user.role === "student" && (
                      <button type="button" onClick={() => avatarInput.current?.click()} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-[#6B6B6B] hover:bg-[#E3E1E0] hover:text-[#010100]">
                        <Camera size={14} /> Add profile picture
                      </button>
                    )}
                    <button type="button" onClick={() => void logout()} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-[#6B6B6B] hover:bg-[#E3E1E0] hover:text-[#791B37]">
                      <LogOut size={14} /> Log out
                    </button>
                  </div>
                )}
                <input ref={avatarInput} onChange={handleAvatarChange} type="file" accept="image/*" className="hidden" />
              </div>
            </div>
          )}

          {/* Mobile Hamburger Dropdown Button */}
          <button
            type="button"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              if (isSearchOpen) setIsSearchOpen(false);
            }}
            className="md:hidden rounded-xl p-2.5 shadow-sm border h-11 w-11 flex items-center justify-center bg-[#E3E1E0]/80 backdrop-blur-md border-[#010100]/5 text-[#6B6B6B] hover:text-[#010100] flex-shrink-0"
          >
            {isMenuOpen ? <X size={16} strokeWidth={2.5} /> : <Menu size={16} strokeWidth={2.5} />}
          </button>

        </div>

        {/* 4. RESPONSIVE DROPDOWN PANEL OVERLAY (Mobile) */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute top-16 right-6 left-6 mx-auto w-auto bg-[#E3E1E0]/95 backdrop-blur-lg rounded-xl border border-[#010100]/5 p-4 shadow-xl flex flex-col gap-2 pointer-events-auto md:hidden z-30"
            >
              <Link
                href="/#about"
                onClick={() => {
                  skipHomePreloader();
                  setIsMenuOpen(false);
                }}
                className="w-full text-center py-3 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-[#6B6B6B] hover:text-[#010100] hover:bg-white/40 transition-all rounded-lg"
              >
                About
              </Link>
              <Link
                href="/Publications"
                onClick={() => {
                  skipHomePreloader();
                  setIsMenuOpen(false);
                }}
                className="w-full text-center py-3 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-[#6B6B6B] hover:text-[#010100] hover:bg-white/40 transition-all rounded-lg"
              >
                Publications
              </Link>
              <Link
                href="/Programs"
                onClick={() => {
                  skipHomePreloader();
                  setIsMenuOpen(false);
                }}
                className="w-full text-center py-3 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-[#6B6B6B] hover:text-[#010100] hover:bg-white/40 transition-all rounded-lg"
              >
                Programs
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.header>
  );
}