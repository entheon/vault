let actors = canvas.tokens.controlled.map(controlled => controlled.actor);
let numActors = actors.length;
let actorIncrement = 0;
let randomActor = Math.floor(Math.random() * numActors);
let winningActor = '';

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

let awardCurrency = async (totalPP, totalGP, totalSP, totalCP) => {
    if (numActors == 0) {
        alert("No actors selected, please select at least one actor!")
        return;
    }

    totalPP = integerChecker(totalPP);
    totalGP = integerChecker(totalGP);
    totalSP = integerChecker(totalSP);
    totalCP = integerChecker(totalCP);

    let splitPP = Math.floor(totalPP / numActors);
    let splitGP = Math.floor(totalGP / numActors);
    let splitSP = Math.floor(totalSP / numActors);
    let splitCP = Math.floor(totalCP / numActors);

    let leftoverPP = totalPP % numActors;
    let leftoverGP = totalGP % numActors;
    let leftoverSP = totalSP % numActors;
    let leftoverCP = totalCP % numActors;

    for (const actor of actors) {
		actor.system.currency.pp += splitPP;
		actor.system.currency.gp += splitGP;
		actor.system.currency.sp += splitSP;
		actor.system.currency.cp += splitCP;

        if (actorIncrement == randomActor)
        {
			actor.system.currency.pp += leftoverPP;
			actor.system.currency.gp += leftoverGP;
			actor.system.currency.sp += leftoverSP;
			actor.system.currency.cp += leftoverCP;

            winningActor = actor.name;
			actor.update();
        }
        else
        {
            actor.update();
        }
        actorIncrement++;
    }

    let message = "<b>Gave " + numActors + " players each</b>:<br />";
    if (splitPP > 0) { message += "<span style='color:#90A2B6'>" + splitPP + "pp</span>"; if (splitGP > 0 || splitSP > 0 || splitCP > 0) { message += ", "; } }
    if (splitGP > 0) { message += "<span style='color:#B08C34'>" + splitGP + "gp</span>"; if (splitSP > 0 || splitCP > 0) { message += ", "; } }
    if (splitSP > 0) { message += "<span style='color:#717773'>" + splitSP + "sp</span>"; if (splitCP > 0) { message += ", "; } }
    if (splitCP > 0) { message += "<span style='color:#9D5934'>" + splitCP + "cp</span>"; }

    if (leftoverPP > 0 || leftoverGP > 0 || leftoverSP > 0 || leftoverCP > 0)
    {
        message = message + "<hr /><b>" + winningActor + " gets the remainder</b>:<br />";

	    if (leftoverPP > 0) { message += "<span style='color:#90A2B6'>" + leftoverPP + "pp</span>"; if (leftoverGP > 0 || leftoverSP > 0 || leftoverCP > 0) { message += ", "; } }
		if (leftoverGP > 0) { message += "<span style='color:#B08C34'>" + leftoverGP + "gp</span>"; if (leftoverSP > 0 || leftoverCP > 0) { message += ", "; } }
		if (leftoverSP > 0) { message += "<span style='color:#717773'>" + leftoverSP + "sp</span>"; if (leftoverCP > 0) { message += ", "; } }
		if (leftoverCP > 0) { message += "<span style='color:#9D5934'>" + leftoverCP + "cp</span>"; }
    }

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
        <h3>Currency Totals:</h3>
        <form>
            <div class="form-group" style="display: flex; width: 100%; margin: 10px 0px 10px 0px">
                <label for="pp" style="white-space: nowrap; margin: 4px 10px 0px 10px;">PP:</label>
                <input type="number" id="pp" name="pp" />
                <label for="pp" style="white-space: nowrap; margin: 4px 10px 0px 10px;">GP:</label>
                <input type="number" id="gp" name="gp" />
                <label for="pp" style="white-space: nowrap; margin: 4px 10px 0px 10px;">SP:</label>
                <input type="number" id="sp" name="sp"/ >
                <label for="pp" style="white-space: nowrap; margin: 4px 10px 0px 10px;">CP:</label>
                <input type="number" id="cp" name="cp"/ >
            </div>
        </form>
    `,
    buttons: {
        yes: {
            icon: '<i class="fas fa-check"></i>',
            label: "Distribute",
            callback: (html) => {
                let totalPP = html.find('#pp').val();
                let totalGP = html.find('#gp').val();
                let totalSP = html.find('#sp').val();
                let totalCP = html.find('#cp').val();

                // + converst string to number
                if (permissionCheck) {
                    awardCurrency(+totalPP, +totalGP, +totalSP, +totalCP);
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
