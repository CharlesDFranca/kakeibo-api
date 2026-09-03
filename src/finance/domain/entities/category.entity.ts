import { BaseEntity } from '@/shared/domain/entities/base-entity.entity';
import { Name } from '@/shared/domain/value-objects/name.vo';

type CategoryProps = {
    name: Name;
    userId: string;
    isSystem: boolean;
    isActive: boolean;
};

export class Category extends BaseEntity<CategoryProps> {
    constructor(
        id: string,
        props: CategoryProps,
        createdAt: Date,
        updatedAt: Date,
    ) {
        super(id, props, createdAt, updatedAt);
    }

    public get name(): Name {
        return this.props.name;
    }

    public get userId(): string {
        return this.props.userId;
    }

    public get isSystem(): boolean {
        return this.props.isSystem;
    }

    public get isActive(): boolean {
        return this.props.isActive;
    }

    public rename(name: Name) {
        if (this.name.equals(name)) return;

        this.props.name = name;
        this.touch();
    }

    public canDelete(): boolean {
        return !this.isSystem;
    }
}
