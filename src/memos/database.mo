import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Hash "mo:base/Hash";
import Map "mo:base/HashMap";
import Iter "mo:base/Iter";
import Types "./types";
import Utils "./utils";

module Database {
    type Memo = Types.Memo;
    type MemoListItem = Types.MemoListItem;

    public class Memos (backup : [(Nat,Memo)]) {
        let hashMap = Map.fromIter<Nat,Memo>(backup.vals(), 1, Nat.equal, Hash.hash);

        public func get(id : Nat) : ?Memo {
            return hashMap.get(id);
        };

        public func getList() : [MemoListItem] {
            let list = Iter.map(hashMap.vals(), 
                func (x : Memo) : MemoListItem { return { id = x.id; updated = x.updated} });
            return Iter.toArray(list);
        };

        public func add(content : Text) : MemoListItem {
            // start ids at 1 so that 0 can represent a new memo
            let newId = hashMap.size() + 1;

            let newMemo : Memo = {
                id = newId;
                content = content;
                updated = Utils.getEpochTime();
            };

            hashMap.put(newId, newMemo);

            let memoListItem : MemoListItem = {
                id = newMemo.id;
                updated = newMemo.updated;
            };

            return memoListItem;
        };

        public func update(id : Nat, content : Text) : ?MemoListItem {
            let existing = hashMap.get(id);
            if (existing == null) {
                return null;
            };

            let updatedMemo : Memo = {
                id = id;
                content = content;
                updated = Utils.getEpochTime();
            };

            let prev = hashMap.replace(id, updatedMemo);

            let memoListItem : MemoListItem = {
                id = updatedMemo.id;
                updated = updatedMemo.updated;
            };

            return ?memoListItem;
        };

        public func getBackup() : [(Nat,Memo)] {
            return Iter.toArray(hashMap.entries());
        };
    };
};