import type { APIRoute } from "astro";
import { supabaseAdmin } from "@/lib/supabase";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGES = 5;

export const prerender = false;

export const POST: APIRoute = async (context) => {
  try {
    if (!supabaseAdmin) {
      return new Response(
        JSON.stringify({ success: false, error: "Server not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const formData = await context.request.formData();
    const name = formData.get("name") as string;
    const recipeText = formData.get("recipe_text") as string;
    const imageFiles = formData.getAll("images") as File[];

    // Validation
    if (!name) {
      return new Response(
        JSON.stringify({ success: false, error: "Name is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate recipe (text OR images required)
    if (!recipeText && imageFiles.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Please provide either recipe text or at least one image",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate images
    if (imageFiles.length > MAX_IMAGES) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Maximum ${MAX_IMAGES} images allowed`,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const validImages: File[] = [];
    for (const file of imageFiles) {
      if (file.size > MAX_FILE_SIZE) {
        return new Response(
          JSON.stringify({
            success: false,
            error: `Image "${file.name}" exceeds 10MB limit`,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        return new Response(
          JSON.stringify({
            success: false,
            error: `Invalid file type: ${file.type}. Only JPG, PNG, and WebP allowed`,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      validImages.push(file);
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

    // Upload images
    const uploadedImages: string[] = [];
    for (const file of validImages) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filename = `${recipe.id}/${Date.now()}-${file.name}`;

      const { data: uploadData, error: uploadError } =
        await supabaseAdmin.storage
          .from("wedding-recipes")
          .upload(filename, buffer, {
            contentType: file.type,
          });

      if (uploadError) {
        console.error("Image upload error:", uploadError);
        // Continue with other images even if one fails
        continue;
      }

      if (uploadData) {
        // Record image reference in database
        const { error: imageRecordError } = await supabaseAdmin
          .from("recipe_images")
          .insert({
            recipe_id: recipe.id,
            storage_path: uploadData.path,
          });

        if (!imageRecordError) {
          uploadedImages.push(uploadData.path);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        recipeId: recipe.id,
        imagesUploaded: uploadedImages.length,
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
