import type { ImageMetadata } from "astro";

import skiGear from "@/assets/images/registry-ski.jpg";
import daySled from "@/assets/images/registry-sled.jpg";
import skiPass from "@/assets/images/registry-lift.jpg";
import hotChocolate from "@/assets/images/registry-hot-chocolate-2.jpg";
import wine from "@/assets/images/registry-wine.jpg";
import crepe from "@/assets/images/registry-crepe-3.jpg";
import nightSled from "@/assets/images/registry-night-sled-2.jpg";
import party from "@/assets/images/registry-party.jpg";
import spa from "@/assets/images/registry-spa.jpg";
import surprise from "@/assets/images/registry-surprise-1.jpg";
import genepi from "@/assets/images/registry-cocktail-1.jpg";
import bobSleigh from "@/assets/images/registry-bobsled.jpg";

export const registryImages: Record<string, ImageMetadata> = {
  "ski-pass.jpg": skiPass,
  "wine.jpg": wine,
  "crepe.jpg": crepe,
  "night-sled.jpg": nightSled,
  "ski-gear.jpg": skiGear,
  "party.jpg": party,
  "spa.jpg": spa,
  "surprise.jpg": surprise,
  "hot-chocolate.jpg": hotChocolate,
  "day-sledding.jpg": daySled,
  "genepi.png": genepi,
  "bob-sleigh.jpg": bobSleigh,
};
