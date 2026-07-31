import { supabaseAdmin } from "@/lib/supabase";

const RECIPES_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    recipe_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
  );

  CREATE INDEX IF NOT EXISTS recipes_email_idx ON recipes(email);
  CREATE INDEX IF NOT EXISTS recipes_created_at_idx ON recipes(created_at);
`;

const RECIPE_IMAGES_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS recipe_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
  );

  CREATE INDEX IF NOT EXISTS recipe_images_recipe_id_idx ON recipe_images(recipe_id);
`;

export async function setupDatabase() {
  if (!supabaseAdmin) {
    throw new Error("Supabase admin client not configured");
  }

  console.log("Setting up database schema...");

  // Check if tables exist by trying to query them
  const { error: recipesCheckError } = await supabaseAdmin
    .from("recipes")
    .select("*")
    .limit(1);

  const { error: imagesCheckError } = await supabaseAdmin
    .from("recipe_images")
    .select("*")
    .limit(1);

  if (!recipesCheckError) {
    console.log("✓ recipes table already exists");
  }

  if (!imagesCheckError) {
    console.log("✓ recipe_images table already exists");
  }

  if (!recipesCheckError && !imagesCheckError) {
    console.log("✓ All tables already exist!");
    return true;
  }

  // Tables don't exist - we need to create them
  // Try to use SQL execution via stored procedure
  console.log(
    "Tables not found. Please create them manually via Supabase dashboard:"
  );
  console.log("\n1. Go to Supabase dashboard > SQL Editor");
  console.log("2. Create new query and paste this SQL:");
  console.log(
    "\n" +
      RECIPES_TABLE_SQL +
      "\n\n" +
      RECIPE_IMAGES_TABLE_SQL
  );
  console.log("\n3. Execute the query");

  return false;
}

export async function setupStorage() {
  if (!supabaseAdmin) {
    throw new Error("Supabase admin client not configured");
  }

  console.log("Setting up storage bucket...");

  const { data: buckets, error: listError } = await supabaseAdmin.storage
    .listBuckets();

  if (listError) {
    console.error("Error listing buckets:", listError);
    return false;
  }

  const bucketExists = buckets.some((b) => b.name === "wedding-recipes");

  if (bucketExists) {
    console.log("✓ wedding-recipes bucket already exists");
    return true;
  }

  console.log("Creating wedding-recipes bucket...");

  const { error: createError } = await supabaseAdmin.storage.createBucket(
    "wedding-recipes",
    {
      public: false,
      fileSizeLimit: 52428800, // 50MB
    }
  );

  if (createError) {
    console.error("Error creating bucket:", createError);
    console.log(
      "Please create the bucket manually in the Supabase dashboard."
    );
    return false;
  }

  console.log("✓ wedding-recipes bucket created");
  return true;
}
