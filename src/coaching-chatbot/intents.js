module.exports = {
    YES: {
        any: [
          /^k(?:yllä|yl)?$/i,
          /^ok$/i,
          /^joo$/i,
        ],
    },

    NO: {
        any: /^e[in]?$/i,
    },

    OK: {
        any: /^ok$/i,
    },

    NEXT: {
        any: /^seuraavat?$/i,
    },

    RETURN: {
        any: /^(?:palaa|takaisin|peru|kumoa|poistu)$/i,
    },

    LIST_AS_SEARCHING: {
        any: /^lista(?:udu|lle|a)$/i,
    },

    TO_PROFILE: {
        any: /^profiili(in)?$/i,
    },

    SET: {
        any: /^(?:lisää|aseta)\s/i,
    },

    CHANGE: {
        any: /^(?:vaihda|muuta|muokkaa|hallinnoi)\s/i,
    },

    FIND: {
        any: /^(?:etsi|hae|selaa)\s/i,
    },

    SHOW: {
        each: /^näytä\s/i,
    },

    STOP: {
        any: /^(?:lopeta|keskeytä|poistu|päätä)\s/i,
    },

    DONE: {
        any: /^valmis$/i,
    },

    MANAGE: {
        any: /^halli(?:tse|nnoi)\s/i,
    },

    RESET: {
        any: /^(?:aloita alusta|nollaa|resetoi)$/i,
    },

    ADD: {
        any: /^lisää$/i,
    },

    SENT_REQUESTS: {
        any: /^lähetet(?:yt|ty)$/i,
    },

    RECEIVED_REQUESTS: {
        any: /^saapun(?:eet|ut)$/i,
    },

    REVOKE_REQUEST: {
        any: /^(?:peru|kumoa|poista)\spyyntö$/i,
    },

    DELETE: {
        each: /^poista$/i,
    },

    GIVE_FEEDBACK: {
        any: /^(?:anna palautetta|kommentoi|arvostele)$/i,
    },

    NUMERIC_RATING: {
        any: /^[0-4]$/i,
    },

    WEEKDAY: {
        any: [
            /^ma(?:anantai)?$/i,
            /^ti(?:istai)?$/i,
            /^ke(?:skiviikko)?$/i,
            /^to(?:rstai)?$/i,
            /^pe(?:rjantai)?$/i,
            /^la(?:uantai)?$/i,
            /^su(?:nnuntai)?$/i,
        ],
    },

    TIME: {
        any: /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/i,
    },

    EDIT_COMMUNICATION_METHODS: {
        any: /^yhteystie(?:toja|dot|to)$/i,
    },

    NAME: {
        each: [
            /^nimi/i,
            '#OPTIONAL_VALUE',
        ],
    },

    BIO: {
        each: [
            /^kuvaus/i,
            '#OPTIONAL_VALUE',
        ],
    },

    INFO: {
        each: /^tietoja$/i,
    },

    PAIR: {
        any: [
            /^(vertais)?ohja(?:ajaa|aja|ajia|us)$/i,
        ],
    },

    MEETING: {
        any: [
            /^tapaami(?:nen|sta)$/i,
            /^aikaa?$/i,
            /^päivää?$/i,
        ],
    },

    COMMUNICATION_METHODS: {
        any: [
            /^skype$/i,
            /^puhelin$/i,
        ],
    },

    SEARCHING: {
        any: /^((vertais)?ohjauksen)?\s?(?:haku|hakeminen|etsiminen)$/i,
    },

    PAIR_REQUEST: {
        any: /^(?:näytä|katso)? ?pyyn(?:tö|nöt|töjä)$/i,
    },

    TEST: {
        each: /^test$/i,
    },

    TOGGLE_REMINDERS: {
        any: [
            /^estä muistutukset$/i,
            /^salli muistutukset$/i,
        ],
    },

    HELP: {
        any: /^(?:info|ohje(et)?|help|faq|apua?)$/i,
    },

    OPTIONAL_VALUE: {
        any: /(\w.*)?/i,
        match: (match) => match[1] || true,
    },

    SET_OR_CHANGE: {
        any: [
            '#SET',
            '#CHANGE',
        ],
    },

    MANAGE_OR_CHANGE: {
        any: [
            '#MANAGE',
            '#CHANGE',
        ],
    },

    ADD_OR_CHANGE: {
        any: [
            '#ADD',
            '#CHANGE',
        ],
    },

    FIND_PAIR: {
        each: [
          '#FIND',
          '#PAIR',
        ],
    },

    STOP_SEARCHING: {
        each: [
          '#STOP',
          '#SEARCHING',
        ],
    },

    SHOW_PAIR_REQUESTS: {
        each: [
          '#SHOW',
          '#PAIR_REQUEST',
        ],
    },

    SHOW_SENT_REQUESTS: {
        each: [
          '#SENT',
          '#PAIR_REQUEST',
        ],
    },

    BREAK_PAIR: {
        each: [
          '#STOP',
          '#PAIR',
        ],
    },

    SHOW_PAIR: {
        each: [
            '#SHOW',
            '#PAIR',
        ],
    },

    SET_DATE: {
        each: [
            '#SET_OR_CHANGE',
            '#MEETING',
        ],
    },

    MANAGE_INFO: {
        each: [
            '#MANAGE_OR_CHANGE',
            '#INFO',
        ],
    },
};
