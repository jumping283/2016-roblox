import { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { getBaseUrl } from "../../../lib/request";
import t from "../../../lib/t";
import {getItemUrl, itemNameToEncodedName} from "../../../services/catalog";
import { getCollections } from "../../../services/inventory";
import ItemImage from "../../itemImage";
import useCardStyles from "../styles/card";
import SmallButtonLink from "./smallButtonLink";
import Subtitle from "./subtitle";

const useCollectionStyles = createUseStyles({
  imageWrapper: {
    border: '1px solid #c3c3c3',
    borderRadius: '4px',
  },
  image: {
    width: '100%',
    margin: '0 auto',
    display: 'block',
  },
  itemLabel: {
    fontWeight: 300,
    fontSize: '16px',
    color: '#666',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  buttonWrapper: {
    width: '100px',
    float: 'right',
    marginTop: '10px',
  },
});

const Collections = props => {
  const { userId } = props;
  const s = useCollectionStyles();
  const cardStyles = useCardStyles();
  const [collections, setCollections] = useState(null);
  useEffect(() => {
    getCollections({ userId }).then(setCollections)
  }, [userId]);

  if (!collections || collections.length === 0) {
    return null;
  }
  return <div className='row'>
    <div className='col-10'>
      <Subtitle>Collections</Subtitle>
    </div>
    <div className='col-2'>
      <div className={s.buttonWrapper}>
        <SmallButtonLink href={`/users/${userId}/inventory`}>Inventory</SmallButtonLink>
      </div>
    </div>
    <div className='col-12'>
      <div className={cardStyles.card}>
        <div className='row ps-4 pe-4 pt-4 pb-4'>
          {
            collections.map((v, i) => {
              const assetId = v.Id;
              const url = assetId && getItemUrl({assetId: assetId, name: v.Name}) || v.AssetSeoUrl;
              return <div className='col-4 col-lg-2' key={i}>
                <a href={url}>
                  <div className={s.imageWrapper}>
                    <img src={v.Thumbnail.Url.startsWith('http') ? v.Thumbnail.Url : getBaseUrl() + v.Thumbnail.Url} className={s.image}/>
                  </div>
                  <p className={`mb-0 ${s.itemLabel}`}>{v.Name}</p>
                </a>
              </div>
            })
          }
        </div>
      </div>
    </div>
  </div>
}

export default Collections;