import { useState } from "react";
import { createUseStyles } from "react-jss";
import { itemNameToEncodedName } from "../../../services/catalog";
import ItemImage from "../../itemImage";

const useTradeItemStyles = createUseStyles({
  col: {
    width: `calc(20% - 5px)`,
    border: '1px solid #c3c3c3',
    marginRight: '5px',
    padding: 0,
    height: '100px',
    zIndex: 99,
  },
  expandedCol: {
    transform: 'scale(1.3)',
    height: '150px',
    zIndex: 200,
    background: 'white',
    marginBottom: '-50px',
  },
  itemName: {
    height: '29px',
    lineHeight: '1.1',
    overflow: 'hidden',
    fontSize: '12px',
    textAlign: 'center',
  },
  expandedItemName: {
    fontSize: '9px',
  },
  rapText: {
    fontSize: '8px',
    fontWeight: 700,
    color: '#777',
    letterSpacing: -0.1,
    paddingLeft: '4px',
    marginBottom: '4px',
  },
  robux: {
    color: '#060',
    letterSpacing: -0.1,
  },
  imageWrapper: {
    width: '80px',
    height: '80px',
    margin: '0 auto',
    display: 'block',
  },
})

const TradeItem = props => {
  const s = useTradeItemStyles();
  const [expanded, setExpanded] = useState(null);

  return <div className={expanded ? s.expandedCol + ' ' + s.col : s.col} onMouseEnter={() => {
    if (!props.name) return
    setExpanded(true);
  }} onMouseLeave={() => {
    setExpanded(false);
  }}>
    {props.name && <p className={`${s.itemName} ${expanded ? s.expandedItemName : ''} mb-0 ps-1 pe-1`}>
      <a href={`/${itemNameToEncodedName(props.name)}-item?id=${props.assetId}`}>
        {props.name}
      </a>
    </p>}
    {props.robux && <p className={`text-center`}>{props.robux} Robux</p>}
    <div className={s.imageWrapper}>
      {props.robux && <img src='/img/test.png' alt='Robux Image'></img>}
      {props.assetId && <ItemImage className='pt-1' id={props.assetId}></ItemImage>}
    </div>
    {expanded && props.serialNumber && <p className={s.rapText}>#{props.serialNumber}/{props.assetStock || '-'}</p>}
    {expanded && <p className={s.rapText}>Avg. Price: <span className={s.robux}>${props.recentAveragePrice}</span></p>}
    {expanded && <p className={s.rapText}>Orig. Price: <span className={s.robux}>${props.originalPrice || '-'}</span></p>}
  </div>
}

const TradeItemRow = ({ items, robux }) => {
  let placeholders = 5 - items.length;
  if (robux) {
    placeholders--;
  }
  return <div className='row ms-1 mb-4'>
    {
      items.map(v => {
        return <TradeItem key={v.id} {...v}></TradeItem>
      })
    }
    {robux && <TradeItem robux={robux}></TradeItem>}
    {
      [... new Array(placeholders)].map((v, i) => {
        return <TradeItem key={`placeholder ${i}`}></TradeItem>
      })
    }
  </div>
}

export default TradeItemRow;