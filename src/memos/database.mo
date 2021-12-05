import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Hash "mo:base/Hash";
import Map "mo:base/HashMap";
import Iter "mo:base/Iter";
import Time "mo:base/Time";
import Types "./types";

module Database {
    type Memo = Types.Memo;
    type MemoListItem = Types.MemoListItem;

    public class Memos (backup : [(Nat,Memo)]) {
        let hashMap = Map.fromIter<Nat,Memo>(backup.vals(), 10, Nat.equal, Hash.hash);

        public func get(id : Nat) : ?Memo {
            return hashMap.get(id);
        };

        public func getList() : [MemoListItem] {
            let list = Iter.map(hashMap.vals(), func (x : Memo) : MemoListItem { return { id = x.id; updated = x.updated} });
            return Iter.toArray(list);
        };

        public func add(content : Text) : Memo {
            // start ids at 1 so that 0 can represent a new memo
            let newId = hashMap.size() + 1;

            let newMemo : Memo = {
                id = newId;
                content = content;
                updated = Time.now();
            };

            hashMap.put(newId, newMemo);

            return newMemo;
        };

        public func update(id : Nat, content : Text) : ?Memo {
            let existing = hashMap.get(id);
            if (existing == null) {
                return null;
            };

            let updatedMemo : Memo = {
                id = id;
                content = content;
                updated = Time.now();
            };

            let prev = hashMap.replace(id, updatedMemo);

            return ?updatedMemo;
        };

        public func getBackup() : [(Nat,Memo)] {
            return Iter.toArray(hashMap.entries());
        };
    };
};