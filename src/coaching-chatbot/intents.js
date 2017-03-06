module.exports = {
    greeting: {
        any: [/^moi(?:kka)?/i,
              /^mo(?:ro)?/i,
              /^morjens(?:ta)/i,
              /^terve/i,
              /^tere/i,
              /^hei/i],
    },

    yes: {
        any: [/^kyllä/i,
              /^j[ou]{2,}/i,
              /^jep[as]?/i],
    },

    no: {
        any: [/^ei/i,
              /^en/i],
    },

    set: {
        any: /^(?:lisää|aseta)\s*(?:mun|minun|mulle|minulle)?/i,
    },

    change: {
        any: /^(?:vaihda|muuta|aseta)\s*(?:mun|minun|mulle|minulle)?/i,
    },

    find: {
        any: /^(?:etsi|hae)/i,
    },

    set_or_change: {
        any: ['set', 'change'],
    },

    optional_value: {
        any: /(\w.*)?/i,
        match: (match) => match[1] || true,
    },

    name: {
        any: /^(?:nimi|nimeä|nimeksi|nimekseni)/i,
    },

    job: {
        any: [/^ammat(?:tia?|iksi|ikseni)/i,
              /^työ(?:tä|ksi|kseni)/i],
    },

    age: {
        any: /^(?:ikää?|iäksi)/i,
    },

    place: {
        any: /^paikka(?:kunta)?a?/i,
    },

    pair: {
        any: /^paria?/i,
    },

    change_name: {
        each: ['change', 'name', 'optional_value'],
    },

    change_job: {
        each: ['change', 'job', 'optional_value'],
    },

    set_age: {
        each: ['set_or_change', 'age', 'optional_value'],
    },

    set_place: {
        each: ['set_or_change', 'place', 'optional_value'],
    },

    find_pair: {
        each: ['find', 'pair'],
    },

    reset: {
        any: [/^\!reset$/],
    },
};
