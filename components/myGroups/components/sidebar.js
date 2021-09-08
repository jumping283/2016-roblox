import React from "react";
import { createUseStyles } from "react-jss";
import AuthenticationStore from "../../../stores/authentication";
import useButtonStyles from "../../../styles/buttonStyles";
import ActionButton from "../../actionButton";
import MyGroupsStore from "../stores/myGroupsStore"
import OldCard from "./oldCard";
import SidebarGroupEntry from "./sidebarGroupEntry";

const useStyles = createUseStyles({
  container: {
    minHeight: '300px',
    height: '85vh',
    overflowY: 'auto',
    overflowX: 'hidden'
  },
})

const SideBar = props => {
  const auth = AuthenticationStore.useContainer();
  const store = MyGroupsStore.useContainer();
  const buttonStyles = useButtonStyles();
  const s = useStyles();

  return <OldCard>
    <div className={s.container}>
      <div className='row'>
        <div className='col-12'>
          <ActionButton label='Create' className={buttonStyles.buyButton + ' pt-2 pb-2 font-size-25'} onClick={() => {
            window.location.href = '/My/CreateGroup.aspx';
          }}></ActionButton>
        </div>
      </div>
      <div className='row mt-4'>
        <div className='col-12'>
          {store.groups && store.groups.sort((a, b) => {
            return a.group.owner && a.group.owner.id === auth.userId ? 1 : a.role.rank > b.role.rank ? 1 : -1
          }).map(v => {
            return <SidebarGroupEntry key={v.group.id} {...v}></SidebarGroupEntry>
          })}
        </div>
      </div>
    </div>
  </OldCard>
}

export default SideBar;