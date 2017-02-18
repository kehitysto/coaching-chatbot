export function set_name({context, input}) {
    return Promise.resolve({
        context: {
            ...context,
            name: input
        }
    });
}

export function set_job({context, input}) {
    return Promise.resolve({
        context: {
            ...context,
            job: input
        }
    });
}

export function set_age({context, input}) {
    return Promise.resolve({
        context: {
            ...context,
            age: input
        }
    });
}

export function set_place({context, input}) {
    return Promise.resolve({
        context: {
            ...context,
            place: input
        }
    });
}

export function update_profile({context, userData}) {
    let profile = `${context.name}, ${context.job}`;

    if (context.age !== undefined) {
        profile += `, ${context.age}`;
    }
    if (context.place !== undefined) {
        profile += `, ${context.place}`;
    }

    return Promise.resolve({
        userData: {
            ...userData,
            profile
        }
    });
}

export function reset() {
    return Promise.resolve({
        context: {}
    });
}
