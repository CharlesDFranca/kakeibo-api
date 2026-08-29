import { SessionExpirationMustBeAfterCreationError } from '../errors/session-expiration-must-be-after-creation.error';

export class Session {
    constructor(
        private readonly _id: string,
        private readonly _userId: string,
        private _expiresAt: Date,
    ) {
        if (_expiresAt.getTime() <= Date.now()) {
            throw new SessionExpirationMustBeAfterCreationError();
        }
    }

    public get id(): string {
        return this._id;
    }

    public get userId(): string {
        return this._userId;
    }

    public get expiresAt(): Date {
        return this._expiresAt;
    }

    public isActive(): boolean {
        return this._expiresAt.getTime() > Date.now();
    }

    public refresh(duration: number): void {
        this._expiresAt = new Date(Date.now() + duration);
    }
}
