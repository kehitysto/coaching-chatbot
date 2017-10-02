declare class Builder {
    checkIntent(intentId: string, session: Session): boolean;
    run(sessionId: string, context: Context, input: string): Promise<Session>;
}

declare class Chatbot {
    constructor(dialog: Builder, sessions: Sessions);
}

declare class Context {
    name: string;
    job: string;
    age: string;
    place: string;
    bio: string;
    communicationMethods: {};
    searching: boolean;
    availablePeers: (number|string)[];
    pairRequests: (number|string)[];
    rejectedPeers: (number|string)[];
    state: string;
}

<<<<<<< Updated upstream
declare class Pairs {
    private db: InMemoryProvider | DynamoDBProvider;
}

=======
>>>>>>> Stashed changes
declare class Promise<T> {
    static all<T>(promises: Promise<T>[]): Promise<T>
}

declare class Session {
    dialog: Builder;
    id: string;
    context: Context;
    _context: Context;
    _state: Array<Array<string|number>>;
    _results: any[];
    _done: boolean;
    addQuickReplies(quickReplies: QuickReplies): void;
    addResult(templateId: string, quickReplies?: QuickReplies): void;
    allCommunicationMethodsFilled(): boolean;
    beginDialog(dialogId: string, inPlace?: boolean): void;
    checkIntent(intentId: string): boolean;
    clearState(): void;
    getCommunicationMethodsCount(): number;
    getResult(): QuickReplies;
    endDialog(): void;
    next(): void;
    prev(): void;
    resetDialog(): void;
    runActions(actions: string[]|string, input?: string): void;
    send(message: string, quickReplies: QuickReplies)
    switchDialog(dialogId: string): void;
<<<<<<< Updated upstream
}

declare class Sessions {
    read(sessionId: string): Promise<Context>;
}

=======
}

declare class Sessions {
    read(sessionId: string): Promise<Context>;
}

>>>>>>> Stashed changes
type QuickReplies = Array<{title: string, payload: string}>;

declare function dialogHandler(session: Session, match?: TemplateStringsArray): void