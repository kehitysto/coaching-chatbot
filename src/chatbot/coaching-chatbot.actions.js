export function set_name(context, input) {
    return new Promise((resolve, reject) => {
        return resolve({
            ...context,
            name: input
        });
    });
}

export function set_job(context, input) {
    return new Promise((resolve, reject) => {
        return resolve({
            ...context,
            job: input
        });
    });
}

export function set_age(context, input) {
    return new Promise((resolve, reject) => {
        return resolve({
            ...context,
            age: input
        });
    });
}

export function set_place(context, input) {
    return new Promise((resolve, reject) => {
        return resolve({
            ...context,
            place: input
        });
    });
}

export function reset(context) {
    return new Promise((resolve, reject) => {
        return resolve({});
    });
}
