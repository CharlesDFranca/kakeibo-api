export abstract class BaseEntity<Props> {
    protected constructor(
        private readonly _id: string,
        private readonly _props: Props,
        private readonly _createdAt: Date,
        private _updatedAt: Date,
    ) {
        if (!_id) throw new Error('Invalid entity id');
        if (!_props) throw new Error('Invalid entity props');

        if (!_createdAt || !this.isValidDate(_createdAt)) {
            throw new Error('Invalid create entity date');
        }

        if (!_updatedAt || !this.isValidDate(_updatedAt)) {
            throw new Error('Invalid update entity date');
        }

        if (_createdAt.getTime() > _updatedAt.getTime()) {
            throw new Error('Invalid entity date');
        }
    }

    public get id(): string {
        return this._id;
    }

    public get createdAt(): Date {
        return new Date(this._createdAt);
    }

    public get updatedAt(): Date {
        return new Date(this._updatedAt);
    }

    protected get props(): Props {
        return this._props;
    }

    protected touch(): void {
        this._updatedAt = new Date();
    }

    public isEqual(other: BaseEntity<Props>): boolean {
        if (!other) return false;

        return this.id === other.id;
    }

    protected isValidDate(date: Date): boolean {
        return !Number.isNaN(date.getTime());
    }
}
