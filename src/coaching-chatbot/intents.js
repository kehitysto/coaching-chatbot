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

    NEXT: {
        any: /^(?:seuraavat|seuraava|seur)$/i,
    },

    RETURN: {
        any: /^(?:palaa|takaisin|peru|kumoa|poistu)$/i,
    },

    LIST_AS_SEARCHING: {
        any: /^(?:listaudu|listaa)$/i,
    },

    PROFILE: {
        any: /^(?:profiiliin|profiili|prof)$/i,
    },

    SET: {
        any: /^(?:lisää|aseta)\s/i,
    },

    CHANGE: {
        any: /^(?:vaihda|muuta|muokkaa)\s/i,
    },

    FIND: {
        any: /^(?:etsi|hae|selaa)\s/i,
    },

    SHOW: {
        each: /^näytä\s/i,
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

    EDIT: {
        any: /^lisää$/i,
    },

    DELETE: {
        each: /^poista$/i,
    },

    TO_PROFILE: {
        each: /^profiiliin$/i,
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

    EDIT_COMMUNICATION_METHODS: {
        any: /^yhteystie(?:toja|dot|to)$/i,
    },

    NAME: {
        any: /^(?:nimi|nimeä|nimeksi)/i,
    },

    BIO: {
        any: /^(?:kuvausta|kuvaukseksi|kuvaus)/i,
    },

    PAIR: {
        any: [
            /^(?:paria?)$/i,
            /^(parin)?hakijoita$/i,
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
        each: /^test$/i,
    },

    INFO: {
        any: /^(?:info|ohje(?:et))$/i,
    },

    SKIP_MEETING: {
        each: /^Ohita tämä viikko$/i,
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

    TOGGLE_REMINDERS: {
        any: [
            /^Estä muistutukset$/i,
            /^Salli muistutukset$/i,
        ],
    },

    OK: {
        any: /^ok$/i,
    },
};
