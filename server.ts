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
        });
      }

      if (method === 'tools/call') {
        return res.json({
          content: [{ type: "text", text: `[PLACEHOLDER] Executed tool: ${params?.name}` }],
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
