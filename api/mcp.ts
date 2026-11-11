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
                name: "get_network_status",
                description: "Get Base Mainnet Denim 200ms status, block specs, and GM contract target",
                inputSchema: { type: "object", properties: {} }
              },
              {
                name: "get_shrine_status",
                description: "Get current Shrine ascension tier, summon probabilities, and pity system rates",
                inputSchema: { type: "object", properties: {} }
              },
              {
                name: "summon_guardian",
                description: "Simulate or execute a guardian summon roll across Common, Rare, Epic, Legendary, Divine tiers",
                inputSchema: {
                  type: "object",
                  properties: {
                    amount: { type: "number", description: "Number of summons (1 or 10)" }
                  }
                }
              },
              {
                name: "get_luckiest_summon",
                description: "Retrieve highest power guardian anchored on Base Mainnet with SIWE signature",
                inputSchema: { type: "object", properties: {} }
              },
              {
                name: "send_gm_info",
                description: "Get parameters for the on-chain Say GM transaction with ERC-8021 attribution",
                inputSchema: { type: "object", properties: {} }
              }
            ]
          }
        }), { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
      }

      // Tools Call
      if (method === 'tools/call') {
        const toolName = params?.name;
        let responseText = "";

        if (toolName === 'get_network_status') {
          responseText = JSON.stringify({
            network: "Base Mainnet",
            chainId: 8453,
            upgrade: "Denim",
            blockTime: "200ms canonical blocks",
            flashblocks: "retired",
            rpcUrl: "https://mainnet.base.org",
            gmContract: "0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3",
            status: "active"
          }, null, 2);
        } else if (toolName === 'get_shrine_status') {
          responseText = JSON.stringify({
            shrineTier: "Ascended Sacred Shrine",
            baseRates: { Divine: "0.1%", Legendary: "1.0%", Epic: "10.0%", Rare: "30.0%", Common: "58.9%" },
            pityCap: 90,
            denimOptimized: true
          }, null, 2);
        } else if (toolName === 'summon_guardian') {
          const count = params?.arguments?.amount || 1;
          responseText = `Summoned ${count} guardian(s) at Sacred Shrine on Base Mainnet. Roll completed with Denim 200ms canonical seed.`;
        } else if (toolName === 'send_gm_info') {
          responseText = JSON.stringify({
            contract: "0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3",
            value: "0 ETH",
            network: "Base Mainnet (Chain ID 8453)",
            attribution: "ERC-8021 [ATTRIBUTION_CODE]"
          }, null, 2);
        } else {
          responseText = `Executed tool: ${toolName}`;
        }

        return new Response(JSON.stringify({
          jsonrpc: "2.0",
          id,
          result: {
            content: [{ type: "text", text: responseText }],
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
