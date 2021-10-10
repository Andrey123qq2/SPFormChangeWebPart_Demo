export { };

declare global {
    interface String {
        formatWithArray(array: Array<string>): string;
    }
}