const { Client } = require("discord.js");
const Discord = require("discord.js");
const fetch = require("node-fetch");
const client = new Discord.Client();
const cfg = botConfig = require("./botConfig.js");
const ACTIVITIES = {
"poker": {id:"755827207812677713",name: "Poker Night"},
"betrayal": {id: "773336526917861400",name: "Betrayal.io"},
"youtube": {id: "755600276941176913",name: "YouTube Together"},
"fishington": {id: "814288819477020702",name: "Fishington.io"}};
client.on('ready', async () => {
client.appInfo = await client.fetchApplication();
setInterval( async () => {
client.appInfo = await client.fetchApplication();}, 600);
client.user.setActivity(`virusxd`, { type:'PLAYING' })});
const log = message => {
console.log(`${message}`);};
client.on("ready", () => console.log(`${client.user.username} ismi ile giriş yapıldı`));
client.on("message", async message => {
if (message.author.bot || !message.guild) return;
if (message.content.indexOf(cfg.prefix) !== 0) return;
const args = message.content.slice(cfg.prefix.length).trim().split(" ");
const cmd = args.shift().toLowerCase();
if (cmd === "ping") return message.channel.send(`Pong! \`${client.ws.ping}ms\``);
if (cmd === "oynat") {
const channel = message.guild.channels.cache.get(args[0]);
if (!channel || channel.type !== "voice") return message.channel.send(`Şu Şekillerde Kullanın; \n**-------------------------------------** \n ${cfg.prefix}oynat kanalID youtube | Youtube Üzerinden Video Oynatırsınız! \n ${cfg.prefix}oynat kanalID poker | Poker Oyunu Oynarsınız! \n ${cfg.prefix}oynat kanalID betrayal | Betrayal Oyunu Oynarsınız! \n ${cfg.prefix}oynat kanalID fishington | Fishington Oyunu Oynarsınız!`);
if (!channel.permissionsFor(message.guild.me).has("CREATE_INSTANT_INVITE")) return message.channel.send("Beklenmeyen Bir Hata Oluştu ! ( Yetersiz Yetki. )");
const activity = ACTIVITIES[args[1] ? args[1].toLowerCase() : null];
if (!activity) return message.channel.send(`Doğru formatlar: \n${Object.keys(ACTIVITIES).map(m => `- **${cfg.prefix}activity <Channel_ID> ${m}**`).join("\n")}`);
fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
method: "POST",
body: JSON.stringify({
max_age: 86400,
max_uses: 0,
target_application_id: activity.id,
target_type: 2,
temporary: false,
validate: null}),
headers: {
"Authorization": `Bot ${client.token}`,
"Content-Type": "application/json"}})
.then(res => res.json())
.then(invite => {
if (invite.error || !invite.code) return message.channel.send(`🐤 Beklenmeyen bir hata oluştu`);
message.channel.send(`
**Ben Hazırım** 
🔔 Aşağıdaki bağlantıyı kullanarak **partiyi başlatabilirsin**

Bağlantı Linki: <https://discord.gg/${invite.code}>
`);}).catch(e => {message.channel.send(`🐤 Beklenmeyen bir hata oluştu`);})}});
client.login(cfg.token);
