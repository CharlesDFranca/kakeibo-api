import { BaseEntity } from '@/shared/domain/entities/base-entity.entity';
import { Name } from '@/shared/domain/value-objects/name.vo';

type CategoryProps = {
    name: Name;
    userId: string;
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

    public rename(name: Name) {
        if (this.name.equals(name)) return;

        this.props.name = name;
        this.touch();
    }
}
