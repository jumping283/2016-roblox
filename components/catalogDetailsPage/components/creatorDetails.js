import dayjs from "../../../lib/dayjs";
import React from "react";
import { createUseStyles } from "react-jss";
import BcOverlay from "../../bcOverlay";
import CreatorLink from "../../creatorLink";
import PlayerImage from "../../playerImage";

const useStatEntryStyles = createUseStyles({
  text: {
    fontSize: '12px',
    paddingBottom: 0,
    marginBottom: 0,
  },
  statName: {
    color: '#999',
  },
});

const StatEntry = props => {
  const s = useStatEntryStyles();
  return <p className={s.text}>
    <span className={s.statName}>{props.name}: </span><span>{props.value}</span>
  </p>
}

const useStyles = createUseStyles({

});


const CreatorDetails = props => {
  const s = useStyles();
  if (props.type !== 1 && props.type !== 'User') {
    throw new Error('Unsupported type ' + props.type); // todo: group support
  }
  return <div className='row'>
    <div className='col-4 pe-0'>
      <PlayerImage id={props.id} name={props.name}/>
      <BcOverlay/>
    </div>
    <div className='col-8 ps-0'>
      <StatEntry name="Creator" value={
        <CreatorLink id={props.id} name={props.name} type={props.type}/>
      }/>
      <StatEntry name="Created" value={dayjs(props.createdAt).format('M/D/YYYY')}/>
      <StatEntry name="Updated" value={dayjs(props.updatedAt).fromNow()}/>
    </div>
  </div>
}

export default CreatorDetails;