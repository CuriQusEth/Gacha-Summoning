export const config = {
  runtime: 'edge',
};

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

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method === 'GET') {
    return new Response(JSON.stringify(agentDetails), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  if (req.method === 'POST') {
    try {
      const body = await req.json();
      return new Response(JSON.stringify({
        message: "Agent POST command received successfully",
        agent: agentDetails.name,
        receivedAt: new Date().toISOString(),
        payload: body
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: "Invalid request payload" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  }

  return new Response("Method not allowed", { status: 405, headers: corsHeaders });
}
