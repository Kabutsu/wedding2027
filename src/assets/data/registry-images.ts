import type { ImageMetadata } from "astro";

import aerial from "@/assets/images/aerial.jpg";
import food from "@/assets/images/food.jpg";
import crepe from "@/assets/images/crepe.jpg";
import accom from "@/assets/images/accom.jpg";
import venueAerial from "@/assets/images/venue-aerial.jpg";
import wine from "@/assets/images/wine.png";
import party from "@/assets/images/party.jpg";
import discoBall from "@/assets/images/disco-ball.png";

export const registryImages: Record<string, ImageMetadata> = {
  "aerial.jpg": aerial,
  "food.jpg": food,
  "crepe.jpg": crepe,
  "accom.jpg": accom,
  "venue-aerial.jpg": venueAerial,
  "wine.png": wine,
  "party.jpg": party,
  "disco-ball.png": discoBall,
};
