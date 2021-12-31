import dayjs from "dayjs";
import { createUseStyles } from "react-jss";
import { itemNameToEncodedName } from "../../../services/catalog";

const useStyles = createUseStyles({
  createdLabel: {
    color: '#999',
  },
})

const getUrl = (target) => {
  if (target.targetType === 'Asset') return `/${itemNameToEncodedName(target.targetName)}-item?id=${target.targetId}`;
  if (target.targetType === 'Group') return `/Groups/Group.aspx?gid=${target.targetId}`;
  throw new Error('Type not implemented: ' + target.targetType);
}

const AdStat = ({ name, value }) => {
  const s = useStyles();
  return <div className='col-3'>
    <p className='mb-0'><span className={s.createdLabel}>{name}: </span> {value}</p>
  </div>
}

const AssetListAdEntry = props => {
  const { ad, target } = props;

  let ctr = ((ad.clicksLastRun / ad.impressionsLastRun) * 100).toFixed(2);
  return <div>
    <p className='mb-0'>{ad.name} (for <a href={getUrl(target)}>{target.targetName}</a>)</p>
    <div className='row'>
      <AdStat name='Impressions' value={ad.impressionsLastRun.toLocaleString()}></AdStat>
      <AdStat name='Clicks' value={ad.clicksLastRun.toLocaleString()}></AdStat>
      <AdStat name='CTR' value={ctr + '%'}></AdStat>
      <AdStat name='Bid' value={ad.bidAmountRobuxLastRun.toLocaleString()}></AdStat>
    </div>
  </div>
}

export default AssetListAdEntry;