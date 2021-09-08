import React, { useState } from "react";
import { createUseStyles } from "react-jss";
import { abbreviateNumber } from "../../../lib/numberUtils";
import AuthenticationStore from "../../../stores/authentication";

const useDropdownStyles = createUseStyles({
  wrapper: {
    width: '125px',
    position: 'absolute',
    top: '45px',
    right: '10px',
    boxShadow: '0 -5px 20px rgba(25,25,25,0.15)',
    userSelect: 'none',
  },
  text: {
    padding: '10px',
    marginBottom: 0,
    fontSize: '16px',
    '&:hover': {
      background: '#eaeaea',
      borderLeft: '4px solid #0074BD',
    },
    '&:hover > a': {
      marginLeft: '-4px',
    },
  }
});

const SettingsDropdown = props => {
  const authStore = AuthenticationStore.useContainer();
  const s = useDropdownStyles();
  return <div className={s.wrapper}>
    <p className={`${s.text}`}>
      <a href='/My/Account' className='text-dark'>Settings</a>
    </p>
    <p className={`${s.text}`}>
      <a href='/help' className='text-dark'>Help</a>
    </p>
    <p className={`${s.text}`}>
      <a onClick={(e) => {
        e.preventDefault();
        alert('Not implemented'); // TODO
      }} className='text-dark'>Logout</a>
    </p>
  </div>
}


const useLoginAreaStyles = createUseStyles({
  text: {
    color: 'white',
    fontWeight: 400,
    fontSize: '16px',
    borderBottom: 0,
    marginTop: '2px',
    marginBottom: 0,
    textAlign: 'right',
    whiteSpace: 'nowrap',
    display: 'inline',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    padding: '4px 8px',
    '&:hover': {
      color: 'white',
      background: 'rgba(25,25,25,0.1)',
      cursor: 'pointer',
      borderRadius: '4px',
    },
  },
  settingsIcon: {
    float: 'right',
  },
  linkContainer: {
  },
  linkContainerCol: {
    maxWidth: '250px',
    float: 'right',
  },
  robuxText: {
    marginRight: '20px',
    marginLeft: '5px',
  },
});

const LoggedInArea = props => {
  const s = useLoginAreaStyles();
  const authStore = AuthenticationStore.useContainer();
  const [settingsOpen, setSettingsOpen] = useState(false);

  if (authStore.robux === null) return null;
  return <div className={`${s.linkContainerCol} `}>
    <div className='row'>
      <div className={`col-12 ${s.linkContainer}`}>
        <p className={s.text}>
          <a href='/My/Money.aspx'>
            <span className='icon-nav-robux'></span>
          </a>
        </p>
        <p className={s.text + ' ' + s.robuxText}>
          <span>{abbreviateNumber(authStore.robux)}</span>
        </p>
        <p className={s.text}>
          <a onClick={(e) => {
            e.preventDefault();
            setSettingsOpen(!settingsOpen);
          }}>
            <span className={`icon-nav-settings ${s.settingsIcon}`} id="nav-settings"></span>
          </a>
        </p>
        {settingsOpen && <SettingsDropdown></SettingsDropdown>}
      </div>
    </div>
  </div>
}

export default LoggedInArea;