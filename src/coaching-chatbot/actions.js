import Formatter from '../lib/personal-information-formatter-service';

export function setName({ context, input }) {
    return Promise.resolve({
        context: {
            ...context,
            name: input,
        },
    });
}

export function setJob({ context, input }) {
    return Promise.resolve({
        context: {
            ...context,
            job: input,
        },
    });
}

export function setAge({ context, input }) {
    return Promise.resolve({
        context: {
            ...context,
            age: input,
        },
    });
}

export function setPlace({ context, input }) {
    return Promise.resolve({
        context: {
            ...context,
            place: input,
        },
    });
}

export function updateProfile({ context, userData }) {
    let profile = Formatter.createProfile(context);

    return Promise.resolve({
        userData: {
            ...userData,
            profile,
        },
    });
}

export function reset() {
    return Promise.resolve({
        context: {},
    });
}
