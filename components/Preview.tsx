import { toPng } from "html-to-image";
import { Award, Heart, Share2 } from "lucide-react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

interface PreviewProps {
  pseudo?: string;
  description?: string;
  avatarUrl?: string | null;
  certificateColor?: string;
}

export interface PreviewRef {
  downloadCertificate: () => Promise<string | null>;
}

const Preview = forwardRef<PreviewRef, PreviewProps>(
  (
    {
      pseudo = "",
      description = "",
      avatarUrl = null,
      certificateColor = "#10b981",
    },
    ref
  ) => {
    const [zoom, setZoom] = useState(1);
    const certificateRef = useRef<HTMLDivElement>(null);

    function adjustBrightness(color: string, amount: number): string {
      const hex = color.replace("#", "");
      const r = Math.max(
        0,
        Math.min(255, parseInt(hex.substr(0, 2), 16) + amount)
      );
      const g = Math.max(
        0,
        Math.min(255, parseInt(hex.substr(2, 2), 16) + amount)
      );
      const b = Math.max(
        0,
        Math.min(255, parseInt(hex.substr(4, 2), 16) + amount)
      );
      return `#${r.toString(16).padStart(2, "0")}${g
        .toString(16)
        .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    }

    const gradientStyle = {
      background: `linear-gradient(to bottom right, ${certificateColor}, ${adjustBrightness(
        certificateColor,
        -20
      )}, ${adjustBrightness(certificateColor, -40)})`,
    };

    useEffect(() => {
      const updateZoom = () => {
        const width = window.innerWidth;

        if (width < 768) {
          setZoom(0.5);
        } else if (width < 1024) {
          setZoom(0.65);
        } else if (width < 1280) {
          setZoom(0.8);
        } else if (width < 1536) {
          setZoom(0.9);
        } else {
          setZoom(1);
        }
      };

      updateZoom();
      window.addEventListener("resize", updateZoom);
      return () => window.removeEventListener("resize", updateZoom);
    }, []);

    useImperativeHandle(ref, () => ({
      downloadCertificate: async () => {
        if (!certificateRef.current) return null;

        try {
          const dataUrl = await toPng(certificateRef.current, {
            cacheBust: true,
            pixelRatio: 2,
          });

          const link = document.createElement("a");
          link.download = `certificat-engagement-${pseudo || "leucemie"}.png`;
          link.href = dataUrl;
          link.click();

          return dataUrl;
        } catch (error) {
          console.error("Erreur lors de la génération du certificat:", error);
          return null;
        }
      },
    }));

    return (
      <div
        className="w-full h-fit flex items-center justify-center"
        style={{ zoom }}
      >
        <div
          ref={certificateRef}
          className="w-full max-w-md aspect-9/16 rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-between relative overflow-hidden"
          style={gradientStyle}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-between h-full w-full">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-2">
                <Award className="w-10 h-10 text-white" strokeWidth={2} />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-wide">
                CERTIFICAT
              </h2>
              <h3 className="text-xl font-semibold text-white/90">
                D&apos;ENGAGEMENT
              </h3>
              <div className="w-24 h-1 bg-white/40 mx-auto rounded-full"></div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center space-y-6 py-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/50 overflow-hidden flex items-center justify-center shadow-xl">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-white/30 to-white/10 flex items-center justify-center">
                      <Heart
                        className="w-16 h-16 text-white/70"
                        strokeWidth={1.5}
                      />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl">✨</span>
                </div>
              </div>

              <div className="text-center space-y-2 px-4">
                <h4 className="text-3xl font-bold text-white drop-shadow-lg">
                  {pseudo || "Votre pseudo"}
                </h4>
                {description && (
                  <p className="text-base text-white/90 font-medium italic">
                    &quot;{description}&quot;
                  </p>
                )}
              </div>

              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 border border-white/30 shadow-lg">
                <p className="text-center text-white text-sm leading-relaxed">
                  <span className="font-bold text-base block mb-2">
                    🎉 Félicitations ! 🎉
                  </span>
                  Vous avez pris l&apos;engagement de soutenir
                  <br />
                  la lutte contre la leucémie.
                  <br />
                  <span className="font-semibold">
                    Votre geste compte énormément !
                  </span>
                </p>
              </div>
            </div>

            <div className="space-y-4 w-full">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-center gap-2 text-white">
                  <Share2 className="w-5 h-5" />
                  <p className="text-sm font-semibold">
                    Partagez votre engagement
                  </p>
                </div>
                <p className="text-xs text-white/80 text-center mt-1">
                  Inspirez votre entourage sur les réseaux sociaux
                </p>
              </div>

              <div className="text-center">
                <p className="text-white/90 text-sm font-medium">
                  Ensemble, faisons la différence 💪
                </p>
                <p className="text-white/70 text-xs mt-1">
                  #EngagementLeucémie #Solidarité
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

Preview.displayName = "Preview";

export default Preview;
