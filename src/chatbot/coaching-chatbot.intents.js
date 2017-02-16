module.exports = {
    yes: [
        [/^kyllä/i,
         /^j[ou]{2,}/i]
    ],

    no: [
        [/^ei/i]
    ],

    change_name: [
        [/^vaihda nimi/i,
         /^vaihda nimeä/i]
    ],

    change_job: [
        [/^vaihda ammattia?/i,
         /^vaihda työ(?:tä)?/i]
    ],

    find_match: [
        [/^etsi pari/i]
    ],
    
    reset: [
        [/^\!reset$/]
    ],
};
