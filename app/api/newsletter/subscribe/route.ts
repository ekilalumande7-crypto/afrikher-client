import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Brevo API key missing" }, { status: 500 });
    }

    // Brevo API call to add contact
    await axios.post(
      "https://api.brevo.com/v3/contacts",
      {
        email,
        listIds: [2], // Replace with your list ID
        updateEnabled: true,
      },
      {
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({ message: "Subscribed successfully" });
  } catch (err: any) {
    console.error(err.response?.data || err.message);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
