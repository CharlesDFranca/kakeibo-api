import { BaseEntity } from '@/shared/domain/entities/base-entity.entity';

type CategoryProps = {
    name: string;
    userId: string;
};

export class Category extends BaseEntity<CategoryProps> {
    constructor(
        id: string,
        props: CategoryProps,
        createdAt: Date,
        updatedAt: Date,
    ) {
        if (!props.name || props.name.trim() === '') {
            throw new Error('Category name cannot be empty');
        }

        super(id, props, createdAt, updatedAt);
    }

    public get name(): string {
        return this.props.name;
    }

    public get userId(): string {
        return this.props.userId;
    }

    public rename(name: string) {
        if (!name || name.trim() === '') {
            throw new Error('Category name cannot be empty');
        }

        this.props.name = name;
        this.touch();
    }
}
