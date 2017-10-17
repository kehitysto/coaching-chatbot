module.exports = {
    GREETING: {
        any: [
          /^moi(?:kka)?/i,
          /^mo(?:ro)?/i,
          /^morjens(?:ta)/i,
          /^terve/i,
          /^tere/i,
          /^hei/i,
        ],
    },

    YES: {
        any: [
          /^[kj]/i,
          /^kyl(?:lä)?/i,
          /^j[ou]{2,}/i,
          /^ok/i,
          /^yes/i,
          /^(?:oo)?koo/i,
          /^jep[as]?/i,
        ],
    },

    NO: {
        any: [
          /^e/i,
          /^ei/i,
          /^en/i,
          /^emmä/i,
          /^no/i,
        ],
    },

    RETURN: {
        any: /^(?:palaa|takaisin|taaksepäin)?/i,
    },

    SET: {
        any: /^(?:lisää|aseta)\s*(?:mun|minun|mulle|minulle)?/i,
    },

    CHANGE: {
        any: /^(?:vaihda|muuta|aseta|muokkaa)\s*(?:mun|minun|mulle|minulle)?/i,
    },

    FIND: {
        any: /^(?:etsi|hae)/i,
    },

    SET_OR_CHANGE: {
        any: [
          '#SET',
          '#CHANGE',
        ],
    },

    SHOW: {
        any: /^näytä/i,
    },

    STOP: {
        any: [
          /^lopeta/i,
          /^keskeytä/i,
        ],
    },

    BREAK: {
        any: [
          /^hajoi?ta/i,
          /^riko/i,
          /^särj?e/i,
        ],
    },

    STOP_OR_BREAK: {
        any: [
          '#STOP',
          '#BREAK',
        ],
    },

    OPTIONAL_VALUE: {
        any: /(\w.*)?/i,
        match: (match) => match[1] || true,
    },

    NAME: {
        any: /^(?:nimi|nimeä|nimeksi|nimekseni|nimeni)/i,
    },

    BIO: {
        any: /^(?:kuvausta|kuvaukseksi|kuvaus)/i,
    },

    PAIR: {
        any: /^paria?/i,
    },

    SEARCHING: {
        any: [
          /^(?:parin ?)?(?:haku|hakeminen)/i,
          /^etsiminen/i,
        ],
    },

    PAIR_REQUEST: {
        any: [
          /^parinhaku(?:pyyntö|pyynnöt)/i,
          /^(?:pyyntö|pyynnöt)/i,
        ],
    },

    CHANGE_NAME: {
        each: [
          '#CHANGE',
          '#NAME',
          '#OPTIONAL_VALUE',
        ],
    },

    SET_BIO: {
        each: [
          '#SET_OR_CHANGE',
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

    RESET: {
        any: [
          /^aloita alusta/i,
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

    COMMUNICATION_METHODS: {
        any: [
          /^Skype/i,
          /^Puhelin/i,
        ],
    },

    BREAK_PAIR: {
        each: [
          '#STOP_OR_BREAK',
          /^pari/i,
        ],
    },

    GIVE_FEEDBACK: {
        any: [
            /^Anna palautetta/i,
        ],
    },

    NUMERIC_RATING: {
        any: [
            /^[0-4]$/i,
        ],
    },

    DAY: {
      any: [
          /^ma/i,
          /^ti/i,
          /^ke/i,
          /^to/i,
          /^pe/i,
          /^la/i,
          /^su/i,
      ],
    },

    TIME: {
        any: [
            /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/i,
        ],
    },

    CHANGE_DATE: {
        each: [
            '#CHANGE',
            /^tapaaminen/i,
            '#OPTIONAL_VALUE',
          ],
    },

    TEST: {
        each: [
            /^test/i,
          ],
    },
    COMMUNICATIONS: {
        any: [
            /^yhteystie(?:toja|dot|to)/i,
        ],
    },

    EDIT_COMMUNICATION_METHODS: {
        each: [
            '#CHANGE',
            '#COMMUNICATIONS',
            '#OPTIONAL_VALUE',
        ],
    },
};
