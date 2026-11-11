import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cors from "cors";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cors());

  const APP_NAME = "Gacha Summoning Orchestrator";
  const APP_VERSION = "1.0.0";

  // --- API ROUTES ---

  // MCP GET
  app.get("/api/mcp", (req, res) => {
    res.json({
      protocol: "MCP",
      version: APP_VERSION,
      name: APP_NAME,
      status: "active",
      description: "Active MCP server for Gacha Summoning Orchestrator Agent",
      capabilities: ["gacha-summoning", "character-collection", "multi-summon-automation"],
      timestamp: new Date().toISOString()
    });
  });

  // MCP POST
  app.post("/api/mcp", (req, res) => {
    try {
      const body = req.body;
      const { method, params, id } = body;

      if (method === 'initialize') {
        return res.json({
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
        });
      }

      if (method === 'tools/list') {
        return res.json({
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
        });
      }

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

        return res.json({
          content: [{ type: "text", text: responseText }],
          isError: false
        });
      }

      if (method === 'prompts/list') {
        return res.json({ prompts: [] });
      }

      if (method === 'resources/list') {
        return res.json({ resources: [] });
      }

      return res.json({
        status: "success",
        message: "MCP command received",
        agent: APP_NAME,
        receivedAt: new Date().toISOString(),
        payload: body
      });
    } catch (e) {
      return res.status(400).json({ error: "Invalid MCP request" });
    }
  });

  // AGENT GET
  const agentDetails = {
    name: "Gacha Summoning Orchestrator",
    status: "active",
    wallet: "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B",
    network: "Base Mainnet (Denim 200ms)",
    chainId: 8453,
    platform: "Gacha Summoning",
    version: "1.0.0"
  };

  app.get("/api/agent", (req, res) => {
    res.json(agentDetails);
  });

  // AGENT POST
  app.post("/api/agent", (req, res) => {
    res.json({
      message: "Agent POST command received successfully",
      agent: agentDetails.name,
      receivedAt: new Date().toISOString(),
      payload: req.body
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
