import {
  ExternalLink,
  Facebook,
  Heart,
  Instagram,
  Mail,
  PinIcon,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-linear-to-br from-emerald-600 via-teal-700 to-cyan-800 text-white mt-auto">
      <div className="container mx-auto px-6 py-12">
        {/* Section principale */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* À propos */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-400 fill-red-400" />
              Engagement Leucémie
            </h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Ensemble, luttons contre la leucémie. Chaque engagement compte et
              fait la différence dans la vie des patients et de leurs familles.
            </p>
            <a
              href="https://engagement-leucemie.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
            >
              Découvrir notre mission
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Liens rapides */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://engagement-leucemie.com/don-moelle-osseuse"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors inline-flex items-center gap-1 text-sm"
                >
                  Don moelle osseuse
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://engagement-leucemie.com/actions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors inline-flex items-center gap-1 text-sm"
                >
                  Comment agir
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://engagement-leucemie.com/temoignage"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors inline-flex items-center gap-1 text-sm"
                >
                  Témoignages
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://engagement-leucemie.com/nous-contacter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors inline-flex items-center gap-1 text-sm"
                >
                  Contact
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Réseaux sociaux */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Restez Connecté</h3>
            <div className="space-y-3">
              <a
                href="mailto:engagementleucemie@gmail.com"
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                engagementleucemie@gmail.com
              </a>

              <div className="flex items-center gap-2 text-white/80 text-sm">
                <PinIcon className="w-4 h-4" />
                <p>56, Chemin des Montarmots 25000 BESANCON</p>
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div className="flex gap-3 pt-2">
              <a
                href="https://www.facebook.com/EngagementLeucemie"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://bsky.app/profile/engagementleucemie.bsky.social"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <svg width="16" height="16" fill="currentColor">
                  <path d="M3.468 1.948C5.303 3.325 7.276 6.118 8 7.616c.725-1.498 2.698-4.29 4.532-5.668C13.855.955 16 .186 16 2.632c0 .489-.28 4.105-.444 4.692-.572 2.04-2.653 2.561-4.504 2.246 3.236.551 4.06 2.375 2.281 4.2-3.376 3.464-4.852-.87-5.23-1.98-.07-.204-.103-.3-.103-.218 0-.081-.033.014-.102.218-.379 1.11-1.855 5.444-5.231 1.98-1.778-1.825-.955-3.65 2.28-4.2-1.85.315-3.932-.205-4.503-2.246C.28 6.737 0 3.12 0 2.632 0 .186 2.145.955 3.468 1.948" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/engagementleucemie/?hl=fr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-white/20 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/70">
              © {new Date().getFullYear()} Engagement Leucémie. Tous droits
              réservés.
            </p>
            <div className="flex gap-6 text-sm text-white/70">
              <a
                href="https://engagement-leucemie.com/mentions-legales"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Mentions légales
              </a>
              <a
                href="https://engagement-leucemie.com/confidentialite"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Confidentialité
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
