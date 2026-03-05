import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { email, pseudo, imageDataUrl, certificatePath } =
      await request.json();

    if (!email || !imageDataUrl) {
      return NextResponse.json(
        { error: "Email et image requis" },
        { status: 400 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      // ignoreTLS: true,
      auth: {
        user: "spernelle@gmail.com",
        pass: "xxao avww emnc rymx",
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
          
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 16px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                Merci pour votre engagement dans la lutte contre la leucémie 💚
              </p>
              <p style="margin: 0 0 24px 0; color: #6b7280; font-size: 15px; line-height: 1.6;">
                Votre certificat est joint à cet email. N'hésitez pas à le partager sur vos réseaux sociaux pour inspirer d'autres personnes à s'engager !
              </p>
              
              <div style="margin: 30px 0; padding: 28px; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
                <h3 style="margin: 0 0 8px 0; color: #111827; font-size: 18px; font-weight: 600;">
                  Vous aussi vous pouvez nous aider à sensibiliser en publiant sur vos reseaux
                </h3>
                <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                  Aidez-nous à sensibiliser en partageant votre certificat sur vos réseaux sociaux avec #EngagementLeucémie
                </p>
                
                <table role="presentation" style="width: 100%; margin: 0 auto;">
                  <tr>
                    <td align="center">
                      <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        `https://engagement-leucemie.vercel.app/share?pseudo=${
                          pseudo || "Nouveau membre"
                        }&image=${certificatePath}`,
                      )}" style="display: inline-block; margin: 5px; padding: 14px 24px; background-color: #1877f2; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);">
                        Publier sur Facebook
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <a href="https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                        `https://engagement-leucemie.vercel.app/share?pseudo=${
                          pseudo || "Nouveau membre"
                        }&image=${certificatePath}`,
                      )}&title=${encodeURIComponent(
                        "J'ai rejoint l'association !",
                      )}&summary=${encodeURIComponent(
                        "Je suis fier d'annoncer mon adhésion ✨",
                      )}" style="display: inline-block; margin: 5px; padding: 14px 24px; background-color: #0077b5; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);">
                        Publier sur LinkedIn
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <a href="https://www.instagram.com/" target="_blank" style="display: inline-block; margin: 5px; padding: 14px 24px; background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);">
                        Ouvrir Instagram
                      </a>
                      <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 12px; line-height: 1.4;">
                        Publiez le certificat joint avec #EngagementLeucémie
                      </p>
                    </td>
                  </tr>
                </table>

              </div>
              
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

    // Note importante pour le champ 'from' :
    // FranceServ bloque généralement les envois si l'adresse 'from' n'est pas celle authentifiée
    // ou un alias valide de votre domaine. Il est plus sûr d'utiliser l'email SMTP_USER.
    const senderEmail =
      process.env.SMTP_USER || "no-reply@engagement-leucemie.com";

    // Envoyer l'email
    await transporter.sendMail({
      from: `"Engagement Leucémie" <${senderEmail}>`,
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
      { status: 500 },
    );
  }
}
