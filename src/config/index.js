module.exports = {
    server: {
        port: 3000
    },
    bot: {
        verifyToken: process.env.BOT_VERIFY_TOKEN,
        pageAccessToken: process.env.BOT_PAGE_ACCESS_TOKEN
    },
    facebook: {
        baseURL: "https://graph.facebook.com/v2.6"
    },
    apiAi: {
        clientAccessToken: process.env.APIAI_CLIENT_ACCESS_TOKEN
    }
};