const Discord = require("discord.js")
const config = require("../config.json")

module.exports = {
    run: async (message, args) => {
        if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply("\nVous n'avez pas la permission d'utiliser cette commande.")
        const member = message.mentions.members.first()
        if(!member) return message.reply("\nVeuillez cibler un utilisateur prΓ©sent sur le serveur.\n**Exemple:** !kick @NitrousBGC Manque de respect")
        if(member.id === message.guild.ownerID) return message.reply("\nVous ne pouvez pas kick le propriΓ©taire du serveur.")
        if(message.member.roles.highest.comparePositionTo(member.roles.highest) < 1 && message.author.id !== message.guild.ownerID) return message.reply("\nVous ne pouvez pas utiliser cette commande sur cet utilisateur.")
        if(!member.kickable) return message.reply("\nLe bot ne peut pas exclure cet utilisateur.")
        const reason = args.slice(1).join(' ') || 'Aucune raison dΓ©finie.'
        var embedKick = new Discord.MessageEmbed
        embedKick.setTitle("πππ πππππππ πππππππππ")
        embedKick.setColor(config.greeting.colorYellow)
        embedKick.setThumbnail("https://cdn.discordapp.com/attachments/702708620726632458/831292254135648326/PP.jpg")
        embedKick.setDescription(` π₯ Vous venez d'Γͺtre kick du serveur !\n\n__**Raison:**__ ${reason}`)
        embedKick.setFooter("πππ πππππππ πππππππππ", "https://cdn.discordapp.com/attachments/702708620726632458/831292254135648326/PP.jpg")
        member.send(embedKick).catch(console.error)
        //LOGS
        if(config.serverState.logsState.statue.toLowerCase() === "on".toLowerCase()) {
            message.guild.channels.cache.get(config.logsChannelID).send(new Discord.MessageEmbed()
            .setColor(config.greeting.colorYellow)
            .setAuthor(` π₯ [KICK] ${member.user.tag}`, member.user.displayAvatarURL())
            .addField(`Utilisateur`, member, true)
            .addField(`ExΓ©cutant`, message.author, true)
            .addField(`Raison`, reason, false)
            .setFooter(`ID Utilisateur: ${member.id}`, config.greeting.serverIcon)
            .setTimestamp())
        }
        await member.kick(reason)
        message.reply(`\nVous venez d'exclure **${member.user.tag}**.\n__**Raison:**__ ${reason}.`)
    },
    name: 'kick',
    guildOnly: 'false'
}