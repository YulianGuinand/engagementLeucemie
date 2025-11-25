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
            <td style="background-color: #10b981; padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 600; letter-spacing: -0.5px;">
                Félicitations ${pseudo || "à vous"} ! 🎉
              </h1>
              <p style="margin: 12px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">
                Votre certificat d'engagement est prêt
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 16px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                Merci pour votre engagement dans la lutte contre la leucémie 💚
              </p>
              <p style="margin: 0 0 24px 0; color: #6b7280; font-size: 15px; line-height: 1.6;">
                Votre certificat est joint à cet email. N'hésitez pas à le partager sur vos réseaux sociaux pour inspirer d'autres personnes à s'engager !
              </p>
              
              <!-- Social Sharing Section -->
              <div style="margin: 30px 0; padding: 28px; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
                <h3 style="margin: 0 0 8px 0; color: #111827; font-size: 18px; font-weight: 600;">
                  Vous aussi vous pouvez nous aider à sensibiliser en publiant sur vos reseaux
                </h3>
                <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                  Aidez-nous à sensibiliser en partageant votre certificat sur vos réseaux sociaux avec #EngagementLeucémie
                </p>
                
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
                      <a href="https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                        `https://engagement-leucemie.vercel.app/share?pseudo=${
                          pseudo || "Nouveau membre"
                        }&image=${certificatePath}`
                      )}&title=${encodeURIComponent(
      "J'ai rejoint l'association !"
    )}&summary=${encodeURIComponent(
      "Je suis fier d'annoncer mon adhésion ✨"
    )}" style="display: inline-block; margin: 5px; padding: 14px 24px; background-color: #0077b5; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" style="vertical-align: middle; margin-right: 8px;" viewBox="0 0 16 16">
                          <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
                        </svg>
                        Publier sur LinkedIn
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <!-- Instagram -->
                      <a href="https://www.instagram.com/" target="_blank" style="display: inline-block; margin: 5px; padding: 14px 24px; background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" style="vertical-align: middle; margin-right: 8px;" viewBox="0 0 16 16">
                          <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
                        </svg>
                        Ouvrir Instagram
                      </a>
                      <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 12px; line-height: 1.4;">
                        Publiez le certificat joint avec #EngagementLeucémie
                      </p>
                    </td>
                  </tr>
                </table>


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
