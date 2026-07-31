import type { APIRoute } from "astro";
import { supabaseAdmin } from "@/lib/supabase";

export const prerender = false;

export const POST: APIRoute = async (context) => {
  try {
    if (!supabaseAdmin) {
      return new Response(
        JSON.stringify({ success: false, error: "Server not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await context.request.json();
    const recipeId = body.recipeId as string;
    const paths = (body.paths ?? []) as string[];

    if (!recipeId || paths.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "recipeId and paths are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Only accept paths that were actually issued for this recipe
    const validPaths = paths.filter((path) => path.startsWith(`${recipeId}/`));

    let confirmed = 0;
    for (const path of validPaths) {
      const { error } = await supabaseAdmin
        .from("recipe_images")
        .insert({ recipe_id: recipeId, storage_path: path });

      if (!error) {
        confirmed += 1;
      } else {
        console.error("Image record insert error:", error);
      }
    }

    return new Response(
      JSON.stringify({ success: true, confirmed }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Confirm recipe images error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "An unexpected error occurred" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
