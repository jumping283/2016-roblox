import dayjs from "dayjs";
import GameDetailsStore from "../stores/gameDetailsStore";

const StatEntry = props => {
  return <p className='mb-0 font-size-12 mb-1'><span className='fw-600'>{props.name}:</span> {props.value}</p>
}

const GameStats = props => {
  const store = GameDetailsStore.useContainer();
  if (!store.placeDetails || !store.universeDetails) return null;
  const stats = [
    {
      name: 'Created',
      value: dayjs(store.details.created).format('M/DD/YYYY'),
    },
    {
      name: 'Updated',
      value: dayjs(store.details.updated).fromNow(),
    },
    {
      name: 'Favorited',
      value: 0, // TODO
    },
    {
      name: 'Visited',
      value: store.universeDetails.visits.toLocaleString(),
    },
    {
      name: 'Max Players',
      value: store.universeDetails.maxPlayers.toLocaleString(),
    }
  ]
  return <div className='row mt-4'>
    <div className='col-12'>
      {
        stats.map(v => {
          return <StatEntry key={v.name} {...v}></StatEntry>
        })
      }
    </div>
    <div className='col-12 mt-3'>
      <StatEntry name='Genres' value={store.universeDetails.genre}></StatEntry>
      <StatEntry name='Allowed Gear Types' value={''}></StatEntry>
      <p>
        None
        {
          /* TODO */
        }
      </p>
    </div>
  </div>
}

export default GameStats;