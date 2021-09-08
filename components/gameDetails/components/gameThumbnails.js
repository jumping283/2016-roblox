import { useState } from "react";
import { createUseStyles } from "react-jss";
import { getBaseUrl } from "../../../lib/request";
import GameDetailsStore from "../stores/gameDetailsStore";

const useStyles = createUseStyles({
  image: {
    width: '100%',
    height: 'auto',
    maxWidth: '800px',
    margin: '0 auto',
    display: 'block',
  },
})

const GameThumbnails = props => {
  // TODO:
  // ES backend does not support multiple thumbnails yet. Once that is added, we will need to use an endpoint that returns thumbs.
  const s = useStyles();
  const store = GameDetailsStore.useContainer();
  const [selectedImage, setSelectedImage] = useState(0);
  const imageUrl = getBaseUrl() + '/thumbs/asset.ashx?width=420&height=420&assetId=' + store.details.id;

  return <div className='row'>
    <div className='col-12'>
      <img className={s.image} src={imageUrl}></img>
    </div>
  </div>
}

export default GameThumbnails;