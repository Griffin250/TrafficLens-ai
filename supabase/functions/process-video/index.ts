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

function inferTrafficDensity(totalVehicles: number) {
  if (totalVehicles >= 80) return "high";
  if (totalVehicles >= 35) return "medium";
  return "low";
}

function buildMockAnalysis(fileSize = 0, originalFilename = "video") {
  const seed = Math.max(1, Math.floor(fileSize / 1024));
  const cars = 18 + (seed % 24);
  const buses = 1 + (seed % 4);
  const trucks = 2 + (seed % 6);
  const motorcycles = 3 + (seed % 8);
  const leftTurns = 4 + (seed % 10);
  const rightTurns = 5 + (seed % 11);
  const straightMovements = cars + trucks + motorcycles - Math.floor(buses / 2);
  const totalVehicles = cars + buses + trucks + motorcycles;
  const totalFramesProcessed = 240 + (seed % 180);
  const averageVehiclesPerFrame = Number((totalVehicles / Math.max(totalFramesProcessed / 12, 1)).toFixed(2));
  const peakVehicles = Math.max(cars, trucks) + 4;
  const processingTime = 4 + (seed % 7);
  const trafficDensity = inferTrafficDensity(totalVehicles);

  return {
    totalVehicles,
    totalFramesProcessed,
    cars,
    buses,
    trucks,
    motorcycles,
    leftTurns,
    rightTurns,
    straightMovements,
    averageVehiclesPerFrame,
    peakVehicles,
    processingTime,
    trafficDensity,
    movementDistribution: {
      left_turns: leftTurns,
      right_turns: rightTurns,
      straight: straightMovements,
    },
    vehicleTypeDistribution: {
      cars,
      buses,
      trucks,
      motorcycles,
    },
    detailedMetrics: {
      source: "lovable-cloud-mock-analysis",
      filename: originalFilename,
      generated_at: new Date().toISOString(),
      time_series: Array.from({ length: 6 }, (_, i) => ({
        minute: i + 1,
        vehicles: Math.max(1, Math.round(totalVehicles / 6 + ((seed + i * 7) % 5))),
      })),
      density: Array.from({ length: 6 }, (_, i) => ({
        minute: i + 1,
        level: i % 2 === 0 ? trafficDensity : inferTrafficDensity(totalVehicles - 10),
      })),
    },
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
      .update({ status: "processing", progress: 25, started_at: startedAt, error_message: null })
      .eq("video_id", videoId);

    await supabase
      .from("videos")
      .update({ status: "processing", processing_started_at: startedAt, error_message: null })
      .eq("id", videoId);

    const analysis = buildMockAnalysis(fileSize, originalFilename);

    await supabase
      .from("processing_jobs")
      .update({ status: "processing", progress: 75 })
      .eq("video_id", videoId);

    const { error: analysisError } = await supabase.from("analyses").upsert({
      video_id: videoId,
      total_vehicles: analysis.totalVehicles,
      total_frames_processed: analysis.totalFramesProcessed,
      cars: analysis.cars,
      buses: analysis.buses,
      trucks: analysis.trucks,
      motorcycles: analysis.motorcycles,
      left_turns: analysis.leftTurns,
      right_turns: analysis.rightTurns,
      straight_movements: analysis.straightMovements,
      average_vehicles_per_frame: analysis.averageVehiclesPerFrame,
      peak_vehicles: analysis.peakVehicles,
      traffic_density: analysis.trafficDensity,
      processing_time: analysis.processingTime,
      annotated_video_path: filePath ?? null,
      movement_distribution: analysis.movementDistribution,
      vehicle_type_distribution: analysis.vehicleTypeDistribution,
      detailed_metrics: analysis.detailedMetrics,
      updated_at: new Date().toISOString(),
    }, { onConflict: "video_id" });

    if (analysisError) throw analysisError;

    const completedAt = new Date().toISOString();

    await supabase
      .from("processing_jobs")
      .update({ status: "completed", progress: 100, completed_at: completedAt, error_message: null })
      .eq("video_id", videoId);

    await supabase
      .from("videos")
      .update({ status: "completed", processing_completed_at: completedAt, error_message: null })
      .eq("id", videoId);

    return new Response(JSON.stringify({
      success: true,
      videoId,
      status: "completed",
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
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