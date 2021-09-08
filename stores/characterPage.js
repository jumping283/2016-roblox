import { useEffect, useState } from "react";
import { createContainer } from "unstated-next";
import { getAvatar, getMyAvatar, getRules, redrawMyAvatar, setColors as setColorsRequest, setWearingAssets as setWearingAssetsRequest } from "../services/avatar";
import { multiGetUserThumbnails } from "../services/thumbnails";

const CharacterCustomizationStore = createContainer(() => {
  const [rules, setRules] = useState(null);
  const [wearingAssets, setWearingAssets] = useState(null);
  const [colors, setColors] = useState(null);
  const [isRendering, setIsRendering] = useState(false);
  const [userId, setUserId] = useState(null);
  const [changes, setChanges] = useState(0);
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    if (!userId) return;
    getMyAvatar().then(result => {
      setWearingAssets(result.assets.map(v => {
        return {
          assetId: v.id,
          name: v.name,
          assetType: v.assetType,
        }
      }));
      setColors(result.bodyColors);
      console.log(result);
    })
  }, [userId]);

  useEffect(() => {
    setChanges(changes + 1);
    if (changes <= 2) return;
    console.log('change count', changes);
    setIsModified(true);
  }, [wearingAssets, colors]);

  useEffect(() => {
    if (!isRendering) return;
    setIsModified(false);
    const timer = setInterval(() => {
      multiGetUserThumbnails({
        userIds: [userId],
      }).then(result => {
        const user = result[0];
        if (user.state === 'Completed' && typeof user.imageUrl === 'string') {
          setIsRendering(false);
          clearInterval(timer);
        }
      });
    }, 2500);

    return () => {
      clearInterval(timer);
    }
  }, [isRendering]);

  const requestRender = (force = false) => {
    setColorsRequest(colors).then(() => {
      setWearingAssetsRequest({ assetIds: wearingAssets.map(v => v.assetId) }).then(() => {
        if (force) {
          redrawMyAvatar().then(() => {
            setIsRendering(true);
          }).catch(e => {

          });
        } else {
          setIsRendering(true);
        }
      })
    })
  }

  useEffect(() => {
    getRules().then(res => {
      setRules(res);
    })
  }, []);

  return {
    rules,
    setRules,

    userId,
    setUserId,

    wearingAssets,
    setWearingAssets,

    colors,
    setColors,

    isRendering,
    setIsRendering,

    isModified,
    setIsModified,

    requestRender,
  }
});

export default CharacterCustomizationStore;