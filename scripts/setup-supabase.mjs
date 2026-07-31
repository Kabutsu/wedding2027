#!/usr/bin/env node

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function setupTables() {
  console.log("🚀 Setting up Supabase database...\n");

  // Check if recipes table exists
  const { error: recipesError } = await supabaseAdmin
    .from("recipes")
    .select("*")
    .limit(1);

  if (!recipesError) {
    console.log("✓ recipes table already exists");
  } else if (recipesError.code === "PGRST116") {
    console.log("✗ recipes table does not exist");
    console.log("\nRunning SQL to create tables...");

    const sql = `
      CREATE TABLE recipes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        recipe_text TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );

      CREATE INDEX recipes_email_idx ON recipes(email);
      CREATE INDEX recipes_created_at_idx ON recipes(created_at);

      CREATE TABLE recipe_images (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
        storage_path TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );

      CREATE INDEX recipe_images_recipe_id_idx ON recipe_images(recipe_id);
    `;

    // Try to execute via RPC (won't work) but at least provide useful error
    console.log("\n⚠️  Unable to create tables automatically.");
    console.log("Please create them manually:");
    console.log("\n1. Go to: https://app.supabase.com/project/xzpylrvwsrxihxvlrkkd/sql/new");
    console.log("2. Paste and execute this SQL:\n");
    console.log(sql);
  } else {
    console.log("✗ Error checking recipes table:", recipesError.message);
  }

  // Check recipe_images table
  const { error: imagesError } = await supabaseAdmin
    .from("recipe_images")
    .select("*")
    .limit(1);

  if (!imagesError) {
    console.log("✓ recipe_images table already exists");
  } else if (imagesError.code !== "PGRST116") {
    console.log("✗ Error checking recipe_images table:", imagesError.message);
  }
}

async function setupBucket() {
  console.log("\n🏺 Setting up storage bucket...\n");

  const { data: buckets, error: listError } = await supabaseAdmin.storage
    .listBuckets();

  if (listError) {
    console.log("✗ Error listing buckets:", listError.message);
    return;
  }

  const bucketExists = buckets.some((b) => b.name === "wedding-recipes");

  if (bucketExists) {
    console.log("✓ wedding-recipes bucket already exists");
  } else {
    console.log("Creating wedding-recipes bucket...");

    const { error: createError } = await supabaseAdmin.storage.createBucket(
      "wedding-recipes",
      {
        public: false,
        fileSizeLimit: 52428800, // 50MB
      }
    );

    if (createError) {
      console.log("✗ Error creating bucket:", createError.message);
      console.log(
        "\nPlease create it manually in the Supabase dashboard:"
      );
      console.log("1. Go to: https://app.supabase.com/project/xzpylrvwsrxihxvlrkkd/storage/buckets");
      console.log('2. Click "New bucket"');
      console.log('3. Name it "wedding-recipes"');
      console.log("4. Set to Private");
    } else {
      console.log("✓ wedding-recipes bucket created");
    }
  }
}

async function main() {
  try {
    await setupTables();
    await setupBucket();
    console.log("\n✅ Setup complete!\n");
  } catch (error) {
    console.error("Setup failed:", error);
    process.exit(1);
  }
}

main();
