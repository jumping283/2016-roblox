import { createUseStyles } from "react-jss";
import { getBaseUrl } from "../../lib/request";
import { adTypes } from "./constants";

const useStyles = createUseStyles({
  frameWrapper: {
    width: '100%',
    height: 'auto',
  },
})

/**
 * User advertisement iframe
 * @param {{type: number}} props 
 */
const UserAdvertisement = props => {
  const info = adTypes[props.type];
  if (!info) throw new Error(`unexpected adType: ${props.type}`);

  const s = useStyles();
  return <div className={s.frameWrapper} style={{ height: info.height }}>
    <iframe name='RobloxUserAdvertisement' scrolling='no' src={`${getBaseUrl()}/user-sponsorship/${props.type}`} frameBorder={0}></iframe>
  </div>
}

export default UserAdvertisement;