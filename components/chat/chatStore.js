import {createContainer} from "unstated-next";
import {useReducer, useState} from "react";

const conversationReducer = (state, action) => {
  if (action.action === 'MULTI_ADD') {
    let newState = state ? [... state] : [];
    action.data.forEach(v => {
      if (!newState.find(x => x.id === v.id)) {
        newState.push(v);
      }
    });
    return newState;
  }
  if (action.action === 'MULTI_ADD_LATEST_MESSAGES') {
    let newState = [...state];
    for (const item of action.data) {
      newState.find(x => x.id === item.conversationId).latest = item.chatMessages[0] || null;
    }
    return newState;
  }
  return state;
}

const ChatStore = createContainer(() => {
  const [unreadCount, setUnreadCount] = useState(null);
  const [conversations, dispatchConversations] = useReducer(conversationReducer, null);
  const [friends, setFriends] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState([]);

  return {
    unreadCount,
    setUnreadCount,

    conversations,
    dispatchConversations,

    selectedConversation,
    setSelectedConversation,

    friends,
    setFriends,
  }
});

export default ChatStore;