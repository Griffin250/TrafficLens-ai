import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response(
        JSON.stringify({ error: "No file provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const allowedTypes = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/x-matroska"];
    if (!allowedTypes.includes(file.type)) {
      return new Response(
        JSON.stringify({ error: `File type ${file.type} not allowed` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate unique filename
    const videoId = crypto.randomUUID();
    const ext = file.name.split(".").pop() || "mp4";
    const storagePath = `${videoId}.${ext}`;

    // Upload to storage
    const fileBuffer = await file.arrayBuffer();
    const { error: storageError } = await supabase.storage
      .from("videos")
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (storageError) {
      console.error("Storage upload error:", storageError);
      return new Response(
        JSON.stringify({ error: `Storage upload failed: ${storageError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create video record
    const { data: video, error: videoError } = await supabase
      .from("videos")
      .insert({
        id: videoId,
        filename: storagePath,
        original_filename: file.name,
        file_path: storagePath,
        file_size: file.size,
        status: "uploaded",
      })
      .select()
      .single();

    if (videoError) {
      console.error("Video insert error:", videoError);
      return new Response(
        JSON.stringify({ error: `Database error: ${videoError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create processing job
    const { error: jobError } = await supabase
      .from("processing_jobs")
      .insert({
        video_id: videoId,
        status: "pending",
        progress: 0,
      });

    if (jobError) {
      console.error("Job insert error:", jobError);
    }

    return new Response(
      JSON.stringify({
        id: videoId,
        filename: storagePath,
        file_size: file.size,
        status: "uploaded",
        message: "Video uploaded successfully. Processing queued.",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Upload failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
