import { toPng } from "html-to-image";
import { LayoutTemplate } from "lucide-react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

interface PreviewProps {
  pseudo?: string;
  signature?: string | null;
}

export interface PreviewRef {
  downloadCertificate: () => Promise<string | null>;
}

const CERTIFICATE_CONFIG = {
  1: {
    image: "/certificat_1_blank.webp",
    textColor: "#1f2937",
    fontClass: "font-serif italic",
    nameStyle: {
      top: "48%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
    nameFontSize: 40,
    dateStyle: { bottom: "21.25%", left: "29.25%" },
    dateFontSize: 16,
    datePrefix: "",
    signatureStyle: { bottom: "15%", left: "29.25%" },
    signatureMaxWidth: 180,
    signatureMaxHeight: 70,
  },
  2: {
    image: "/certificat_2_blank.webp",
    textColor: "#1f2937",
    fontClass: "font-serif italic",
    nameStyle: {
      top: "48%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
    nameFontSize: 40,
    dateStyle: { bottom: "21.35%", left: "29.5%" },
    dateFontSize: 16,
    datePrefix: "",
    signatureStyle: { bottom: "15%", left: "29.5%" },
    signatureMaxWidth: 180,
    signatureMaxHeight: 70,
  },
  3: {
    image: "/certificat_3_blank.webp",
    textColor: "#1f2937",
    fontClass: "font-serif italic",
    nameStyle: {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
    nameFontSize: 40,
    dateStyle: {
      bottom: "16%",  
      left: "27%",
    },
    dateFontSize: 16,
    datePrefix: "",
    signatureStyle: {
      bottom: "10%",
      left: "27%",
    },
    signatureMaxWidth: 180,
    signatureMaxHeight: 70,
  },
};

const Preview = forwardRef<PreviewRef, PreviewProps>(
  ({ pseudo = "", signature = null }, ref) => {
    const [selectedModel, setSelectedModel] = useState<number>(1);
    const certificateRef = useRef<HTMLDivElement>(null);
    const [currentDate, setCurrentDate] = useState("");
    const [containerWidth, setContainerWidth] = useState(1000);
    const [imageHeight, setImageHeight] = useState(0);

    useEffect(() => {
      const date = new Date();
      setCurrentDate(date.toLocaleDateString("fr-FR"));
    }, []);

    useEffect(() => {
      const updateContainerWidth = () => {
        if (certificateRef.current) {
          const width = certificateRef.current.offsetWidth;
          if (width > 0) {
            setContainerWidth(width);
          }
        }
      };

      updateContainerWidth();

      let resizeObserver: ResizeObserver | null = null;

      if (certificateRef.current && typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            const width = entry.contentRect.width;
            if (width > 0) {
              setContainerWidth(width);
            }
          }
        });
        resizeObserver.observe(certificateRef.current);
      }

      window.addEventListener("resize", updateContainerWidth);

      const timeoutId = setTimeout(updateContainerWidth, 100);

      return () => {
        if (resizeObserver) {
          resizeObserver.disconnect();
        }
        clearTimeout(timeoutId);
        window.removeEventListener("resize", updateContainerWidth);
      };
    }, [selectedModel]);

    useImperativeHandle(ref, () => ({
      downloadCertificate: async () => {
        if (!certificateRef.current) return null;
        try {
          const dataUrl = await toPng(certificateRef.current, {
            cacheBust: true,
            pixelRatio: 3,
          });
          const link = document.createElement("a");
          const safePseudo = (pseudo || "participant")
            .replace(/[^a-z0-9]/gi, "_")
            .toLowerCase();
          link.download = `certificat-${selectedModel}-${safePseudo}.png`;
          link.href = dataUrl;
          link.click();
          return dataUrl;
        } catch (error) {
          console.error("Erreur génération certificat:", error);
          return null;
        }
      },
    }));

    const config =
      CERTIFICATE_CONFIG[selectedModel as keyof typeof CERTIFICATE_CONFIG];

    const scaleFactor = containerWidth / 1000;

    return (
      <div className="w-full flex flex-col items-center gap-4 md:gap-6 py-4 md:py-6">
        <div className="flex gap-2 md:gap-3 bg-gray-100 p-1.5 md:p-2 rounded-xl">
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              onClick={() => setSelectedModel(num)}
              className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-semibold transition-colors ${
                selectedModel === num
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white text-gray-600 hover:bg-gray-200"
              }`}
            >
              <LayoutTemplate className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Modèle {num}</span>
              <span className="sm:hidden">{num}</span>
            </button>
          ))}
        </div>

        <div className="w-full max-w-[1000px] px-2 sm:px-4">
          <div
            ref={certificateRef}
            className="relative w-full shadow-2xl overflow-hidden"
            style={{
              width: "100%",
              maxWidth: "1000px",
              margin: "0 auto",
            }}
          >
            <img
              src={config.image}
              alt={`Certificat Modèle ${selectedModel}`}
              className="w-full h-auto object-cover block"
              onLoad={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                if (img.naturalHeight) {
                  setImageHeight(img.naturalHeight);
                }
              }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                if (e.currentTarget.parentElement) {
                  e.currentTarget.parentElement.style.height = "600px";
                  e.currentTarget.parentElement.style.backgroundColor =
                    "#f0f0f0";
                  e.currentTarget.parentElement.innerHTML += `<div class="absolute inset-0 flex items-center justify-center text-gray-400">Image ${config.image} introuvable</div>`;
                }
                setImageHeight(600);
              }}
            />

            <div
              className={`absolute text-center ${config.fontClass}`}
              style={{
                ...config.nameStyle,
                color: config.textColor,
                fontSize: `${config.nameFontSize * scaleFactor}px`,
                maxWidth: "90%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {pseudo || "Prénom Nom"}
            </div>

            <div
              className={`absolute whitespace-nowrap z-99 ${config.fontClass}`}
              style={{
                ...config.dateStyle,
                color: config.textColor,
                fontSize: `${config.dateFontSize * scaleFactor}px`,
              }}
            >
              {config.datePrefix}
              {currentDate}
            </div>

            {signature && (
              <img
                src={signature}
                alt="Signature"
                className="absolute"
                style={{
                  ...config.signatureStyle,
                  maxWidth: `${config.signatureMaxWidth * scaleFactor}px`,
                  maxHeight: `${config.signatureMaxHeight * scaleFactor}px`,
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
);

Preview.displayName = "Preview";

export default Preview;
