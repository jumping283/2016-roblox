import {createUseStyles} from "react-jss";
import configureItemStore from "../stores/configureItemStore";
import Robux from "../../robux";
import {useState} from "react";

const useStyles = createUseStyles({
  inline: {
    display: 'inline-block',
  },
  columnOne: {
    width: '150px',
    textAlign: 'right',
    paddingRight: '5px',
  }
});

const SellItem = props => {
  const [feedback, setFeedback] = useState(null);
  const store = configureItemStore.useContainer();
  const s = useStyles();

  let marketplaceFee = Math.trunc(store.price * 0.3);
  if (marketplaceFee < 1) {
    marketplaceFee = 1;
  }
  let userEarns = store.price - marketplaceFee;
  if (userEarns < 0) {
    userEarns = 0;
  }

  return <div className='row'>
    <div className='col-12'>
      <h3>Sell this Item</h3>
      <hr className='mt-0 mb-2' />
      <p className='ps-2 pe-2'>Check the box below and enter a price if you want to sell this item in the ROBLOX catalog. Uncheck the box to remove the item from catalog.</p>
    </div>
    <div className='col-12 col-lg-8 offset-lg-1'>
      <div>
        <input type='checkbox' disabled={store.locked} checked={store.isForSale} onChange={e => {
          store.setIsForSale(e.currentTarget.checked);
        }} />
        <p className='d-inline ms-2'>Sell this item</p>
      </div>
      {feedback ? <p className='text-danger'>{feedback}</p> : null}
      <div className='mt-4'>
        <div className={s.inline + ' ' + s.columnOne}>
          <p className='fw-bolder'>Price:</p>
        </div>
        <div className={s.inline + ' pe-1'}>
          <Robux />
        </div>
        <div className={s.inline}>
          <input disabled={!store.isForSale || store.locked} type='text' value={store.isForSale ? store.price : ''} onChange={e => {
            let newValue = parseInt(e.currentTarget.value, 10);
            if (newValue > 1000000 || newValue < 2 || isNaN(newValue)) {
              setFeedback('Price must be between R$2 and R$1,000,000');
            }else {
              setFeedback(null);
              store.setPrice(newValue);
            }
          }} />
        </div>
      </div>
      <div className='mt-2'>
        <div className={s.inline + ' ' + s.columnOne}>
          <p className='fw-bolder mb-0'>Marketplace Fee:</p>
        </div>
        <div className={s.inline + ' pe-1'}>
          <Robux>{store.isForSale ? marketplaceFee : '-'}</Robux>
        </div>
      </div>
      <div className='mt-0'>
        <div className={s.inline + ' ' + s.columnOne}>
          <p>(30% - Minimum 1)</p>
        </div>
      </div>
      <div className='mt-2'>
        <div className={s.inline + ' ' + s.columnOne}>
          <p>You Earn</p>
        </div>
        <div className={s.inline + ' pe-1'}>
          <Robux>{store.isForSale ? userEarns : '-'}</Robux>
        </div>
      </div>
    </div>
  </div>
}

export default SellItem;