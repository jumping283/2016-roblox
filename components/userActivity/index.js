import dayjs from "dayjs";
import { createUseStyles } from "react-jss";
import { getGameUrl } from "../../services/games";

const Activity = props => {
  const activity = props.lastLocation;
  const online = dayjs(props.lastOnline).isAfter(dayjs().subtract(5, 'minutes'));
  if (!online) return null;
  if (activity === 'Playing') {
    return <div>
      <a href={getGameUrl({
        placeId: props.placeId,
        name: '-',
      })}>
        <span className='avatar-status friend-status icon-game' title='Playing'></span>
      </a>
    </div>
  } else if (activity === 'Website') {
    return <div>
      <span className='avatar-status friend-status icon-online' title='Website'></span>
    </div>
  } else if (activity === 'Studio') {
    return <div>
      <span className='avatar-status friend-status icon-studio' title='Developing'></span>
    </div>
  }
  return null;
}

export default Activity;