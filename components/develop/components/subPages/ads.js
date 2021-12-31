import React, { useEffect, useRef, useState } from "react";
import { createUseStyles } from "react-jss";
import { getAds } from "../../../../services/ads";
import AuthenticationStore from "../../../../stores/authentication";
import AssetList from "../assetList";

const Clothing = props => {
  const [ads, setAds] = useState(null);
  const auth = AuthenticationStore.useContainer();
  useEffect(() => {
    if (!auth.userId) return;
    getAds({
      creatorId: auth.userId,
    }).then(d => {
      setAds(d);
    })
  }, [auth.userId]);

  if (!ads) return null;
  return <div className='row'>
    <div className='col-12'>
      <h2>User Ads</h2>
    </div>
    <div className='col-12 mt-4'>
      {
        ads.data.length === 0 ? <p>You haven't created any User Ads.</p> : <AssetList assets={ads.data}></AssetList>
      }
    </div>
  </div>
}

export default Clothing;