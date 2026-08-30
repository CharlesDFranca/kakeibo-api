import { randomUUID } from 'node:crypto';
import { IIDGenerator } from '@/core/app/contracts/id-generator.contract';

export class NodeCryptoIDGeneratorService implements IIDGenerator {
    generate(): string {
        return randomUUID();
    }
}
