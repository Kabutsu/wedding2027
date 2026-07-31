import type { APIRoute } from "astro";
import { supabaseAdmin } from "@/lib/supabase";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGES = 5;

export const prerender = false;

type ImageMeta = {
  name: string;
  type: string;
  size: number;
};

export const POST: APIRoute = async (context) => {
  try {
    if (!supabaseAdmin) {
      return new Response(
        JSON.stringify({ success: false, error: "Server not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await context.request.json();
    const name = body.name as string;
    const recipeText = body.recipe_text as string;
    const images = (body.images ?? []) as ImageMeta[];

    // Validation
    if (!name) {
      return new Response(
        JSON.stringify({ success: false, error: "Name is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate recipe (text OR images required)
    if (!recipeText && images.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Please provide either recipe text or at least one image",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate images
    if (images.length > MAX_IMAGES) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Maximum ${MAX_IMAGES} images allowed`,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    for (const image of images) {
      if (image.size > MAX_FILE_SIZE) {
        return new Response(
          JSON.stringify({
            success: false,
            error: `Image "${image.name}" exceeds 10MB limit`,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      if (!ALLOWED_TYPES.includes(image.type)) {
        return new Response(
          JSON.stringify({
            success: false,
            error: `Invalid file type: ${image.type}. Only JPG, PNG, and WebP allowed`,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Insert recipe to database
    const { data: recipe, error: recipeError } = await supabaseAdmin
      .from("recipes")
      .insert({
        name: name.trim(),
        recipe_text: recipeText ? recipeText.trim() : null,
      })
      .select()
      .single();

    if (recipeError || !recipe) {
      console.error("Recipe insert error:", recipeError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to save recipe" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Mint signed upload URLs so the browser can upload image bytes
    // directly to Supabase Storage, bypassing the function's body-size limit
    const uploads: { path: string; token: string; signedUrl: string }[] = [];
    for (const image of images) {
      const path = `${recipe.id}/${Date.now()}-${image.name}`;
      const { data: signedData, error: signedError } = await supabaseAdmin
        .storage
        .from("wedding-recipes")
        .createSignedUploadUrl(path);

      if (signedError || !signedData) {
        console.error("Signed upload URL error:", signedError);
        continue;
      }

      uploads.push({
        path: signedData.path,
        token: signedData.token,
        signedUrl: signedData.signedUrl,
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        recipeId: recipe.id,
        uploads,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Recipe submission error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "An unexpected error occurred" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
