const Discord = require("discord.js")
const config = require("../config.json")

module.exports = {
    run: async (message, args) => {
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply(`\nVous n'avez pas la permission d'effectuer cette commande.`)
        const member = message.mentions.members.first()
        if(!member) return message.reply("\nVeuillez cibler un utilisateur présent sur le serveur.\n**Exemple:** !demute @NitrousBGC")
        if(member.id === message.guild.ownerID) return message.reply("\nVous ne pouvez pas demute le propriétaire du serveur.")
        if(message.member.roles.highest.comparePositionTo(member.roles.highest) < 1 && message.author.id !== message.guild.ownerID) return message.reply(`\nVous ne pouvez pas mute cet utilisateur.`)
        if(!member.manageable) return message.reply(`\nLe BOT ne peut pas demute ce membre.`)
        const muteRole = message.guild.roles.cache.find(role => role.name === 'Mute')
        if(!muteRole) return message.reply(`\nAucun rôle trouvé.`)
        if(!member.roles.cache.find(role => role.name === 'Mute')) return message.reply(`\nL'utilisateur ciblé n'est pas mute.`)
        await member.roles.remove(muteRole)
        var embedDemute = new Discord.MessageEmbed
        embedDemute.setTitle(config.greeting.serverName)
        embedDemute.setColor(config.greeting.mainColor)
        embedDemute.setThumbnail("https://cdn.discordapp.com/attachments/702708620726632458/831292254135648326/PP.jpg")
        embedDemute.setDescription(` 🎧 Vous venez d'être demute du serveur !\n\nVous pouvez de nouveau envoyer des messages et rejoindre les salons vocaux.`)
        embedDemute.setFooter("𝐓𝐇𝐄 𝐍𝐈𝐓𝐑𝐎𝐔𝐒 𝐂𝐎𝐌𝐌𝐔𝐍𝐈𝐓𝐘", "https://cdn.discordapp.com/attachments/702708620726632458/831292254135648326/PP.jpg")
        member.send(embedDemute)
        message.reply(`\nVous venez de demute **<@!${member.id}>**.`)
        //LOGS
        if(config.serverState.logsState.statue.toLowerCase() === "on".toLowerCase()) {
            message.guild.channels.cache.get(config.logsChannelID).send(new Discord.MessageEmbed()
            .setColor(config.greeting.mainColor)
            .setAuthor(` 🎧 [DEMUTE] ${member.user.tag}`, member.user.displayAvatarURL())
            .addField(`Utilisateur`, member, true)
            .addField(`Exécutant`, message.author, true)
            .setFooter(`ID Utilisateur: ${member.id}`, config.greeting.serverIcon)
            .setTimestamp())
        }
    },
    name: 'demute',
    guildOnly: 'true'
}