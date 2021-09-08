import dayjs from "dayjs";
import React, { useRef, useState } from "react";
import { createUseStyles } from "react-jss";
import getFlag from "../../lib/getFlag";
import { getBaseUrl } from "../../lib/request";
import { itemNameToEncodedName } from "../../services/catalog";
import LimitedOverlay from "../catalogOverlays/limited";
import LimitedUniqueOverlay from "../catalogOverlays/limitedUnique";
import NewOverlay from "../catalogOverlays/new";
import SaleOverlay from "../catalogOverlays/sale";
import TimerOverlay from "../catalogOverlays/timer";
import CreatorLink from "../creatorLink";
import Robux from "../robux";

const useCatalogPageStyles = createUseStyles({
  image: {
    width: '100%',
    height: 'auto',
    border: '1px solid #eee',
    margin: '0 auto',
    display: 'block',
  },
  imageBig: {
    maxWidth: '152px',
    display: 'block',
    margin: '0 auto',
  },
  imageSmall: {
    maxWidth: '112px',
    display: 'block',
    margin: '0 auto',
  },
  detailsLarge: {

  },
  detailsSmall: {

  },
  detailsWrapper: {
    position: 'absolute',
    // marginTop: '-2px',
    display: 'none',
    background: '#fff',
    paddingBottom: '5px',
    border: '1px solid #c3c3c3',
    transform: 'scale(110%)',
    zIndex: 2,
    paddingLeft: '4px',
  },
  detailsOpen: {
    display: 'block',
  },
  detailsKey: {
    fontSize: '10px',
    marginLeft: '0',
    marginRight: '2px',
    opacity: 0.7,
    fontWeight: 600,
  },
  detailsValue: {
    fontSize: '10px',
  },
  detailsEntry: {
    marginBottom: 0,
    marginTop: '-5px',
  },
  overviewDetails: {
    height: '40px',
  },
  itemName: {
    maxHeight: '35px',
    overflow: 'hidden',
  },
});

const usePriceStyles = createUseStyles({
  remainingText: {
    fontWeight: 700,
    fontSize: '12px',
  },
  remainingLabel: {
    color: 'red',
    fontWeight: 600,
    fontSize: '12px',
  }
})

const PriceText = (props) => {
  const s = usePriceStyles();
  const isLimited = props.itemRestrictions && (props.itemRestrictions.includes('Limited') || props.itemRestrictions.includes('LimitedUnique'));
  const copiesRemaining = props.unitsAvailableForConsumption;

  let priceElement = null;
  if (props.isForSale) {
    if (props.price === 0 || props.price === null) {
      priceElement = <p className='mb-0 text-dark'>Free</p>;
    } else {
      priceElement = <p className='mb-0'><Robux>{props.price}</Robux></p>
    }
  }

  if (props.isForSale && props.price !== 0 && props.price !== null) {
    if (isLimited && copiesRemaining) {
      return <div>
        {priceElement}
        <span>
          <span className={s.remainingLabel}>Remaining: </span> <span className={s.remainingText + ' text-dark'}>{copiesRemaining.toLocaleString()}</span>
        </span>
      </div>
    }
    return priceElement
  }
  if (props.isForSale && (props.price === 0 || props.price === null)) {
    return priceElement;
  }
  if (isLimited && !props.isForSale) {
    // Limited and not for sale anymore
    return <div>
      <p className='mb-0'><Robux prefix="was ">{props.price || '-'}</Robux></p>
      <p className='mb-0'><Robux prefix="now ">{props.lowestPrice || '-'}</Robux></p>
    </div>
  }
  return <p className='mb-0 text-dark'>offsale</p>;
}

const CatalogPageCard = props => {
  const s = useCatalogPageStyles();
  const isLarge = props.mode === 'large';
  const c = isLarge ? 'col-6 col-md-6 col-lg-3 mb-4 ' : 'col-6 col-md-6 col-lg-2 mb-2';
  const image = getBaseUrl() + '/thumbs/asset.ashx?width=420&height=420&assetId=' + props.id;
  const [showDetails, setShowDetails] = useState(false);
  const cardRef = useRef(null);
  // various conditionals
  const isLimited = props.itemRestrictions && props.itemRestrictions.includes('Limited');
  const isLimitedU = props.itemRestrictions && props.itemRestrictions.includes('LimitedUnique');
  const hasBottomOverlay = isLimited || isLimitedU;

  const isTimedItem = props.isForSale && props.offsaleDeadline;
  const isNew = props.createdAt ? dayjs(props.createdAt).isAfter(dayjs().subtract(2, 'days')) : false;
  const isSale = false; // TODO
  const hasTopOverlay = isNew || isSale;

  return <div className={`${c}`} onMouseEnter={() => setShowDetails(true)} onMouseLeave={() => setShowDetails(false)}>
    <div ref={cardRef} className={isLarge ? s.imageBig : s.imageSmall}>
      <a href={`/${itemNameToEncodedName(props.name)}-item?id=${props.id}`}>
        <div style={{ zIndex: showDetails ? 10 : 0, position: 'relative' }}>
          {isTimedItem && <TimerOverlay></TimerOverlay>}
          {isNew ? <NewOverlay></NewOverlay> : isSale ? <SaleOverlay></SaleOverlay> : null}
          <img src={image} className={`${s.image} ${props.mode === 'large' ? s.imageBig : s.imageSmall}`}></img>
          {isLimited && <LimitedOverlay></LimitedOverlay>}
          {isLimitedU && <LimitedUniqueOverlay></LimitedUniqueOverlay>}
          <div className={s.overviewDetails} style={hasBottomOverlay ? { marginTop: '-18px' } : undefined}>
            <p className={`mb-0 ${s.itemName}`}>{props.name}</p>
            <PriceText {...props}></PriceText>
          </div>
        </div>
      </a>
      <div
        style={showDetails ? {
          width: cardRef.current.clientWidth,
          paddingTop: cardRef.current.clientHeight + 'px',
          marginTop: '-' + cardRef.current.clientHeight + 'px',
        } : undefined}
        className={s.detailsWrapper + ' ' + (isLarge ? s.detailsLarge : s.detailsSmall) + ' ' + (showDetails ? s.detailsOpen : '')}>
        <p className={s.detailsEntry + ' mt-2'}>
          <span className={s.detailsKey}>Creator: </span>
          <span className={s.detailsValue}>
            <CreatorLink id={props.creatorTargetId} name={props.creatorName} type={props.creatorType}></CreatorLink>
          </span>
        </p>
        <p className={s.detailsEntry}>
          <span className={s.detailsKey}>Updated: </span>
          <span className={s.detailsValue}>
            {dayjs(props.updatedAt).fromNow()}
          </span>
        </p>
        <p className={s.detailsEntry}>
          <span className={s.detailsKey}>Sales: </span>
          <span className={s.detailsValue}>
            {getFlag('catalogSaleCountVisibleFromDetailsEndpoint', false) ? props.saleCount.toLocaleString() : 0}
          </span>
        </p>
        <p className={s.detailsEntry}>
          <span className={s.detailsKey}>Favorited: </span>
          <span className={s.detailsValue}>
            {props.favoriteCount?.toLocaleString() || 0} times
          </span>
        </p>
      </div>
    </div>
  </div>
}

export default CatalogPageCard;