import { useEffect, useRef, useState } from "react";
import { createUseStyles } from "react-jss";
import { abbreviateNumber } from "../../lib/numberUtils";
import { itemNameToEncodedName } from "../../services/catalog";
import { getGameUrl } from "../../services/games";
import CreatorLink from "../creatorLink";
import useCardStyles from "../userProfile/styles/card";

const useStyles = createUseStyles({
  label: {
    fontWeight: 300,
    fontSize: '16px',
    marginBottom: 0,
  },
  labelPlaying: {
    fontSize: '12px',
    marginBottom: 0,
    color: '#757575',
  },
  imageWrapper: {

  },
  image: {
    width: '100%',
    margin: '0 auto',
    display: 'block',
  },
  thumbsUp: {
    marginBottom: 0,
  },
  creatorDetailsCard: {
    position: 'absolute',
    background: 'white',
    marginLeft: '-7px',
    boxShadow: '0 3px 4px 0 rgb(25 25 25 / 30%)',
  },
  creatorText: {
    color: '#c3c3c3',
    fontSize: '13px',
    '&>a': {
      color: '#00a2ff',
      '&:hover': {
        textDecoration: 'underline!important',
      },
    },
  },
  floatRight: {
    float: 'right',
  },
});

/**
 * SmallGameCard
 * @param {{name: string; playerCount: number; likes: number; dislikes: number; creatorId: number; creatorType: string | number; creatorName: string; iconUrl: string; placeId: number; className?: string}} props 
 * @returns 
 */
const SmallGameCard = props => {
  const s = useStyles();
  const cardStyles = useCardStyles();
  const [showCreator, setShowCreator] = useState(false);
  const [iconUrl, setIconUrl] = useState('/img/empty.png');
  useEffect(() => {
    if (!props.iconUrl) {
      setIconUrl('/img/empty.png');
      return
    }
    setIconUrl(props.iconUrl);
  }, [props.iconUrl]);
  const colRef = useRef(null);
  const url = getGameUrl({
    placeId: props.placeId,
    name: props.name,
  });

  return <div className={props.className || 'col-6 col-lg-2 ps-1 pe-1'} onMouseEnter={() => {
    setShowCreator(true);
  }} onMouseLeave={() => {
    setShowCreator(false);
  }}>
    <div className={cardStyles.card + ' '} ref={colRef}>
      <a href={url}>
        <div className={s.imageWrapper}>
          <img className={s.image} src={iconUrl} alt={props.name} onLoad={(e) => {
            // console.log('on load', e)
          }} onError={(e) => {
            console.log('[info] icon load error');
            if (!iconUrl || iconUrl.indexOf('empty.png') !== -1) return;
            setIconUrl('/img/empty.png');
            setTimeout(() => {
              setIconUrl(props.iconUrl);
            }, 1000);
          }}></img>
        </div>
      </a>
      <div className='pe-2 pb-2 pt-2 ps-2'>
        <p className={s.label + ' truncate'}>{props.name}</p>
        <p className={s.labelPlaying + ' truncate'}>{abbreviateNumber(props.playerCount)} Playing</p>
        {
          !showCreator && <p className={s.thumbsUp + ' mt-2'}>
            <span className='icon-thumbs-up'></span>
          </p>
        }
        {
          showCreator && <div className={s.creatorDetailsCard + ' ' + cardStyles.card} style={colRef ? { width: colRef.current.clientWidth + 'px' } : undefined}>
            <p className={s.thumbsUp + ' ps-2 pe-2 mt-2'}>
              <span className='icon-thumbs-up'></span>
              <span className={'icon-thumbs-down ' + s.floatRight}></span>
            </p>
            <div className='ps-1 pt-2 pe-1'>
              <div className='divider-top'></div>
            </div>
            <p className={'ps-2 pt-2 pb-0 ' + s.creatorText}>By <CreatorLink type={props.creatorType} name={props.creatorName} id={props.creatorId}></CreatorLink></p>
          </div>
        }
      </div>
    </div>
  </div>
}

export default SmallGameCard;