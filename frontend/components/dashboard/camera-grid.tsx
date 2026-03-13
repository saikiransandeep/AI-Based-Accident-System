"use client";

import { useState, useEffect } from "react";
import {
  Camera,
  Maximize2,
  Signal,
  AlertCircle,
  Play,
  Pause,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const cameras = [
  {
    id: 1,
    name: "Highway I-95 North",
    location: "Exit 42, Downtown",
    status: "online",
    hasAlert: true,
    fps: 30,
    quality: "HD",
    videoSource: "http://127.0.0.1:5000/api/live-camera/demo2.mp4",
  },
  {
    id: 2,
    name: "Main Street Junction",
    location: "Central District",
    status: "online",
    hasAlert: false,
    fps: 30,
    quality: "HD",
    videoSource: "http://127.0.0.1:5000/api/live-camera/demo1.mp4",
  },
  {
    id: 3,
    name: "Industrial Zone A",
    location: "Port Area",
    status: "online",
    hasAlert: false,
    fps: 24,
    quality: "HD",
    videoSource: "http://127.0.0.1:5000/api/live-camera/demo6.mp4",
  },
  {
    id: 4,
    name: "Airport Terminal",
    location: "International Airport",
    status: "online",
    hasAlert: true,
    fps: 30,
    quality: "4K",
    videoSource: "http://127.0.0.1:5000/api/live-camera/demo4.mp4",
  },
];

export function CameraGrid() {
  const [activeCameras, setActiveCameras] = useState<Record<number, boolean>>(
    {},
  );
  const [scanLines, setScanLines] = useState<Record<number, number>>({});

  useEffect(() => {
    // Initialize all cameras as active
    const initial: Record<number, boolean> = {};
    cameras.forEach((cam) => (initial[cam.id] = true));
    setActiveCameras(initial);

    // Animate scan lines
    const interval = setInterval(() => {
      setScanLines((prev) => {
        const next: Record<number, number> = {};
        cameras.forEach((cam) => {
          next[cam.id] = ((prev[cam.id] || 0) + 1) % 100;
        });
        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const toggleCamera = (id: number) => {
    setActiveCameras((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 border border-primary/30">
            <Camera className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Live Camera Feeds</h3>
            <p className="text-xs text-muted-foreground">
              {cameras.filter((c) => c.status === "online").length} cameras
              online
            </p>
          </div>
        </div>
        <Badge variant="outline" className="border-primary/30 text-primary">
          <Signal className="w-3 h-3 mr-1" />
          Live
        </Badge>
      </div>

      {/* Camera Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cameras.map((camera) => (
          <div
            key={camera.id}
            className={cn(
              "relative rounded-xl overflow-hidden aspect-video",
              "bg-secondary/50 border border-border/50",
              "group transition-all duration-300",
              camera.hasAlert && "border-destructive/50",
            )}>
            {/* Simulated Video Feed */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/80 to-secondary/60">
              {/* Grid overlay */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
                  `,
                  backgroundSize: "20px 20px",
                }}
              />

              {/* Scan line effect */}
              {activeCameras[camera.id] && (
                <div
                  className="absolute left-0 right-0 h-1 bg-gradient-to-b from-primary/30 to-transparent pointer-events-none"
                  style={{
                    top: `${scanLines[camera.id]}%`,
                    transition: "top 0.05s linear",
                  }}
                />
              )}

              {/* Camera Feed Stream or Placeholder */}
              {camera.videoSource ? (
                <img
                  src={camera.videoSource}
                  className="absolute inset-0 w-full h-full object-cover"
                  alt={`Live Camera Feed ${camera.id}`}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-12 h-12 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground/50">
                      Camera Feed
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Alert Overlay */}
            {camera.hasAlert && (
              <div className="absolute inset-0 bg-destructive/10 animate-pulse-glow pointer-events-none">
                <div className="absolute top-3 right-3">
                  <Badge className="bg-destructive text-destructive-foreground animate-pulse">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    INCIDENT
                  </Badge>
                </div>
              </div>
            )}

            {/* Camera Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <div className="flex items-end justify-between">
                <div>
                  <h4 className="font-medium text-sm text-white">
                    {camera.name}
                  </h4>
                  <p className="text-xs text-white/60">{camera.location}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-white/20 text-white/80 text-xs bg-black/30">
                    {camera.fps} FPS
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-white/20 text-white/80 text-xs bg-black/30">
                    {camera.quality}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  camera.status === "online"
                    ? "bg-accent animate-pulse-glow"
                    : "bg-destructive",
                )}
              />
              <span className="text-xs text-white/80 font-medium uppercase tracking-wider">
                {camera.status === "online" ? "REC" : "OFFLINE"}
              </span>
            </div>

            {/* Hover Controls */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                onClick={() => toggleCamera(camera.id)}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                {activeCameras[camera.id] ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white" />
                )}
              </button>
              <button className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <Maximize2 className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
