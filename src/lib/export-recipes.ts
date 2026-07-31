import { supabaseAdmin } from "@/lib/supabase";
import Archive from "archiver";

if (!supabaseAdmin) {
  throw new Error("Supabase admin client not configured");
}

export async function exportRecipesAsZip(): Promise<Buffer> {
  // Fetch all recipes with their images
  const { data: recipes, error: recipesError } = await supabaseAdmin
    .from("recipes")
    .select("*")
    .order("created_at", { ascending: false });

  if (recipesError || !recipes) {
    throw new Error(`Failed to fetch recipes: ${recipesError?.message}`);
  }

  const { data: images, error: imagesError } = await supabaseAdmin
    .from("recipe_images")
    .select("*");

  if (imagesError) {
    throw new Error(`Failed to fetch recipe images: ${imagesError?.message}`);
  }

  // Group images by recipe_id
  const imagesByRecipeId = new Map<string, typeof images>();
  (images || []).forEach((img) => {
    if (!imagesByRecipeId.has(img.recipe_id)) {
      imagesByRecipeId.set(img.recipe_id, []);
    }
    imagesByRecipeId.get(img.recipe_id)!.push(img);
  });

  // Create manifest JSON
  const manifest = {
    exportDate: new Date().toISOString(),
    totalRecipes: recipes.length,
    recipes: recipes.map((recipe) => ({
      id: recipe.id,
      name: recipe.name,
      email: recipe.email,
      recipeText: recipe.recipe_text,
      images: (imagesByRecipeId.get(recipe.id) || []).map((img) => ({
        path: img.storage_path,
        uploadedAt: img.created_at,
      })),
      submittedAt: recipe.created_at,
    })),
  };

  // Create ZIP archive
  const archive = Archive("zip", { zlib: { level: 9 } });
  const chunks: Uint8Array[] = [];

  return new Promise(async (resolve, reject) => {
    archive.on("data", (data) => chunks.push(data));
    archive.on("error", (err) => reject(err));
    archive.on("end", () => {
      resolve(Buffer.concat(chunks));
    });

    // Add manifest
    archive.append(Buffer.from(JSON.stringify(manifest, null, 2)), {
      name: "recipes.json",
    });

    // Download and add images
    for (const [recipeId, recipeImages] of imagesByRecipeId) {
      const recipe = recipes.find((r) => r.id === recipeId);
      if (!recipe) continue;

      for (const img of recipeImages) {
        try {
          const { data, error } = await supabaseAdmin.storage
            .from("wedding-recipes")
            .download(img.storage_path);

          if (!error && data) {
            const buffer = await data.arrayBuffer();
            const fileName = img.storage_path.split("/").pop() || "image";
            archive.append(Buffer.from(buffer), {
              name: `images/${recipe.name.replace(/\s+/g, "_")}/${fileName}`,
            });
          }
        } catch (err) {
          console.error(`Failed to download image ${img.storage_path}:`, err);
        }
      }
    }

    archive.finalize();
  });
}
