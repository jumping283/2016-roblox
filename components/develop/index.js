import React from "react";
import { createUseStyles } from "react-jss";
import AdBanner from "../ad/adBanner";
import OldVerticalTabs from "../oldVerticalTabs";
import CreationsTab from './components/creationsTab';
import NotAvailable from "./components/notAvailable";

const useStyles = createUseStyles({
  developerContainer: {
    backgroundColor: '#fff',
    padding: '4px 8px',
    overflow: 'hidden',
  },
})

const Develop = props => {
  const s = useStyles();
  return <div className='container'>
    <AdBanner></AdBanner>
    <div className={s.developerContainer}>
      <OldVerticalTabs options={[
        {
          name: 'My Creations',
          element: <CreationsTab></CreationsTab>,
        },
        {
          name: 'Library',
          element: <NotAvailable></NotAvailable>,
        },
        {
          name: 'Developer Exchange',
          element: <NotAvailable></NotAvailable>,
        },

      ]}></OldVerticalTabs>
    </div>
  </div>
}

export default Develop;