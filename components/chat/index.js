import {useEffect, useState} from "react";
import ChatContainer from "./container";
import {getChatSettings} from "../../services/chat";
import ChatStore from "./chatStore";

const Chat = props => {
  const [enabled, setEnabled] = useState(null);
  useEffect(() => {
    getChatSettings().then(d => {
      if (d.chatEnabled) {
        setEnabled(true);
      }
    })
  }, []);

  if (!enabled)
    return null;

  return <ChatStore.Provider>
    <ChatContainer />
  </ChatStore.Provider>
}

export default Chat;