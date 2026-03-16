"use client";

import Button from "@/components/Button";
import Footer from "@/components/Footer";
import Preview, { PreviewRef } from "@/components/Preview";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [status, setStatus] = useState<string | null>(null);
  const [previewShow, setPreviewShow] = useState<boolean>(false);
  const [prenom, setPrenom] = useState<string>("");
  const [nom, setNom] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [certificateDataUrl, setCertificateDataUrl] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const previewRef = useRef<PreviewRef>(null);

  // Empêcher le reload pendant le chargement
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isLoading) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setStatus("Veuillez entrer votre email");
      setTimeout(() => setStatus(null), 3000);
      return;
    }

    setIsLoading(true);
    setStatus("Génération du certificat en cours...");

    try {
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
        setStatus("Erreur lors de la génération");
        setTimeout(() => setStatus(null), 3000);
        return;
      }

      setCertificateDataUrl(imageDataUrl);

      setStatus("Sauvegarde du certificat...");

      let certificatePath = "";
      try {
        const saveResponse = await fetch("/api/save-certificate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageDataUrl,
            pseudo: `${prenom} ${nom}`.trim(),
          }),
        });

        if (saveResponse.ok) {
          const saveData = await saveResponse.json();
          certificatePath = saveData.path;
          // console.log("Certificat sauvegardé avec le chemin:", certificatePath);
        } else {
          // console.error(
          //   "Erreur réponse API save-certificate:",
          //   await saveResponse.text(),
          // );
        }
      } catch (error) {
        // console.error("Erreur lors de la sauvegarde du certificat:", error);
      }

      if (!certificatePath) {
        // console.warn(
        //   "Aucun chemin de certificat - l'email sera envoyé sans lien de partage personnalisé",
        // );
      }

      setStatus("Envoi de l'email...");

      const response = await fetch("/api/send-certificate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          pseudo: `${prenom} ${nom}`.trim(),
          imageDataUrl,
          certificatePath,
        }),
      });

      if (response.ok) {
        setStatus("Certificat envoyé par email avec succès !");
        setTimeout(() => setStatus(null), 5000);
      } else {
        setStatus("Erreur lors de l'envoi");
        setTimeout(() => setStatus(null), 3000);
      }
    } catch (error) {
      // console.error("Erreur:", error);
      setStatus("Erreur lors de l'envoi");
      setTimeout(() => setStatus(null), 3000);
    } finally {
      setIsLoading(false);
    }
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

        <div className="flex flex-col lg:flex-row items-center pt-8 h-full px-4 md:px-6 lg:px-8 gap-4 lg:gap-8 min-h-[500px] lg:min-h-[700px]">
          <div
            className={`w-full lg:w-1/2 bg-white h-full rounded-2xl p-4 shadow-md ${
              previewShow ? "hidden lg:block" : "block"
            }`}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="prenom">Prénom</label>
                <input
                  type="text"
                  id="prenom"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  className="ring-0 py-3 px-4 rounded-full bg-zinc-100 text-zinc-900 placeholder:text-zinc-900 border-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Exemple : Jean"
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="nom">Nom</label>
                <input
                  type="text"
                  id="nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="ring-0 py-3 px-4 rounded-full bg-zinc-100 text-zinc-900 placeholder:text-zinc-900 border-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Exemple : Dupont"
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  className="ring-0 py-3 px-4 rounded-full bg-zinc-100 text-zinc-900 placeholder:text-zinc-900 border-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Exemple : johndoe@exemple.com"
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
                <p className="text-xs">
                  Aucune donnée n&apos;est recueilli. L&apos;email sert
                  uniquement à vous envoyer le certificat
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 rounded-full bg-[#26a64e] cursor-pointer hover:bg-[#29b254] transition-colors text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#26a64e] flex items-center justify-center gap-2"
              >
                {isLoading && (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                {status || "Obtenir son certificat"}
              </button>
            </form>
          </div>

          <div
            className={`w-full lg:w-1/2 ${
              previewShow ? "flex" : "hidden lg:flex"
            }`}
          >
            <Preview ref={previewRef} prenom={prenom} nom={nom} />
          </div>
        </div>

        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-zinc-100 border-t border-zinc-200 flex justify-center">
          <Button onClick={() => setPreviewShow(!previewShow)}>
            {previewShow ? "Retour au formulaire" : "Voir le certificat"}
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
