import dayjs from "dayjs";
import { createUseStyles } from "react-jss";
import { getGameUrl } from "../../../services/games";
import PlayerImage from "../../playerImage";
import DashboardStore from "../stores/dashboardStore";

const useStyles = createUseStyles({
  friendEntry: {
    paddingLeft: '10px',
    paddingRight: '10px',
    maxWidth: '100px',
    overflow: 'hidden',
  },
  thumbnailWrapper: {
    maxWidth: '85px',
    borderRadius: '100%',
    border: '1px solid #c3c3c3',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgb(150 150 150 / 74%)',
    margin: '0 auto',
    display: 'block',
    width: '100%',
  },
  username: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    textAlign: 'center',
    marginBottom: 0,
    width: '100%',
    marginTop: '4px',
    fontSize: '15px',
    fontWeight: 500,
    color: '#4a4a4a',
  },
});
const FriendEntry = props => {
  const store = DashboardStore.useContainer();
  const onlineStatus = store.friendStatus && store.friendStatus[props.id];
  const s = useStyles();
  return <div className={s.friendEntry}>
    <a href={`/users/${props.id}/profile`}>
      <div className={s.thumbnailWrapper}>
        <PlayerImage id={props.id} name={props.name}></PlayerImage>
      </div>
      {onlineStatus && <Activity {...onlineStatus}></Activity>}
      <p className={s.username}>{props.name}</p>
    </a>
  </div>
}

const useActivityStyles = createUseStyles({
  activity: {
    position: 'relative',
    marginTop: '-25px',
    marginLeft: '55px',
    zIndex: 99,
  },
});

const Activity = props => {
  const s = useActivityStyles();
  const activity = props.lastLocation;
  const online = dayjs(props.lastOnline).isAfter(dayjs().subtract(5, 'minutes'));
  if (!online) return null;
  if (activity === 'Playing') {
    return <div className={s.activity}>
      <a href={getGameUrl({
        placeId: props.placeId,
        name: '-',
      })}>
        <span className='avatar-status friend-status icon-game' title='Playing'></span>
      </a>
    </div>
  } else if (activity === 'Website') {
    return <div className={s.activity}>
      <span className='avatar-status friend-status icon-online' title='Website'></span>
    </div>
  } else if (activity === 'Studio') {
    return <div className={s.activity}>
      <span className='avatar-status friend-status icon-studio' title='Developing'></span>
    </div>
  }
  return null;
}

export default FriendEntry;