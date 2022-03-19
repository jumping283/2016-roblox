import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  overlay: {
    width: '66px',
    height: '19px',
    marginTop: '-40px',
    zIndex: 2,
  },
});

const BcOverlay = props => {
  const s = useStyles();
  return <img className={s.overlay} src={`/img/overlay_obcOnly.png`} />
}

export default BcOverlay;