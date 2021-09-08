// reference: https://www.youtube.com/watch?v=Fge61b89IVM
import React, { useEffect } from "react";
import AdBanner from "../ad/adBanner";
import Bar from "./components/bar";
import MoneyPageStore from "./stores/moneyPageStore";

const MyMoney = props => {
  const store = MoneyPageStore.useContainer();
  useEffect(() => {
    // There are two types: 'Trades' and 'Money'
    store.setTab(props.type);
  }, [props.type]);

  if (!store.tab) return null;
  return <div className='container'>
    <AdBanner></AdBanner>
    <Bar></Bar>
  </div>
}

export default MyMoney;