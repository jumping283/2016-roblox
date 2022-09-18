import ChatMenu from "./components/chatMenu";
import styles from './container.module.css';
import chatStore from "./chatStore";
import {useEffect, useRef} from "react";
import {getUserConversations, multiGetLatestMessages} from "../../services/chat";
import authentication from "../../stores/authentication";
import {getFriends} from "../../services/friends";
import ConversationEntry from "./components/conversationEntry";

const ConversationContainer = props => {
  const store = chatStore.useContainer();
  if (store.selectedConversation === null || store.selectedConversation.length === 0) return null;
  return <>
    {
      store.selectedConversation.map((v, i) => {
        return <ConversationEntry index={i} key={v.conversationId || v.user.userId} {...v} />
      })
    }
  </>
}

const ChatContainer = props => {
  const store = chatStore.useContainer();
  const auth = authentication.useContainer();
  const conversationUpdate = useRef(null);
  useEffect(() => {
    if (conversationUpdate.current) {
      clearInterval(conversationUpdate.current);
      conversationUpdate.current = null;
    }
    const updateConversations = () => {
      // hard coded since this is mostly a POC right now. we should probably add paging eventually
      getUserConversations({
        pageNumber: 1,
        pageSize: 100,
      }).then(conv => {

        let totalUnread = 0;
        for (const item of conv) {
          if (item.hasUnreadMessages) {
            totalUnread++;
          }
        }
        store.setUnreadCount(totalUnread);
        store.dispatchConversations({
          action: 'MULTI_ADD',
          data: conv,
        });

        if (conv.length === 0) return;

        multiGetLatestMessages({
          conversationIds: conv.map(v => v.id),
        }).then(data => {
          store.dispatchConversations({
            action: 'MULTI_ADD_LATEST_MESSAGES',
            data: data,
          });
        })
      })
    }

    updateConversations();
    conversationUpdate.current = setInterval(() => {
      updateConversations();
    }, 5 * 1000);

    return () => {
      clearInterval(conversationUpdate.current);
      conversationUpdate.current = null;
    }
  }, []);

  useEffect(() => {
    if (auth.userId) {
      getFriends({userId: auth.userId}).then(d => {
        store.setFriends(d);
      })
    }
  }, [auth.userId]);

  return <div className={styles.container}>
    <ChatMenu />
    <ConversationContainer />
  </div>
}

export default ChatContainer;