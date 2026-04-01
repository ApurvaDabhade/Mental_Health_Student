import React, { useState, useRef, useEffect, useMemo } from "react";
import Sidebar from "./Sidebar";
import { Headphones, Music2, Timer, Menu, Sparkles, Leaf } from "lucide-react";

const tracks = [
  {
    id: 1,
    category: "cosy",
    title: "Cosy evening glow",
    duration: "~12 min",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: 2,
    category: "cosy",
    title: "Warm ambient calm",
    duration: "~12 min",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
  {
    id: 3,
    category: "cosy",
    title: "Soft cosy soundscape",
    duration: "~12 min",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  },
  {
    id: 4,
    category: "nature",
    title: "Soothing Ocean Waves",
    duration: "10:00",
    src: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_33b7d9f9f4.mp3?filename=calm-ocean-waves-ambient-6943.mp3",
  },
  {
    id: 5,
    category: "nature",
    title: "Gentle Rain for Focus",
    duration: "15:00",
    src: "https://cdn.pixabay.com/download/audio/2021/08/04/audio_6a7cd8bf20.mp3?filename=gentle-rain-ambient-5934.mp3",
  },
  {
    id: 6,
    category: "nature",
    title: "Soft Piano Mindfulness",
    duration: "8:00",
    src: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_3a0b9d0e0a.mp3?filename=soft-piano-ambient-10069.mp3",
  },
];

const FILTERS = [
  { id: "all", label: "All" },
  { id: "cosy", label: "Cosy & warm", icon: Sparkles },
  { id: "nature", label: "Nature & calm", icon: Leaf },
];

const Meditation = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [current, setCurrent] = useState(tracks[0]);
  const audioRef = useRef(null);

  const visibleTracks = useMemo(() => {
    if (filter === "all") return tracks;
    return tracks.filter((t) => t.category === filter);
  }, [filter]);

  useEffect(() => {
    const list = filter === "all" ? tracks : tracks.filter((t) => t.category === filter);
    if (!list.some((t) => t.id === current.id) && list[0]) {
      setCurrent(list[0]);
    }
  }, [filter, current.id]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.pause();
    el.src = current.src;
    el.load();
  }, [current.src, current.id]);

  const play = (t) => {
    setCurrent(t);
  };

  const categoryLabel =
    current.category === "cosy" ? "Cosy instrumental" : "Ambient track";

  return (
    <div className="min-h-screen bg-[#eaf1f5]">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="lg:ml-72 min-h-screen">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-30 bg-[#eaf1f5]/80 backdrop-blur">
          <div
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: "#c8ced1" }}
          >
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-[#f2f7eb]"
            >
              <Menu className="w-6 h-6 text-[#2e2f34]" />
            </button>
            <div className="flex items-center space-x-2">
              <Headphones className="w-5 h-5 text-[#3d9098]" />
              <span className="font-semibold text-[#2e2f34]">
                Meditation
              </span>
            </div>
            <div className="w-6" />
          </div>
        </div>

        <main className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-[#3d9098] p-3 rounded-xl">
                <Music2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#2e2f34]">
                  Meditation & Relaxation
                </h1>
                <p className="text-[#767272]">Calm sounds to focus and relax</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {FILTERS.map((f) => {
                const Icon = f.icon;
                const active = filter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilter(f.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                      active
                        ? "bg-[#3d9098] text-white border-[#3d9098]"
                        : "bg-white text-[#374151] border-[#c8ced1] hover:bg-[#f2f7eb]"
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Now Playing */}
            <div
              className="lg:col-span-2 bg-white rounded-xl p-6 border"
              style={{ borderColor: "#c8ced1" }}
            >
              <h3 className="text-lg font-bold text-[#2e2f34] mb-4">
                Now Playing
              </h3>
              <div className="rounded-lg overflow-hidden bg-[#eaf1f5] p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#767272]">{categoryLabel}</p>
                  <p className="text-xl font-bold text-[#2e2f34]">
                    {current.title}
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-[#767272]">
                  <Timer className="w-4 h-4" />
                  <span>{current.duration}</span>
                </div>
              </div>
              <audio ref={audioRef} controls className="w-full mt-4" preload="metadata" />
            </div>

            {/* Playlist */}
            <div
              className="bg-white rounded-xl p-6 border"
              style={{ borderColor: "#c8ced1" }}
            >
              <h3 className="text-lg font-bold text-[#2e2f34] mb-4">
                Playlist
              </h3>
              <div className="space-y-3">
                {visibleTracks.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => play(t)}
                    className={`w-full text-left p-3 rounded-lg border hover:bg-[#f2f7eb] ${
                      current.id === t.id
                        ? "bg-[#eaf1f5] border-[#c8ced1]"
                        : ""
                    }`}
                    style={{ borderColor: "#c8ced1" }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-[#2e2f34]">{t.title}</p>
                      <span className="text-[10px] uppercase font-bold text-[#889260] shrink-0">
                        {t.category === "cosy" ? "Cosy" : "Nature"}
                      </span>
                    </div>
                    <p className="text-xs text-[#767272]">{t.duration}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Meditation;
