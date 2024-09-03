exports = class BlipInfoBuilder {
    #data = {};

    #makeComponentsArray() {
        if (this.#data.components) {
            return;
        }

        this.#data.components = new Array();
    }

    /**
     * Sets the title.
     * @param {string?} title
     * @returns {BlipInfoBuilder}
     */
    setTitle(title) {
        this.#data.title = title;
        return this;
    }

    /**
     * Sets the badge type.
     * @param {number} type 0 = no badge, 1 = R* verified, 2 = R* created
     * @returns {BlipInfoBuilder}
     */
    setType(type) {
        if (!Number.isInteger(type)) {
            throw new TypeError("type was not an integer");
        }

        this.#data.type = type;
        return this;
    }

    /**
     * Sets the texture dictionary and name. **This method does not load the texture dictionary.**
     * @param {string?} textureDictionary
     * @param {string?} textureName
     * @returns {BlipInfoBuilder}
     */
    setTexture(textureDictionary, textureName) {
        this.#data.textureDict = textureDictionary;
        this.#data.textureName = textureName;
        return this;
    }

    /**
     * Sets the RP (Reputation) badge text.
     * @param {string?} text
     * @returns {BlipInfoBuilder}
     */
    setRpText(text) {
        this.#data.rpText = text;
        return this;
    }

    /**
     * Sets the cash badge text.
     * @param {string?} text
     * @returns {BlipInfoBuilder}
     */
    setCashText(text) {
        this.#data.cashText = text;
        return this;
    }

    /**
     * Sets the AP (Arena Points) badge text.
     * @param {string?} text
     * @returns {BlipInfoBuilder}
     */
    setApText(text) {
        this.#data.apText = text;
        return this;
    }

    /**
     * Adds a basic title - value component. **A blip can have a maximum of 10 components.**
     * @param {string?} title
     * @param {string?} value
     * @returns {BlipInfoBuilder}
     */
    addComponent(title, value) {
        this.#makeComponentsArray();
        this.#data.components.push({ type: 0, title, value });
        return this;
    }

    /**
     * Adds a title - value component with an icon. **A blip can have a maximum of 10 components.**
     * @param {string?} title
     * @param {string?} value
     * @param {number} iconIndex
     * @param {number} iconHudColor
     * @param {boolean} isTicked
     * @throws {TypeError} If `iconIndex` or `iconHudColor` is not a number.
     * @throws {TypeError} If `isTicked` is not boolean.
     * @returns {BlipInfoBuilder}
     */
    addComponentWithIcon(title, value, iconIndex, iconHudColor, isTicked = false) {
        if (!Number.isInteger(iconIndex)) {
            throw new TypeError("iconIndex was not an integer");
        } else if (!Number.isInteger(iconHudColor)) {
            throw new TypeError("iconHudColor was not an integer");
        } else if (typeof isTicked !== "boolean") {
            throw new TypeError("isTicked was not boolean");
        }

        this.#makeComponentsArray();
        this.#data.components.push({ type: 2, title, value, iconIndex, iconHudColor, isTicked });
        return this;
    }

    /**
     * Adds a title - value component where the value is a player name. **A blip can have a maximum of 10 components.**
     * @param {string?} title
     * @param {string?} playerName
     * @param {string?} packedCrewTag For example: `{*%CREW`
     * @param {boolean} isSocialClubName Adds the Social Club icon next to the name, does not work well with crew tags.
     * @returns {BlipInfoBuilder}
     */
    addComponentWithPlayerName(title, playerName, packedCrewTag = "", isSocialClubName = false) {
        if (typeof isSocialClubName !== "boolean") {
            throw new TypeError("isSocialClubName was not boolean");
        }

        this.#makeComponentsArray();
        this.#data.components.push({ type: 3, title, value: playerName, crewTag: packedCrewTag, isSocialClubName });
        return this;
    }

    /**
     * Adds a divider/line component. **A blip can have a maximum of 10 components.**
     * @returns {BlipInfoBuilder}
     */
    addDividerComponent() {
        this.#makeComponentsArray();
        this.#data.components.push({ type: 4 });
        return this;
    }

    /**
     * Adds a description component. **A blip can have a maximum of 10 components.**
     * @param {string?} value
     * @returns {BlipInfoBuilder}
     */
    addDescriptionComponent(value) {
        this.#makeComponentsArray();
        this.#data.components.push({ type: 5, value });
        return this;
    }

    /**
     * Returns the blip information object to be used with `blipMp.setInfo(...)`.
     * @returns {object}
     */
    build() {
        return this.#data;
    }
};
