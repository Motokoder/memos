import { memos } from '../../declarations/memos/index';
import { MemoListItem } from '../../declarations/memos/memos.did';
import { MemoViewModel } from './types';
import { sortMemoList, toMemoViewModel } from './utils';

const NotFound = 'NotFound';
const EmptyContent = 'EmptyContent';
const UnexpectedError = 'Unexpected error.'

export async function saveMemo(id: bigint, content: string) : Promise<MemoViewModel> {
    const result = await memos.saveMemo(id, content);

    if (result.err) {
        if (result.err.hasOwnProperty(NotFound)) {
            throw `Save failed. Memo with id ${id} not found.`;
        } else if (result.err.hasOwnProperty(EmptyContent)) {
            throw 'Save failed. Memo context can not be empty.';
        }
        throw UnexpectedError;
    }

    // if no error, the result is ok with 1 MemoListItem
    return toMemoViewModel(result.ok);
}

export async function getMemo(id: bigint) : Promise<MemoViewModel> {
    const result = await memos.getMemo(id);

    if (result.err) {
        if (result.err.hasOwnProperty(NotFound)) {
            throw `Memo with id ${id} not found.`;
        }
        throw UnexpectedError;
    }

    // if no error, the result is ok with 1 Memo
    return toMemoViewModel(result.ok);
}

export async function getMemoList() : Promise<MemoViewModel[]> {
    const result: MemoListItem[] = await memos.getMemoList();

    sortMemoList(result);

    // array of MemoListItem
    return result.map(memo => toMemoViewModel(memo));
}

