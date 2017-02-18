module.exports = {
    yes: [
        [/^kyllä/i,
         /^j[ou]{2,}/i,
         /^jep[as]?/i]
    ],

    no: [
        [/^ei/i,
         /^en/i]
    ],

    change_name: [
        [/^(?:vaihda|muuta) (?:nimi|nimeä)\s*(\w.*)?/i],
        (match) => match[1] || true
    ],

    change_job: [
        [/^(?:vaihda|muuta) ammattia?\s*(\w.*)?/i,
         /^(?:vaihda|muuta) työ(?:tä)?\s*(\w.*)?/i],
        (match) => match[1] || true
    ],

    set_age: [
        [/^(?:lisää|aseta) (?:ikä|iäksi)\s*(\w.*)?/i],
        (match) => match[1] || true
    ],

    set_place: [
        [/^(?:lisää|aseta) paikka(?:kunta)?\s*(\w.*)?/i],
        (match) => match[1] || true
    ],

    find_match: [
        [/^(?:etsi|hae) paria?/i]
    ],

    reset: [
        [/^\!reset$/]
    ],
};
