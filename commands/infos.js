const Discord = require("discord.js")

module.exports = {
    run: async (message, args) => {
        if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply("\nVous n'avez pas la permission d'utiliser cette commande.")
        const member = message.mentions.members.first()
        if(!member) return message.reply("\nVeuillez cibler un utilisateur présent sur le serveur.\n**Exemple:** !infos @NitrousBGC")
        if(message.member.roles.highest.comparePositionTo(member.roles.highest) < 1 && message.author.id !== message.guild.ownerID) return message.reply("\nVous ne pouvez pas utiliser cette commande sur cet utilisateur.")
        if(member.bot) return message.reply("\nVeuillez cibler un utilisateur présent sur le serveur.\n**Exemple:** !infos @NitrousBGC")
        var embed = new Discord.MessageEmbed;
        embed.setColor("#90F3FF")
        embed.setTitle(" 📃 " + member.displayName + " 📃 ")
        embed.setURL(member.user.displayAvatarURL({ dynamic: true }))
        embed.setDescription(`► Informations concernant: <@!${member.id}>`)
        embed.addField("Rôle:", member.roles.highest, false)
        embed.addField("ID Utilisateur:", member.user.id, false)
        if(member.voice.channel == null) {
            embed.addField("Vocal:", "Aucun", true)
        } else {
            embed.addField("Vocal:", member.voice.channel, true)
        }
        embed.addField("Compte créé le:", member.user.createdAt.getDay() + "/" + member.user.createdAt.getMonth() + "/" + member.user.createdAt.getFullYear() + " à " + member.user.createdAt.getHours() + "h" + member.user.createdAt.getMinutes(), true)
        if(member.lastMessage == null) {
            embed.addField("Dernier message:", "Aucun dernier message.", false)
        } else {
            embed.addField("Dernier message:", member.lastMessage, false)
        }
        embed.addField("Tag utilisateur:", member.user.tag, true)
        embed.addField("Rejoint le:", member.joinedAt.getDay() + "/" + member.joinedAt.getMonth() + "/" + member.joinedAt.getFullYear() + " à " + member.joinedAt.getHours() + "h" + member.joinedAt.getMinutes(), true)
        embed.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        embed.setTimestamp()
        embed.setFooter("𝐓𝐇𝐄 𝐍𝐈𝐓𝐑𝐎𝐔𝐒 𝐂𝐎𝐌𝐌𝐔𝐍𝐈𝐓𝐘", "https://cdn.discordapp.com/attachments/702708620726632458/831292254135648326/PP.jpg")
        message.channel.send(embed)
    },
    name: 'infos',
    guildOnly: true
}