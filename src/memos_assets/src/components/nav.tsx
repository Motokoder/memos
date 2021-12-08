import * as React from 'react';
import { MemoViewModel } from '../types';

type Props = {
    memoList: MemoViewModel[],
    saving: boolean,
    getMemo: (id: bigint) => Promise<void>,
    saveMemo: () => Promise<void>
};

export default function Nav (props: Props) {
    return (
        <>
        <div className="table memo-list">
            { props.memoList && 
                <div className="row content-header">
                    <div>ID</div>
                    <div>Last Updated</div>
                </div>
            }
        </div>
        <div id="memo-list-wrapper">
            <div className="table memo-list">
            { props.memoList?.map(m => 
                <div key={Number(m.id)}
                    className={`row memo-list-item ${!props.saving && 'enabled'}`}
                    onClick={() => !props.saving && props.getMemo(m.id)}>
                    <div>{m.displayId}</div>
                    <div>
                        <div>
                            <div>{m.displayDate}</div>
                            <div>{m.displayTime}</div>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </div>
       </>
    );
};