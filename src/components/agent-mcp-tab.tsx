"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bot,
  Copy,
  Check,
  Terminal,
  Code2,
  PlugZap,
  CircleDot,
  Wind,
  Braces,
} from "lucide-react";
import toast from "react-hot-toast";

const TOOL_DEFINITIONS = [
  {
    name: "generate_og_tags",
    description: "Creates HTML meta tags, JSON-LD & dynamic image URLs.",
  },
  {
    name: "parse_and_validate_og",
    description: "Audits meta tags with a 0-100 quality score.",
  },
  {
    name: "fetch_and_audit_url_og",
    description: "Scrapes live URLs and checks OpenGraph tags.",
  },
  {
    name: "generate_og_image_url",
    description: "Builds dynamic Edge-rendered card image URLs.",
  },
  {
    name: "generate_og_image_svg",
    description: "Returns vector SVG banners in any theme/layout.",
  },
  {
    name: "get_og_templates_catalog",
    description: "Lists all themes, layouts, and badge presets.",
  },
];

function CopyButton({ text }: { text: string; id?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      size="sm"
      variant="outline"
      className="h-6 text-[11px] px-2 font-mono"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      {copied ? (
        <Check className="h-3 w-3 mr-1 text-green-500" />
      ) : (
        <Copy className="h-3 w-3 mr-1" />
      )}
      Copy
    </Button>
  );
}

function ConfigBlock({
  filename,
  icon,
  config,
  id,
}: {
  filename: string;
  icon: React.ReactNode;
  config: string;
  id: string;
}) {
  return (
    <div className="p-3 bg-muted/30 rounded-lg border text-xs space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-foreground flex items-center gap-1.5 font-mono text-[11px]">
          {icon}
          {filename}
        </span>
        <CopyButton text={config} id={id} />
      </div>
      <pre className="p-2.5 bg-background border rounded font-mono text-[11px] overflow-x-auto text-foreground">
        {config}
      </pre>
    </div>
  );
}

export function AgentMcpTab() {
  const [origin, setOrigin] = useState("https://ogplayground.kanishkk.me");
  const [health, setHealth] = useState<"idle" | "ok" | "fail">("idle");

  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);

  const testConnection = async () => {
    try {
      const res = await fetch("/api/mcp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "tools/list",
        }),
      });
      const data = await res.json();
      const count = data?.result?.tools?.length ?? 0;
      if (res.ok && count > 0) {
        setHealth("ok");
        toast.success(`MCP endpoint healthy — ${count} tools registered`);
      } else {
        setHealth("fail");
        toast.error("MCP endpoint returned no tools");
      }
    } catch {
      setHealth("fail");
      toast.error("Failed to reach MCP endpoint");
    }
  };

  const npxConfig = JSON.stringify(
    {
      mcpServers: {
        ogplayground: {
          command: "npx",
          args: ["-y", "ogplayground-mcp"],
        },
      },
    },
    null,
    2,
  );

  const localConfig = JSON.stringify(
    {
      mcpServers: {
        ogplayground: {
          command: "node",
          args: ["./mcp-server/index.mjs"],
        },
      },
    },
    null,
    2,
  );

  const cursorConfig = JSON.stringify(
    {
      name: "ogplayground",
      type: "stdio",
      command: "npx",
      args: ["-y", "ogplayground-mcp"],
    },
    null,
    2,
  );

  const windsurfConfig = JSON.stringify(
    {
      mcpServers: {
        ogplayground: {
          command: "npx",
          args: ["-y", "ogplayground-mcp"],
          env: {},
        },
      },
    },
    null,
    2,
  );

  const curlExample = `curl -X POST ${origin}/api/mcp \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "generate_og_tags",
      "arguments": {
        "title": "My New Project",
        "description": "Ship faster with OGPlayground",
        "theme": "obsidian",
        "layout": "saas-hero",
        "tags": ["Next.js", "MCP"]
      }
    }
  }'`;

  const imageUrlExample = `${origin}/api/og?title=Ship%20Faster&subtitle=Dynamic%20social%20cards%20for%20everyone&theme=github-dark&layout=dev-terminal&brand=Acme&tags=TypeScript,MCP&grid=dots`;

  return (
    <Card className="gap-0 border py-0 shadow-none">
      <CardHeader className="px-0 pb-3 pt-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Bot className="h-4 w-4" />
            <span>Agent &amp; MCP Integration</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[10px]">
              MCP 2024-11-05
            </Badge>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-[11px] px-2.5"
              onClick={testConnection}
            >
              <PlugZap className="h-3 w-3 mr-1" />
              Test Connection
            </Button>
            <span className="flex items-center gap-1.5" aria-live="polite">
              <CircleDot
                className={`h-3.5 w-3.5 ${
                  health === "ok"
                    ? "text-emerald-500"
                    : health === "fail"
                      ? "text-red-500"
                      : "text-muted-foreground/40"
                }`}
              />
            </span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Equip any AI coding agent — Claude, Cursor, Windsurf, VS Code — to
          generate, validate, and render OG cards via stdio or HTTP MCP.
        </p>
      </CardHeader>

      <CardContent className="space-y-4 px-0 pt-3 pb-0">
        <Tabs defaultValue="agents" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-8">
            <TabsTrigger value="agents" className="text-xs">
              Agent Setup
            </TabsTrigger>
            <TabsTrigger value="http" className="text-xs">
              HTTP / REST API
            </TabsTrigger>
            <TabsTrigger value="endpoints" className="text-xs">
              Endpoints
            </TabsTrigger>
          </TabsList>

          <TabsContent value="agents" className="space-y-3 mt-3">
            <Tabs defaultValue="claude-npx" className="w-full">
              <TabsList className="grid w-full grid-cols-4 h-8 bg-muted/50">
                <TabsTrigger value="claude-npx" className="text-[11px]">
                  Claude Desktop
                </TabsTrigger>
                <TabsTrigger value="cursor" className="text-[11px]">
                  Cursor
                </TabsTrigger>
                <TabsTrigger value="windsurf" className="text-[11px]">
                  Windsurf
                </TabsTrigger>
                <TabsTrigger value="local" className="text-[11px]">
                  Local Repo
                </TabsTrigger>
              </TabsList>

              <TabsContent value="claude-npx" className="mt-3">
                <ConfigBlock
                  id="claude"
                  filename="~/Library/Application Support/Claude/claude_desktop_config.json"
                  icon={<Terminal className="h-3.5 w-3.5" />}
                  config={npxConfig}
                />
                <p className="text-[11px] text-muted-foreground mt-2">
                  Restart Claude Desktop after saving. The server runs via{" "}
                  <code className="font-mono">npx ogplayground-mcp</code> over
                  stdio.
                </p>
              </TabsContent>

              <TabsContent value="cursor" className="mt-3">
                <ConfigBlock
                  id="cursor"
                  filename="~/.cursor/mcp.json"
                  icon={<Code2 className="h-3.5 w-3.5" />}
                  config={cursorConfig}
                />
                <p className="text-[11px] text-muted-foreground mt-2">
                  Or add it in Cursor Settings → MCP → Add Server.
                </p>
              </TabsContent>

              <TabsContent value="windsurf" className="mt-3">
                <ConfigBlock
                  id="windsurf"
                  filename="~/.codeium/windsurf/mcp_config.json"
                  icon={<Wind className="h-3.5 w-3.5" />}
                  config={windsurfConfig}
                />
              </TabsContent>

              <TabsContent value="local" className="mt-3">
                <ConfigBlock
                  id="local"
                  filename="Any MCP client (clone this repo first)"
                  icon={<Braces className="h-3.5 w-3.5" />}
                  config={localConfig}
                />
                <p className="text-[11px] text-muted-foreground mt-2">
                  Run it manually with{" "}
                  <code className="font-mono">npm run mcp</code> after{" "}
                  <code className="font-mono">npm install</code>.
                </p>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="http" className="space-y-3 mt-3">
            <div className="p-3 bg-muted/30 rounded-lg border text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold font-mono text-[11px]">
                  POST /api/mcp — JSON-RPC 2.0
                </span>
                <CopyButton text={curlExample} id="curl" />
              </div>
              <pre className="p-2.5 bg-background border rounded font-mono text-[11px] overflow-x-auto whitespace-pre-wrap break-all">
                {curlExample}
              </pre>
            </div>

            <div className="p-3 bg-muted/30 rounded-lg border text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold font-mono text-[11px]">
                  GET /api/og — Direct card URL (drop into og:image)
                </span>
                <CopyButton text={imageUrlExample} id="imgurl" />
              </div>
              <pre className="p-2.5 bg-background border rounded font-mono text-[11px] overflow-x-auto whitespace-pre-wrap break-all">
                {imageUrlExample}
              </pre>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrlExample}
                alt="Live preview of the example dynamic OG card"
                className="rounded border w-full"
                loading="lazy"
              />
            </div>
          </TabsContent>

          <TabsContent value="endpoints" className="space-y-2 mt-3">
            <div className="space-y-2 text-xs">
              {[
                {
                  method: "GET",
                  path: "/api/og",
                  badge: "Edge PNG",
                  desc: "Renders 1200x630 cards with theme, layout, badge, tags, grid params.",
                },
                {
                  method: "GET",
                  path: "/api/catalog",
                  badge: "JSON",
                  desc: "Full design catalog: themes (with palettes), layouts, badges, templates.",
                },
                {
                  method: "POST",
                  path: "/api/generate",
                  badge: "JSON",
                  desc: "Generates meta tags, JSON-LD, and dynamic image links from fields.",
                },
                {
                  method: "POST",
                  path: "/api/validate",
                  badge: "Audit",
                  desc: "Audits HTML/tags → health score (0-100), grade, and fix suggestions.",
                },
                {
                  method: "POST",
                  path: "/api/mcp",
                  badge: "JSON-RPC",
                  desc: "Standard MCP over HTTP: initialize, tools/list, tools/call.",
                },
                {
                  method: "GET",
                  path: "/api/health",
                  badge: "Ops",
                  desc: "Liveness probe for uptime monitors and agent health checks.",
                },
              ].map((ep) => (
                <div
                  key={ep.path + ep.method}
                  className="p-2.5 border rounded-lg bg-background flex items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-[9px] font-mono px-1 ${
                          ep.method === "GET"
                            ? "text-emerald-600 border-emerald-600/40"
                            : "text-blue-600 border-blue-600/40"
                        }`}
                      >
                        {ep.method}
                      </Badge>
                      <span className="font-mono text-[11px] font-bold">
                        {ep.path}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {ep.desc}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-[10px] font-mono shrink-0"
                  >
                    {ep.badge}
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="pt-1">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Tool Definitions ({TOOL_DEFINITIONS.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {TOOL_DEFINITIONS.map((tool) => (
              <div key={tool.name} className="p-2 border rounded bg-muted/20">
                <span className="font-mono font-bold text-foreground text-[11px]">
                  {tool.name}
                </span>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {tool.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
