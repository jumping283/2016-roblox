import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  startPlaceLabel: {
    color: '#999',
    paddingRight: '8px',
    fontSize: '13px',
  },
  visibilityButton: {

  },
});
const AssetListGameEntry = props => {
  const s = useStyles();
  return <div>
    <p className='mb-0'><span className={s.startPlaceLabel}>Start Place: </span> <a href={props.url}>{props.startPlaceName}</a></p>
    <p className={s.visibilityButton + ' mb-0 mt-1'}>
      <a href={props.url + '#/#basicSettings'}>
        Public
      </a>
    </p>
  </div>
}

export default AssetListGameEntry;