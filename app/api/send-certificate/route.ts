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
                      <div style="margin-top: 10px; padding: 16px; background-color: #ffffff; border-radius: 6px; border: 1px solid #e5e7eb;">
                        <p style="margin: 0 0 8px 0; color: #111827; font-size: 14px; font-weight: 600;">
                          📸 Pour Instagram
                        </p>
                        <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.5;">
                          Téléchargez le certificat joint et publiez-le sur Instagram avec le hashtag #EngagementLeucémie
                        </p>
                      </div>
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
