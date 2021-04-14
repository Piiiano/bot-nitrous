const Discord = require ("discord.js")
const config = require ("../config.json")

module.exports = {
    run: async (message) => {
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply(`\nVous n'avez pas la permission d'utiliser cette commande.`)
        let args = message.content.split(" ") 
        let nbr = args[1]
        if(!nbr) return message.reply(`\nIndiquez une valeur entre 0 et 100.`)
        if(isNaN(nbr)) return message.reply(`\nIndiquez une valeur entre 0 et 100.`)
        if(nbr < 1 || nbr > 100) return message.reply(`\nIndiquez une valeur entre 0 et 100.`)
        message.delete().then(message => {
            message.channel.bulkDelete(nbr, true).then(messages =>{
                message.member.send(`\nVous venez de supprimer **${messages.size}** message(s) dans le channel ${message.channel}.`)
            })
        })
    },
    name: 'clear',
    guildOnly: 'true'
}