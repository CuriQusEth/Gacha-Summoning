# Gacha Summoning Shrine

Welcome to **Gacha Summoning Shrine**, a beautiful, addictive gacha game where you play as the mystical Shrine Keeper. Rebuild an ancient shrine, summon powerful legends, and test your luck to collect the rarest entities in the realm.

## Project Overview
You are the **Shrine Keeper**, managing an ancient mystical shrine. Your objective is to summon powerful heroes, legendary spirits, divine beasts, and gods from other realms. 

This game provides top-tier UI animations, visual effects, and a complete on-chain experience integration via Wagmi on the Base Mainnet.

## Tech Stack
- **Framework:** Next.js 14 (App Router) / React
- **Styling:** Tailwind CSS & Framer Motion
- **Web3 Integration:** Wagmi, Viem, SIWE (Sign-In with Ethereum)
- **AI Agent Protocol:** ERC-8004 (Trustless Agents), MCP (Model Context Protocol)
- **Blockchain:** Base Mainnet

## AI Orchestrator & Registration Info
The application is orchestrated by the **Gacha Summoning Orchestrator**, an ERC-8004 compliant AI Agent.
- **Agent Service Card**: Available at `/.well-known/agent-card.json`. It provides Agent-to-Agent (A2A) communication and Model Context Protocol capabilities.
- **Skills Listed in Registry**:
  - Gacha Summoning
  - Character Collection
  - Rarity Management
  - Multi Summon Automation
  - Pull Strategy Optimization
  - Inventory Orchestration
  - MCP Command Execution

## MCP Connection Guide
Our Model Context Protocol (MCP) endpoint smoothly allows AI tools to interface with the game state using JSON-RPC 2.0.
- **Endpoint Route:** `/api/mcp`
- **Supported Methods:** `POST` (for full structured JSON-RPC commands: `initialize`, `tools/list`, `tools/call`, `prompts/list`, `resources/list`) and `GET` (for health checks).
- **Available Tools (MCP):** `get_race_status`, `start_race`, `get_leaderboard`, `optimize_speed`, `get_track_info` *(Note: These tools are currently stubbed via payload placeholders per project limits)*.

## How to Run Locally

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Setup Environment Variables:**
   Create a `.env.local` file and add any necessary public configurations (do not store private keys in source control).

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`. You can test the MCP endpoint directly through POST requests targeting the `/api/mcp` and `/api/agent` routes.
