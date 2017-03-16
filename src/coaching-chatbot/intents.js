module.exports = {
    GREETING: {
        any: [/^moi(?:kka)?/i,
              /^mo(?:ro)?/i,
              /^morjens(?:ta)/i,
              /^terve/i,
              /^tere/i,
              /^hei/i],
    },

    YES: {
        any: [/^kyllä/i,
              /^j[ou]{2,}/i,
              /^jep[as]?/i],
    },

    NO: {
        any: [/^ei/i,
              /^en/i],
    },

    SET: {
        any: /^(?:lisää|aseta)\s*(?:mun|minun|mulle|minulle)?/i,
    },

    CHANGE: {
        any: /^(?:vaihda|muuta|aseta)\s*(?:mun|minun|mulle|minulle)?/i,
    },

    FIND: {
        any: /^(?:etsi|hae)/i,
    },

    SET_OR_CHANGE: {
        any: ['#SET', '#CHANGE'],
    },

    OPTIONAL_VALUE: {
        any: /(\w.*)?/i,
        match: (match) => match[1] || true,
    },

    NAME: {
        any: /^(?:nimi|nimeä|nimeksi|nimekseni)/i,
    },

    JOB: {
        any: [/^ammat(?:tia?|iksi|ikseni)/i,
              /^työ(?:tä|ksi|kseni)/i],
    },

    AGE: {
        any: /^(?:ikää?|iäksi)/i,
    },

    PLACE: {
        any: /^paikka(?:kunta)?a?/i,
    },

    PAIR: {
        any: /^paria?/i,
    },

    CHANGE_NAME: {
        each: ['#CHANGE', '#NAME', '#OPTIONAL_VALUE'],
    },

    CHANGE_JOB: {
        each: ['#CHANGE', '#JOB', '#OPTIONAL_VALUE'],
    },

    SET_AGE: {
        each: ['#SET_OR_CHANGE', '#AGE', '#OPTIONAL_VALUE'],
    },

    SET_PLACE: {
        each: ['#SET_OR_CHANGE', '#PLACE', '#OPTIONAL_VALUE'],
    },

    FIND_PAIR: {
        each: ['#FIND', '#PAIR'],
    },

    RESET: {
        any: [/^\!reset$/],
    },
    COMMUNICATION_METHODS: {
        any: [/^Skype/, /^Puhelin/, /^Kahvila/],
    },
};
