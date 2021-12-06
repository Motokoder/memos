export const epochTimeToShortDate = (epochTime) => {
    return new Date(Number(epochTime)).toLocaleString();
};

export const sortMemoList = (memoList) => {
    memoList.sort((a, b) => Number(b.id) - Number(a.id));
};