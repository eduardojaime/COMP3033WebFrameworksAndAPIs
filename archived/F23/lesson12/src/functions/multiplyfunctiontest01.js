const {app} = require("@azure/functions");

app.http("multiplyfunctiontest01", {
    methods: ["GET", "POST"],
    authLevel: "anonymous",
    handler: async (request, context) => {
        const x = request.query.get("x") || "0";
        const y = request.query.get("y") || "0";
        let result = x * y;
        return { body: `Result of ${x} * ${y} is ${result}` };
    }
});