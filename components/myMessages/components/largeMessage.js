import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { createUseStyles } from "react-jss";
import { sendMessage, toggleReadStatus } from "../../../services/privateMessages";
import AuthenticationStore from "../../../stores/authentication";
import MyMessagesStore from "../../../stores/myMessages";
import useButtonStyles from "../../../styles/buttonStyles";
import ActionButton from "../../actionButton";
import Header from "../../header";
import PlayerImage from "../../playerImage"

const useStyles = createUseStyles({
  username: {
    fontWeight: 700,
    marginBottom: 0,
  },
  created: {
    marginBottom: 0,
    color: '#969696',
    fontWeight: 500,
  },
  subject: {
    fontWeight: 400,
  },
  subjectBodyParagraph: {
    marginBottom: 0,
  },
  body: {

  },
  backButtonWrapper: {
    width: '80px',
    float: 'left',
  },
  replyButtonWrapper: {
    width: '110px',
    float: 'left',
    marginLeft: '10px',
  },
  archiveButtonWrapper: {},
  replyText: {
    width: '100%',
    padding: '8px 10px',
    background: '#eaeaea',
    border: '1px solid #666',
  },
  replyWrapper: {
    width: '170px',
    float: 'right',
  },
})

/**
 * Message Entry
 * @param {{fromUserId: number; fromUserName: string; subject: string; body: string; created: string; id: number; read: boolean;}} props
 * @returns 
 */
const LargeMessage = props => {
  const s = useStyles();
  const buttonStyles = useButtonStyles();
  const store = MyMessagesStore.useContainer();
  const [reply, setReply] = useState(false);
  const replyInputRef = useRef(null);
  const showReplyButton = props.fromUserId !== 1;
  const auth = AuthenticationStore.useContainer();

  useEffect(() => {
    if (props.id !== 1 && props.read !== true && props.fromUserId !== auth.userId) {
      toggleReadStatus({
        messageIds: [props.id],
        isRead: true,
      })
    }
  }, []);

  return <div className='row pt-2'>
    <div className='col-12'>
      <div className={s.backButtonWrapper}>
        <ActionButton label='Back' className={buttonStyles.cancelButton} onClick={() => {
          store.setHighlightedMessage(null);
        }}></ActionButton>
      </div>
      {showReplyButton && <div className={s.replyButtonWrapper}>
        <ActionButton label='Reply' className={buttonStyles.continueButton} onClick={() => {
          setReply(!reply);
        }}></ActionButton>
      </div>
      }
    </div>
    <div className='col-12'>
      <h2 className={s.subject}>{props.subject}</h2>
    </div>
    <div className='col-1 pe-0'>
      <PlayerImage id={props.fromUserId}></PlayerImage>
    </div>
    <div className='col-10'>
      <p className={s.username}>
        <a className='normal' href={`/users/${props.fromUserId}/profile`}>
          {props.fromUserName}
        </a>
      </p>
      <p className={s.created}>{dayjs(props.created).format('MMM DD, YYYY | h:mm A')}</p>
    </div>
    <div className='col-12'>
      <p className={s.body + ' mt-2'}>
        {props.body}
      </p>
    </div>
    {
      reply && <div className='col-12'>
        <textarea ref={replyInputRef} maxLength={1000} className={s.replyText} rows={8} placeholder='Reply here...'>

        </textarea>
        <div className={s.replyWrapper}>
          <ActionButton label='Send Reply' className={buttonStyles.continueButton} onClick={() => {
            sendMessage({
              userId: props.fromUserId,
              subject: 'RE: ' + props.subject,
              body: replyInputRef.current.value,
              includePreviousMessage: true,
              replyMessageId: props.id,
            }).then(() => {
              store.setHighlightedMessage(null);
            });
          }}></ActionButton>
        </div>
      </div>
    }
  </div>
}

export default LargeMessage;