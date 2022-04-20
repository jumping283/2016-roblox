import dayjs from "dayjs";
import { useRef, useState } from "react";
import { createUseStyles } from "react-jss";
import { bidOnAd } from "../../../services/ads";
import {getItemUrl, itemNameToEncodedName} from "../../../services/catalog";
import useButtonStyles from "../../../styles/buttonStyles";
import ActionButton from "../../actionButton";

const getUrl = (target) => {
  if (target.targetType === 'Asset')
    return getItemUrl({assetId: target.targetId, name: target.targetName});

  if (target.targetType === 'Group')
    return `/Groups/Group.aspx?gid=${target.targetId}`;

  throw new Error('Type not implemented: ' + target.targetType);
}

const useStatStyles = createUseStyles({
  createdLabel: {
    color: '#999',
  },
})

const AdStat = ({ name, value }) => {
  const s = useStatStyles();
  return <div className='col-3'>
    <p className='mb-0'><span className={s.createdLabel}>{name}: </span> {value}</p>
  </div>
}

const useStyles = createUseStyles({
  notRunningIcon: {
    height: '4px',
    width: '4px',
    background: '#0a0a0a',
  },
  bidLabel: {
    fontWeight: 600,
  },
  btn: {
    fontSize: '1rem',
    display: 'inline',
    marginLeft: '0.5rem',
  },
});

const AssetListAdEntry = props => {
  const s = useStyles();
  const buttonStyles = useButtonStyles();
  const { ad, target } = props;
  const { runMenuOpen, setRunMenuOpen } = props;
  const [locked, setLocked] = useState(false);
  const amountRef = useRef(null);
  const [feedback, setFeedback] = useState(null);

  let ctr = ((ad.clicksLastRun / ad.impressionsLastRun) * 100).toFixed(2);
  let totalCtr = ((ad.clicksAll / ad.impressionsAll) * 100).toFixed(2);
  return <div>
    <p className='mb-0'>{ad.name} (for <a href={getUrl(target)}>{target.targetName}</a>)</p>
    <div className='row'>
      <AdStat name='Impressions' value={ad.impressionsLastRun.toLocaleString()}></AdStat>
      <AdStat name='Clicks' value={ad.clicksLastRun.toLocaleString()}></AdStat>
      <AdStat name='CTR' value={ctr + '%'}></AdStat>
      <AdStat name='Bid' value={ad.bidAmountRobuxLastRun.toLocaleString()}></AdStat>
      <AdStat name='Total Impr' value={ad.impressionsAll.toLocaleString()}></AdStat>
      <AdStat name='Total Clicks' value={ad.clicksAll.toLocaleString()}></AdStat>
      <AdStat name='Total CTR' value={totalCtr + '%'}></AdStat>
      <AdStat name='Total Bid' value={ad.bidAmountRobuxAll.toLocaleString()}></AdStat>
    </div>
    <div className='row'>
      <div className='col-12'>
        <p className='cursor-pointer' onClick={(e) => {
          if (!ad.isRunning || true) {
            setRunMenuOpen(!runMenuOpen);
          }
        }}><span className={'game-privacy-symbol ' + (ad.isRunning ? 'gps-active' : 'gps-inactive')}></span> {ad.isRunning ? 'Running' : 'Not Running'}</p>
      </div>
    </div>
    {
      runMenuOpen ? <div className='row'>
        {feedback && <div className='col-12'><p className='text-danger'>{feedback}</p></div>}
        <div className='col-12'>
          <span className={s.bidLabel}>Bid in Robux: </span><input disabled={locked} ref={amountRef} type='text' className='p-1'></input>
          <ActionButton disabled={locked} label='Bid' className={buttonStyles.buyButton + ' ' + buttonStyles.normal + ' ' + s.btn} divClassName={s.btn} onClick={() => {
            if (locked) return;
            setFeedback(null);
            let num = parseInt(amountRef.current.value, 10);
            if (!Number.isSafeInteger(num) || num < 0) return setFeedback('Invalid Robux amount.');
            setLocked(true);
            bidOnAd({
              adId: ad.id,
              robux: num,
            }).then(() => {
              window.location.reload();
            }).catch(e => {
              setFeedback('Error buying ad. ' + e.message);
              setLocked(false);
            })
          }}></ActionButton>
          <ActionButton label='Cancel' className={buttonStyles.cancelButton + ' ' + buttonStyles.normal + ' ' + s.btn} divClassName={s.btn} onClick={() => {
            setRunMenuOpen(false);
          }}></ActionButton>
        </div>
      </div> : null
    }
  </div>
}

export default AssetListAdEntry;