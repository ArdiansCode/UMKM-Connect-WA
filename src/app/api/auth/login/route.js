import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = process.env.ADMIN_SECRET_TOKEN || 'secret-token'; 
      return NextResponse.json({ success: true, token }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, message: "Email atau password salah." }, { status: 401 });
    }
  } catch (err) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
