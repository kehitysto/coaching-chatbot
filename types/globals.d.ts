declare class Context {
    name: string;
    job?: string;
    communicationMethods: {};
    meetingFrequency: string;
    searching: boolean;
    availablePeers: any;
    pairRequests: any;
    rejectedPeers: any;
    state: string;
}

declare class Promise {}

declare class Session {
    dialog: Builder;
    id: string;
    context: Context;
    _context: Context;
    _state: any[];
    _results: any[];
    _done: boolean;
}

declare function dialogHandler(session: Session, match?: TemplateStringsArray): void