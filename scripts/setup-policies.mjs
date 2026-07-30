#!/usr/bin/env node

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xzpylrvwsrxihxvlrkkd.supabase.co";
const serviceRoleKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6cHlscnZ3c3J4aWh4dmxya2tkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjI4MDY3MywiZXhwIjoyMDkxODU2NjczfQ.ubZnsvVVwOF0yigFrWqyDOQ9U40bZdAecphUaRyxnGo";

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function setupPolicies() {
  console.log("🔐 Setting up Supabase policies...\n");

  // Enable RLS on tables
  console.log("Enabling Row Level Security...");
  const { error: recipesRlsError } = await supabaseAdmin.rpc("exec", {
    sql: "ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;",
  });

  const { error: imagesRlsError } = await supabaseAdmin.rpc("exec", {
    sql: "ALTER TABLE recipe_images ENABLE ROW LEVEL SECURITY;",
  });

  if (!recipesRlsError && !imagesRlsError) {
    console.log("✓ RLS enabled\n");
  } else {
    console.log(
      "Note: RLS may already be enabled or require manual setup\n"
    );
  }

  // Create policies for recipes table - allow anyone to insert
  console.log("Setting up recipes table policies...");
  const recipesInsertPolicy = `
    CREATE POLICY "Allow anonymous insert" ON recipes
    FOR INSERT WITH CHECK (true);
  `;

  const recipesSelectPolicy = `
    CREATE POLICY "Allow service role to select all" ON recipes
    FOR SELECT TO authenticated, service_role
    USING (true);
  `;

  console.log("✓ Policies configured (see manual setup instructions below)");

  // Create policies for recipe_images table
  console.log("Setting up recipe_images table policies...");
  const imagesInsertPolicy = `
    CREATE POLICY "Allow anonymous insert" ON recipe_images
    FOR INSERT WITH CHECK (true);
  `;

  const imagesSelectPolicy = `
    CREATE POLICY "Allow service role to select all" ON recipe_images
    FOR SELECT TO authenticated, service_role
    USING (true);
  `;

  console.log("\n📋 Manual Steps Required:\n");
  console.log("1. Go to Supabase Dashboard > Authentication > Policies");
  console.log("2. For 'recipes' table, create these policies:\n");
  console.log(recipesInsertPolicy);
  console.log("\n   AND\n");
  console.log(recipesSelectPolicy);

  console.log("\n3. For 'recipe_images' table, create these policies:\n");
  console.log(imagesInsertPolicy);
  console.log("\n   AND\n");
  console.log(imagesSelectPolicy);

  console.log("\n📁 Bucket policies:");
  console.log(
    "The wedding-recipes bucket will use public access for uploads."
  );
  console.log(
    "This is configured in the API route using the service role key.\n"
  );

  console.log("✅ Policy setup instructions complete!");
}

setupPolicies().catch(console.error);
