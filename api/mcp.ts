export const config = {
  runtime: 'edge',
};

const APP_NAME = "Gacha Summoning Orchestrator";
const APP_VERSION = "1.0.0";

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
    return new Response(JSON.stringify({ 
      status: "MCP Server Active. Use POST for JSON-RPC." 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  if (req.method === 'POST') {
    try {
      const body = await req.json();
      const { method, params, id, jsonrpc } = body;

      // JSON-RPC 2.0 Initialization
      if (method === 'initialize') {
        return new Response(JSON.stringify({
          jsonrpc: "2.0",
          id,
          result: {
            protocolVersion: "2024-11-05",
            capabilities: {
              tools: { listChanged: false },
              prompts: {},
              resources: {}
            },
            serverInfo: {
              name: APP_NAME,
              version: APP_VERSION
            }
          }
        }), { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
      }

      // Tools List
      if (method === 'tools/list') {
        return new Response(JSON.stringify({
          jsonrpc: "2.0",
          id,
          result: {
            tools: [
              {
                name: "get_race_status",
                description: "Get the current status of a race [PLACEHOLDER]",
                inputSchema: { type: "object", properties: {} }
              },
              {
                name: "start_race",
                description: "Start a new race [PLACEHOLDER]",
                inputSchema: { type: "object", properties: {} }
              },
              {
                name: "get_leaderboard",
                description: "Get the current leaderboard [PLACEHOLDER]",
                inputSchema: { type: "object", properties: {} }
              },
              {
                name: "optimize_speed",
                description: "Optimize speed for the race [PLACEHOLDER]",
                inputSchema: { type: "object", properties: {} }
              },
              {
                name: "get_track_info",
                description: "Get detailed information about the track [PLACEHOLDER]",
                inputSchema: { type: "object", properties: {} }
              }
            ]
          }
        }), { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
      }

      // Tools Call
      if (method === 'tools/call') {
        return new Response(JSON.stringify({
          jsonrpc: "2.0",
          id,
          result: {
            content: [{ type: "text", text: `[PLACEHOLDER] Executed tool: ${params?.name}` }],
            isError: false
          }
        }), { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
      }

      // Prompts List
      if (method === 'prompts/list') {
        return new Response(JSON.stringify({
          jsonrpc: "2.0",
          id,
          result: { prompts: [] }
        }), { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
      }

      // Resources List
      if (method === 'resources/list') {
        return new Response(JSON.stringify({
          jsonrpc: "2.0",
          id,
          result: { resources: [] }
        }), { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
      }

      // Unknown Method
      return new Response(JSON.stringify({
        jsonrpc: "2.0",
        id,
        error: { code: -32601, message: "Method not found" }
      }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } });

    } catch (e) {
      return new Response(JSON.stringify({
        jsonrpc: "2.0",
        id: null,
        error: { code: -32700, message: "Parse error" }
      }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }
  }

  return new Response("Method not allowed", { status: 405, headers: corsHeaders });
}
