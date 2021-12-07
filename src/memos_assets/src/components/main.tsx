import * as React from "react";
import { ChangeEvent, MouseEvent } from "react";
import { MemoViewModel } from "../types";

type Props = {
    currentMemo: MemoViewModel,
    saving: boolean,
    alertMessage: string,
    newMemo: () => void,
    onMemoChanged: (evt: ChangeEvent<HTMLTextAreaElement>) => void,
    saveMemo: (evt: MouseEvent) => void
};

export default function Main (props: Props) {
    return (
        <>
            <div className="content-header memo-header">
                <span>Id: {props.currentMemo?.displayId || ' - '}</span>
                <span>Last Updated: {props.currentMemo?.displayDate || ' - '}</span>
            </div>

            {props.alertMessage &&
                <div id="alert">{props.alertMessage}</div>
            }

            {props.currentMemo &&
                <textarea id="memo-field"
                    value={props.currentMemo?.content}
                    onChange={props.onMemoChanged}
                    disabled={props.saving}>
                </textarea>
            }
 
            <div id="memo-buttons">
                <button disabled={props.saving} onClick={props.newMemo}>New</button>
                {props.currentMemo && 
                    <button onClick={props.saveMemo} disabled={!props.currentMemo?.changed || props.saving}>Save</button>
                }
            </div>
        </>
    );
}