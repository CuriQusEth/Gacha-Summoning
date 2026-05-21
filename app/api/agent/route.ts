import { NextResponse } from 'next/server';

const agentDetails = {
  name: "Gacha Summoning Orchestrator",
  status: "active",
  wallet: "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B",
  platform: "Gacha Summoning",
  version: "1.0.0"
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  return NextResponse.json(agentDetails, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json({
      message: "Agent POST command received successfully",
      agent: agentDetails.name,
      receivedAt: new Date().toISOString(),
      payload: body
    }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400, headers: corsHeaders });
  }
}
