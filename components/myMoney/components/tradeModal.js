import dayjs from "dayjs";
import { flatten } from "lodash";
import { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { itemNameToEncodedName } from "../../../services/catalog";
import { acceptTrade, declineTrade, getTradeDetails } from "../../../services/trades";
import AuthenticationStore from "../../../stores/authentication";
import useButtonStyles from "../../../styles/buttonStyles";
import ActionButton from "../../actionButton";
import Robux from "../../catalogDetailsPage/components/robux";
import CreatorLink from "../../creatorLink";
import ItemImage from "../../itemImage";
import OldModal from "../../oldModal";
import PlayerHeadshot from "../../playerHeadshot";
import TradeStore from "../stores/tradeStore";
const acceptFeedbackMessage = `You have accepted {username}'s trade request. The trade is now being processed by our system.`;

const useTradeButtonStyles = createUseStyles({
  acceptWrapper: {
    width: '125px',
    margin: '0 auto',
    display: 'block',
  },
  acceptButton: {
    paddingTop: '6px',
    paddingBottom: '6px',
    fontSize: '24px',
  },
});

const TradeButtons = props => {
  const { trade } = props;
  const auth = AuthenticationStore.useContainer();
  const tradeStore = TradeStore.useContainer();
  const s = useTradeButtonStyles();
  const buttonStyles = useButtonStyles();

  const canAccept = trade.status === 'Open' && trade.user.id !== auth.userId;
  const canDecline = canAccept || trade.user.id === auth.userId;
  const canCounter = canAccept;
  const canOk = !canAccept;

  return <div className='row mt-4'>
    <div className='col-8 offset-2'>
      <div className='row mx-auto'>
        {canOk && <div className={'col-4 mx-auto'}>
          <ActionButton label='OK' className={buttonStyles.continueButton + ' ' + s.acceptButton} onClick={() => {
            tradeStore.setSelectedTrade(null);
          }}></ActionButton>
        </div>}
        {canAccept && <div className={'col-4 mx-auto'}>
          <ActionButton label='Accept' className={buttonStyles.continueButton + ' ' + s.acceptButton} onClick={() => {
            tradeStore.setSelectedTrade(null);
            acceptTrade({
              tradeId: trade.id,
            }).then(() => {
              tradeStore.setFeedback(acceptFeedbackMessage.replace(/{username}/g, trade.user.name));
              tradeStore.refershTrades();
            }).catch(e => {
              tradeStore.setFeedback('Could not accept ' + trade.user.name + '\'s trade. Please try again.');
            })
          }}></ActionButton>
        </div>}
        {canCounter && <div className={'col-4 mx-auto ps-0 pe-0'}>
          <ActionButton label='Counter' className={buttonStyles.continueButton + ' ' + s.acceptButton} onClick={() => {
            window.open("/Trade/TradeWindow.aspx?TradeSessionId=" + trade.id + "&TradePartnerID=" + trade.user.id, "_blank", "scrollbars=0, height=608, width=914");
          }}></ActionButton>
        </div>}
        {canDecline && <div className={'col-4 mx-auto'}>
          <ActionButton label='Decline' className={buttonStyles.cancelButton + ' ' + s.acceptButton} onClick={() => {
            tradeStore.setFeedback(null);
            tradeStore.setSelectedTrade(null);
            declineTrade({
              tradeId: trade.id,
            }).then(() => {
              tradeStore.refershTrades();
            })
          }}></ActionButton>
        </div>}
      </div>
    </div>
  </div>
}

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

const TradeBelowNameText = props => {
  const state = props.status;
  switch (state) {
    case 'Open':
      return <div>
        <span>Trade with <CreatorLink id={props.user.id} name={props.user.name} type='User'></CreatorLink> has been opened.</span>
        <br></br>
        <br></br>
        <span className='font-size-12 fw-700 lighten-3 mb-0'>Expires {dayjs(props.expiration).fromNow()}</span>
      </div>
    case 'Pending':
    case 'Expired':
    case 'Finished':
      return <span>Trade with <CreatorLink id={props.user.id} name={props.user.name} type='User'></CreatorLink> is {state}</span>
    default:
      return <span>Trade with <CreatorLink id={props.user.id} name={props.user.name} type='User'></CreatorLink> was {state}!</span>

  }
}

const useStyles = createUseStyles({
  value: {
    float: 'right',
    fontSize: '12px',
  },
  valueLabel: {
    fontWeight: 700,
    paddingRight: '4px',
  },
})

const TradeModal = props => {
  const [details, setDetails] = useState(null);
  const [authenticatedOffer, setAuthenticatedOffer] = useState(null);
  const [otherOffer, setOtherOffer] = useState(null);
  const auth = AuthenticationStore.useContainer();
  const s = useStyles();
  const trades = TradeStore.useContainer();
  const trade = trades.selectedTrade;
  const labelGiving = trade.status === 'Open' ? 'ITEMS YOU WILL GIVE' : (trade.status === 'Inactive' || trade.status === 'Declined' || trade.status === 'Countered') ? 'ITEMS YOU WOULD GIVEN' : 'ITEMS YOU GAVE'
  const labelRecieveing = trade.status === 'Open' ? 'ITEMS YOU WILL RECEIVE' : (trade.status === 'Inactive' || trade.status === 'Declined' || trade.status === 'Countered') ? 'ITEMS YOU WOULD HAVE RECEIVED' : 'ITEMS YOU RECEIVED'


  useEffect(() => {
    if (auth.userId === null) return null;
    setDetails(null);
    getTradeDetails({
      tradeId: trade.id,
    }).then(data => {
      setDetails(data);
      setAuthenticatedOffer(data.offers.find(v => v.user.id === auth.userId));
      setOtherOffer(data.offers.find(v => v.user.id !== auth.userId));
    })
  }, [trade]);

  return <OldModal showClose={true} title='Trade Request' height={425} width={700} onClose={() => {
    trades.setSelectedTrade(null);
  }}>
    <div className='row pt-3 pb-3 ps-4 pe-0'>
      <div className='col-3 divider-right'>
        <PlayerHeadshot id={trade.user.id} name={trade.user.name}></PlayerHeadshot>
        <p className='mb-0 font-size-15 fw-700 text-center'>
          <TradeBelowNameText {...trade}></TradeBelowNameText>
        </p>
      </div>
      <div className='col-9'>
        <div className='row'>
          <div className='col-8'>
            <p className='fw-700 font-size-15'>{labelGiving}</p>
          </div>
          <div className='col-4'>
            <p className={s.value}><span className={s.valueLabel}>Value:</span> <Robux inline={true}>
              {authenticatedOffer && authenticatedOffer.userAssets.map(v => v.recentAveragePrice).reduce((a, b) => a + b, 0)}
            </Robux></p>
          </div>
        </div>
        {authenticatedOffer && <TradeItemRow items={authenticatedOffer.userAssets} robux={authenticatedOffer.robux}></TradeItemRow>}
        <div className='row'>
          <div className='col-12 divider-top mb-2'>

          </div>
        </div>
        <div className='row'>
          <div className='col-8'>
            <p className='fw-700 font-size-15'>{labelRecieveing}</p>
          </div>
          <div className='col-4'>
            <p className={s.value}><span className={s.valueLabel}>Value:</span> <Robux inline={true}>
              {otherOffer && otherOffer.userAssets.map(v => v.recentAveragePrice).reduce((a, b) => a + b, 0)}
            </Robux></p>
          </div>
        </div>
        {otherOffer && <TradeItemRow items={otherOffer.userAssets} robux={otherOffer.robux}></TradeItemRow>}
      </div>
      <div className='col-12'>
        {otherOffer && authenticatedOffer && details && <TradeButtons trade={details}></TradeButtons>}
      </div>
    </div>
  </OldModal>
}

export default TradeModal;