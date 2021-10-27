import { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import getFlag from "../../lib/getFlag";
import { getFollowers, getFollowersCount, getFollowings, getFollowingsCount, getFriends } from "../../services/friends";
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
})

const UserFriends = props => {
  const store = UserFriendsStore.useContainer();
  const auth = AuthenticationStore.useContainer();

  const [name, setName] = useState(null);
  const [tab, setTab] = useState('Friends');

  const [friends, setFriends] = useState(null);
  const [followEntries, setFollowEntries] = useState(null);
  const [followCount, setFollowCount] = useState(null);
  const [page, setPage] = useState(1);
  const [cursor, setCursor] = useState(null);
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

  useEffect(() => {
    if (tab === 'Friends') return
    if (tab === 'Followers') {
      getFollowersCount({
        userId: store.userId,
      }).then(setFollowCount);
      getFollowers({
        userId: store.userId,
        cursor,
        limit,
      }).then(setFollowEntries);
    } else if (tab === 'Followings') {
      getFollowingsCount({
        userId: store.userId,
      }).then(setFollowCount);
      getFollowings({
        userId: store.userId,
        cursor,
        limit,
      }).then(setFollowEntries);
    }
  }, [cursor, tab]);

  const s = useStyles();
  const cardStyles = useCardStyles();

  if (!store.userId) return null;
  if (!friends) return null;

  const arrayToUse = (tab === 'Friends' ? friends.slice((page * limit - limit), page * limit - 1) : followEntries && followEntries.data);
  const pageCount = Math.ceil((tab === 'Friends' ? friends.length : followCount) / limit);

  return <div className='container'>
    <div className='row'>
      <div className='col-12'>
        <h3 className={'mb-0 fw-300 ' + s.title}>
          {store.userId === auth.userId ? <span>My Friends</span> : <span>{name}'s Friends</span>}
        </h3>
      </div>
    </div>
    <div className='row mt-4'>
      <div className='col-12'>
        <Tabs2016 options={['Friends', 'Followers', 'Followings']} onChange={e => {
          setTab(e);
          setFollowCount(null);
          setFollowEntries(null);
          setPage(1);
          setCursor(null);
        }}></Tabs2016>
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
          return <div className='col-6 col-lg-4 mb-4' key={v.id}>
            <div className={'card ' + cardStyles.card}>
              <a href={`/users/${v.id}/profile`}>
                <div className='row p-2'>
                  <div className='col-4'>
                    <div className={s.imageWrapper}>
                      <PlayerImage id={v.id} name={v.name}></PlayerImage>
                    </div>
                  </div>
                  <div className='col-8'>
                    <p className={'mb-0 font-size-18 ' + s.username}>{v.name}</p>
                  </div>
                </div>
              </a>
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
      }} page={page} pageCount={pageCount}></GenericPagination>}
    </div>
  </div>
}

export default UserFriends;