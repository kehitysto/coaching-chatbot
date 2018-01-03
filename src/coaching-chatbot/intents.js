module.exports = {
    ADD: {
        any: /^lisää$/i,
    },

    ADD_OR_CHANGE: {
        any: [
            '#ADD',
            '#CHANGE',
        ],
    },

    BIO: {
        each: [
            /^kuvaus/i,
            '#OPTIONAL_VALUE',
        ],
    },

    BREAK_PAIR: {
        each: [
          '#STOP',
          '#PAIR',
        ],
    },

    CHANGE: {
        any: /^(?:vaihda|muuta|muokkaa|hallinnoi)\s/i,
    },

    COMMUNICATION_METHODS: {
        any: [
            /^skype$/i,
            /^puhelin$/i,
        ],
    },

    DELETE: {
        each: /^poista$/i,
    },

    DONE: {
        any: /^valmis$/i,
    },

    EDIT_COMMUNICATION_METHODS: {
        any: /^yhteystie(?:toja|dot|to)$/i,
    },

    FIND: {
        any: /^(?:etsi|hae|selaa)\s/i,
    },

    FIND_PAIR: {
        each: [
          '#FIND',
          '#PAIR',
        ],
    },

    GIVE_FEEDBACK: {
        any: /^(?:anna palautetta|kommentoi|arvostele)$/i,
    },

    HELP: {
        any: /^(?:info|ohje(et)?|help|faq|apua?)$/i,
    },

    INFO: {
        each: /^tietoja$/i,
    },

    LIST_AS_SEARCHING: {
        any: /^lista(?:udu|lle|a)$/i,
    },

    MANAGE: {
        any: /^halli(?:tse|nnoi)\s/i,
    },

    MANAGE_INFO: {
        each: [
            '#MANAGE_OR_CHANGE',
            '#INFO',
        ],
    },

    MANAGE_OR_CHANGE: {
        any: [
            '#MANAGE',
            '#CHANGE',
        ],
    },

    MEETING: {
        any: [
            /^tapaami(?:nen|sta)$/i,
            /^aikaa?$/i,
            /^päivää?$/i,
        ],
    },

    NAME: {
        each: [
            /^nimi/i,
            '#OPTIONAL_VALUE',
        ],
    },

    NEXT: {
        any: /^seuraavat?$/i,
    },

    NO: {
        any: /^e[in]?$/i,
    },

    NUMERIC_RATING: {
        any: /^[0-4]$/i,
    },

    OK: {
        any: /^ok$/i,
    },

    OPTIONAL_VALUE: {
        any: /(\w.*)?/i,
        match: (match) => match[1] || true,
    },

    PAIR: {
        any: [
            /^(vertais)?ohja(?:ajaa|aja|ajia|us)$/i,
        ],
    },

    PAIR_REQUEST: {
        any: /^pyyn(?:tö|nöt|töjä)$/i,
    },

    RECEIVED_REQUESTS: {
        any: /^saapun(?:eet|ut)$/i,
    },

    RESET: {
        any: /^(?:aloita alusta|nollaa|resetoi)$/i,
    },

    RETURN: {
        any: /^(?:palaa|takaisin|peru|kumoa|poistu)$/i,
    },

    REVOKE: {
        any: /^(?:peru|kumoa|poista)\s/i,
    },

    REVOKE_REQUEST: {
        each: [
            '#REVOKE',
            '#PAIR_REQUEST',
        ],
    },

    SEARCHING: {
        any: /^((vertais)?ohjauksen)?\s?(?:hak(?:u|eminen)|etsiminen)$/i,
    },

    SENT_REQUESTS: {
        any: /^lähetet(?:yt|ty)$/i,
    },

    SET: {
        any: /^(?:lisää|aseta)\s/i,
    },

    SET_DATE: {
        each: [
            '#SET_OR_CHANGE',
            '#MEETING',
        ],
    },

    SET_OR_CHANGE: {
        any: [
            '#SET',
            '#CHANGE',
        ],
    },

    SHOW: {
        each: /^(?:näytä|katso)\s/i,
    },

    SHOW_PAIR: {
        each: [
            '#SHOW',
            '#PAIR',
        ],
    },

    SHOW_PAIR_REQUEST: {
        each: [
            '#SHOW',
            '#PAIR_REQUEST',
        ],
    },

    STOP: {
        any: /^(?:lopeta|keskeytä|poistu|päätä)\s/i,
    },

    STOP_SEARCHING: {
        each: [
          '#STOP',
          '#SEARCHING',
        ],
    },

    TEST: {
        each: /^test$/i,
    },

    TIME: {
        any: /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/i,
    },

    TO_PROFILE: {
        any: /^profiili(in)?$/i,
    },

    TOGGLE_REMINDERS: {
        any: [
            /^estä muistutukset$/i,
            /^salli muistutukset$/i,
        ],
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

    YES: {
        any: [
          /^k(?:yllä|yl)?$/i,
          /^ok$/i,
          /^joo$/i,
        ],
    },
};
