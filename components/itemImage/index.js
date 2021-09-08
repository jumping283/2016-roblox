import { createUseStyles } from "react-jss";
import { getBaseUrl } from "../../lib/request";

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
  const image = getBaseUrl() + '/thumbs/asset.ashx?width=420&height=420&assetId=' + props.id;

  return <img className={s.image + ' ' + (props.className || '')} src={image} alt={props.name}></img>
}

export default ItemImage;