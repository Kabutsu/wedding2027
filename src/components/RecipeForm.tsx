import { useState, useLayoutEffect } from "preact/hooks";
import type { ComponentChildren } from "preact";

import foodImage from "@/assets/images/crepe.jpg";
import pizzaImg from "@/assets/images/sam-pizza.jpg";
import DetailsCard from './details-card';
import { supabaseBrowser } from "@/lib/supabase-browser";

const MAX_IMAGES = 5;

export default function RecipeForm(): ComponentChildren {
  const [step, setStep] = useState<"choice" | "form" | "submitting" | "success">(
    "choice"
  );
  const [name, setName] = useState("");
  const [recipeText, setRecipeText] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState("");

  const handleSkip = () => {
    const rsvpLink = import.meta.env.PUBLIC_RSVP_LINK;
    window.open(rsvpLink, "_blank");
  };

  const handleFileSelect = (e: Event) => {
    const input = e.target as HTMLInputElement;
    if (!input.files) return;

    const newFiles = Array.from(input.files);
    const totalFiles = images.length + newFiles.length;

    if (totalFiles > MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} images allowed`);
      input.value = "";
      return;
    }

    setImages([...images, ...newFiles]);
    input.value = "";
    setError("");
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (!recipeText.trim() && images.length === 0) {
      setError("Please provide either recipe text or at least one image");
      return;
    }

    setStep("submitting");

    try {
      const response = await fetch("/api/submit-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          recipe_text: recipeText,
          images: images.map((img) => ({
            name: img.name,
            type: img.type,
            size: img.size,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to submit recipe");
        setStep("form");
        return;
      }

      // Upload image bytes directly to Supabase Storage so they never
      // pass through the serverless function's request body limit
      const uploadedPaths: string[] = [];
      for (const upload of data.uploads ?? []) {
        const file = images.find((img) => upload.path.endsWith(img.name));
        if (!file) continue;

        const { error: uploadError } = await supabaseBrowser.storage
          .from("wedding-recipes")
          .uploadToSignedUrl(upload.path, upload.token, file);

        if (!uploadError) {
          uploadedPaths.push(upload.path);
        }
      }

      if (uploadedPaths.length > 0) {
        await fetch("/api/confirm-recipe-images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipeId: data.recipeId, paths: uploadedPaths }),
        });
      }

      setStep("success");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred. Please try again."
      );
      setStep("form");
    }
  };

  useLayoutEffect(() => {
    if (step === "success") {
      document.querySelector("#success-card")?.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [step]);

  if (step === "choice") {
    return (
      <DetailsCard
        id="choice-card"
        title="Share Your Recipe"
        details="Would you like to upload a recipe for our wedding guestbook? Once uploaded, you can also proceed to RSVP for our wedding - or you can skip to RSVP now and come back to upload your recipe anytime."
        button={{
          text: "Yes, Upload Recipe",
          onClick: () => setStep("form"),
        }}
        secondaryButton={{
          text: "Skip to RSVP",
          onClick: handleSkip,
        }}
        img={foodImage.src}
      />
    );
  }

  if (step === "submitting") {
    return (
      <div class="relative font-(family-name:--font-inter) w-[90svw] h-auto sm:w-lg md:w-3xl lg:w-4xl xl:w-240 bg-orange-pastel-light rounded-2xl border-orange-pastel-light border-4 shadow-lg overflow-hidden p-8 sm:p-12">
        <div class="flex flex-col items-center justify-center gap-6">
          <div class="w-12 h-12 border-4 border-mauve-200 border-t-purple-pastel rounded-full animate-spin"></div>
          <div class="flex flex-col items-center gap-2">
            <p class="text-center text-lg font-(family-name:--font-roca) text-purple-pastel font-semibold">
              Uploading your recipe...
            </p>
            <p class="text-center text-sm text-mauve-700">
              This will just take a moment
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <DetailsCard
        id="success-card"
        title="✓ Thank You!"
        details="Your recipe has been added to our guestbook. We can't wait to share these memories together! If you haven't already, please proceed to RSVP for our wedding."
        button={{
          text: "Go to RSVP",
          href: import.meta.env.PUBLIC_RSVP_LINK,
          newPage: true,
        }}
        img={pizzaImg.src}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} class="relative font-(family-name:--font-inter) w-[90svw] h-auto sm:w-lg md:w-3xl lg:w-4xl xl:w-240 max-w-full bg-orange-pastel-light rounded-2xl border-orange-pastel-light border-4 shadow-lg overflow-hidden p-6 sm:p-8 flex flex-col gap-6">
      <div>
        <h3 class="text-2xl sm:text-3xl font-bold font-(family-name:--font-roca) text-purple-pastel mb-6">
          Your Recipe
        </h3>
      </div>

      <div class="flex flex-col gap-2">
        <label htmlFor="name" class="font-semibold text-purple-pastel text-sm">
          Your Name *
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onInput={(e) => setName((e.target as HTMLInputElement).value)}
          placeholder="Tell us your name..."
          class="px-4 py-3 border-2 border-mauve-300 rounded-lg focus:outline-none focus:border-purple-pastel transition-colors bg-white text-mauve-950"
          required
        />
      </div>

      <div class="flex flex-col gap-2">
        <label htmlFor="recipe" class="font-semibold text-purple-pastel text-sm">
          Recipe Details
        </label>
        <textarea
          id="recipe"
          value={recipeText}
          onInput={(e) => setRecipeText((e.target as HTMLTextAreaElement).value)}
          placeholder="Share your recipe, ingredients, instructions, family history, or food memories... 📝"
          class="px-4 py-3 border-2 border-mauve-300 rounded-lg focus:outline-none focus:border-purple-pastel transition-colors bg-white text-mauve-950 h-32 resize-y"
        />
      </div>

      <div class="flex flex-col gap-3">
        <label htmlFor="images" class="font-semibold text-purple-pastel text-sm">
          Recipe Photos <span class="text-mauve-700">({images.length}/{MAX_IMAGES})</span>
        </label>
        <div class="relative">
          <input
            id="images"
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            class="hidden"
          />
          <label
            htmlFor="images"
            class="block border-2 border-dashed border-purple-pastel rounded-lg p-6 text-center cursor-pointer hover:bg-orange-pastel-light transition-colors"
          >
            <div class="text-3xl mb-2">📸</div>
            <p class="text-purple-pastel font-semibold">
              Click to upload photos
            </p>
            <p class="text-sm text-mauve-700 mt-1">
              or drag and drop
            </p>
            <p class="text-xs text-mauve-600 mt-2">
              JPG, PNG, or WebP • Max 10MB per image
            </p>
          </label>
        </div>
      </div>

      {images.length > 0 && (
        <div class="flex flex-col gap-3">
          <p class="font-semibold text-purple-pastel">Your photos:</p>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((img, idx) => (
              <div
                key={idx}
                class="relative group rounded-lg overflow-hidden"
              >
                <img
                  src={URL.createObjectURL(img)}
                  alt={`Preview ${idx + 1}`}
                  class="w-full h-24 sm:h-36 object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  class="absolute inset-0 bg-black/15 sm:bg-black/50 sm:opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end sm:items-center sm:justify-center px-1.5 py-1 sm:p-0 cursor-pointer"
                >
                  <div class="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg">
                    ×
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div class="bg-purple-pastel/30 border border-purple-pastel text-purple-pastel-dark px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div class="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end-safe font-(family-name:--font-providence) text-lg lg:text-xl">
        <button
          type="button"
          onClick={() => setStep("choice")}
          class="px-6 py-3 cursor-pointer bg-mauve-200 text-mauve-950 rounded-full hover:bg-mauve-300 transition-colors duration-300 font-semibold"
        >
          Back
        </button>
        <button
          type="submit"
          class="px-6 py-3 cursor-pointer bg-purple-pastel text-white rounded-full hover:bg-purple-pastel-dark/90 transition-colors duration-300 font-semibold"
        >
          Submit Recipe
        </button>
      </div>
    </form>
  );
}
