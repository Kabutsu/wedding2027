import type { APIRoute } from "astro";
import { exportRecipesAsZip } from "@/lib/export-recipes";

export const GET: APIRoute = async (context) => {
  try {
    const zipBuffer = await exportRecipesAsZip();

    return new Response(zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition":
          'attachment; filename="wedding-recipes.zip"',
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return context.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to export recipes",
      },
      { status: 500 }
    );
  }
};
