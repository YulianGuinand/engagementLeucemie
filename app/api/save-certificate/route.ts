import { NextRequest, NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

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

    // Convertir le buffer en File pour UploadThing
    const file = new File([imageBuffer], filename, { type: "image/png" });

    // Uploader vers UploadThing
    const uploadResponse = await utapi.uploadFiles(file);

    if (uploadResponse.error) {
      console.error("Erreur UploadThing:", uploadResponse.error);
      return NextResponse.json(
        { error: "Erreur lors de l'upload du certificat" },
        { status: 500 }
      );
    }

    // Retourner l'URL publique du certificat
    const publicUrl = uploadResponse.data?.url;

    return NextResponse.json({
      success: true,
      path: publicUrl, // URL complète de UploadThing
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
