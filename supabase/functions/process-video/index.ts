import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type ProcessVideoRequest = {
  videoId?: string;
  filePath?: string;
  originalFilename?: string;
  fileSize?: number;
};

type TrafficDetection = {
  frame_number: number;
  timestamp: number;
  confidence: number;
  vehicle_class: string;
  x_min: number;
  y_min: number;
  x_max: number;
  y_max: number;
  track_reference?: number | null;
  extra_metadata?: Record<string, unknown> | null;
};

type TrafficTrack = {
  track_id: number;
  vehicle_class: string;
  start_frame: number;
  end_frame: number;
  total_detections: number;
  movement_type?: string | null;
  movement_confidence?: number | null;
  trajectory_points: number[][];
  start_position: number[];
  end_position: number[];
  average_speed?: number | null;
};

type TrafficAnalysisResult = {
  summary: {
    total_vehicles: number;
    total_frames_processed: number;
    left_turns: number;
    right_turns: number;
    straight_movements: number;
    cars: number;
    buses: number;
    trucks: number;
    motorcycles: number;
    average_vehicles_per_frame: number;
    peak_vehicles: number;
    traffic_density: "low" | "medium" | "high";
    processing_time?: number | null;
    average_speed?: number | null;
  };
  movement_distribution: {
    left_turns: number;
    right_turns: number;
    straight: number;
  };
  vehicle_type_distribution: {
    cars: number;
    buses: number;
    trucks: number;
    motorcycles: number;
  };
  detailed_metrics: Record<string, unknown>;
  tracks: TrafficTrack[];
  detections: TrafficDetection[];
};

const ANALYSIS_TOOL = {
  type: "function",
  function: {
    name: "store_traffic_analysis",
    description:
      "Extract structured traffic analytics from a traffic video. Estimate counts, movement directions, tracks, detections, and traffic density from the actual video content.",
    parameters: {
      type: "object",
      properties: {
        summary: {
          type: "object",
          properties: {
            total_vehicles: { type: "number" },
            total_frames_processed: { type: "number" },
            left_turns: { type: "number" },
            right_turns: { type: "number" },
            straight_movements: { type: "number" },
            cars: { type: "number" },
            buses: { type: "number" },
            trucks: { type: "number" },
            motorcycles: { type: "number" },
            average_vehicles_per_frame: { type: "number" },
            peak_vehicles: { type: "number" },
            traffic_density: { type: "string", enum: ["low", "medium", "high"] },
            processing_time: { type: "number" },
            average_speed: { type: "number" },
          },
          required: [
            "total_vehicles",
            "total_frames_processed",
            "left_turns",
            "right_turns",
            "straight_movements",
            "cars",
            "buses",
            "trucks",
            "motorcycles",
            "average_vehicles_per_frame",
            "peak_vehicles",
            "traffic_density",
          ],
          additionalProperties: false,
        },
        movement_distribution: {
          type: "object",
          properties: {
            left_turns: { type: "number" },
            right_turns: { type: "number" },
            straight: { type: "number" },
          },
          required: ["left_turns", "right_turns", "straight"],
          additionalProperties: false,
        },
        vehicle_type_distribution: {
          type: "object",
          properties: {
            cars: { type: "number" },
            buses: { type: "number" },
            trucks: { type: "number" },
            motorcycles: { type: "number" },
          },
          required: ["cars", "buses", "trucks", "motorcycles"],
          additionalProperties: false,
        },
        detailed_metrics: {
          type: "object",
          properties: {
            scene_description: { type: "string" },
            intersection_type: { type: "string" },
            weather: { type: "string" },
            lighting: { type: "string" },
            confidence_notes: { type: "string" },
            time_series: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  segment: { type: "string" },
                  vehicles: { type: "number" },
                },
                required: ["segment", "vehicles"],
                additionalProperties: false,
              },
            },
            density: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  segment: { type: "string" },
                  level: { type: "string", enum: ["low", "medium", "high"] },
                },
                required: ["segment", "level"],
                additionalProperties: false,
              },
            },
          },
          required: [
            "scene_description",
            "intersection_type",
            "weather",
            "lighting",
            "confidence_notes",
            "time_series",
            "density",
          ],
          additionalProperties: false,
        },
        tracks: {
          type: "array",
          items: {
            type: "object",
            properties: {
              track_id: { type: "number" },
              vehicle_class: { type: "string" },
              start_frame: { type: "number" },
              end_frame: { type: "number" },
              total_detections: { type: "number" },
              movement_type: { type: ["string", "null"] },
              movement_confidence: { type: ["number", "null"] },
              trajectory_points: {
                type: "array",
                items: {
                  type: "array",
                  items: { type: "number" },
                  minItems: 2,
                  maxItems: 2,
                },
              },
              start_position: {
                type: "array",
                items: { type: "number" },
                minItems: 2,
                maxItems: 2,
              },
              end_position: {
                type: "array",
                items: { type: "number" },
                minItems: 2,
                maxItems: 2,
              },
              average_speed: { type: ["number", "null"] },
            },
            required: [
              "track_id",
              "vehicle_class",
              "start_frame",
              "end_frame",
              "total_detections",
              "trajectory_points",
              "start_position",
              "end_position",
            ],
            additionalProperties: false,
          },
        },
        detections: {
          type: "array",
          items: {
            type: "object",
            properties: {
              frame_number: { type: "number" },
              timestamp: { type: "number" },
              confidence: { type: "number" },
              vehicle_class: { type: "string" },
              x_min: { type: "number" },
              y_min: { type: "number" },
              x_max: { type: "number" },
              y_max: { type: "number" },
              track_reference: { type: ["number", "null"] },
              extra_metadata: { type: ["object", "null"] },
            },
            required: [
              "frame_number",
              "timestamp",
              "confidence",
              "vehicle_class",
              "x_min",
              "y_min",
              "x_max",
              "y_max",
            ],
            additionalProperties: false,
          },
        },
      },
      required: [
        "summary",
        "movement_distribution",
        "vehicle_type_distribution",
        "detailed_metrics",
        "tracks",
        "detections",
      ],
      additionalProperties: false,
    },
  },
};

function inferMimeType(pathOrName = "") {
  const normalized = pathOrName.toLowerCase();
  if (normalized.endsWith(".mov") || normalized.endsWith(".quicktime")) return "video/quicktime";
  if (normalized.endsWith(".avi")) return "video/x-msvideo";
  if (normalized.endsWith(".mkv")) return "video/x-matroska";
  if (normalized.endsWith(".webm")) return "video/webm";
  return "video/mp4";
}

function clampNumber(value: unknown, min = 0, max = Number.MAX_SAFE_INTEGER) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return min;
  return Math.min(max, Math.max(min, parsed));
}

function normalizePoint(point: unknown): number[] {
  if (!Array.isArray(point)) return [0, 0];
  return [clampNumber(point[0]), clampNumber(point[1])];
}

function normalizeTrack(track: TrafficTrack, index: number): TrafficTrack {
  const trajectory = Array.isArray(track.trajectory_points)
    ? track.trajectory_points.map(normalizePoint).slice(0, 24)
    : [];

  return {
    track_id: clampNumber(track.track_id, 1) || index + 1,
    vehicle_class: String(track.vehicle_class || "car"),
    start_frame: clampNumber(track.start_frame),
    end_frame: clampNumber(track.end_frame),
    total_detections: clampNumber(track.total_detections, 0, 200),
    movement_type: track.movement_type ? String(track.movement_type) : null,
    movement_confidence:
      track.movement_confidence === null || track.movement_confidence === undefined
        ? null
        : clampNumber(track.movement_confidence, 0, 1),
    trajectory_points: trajectory,
    start_position: normalizePoint(track.start_position),
    end_position: normalizePoint(track.end_position),
    average_speed:
      track.average_speed === null || track.average_speed === undefined
        ? null
        : clampNumber(track.average_speed, 0, 200),
  };
}

function normalizeDetection(detection: TrafficDetection): TrafficDetection {
  return {
    frame_number: clampNumber(detection.frame_number),
    timestamp: clampNumber(detection.timestamp),
    confidence: clampNumber(detection.confidence, 0, 1),
    vehicle_class: String(detection.vehicle_class || "car"),
    x_min: clampNumber(detection.x_min),
    y_min: clampNumber(detection.y_min),
    x_max: clampNumber(detection.x_max),
    y_max: clampNumber(detection.y_max),
    track_reference:
      detection.track_reference === null || detection.track_reference === undefined
        ? null
        : clampNumber(detection.track_reference, 1),
    extra_metadata: detection.extra_metadata ?? null,
  };
}

async function analyzeVideoWithLovableAI(args: {
  fileBytes: Uint8Array;
  mimeType: string;
  originalFilename: string;
  fileSize?: number;
}): Promise<TrafficAnalysisResult> {
  const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!lovableApiKey) throw new Error("LOVABLE_API_KEY is not configured");

  const base64Video = btoa(String.fromCharCode(...args.fileBytes));

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        {
          role: "system",
          content:
            "You are a traffic video analyst. Analyze the actual uploaded road traffic video and return only structured tool output. Estimate object tracking, movement directions, density, vehicle classes, and representative detections from the video itself. Use conservative confidence values. Keep detections to at most 60 and tracks to at most 20.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                `Analyze this traffic video and extract structured traffic metrics, representative tracks, and representative detections. ` +
                `Filename: ${args.originalFilename}. File size: ${args.fileSize ?? 0} bytes. ` +
                `Use the actual visual content of the video. ` +
                `Bounding boxes should be pixel-like coordinates relative to the visible frame. ` +
                `If exact values are uncertain, provide best-effort estimates grounded in the video.`
            },
            {
              type: "input_video",
              input_video: {
                data: base64Video,
                format: args.mimeType.replace("video/", ""),
              },
            },
          ],
        },
      ],
      tools: [ANALYSIS_TOOL],
      tool_choice: { type: "function", function: { name: "store_traffic_analysis" } },
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    if (response.status === 429) throw new Error("AI rate limit exceeded. Please try again shortly.");
    if (response.status === 402) throw new Error("AI credits required. Please top up Lovable AI usage.");
    throw new Error(`AI analysis failed: ${text}`);
  }

  const payload = await response.json();
  const toolCall = payload?.choices?.[0]?.message?.tool_calls?.[0];
  const rawArguments = toolCall?.function?.arguments;
  if (!rawArguments) {
    throw new Error("AI analysis returned no structured output");
  }

  const parsed = JSON.parse(rawArguments) as TrafficAnalysisResult;
  return {
    ...parsed,
    tracks: (parsed.tracks || []).map(normalizeTrack).slice(0, 20),
    detections: (parsed.detections || []).map(normalizeDetection).slice(0, 60),
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { videoId, filePath, originalFilename, fileSize }: ProcessVideoRequest = await req.json();

    if (!videoId) {
      return new Response(JSON.stringify({ error: "videoId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const startedAt = new Date().toISOString();

    await supabase
      .from("processing_jobs")
      .update({ status: "processing", progress: 15, started_at: startedAt, error_message: null })
      .eq("video_id", videoId);

    await supabase
      .from("videos")
      .update({ status: "processing", processing_started_at: startedAt, error_message: null })
      .eq("id", videoId);

    if (!filePath) {
      throw new Error("filePath is required for AI analysis");
    }

    const { data: downloadData, error: downloadError } = await supabase.storage
      .from("videos")
      .download(filePath);

    if (downloadError || !downloadData) {
      throw new Error(downloadError?.message || "Unable to download video from storage");
    }

    const fileBytes = new Uint8Array(await downloadData.arrayBuffer());
    const aiAnalysis = await analyzeVideoWithLovableAI({
      fileBytes,
      mimeType: inferMimeType(filePath || originalFilename),
      originalFilename: originalFilename || filePath,
      fileSize,
    });

    await supabase
      .from("processing_jobs")
      .update({ status: "processing", progress: 70 })
      .eq("video_id", videoId);

    const { error: analysisError } = await supabase.from("analyses").upsert(
      {
        video_id: videoId,
        total_vehicles: clampNumber(aiAnalysis.summary.total_vehicles),
        total_frames_processed: clampNumber(aiAnalysis.summary.total_frames_processed),
        cars: clampNumber(aiAnalysis.summary.cars),
        buses: clampNumber(aiAnalysis.summary.buses),
        trucks: clampNumber(aiAnalysis.summary.trucks),
        motorcycles: clampNumber(aiAnalysis.summary.motorcycles),
        left_turns: clampNumber(aiAnalysis.summary.left_turns),
        right_turns: clampNumber(aiAnalysis.summary.right_turns),
        straight_movements: clampNumber(aiAnalysis.summary.straight_movements),
        average_vehicles_per_frame: clampNumber(aiAnalysis.summary.average_vehicles_per_frame),
        peak_vehicles: clampNumber(aiAnalysis.summary.peak_vehicles),
        processing_time:
          aiAnalysis.summary.processing_time === null || aiAnalysis.summary.processing_time === undefined
            ? null
            : clampNumber(aiAnalysis.summary.processing_time),
        average_speed:
          aiAnalysis.summary.average_speed === null || aiAnalysis.summary.average_speed === undefined
            ? null
            : clampNumber(aiAnalysis.summary.average_speed),
        traffic_density: aiAnalysis.summary.traffic_density,
        annotated_video_path: filePath,
        movement_distribution: aiAnalysis.movement_distribution,
        vehicle_type_distribution: aiAnalysis.vehicle_type_distribution,
        detailed_metrics: {
          ...aiAnalysis.detailed_metrics,
          source: "lovable-ai-video-analysis",
          generated_at: new Date().toISOString(),
          model: "google/gemini-3-flash-preview",
          detections_count: aiAnalysis.detections.length,
          tracks_count: aiAnalysis.tracks.length,
        },
        updated_at: new Date().toISOString(),
      },
      { onConflict: "video_id" }
    );

    if (analysisError) throw analysisError;

    await supabase.from("detections").delete().eq("video_id", videoId);
    await supabase.from("tracks").delete().eq("video_id", videoId);

    const { data: insertedTracks, error: tracksError } = await supabase
      .from("tracks")
      .insert(
        aiAnalysis.tracks.map((track) => ({
          video_id: videoId,
          track_id: track.track_id,
          vehicle_class: track.vehicle_class,
          start_frame: track.start_frame,
          end_frame: track.end_frame,
          total_detections: track.total_detections,
          movement_type: track.movement_type ?? null,
          movement_confidence: track.movement_confidence ?? null,
          trajectory_points: track.trajectory_points,
          start_position: track.start_position,
          end_position: track.end_position,
          average_speed: track.average_speed ?? null,
        }))
      )
      .select("id, track_id");

    if (tracksError) throw tracksError;

    const trackIdMap = new Map<number, string>();
    for (const track of insertedTracks || []) {
      if (typeof track.track_id === "number") {
        trackIdMap.set(track.track_id, track.id);
      }
    }

    if (aiAnalysis.detections.length > 0) {
      const { error: detectionsError } = await supabase.from("detections").insert(
        aiAnalysis.detections.map((detection) => ({
          video_id: videoId,
          track_id: detection.track_reference ? trackIdMap.get(detection.track_reference) ?? null : null,
          frame_number: detection.frame_number,
          timestamp: detection.timestamp,
          confidence: detection.confidence,
          vehicle_class: detection.vehicle_class,
          x_min: detection.x_min,
          y_min: detection.y_min,
          x_max: detection.x_max,
          y_max: detection.y_max,
          extra_metadata: detection.extra_metadata ?? null,
        }))
      );

      if (detectionsError) throw detectionsError;
    }

    const completedAt = new Date().toISOString();

    await supabase
      .from("processing_jobs")
      .update({ status: "completed", progress: 100, completed_at: completedAt, error_message: null })
      .eq("video_id", videoId);

    await supabase
      .from("videos")
      .update({ status: "completed", processing_completed_at: completedAt, error_message: null })
      .eq("id", videoId);

    return new Response(
      JSON.stringify({
        success: true,
        videoId,
        status: "completed",
        detections: aiAnalysis.detections.length,
        tracks: aiAnalysis.tracks.length,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("process-video error:", error);

    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, serviceRoleKey);
      const body = await req.clone().json().catch(() => ({}));
      const videoId = body?.videoId;

      if (videoId) {
        await supabase
          .from("processing_jobs")
          .update({ status: "failed", error_message: error.message ?? "Processing failed", completed_at: new Date().toISOString() })
          .eq("video_id", videoId);

        await supabase
          .from("videos")
          .update({ status: "failed", error_message: error.message ?? "Processing failed" })
          .eq("id", videoId);
      }
    } catch (updateError) {
      console.error("process-video failure update error:", updateError);
    }

    return new Response(JSON.stringify({ error: error.message ?? "Processing failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});