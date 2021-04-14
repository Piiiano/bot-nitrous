const Discord = require("discord.js")
const config = require("../config.json")

module.exports = {
    run: async (message, args) => {
        if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply(`\nVous n'avez pas la permission d'effectuer cette commande.`)
        const member = message.mentions.members.first()
        if(!member) return message.reply("\nVeuillez cibler un utilisateur présent sur le serveur.\n**Exemple:** !warn @NitrousBGC Harcèlement")
        if(member.id === message.guild.ownerID) return message.reply("\nVous ne pouvez pas warn le propriétaire du serveur.")
        if(message.member.roles.highest.comparePositionTo(member.roles.highest) < 1 && message.author.id !== message.guild.ownerID) return message.reply(`\nVous ne pouvez pas warn cet utilisateur.`)
        if(!member.manageable) return message.reply(`\nLe BOT ne peut pas warn ce membre.`)
        const reason = args.slice(1).join(' ') || 'Aucune raison fournie.'
        let muteRole1 = message.guild.roles.cache.find(role => role.name === 'WARN 1')
        let muteRole2 = message.guild.roles.cache.find(role => role.name === 'WARN 2')
        let muteRole3 = message.guild.roles.cache.find(role => role.name === 'WARN 3')
        if(!member.roles.cache.find(role => role.name === "WARN 1" || role.name === "WARN 2" || role.name === "WARN 3")){
            await member.roles.add(muteRole1)
            var embedWarn = new Discord.MessageEmbed
            embedWarn.setTitle(config.greeting.serverName)
            embedWarn.setColor(config.greeting.colorYellow)
            embedWarn.setThumbnail("https://cdn.discordapp.com/attachments/702708620726632458/831292254135648326/PP.jpg")
            embedWarn.setDescription(` ⚠️ Vous venez d'être warn du serveur pour la **première** fois !\n\n__**Raison:**__ ${reason}\n\nVous serez kick au bout du troisième warn !`)
            embedWarn.setFooter("𝐓𝐇𝐄 𝐍𝐈𝐓𝐑𝐎𝐔𝐒 𝐂𝐎𝐌𝐌𝐔𝐍𝐈𝐓𝐘", "https://cdn.discordapp.com/attachments/702708620726632458/831292254135648326/PP.jpg")
            member.send(embedWarn).catch(console.error)
            //LOGS
            if(config.serverState.logsState.statue.toLowerCase() === "on".toLowerCase()) {
                message.guild.channels.cache.get(config.logsChannelID).send(new Discord.MessageEmbed()
                .setColor(config.greeting.colorYellow)
                .setAuthor(` ⚠️ [WARN] ${member.user.tag}`, member.user.displayAvatarURL())
                .addField(`Utilisateur`, member, true)
                .addField(`Exécutant`, message.author, true)
                .addField(`Raison`, reason, false)
                .addField(`Nombre de Warn`, "1 Warn", true)
                .setFooter(`ID Utilisateur: ${member.id}`, config.greeting.serverIcon)
                .setTimestamp())
            }
            return message.reply(`\nVous venez de warn **<@!${member.id}>**.\n__**Raison:**__ ${reason}.\nC'est son **premier** warn.`)
        }
        if(member.roles.cache.find(role => role.name === "WARN 1")){
            await member.roles.remove(muteRole1)
            await member.roles.add(muteRole2)
            var embedWarn = new Discord.MessageEmbed
            embedWarn.setTitle(config.greeting.serverName)
            embedWarn.setColor(config.greeting.colorYellow)
            embedWarn.setThumbnail("https://cdn.discordapp.com/attachments/702708620726632458/831292254135648326/PP.jpg")
            embedWarn.setDescription(` ⚠️ Vous venez d'être warn du serveur pour la **deuxième** fois !\n\n__**Raison:**__ ${reason}\n\nVous serez kick au bout du troisième warn !`)
            embedWarn.setFooter("𝐓𝐇𝐄 𝐍𝐈𝐓𝐑𝐎𝐔𝐒 𝐂𝐎𝐌𝐌𝐔𝐍𝐈𝐓𝐘", "https://cdn.discordapp.com/attachments/702708620726632458/831292254135648326/PP.jpg")
            member.send(embedWarn).catch(console.error)
            //LOGS
            if(config.serverState.logsState.statue.toLowerCase() === "on".toLowerCase()) {
                message.guild.channels.cache.get(config.logsChannelID).send(new Discord.MessageEmbed()
                .setColor(config.greeting.colorYellow)
                .setAuthor(` ⚠️ [WARN] ${member.user.tag}`, member.user.displayAvatarURL())
                .addField(`Utilisateur`, member, true)
                .addField(`Exécutant`, message.author, true)
                .addField(`Raison`, reason, false)
                .addField(`Nombre de Warn`, "2 Warn", true)
                .setFooter(`ID Utilisateur: ${member.id}`, config.greeting.serverIcon)
                .setTimestamp())
            }
            return message.reply(`\nVous venez de warn **<@!${member.id}>**.\n__**Raison:**__ ${reason}.\nC'est son **deuxième** warn.`)
        }
        if(member.roles.cache.find(role => role.name === "WARN 2") || role.name === "WARN 3"){
            await member.roles.remove(muteRole2)
            await member.roles.add(muteRole3)
            var embedWarn = new Discord.MessageEmbed
            embedWarn.setTitle(config.greeting.serverName)
            embedWarn.setColor(config.greeting.colorRed)
            embedWarn.setThumbnail("https://cdn.discordapp.com/attachments/702708620726632458/831292254135648326/PP.jpg")
            embedWarn.setDescription(` ⚠️ Vous venez d'être warn du serveur pour la **troisième** fois !\n\nVous venez d'être expulsé du serveur.\n\n__**Raison:**__ ${reason}`)
            embedWarn.setFooter("𝐓𝐇𝐄 𝐍𝐈𝐓𝐑𝐎𝐔𝐒 𝐂𝐎𝐌𝐌𝐔𝐍𝐈𝐓𝐘", "https://cdn.discordapp.com/attachments/702708620726632458/831292254135648326/PP.jpg")
            member.send(embedWarn).catch(console.error)
            //LOGS
            if(config.serverState.logsState.statue.toLowerCase() === "on".toLowerCase()) {
                message.guild.channels.cache.get(config.logsChannelID).send(new Discord.MessageEmbed()
                .setColor(config.greeting.colorRed)
                .setAuthor(` ⚠️ [WARN] ${member.user.tag}`, member.user.displayAvatarURL())
                .addField(`Utilisateur`, member, true)
                .addField(`Exécutant`, message.author, true)
                .addField(`Raison`, reason, false)
                .addField(`Nombre de Warn`, "3 Warn", true)
                .setFooter(`ID Utilisateur: ${member.id}`, config.greeting.serverIcon)
                .setTimestamp())
            }
            await member.kick(reason)
            return message.reply(`\nVous venez de warn **<@!${member.id}>**.\n__**Raison:**__ ${reason}.\nC'est son **troisième** warn.\nLa sentence est irrévoquable et c'est le kick !`)
        }
    },
    name: 'warn',
    guildOnly: 'true'
}