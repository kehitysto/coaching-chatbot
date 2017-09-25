declare class Builder {
    checkIntent(intentId: string, session: Session): boolean;
    run(sessionId: string, context: Context, input: string);
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
    meetingFrequency: string;
    searching: boolean;
    availablePeers: string[];
    pairRequests: string[];
    rejectedPeers: string[];
    state: string;
}

declare class Pairs {
    private db: InMemoryProvider | DynamoDBProvider;
}

declare class Promise<T> {
    static all<T>(promises: Promise<T>[]): Promise<T>
}

declare class Session {
    dialog: Builder;
    id: string;
    context: Context;
    _context: Context;
    _state: any[];
    _results: any[];
    _done: boolean;
    addQuickReplies(quickReplies: QuickReplies): void;
    addResult(templateId: string, quickReplies?: QuickReplies): void;
    allCommunicationMethodsFilled(): boolean;
    beginDialog(dialogId: string, inPlace?: boolean): void;
    checkIntent(intentId: string): boolean;
    clearState(): void;
    getCommunicationMethodsCount(): number;
    endDialog(): void;
    next(): void;
    prev(): void;
    resetDialog(): void;
    runActions(actions: string[]|string, input?: string): void;
    send(message: string, quickReplies: QuickReplies)
    switchDialog(dialogId: string): void;
}

declare class Sessions {

}

type QuickReplies = Array<{title: string, payload: string}>;

declare function dialogHandler(session: Session, match?: TemplateStringsArray): void