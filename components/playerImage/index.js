import { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { getBaseUrl } from "../../lib/request";
import { reportImageFail } from "../../services/metrics";

const useStyles = createUseStyles({
  image: {
    maxWidth: '400px',
    width: '100%',
    margin: '0 auto',
    height: 'auto',
    display: 'block',
  },
})

const PlayerImage = (props) => {
  const s = useStyles();
  const size = props.size || 420;
  const [retryCount, setRetryCount] = useState(0);
  const [image, setImage] = useState(null);

  useEffect(() => {
    setRetryCount(0);
    setImage(getBaseUrl() + `/Thumbs/Avatar.ashx?height=${size}&width=${size}&userid=${props.id}&v=${props.disableCache ? new Date().getTime() : '0'}`);
  }, [props]);

  return <img className={s.image} src={image} alt={props.name} onError={(e) => {
    if (retryCount >= 3) return;
    reportImageFail({
      errorEvent: e,
      type: 'playerHeadshot',
      src: image,
    })
    setRetryCount(retryCount + 1);
    setImage('/img/empty.png')
  }}></img>
}

export default PlayerImage;