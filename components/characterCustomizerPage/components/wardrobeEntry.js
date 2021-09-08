import React from "react";
import { createUseStyles } from "react-jss";
import { itemNameToEncodedName } from "../../../services/catalog";
import CharacterCustomizationStore from "../../../stores/characterPage";
import useButtonStyles from "../../../styles/buttonStyles";
import ActionButton from "../../actionButton";
import ItemImage from "../../itemImage";

const useEntryStyles = createUseStyles({
  itemName: {
    fontWeight: 700,
    marginBottom: 0,
  },
  image: {
    display: 'block',
    margin: '0 auto',
    maxWidth: '100px',
  },
  wearButton: {
    float: 'right',
    fontSize: '12px',
    marginBottom: '-25px',
    width: 'auto',
    paddingTop: '2px',
    paddingBottom: '2px',
  },
  wearButtonWrapper: {
    position: 'relative',
  },
  assetTypeLabel: {
    fontWeight: 600,
    color: '#666',
  },
  assetType: {
    color: '#0055b3',
  },
  assetTypeWrapper: {
    fontSize: '12px',
  },
  thumbWrapper: {
    marginTop: '-10px',
  },
});
const WardrobeEntry = props => {
  const s = useEntryStyles();
  const buttonStyles = useButtonStyles();
  const characterStore = CharacterCustomizationStore.useContainer();
  if (!characterStore.wearingAssets) {
    return null;
  }
  const isWearing = characterStore.wearingAssets.find(v => v.assetId === props.assetId) !== undefined;

  return <div className='col-3 mt-4'>
    <div className={s.image}>
      <div className={s.wearButtonWrapper}>
        <ActionButton disabled={characterStore.isRendering} label={isWearing ? 'Remove' : 'Wear'} className={s.wearButton + ' ' + buttonStyles.continueButton} onClick={() => {
          if (isWearing) {
            characterStore.setWearingAssets(characterStore.wearingAssets.filter(v => {
              return v.assetId !== props.assetId;
            }));
          } else {
            let newArr = characterStore.wearingAssets || [];
            const onlyOneOf = [
              2, // tee shirt
              11, // shirt
              12, // pants
              18, /// face
              // body parts
              27,
              28,
              29,
              30,
              31,
              32,
              24,
            ];
            if (onlyOneOf.includes(props.assetTypeId)) {
              newArr = newArr.filter(v => {
                return v.assetType.id !== props.assetTypeId;
              })
            }
            characterStore.setWearingAssets([...newArr, {
              assetId: props.assetId,
              name: props.name,
              assetType: {
                id: props.assetTypeId,
                name: props.assetTypeName,
              }
            }])
          }
        }}></ActionButton>
      </div>
      <div className={s.thumbWrapper}>
        <ItemImage id={props.assetId}></ItemImage>
      </div>
    </div>
    <p className={s.itemName}>
      <a href={`/${itemNameToEncodedName(props.name)}-item?id=${props.assetId}`}>
        {props.name}
      </a>
    </p>
    {
      props.showAssetType && <div className={s.assetTypeWrapper}>
        <span className={s.assetTypeLabel}>Type: </span> <span className={s.assetType}>{props.assetTypeName}</span>
      </div>
    }
  </div>;
}

export default WardrobeEntry;