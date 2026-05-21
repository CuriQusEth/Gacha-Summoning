import { NextResponse } from 'next/server';

const APP_NAME = "Gacha Summoning Orchestrator";
const APP_VERSION = "1.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  return NextResponse.json({ status: "MCP Server Active. Use POST for JSON-RPC." }, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { method, params, id, jsonrpc } = body;

    // MCP JSON-RPC 2.0 Protocol Handling
    if (method === 'initialize') {
      return NextResponse.json({
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
      }, { headers: corsHeaders });
    }

    if (method === 'tools/list') {
      return NextResponse.json({
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
      }, { headers: corsHeaders });
    }

    if (method === 'tools/call') {
      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        result: {
          content: [{ type: "text", text: `[PLACEHOLDER] Executed tool: ${params?.name}` }],
          isError: false
        }
      }, { headers: corsHeaders });
    }

    if (method === 'prompts/list') {
      return NextResponse.json({ jsonrpc: "2.0", id, result: { prompts: [] } }, { headers: corsHeaders });
    }

    if (method === 'resources/list') {
      return NextResponse.json({ jsonrpc: "2.0", id, result: { resources: [] } }, { headers: corsHeaders });
    }

    return NextResponse.json({ 
      jsonrpc: "2.0", 
      id, 
      error: { code: -32601, message: "Method not found" } 
    }, { status: 400, headers: corsHeaders });

  } catch (error) {
    return NextResponse.json({ 
      jsonrpc: "2.0", 
      id: null, 
      error: { code: -32700, message: "Parse error" } 
    }, { status: 400, headers: corsHeaders });
  }
}
