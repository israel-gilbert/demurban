import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { PrismaClient } from "@prisma/client";

const resend = new Resend(process.env.RESEND_API_KEY);
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    // Check if subscriber already exists
    const existing = await prisma.subscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (!existing.active) {
        await prisma.subscriber.update({
          where: { email },
          data: { active: true },
        });

        // Send welcome email to subscriber
        const { error } = await resend.emails.send({
          from: `DEM Urban <onboarding@resend.dev>`,
          to: email,
          subject: "Welcome to the DEM Insider 🔥",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 40px 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="font-size: 28px; font-weight: bold; letter-spacing: 2px; margin: 0;">DEM URBAN</h1>
                <p style="color: #888; font-size: 12px; letter-spacing: 3px; margin-top: 5px;">WHERE TASTE MEETS IDENTITY</p>
              </div>
              
              <div style="background: #111; border: 1px solid #222; border-radius: 8px; padding: 30px; margin-bottom: 30px;">
                <h2 style="font-size: 20px; margin: 0 0 15px 0; color: #fff;">You're In! 🎉</h2>
                <p style="color: #ccc; line-height: 1.6; margin: 0 0 20px 0;">
                  Welcome to the DEM Insider family. You'll be the first to know about:
                </p>
                <ul style="color: #ccc; line-height: 2; margin: 0; padding-left: 20px;">
                  <li>Exclusive product drops</li>
                  <li>Early access to limited editions</li>
                  <li>Insider tips and style guides</li>
                  <li>Special member-only discounts</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin-bottom: 30px;">
                <a href="${process.env.NEXTAUTH_URL || "https://demurban.com"}/shop" 
                   style="display: inline-block; background: #fff; color: #000; text-decoration: none; padding: 12px 30px; border-radius: 4px; font-weight: bold; font-size: 14px;">
                  SHOP NOW
                </a>
              </div>
              
              <div style="text-align: center; color: #555; font-size: 12px; border-top: 1px solid #222; padding-top: 20px;">
                <p>Follow us on Instagram <a href="https://instagram.com/dem.urban" style="color: #888;">@dem.urban</a></p>
                <p style="margin-top: 10px;">© ${new Date().getFullYear()} DEM Urban. All rights reserved.</p>
              </div>
            </div>
          `,
        });

        if (error) {
          console.error("Resend subscribe error:", error);
          return NextResponse.json(
            { error: "Failed to subscribe. Please try again." },
            { status: 500 }
          );
        }
      }

      return NextResponse.json(
        { success: true, message: "You're already subscribed!" },
        { status: 200 }
      );
    }

    // Save subscriber to database
    await prisma.subscriber.create({
      data: { email },
    });

    // Send welcome email to new subscriber
    const { error } = await resend.emails.send({
      from: `DEM Urban <onboarding@resend.dev>`,
      to: email,
      subject: "Welcome to the DEM Insider 🔥",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-size: 28px; font-weight: bold; letter-spacing: 2px; margin: 0;">DEM URBAN</h1>
            <p style="color: #888; font-size: 12px; letter-spacing: 3px; margin-top: 5px;">WHERE TASTE MEETS IDENTITY</p>
          </div>
          
          <div style="background: #111; border: 1px solid #222; border-radius: 8px; padding: 30px; margin-bottom: 30px;">
            <h2 style="font-size: 20px; margin: 0 0 15px 0; color: #fff;">You're In! 🎉</h2>
            <p style="color: #ccc; line-height: 1.6; margin: 0 0 20px 0;">
              Welcome to the DEM Insider family. You'll be the first to know about:
            </p>
            <ul style="color: #ccc; line-height: 2; margin: 0; padding-left: 20px;">
              <li>Exclusive product drops</li>
              <li>Early access to limited editions</li>
              <li>Insider tips and style guides</li>
              <li>Special member-only discounts</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${process.env.NEXTAUTH_URL || "https://demurban.com"}/shop" 
               style="display: inline-block; background: #fff; color: #000; text-decoration: none; padding: 12px 30px; border-radius: 4px; font-weight: bold; font-size: 14px;">
              SHOP NOW
            </a>
          </div>
          
          <div style="text-align: center; color: #555; font-size: 12px; border-top: 1px solid #222; padding-top: 20px;">
            <p>Follow us on Instagram <a href="https://instagram.com/dem.urban" style="color: #888;">@dem.urban</a></p>
            <p style="margin-top: 10px;">© ${new Date().getFullYear()} DEM Urban. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend subscribe error:", error);
      return NextResponse.json(
        { error: "Failed to subscribe. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Welcome to the DEM Insider! Check your email." },
      { status: 201 }
    );
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}