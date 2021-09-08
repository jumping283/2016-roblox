import React, { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import getFlag from "../../../lib/getFlag";
import { itemNameToEncodedName } from "../../../services/catalog";
import { getInventory } from "../../../services/inventory";
import CharacterCustomizationStore from "../../../stores/characterPage";
import useButtonStyles from "../../../styles/buttonStyles";
import ActionButton from "../../actionButton";
import ItemImage from "../../itemImage";
import OldVerticalTabs from "../../oldVerticalTabs";
import assetTypes from "../assetTypes";
import WardrobeEntry from "./wardrobeEntry";

const creatableAssets = [
  2, // T-Shirt
  11, // Shirt
  12, // Pants
];


const useWardrobeStyles = createUseStyles({
  categoryEntry: {
    cursor: 'pointer',
    color: '#0055b3',
    textAlign: 'center',
    marginBottom: 0,
  },
  categoryWrapper: {
    margin: '0 auto',
  },
  selected: {
    fontWeight: 700,
  },
  paginationText: {
    textAlign: 'center',
    marginBottom: 0,
    userSelect: 'none',
  },
  pageEnabled: {
    cursor: 'pointer',
    color: '#0055b3',
  },
  pageDisabled: {
    color: 'inherit',
  },
});

const Wardrobe = props => {
  const s = useWardrobeStyles();
  const limit = getFlag('avatarPageInventoryLimit', 10);
  const characterStore = CharacterCustomizationStore.useContainer();
  const [inventory, setInventory] = useState(null);
  const [category, setCategory] = useState({ id: 2, name: 'T-Shirts' });
  const [page, setPage] = useState(1);
  const [cursor, setCursor] = useState(null);
  const [locked, setLocked] = useState(false);

  const Category = props => {
    return <span onClick={() => {
      setCursor(null);
      setPage(1);
      setCategory({
        name: props.name,
        id: props.id,
      });
    }} className={category.id === props.id ? s.selected : ''}> {props.children} {!props.last && ' | '} </span>
  }

  useEffect(() => {
    if (locked) return;
    setLocked(true);
    getInventory({
      userId: characterStore.userId,
      limit,
      cursor,
      assetTypeId: category.id
    }).then(result => {
      if (result.Data) {
        setInventory({
          nextPageCursor: result.Data.nextPageCursor,
          previousPageCursor: result.Data.previousPageCursor,
          data: result.Data.Items,
        })
      }
      console.log(result);
    }).catch(e => {
      console.error('[error] getInventory() error', e);
    }).finally(() => {
      setLocked(false);
    })
  }, [cursor, category])

  return <div className='row'>
    <div className='col-12'>
      <div className={s.categoryWrapper}>
        <p className={s.categoryEntry}>
          <Category id={17}>Heads</Category>
          <Category id={18}>Faces</Category>
          <Category id={2}>T-Shirts</Category>
          <Category id={11}>Shirts</Category>
          <Category id={12}>Pants</Category>
          <Category id={19} last={true}>Gear</Category>
        </p>
        <p className={s.categoryEntry}>
          <span>Accessories: </span>
          <Category id={8}>Hats</Category>
          <Category id={41}>Hair</Category>
          <Category id={42}>Face</Category>
          <Category id={43}>Neck</Category>
          <Category id={44}>Shoulder</Category>
          <Category id={45}>Front</Category>
          <Category id={46}>Back</Category>
          <Category id={47} last={true}>Waist</Category>
        </p>
        <p className={s.categoryEntry}>
          <Category id={27}>Torsos</Category>
          <Category id={29}>L Arms</Category>
          <Category id={28}>R Arms</Category>
          <Category id={30}>L Legs</Category>
          <Category id={31}>R Legs</Category>
          <Category id={32} last={true}>Packages</Category>
        </p>
        <p className={s.categoryEntry}>
          <a href='/catalog'>Shop</a>
          {creatableAssets.includes(category.id) && <span>| <a href='/test'>Create</a></span>}
        </p>
      </div>
    </div>
    {
      inventory && <div className='col-12'>
        <div className='row'>
          {inventory.data.map((v, i) => {
            return <WardrobeEntry key={i} assetId={v.Item.AssetId} name={v.Item.Name} assetTypeId={v.Item.AssetType} assetTypeName={assetTypes[v.Item.AssetType]}></WardrobeEntry>
          })}
        </div>
        <div className='row mt-4'>
          <div className='col-12'>
            {
              inventory && inventory.data.length === 0 && inventory.previousPageCursor === null ? <p className='text-center'>No items available</p> :
                <p className={s.paginationText}>
                  <span className={inventory.previousPageCursor === null ? s.pageDisabled : s.pageEnabled} onClick={(e) => {
                    if (inventory.previousPageCursor === null) return;
                    setCursor(inventory.previousPageCursor);
                    setPage(page - 1);
                  }}>Previous </span>
                  <span className={s.pageDisabled}> {page} </span>
                  <span className={inventory.nextPageCursor === null ? s.pageDisabled : s.pageEnabled} onClick={(e) => {
                    if (inventory.nextPageCursor === null) return;
                    setCursor(inventory.nextPageCursor);
                    setPage(page + 1);
                  }}> Next</span>
                </p>
            }
          </div>
        </div>
      </div>
    }
  </div>
}

export default Wardrobe;