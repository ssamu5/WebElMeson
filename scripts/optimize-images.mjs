/**
 * One-time script to optimize reference images for web use.
 * Run with: node scripts/optimize-images.mjs
 * Converts large PNG/JPG files to compressed WebP format.
 */

import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "Fotos_Referencia");
const DST = path.join(ROOT, "public", "images");

const tasks = [
  {
    input: "Logo_El_Meson.png",
    output: "logo.webp",
    width: 800,
    quality: 90,
  },
  {
    input: "Logo_El_Meson.png",
    output: "logo-sm.webp",
    width: 300,
    quality: 90,
  },
  {
    input: "Foodtruck_Frente.png",
    output: "foodtruck-frente.webp",
    width: 1920,
    quality: 82,
  },
  {
    input: "Foodtruck_Derecha.png",
    output: "foodtruck-derecha.webp",
    width: 1200,
    quality: 82,
  },
  {
    input: "Foodtruck_Izquierda.png",
    output: "foodtruck-izquierda.webp",
    width: 1200,
    quality: 82,
  },
  {
    input: "Caja_Exterior.jpg",
    output: "caja-exterior.webp",
    width: 1200,
    quality: 82,
  },
  {
    input: "Caja_Interior.jpg",
    output: "caja-interior.webp",
    width: 1200,
    quality: 82,
  },
  {
    input: "Camiseta.JPG",
    output: "camiseta.webp",
    width: 1200,
    quality: 82,
  },
  {
    input: "Neon_Burger_FT.jpeg",
    output: "neon-burger.webp",
    width: 600,
    quality: 90,
  },
  {
    input: "Neon_Nombre_FT.jpeg",
    output: "neon-nombre.webp",
    width: 800,
    quality: 90,
  },
];

async function run() {
  console.log("🍔 Optimizing El Mesón images...\n");

  for (const task of tasks) {
    const inputPath = path.join(SRC, task.input);
    const outputPath = path.join(DST, task.output);

    try {
      const info = await sharp(inputPath)
        .resize({ width: task.width, withoutEnlargement: true })
        .webp({ quality: task.quality })
        .toFile(outputPath);

      const sizeMB = (info.size / 1024 / 1024).toFixed(2);
      console.log(`✅ ${task.input} → ${task.output} (${sizeMB} MB)`);
    } catch (err) {
      console.error(`❌ Failed: ${task.input}`, err.message);
    }
  }

  console.log("\n✨ Done! Check public/images/ for the optimized files.");
}

run();
