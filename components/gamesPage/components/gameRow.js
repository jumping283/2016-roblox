import { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import SmallGameCard from "../../smallGameCard";

const useStyles = createUseStyles({
  title: {
    fontWeight: 300,
    marginBottom: '10px',
    marginTop: '10px',
  },
  gameRow: {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'hidden',
    marginLeft: '-4px',
    '&>div': {
      flex: '0 0 auto',
    }
  },
  gameCard: {
    width: '170px',
    paddingLeft: '5px',
    paddingRight: '5px',
  },
  pagerButton: {
    cursor: 'pointer',
    color: '#666',
    boxShadow: '0 0 3px 0 #ccc',
    '&:hover': {
      color: 'black',
    },
  },
  goBack: {
    width: '40px',
    height: '100%',
    background: 'rgba(255,255,255,0.5)',
    position: 'relative',
    float: 'left',
    marginRight: '-35px',
  },
  goForward: {
    width: '40px',
    height: '100%',
    background: 'rgba(255,255,255,0.8)',
    position: 'relative',
    float: 'right',
    marginLeft: '-35px',
  },
  pagerCaret: {
    textAlign: 'center',
    marginTop: '240%',
    userSelect: 'none',
    fontSize: '40px',
  },
  caretLeft: {
    display: 'block',
    transform: 'rotate(90deg)',
    marginRight: '10px',
  },
  caretRight: {
    display: 'block',
    transform: 'rotate(-90deg)',
    marginLeft: '10px',
  },
});

/**
 * A game row
 * @param {{title: string; games: any[]; icons: any}} props 
 */
const GameRow = props => {
  const s = useStyles();
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(0);
  useEffect(() => {
    // width = 170px
    let windowWidth = window.innerWidth;
    // breakpoints: 992, 1300 for side nav
    if (windowWidth >= 1300) {
      windowWidth -= (170 * 2);
    }
    if (windowWidth >= 992) {
      windowWidth -= 170; // lose a card
    }
    let newLimit = Math.floor(windowWidth / 170);
    // console.log('usable limit', newLimit);
    setLimit(newLimit);
  }, []);

  if (!props.games) return null;
  return <div className='row'>
    <div className='col-12'>
      <h3 className={s.title}>{props.title.toUpperCase()}</h3>
    </div>
    <div className='col-12 col-lg-10'>
      {offset !== 0 && <div className={s.goBack + ' ' + s.pagerButton} onClick={() => {
        setOffset(offset - limit);
      }}>
        <p className={s.pagerCaret}><span className={s.caretRight}>^</span></p>
      </div>}
      {offset < (props.games.length - limit) && <div className={s.goForward + ' ' + s.pagerButton} onClick={() => {
        setOffset(offset + limit);
      }}>
        <p className={s.pagerCaret}><span className={s.caretLeft}>^</span></p>
      </div>
      }
      <div className={'row ' + s.gameRow}>
        {
          props.games.slice(offset, offset + limit).map((v, i) => {
            return <SmallGameCard
              key={i}
              className={s.gameCard}
              placeId={v.placeId}
              creatorId={v.creatorId}
              creatorType={v.creatorType}
              creatorName={v.creatorName}
              iconUrl={props.icons[v.universeId]}
              likes={v.totalUpvotes}
              dislikes={v.totalDownvotes}
              name={v.name}
              playerCount={v.playerCount}
            ></SmallGameCard>
          })
        }
      </div>
    </div>
  </div>
}

export default GameRow;