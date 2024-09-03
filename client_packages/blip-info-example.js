const BlipInfoBuilder = require("./blip-info/BlipInfoBuilder");

// example blip data
const garageData = [
    {
        name: "Garage: 0120 Murrieta Heights",
        description: "With good access to the major roadways in and out of Los Santos, this spacious garage is perfect for the man or woman who might need to leave town in a hurry. Or is obsessed with cars.",
        position: new mp.Vector3(963.4199, -1022.1301, 39.8475),
        textureDict: "dyn_mp_24",
        textureName: "dyn_mp_24",
        slots: 10,
        price: 150000
    },
    {
        name: "Garage: Unit 14 Popular St",
        description: "If you're an individual who likes to keep their business private, look no further than this secluded garage in East Los Santos.",
        position: new mp.Vector3(895.9359, -888.7846, 26.2485),
        textureDict: "dyn_mp_25",
        textureName: "dyn_mp_25",
        slots: 6,
        price: 77500
    },
    {
        name: "Garage: Unit 2 Popular St",
        description: "Spacious garage in prime East Los Santos. Panoramic views of urban blight, walking distance to gang members.",
        position: new mp.Vector3(817.4532, -924.8551, 25.2430),
        textureDict: "dyn_mp_26",
        textureName: "dyn_mp_26",
        slots: 10,
        price: 142500
    },
    {
        name: "Garage: 331 Supply St",
        description: "Newly renovated garage with excellent square footage and direct road access. What better place to keep brand-new vehicles than the neighborhood with the highest crime rate in Los Santos?",
        position: new mp.Vector3(759.2387, -755.3151, 25.9151),
        textureDict: "dyn_mp_27",
        textureName: "dyn_mp_27",
        slots: 10,
        price: 135000
    },
    {
        name: "Garage: Unit 1 Olympic Fwy",
        description: "A good-sized garage in a quiet location within walking distance of the train for those days when you feel extra guilty about your 6-car carbon footprint.",
        position: new mp.Vector3(842.1298, -1165.0754, 24.3046),
        textureDict: "dyn_mp_28",
        textureName: "dyn_mp_28",
        slots: 6,
        price: 70000
    },
    {
        name: "Garage: 0754 Roy Lowenstein Blvd",
        description: "Located just a few brain-melting steps away from an electrical substation, you'll never have to worry losing power or reaching old age again at this garage in East Los Santos.",
        position: new mp.Vector3(528.8805, -1603.0293, 28.3225),
        textureDict: "dyn_mp_29",
        textureName: "dyn_mp_29",
        slots: 2,
        price: 29500
    },
    {
        name: "Garage: 12 Little Bighorn Ave",
        description: "Affluent on the inside, effluent on the outside! This garage offers panoramic views of the Los Santos waterways.",
        position: new mp.Vector3(569.9441, -1570.2930, 27.5777),
        textureDict: "dyn_mp_30",
        textureName: "dyn_mp_30",
        slots: 2,
        price: 32000
    },
    {
        name: "Garage: Unit 124 Popular St",
        description: "Calling all bargain hunters! In today's economy, it's all about desirable properties in undesirable areas. East Los Santos? We prefer to call it 'South of Vinewood'! Plus if the economy keeps tanking, you can go live in it!",
        position: new mp.Vector3(727.7570, -1189.8367, 23.2765),
        textureDict: "dyn_mp_31",
        textureName: "dyn_mp_31",
        slots: 2,
        price: 25000
    }
];

const seaRaceData = [
    {
        name: "Los Santos Port",
        position: new mp.Vector3(621.7491, -2136.7981, 0.0),
        textureDict: "spsearaces",
        textureName: "lossantos",
        recordTime: "01:23.456",
        recordHolder: "sea_racing_pro"
    },
    {
        name: "El Gordo",
        position: new mp.Vector3(3447.7471, 5192.9956, 0.0),
        textureDict: "spsearaces",
        textureName: "southcoast",
        recordTime: "00:00.123",
        recordHolder: "speed0fl1ght"
    },
    // lets say this one doesn't have a record yet
    {
        name: "Power Station",
        position: new mp.Vector3(3063.1135, 639.8550, 0.0),
        textureDict: "spsearaces",
        textureName: "northcoast"
    },
    // this one doesn't have a record yet as well and has a cash bonus
    {
        name: "Lago Zancudo",
        position: new mp.Vector3(198.1107, 3620.3972, 27.3487),
        textureDict: "spsearaces",
        textureName: "canyon",
        cashMultiplier: 2.5
    }
];

// event handlers
function onLocalPlayerReady() {
    // example 1: garage blips
    for (const garage of garageData) {
        // request the texture dict
        mp.game.graphics.requestStreamedTextureDict(garage.textureDict, false);

        // create the blip
        garage.blip = mp.blips.new(369, garage.position, { shortRange: true });

        // set garage info (using plain object)
        garage.blip.setInfo({
            // header
            title: garage.name,
            textureDict: garage.textureDict,
            textureName: garage.textureName,

            // data
            components: [
                { type: 0, title: "Capacity", value: `${garage.slots} vehicles` },
                { type: 0, title: "Price", value: `~g~$${garage.price}` },
                { type: 4 },
                { type: 5, value: garage.description }
            ]
        });

        // with BlipInfoBuilder it'd look like this:
        /* const info = new BlipInfoBuilder()
            .setTitle(garage.name)
            .setTexture(garage.textureDict, garage.textureName)
            .addComponent("Capacity", `${garage.slots} vehicles`)
            .addComponent("Price", `~g~$${garage.price}`)
            .addDividerComponent()
            .addDescriptionComponent(garage.description)
            .build();

        garage.blip.setInfo(info); */
    }

    // example 2: sea races
    mp.game.graphics.requestStreamedTextureDict("spsearaces", false);

    for (const race of seaRaceData) {
        // create the blip
        race.blip = mp.blips.new(316, race.position, { shortRange: true });

        // set race info (using BlipInfoBuilder)
        const info = new BlipInfoBuilder()
            .setTitle(race.name)
            .setTexture(race.textureDict, race.textureName)
            .addComponentWithIcon("Type", "Sea Race", 13, 1, false);

        if (race.cashMultiplier) {
            info.setCashText(`${race.cashMultiplier}x`);
        }

        if (race.recordHolder && race.recordTime) {
            info.addComponentWithPlayerName("Record Holder", race.recordHolder);
            info.addComponent("Record Time", race.recordTime);
        }

        race.blip.setInfo(info.build());
    }
}

function onLocalPlayerQuit(player) {
    if (player !== mp.players.local) {
        return;
    }

    // garage clean up
    for (const garage of garageData) {
        // unload the texture
        mp.game.graphics.setStreamedTextureDictAsNoLongerNeeded(garage.textureDict);

        // remove blip
        if (garage.blip) {
            garage.blip.resetInfo();
            garage.blip.destroy();
        }
    }

    // sea race clean up
    // unload the texture
    mp.game.graphics.setStreamedTextureDictAsNoLongerNeeded("spsearaces");

    // remove blips
    for (const race of seaRaceData) {
        if (race.blip) {
            race.blip.resetInfo();
            race.blip.destroy();
        }
    }
}

// register event handlers
mp.events.add({
    "playerReady": onLocalPlayerReady,
    "playerQuit": onLocalPlayerQuit
});
