import { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import getFlag from "../../lib/getFlag";
import {
  acceptFriendRequest,
  declineFriendRequest,
  getFollowers,
  getFollowersCount,
  getFollowings,
  getFollowingsCount,
  getFriendRequestCount, getFriendRequests,
  getFriends
} from "../../services/friends";
import { getUserInfo } from "../../services/users";
import AuthenticationStore from "../../stores/authentication";
import GenericPagination from "../genericPagination";
import PlayerImage from "../playerImage";
import Tabs2016 from "../tabs2016";
import useCardStyles from "../userProfile/styles/card";
import UserFriendsStore from "./stores/userFriendsStore";

const useStyles = createUseStyles({
  title: {
    fontSize: '40px',
  },
  imageWrapper: {
    border: '1px solid #c3c3c3',
  },
  userCard: {},
  username: {
    color: '#000',
  },
  friendsContainer: {
    background: '#e3e3e3',
    padding: '4px 8px',
  },
  manageRequestCard: {
    background: '#f2f2f2',
    width: '100%',
    borderLeft: '1px solid #e6e6e6',
    borderRight: '1px solid #e6e6e6',
    borderBottom: '1px solid #e6e6e6',
    position: 'relative',
  },
  friendCard: {

  },
  friendCardWrapper: {
    boxShadow: '0 1px 4px 0 rgb(25 25 25 / 30%)',
  },
  buttonShared: {
    fontSize: '16px',
    marginLeft: '1rem',
    marginRight: '1rem',
    paddingTop: '0.25rem',
    paddingBottom: '0.25rem',
    marginTop: '0.5rem',
    textAlign: 'center',
    borderRadius: '3px',
    cursor: 'pointer',
    '&:hover': {
      boxShadow: '0 1px 4px 0 rgb(25 25 25 / 30%)',
    },
  },
  ignoreButton: {
    background: '#fff',
    border: '1px solid #a8a4a2',
    color: 'rgb(40,40,40)',
  },
  acceptButton: {
    background: 'rgb(0, 162, 255)',
    color: '#fff',
  },
})

const UserFriends = props => {
  const store = UserFriendsStore.useContainer();
  const auth = AuthenticationStore.useContainer();

  const [name, setName] = useState(null);
  const [tab, setTab] = useState(null);
  useEffect(() => {
    setTab(store.userId === auth.userId ? 'Friend Requests'  : 'Friends');
  }, [store.userId, auth.userId]);

  const [friends, setFriends] = useState(null);
  const [followEntries, setFollowEntries] = useState(null);
  const [followCount, setFollowCount] = useState(null);
  const [hasNoFriendRequests, setHasNoFriendRequests] = useState(true);

  const [page, setPage] = useState(1);
  const [cursor, setCursor] = useState('');
  const limit = getFlag('friendsPageLimit', 15);

  useEffect(() => {
    if (!props.userId) return;
    store.setUserId(parseInt(props.userId, 10));
    getUserInfo({
      userId: props.userId,
    }).then((info) => {
      setName(info.name)
    });

    getFriends({
      userId: props.userId,
    }).then(setFriends)
  }, [props]);

  const refreshUserCount = () => {
    if (tab === 'Friends') return
    if (tab === 'Followers') {
      getFollowersCount({
        userId: store.userId,
      }).then(setFollowCount);
    } else if (tab === 'Followings') {
      getFollowingsCount({
        userId: store.userId,
      }).then(setFollowCount);
    }else if (tab === 'Friend Requests') {
      getFriendRequestCount().then(d => {
        setFollowCount(d);
      });
    }
  }

  const refreshUsersList = () => {
    if (tab === 'Friends') return
    if (tab === 'Followers') {
      getFollowers({
        userId: store.userId,
        cursor,
        limit,
      }).then(setFollowEntries);
    } else if (tab === 'Followings') {
      getFollowings({
        userId: store.userId,
        cursor,
        limit,
      }).then(setFollowEntries);
    }else if (tab === 'Friend Requests') {
      getFriendRequests({cursor, limit}).then(data => {
        setFollowEntries(data);
        if (data.data.length !== 0) {
          setHasNoFriendRequests(false);
        }
      })
    }
  }

  useEffect(() => {
    refreshUserCount();
    refreshUsersList();
  }, [cursor, tab]);

  useEffect(() => {
    if (!hasNoFriendRequests && tab === 'Friend Requests' && followEntries && followEntries.length === 0) {
      setFollowCount(followCount-1);
      refreshUsersList();
    }
  }, [followEntries, hasNoFriendRequests]);

  const s = useStyles();
  const cardStyles = useCardStyles();

  if (!store.userId) return null;
  if (!friends) return null;

  const arrayToUse = (tab === 'Friends' ? friends.slice((page * limit - limit), page * limit - 1) : followEntries && followEntries.data);
  const pageCount = Math.ceil((tab === 'Friends' ? friends.length : followCount) / limit);
  const options = ['Friends', 'Followers', 'Followings'];
  if (store.userId === auth.userId) {
    options.unshift('Friend Requests');
  }

  return <div className={'container ' + s.friendsContainer}>
    <div className='row'>
      <div className='col-12'>
        <h3 className={'mb-0 fw-300 ' + s.title}>
          {store.userId === auth.userId ? <span>My Friends</span> : <span>{name}'s Friends</span>}
        </h3>
      </div>
    </div>
    <div className='row mt-4'>
      <div className='col-12'>
        <Tabs2016 options={options} onChange={e => {
          setTab(e);
          setFollowCount(null);
          setFollowEntries(null);
          setPage(1);
          setCursor('');
        }} />
      </div>
    </div>
    <div className='row mt-2'>
      <div className='col-12'>
        <h2 className='fw-300 mb-0 mt-0'>
          {tab.toUpperCase()}
          <span className='ps-2'>(
            {
              tab === 'Friends' ? friends.length : followCount
            }
            )</span>
        </h2>
      </div>
    </div>
    <div className='row mt-2'>
      {
        arrayToUse && arrayToUse.map(v => {
          return <div className={'col-6 col-lg-4 mb-4'} key={v.id}>
            <div className={s.friendCardWrapper}>
              <div className={'card ' + s.friendCard}>
                <a href={`/users/${v.id}/profile`}>
                  <div className='row p-2'>
                    <div className='col-4'>
                      <div className={s.imageWrapper}>
                        <PlayerImage id={v.id} name={v.name} />
                      </div>
                    </div>
                    <div className='col-8'>
                      <p className={'mb-0 font-size-18 ' + s.username}>{v.name}</p>
                    </div>
                  </div>
                </a>
              </div>
              {
                tab === 'Friend Requests' ? <div className={s.manageRequestCard}>
                  <div className='row'>
                    <div className='col-6 pe-0'>
                      <p className={s.buttonShared + ' ' + s.ignoreButton} onClick={(e) => {
                        declineFriendRequest({userId: v.id})
                        followEntries.data = followEntries.data.filter(c => c.id !== v.id)
                        setFollowEntries({...followEntries});
                        setFollowCount(followCount-1);
                      }}>Ignore</p>
                    </div>
                    <div className='col-6 ps-0'>
                      <p className={s.buttonShared + ' ' + s.acceptButton} onClick={() =>{
                        acceptFriendRequest({userId: v.id});
                        followEntries.data = followEntries.data.filter(c => c.id !== v.id)
                        setFollowEntries({...followEntries});
                        setFollowCount(followCount-1);
                      }}>Accept</p>
                    </div>
                  </div>
                </div> : null
              }
            </div>
          </div>
        })
      }
    </div>
    <div className='row mt-2'>
      {arrayToUse && (pageCount > 1) && <GenericPagination onClick={(nm) => {
        return e => {
          e.preventDefault();
          let newPageNumber = page + nm;
          if (newPageNumber === 0) return;
          if (newPageNumber > pageCount) return;

          if (tab === 'Friends') {
            return setPage(newPageNumber);
          }
          if (nm === -1) {
            if (!followEntries.previousPageCursor) return
            setPage(page - 1);
            setCursor(followEntries.previousPageCursor)
          } else {
            if (!followEntries.nextPageCursor) return
            setPage(page + 1);
            setCursor(followEntries.nextPageCursor);
          }
        }
      }} page={page} pageCount={pageCount} />}
    </div>
  </div>
}

export default UserFriends;