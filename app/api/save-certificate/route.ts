import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

export async function POST(request: NextRequest) {
  try {
    const { imageDataUrl, pseudo } = await request.json();

    if (!imageDataUrl) {
      return NextResponse.json(
        { error: "Image data URL requis" },
        { status: 400 }
      );
    }

    // Générer un nom de fichier unique avec timestamp et ID aléatoire
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .replace("T", "_")
      .split(".")[0];
    const randomId = Math.random().toString(36).substring(2, 8);
    const filename = `cert_${timestamp}_${randomId}.png`;

    // Convertir data URL en buffer
    const base64Data = imageDataUrl.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, "base64");

    // Chemin absolu vers le dossier public/certificates
    const publicDir = join(process.cwd(), "public", "certificates");
    const filePath = join(publicDir, filename);

    // Sauvegarder le fichier
    await writeFile(filePath, imageBuffer);

    // Retourner le chemin public relatif
    const publicPath = `/certificates/${filename}`;

    return NextResponse.json({
      success: true,
      path: publicPath,
      filename: filename,
    });
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du certificat:", error);
    return NextResponse.json(
      { error: "Erreur lors de la sauvegarde du certificat" },
      { status: 500 }
    );
  }
}
