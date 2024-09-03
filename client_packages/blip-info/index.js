// API
mp.Blip.prototype.setInfo = function(info) {
    this._missionCreatorData = info;
    this.setAsMissionCreator(true);
};

mp.Blip.prototype.resetInfo = function() {
    delete this._missionCreatorData;
    this.setAsMissionCreator(false);
};

// functions
function callScaleformMethodOnFrontend(methodName, ...args) {
    if (mp.game.graphics.beginScaleformMovieMethodOnFrontend(methodName)) {
        for (const arg of args) {
            switch (typeof arg) {
                case "boolean":
                    mp.game.graphics.scaleformMovieMethodAddParamBool(arg);
                    break;

                case "string":
                    mp.game.graphics.scaleformMovieMethodAddParamPlayerNameString(arg);
                    break;

                case "number":
                    if (Number.isInteger(arg)) {
                        mp.game.graphics.scaleformMovieMethodAddParamInt(arg);
                    } else {
                        mp.game.graphics.scaleformMovieMethodAddParamFloat(arg);
                    }

                    break;

                default:
                    throw new TypeError(`Unsupported argument type for ${methodName} - ${typeof arg}`);
            }
        }

        mp.game.graphics.endScaleformMovieMethod();
    }
}

// rendering
let lastHoveredBlipHandle = 0;

function handleMissionCreatorBlips() {
    if (!mp.game.hud.isFrontendReadyForControl()) {
        return;
    }

    // what in the spaghetti fuck, from decompiled pausemenu_map script
    const curHoveredBlipHandle = mp.game.hud.getNewSelectedMissionCreatorBlip();
    if (mp.game.hud.isHoveringOverMissionCreatorBlip()) {
        if (lastHoveredBlipHandle !== curHoveredBlipHandle && mp.game.hud.doesBlipExist(curHoveredBlipHandle)) {
            if (mp.game.hud.doesBlipExist(lastHoveredBlipHandle)) {
                callScaleformMethodOnFrontend("SET_DATA_SLOT_EMPTY", 1);
            }

            lastHoveredBlipHandle = 0;
        }
    } else {
        if (mp.game.hud.doesBlipExist(lastHoveredBlipHandle)) {
            callScaleformMethodOnFrontend("SET_DATA_SLOT_EMPTY", 1);
        }

        lastHoveredBlipHandle = 0;
    }

    if (curHoveredBlipHandle !== lastHoveredBlipHandle && mp.game.hud.doesBlipExist(curHoveredBlipHandle) && mp.game.hud.isMissionCreatorBlip(curHoveredBlipHandle)) {
        const blip = mp.blips.atHandle(curHoveredBlipHandle);
        if (blip && blip._missionCreatorData) {
            mp.game.hud.takeControlOfFrontend();
            callScaleformMethodOnFrontend("SHOW_COLUMN", 65, 1, true);

            const { title, type, textureDict, textureName, rpText, cashText, apText, components } = blip._missionCreatorData;

            // header
            callScaleformMethodOnFrontend("SET_COLUMN_TITLE", 1, "", title || "", type || 0, textureDict || "", textureName || "", 1, 0, rpText || false, cashText || false, apText || false);

            // components
            components?.forEach((component, index) => {
                switch (component.type) {
                    // title and value
                    case 0:
                    case 1:
                        callScaleformMethodOnFrontend("SET_DATA_SLOT", 1, index, 65, index, component.type, 0, 1, component.title || "", component.value || "");
                        break;

                    // title and value with icon
                    case 2:
                        callScaleformMethodOnFrontend("SET_DATA_SLOT", 1, index, 65, index, component.type, 0, 1, component.title || "", component.value || "", component.iconIndex || 0, component.iconHudColor || 0, component.isTicked || false);
                        break;

                    // title and value but value is a player name
                    case 3:
                        callScaleformMethodOnFrontend("SET_DATA_SLOT", 1, index, 65, index, component.type, 0, 1, component.title || "", component.value || "", component.crewTag || "", component.isSocialClubName || false);
                        break;

                    // divider
                    case 4:
                        callScaleformMethodOnFrontend("SET_DATA_SLOT", 1, index, 65, index, component.type, 0, 0);
                        break;

                    // description
                    case 5:
                        callScaleformMethodOnFrontend("SET_DATA_SLOT", 1, index, 65, index, component.type, 0, 0, component.value || "");
                        break;
                }
            });

            callScaleformMethodOnFrontend("DISPLAY_DATA_SLOT", 1);
            mp.game.hud.releaseControlOfFrontend();
        }

        lastHoveredBlipHandle = curHoveredBlipHandle;
    }
}

// register event handlers
mp.events.add("render", handleMissionCreatorBlips);
