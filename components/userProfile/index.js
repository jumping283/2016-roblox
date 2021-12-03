import React, { useEffect } from "react";
import { createUseStyles } from "react-jss";
import NotFoundPage from "../../pages/404";
import AuthenticationStore from "../../stores/authentication";
import AdBanner from "../ad/adBanner";
import Avatar from "./components/avatar";
import Collections from "./components/collections";
import Creations from "./components/creations";
import Description from "./components/description";
import Friends from "./components/friends";
import Groups from "./components/groups";
import ProfileHeader from "./components/profileHeader";
import RobloxBadges from "./components/robloxBadges";
import Statistics from "./components/stats";
import Tabs from "./components/tabs";
import TabSection from "./components/tabSection";
import UserProfileStore from "./stores/UserProfileStore";

const useStyles = createUseStyles({
  profileContainer: {
    background: '#e3e3e3',
  },
})

const UserProfile = props => {
  const s = useStyles();

  const store = UserProfileStore.useContainer();
  const auth = AuthenticationStore.useContainer();
  useEffect(() => {
    store.setUserId(props.userId);
  }, [props]);

  useEffect(() => {
    if (auth.isPending || !auth.userId) return;
    store.getFriendStatus(auth.userId);
  }, [store.userId, auth.userId]);

  if (!store.userId || !store.userInfo || auth.isPending) {
    return null;
  }
  if (store.userInfo.isBanned) {
    return <NotFoundPage></NotFoundPage>
  }
  return <div className='container'>
    <AdBanner></AdBanner>
    <div className={s.profileContainer}>
      <ProfileHeader></ProfileHeader>
      <Tabs></Tabs>
      <TabSection tab="About">
        <Description></Description>
        <Avatar userId={store.userId}></Avatar>
        <Friends></Friends>
        <Collections userId={store.userId}></Collections>
        <Groups></Groups>
        {/* Favorites would go here */}
        <RobloxBadges userId={store.userId}></RobloxBadges>
        <Statistics></Statistics>
      </TabSection>
      <TabSection tab="Creations">
        <Creations></Creations>
      </TabSection>
    </div>
  </div>
}

export default UserProfile;