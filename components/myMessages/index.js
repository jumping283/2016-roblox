import React from "react";
import { createUseStyles } from "react-jss";
import MyMessagesStore from "../../stores/myMessages";
import AdBanner from "../ad/adBanner";
import OldVerticalTabs from "../oldVerticalTabs";
import LargeMessage from "./components/largeMessage";
import MessageRow from "./components/messageRow";

const useStyles = createUseStyles({
  messagesContainer: {
    background: '#fff',
    padding: '4px 8px',
    overflow: 'hidden',
  }
})

const MyMessages = props => {
  const s = useStyles();

  const store = MyMessagesStore.useContainer();
  return <div className='container'>
    <AdBanner></AdBanner>
    <div className={s.messagesContainer}>
      <div className='row mt-2'>
        <div className='col-12'>
          {
            store.highlightedMessage ? <LargeMessage {...store.highlightedMessage}></LargeMessage> :

              <OldVerticalTabs options={[
                {
                  name: 'Inbox',
                  element: <MessageRow tab='inbox'></MessageRow>,
                },
                {
                  name: 'Sent',
                  element: <MessageRow tab='sent'></MessageRow>,
                },
                {
                  name: 'Notifications',
                  element: <MessageRow tab='notifications'></MessageRow>,
                  count: store.notifications ? store.notifications.collection.length : undefined,
                },
                {
                  name: 'Archive',
                  element: <MessageRow tab='archive'></MessageRow>,
                },
              ]}></OldVerticalTabs>
          }
        </div>
      </div>
    </div>
  </div>
}

export default MyMessages;