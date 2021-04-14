const Discord = require("discord.js")
const config = require("../config.json")

module.exports = {
    run: async (message, args) => {
        if(!message.member.hasPermission("BAN_MEMBERS")) return message.reply("\nVous n'avez pas la permission d'utiliser cette commande.")
        const member = message.mentions.members.first()
        if(!member) return message.reply("\nVeuillez cibler un utilisateur présent sur le serveur.\n**Exemple:** !ban @NitrousBGC Manque de respect")
        if(member.id === message.guild.ownerID) return message.reply("\nVous ne pouvez pas ban le propriétaire du serveur.")
        if(message.member.roles.highest.comparePositionTo(member.roles.highest) < 1 && message.author.id !== message.guild.ownerID) return message.reply("\nVous ne pouvez pas utiliser cette commande sur cet utilisateur.")
        if(!member.bannable) return message.reply("\nLe bot ne peut pas ban cet utilisateur.")
        const reason = args.slice(1).join(' ') || 'Aucune raison définie.'
        var embedBan = new Discord.MessageEmbed
        embedBan.setTitle(config.greeting.serverName)
        embedBan.setColor(config.greeting.colorRed)
        embedBan.setThumbnail("https://cdn.discordapp.com/attachments/702708620726632458/831292254135648326/PP.jpg")
        embedBan.setDescription(` 🔨 Vous venez d'être ban du serveur !\n\n__**Raison:**__ ${reason}`)
        embedBan.setFooter("𝐓𝐇𝐄 𝐍𝐈𝐓𝐑𝐎𝐔𝐒 𝐂𝐎𝐌𝐌𝐔𝐍𝐈𝐓𝐘", "https://cdn.discordapp.com/attachments/702708620726632458/831292254135648326/PP.jpg")
        member.send(embedBan).catch(console.error)
        await member.ban({reason})
        message.reply(`\nVous venez de ban **${member.user.tag}**.\n__**Raison:**__ ${reason}.`)
        //LOGS
        if(config.serverState.logsState.statue.toLowerCase() === "on".toLowerCase()) {
            message.guild.channels.cache.get(config.logsChannelID).send(new Discord.MessageEmbed()
            .setColor(config.greeting.colorRed)
            .setAuthor(` 🔨 [BAN] ${member.user.tag}`, member.user.displayAvatarURL())
            .addField(`Utilisateur`, member, true)
            .addField(`Exécutant`, message.author, true)
            .addField(`Raison`, reason, false)
            .addField(`Durée`, '∞', true)
            .setFooter(`ID Utilisateur: ${member.id}`, config.greeting.serverIcon)
            .setTimestamp())
        }
    },
    name: 'ban',
    guildOnly: 'false'
}