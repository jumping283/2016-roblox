import { createUseStyles } from "react-jss";
import Robux from "../../robux";
import TradeItemRow from "./tradeItemRow";

const useStyles = createUseStyles({
  value: {
    float: 'right',
    fontSize: '12px',
  },
  valueLabel: {
    fontWeight: 700,
    paddingRight: '4px',
  },
});

const TradeOfferEntry = (props) => {
  const s = useStyles();
  const { label, offer } = props;
  return <>
    <div className='row'>
      <div className='col-8'>
        <p className='fw-700 font-size-15'>{label}</p>
      </div>
      <div className='col-4'>
        <p className={s.value}><span className={s.valueLabel}>Value:</span> <Robux inline={true}>
          {offer && offer.userAssets.map(v => v.recentAveragePrice).reduce((a, b) => a + b, 0)}
        </Robux></p>
      </div>
    </div>
    {offer && <TradeItemRow items={offer.userAssets} robux={offer.robux}></TradeItemRow>}
  </>
}

export default TradeOfferEntry;