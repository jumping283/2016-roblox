import { createUseStyles } from "react-jss";
import { getBaseUrl } from "../../lib/request";
import ThumbnailStore from "../../stores/thumbnailStore";

const useStyles = createUseStyles({
  image: {
    maxWidth: '400px',
    width: '100%',
    margin: '0 auto',
    height: 'auto',
    paddingTop: '20px',
  },
})

const ItemImage = (props) => {
  const s = useStyles();
  const store = ThumbnailStore.useContainer();
  const image = store.getAssetThumbnail(props.id, '420x420');

  return <img className={s.image + ' ' + (props.className || '')} src={image} alt={props.name}/>
}

export default ItemImage;