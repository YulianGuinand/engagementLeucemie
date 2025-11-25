"use client";

import Button from "@/components/Button";
import Footer from "@/components/Footer";
import Preview, { PreviewRef } from "@/components/Preview";
import { Download, Palette, Share2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { ChromePicker } from "react-color";

export default function Home() {
  const [status, setStatus] = useState<string | null>(null);
  const [previewShow, setPreviewShow] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [pseudo, setPseudo] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [certificateColor, setCertificateColor] = useState<string>("#10b981");
  const [showSocialShare, setShowSocialShare] = useState<boolean>(false);
  const [certificateDataUrl, setCertificateDataUrl] = useState<string | null>(
    null
  );
  const previewRef = useRef<PreviewRef>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setStatus("❌ Veuillez entrer votre email");
      setTimeout(() => setStatus(null), 3000);
      return;
    }

    setStatus("⏳ Génération en cours...");

    const wasHidden = !previewShow;
    if (wasHidden) {
      setPreviewShow(true);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Générer le certificat et obtenir le dataUrl
    const imageDataUrl = await previewRef.current?.downloadCertificate();

    if (wasHidden) {
      setPreviewShow(false);
    }

    if (!imageDataUrl) {
      setStatus("❌ Erreur lors de la génération");
      setTimeout(() => setStatus(null), 3000);
      return;
    }

    setCertificateDataUrl(imageDataUrl);

    let certificatePath = "";
    try {
      const saveResponse = await fetch("/api/save-certificate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageDataUrl,
          pseudo,
        }),
      });

      if (saveResponse.ok) {
        const saveData = await saveResponse.json();
        certificatePath = saveData.path;
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du certificat:", error);
    }

    setStatus("📧 Envoi de l'email...");

    try {
      const response = await fetch("/api/send-certificate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          pseudo,
          imageDataUrl,
          certificatePath,
        }),
      });

      if (response.ok) {
        setStatus("Certificat envoyé par email !");
        setShowSocialShare(true);
        setTimeout(() => setStatus(null), 5000);
      } else {
        setStatus("Erreur lors de l'envoi");
        setTimeout(() => setStatus(null), 3000);
      }
    } catch (error) {
      console.error("Erreur:", error);
      setStatus("Erreur lors de l'envoi");
      setTimeout(() => setStatus(null), 3000);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        setSelectedImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        setSelectedImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreviewUrl(null);
  };

  const handleDownloadCertificate = () => {
    if (certificateDataUrl) {
      const link = document.createElement("a");
      link.download = `certificat-engagement-${pseudo || "leucemie"}.png`;
      link.href = certificateDataUrl;
      link.click();
    }
  };

  const handleShareFacebook = () => {
    const url = "https://engagement-leucemie.com";
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`;
    window.open(facebookUrl, "_blank", "width=600,height=400");
  };

  const handleShareLinkedIn = () => {
    const url = "https://engagement-leucemie.com";
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`;
    window.open(linkedInUrl, "_blank", "width=600,height=400");
  };

  const handleShareInstagram = () => {
    // Instagram ne permet pas de partage direct via URL
    // On télécharge l'image et on informe l'utilisateur
    handleDownloadCertificate();
    alert(
      "📸 Votre certificat a été téléchargé ! Vous pouvez maintenant le publier sur Instagram avec #EngagementLeucémie"
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 w-full bg-zinc-100 pb-28">
        <h1 className="text-center text-3xl pt-12 pb-4">
          Recevoir son certificat d&apos;engagement
        </h1>
        <p className="text-center text-zinc-600">
          Remplissez les champs suivants pour recevoir votre certificat
        </p>
        <div className="flex flex-row pt-8 h-full px-8 gap-8 min-h-[700px]">
          <div
            className={`w-full md:w-1/2 bg-white h-full rounded-2xl p-4 shadow-md ${
              previewShow ? "hidden md:block" : "block"
            }`}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="pseudo">Pseudonyme</label>
                <input
                  type="text"
                  id="pseudo"
                  value={pseudo}
                  onChange={(e) => setPseudo(e.target.value)}
                  className="ring-0 py-3 px-4 rounded-full bg-zinc-100 text-zinc-900 placeholder:text-zinc-900 border-2"
                  placeholder="Exemple : SuperMan"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  className="ring-0 py-3 px-4 rounded-full bg-zinc-100 text-zinc-900 placeholder:text-zinc-900 border-2"
                  placeholder="Exemple : johndoe@exemple.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="text-xs">
                  Aucune donnée n&apos;est recueilli. L&apos;email sert
                  uniquement à vous envoyer le certificat
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="description">Description personnalisée</label>
                <textarea
                  rows={3}
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="rounded-2xl p-4 bg-zinc-100 text-zinc-900 placeholder:text-zinc-900 border-2 min-h-16"
                  placeholder="Super doneur"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="color">Couleur du certificat</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="w-full py-3 px-4 rounded-full bg-zinc-100 border-2 flex items-center gap-3 hover:border-zinc-400 transition-colors"
                  >
                    <Palette className="w-5 h-5" />
                    <span>Choisir une couleur</span>
                    <div
                      className="ml-auto w-8 h-8 rounded-full border-2 border-white shadow"
                      style={{ backgroundColor: certificateColor }}
                    ></div>
                  </button>
                  {showColorPicker && (
                    <div className="absolute z-50 mt-2">
                      <div
                        className="fixed inset-0"
                        onClick={() => setShowColorPicker(false)}
                      />
                      <ChromePicker
                        color={certificateColor}
                        onChange={(color) => setCertificateColor(color.hex)}
                        disableAlpha
                      />
                    </div>
                  )}
                </div>
              </div>

              <div
                className={`min-h-24 w-full rounded-2xl bg-zinc-100 border-2 border-dashed p-4 relative cursor-pointer transition-all ${
                  isDragging ? "border-blue-500 bg-blue-50" : "border-zinc-300"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                {!imagePreviewUrl ? (
                  <div className="size-full pointer-events-none flex items-center justify-center flex-col gap-2">
                    <Upload className={isDragging ? "text-blue-500" : ""} />
                    <p
                      className={`text-xs ${
                        isDragging ? "text-blue-600" : "text-zinc-600"
                      }`}
                    >
                      {isDragging
                        ? "Déposez l'image ici"
                        : "Glissez-déposez une image ou cliquez pour sélectionner"}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="w-full h-48 rounded-lg overflow-hidden bg-zinc-200">
                      <img
                        src={imagePreviewUrl}
                        alt="Aperçu"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-zinc-600 truncate flex-1">
                        {selectedImage?.name}
                      </p>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="text-xs text-red-600 hover:text-red-800 ml-2 z-20"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-full bg-[#26a64e] cursor-pointer hover:bg-[#29b254] transition-colors text-white font-semibold"
              >
                {status || "Obtenir son certificat"}
              </button>

              {/* Section de partage social */}
              {showSocialShare && (
                <div className="mt-6 p-6 bg-linear-to-br from-yellow-50 to-amber-50 rounded-2xl border-2 border-yellow-200 shadow-md">
                  <div className="flex items-center gap-2 mb-4">
                    <Share2 className="w-5 h-5 text-amber-700" />
                    <h3 className="text-lg font-bold text-amber-900">
                      🌟 Partagez votre engagement !
                    </h3>
                  </div>

                  <p className="text-sm text-amber-800 mb-4">
                    Vous aussi vous pouvez nous aider à sensibiliser en publiant
                    sur vos réseaux
                  </p>

                  {/* Bouton de téléchargement */}
                  <button
                    type="button"
                    onClick={handleDownloadCertificate}
                    className="w-full py-3 px-4 mb-3 rounded-full bg-white border-2 border-amber-300 hover:border-amber-400 hover:bg-amber-50 transition-colors text-amber-900 font-semibold flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Download className="w-5 h-5" />
                    Télécharger mon certificat
                  </button>

                  <div className="space-y-2">
                    {/* Bouton Facebook */}
                    <button
                      type="button"
                      onClick={handleShareFacebook}
                      className="w-full py-3 px-4 rounded-full bg-[#1877f2] hover:bg-[#0c63d4] transition-colors text-white font-semibold shadow-sm"
                    >
                      📘 Partager sur Facebook
                    </button>

                    {/* Bouton LinkedIn */}
                    <button
                      type="button"
                      onClick={handleShareLinkedIn}
                      className="w-full py-3 px-4 rounded-full bg-[#0077b5] hover:bg-[#006399] transition-colors text-white font-semibold shadow-sm"
                    >
                      💼 Partager sur LinkedIn
                    </button>

                    {/* Bouton Instagram */}
                    <button
                      type="button"
                      onClick={handleShareInstagram}
                      className="w-full py-3 px-4 rounded-full bg-linear-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 transition-colors text-white font-semibold shadow-sm"
                    >
                      📸 Publier sur Instagram
                    </button>
                  </div>

                  <p className="text-xs text-amber-700 mt-4 text-center italic">
                    Utilisez le hashtag #EngagementLeucémie
                  </p>
                </div>
              )}
            </form>
          </div>

          <div
            className={`w-full md:w-1/2 ${
              previewShow ? "flex" : "hidden md:flex"
            }`}
          >
            <Preview
              ref={previewRef}
              pseudo={pseudo}
              description={description}
              avatarUrl={imagePreviewUrl}
              certificateColor={certificateColor}
            />
          </div>
        </div>

        <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-zinc-100 border-t border-zinc-200 flex justify-center">
          <Button onClick={() => setPreviewShow(!previewShow)}>
            {previewShow ? "Retour au formulaire" : "Voir le certificat"}
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
