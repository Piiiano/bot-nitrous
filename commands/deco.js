const Discord = require("discord.js")
const config = require("../config.json")

module.exports = {
    run: async (message, args) => {
        if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply("\nVous n'avez pas la permission d'utiliser cette commande.")
        const member = message.mentions.members.first()
        if(!member) return message.reply("\nVeuillez cibler un utilisateur présent sur le serveur.\n**Exemple:** !deco @NitrousBGC Soundboard")
        if(member.id === message.guild.ownerID) return message.reply("\nVous ne pouvez pas déconnecter le propriétaire du serveur.")
        if(message.member.roles.highest.comparePositionTo(member.roles.highest) < 1 && message.author.id !== message.guild.ownerID) return message.reply("\nVous ne pouvez pas utiliser cette commande sur cet utilisateur.")
        if(!member.kickable) return message.reply("\nLe bot ne peut pas déconnecter cet utilisateur.")
        if(member.voice.channel === null) return message.reply(`\nL'utilisateur ciblé n'est pas dans un salon vocal.`)
        const reason = args.slice(1).join(' ') || 'Aucune raison définie.'
        var embedDeco = new Discord.MessageEmbed
        embedDeco.setTitle("𝐓𝐇𝐄 𝐍𝐈𝐓𝐑𝐎𝐔𝐒 𝐂𝐎𝐌𝐌𝐔𝐍𝐈𝐓𝐘")
        embedDeco.setColor("#90F3FF")
        embedDeco.setThumbnail("https://cdn.discordapp.com/attachments/702708620726632458/831292254135648326/PP.jpg")
        embedDeco.setDescription(`📵 Vous venez d'être déconnecté du salon ${member.voice.channel} !\n\n__**Raison:**__ ${reason}`)
        embedDeco.setFooter("𝐓𝐇𝐄 𝐍𝐈𝐓𝐑𝐎𝐔𝐒 𝐂𝐎𝐌𝐌𝐔𝐍𝐈𝐓𝐘", "https://cdn.discordapp.com/attachments/702708620726632458/831292254135648326/PP.jpg")
        member.send(embedDeco).catch(console.error)
        message.reply(`\nVous venez de déconnecter **<@!${member.id}>** du channel ${member.voice.channel}.\n__**Raison:**__ ${reason}.`)
        //LOGS
        if(config.serverState.logsState.statue.toLowerCase() === "on".toLowerCase()) {
            message.guild.channels.cache.get(config.logsChannelID).send(new Discord.MessageEmbed()
            .setColor(config.greeting.mainColor)
            .setAuthor(` 📵 [DÉCO] ${member.user.tag}`, member.user.displayAvatarURL())
            .addField(`Utilisateur`, member, true)
            .addField(`Exécutant`, message.author, true)
            .addField(`Salon concerné`, member.voice.channel, false)
            .addField(`Raison`, reason, false)
            .setFooter(`ID Utilisateur: ${member.id}`, config.greeting.serverIcon)
            .setTimestamp())
        }
        await member.voice.setChannel(null, {reason})
    },
    name: 'deco',
    guildOnly: 'false'
}