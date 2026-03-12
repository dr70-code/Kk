const { Client } = require('discord.js-selfbot-v13');
const { StreamConnection, VideoStream } = require('@dank074/discord-video-stream');
const path = require('path');
const fs = require('fs');

const client = new Client({ checkUpdate: false });
const CONFIG = {
    TOKEN: "MTIxOTIxMDM1MjQxMjA2NTgwNQ.GLWL4s.z82rnfSElpIk3hp4_X7m7Zbxa_51XhKHJso83c",
    PREFIX: "!",
    OWNER_ID: "466820693561180170"
};

client.on('ready', () => console.log(`[SUCCESS] Bot is online: ${client.user.tag}`));

client.on('messageCreate', async (msg) => {
    if (msg.author.id !== CONFIG.OWNER_ID || !msg.content.startsWith(CONFIG.PREFIX)) return;
    const args = msg.content.slice(CONFIG.PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'start') {
        const videoPath = path.join(__dirname, 'videos', args.join(' '));
        if (!fs.existsSync(videoPath)) return msg.reply("❌ الملف غير موجود.");
        const voiceChannel = msg.member?.voice.channel;
        if (!voiceChannel) return msg.reply("❌ ادخل روم أولاً.");

        try {
            const streamer = new StreamConnection(client);
            await streamer.joinVoice(voiceChannel.guild.id, voiceChannel.id);
            await streamer.createStream();
            const videoStream = new VideoStream(videoPath, {
                width: 256, height: 144, fps: 10, bitrate: 300
            });
            streamer.playVideo(videoStream);
            msg.reply("🎬 تم تشغيل البث بأقل جودة (توفير رام).");
        } catch (e) { msg.reply("❌ الرام ممتلئ، ارفع حجم الرام في الاستضافة."); }
    }
});

client.login(CONFIG.TOKEN);
