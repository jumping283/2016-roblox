import { createUseStyles } from "react-jss";
import MyMessages from "..";
import MyMessagesStore from "../../../stores/myMessages";
import PlayerImage from "../../playerImage"

const useStyles = createUseStyles({
  username: {
    fontWeight: 700,
    color: '#828282',
    marginBottom: 0,
  },
  subject: {
    fontWeight: 700,
    color: '#828282',
  },
  subjectUnread: {
    color: '#000',
  },
  subjectBodyParagraph: {
    marginBottom: 0,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  body: {
    color: '#969696',
    fontWeight: 500,
    whiteSpace: 'break-spaces',
  },
  messageRow: {
    cursor: 'pointer',
  },
  userImage: {
    maxWidth: '100%',
    display: 'inline-block',
    position: 'relative',
    marginTop: '-15px',
    paddingLeft: '5px',
  },
  markRead: {
    zIndex: 99,
    cursor: 'pointer',
  },
  markReadWrapper: {
    display: 'inline-block',
    width: '10px',
    position: 'relative',
    top: '20px',
    zIndex: 99,
  },
})

/**
 * Message Entry
 * @param {{fromUserId: number; fromUserName: string; subject: string; body: string; created: string; id:number; read: boolean; archived: boolean;}} props
 * @returns 
 */
const MessageEntry = props => {
  const s = useStyles();
  const store = MyMessagesStore.useContainer();
  const isChecked = store.checked.find(v => v.id === props.id) !== undefined;
  return <div className={`row pt-2 ${s.messageRow}`} onClick={(e) => {
    e.preventDefault();
    store.setHighlightedMessage(props);
  }}>
    <div className='col-1'>
      <div className={s.markReadWrapper}>
        <input type='checkbox' checked={isChecked} className={s.markRead} onClick={(e) => {
          e.stopPropagation();
          if (isChecked) {
            store.setChecked(store.checked.filter(v => {
              return v.id !== props.id;
            }));
          } else {
            store.setChecked([...store.checked, props]);
          }
        }}></input>
      </div>
      <div className={s.userImage}>
        <PlayerImage id={props.fromUserId}></PlayerImage>
      </div>
    </div>
    <div className='col-10'>
      <p className={s.username}>{props.fromUserName}</p>
      <p className={s.subjectBodyParagraph}><span className={s.subject + ' ' + (props.read ? '' : s.subjectUnread)}>{props.subject}</span> - <span className={s.body}>{props.body}</span></p>
    </div>
    <div className='col-12'>
      <div className='divider-top'></div>
    </div>
  </div>
}

export default MessageEntry;