export type MemoViewModel = {
    id: bigint;
    content: string;
    updated: bigint;
    originalContent: string;
    changed: boolean;
    displayId: string;
    displayDate: string;
    displayTime: string;
}