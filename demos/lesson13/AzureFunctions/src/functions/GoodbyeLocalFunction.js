const { app } = require('@azure/functions');

app.http('GoodbyeLocalFunction', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        console.log("Good Night!");

        return { body: "Goodbye, see you later!" };
    }
});