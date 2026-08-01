import { randomUUID } from 'node:crypto';
import { IUUIDGenerator } from 'shared/app/contracts/uuid-generator.contract';

export class UUIDGeneratorService implements IUUIDGenerator {
    generate(): string {
        return randomUUID();
    }
}
