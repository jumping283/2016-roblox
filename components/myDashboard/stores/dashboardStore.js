import { useEffect, useState } from "react";
import { createContainer } from "unstated-next";
import { multiGetPresence } from "../../../services/presence";

const DashboardStore = createContainer(() => {
  const [friends, setFriends] = useState(null);
  const [friendStatus, setFriendStatus] = useState(null);

  useEffect(() => {
    if (!friends) {
      return
    }
    console.log('[info] run multiGetPresence')
    multiGetPresence({
      userIds: friends.map(v => v.id),
    }).then(d => {
      let obj = {}
      for (const user of d) {
        obj[user.userId] = user;
      }
      setFriendStatus(obj);
    }).catch(e => {
      console.error('[error] friends err', e);
    })
  }, [friends]);
  return {
    friends,
    setFriends,

    friendStatus,
    setFriendStatus,
  }
});

export default DashboardStore;