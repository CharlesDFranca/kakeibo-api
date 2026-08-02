export function parseEnum<T extends Record<string, string>>(
    value: string,
    enumType: T,
): T[keyof T] {
    const enumValue = Object.values(enumType).find((item) => item === value);

    if (!enumValue) {
        throw new Error(`Invalid enum value: ${value}`);
    }

    return enumValue as T[keyof T];
}
