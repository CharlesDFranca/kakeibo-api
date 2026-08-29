import { randomUUID } from 'node:crypto';
import { IIDGenerator } from '@/shared/app/contracts/id-generator.contract';

export class NodeCryptoIDGeneratorService implements IIDGenerator {
    generate(): string {
        return randomUUID();
    }
}
