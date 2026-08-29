import { InvalidEnumValueError } from '../domain/errors/invalid-enum-value.error';

export function parseEnum<T extends Record<string, string>>(
    value: string,
    enumType: T,
): T[keyof T] {
    const enumValue = Object.values(enumType).find((item) => item === value);

    if (!enumValue) throw new InvalidEnumValueError(value);

    return enumValue as T[keyof T];
}
