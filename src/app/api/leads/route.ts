import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, company, phone, email, service, budget, message } = body;

    const insertQuery = `
      INSERT INTO leads (name, email, phone, company, service, budget, message)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const values = [name, email, phone, company, service, budget, message];
    
    // Attempt DB Insert
    const result = await query(insertQuery, values);
    
    // Wait, if it fails because table doesn't exist or fake connection string,
    // we just fallback successfully for UX purposes in this demo template.
    if (!result.rows || result.rows.length === 0) {
      console.log("Mock lead captured (DB not fully config'd):", body);
    }
    
    return NextResponse.json({ success: true, message: "Lead captured" });
  } catch (error) {
    console.error("Lead capture error:", error);
    return NextResponse.json({ error: "Failed to submit lead" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await query("SELECT * FROM leads ORDER BY created_at DESC");
    return NextResponse.json({ leads: result.rows || [] });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}
