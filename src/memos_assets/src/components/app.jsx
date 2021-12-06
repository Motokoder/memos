import React, { useEffect } from "react";
import * as Api from "../api";
import { useEffect } from "react";
import { sortMemoList } from '../utils';

export const App = () => {
    const [currentMemo, setCurrentMemo] = React.useState(null);
    const [memoList, setMemoList] = React.useState([]);
    const [alertMessage, setAlertMessage] = React.useState(null);
    const [fetchingMemo, setFetchingMemo] = React.useState(false);
    const [fetchingMemoList, setFetchingMemoList] = React.useState(false);
    const [saving, setSaving] = React.useState(false);

    useEffect(() => {
        const init = async () => {
            await getMemoList();
        };
        init();
    }, []);

    function displayAlert(msg) {
        setAlertMessage(msg)
        setTimeout(() => setAlertMessage(null), 5000);
    }

    async function saveMemo() {
        try {
            setSaving(true);

            const memo = await Api.saveMemo(currentMemo.id, currentMemo.content);
            if (memo) {
                // update the memo list with the updated memo
                const newMemoList = [...memoList.filter(m => m.id !== memo.id), memo];
                sortMemoList(newMemoList);
                setMemoList(newMemoList);

                setCurrentMemo({ ...currentMemo, ...memo, originalContent: currentMemo.content, changed: false });
            } else {
                displayAlert('Save failed. Please try again.');
            }
        } catch (err) {
            displayAlert(err);
        } finally {
            setSaving(false);
        }
    }

    async function getMemo(id) {
        try {
            setFetchingMemo(true);

            const memo = await Api.getMemo(id);
            if (memo) {
                setCurrentMemo({ ...memo, originalContent: memo.content, changed: false });
            } else {
                displayAlert(`Unable to retrieve memo ${id}. Please try again.`);
            }
        } catch (err) {
            displayAlert(err);
        } finally {
            setFetchingMemo(false);
        }
    }

    async function getMemoList() {
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

    function newMemo() {
        setCurrentMemo({ id: 0, originalContent: '', content: '' })
    }

    function onMemoChanged(evt) {
        const newContent = evt.target.value;
        const changed = newContent !== currentMemo.originalContent;
        setCurrentMemo({ ...currentMemo, content: newContent, changed });
    }

    return (
        <div id="layout">
            {alertMessage &&
                <div id="alert">{alertMessage}</div>
            }
            <div className="table">
            { memoList && 
                <div className="row header">
                    <span>Id</span>
                    <span>Last Updated</span>
                    <span>&nbsp;</span>
                </div>
            }
            { memoList?.map(m => 
                <div key={m.id} className="row">
                    <span>{m.displayId}</span>
                    <span>{m.displayDate}</span>
                    <span><button disabled={saving} onClick={() => getMemo(m.id)}>Edit</button></span>
                </div>
            )}
            </div>
            <div>
            
                <div className="header memo-header">
                    <span>Id: {currentMemo?.displayId || '-'}</span>
                    <span>Updated: {currentMemo?.displayDate || '-'}</span>
                </div>
                <div>
                    {currentMemo &&
                        <textarea
                            rows="10"
                            style={{ width: "100%" }}
                            value={currentMemo?.content}
                            onChange={onMemoChanged}
                            disabled={saving}>
                        </textarea>
                    }
                </div>
                <div>
                    <button onClick={newMemo}>New</button>
                    {currentMemo && 
                        <button onClick={saveMemo} disabled={!currentMemo?.changed || saving}>Save</button>
                    }
                </div>
            </div>
        </div>
    );
};