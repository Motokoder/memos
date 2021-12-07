import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Types "./types";
import Database "./database";

actor Memos {
    type Memo = Types.Memo;
    type MemoListItem = Types.MemoListItem;
    type Error = Types.Error;

    stable var memosBackup : [(Nat,Memo)] = [];

    var memos : Database.Memos = Database.Memos(memosBackup);

    public shared query func getMemo(id : Nat) : async Result.Result<Memo, Error> {
        let memo = memos.get(id);
        switch (memo) {
            case null {
                return #err(#NotFound);
            };
            case (?v) {
                return #ok(v);
            };
        };
    };

    public shared query func getMemoList() : async [MemoListItem] {
        return memos.getList();
    };

    public shared func saveMemo(id : Nat, content : Text) : async Result.Result<MemoListItem, Error>  {
        // validate input
        if (Text.trim(content, #text " ").size() == 0) {
            return #err(#EmptyContent);
        };

        // add or update memo
        if (id == 0) {
            let newMemoListItem = memos.add(content);
            return #ok(newMemoListItem);
        } else {
            let updatedMemoListItem = memos.update(id, content);
            switch (updatedMemoListItem) {
                case null {
                    return #err(#NotFound);
                };
                case (?v) {
                    return #ok(v);
                };
            };
        };
    };

    system func preupgrade() {
        memosBackup := memos.getBackup();
    };

    system func postupgrade() {
        memosBackup := [];
    };
};
