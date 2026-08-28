import { HttpStatus } from '@nestjs/common';

export class HttpStatusCodeMapper {
    static fromCode(code: string): number {
        switch (code) {
            default:
                return HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }
}
