const ZENROWS_API_KEY = '28ac6cbce58a2db5577fbfdd3b3325c6a01d198b'; // Your ZenRows API key
const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1418654823745716436/vuMKu1s095Cq3BfU06OF_Z_mwxG39zHppHJ3c4BX5X38WuJFWPGhIZdopWTEEXlophiN'; // Chatot’s singing spot
const EMAILJS_USER_ID = '8w7eu6mrg3lRl6ta3'; // Delibird’s ID
const EMAILJS_SERVICE_ID = 'service_ahqdaj5'; // Delibird’s service
const EMAILJS_TEMPLATE_ID = 'template_whhvnra'; // Delibird’s letter template
const CAPSOLVER_KEY = 'CAP-E20E90A1238FE858B9CCCFC6F53DC436C385BF7089101FD86F5EEA47FC43CA95'; // Machamp’s punching power
const CHECK_URLS = ['https://www.pokemoncenter.com/', 'https://www.pokemoncenter.com/category/trading-card-game']; // Places to check
const ZENROWS_ENDPOINT = 'https://api.zenrows.com/v1/'; // ZenRows API
const NOTIFICATION_SETTINGS = {
    queueDetected: true, // Alert for queues
    queueSoon: true, // Alert for possible queues
    possibleBotBlock: true, // Alert for weird pages
    captchaDetected: true, // Alert for CAPTCHAs
    discord: true, // Chatot singing
    email: true // Delibird delivering
};
const EMAILS = ['kronborgnielsen@gmail.com']; // Delibird’s delivery address
const SECRET_KEY = 'skaplask'; // Secret code for Pikachu’s diary

// Special headers to stop Team Rocket (CORS errors)
const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://kronborg1980.github.io', // Only let your Pokédex talk
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Cache-Control',
    'Access-Control-Max-Age': '86400'
};

// Handle Team Rocket’s sneaky preflight checks
async function handleOptions() {
    return new Response(null, { status: 204, headers: corsHeaders });
}

// Pikachu’s diary (last 50 entries)
let workerLogs = [];
let lastCheck = null;

function addLog(message) {
    workerLogs.push(`[${new Date().toISOString()}] ${message}`);
    if (workerLogs.length > 50) workerLogs.shift();
}

async function sendDiscordNotification(title, message, color = 0xFFD700) {
    if (!NOTIFICATION_SETTINGS.discord || !DISCORD_WEBHOOK) {
        addLog('Chatot is sleeping: No webhook');
        return;
    }
    try {
        const response = await fetch(DISCORD_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ embeds: [{ title, description: message, color, footer: { text: 'Queue Hunter Pro' } }] })
        });
        if (!response.ok) throw new Error(`Discord webhook failed: ${response.statusText}`);
        addLog(`Chatot sang: ${title}`);
    } catch (e) {
        addLog(`Chatot error: ${e.message}`);
    }
}

async function sendEmailNotification(status, details) {
    if (!NOTIFICATION_SETTINGS.email || EMAILS.length === 0) {
        addLog('Delibird is napping: No emails');
        return;
    }
    const fancyDetails = `?? ${details}\n\n**Powered by Queue Hunter Pro**`;
    const timestamp = new Date().toLocaleString();
    let successCount = 0;
    for (const email of EMAILS) {
        try {
            const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: EMAILJS_USER_ID,
                    service_id: EMAILJS_SERVICE_ID,
                    template_id: EMAILJS_TEMPLATE_ID,
                    template_params: { status, details: fancyDetails, timestamp, to_email: email }
                })
            });
            if (!response.ok) throw new Error(`EmailJS failed: ${response.statusText}`);
            successCount++;
            addLog(`Delibird delivered to ${email}`);
        } catch (e) {
            addLog(`Delibird error for ${email}: ${e.message}`);
        }
    }
    addLog(`Delibird result: ${successCount}/${EMAILS
