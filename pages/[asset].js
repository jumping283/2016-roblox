import React, { useEffect, useState } from "react";
import CatalogDetails from "../components/catalogDetailsPage";
import CatalogDetailsPage from "../components/catalogDetailsPage/stores/catalogDetailsPage";
import CatalogDetailsPageModal from "../components/catalogDetailsPage/stores/catalogDetailsPageModal";
import GameDetails from "../components/gameDetails";
import GameDetailsStore from "../components/gameDetails/stores/gameDetailsStore";
import redirectIfNotEqual from "../lib/redirectIfNotEqual";
import { getItemDetails, getProductInfoLegacy, itemNameToEncodedName } from "../services/catalog";
import { getGameUrl } from "../services/games";

const getUrlForAssetType = ({ assetTypeId, assetId, name }) => {
  if (assetTypeId === 9) {
    // Place
    return getGameUrl({
      placeId: assetId,
      name,
    });
  }
  // Anything else
  return `/${itemNameToEncodedName(name)}-item?id=${assetId}`;
}

const AssetPage = props => {
  // TODO: all this asset details crap needs to be done in getInitialProps()
  // The only reason it's not in there now is because I don't have a solution to the server-side CSRF issue yet
  const { assetId, name } = props;
  /**
   * @type {[AssetDetailsEntry, import('react').Dispatch<AssetDetailsEntry>]}
   */
  const [details, setDetails] = useState(null);
  useEffect(() => {
    if (!assetId) return
    getItemDetails([assetId]).then(result => {
      const newDetails = result.data.data[0];
      if (newDetails === undefined) {
        throw new Error('NotFound');
      }
      setDetails(newDetails);
    }).catch(e => {
      console.error(e)
    })
  }, [assetId]);
  useEffect(() => {
    if (!details) return;
    if (redirectIfNotEqual(getUrlForAssetType({
      assetId: details.id,
      name: details.name,
      assetTypeId: details.assetType,
    }))) {
      return;
    }
  }, [details]);

  if (!details) return null;
  if (!assetId) return null;

  if (details.assetType === 9) {
    // Place
    return <GameDetailsStore.Provider>
      <GameDetails details={details}></GameDetails>
    </GameDetailsStore.Provider>;
  }
  // Anything else (e.g. hat, shirt, model)
  return <CatalogDetailsPage.Provider>
    <CatalogDetailsPageModal.Provider>
      <CatalogDetails details={details}></CatalogDetails>
    </CatalogDetailsPageModal.Provider>
  </CatalogDetailsPage.Provider>;
}

export async function getServerSideProps({ query, res, req }) {
  const assetId = query['id'];
  const name = query['asset'];
  if (!assetId || !name) {
    return {
      notFound: true,
    }
  }
  let info;
  try {
    info = await getProductInfoLegacy(assetId);

    const expectedUrl = getUrlForAssetType({
      assetId: info.AssetId,
      name: info.Name,
      assetTypeId: info.AssetTypeId,
    });
    if (req.url !== expectedUrl) {
      res.writeHead(302, 'Moved Temporarily', {
        location: expectedUrl,
      });
      res.write(`Object moved to <a href="${expectedUrl}">here</a>.`);
      res.end();
      return {
        props: {}
      };
    }
  } catch (e) {
    console.error('[error]', e);
    return {
      notFound: true,
    }
  }
  return {
    props: {
      assetId,
      name,
      title: info.Name + ' - ROBLOX'
    },
  };
}


export default AssetPage;