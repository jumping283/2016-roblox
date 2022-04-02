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
    <AdBanner/>
    <div className={s.developerContainer}>
      <OldVerticalTabs options={[
        {
          name: 'My Creations',
          element: <CreationsTab id={props.id} />,
        },
        {
          name: 'Library',
          element: <NotAvailable />,
        },
        {
          name: 'Developer Exchange',
          element: <NotAvailable />,
        },

      ]} />
    </div>
  </div>
}

export default Develop;