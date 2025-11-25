import { SearchParams } from "next/dist/server/request/search-params";
import Image from "next/image";

export default async function SharePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const pseudo = params.pseudo || "Nouveau membre";
  const imageParam = params.image;

  // Si c'est une URL UploadThing (utfs.io ou ufs.sh), l'utiliser telle quelle
  // Sinon, extraire le pathname pour les images localhost
  let imageSrc = imageParam;
  if (imageParam && typeof imageParam === "string") {
    // Si c'est une URL UploadThing, l'utiliser directement
    if (imageParam.includes("utfs.io") || imageParam.includes("ufs.sh")) {
      imageSrc = imageParam;
    } else {
      // Pour les URLs localhost, extraire le pathname
      try {
        const url = new URL(imageParam);
        imageSrc = url.pathname;
      } catch {
        imageSrc = imageParam;
      }
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Félicitations {pseudo} 🎉</h1>
      {imageSrc && typeof imageSrc === "string" && (
        <Image src={imageSrc} width={300} height={100} alt="Certification" />
      )}
    </div>
  );
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  // Convertir l'URL de l'image en URL absolue si nécessaire
  let absoluteImageUrl = params.image;
  if (absoluteImageUrl && typeof absoluteImageUrl === "string") {
    // Si c'est un chemin relatif, le convertir en URL absolue
    if (!absoluteImageUrl.startsWith("http")) {
      absoluteImageUrl = `https://engagement-leucemie.vercel.app${absoluteImageUrl}`;
    }
  }

  return {
    title: `Félicitations ${params.pseudo}`,
    description: `${params.pseudo} vient de rejoindre notre association !`,
    openGraph: {
      title: `Félicitations ${params.pseudo}`,
      description: `${params.pseudo} vient de rejoindre notre association !`,
      images: [absoluteImageUrl],
      url: `https://engagement-leucemie.vercel.app/share?pseudo=${params.pseudo}&image=${params.image}`,
      type: "article",
    },
  };
}
