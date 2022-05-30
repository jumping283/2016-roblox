import {useEffect, useRef, useState} from "react";
import { createUseStyles } from "react-jss";
import SmallGameCard from "../../smallGameCard";
import UserAdvertisement from "../../userAdvertisement";
import {getTheme, themeType} from "../../../services/theme";

const useStyles = createUseStyles({
  title: {
    fontWeight: 300,
    marginBottom: '10px',
    marginTop: '10px',
    color: 'rgb(33, 37, 41)',
    marginLeft: '10px',
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
 * @param {{title: string; games: any[]; icons: any; ads?: boolean;}} props 
 */
const GameRow = props => {
  const s = useStyles();
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(0);
  const [offsetComp, setOffsetComp] = useState(0);
  const rowRef = useRef(null);
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth
  })
  useEffect(() => {
    window.addEventListener('resize', () => {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      });
    });
  }, []);
  useEffect(() => {
    if (!rowRef.current)
      return;
    // width = 170px
    let windowWidth = rowRef.current.clientWidth;
    // breakpoints: 992, 1300 for side nav
    let offsetNotRounded = windowWidth / 170;
    let newLimit = Math.floor(offsetNotRounded);

    // console.log('usable limit', newLimit);
    setLimit(newLimit);
    if (offsetNotRounded !== newLimit) {
      setOffsetComp(1);
    }else{
      setOffsetComp(0);
    }
  }, [rowRef, dimensions]);

  const remainingGames = props.games.length - (offset-offsetComp);
  const showForward = remainingGames >= limit;
  if (!props.games) return null;
  return <div className='row'>
    <div className='col-12'>
      <h3 className={s.title}>{props.title.toUpperCase()}</h3>
    </div>
    <div className={props.ads ? 'col-12 col-lg-9' : 'col-12'} ref={rowRef}>
      {offset !== 0 && <div className={s.goBack + ' ' + s.pagerButton} onClick={() => {
        setOffset((offset - limit));
      }}>
        <p className={s.pagerCaret}><span className={s.caretRight}>^</span></p>
      </div>}
      {showForward ? <div className={s.goForward + ' ' + s.pagerButton} onClick={() => {
        let newOffset = ((offset) + (limit));
        setOffset(newOffset);
      }}>
        <p className={s.pagerCaret}><span className={s.caretLeft}>^</span></p>
      </div> : null
      }
      <div className={'row ' + s.gameRow}>
        {
          props.games.slice(offset, offset+100).map((v, i) => {
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
            />
          })
        }
      </div>
    </div>
    {props.ads ? <div className='col-12 col-lg-3'><UserAdvertisement type={3} /></div> : null}
  </div>
}

export default GameRow;