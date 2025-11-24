"use client";

import Preview from "@/components/Preview";
import { Upload } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [status, setStatus] = useState<string | null>(null);
  const [previewShow, setPreviewShow] = useState<boolean>(true);

  const handleSubmit = async () => {
    setStatus("Sending");
    await setTimeout(() => {}, 3000);
    setStatus("Envoyé");
  };

  return (
    <main className="w-full min-h-screen bg-lime-100">
      <h1 className="text-center text-3xl pt-12 pb-4">
        Créer un certificat d&apos;engagement
      </h1>
      <p className="text-center text-zinc-600">
        Remplissez les champs suivants pour créer et recevoir un certificat à
        partager
      </p>
      <div className="flex flex-row pt-8 h-full px-8 gap-8">
        <div className="w-1/2 bg-white h-full rounded-2xl p-4 shadow-md">
          <form action="" className="space-y-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="pseudo">Pseudonyme</label>
              <input
                type="text"
                id="pseudo"
                className="ring-0 py-3 px-4 rounded-full bg-lime-100 text-lime-900 placeholder:text-lime-900 border-2"
                placeholder="Exemple : SuperMan"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email">Email</label>

              <input
                type="email"
                id="email"
                className="ring-0 py-3 px-4 rounded-full bg-lime-100 text-lime-900 placeholder:text-lime-900 border-2"
                placeholder="Exemple : johndoe@exemple.com"
              />

              <p className="text-xs">
                Aucune donnée n&apos;est recueilli. L&apos;email sert uniquement
                à vous envoyer le certificat
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="description">Description personnalisée</label>

              <textarea
                rows={3}
                id="description"
                className="rounded-2xl p-4 bg-lime-100 text-lime-900 placeholder:text-lime-900 border-2 min-h-16"
                placeholder="Super doneur"
              />
            </div>

            <div className="h-24 overflow-hidden w-full rounded-2xl bg-lime-100 border border-dashed p-4 relative cursor-pointer">
              <input
                type="file"
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              />

              <div className="pointer-events-none">
                <Upload />
              </div>
            </div>
          </form>
        </div>
        {previewShow && <Preview />}
      </div>
    </main>
  );
}
