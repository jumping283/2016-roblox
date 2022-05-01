import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { createUseStyles } from "react-jss";
import { abbreviateNumber } from "../../../lib/numberUtils";
import { followUser, unfollowUser } from "../../../services/friends";
import { getGameUrl } from "../../../services/games";
import { multiGetPresence } from "../../../services/presence";
import { updateStatus } from "../../../services/users";
import AuthenticationStore from "../../../stores/authentication";
import Dropdown2016 from "../../dropdown2016";
import PlayerHeadshot from "../../playerHeadshot";
import PlayerImage from "../../playerImage";
import Activity from "../../userActivity";
import UserProfileStore from "../stores/UserProfileStore";
import useCardStyles from "../styles/card";
import FriendButton from "./friendButton";
import MessageButton from "./messageButton";
import RelationshipStatistics from "./relationshipStatistics";

const useHeaderStyles = createUseStyles({
  iconWrapper: {
    border: '1px solid #B8B8B8',
    margin: '0 auto',
    maxWidth: '110px',
  },
  username: {
    fontSize: '30px',
    fontWeight: 400,
  },
  userStatus: {
    fontSize: '16px',
    fontWeight: 300,
  },
  dropdown: {
    float: 'right',
  },
  updateStatusInput: {
    width: 'calc(100% - 140px)',
    border: '1px solid #c3c3c3',
    borderRadius: '4px',
    '@media(max-width: 992px)': {
      width: '100%',
    }
  },
  updateStatusButton: {
    cursor: 'pointer',
    marginTop: '2px',
    fontSize: '12px',
  },
  activityWrapper: {
    position: "relative",
    float: 'right',
    marginRight: '-10px',
    marginTop: '-18px',
  },
});

const ProfileHeader = props => {
  const auth = AuthenticationStore.useContainer();
  const store = UserProfileStore.useContainer();

  const statusInput = useRef(null);

  const [dropdownOptions, setDropdownOptions] = useState(null);
  const [editStatus, setEditStatus] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (auth.isPending) return;
    multiGetPresence({ userIds: [store.userId] }).then((d) => {
      setStatus(d[0]);
    })
    const arr = [];
    const isOwnProfile = auth.userId == store.userId;
    if (isOwnProfile) {
      // Exclusive to your own profile
      arr.push({
        name: 'Update Status',
        onClick: e => {
          e.preventDefault();
          setEditStatus(!editStatus);
        },
      })
    } else {
      // Exclusive to profiles other then your own
      arr.push({
        name: store.isFollowing ? 'Unfollow' : 'Follow',
        onClick: (e) => {
          e.preventDefault();
          store.setIsFollowing(!store.isFollowing);
          if (store.isFollowing) {
            store.setFollowersCount(store.followersCount - 1);
            unfollowUser({ userId: store.userId });
          } else {
            store.setFollowersCount(store.followersCount + 1);
            followUser({ userId: store.userId });
          }
        },
      });
    }
    // TODO: wait for accountsettings to add "get blocked status" endpoint
    /*
    arr.push({
      name: 'Block User',
      onClick: () => {
        console.log('Block user!');
      },
    });
    */
    arr.push({
      name: 'Inventory',
      url: `/users/${store.userId}/inventory`,
    });
    if (!isOwnProfile) {
      arr.push({
        name: 'Trade',
        onClick: (e) => {
          e.preventDefault();
          window.open("/Trade/TradeWindow.aspx?TradePartnerID=" + store.userId, "_blank", "scrollbars=0, height=608, width=914");
        }
      });
    }
    setDropdownOptions(arr);
  }, [auth.userId, auth.isPending, store.isFollowing, editStatus]);

  const s = useHeaderStyles();
  const cardStyles = useCardStyles();

  const showButtons = auth.userId != store.userId && !auth.isPending;

  return <div className='row mt-2'>
    <div className='col-12'>
      <div className={'card ' + cardStyles.card}>
        <div className='card-body'>
          <div className='row'>
            <div className='col-12 col-lg-2 pe-0'>
              <div className={s.iconWrapper}>
                <PlayerHeadshot id={store.userId} name={store.username}/>
                {status && <div className={s.activityWrapper}><Activity relative={false} {...status}></Activity></div>}
              </div>
            </div>
            <div className='col-12 col-lg-10 ps-0'>
              <h2 className={s.username}>{store.username} <span className="icon-obc"></span> <div className={s.dropdown}>
                {dropdownOptions && <Dropdown2016 options={dropdownOptions}/>}
              </div></h2>
              {editStatus ? <div>
                  <input ref={statusInput} type='text' className={s.updateStatusInput} maxLength={255} defaultValue={store.status?.status || ''}/>
                  <p className={s.updateStatusButton} onClick={() => {
                    let v = statusInput.current.value;
                    store.setStatus({
                      status: v,
                    });
                    setEditStatus(false);
                    updateStatus({
                      newStatus: v,
                      userId: auth.userId,
                    })
                  }}>Update Status</p>
              </div> : (!store.status || !store.status.status) ? <p>&emsp;</p> : <p className={s.userStatus}>&quot;{store.status.status}&quot;</p>
              }
              <div className='row'>
                <RelationshipStatistics id='friends' label='Friends' value={store.friends?.length} userId={store.userId}/>
                <RelationshipStatistics id='followers' label='Followers' value={store.followersCount} userId={store.userId}/>
                <RelationshipStatistics id='followings' label='Following' value={store.followingsCount} userId={store.userId}/>
                {
                  showButtons && <>
                    <div className='col-6 col-lg-2 offset-lg-2 pe-1'>
                      <MessageButton/>
                    </div>
                    <div className='col-6 col-lg-2 ps-1'>
                      <FriendButton/>
                    </div>
                  </>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
}

export default ProfileHeader;