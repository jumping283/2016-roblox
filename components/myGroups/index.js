import React, { useEffect } from "react";
import { createUseStyles } from "react-jss";
import { getInfo, getRoles, getUserGroups } from "../../services/groups";
import AuthenticationStore from "../../stores/authentication";
import AdSkyscraper from "../ad/adSkyscraper";
import Currency from "./components/currency";
import GroupControls from "./components/groupControls";
import GroupPage from "./components/groupPage";
import OldCard from "./components/oldCard";
import SearchGroups from "./components/search";
import SideBar from "./components/sidebar";
import GroupPageStore from "./stores/groupPageStore";
import MyGroupsStore from "./stores/myGroupsStore";

const useStyles = createUseStyles({
  groupsContainer: {
    background: '#f2f2f2',
    padding: '10px 12px',
  }
})

const MyGroups = props => {
  const s = useStyles();

  const store = MyGroupsStore.useContainer();
  const auth = AuthenticationStore.useContainer();
  const groupPageStore = GroupPageStore.useContainer();

  useEffect(() => {
    if (!auth.isAuthenticated) return;
    getUserGroups({
      userId: auth.userId,
    }).then(store.setGroups);
  }, [auth.userId, auth.isAuthenticated]);

  useEffect(() => {
    if (!store.groups) return;
    if (props.id) {
      // TODO: get group
      groupPageStore.setGroupId(parseInt(props.id, 10));
      // check if exists
      let inCache = store.groups.find(v => v.group.id == props.id);
      if (inCache) {
        groupPageStore.setInfo(inCache.group);
        groupPageStore.setRank(inCache.role);
      } else {
        getInfo({
          groupId: props.id,
        }).then(groupPageStore.setInfo);
        getRoles({
          groupId: props.id
        }).then((d) => {
          let guest = d.find(v => v.rank === 0);
          groupPageStore.setRank(guest);
        })
      }
    } else {
      groupPageStore.setGroupId(store.groups[0]?.group.id);
      groupPageStore.setInfo(store.groups[0]?.group);
      groupPageStore.setRank(store.groups[0]?.role);
    }
  }, [store.groups]);

  const groupCol = auth.isAuthenticated ? 'col-7 ps-0' : 'col-10';

  return <div className={'container ' + s.groupsContainer}>
    <div className='row'>
      <div className='col-12 col-md-3'>
        <SideBar></SideBar>
      </div>
      <div className={groupCol}>
        <SearchGroups></SearchGroups>
        <div className='row'>
          <div className='col-12'>
            {groupPageStore.groupId && <GroupPage></GroupPage>}
          </div>
        </div>
      </div>
      <div className='col-2 ps-0'>
        {groupPageStore.info && groupPageStore.info.owner && groupPageStore.info.owner.userId === auth.userId && <Currency groupId={groupPageStore.groupId}></Currency>}
        <div className='mt-2'>
          <GroupControls></GroupControls>
        </div>
        <div className='mt-2'>
          <AdSkyscraper context='GroupDetailsPage'></AdSkyscraper>
        </div>
      </div>
    </div>
  </div>
}

export default MyGroups