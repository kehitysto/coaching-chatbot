
/**
* @param {string} propName New property name for target
* @param {Object} target Target object
* @param {Object} changes Modified properties of target
* @param {Object} restOfProps
* @return {Promise} resolve({propName: {target}, ...restOfProps})
*/
function _mergePropChanges(propName, target, changes, ...restOfProps) {
    return Promise.resolve(Object.assign({
        [propName]: Object.assign(target, changes),
    }, ...restOfProps));
}

const resolveDataChanges = (propName) => {
    return (target = {}) => (changes = {}, ...restOfProps) =>
        Promise.resolve(changes).then((changes) =>
                _mergePropChanges(propName, target, changes, ...restOfProps));
};

export { resolveDataChanges };
