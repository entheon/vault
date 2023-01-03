(
  function() {
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
    }

    function DCToDamageDie(dc) {
      if (dc < 10) {
        return "1d4"
      } else if (10 <= dc && dc <= 12) {
        return "1d6"
      } else if (13 <= dc && dc <= 15) {
        return "2d6"
      } else if (16 <= dc && dc <= 18) {
        return "3d6"
      } else {
        return "4d6"
      }
    }

    // Getting DC
    let trapDC = getRandomInt(10, 16);

    // Getting damage die
    let damageDie = DCToDamageDie(trapDC)

    // Create chat content
    let chatContent = `
    <b>Trap activated!</b>
    <br>Roll a Survival check! (DC ${trapDC})
    <hr>Take [[/r ${damageDie}]]  damage on a failed check,
    or half as much damage on a successful one.
    `;

    let chatData = {
      user: game.user._id,
      speaker: ChatMessage.getSpeaker(),
      content: chatContent,
      type: CONST.CHAT_MESSAGE_TYPES.OTHER
    };
    ChatMessage.create(chatData);
  }
)();
