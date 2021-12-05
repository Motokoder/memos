module Types {
    public type Memo = {
        id: Nat;
        content: Text;
        updated: Int;
    };

    // thin version of Memo for UI lists that
    // reduces network payload by excluding content
    public type MemoListItem = {
        id: Nat;
        updated: Int;
    };

    public type Error = {
        #NotFound;
        #EmptyContent;
    };
};