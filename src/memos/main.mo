import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Hash "mo:base/Hash";
import Map "mo:base/HashMap";
import Iter "mo:base/Iter";

actor Memos {

    type Memo = {
        id: Nat;
        content: Text;
        // lastUpdate: Nat; // time in nanoseconds
    };

    stable var memosTemp : [(Nat,Memo)] = [];

    let memos = Map.fromIter<Nat,Memo>(
        memosTemp.vals(), 10, Nat.equal, Hash.hash);

    public func addMemo(content : Text) : async () {
        let id = memos.size();

        let memo : Memo = {
            id = id;
            content = content;
        };

        memos.put(id, memo);
    };

    public func findMemo(id : Nat) : async ?Memo {
        return memos.get(id);
    };

    system func preupgrade() {
        memosTemp := Iter.toArray(memos.entries());
    };

    system func postupgrade() {
        memosTemp := [];
    };

    public func greet(name : Text) : async Text {
        return "Hello, " # name # "!";
    };
};
