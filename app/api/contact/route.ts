// app/api/contact/route.js
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const data = await request.json(); // parse JSON body from the request
    const { name, email, message } = data;

    // Set up Nodemailer transporter with Mailtrap SMTP credentials
    const transporter = nodemailer.createTransport({
      host: "live.smtp.mailtrap.io", // Mailtrap SMTP host
      port: 587, // Mailtrap SMTP port
      secure: false,
      requireTLS: true,
      auth: {
        user: "a0de83590ce92d", // SMTP username from .env.local
        pass: "51b29cdeb5ba45", // SMTP password from .env.local
      },
    });

    console.log("VERIFICATION : ", await transporter.verify());

    // Email message options
    const mailOptions = {
      from: `"Contact Form" <yulianguinand365@gmail.com>`, // sender address
      to: "yulianguinand365@gmail.com",
      subject: "New Contact Form Submission",
      text: `You have a new message from ${name} (${email}):\n\n${message}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ ok: true, status: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ ok: false, error: error }, { status: 500 });
  }
}
