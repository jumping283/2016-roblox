import React, { useState } from "react";
import { createUseStyles } from "react-jss";
import AuthenticationStore from "../../../stores/authentication";
import ActionButton from "../../actionButton";
import CatalogDetailsPage from "../stores/catalogDetailsPage";
import CatalogDetailsPageModal from "../stores/catalogDetailsPageModal";
import BuyItemModal from "./buyItemModal";
import Robux from "./robux";

const useBestPriceStyles = createUseStyles({
  text: {
    fontSize: '14px',
    marginBottom: '4px',
    textAlign: 'center',
    marginTop: '4px',
  },
  noSellers: {
    textAlign: 'center',
    marginTop: '30px',
    marginBottom: '30px',
  },
});

const BestPriceEntry = props => {
  const s = useBestPriceStyles();
  const store = CatalogDetailsPage.useContainer();
  const lowestSeller = store.getPurchaseDetails();
  if (!lowestSeller) {
    return <p className={s.noSellers}> No one is currently selling this item. </p>
  }
  const lowestPrice = lowestSeller.price;
  return <p className={s.text}>
    <Robux prefix="Best Price: ">{lowestPrice}</Robux>
  </p>
}

const useBuyButtonStyles = createUseStyles({
  wrapper: {
    width: '100%',
    border: '1px solid #a7a7a7',
    background: '#e1e1e1',
  }
});

const PrivateSellersCount = props => {
  const store = CatalogDetailsPage.useContainer();
  return <p className='mt-0 mb-0 text-center'>
    <a className='a'>See all private sellers ({store.resellersCount || 0})</a>
  </p>
}

const useSaleCountStyles = createUseStyles({
  text: {
    color: '#666',
    fontSize: '12px',
  }
})

const SaleCount = props => {
  const store = CatalogDetailsPage.useContainer();
  const s = useSaleCountStyles();
  return <p className={'mt-2 mb-2 text-center ' + s.text}>
    ( <span className='text-black'>{store.saleCount}</span> Sold)
  </p>
}

const OwnedCount = props => {
  const store = CatalogDetailsPage.useContainer();
  const s = useSaleCountStyles();
  if (!store.ownedCopies || store.ownedCopies.length === 0) return null;
  return <p className={'mt-2 mb-0 text-center ' + s.text}>
    ( <span className='text-black'>{store.ownedCopies.length}</span> Owned)
  </p>
}

const BuyAction = props => {
  const store = CatalogDetailsPage.useContainer();
  const authenticationStore = AuthenticationStore.useContainer();
  const modalStore = CatalogDetailsPageModal.useContainer();
  const productInfo = store.getPurchaseDetails();
  const auth = AuthenticationStore.useContainer();

  if (store.ownedCopies === null) return null;
  const isOwned = store.ownedCopies.length !== 0;
  const showPriceText = store.details.isForSale;
  const isDisabled = !store.isResellable && !store.details.isForSale ||
    (isOwned && !store.isResellable) ||
    (store.isResellable && !productInfo ||
      store.isResellable && productInfo.sellerId === authenticationStore.userId
    );
  const isFree = !isDisabled && store.details.price === 0;

  const tooltipTitle = isOwned ? 'You already own this item.' : 'This item is not for sale';
  const actionBuyText = isOwned ? 'Buy with R$' : !isDisabled ? (isFree ? 'Take One' : 'Buy with R$') : 'Buy Now';

  if (store.isResellable) {
    if (!store.allResellers || store.allResellers.length === 0) {
      return null;
    }
  }

  return <div>
    {showPriceText &&
      <p className='mb-1 text-center'>
        <Robux prefix="Price: ">{isFree ? 'FREE' : store.details.price}</Robux>
      </p>
    }
    <ActionButton onClick={(e) => {
      modalStore.openPurchaseModal(store.getPurchaseDetails(), auth.robux, auth.tix);
    }} label={actionBuyText} disabled={isDisabled} tooltipText={tooltipTitle}></ActionButton>
  </div>
}

/**
 * The purchase button
 * @param {*} props 
 */
const BuyButton = props => {
  const s = useBuyButtonStyles();
  const store = CatalogDetailsPage.useContainer();
  const showBuyButton = true;
  const isResellAsset = store.isResellable;
  return <div className={s.wrapper}>
    <div>
      {isResellAsset && <BestPriceEntry details={store.details}></BestPriceEntry>}
    </div>
    <div>
      {!isResellAsset && <div className='mt-2'></div>}
      {showBuyButton && <BuyAction></BuyAction>}
    </div>
    <div>
      {isResellAsset && <PrivateSellersCount details={store.details}></PrivateSellersCount>}
    </div>
    <div>
      {isResellAsset && <OwnedCount></OwnedCount>}
    </div>
    <div>
      <SaleCount></SaleCount>
    </div>
  </div >
}

export default BuyButton;