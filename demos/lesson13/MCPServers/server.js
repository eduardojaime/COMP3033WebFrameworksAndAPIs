// Import mcp modules
const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
// Import transport modules
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
// Import zod for schema validation
const { z } = require("zod");

// Create a new MCP server instance
const server = new McpServer({
    name: "custom-tools-server",
    version: "1.0.0",
    capabilities: { // exposed capabilities: resources, tools, prompts
        tools: { } // functions that AI Agents can call
    }
});

// Define tools
// TODO: Addition tool
server.tool(
    "addition", // tool name
    "Adds two numbers together", // tool description
    {
        a: z.number().describe("The first number to add"),
        b: z.number().describe("The second number to add")
    },
    async ({ a, b }) => { // async function that takes parameters defined above
        // custom logic
        console.error(`Adding ${a} and ${b}`);
        const result = a + b;
        return {
            context: [
                { type: "text", text: `The result of adding ${a} and ${b} is ${result}` }
            ]
        };
    });

// TODO: Weather tool
server.tool(
    "weather", // tool name
    "Provides the current weather for a given city", // tool description
    {
        city: z.string().describe("The city to get the weather for")
    },
    async ({city}) => {
        // custom logic (mocked for demo purposes)
        console.error(`Fetching weather for ${city}`);
        const weatherInfo = `The current weather in ${city} is Sunny, 25°C. Good for outdoor activities!`;
        return {
            context: [
                { type: "text", text: weatherInfo }
            ]
        };
    }
);

// Add transport and start server
async function startServer() {
    console.error("Starting MCP server with custom tools...");
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("MCP server is running and ready to accept requests.");
}
startServer();