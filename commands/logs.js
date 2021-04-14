const Discord = require ("discord.js")
const config = require ("../config.json")

module.exports = {
    run: (message) => {
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply(`\nVous n'avez pas la permission d'utiliser cette commande.`)
        let args = message.content.split(" ") 
        let state = args[1]
        let state2 = args[2]
        var embedMessage = new Discord.MessageEmbed
        embedMessage.setColor(config.greeting.mainColor)
        embedMessage.setTitle("🖥️  ÉTAT DES LOGS DU SERVEUR  🖥️")
        embedMessage.setThumbnail("https://cdn.discordapp.com/attachments/702708620726632458/831292254135648326/PP.jpg");
        embedMessage.setDescription(`► **Pour changer l'état des logs, exécutez la commande:**\n*!logs <main:join:msg> <on:off>*.`)
        embedMessage.addField(`__**Exemple**__:`, `!logs main off *(ferme les logs principaux)*.`, false)
        embedMessage.addField(`\nLogs principaux:`, `**${config.serverState.logsState.statue}**\n${config.serverState.logsState.date}\n${config.serverState.logsState.éxécutant}`, true)
        embedMessage.addField(`\nLogs join & leave:`, `**${config.serverState.joinState.statue}**\n${config.serverState.joinState.date}\n${config.serverState.joinState.éxécutant}`, true)
        embedMessage.addField(`\nLogs messages:`, `**${config.serverState.msgLogsState.statue}**\n${config.serverState.msgLogsState.date}\n${config.serverState.msgLogsState.éxécutant}`, true)
        embedMessage.setTimestamp()
        embedMessage.setFooter(config.greeting.serverName, config.greeting.serverIcon);
        if(!state || !state2) return message.reply(embedMessage)
        if(!isNaN(state) || !isNaN(state2)) { 
            console.log("1") 
            return message.reply(embedMessage) 
        }
        var d = new Date,
        dformat = [d.getDate(), d.getMonth()+1, d.getFullYear()].join('/')+' à '+[d.getHours(), d.getMinutes()].join('h');
        if(state.toLowerCase() === "main".toLowerCase()) {
            if(state2.toLowerCase() === "on".toLowerCase() && config.serverState.logsState.statue.toLowerCase() === "on".toLowerCase()) {
                return message.reply(`\nL'état des logs est déjà définis sur **ON**.`)
            }
            if(state2.toLowerCase() === "off".toLowerCase() && config.serverState.logsState.statue.toLowerCase() === "off".toLowerCase()) {
                return message.reply(`\nL'état des logs est déjà définis sur **OFF**.`)
            }
            if(state2.toLowerCase() === "on".toLowerCase() || state2.toLowerCase() === "off".toLowerCase()){

                config.serverState.logsState.statue = state2.toUpperCase()
                config.serverState.logsState.éxécutant = message.author
                config.serverState.logsState.date = dformat
                message.reply(`\nVous venez de définir les logs principaux sur: **${config.serverState.logsState.statue.toUpperCase()}**.`)
                //LOGS
                message.guild.channels.cache.get(config.logsChannelID).send(new Discord.MessageEmbed()
                .setColor(config.greeting.colorRed)
                .setAuthor(`🖥️ [LOGS] ${message.author.tag}`, message.author.displayAvatarURL())
                .addField(`Exécutant`, message.author, true)
                .addField(`Type de Log`, `Logs principaux`, true)
                .addField(`État`, config.serverState.logsState.statue.toUpperCase(), true)
                .setFooter(`ID Utilisateur: ${message.author.id}`, config.greeting.serverIcon)
                .setTimestamp())
            } else { return message.reply(embedMessage) }
        }
        else if(state.toLowerCase() === "join".toLowerCase()) {
            if(state2.toLowerCase() === "on".toLowerCase() && config.serverState.joinState.statue.toLowerCase() === "on".toLowerCase()) {
                return message.reply(`\nL'état des logs est déjà définis sur **ON**.`)
            }
            if(state2.toLowerCase() === "off".toLowerCase() && config.serverState.joinState.statue.toLowerCase() === "off".toLowerCase()) {
                return message.reply(`\nL'état des logs est déjà définis sur **OFF**.`)
            }
            if(state2.toLowerCase() === "on".toLowerCase() || state2.toLowerCase() === "off".toLowerCase()){
                config.serverState.joinState.statue = state2.toUpperCase()
                config.serverState.joinState.éxécutant = message.author
                config.serverState.joinState.date = dformat
                message.reply(`\nVous venez de définir les logs de join/leave sur: **${config.serverState.joinState.statue.toUpperCase()}**.`)
                //LOGS
                message.guild.channels.cache.get(config.logsChannelID).send(new Discord.MessageEmbed()
                .setColor(config.greeting.colorRed)
                .setAuthor(`🖥️ [LOGS] ${message.author.tag}`, message.author.displayAvatarURL())
                .addField(`Exécutant`, message.author, true)
                .addField(`Type de Log`, `Logs join/leave`, true)
                .addField(`État`, config.serverState.joinState.statue.toUpperCase(), true)
                .setFooter(`ID Utilisateur: ${message.author.id}`, config.greeting.serverIcon)
                .setTimestamp())
            } else { return message.reply(embedMessage)}
        }
        else if(state.toLowerCase() === "msg".toLowerCase()) {
            if(state2.toLowerCase() === "on".toLowerCase() && config.serverState.msgLogsState.statue.toLowerCase() === "on".toLowerCase()) {
                return message.reply(`\nL'état des logs est déjà définis sur **ON**.`)
            }
            if(state2.toLowerCase() === "off".toLowerCase() && config.serverState.msgLogsState.statue.toLowerCase() === "off".toLowerCase()) {
                return message.reply(`\nL'état des logs est déjà définis sur **OFF**.`)
            }
            if(state2.toLowerCase() === "on".toLowerCase() || state2.toLowerCase() === "off".toLowerCase()){
                config.serverState.msgLogsState.statue = state2.toUpperCase()
                config.serverState.msgLogsState.éxécutant = message.author
                config.serverState.msgLogsState.date = dformat
                message.reply(`\nVous venez de définir les logs de messages sur: **${config.serverState.msgLogsState.statue.toUpperCase()}**.`)
                //LOGS
                message.guild.channels.cache.get(config.logsChannelID).send(new Discord.MessageEmbed()
                .setColor(config.greeting.colorRed)
                .setAuthor(`🖥️ [LOGS] ${message.author.tag}`, message.author.displayAvatarURL())
                .addField(`Exécutant`, message.author, true)
                .addField(`Type de Log`, `Logs join/leave`, true)
                .addField(`État`, config.serverState.msgLogsState.statue.toUpperCase(), true)
                .setFooter(`ID Utilisateur: ${message.author.id}`, config.greeting.serverIcon)
                .setTimestamp())
            } else { return message.reply(embedMessage) }
        } else { return message.reply(embedMessage) }
    },
    name: 'logs',
    guildOnly: 'true'
}