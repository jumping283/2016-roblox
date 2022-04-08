import React, { useEffect, useState } from "react";
import CatalogDetails from "../components/catalogDetailsPage";
import CatalogDetailsPage from "../components/catalogDetailsPage/stores/catalogDetailsPage";
import CatalogDetailsPageModal from "../components/catalogDetailsPage/stores/catalogDetailsPageModal";
import GameDetails from "../components/gameDetails";
import GameDetailsStore from "../components/gameDetails/stores/gameDetailsStore";
import getFlag from "../lib/getFlag";
import { logger } from "../lib/logger";
import redirectIfNotEqual from "../lib/redirectIfNotEqual";
import { getItemDetails, getProductInfoLegacy, itemNameToEncodedName } from "../services/catalog";
import { getGameUrl, multiGetPlaceDetails, multiGetUniverseDetails } from "../services/games";

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
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!assetId) return;

    getItemDetails([assetId]).then(result => {
      const newDetails = result.data.data[0];
      if (newDetails === undefined) {
        throw new Error('NotFound');
      }
      setDetails(newDetails);
    }).catch(e => {
      if (e.response && e.response.status === 406) {
        const isBadAssetType = e.response.data.errors.find(v => v.code === 11);
        if (isBadAssetType) {
          // Get from place details endpoint
          multiGetPlaceDetails({placeIds: [assetId]}).then(resp => {
            const place = resp[0];
            return multiGetUniverseDetails({universeIds: [place.universeId]}).then(data => {
              const uni = data[0];
              setDetails({
                name: uni.name,
                description: uni.description,
                creatorTargetId: uni.creator.id,
                creatorType: uni.creator.type,
                creatorName: uni.creator.name,
                assetType: 9,
                id: assetId,
                createdAt: uni.created,
                updatedAt: uni.updated,
                genres: [uni.genre],
                favoriteCount: uni.favoritedCount,
                isForSale: uni.price !== null,
                price: uni.price,
                itemRestrictions: [],
                productId: assetId,
                itemType: 'Asset',
                lowestSellerData: null,
                offsaleDeadline: null,
                currency: 1,
              })
            })
          }).catch(e => {
            console.error('could not get place details',e);
            setError(e);
          });
          return;
        }
      }
      console.error(e)
      setError(e);
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
    // Redirection seems to break every few nextjs updates but I can't figure out why.
    if (getFlag('assetRedirectsEnabled', true)) {
      const expectedUrl = getUrlForAssetType({
        assetId: info.AssetId,
        name: info.Name,
        assetTypeId: info.AssetTypeId,
      });
      if (req.url !== expectedUrl) {
        logger.info('redirects', 'asset redirect from', req.url, 'to', expectedUrl);
        return {
          redirect: {
            destination: expectedUrl,
          },
          props: {},
        };
      }
    }
  } catch (e) {
    if (e.response && (e.response.status === 404 || e.response.status === 400)) {
      return {
        notFound: true,
      }
    }
    // todo: we need a better error handling mechanism...
    throw e;
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