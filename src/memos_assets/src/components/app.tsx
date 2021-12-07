import * as React from "react";
import { useState, useEffect, ChangeEvent } from "react";
import * as Modal from "react-modal";
import * as Api from "../api";
import { sortMemoList, toMemoViewModel } from '../utils';
import { MemoViewModel } from "../types";
import Main from './main';
import Nav from './nav';

export default function App () {
    const [currentMemo, setCurrentMemo] = useState<MemoViewModel>(null);
    const [memoList, setMemoList] = useState([]);
    const [alertMessage, setAlertMessage] = useState(null);
    //TODO: Display spinner/msg when fetching/saving
    const [fetchingMemo, setFetchingMemo] = useState(false);
    const [fetchingMemoList, setFetchingMemoList] = useState(false);
    const [saving, setSaving] = useState(false);
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const memoFieldRef : any = React.createRef();

    useEffect(() => {
        const init = async () => {
            await newMemo();
            await getMemoList();
        };
        init();
       
    }, []);

    function displayAlert(msg: string) {
        setAlertMessage(msg)
        setTimeout(() => setAlertMessage(null), 5000);
    }

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
        newMemo();
    }

    function confirmModal() : void {
        setIsOpen(false);
        setTimeout(async () => {
            await saveMemo();
            newMemo();
        })

    }

    async function saveMemo() : Promise<void> {
        try {
            setSaving(true);

            const memo = await Api.saveMemo(currentMemo.id, currentMemo.content);
            if (memo) {
                // update the memo list with the updated memo
                const newMemoList = [...memoList.filter(m => m.id !== memo.id), memo];
                sortMemoList(newMemoList);
                
                setMemoList(newMemoList);
                setCurrentMemo({ ...memo, content: currentMemo.content, originalContent: currentMemo.content, changed: false });
            } else {
                displayAlert('Save failed. Please try again.');
            }
        } catch (err) {
            displayAlert(err);
        } finally {
            setSaving(false);
        }
    }

    async function getMemo(id: bigint) : Promise<void> {
        try {
            setFetchingMemo(true);

            const memo = await Api.getMemo(id);
            if (memo) {
                setCurrentMemo(toMemoViewModel(memo));
            } else {
                displayAlert(`Unable to retrieve memo ${id}. Please try again.`);
            }
        } catch (err) {
            displayAlert(err);
        } finally {
            setFetchingMemo(false);
        }
    }

    async function getMemoList() : Promise<void> {
        try {
            setFetchingMemoList(true);

            const memos = await Api.getMemoList();
            if (memos) {
                setMemoList(memos);
            } else {
                displayAlert('Unable to retrieve list of memos. Please try again.');
            }
        } catch (err) {
            displayAlert(err);
        } finally {
            setFetchingMemoList(false);
        }
    }

    function newMemo() : void {
        setCurrentMemo(toMemoViewModel({ id: BigInt(0), updated: BigInt(0) }));
    }

    function onMemoChanged(evt: ChangeEvent<HTMLTextAreaElement>) : void {
        const newContent = evt.target.value;
        const changed = newContent !== currentMemo.originalContent;
        setCurrentMemo({ ...currentMemo, content: newContent, changed });
    }

    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
      };

    return (
        <>
        <header>
            <h1>Memo Maker</h1>
        </header>
        <div className="layout-center">
            <main className="layout-main">
                <Main currentMemo={currentMemo} 
                    saving={saving} alertMessage={alertMessage} 
                    newMemo={() => currentMemo?.changed ? openModal() : newMemo()} 
                    onMemoChanged={onMemoChanged} saveMemo={saveMemo} />
            </main>
            <nav className="layout-nav">
                <Nav memoList={memoList} saving={saving} getMemo={getMemo} saveMemo={saveMemo}/>
            </nav>
            {/* <aside className="layout-aside"></aside> */}
        </div>
        {/* <footer></footer> */}

        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Unsaved Changes"
        >
            <form>
                <p>Do you want to save your existing memo changes?</p>
                <div className="modal-buttons">
                    <button onClick={confirmModal}>Yes</button>
                    <button onClick={closeModal}>No</button>
                </div>
            </form>
        </Modal>
        </>
    );
};