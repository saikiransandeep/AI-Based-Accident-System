"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Camera,
  Upload,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle2,
  X,
  Image as ImageIcon,
  Video,
  Zap,
  Eye,
  Clock,
  Target,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface Detection {
  id: string;
  type: "accident" | "normal";
  confidence: number;
  label: string;
  timestamp: Date;
  cameraName: string;
  boundingBox?: { x: number; y: number; width: number; height: number };
}

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  type: "image" | "video";
  status: "pending" | "processing" | "completed";
  detections: Detection[];
}

export function LiveCamerasPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = useCallback((file: File): UploadedFile => {
    const isVideo = file.type.startsWith("video/");
    const preview = URL.createObjectURL(file);

    return {
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview,
      type: isVideo ? "video" : "image",
      status: "pending",
      detections: [],
    };
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files).filter(
        (file) =>
          file.type.startsWith("image/") || file.type.startsWith("video/"),
      );

      const newFiles = files.map(processFile);
      setUploadedFiles((prev) => [...prev, ...newFiles]);

      if (newFiles.length > 0 && !selectedFile) {
        setSelectedFile(newFiles[0]);
      }
    },
    [processFile, selectedFile],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []).filter(
        (file) =>
          file.type.startsWith("image/") || file.type.startsWith("video/"),
      );

      const newFiles = files.map(processFile);
      setUploadedFiles((prev) => [...prev, ...newFiles]);

      if (newFiles.length > 0 && !selectedFile) {
        setSelectedFile(newFiles[0]);
      }
    },
    [processFile, selectedFile],
  );

  const runDetection = useCallback(async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProcessingProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      let endpoint = "http://127.0.0.1:5000/api/detect-image";
      const formData = new FormData();

      if (selectedFile.type === "video") {
        endpoint = "http://127.0.0.1:5000/api/detect-video";
        formData.append("video", selectedFile.file);
      } else {
        formData.append("image", selectedFile.file);
      }

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to run detection");
      }

      const data = await response.json();

      clearInterval(progressInterval);
      setProcessingProgress(100);

      const isAccident = data.prediction === "Accident";
      const confidence = data.probability;

      const detections: Detection[] = [
        {
          id: Math.random().toString(36).substr(2, 9),
          type: isAccident ? "accident" : "normal",
          confidence,
          label: isAccident
            ? "Vehicle Accident Detected"
            : "Normal Traffic Flow",
          timestamp: new Date(),
          cameraName: `Camera Upload`,
        },
      ];

      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === selectedFile.id
            ? { ...f, status: "completed", detections }
            : f,
        ),
      );

      setSelectedFile((prev) =>
        prev ? { ...prev, status: "completed", detections } : null,
      );
    } catch (error) {
      console.error("Detection Error:", error);
      clearInterval(progressInterval);
      // Provide fallback or error handling here if necessary
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile]);

  const removeFile = useCallback(
    (id: string) => {
      setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
      if (selectedFile?.id === id) {
        setSelectedFile(uploadedFiles.find((f) => f.id !== id) || null);
      }
    },
    [selectedFile, uploadedFiles],
  );

  const toggleVideo = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  // Automatically trigger AI detection when a new file is uploaded
  useEffect(() => {
    if (selectedFile && selectedFile.status === "pending" && !isProcessing) {
      runDetection();
    }
  }, [selectedFile, isProcessing, runDetection]);

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Area */}
        <div className="lg:col-span-1">
          <div className="glass-card rounded-2xl p-6 h-full">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              Upload Media
            </h3>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300",
                isDragging
                  ? "border-primary bg-primary/10"
                  : "border-border/50 hover:border-primary/50 hover:bg-primary/5",
              )}>
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-foreground font-medium">
                    Drag & drop files here
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    or click to browse
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ImageIcon className="w-4 h-4" />
                  <span>Images</span>
                  <span className="text-border">|</span>
                  <Video className="w-4 h-4" />
                  <span>Videos</span>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="mt-6 space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Uploaded Files ({uploadedFiles.length})
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      onClick={() => setSelectedFile(file)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all",
                        selectedFile?.id === file.id
                          ? "bg-primary/15 border border-primary/30"
                          : "bg-secondary/50 hover:bg-secondary/80",
                      )}>
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-background flex-shrink-0">
                        {file.type === "image" ? (
                          <img
                            src={file.preview}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/20">
                            <Video className="w-5 h-5 text-primary" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {file.file.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              file.status === "completed"
                                ? "default"
                                : file.status === "processing"
                                  ? "secondary"
                                  : "outline"
                            }
                            className={cn(
                              "text-xs",
                              file.status === "completed" &&
                                file.detections[0]?.type === "accident"
                                ? "bg-destructive/20 text-destructive border-destructive/30"
                                : file.status === "completed"
                                  ? "bg-accent/20 text-accent border-accent/30"
                                  : "",
                            )}>
                            {file.status === "completed"
                              ? file.detections[0]?.type === "accident"
                                ? "Accident Detected"
                                : "Normal"
                              : file.status === "processing"
                                ? "Processing..."
                                : "Pending"}
                          </Badge>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(file.id);
                        }}
                        className="p-1 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preview & Detection Panel */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-2xl p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                Preview & Detection
              </h3>
              {selectedFile && (
                <Button
                  onClick={runDetection}
                  disabled={isProcessing}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Run Detection
                    </>
                  )}
                </Button>
              )}
            </div>

            {selectedFile ? (
              <div className="space-y-6">
                {/* Media Preview */}
                <div className="relative rounded-xl overflow-hidden bg-background aspect-video">
                  {selectedFile.type === "image" ? (
                    <img
                      src={selectedFile.preview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <video
                        ref={videoRef}
                        src={selectedFile.preview}
                        className="w-full h-full object-contain"
                        onEnded={() => setIsPlaying(false)}
                      />
                      <button
                        onClick={toggleVideo}
                        className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                        {isPlaying ? (
                          <Pause className="w-16 h-16 text-white" />
                        ) : (
                          <Play className="w-16 h-16 text-white" />
                        )}
                      </button>
                    </div>
                  )}

                  {/* Detection Bounding Box Overlay */}
                  {selectedFile.status === "completed" &&
                    selectedFile.detections[0]?.boundingBox && (
                      <div
                        className="absolute border-2 border-destructive rounded-lg animate-pulse"
                        style={{
                          left: `${selectedFile.detections[0].boundingBox.x}%`,
                          top: `${selectedFile.detections[0].boundingBox.y}%`,
                          width: `${selectedFile.detections[0].boundingBox.width}%`,
                          height: `${selectedFile.detections[0].boundingBox.height}%`,
                        }}>
                        <div className="absolute -top-6 left-0 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded">
                          {selectedFile.detections[0].label}
                        </div>
                      </div>
                    )}

                  {/* Scanline Effect */}
                  <div className="absolute inset-0 scanline pointer-events-none opacity-30" />
                </div>

                {/* Processing Progress */}
                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        AI Processing...
                      </span>
                      <span className="text-primary font-mono">
                        {Math.round(processingProgress)}%
                      </span>
                    </div>
                    <Progress value={processingProgress} className="h-2" />
                  </div>
                )}

                {/* Detection Results */}
                {selectedFile.status === "completed" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedFile.detections.map((detection) => (
                      <div
                        key={detection.id}
                        className={cn(
                          "glass rounded-xl p-4",
                          detection.type === "accident"
                            ? "border border-destructive/30"
                            : "border border-accent/30",
                        )}>
                        <div className="flex items-start gap-4">
                          <div
                            className={cn(
                              "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                              detection.type === "accident"
                                ? "bg-destructive/20"
                                : "bg-accent/20",
                            )}>
                            {detection.type === "accident" ? (
                              <AlertTriangle className="w-6 h-6 text-destructive" />
                            ) : (
                              <CheckCircle2 className="w-6 h-6 text-accent" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">
                              {detection.label}
                            </h4>
                            <div className="mt-2 space-y-1 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Target className="w-4 h-4" />
                                <span>Confidence:</span>
                                <span
                                  className={cn(
                                    "font-mono font-medium",
                                    detection.confidence > 90
                                      ? "text-accent"
                                      : detection.confidence > 70
                                        ? "text-primary"
                                        : "text-warning",
                                  )}>
                                  {detection.confidence.toFixed(1)}%
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Camera className="w-4 h-4" />
                                <span>{detection.cameraName}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {detection.timestamp.toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <div className="w-20 h-20 rounded-2xl bg-secondary/50 flex items-center justify-center mb-4">
                  <Camera className="w-10 h-10 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  Upload an image or video to start detection
                </p>
                <p className="text-sm text-muted-foreground/60 mt-2">
                  Supported formats: JPG, PNG, GIF, MP4, WebM
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Camera Feeds Grid */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Camera className="w-5 h-5 text-primary" />
          Live Camera Feeds
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => {
            const demoSources = [
              "http://127.0.0.1:5000/api/live-camera/demo1.mp4",
              "http://127.0.0.1:5000/api/live-camera/demo2.mp4",
              "http://127.0.0.1:5000/api/live-camera/demo3.mp4",
              "http://127.0.0.1:5000/api/live-camera/demo4.mp4",
              "http://127.0.0.1:5000/api/live-camera/demo5.mp4",
              "http://127.0.0.1:5000/api/live-camera/demo6.mp4",
              "http://127.0.0.1:5000/api/live-camera/demo7.mp4",
              "http://127.0.0.1:5000/api/live-camera/demo8.mp4",
            ];
            const videoSource = i < 8 ? demoSources[i] : null;

            return (
              <div
                key={i}
                className="glass rounded-xl overflow-hidden group border border-border/10 cursor-pointer">
                <div className="relative aspect-video bg-gradient-to-br from-secondary/50 to-background overflow-hidden">
                  {videoSource ? (
                    <img
                      src={videoSource}
                      className="w-full h-full object-cover"
                      alt={`Live Camera Feed ${i + 1}`}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                  )}
                  {i >= 4 && (
                    <div className="absolute inset-0 scanline opacity-20" />
                  )}

                  <div className="absolute top-2 left-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
                    <span className="text-xs text-foreground font-medium bg-background/50 px-2 py-0.5 rounded">
                      CAM-{String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className="text-xs bg-background/50">
                      {
                        [
                          "Highway A1",
                          "Main St",
                          "Junction 5",
                          "Bridge Rd",
                          "Tunnel E",
                          "Exit 12",
                          "Route 66",
                          "Cross Rd",
                        ][i]
                      }
                    </Badge>
                    <span className="text-xs text-muted-foreground bg-background/50 px-2 py-0.5 rounded font-mono">
                      {videoSource ? "30 FPS" : "OFFLINE"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
