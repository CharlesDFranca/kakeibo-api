import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('categories')
export class CategoryEntity {
    @PrimaryColumn()
    id!: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    name!: string;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt!: Date;
}
