import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { email, pseudo, imageDataUrl, certificatePath } =
      await request.json();

    console.log("📧 Email API - certificatePath reçu:", certificatePath);

    if (!email || !imageDataUrl) {
      return NextResponse.json(
        { error: "Email et image requis" },
        { status: 400 }
      );
    }

    // Configuration Mailtrap
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST || "sandbox.smtp.mailtrap.io",
      port: parseInt(process.env.MAILTRAP_PORT || "2525"),
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    // Convertir data URL en buffer
    const base64Data = imageDataUrl.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, "base64");

    // Template HTML de l'email
    const htmlTemplate = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Votre Certificat d'Engagement</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #06b6d4 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                🎉 Félicitations ${pseudo || "à vous"} ! 🎉
              </h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.95;">
                Votre Certificat d'Engagement est prêt
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 22px;">
                Merci pour votre engagement ! ❤️
              </h2>
              <p style="margin: 0 0 15px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Nous sommes ravis de vous compter parmi nos soutiens dans la lutte contre la leucémie.
              </p>
              <p style="margin: 0 0 15px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Votre certificat d'engagement est joint à cet email. N'hésitez pas à le partager sur vos réseaux sociaux pour inspirer d'autres personnes à s'engager !
              </p>
              
              <!-- CTA Box -->
              <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 25px 0; border-radius: 4px;">
                <p style="margin: 0 0 10px 0; color: #065f46; font-weight: bold; font-size: 16px;">
                  💪 Partagez votre engagement
                </p>
                <p style="margin: 0; color: #047857; font-size: 14px; line-height: 1.5;">
                  Ensemble, nous pouvons faire la différence. Rejoignez-nous sur nos réseaux sociaux et partagez votre certificat avec #EngagementLeucémie
                </p>
              </div>
              
              <!-- Social Sharing Section -->
              <div style="margin: 30px 0; padding: 30px; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; border: 2px solid #fbbf24; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <div style="text-align: center; margin-bottom: 25px;">
                  <h3 style="margin: 0 0 10px 0; color: #78350f; font-size: 20px; font-weight: bold;">
                    🌟 Aidez-nous à sensibiliser !
                  </h3>
                  <p style="margin: 0; color: #92400e; font-size: 15px; line-height: 1.6;">
                    Vous aussi vous pouvez nous aider en publiant sur vos réseaux
                  </p>
                </div>

                <!-- Instructions visuelles -->
                <div style="background-color: rgba(255, 255, 255, 0.7); border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                  <p style="margin: 0 0 15px 0; color: #78350f; font-size: 14px; font-weight: bold;">
                    📋 Comment partager votre certificat :
                  </p>
                  <table role="presentation" style="width: 100%;">
                    <tr>
                      <td style="padding: 8px 0; color: #92400e; font-size: 13px; line-height: 1.6;">
                        <strong style="color: #78350f;">1️⃣</strong> Téléchargez le <strong>certificat en pièce jointe</strong> de cet email
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #92400e; font-size: 13px; line-height: 1.6;">
                        <strong style="color: #78350f;">2️⃣</strong> Cliquez sur le bouton du réseau social de votre choix ci-dessous
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #92400e; font-size: 13px; line-height: 1.6;">
                        <strong style="color: #78350f;">3️⃣</strong> Ajoutez votre certificat à votre publication
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #92400e; font-size: 13px; line-height: 1.6;">
                        <strong style="color: #78350f;">4️⃣</strong> Publiez et inspirez votre communauté ! 💪
                      </td>
                    </tr>
                  </table>
                </div>
                
                <!-- Social Media Buttons avec messages personnalisés -->
                <table role="presentation" style="width: 100%; margin: 0 auto;">
                  <tr>
                    <td align="center">
                      <!-- Facebook -->
                      <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        `https://engagement-leucemie.vercel.app/share?pseudo=${
                          pseudo || "Nouveau membre"
                        }&image=${certificatePath}`
                      )}" style="display: inline-block; margin: 5px; padding: 14px 24px; background-color: #1877f2; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" style="vertical-align: middle; margin-right: 8px;" viewBox="0 0 16 16">
                          <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
                        </svg>
                        Publier sur Facebook
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <!-- LinkedIn -->
                      <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                        `https://engagement-leucemie.vercel.app/share?pseudo=${
                          pseudo || "Nouveau membre"
                        }&image=https://engagement-leucemie.vercel.app${certificatePath}`
                      )}" style="display: inline-block; margin: 5px; padding: 14px 24px; background-color: #0077b5; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);">
                        💼 Publier sur LinkedIn
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <!-- Instagram Note avec instructions -->
                      <div style="margin-top: 10px; padding: 15px; background-color: rgba(255, 255, 255, 0.5); border-radius: 8px;">
                        <p style="margin: 0 0 8px 0; color: #78350f; font-size: 14px; font-weight: bold;">
                          📸 Pour Instagram :
                        </p>
                        <p style="margin: 0; color: #92400e; font-size: 12px; line-height: 1.5;">
                          1. Téléchargez le certificat en pièce jointe<br/>
                          2. Ouvrez l'app Instagram<br/>
                          3. Créez un nouveau post avec votre certificat<br/>
                          4. Ajoutez le message : <em>"Je suis fier de soutenir la lutte contre la leucémie ! 💪 #EngagementLeucémie"</em>
                        </p>
                      </div>
                    </td>
                  </tr>
                </table>

                <!-- Hashtag reminder -->
                <div style="margin-top: 20px; text-align: center; padding: 15px; background-color: rgba(255, 255, 255, 0.5); border-radius: 8px;">
                  <p style="margin: 0; color: #78350f; font-size: 13px; font-weight: bold;">
                    ✨ N'oubliez pas d'utiliser le hashtag :
                  </p>
                  <p style="margin: 5px 0 0 0; color: #92400e; font-size: 16px; font-weight: bold;">
                    #EngagementLeucémie
                  </p>
                </div>
              </div>
              
              <!-- Buttons -->
              <table role="presentation" style="width: 100%; margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://engagement-leucemie.com" style="display: inline-block; padding: 14px 30px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                      Découvrir nos actions
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                <strong>Engagement Leucémie</strong>
              </p>
              <p style="margin: 0 0 15px 0; color: #9ca3af; font-size: 12px;">
                56, Chemin des Montarmots<br />
                25000 BESANÇON, France
              </p>
              <p style="margin: 0 0 15px 0; color: #9ca3af; font-size: 12px;">
                <a href="mailto:engagementleucemie@gmail.com" style="color: #10b981; text-decoration: none;">
                  engagementleucemie@gmail.com
                </a>
              </p>
              <div style="margin: 15px 0;">
                <a href="https://www.facebook.com/EngagementLeucemie" style="display: inline-block; margin: 0 5px; color: #10b981; text-decoration: none;">Facebook</a>
                <span style="color: #d1d5db;">•</span>
                <a href="https://www.instagram.com/engagementleucemie" style="display: inline-block; margin: 0 5px; color: #10b981; text-decoration: none;">Instagram</a>
              </div>
              <p style="margin: 15px 0 0 0; color: #9ca3af; font-size: 11px;">
                © ${new Date().getFullYear()} Engagement Leucémie. Tous droits réservés.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Envoyer l'email
    await transporter.sendMail({
      from: '"Engagement Leucémie" <no-reply@engagement-leucemie.com>',
      to: email,
      subject: `🎖️ Votre Certificat d'Engagement - ${
        pseudo || "Merci pour votre soutien"
      }`,
      html: htmlTemplate,
      attachments: [
        {
          filename: `certificat-engagement-${pseudo || "leucemie"}.png`,
          content: imageBuffer,
          contentType: "image/png",
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de l'email" },
      { status: 500 }
    );
  }
}
