import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { getItemDetails, itemNameToEncodedName } from "../../../services/catalog";
import { getTransactions, getTransactionSummary } from "../../../services/economy";
import AuthenticationStore from "../../../stores/authentication";
import Robux from "../../catalogDetailsPage/components/robux";
import PlayerHeadshot from "../../playerHeadshot";
import Table from "./table";

const useStyles = createUseStyles({
  inline: {
    display: 'inline-block',
  },
  robuxTotal: {
    textAlign: 'right',
  },
});

const fNum = (num) => {
  if (!num) return '';
  return num.toLocaleString();
}

const formatResponse = (resp) => {
  const result = [
    [
      'Builders Club Stipend',
      fNum(resp.premiumStipendsTotal),
    ],
    [
      'Builders Club Stipend Bonus',
      '',
    ],
    [
      'Sale of Goods',
      fNum(resp.salesTotal),
    ],
    [
      'Currency Purchase',
      fNum(resp.currencyPurchasesTotal),
    ],
    [
      'Trade System Trades',
      fNum(resp.tradeSystemEarningsTotal),
    ],
    [
      'Promoted Page Conversion Revenue',
      '',
    ],
    [
      'Game Page Conversion Revenue',
      '',
    ],
    [
      'Pending Sales',
      fNum(resp.pendingRobuxTotal),
    ],
    [
      'Group Payouts',
      fNum(resp.groupPayoutsTotal),
    ],
  ];
  return result;
}

const MySummaryTable = props => {
  const s = useStyles();
  const [period, setPeriod] = useState('day');
  const [entries, setEntries] = useState(null);
  const [response, setResponse] = useState(null);
  const auth = AuthenticationStore.useContainer();
  useEffect(() => {
    if (auth.isPending) return;
    getTransactionSummary({
      timePeriod: period,
      userId: auth.userId,
    }).then(values => {
      setEntries(formatResponse(values));
      setResponse(values);
    })
  }, [auth.userId, auth.isPending, period]);

  return <div className='row'>
    <div className='col-12 mb-3 mt-3'>
      <div className={s.inline}>
        <p className='mb-0 fw-700 lighten-1 pe-2'>Time Period: </p>
      </div>
      <div className={s.inline}>
        <select value={period} onChange={(e) => {
          setPeriod(e.currentTarget.value);
          setEntries(null);
        }}>
          <option value='day'>Past Day</option>
          <option value='week'>Past Week</option>
          <option value='month'>Past Month</option>
          <option value='year'>Past Year</option>
        </select>
      </div>
    </div>
    <div className='col-12'>
      <p className='mb-0 fw-600'><Robux inline={true}></Robux> Robux</p>
    </div>
    <div className='col-12'>
      <Table
        keys={
          [
            'Categories',
            'Credit',
          ]
        }
        entries={entries}>
        <p className={s.robuxTotal + ' fw-600 mt-2'}>TOTAL: <Robux inline={true}>{response && response.incomingRobuxTotal.toLocaleString()}</Robux></p>
      </Table>
    </div>
  </div>
}

export default MySummaryTable;