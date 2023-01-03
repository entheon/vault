let actors = canvas.tokens.controlled.map(controlled => controlled.actor);
let numActors = actors.length;
let actorNames = actors.map(actor => actor.name);

let permissionCheck = false;
if (game.user.isGM == true || game.user.isTrusted == true) {
    permissionCheck = true;
}

/**
 * Checks if input is an integer.
 * If it isn't, returns 0. Else, returns the input.
 * @param {*} input
 * @returns
 */
let integerChecker = (input) => {
    if (!Number.isInteger(input)) {
        return 0;
    } else {
        return input;
    }
}

let awardExp = async (exp) => {
    if (numActors == 0) {
        alert("No actors selected, please select at least one actor!")
        return;
    }

    exp = integerChecker(exp);

    let individualExp = Math.floor(exp / numActors);
    for (const actor of actors) {
        actor.system.details.xp.value += individualExp;
        await actor.update();
    }

    let message = `${exp} Experience was split evenly between ${actorNames}`
    let chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker(),
        content: message,
        type: CONST.CHAT_MESSAGE_TYPES.OTHER
    };

    ChatMessage.create(chatData);
}

new Dialog({
    title: "Award EXP",
    content: `
        <h3>EXP to Award:</h3>
        <form>
            <div class="form-group">
                <label>Amount</label>
                <input type="number" id="exp"/>
            </div>
        </form>
    `,
    buttons: {
        yes: {
            icon: '<i class="fas fa-check"></i>',
            label: "Distribute",
            callback: (html) => {
                let exp = html.find("#exp").val();

                if (permissionCheck) {
                    // + converst string to number
                    awardExp(+exp);
                } else {
                    alert("You don't have permission for this!");
                }
            }
        },
        no: {
            icon: "<i class='fas fa-times'></i>",
            label: "Cancel"
        },
    },
    default: "Cancel"
}).render(true);
