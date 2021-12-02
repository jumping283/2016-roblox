import { getBaseUrl } from "../../lib/request";
import { adTypes } from "./constants";

/**
 * User advertisement iframe
 * @param {{type: number}} props 
 */
const UserAdvertisement = props => {
  const info = adTypes[props.type];
  if (!info) throw new Error(`unexpected adType: ${props.type}`);
  return <iframe name='RobloxUserAdvertisement' allowTransparency={true} scrolling='no' src={`${getBaseUrl()}/user-sponsorship/${props.type}`} width={info.width} height={info.height} frameBorder={0}></iframe>
}

export default UserAdvertisement;