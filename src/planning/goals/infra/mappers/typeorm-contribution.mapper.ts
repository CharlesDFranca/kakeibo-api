import { Injectable } from '@nestjs/common';
import { ContributionEntity } from '@/shared/infra/database/entities/typeorm-contribution.entity';
import { Contribution } from '../../domain/entities/contribution.entity';
import { Money } from '@/shared/domain/value-objects/Money';

@Injectable()
export class TypeOrmContributionMapper {
    public toDomain(raw: ContributionEntity): Contribution {
        return new Contribution(
            raw.id,
            {
                walletId: raw.walletId,
                goalId: raw.goalId,
                amount: Money.fromCents(raw.amount),
            },
            raw.createdAt,
            raw.updatedAt,
        );
    }

    public toPersistence(contribution: Contribution): ContributionEntity {
        const entity = new ContributionEntity();

        entity.id = contribution.id;
        entity.walletId = contribution.walletId;
        entity.goalId = contribution.goalId;
        entity.amount = contribution.amount.toCents();

        return entity;
    }
}
