import { NextResponse } from 'next/server';
import userService from '@/lib/services/userService';
import fonnteService from '@/lib/services/fonnteService';
import logger from '@/lib/utils/logger';

export async function POST(req) {
  try {
    const { name, whatsappNumber, businessName, businessType } = await req.json();

    if (!whatsappNumber) {
      return NextResponse.json({ message: "WhatsApp number is required for registration." }, { status: 400 });
    }

    const existingUser = await userService.getUserByWhatsAppNumber(whatsappNumber);
    if (existingUser) {
      return NextResponse.json({ message: "User with this WhatsApp number already exists." }, { status: 409 });
    }

    const newUser = await userService.createUser({ name, whatsappNumber, businessName, businessType });

    if (!newUser) {
      return NextResponse.json({ message: "Failed to create user account. Please try again." }, { status: 500 });
    }

    logger.info(`User registered successfully: ${newUser.whatsapp_number}. ID: ${newUser.id}`);
    try {
        await fonnteService.sendMessage(newUser.whatsapp_number, "Selamat datang di UMKM Connect WA! Akun Anda berhasil dibuat dan terhubung.");
    } catch (e) {
        logger.error("Failed to send welcome message via fonnte: " + e.message);
    }

    return NextResponse.json({
      message: "User registered successfully.",
      user: { id: newUser.id, name: newUser.name, whatsappNumber: newUser.whatsapp_number }
    }, { status: 201 });
  } catch (error) {
    logger.error(`Error during user registration:`, error.message);
    return NextResponse.json({ message: "An error occurred during registration. Please try again." }, { status: 500 });
  }
}
