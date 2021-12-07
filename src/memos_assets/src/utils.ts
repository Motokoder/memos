import { Memo, MemoListItem } from "../../declarations/memos/memos.did";
import { MemoViewModel } from "./types";

export const epochTimeToShortDate = (epochTime: BigInt) => {
    return new Date(Number(epochTime)).toLocaleDateString();
};

export const epochTimeToShortTime = (epochTime: BigInt) => {
    return new Date(Number(epochTime)).toLocaleTimeString();
};

export const sortMemoList = (memoList: MemoListItem[]) => {
    memoList.sort((a: MemoListItem, b: MemoListItem) => Number(b.id) - Number(a.id));
};

// Adds additonal display attributes to Memo and MemoListItem objects.
export const toMemoViewModel = (memo: Memo | MemoListItem) => {
    const viewModel: MemoViewModel = { 
        ...memo,
        content: memo['content'] || '',
        originalContent: memo['content'] || '',
        changed: false,
        displayId: memo.id > 0 ? memo.id.toString() : ' - ',
        displayDate: memo.updated > 0 ? epochTimeToShortDate(memo.updated) : ' - ',
        displayTime: memo.updated > 0 ? epochTimeToShortTime(memo.updated) : '',
    };

    return viewModel;
}