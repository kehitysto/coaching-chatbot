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

    RETURN: {
        any: /^(?:palaa|takaisin|peru|kumoa|poistu)$/i,
    },

    SET: {
        any: /^(?:lisää|aseta)\s/i,
    },

    CHANGE: {
        any: /^(?:vaihda|muuta|muokkaa)\s/i,
    },

    FIND: {
        any: /^(?:etsi|hae)\s/i,
    },

    SHOW: {
        any: /^näytä\s/i,
    },

    STOP: {
        any: /^(?:lopeta|keskeytä|poistu)\s/i,
    },

    BREAK: {
        any: /^(?:hajota|riko|poista)\s/i,
    },

    RESET: {
        any: /^(?:aloita alusta|nollaa|resetoi)$/i,
    },

    GIVE_FEEDBACK: {
        any: /^(?:Anna palautetta|kommentoi|arvostele)$/i,
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

    COMMUNICATION: {
        any: /^yhteystie(?:toja|dot|to)$/i,
    },

    NAME: {
        any: /^(?:nimi|nimeä|nimeksi)/i,
    },

    BIO: {
        any: /^(?:kuvausta|kuvaukseksi|kuvaus)/i,
    },

    PAIR: {
        any: /^paria?$/i,
    },

    MEETING: {
        any: [
            /^tapaami(?:nen|sta)$/i,
            /^aika(?:a)$/i,
        ],
    },

    COMMUNICATION_METHODS: {
        any: [
            /^Skype$/i,
            /^Puhelin$/i,
        ],
    },

    SEARCHING: {
        any: /^(?:parin?)?\s?(?:haku|hakeminen|etsiminen)$/i,
    },

    PAIR_REQUEST: {
        any: /^(?:pyyntö|pyynnöt|pyyntöjä)$/i,
    },

    TEST: {
        each: [
            /^test/i,
        ],
    },

    INFO: {
        any: /^(?:info|ohje(?:et))$/i,
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

    CHANGE_NAME: {
        each: [
          '#CHANGE',
          '#NAME',
          '#OPTIONAL_VALUE',
        ],
    },

    CHANGE_BIO: {
        each: [
          '#CHANGE',
          '#BIO',
          '#OPTIONAL_VALUE',
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

    BREAK_PAIR: {
        each: [
          '#BREAK',
          '#PAIR',
        ],
    },

    SET_DATE: {
        each: [
            '#SET_OR_CHANGE',
            '#MEETING',
          ],
    },

    EDIT_COMMUNICATION_METHODS: {
        each: [
            '#SET_OR_CHANGE',
            '#COMMUNICATION',
        ],
    },

    SKIP_MEETING: {
        each: [
            /^En pääse tapaamiseen$/i,
          ],
    },

    NEXT: {
        any: /^(?:seuraavat|seuraava|seur)$/i,
    },
};
