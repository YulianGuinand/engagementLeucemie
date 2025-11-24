"use client";

import Button from "@/components/Button";
import Footer from "@/components/Footer";
import Preview, { PreviewRef } from "@/components/Preview";
import { Palette, Upload } from "lucide-react";
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

    setStatus("📧 Envoi de l'email...");

    // Envoyer par email
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
        }),
      });

      if (response.ok) {
        setStatus("✅ Certificat envoyé par email !");
        setTimeout(() => setStatus(null), 5000);
      } else {
        setStatus("❌ Erreur lors de l'envoi");
        setTimeout(() => setStatus(null), 3000);
      }
    } catch (error) {
      console.error("Erreur:", error);
      setStatus("❌ Erreur lors de l'envoi");
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

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 w-full bg-zinc-100 pb-28">
        <h1 className="text-center text-3xl pt-12 pb-4">
          Créer un certificat d&apos;engagement
        </h1>
        <p className="text-center text-zinc-600">
          Remplissez les champs suivants pour créer et recevoir un certificat à
          partager
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
