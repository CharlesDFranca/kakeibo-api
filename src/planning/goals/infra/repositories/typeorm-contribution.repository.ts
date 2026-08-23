import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contribution } from '../../domain/entities/contribution.entity';
import { IContributionRepository } from '../../domain/repositories/contribution-repository.interface';
import { ContributionEntity } from '@/shared/infra/database/entities/typeorm-contribution.entity';
import { TypeOrmContributionMapper } from '../mappers/typeorm-contribution.mapper';

@Injectable()
export class TypeOrmContributionRepository implements IContributionRepository {
    constructor(
        @InjectRepository(ContributionEntity)
        private readonly contributionRepository: Repository<ContributionEntity>,
    ) {}

    async create(contribution: Contribution): Promise<void> {
        const entity = TypeOrmContributionMapper.toPersistence(contribution);

        await this.contributionRepository.save(entity);
    }

    async findById(id: string): Promise<Contribution | null> {
        const contribution = await this.contributionRepository.findOne({
            where: { id },
        });

        if (!contribution) {
            return null;
        }

        return TypeOrmContributionMapper.toDomain(contribution);
    }

    async findByGoalId(goalId: string): Promise<Contribution[]> {
        const contributions = await this.contributionRepository.find({
            where: { goalId },
        });

        return contributions.map((contribution) =>
            TypeOrmContributionMapper.toDomain(contribution),
        );
    }

    async deleteByGoalId(goalId: string): Promise<void> {
        await this.contributionRepository.delete({ goalId });
    }
}
