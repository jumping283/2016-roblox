import {createContainer} from "unstated-next";
import {useReducer, useRef, useState} from "react";
import {multiGetAssetThumbnails, multiGetUserThumbnails} from "../services/thumbnails";

const getKey = (id, type, size) => {
  return type + '_' + id + '_' + size;
}

const thumbnailReducer = (prev, action) => {
  let newData = {...prev};
  if (action.event === 'MULTI_ADD') {
    for (const item of action.thumbnails) {
      newData[getKey(item.targetId, action.type, action.size)] = item.imageUrl;
    }
  }

  return newData;
}

const ThumbnailStore = createContainer(() => {
  const [thumbnails, dispatchThumbnails] = useReducer(thumbnailReducer, {});

  const pendingState = useRef({
    pending: false,
    pendingCount: 0,
    pendingTimer: 0,
    pendingItems: [],
  });

  const doWithRetry = (cb) => {
    (async () => {
      while (true) {
        try {
          await cb();
          return;
        }catch(e) {
          if (e.response && e.response.status === 400)
            return;

          await new Promise((res) => setTimeout(res, 1000));
        }
      }
    })();
  }

  const fetchThumbnails = () => {
    const copy = pendingState.current;
    pendingState.current = {
      pending: false,
      pendingCount: 0,
      pendingTimer: 0,
      pendingItems: copy.pendingItems,
    };
    const assets = copy['asset'];
    if (assets && assets.length) {
      for (const t of assets) {
        pendingState.current.pendingItems.push(getKey(t.id, 'asset', '420x420'));
      }
      doWithRetry(async () => {
        const data = await multiGetAssetThumbnails({
          assetIds: assets.map(v => v.id),
        });
        dispatchThumbnails({
            event: 'MULTI_ADD',
            type: 'asset',
            size: '420x420',
            thumbnails: data,
        });
        for (const item of data) {
          pendingState.current.pendingItems = pendingState.current.pendingItems.filter(v => v !== getKey(item.targetId, 'asset', '420x420'));
        }
      })
    }
    const userThumbs = copy['userThumbnail'];
    if (userThumbs && userThumbs.length) {
      for (const t of userThumbs) {
        pendingState.current.pendingItems.push(getKey(t.id, 'userThumbnail', '420x420'));
      }
      doWithRetry(async () => {
        const data = await multiGetUserThumbnails({
          userIds: userThumbs.map(v => v.id),
          size: '420x420',
          format: 'png',
        });
        dispatchThumbnails({
          event: 'MULTI_ADD',
          type: 'userThumbnail',
          size: '420x420',
          thumbnails: data,
        });
        for (const item of data) {
          pendingState.current.pendingItems = pendingState.current.pendingItems.filter(v => {
            return v !== getKey(item.targetId, 'userThumbnail', '420x420');
          });
        }
      })
    }
  }
  const requestThumbnail = (id, type, size) => {
    if (!pendingState.current[type]) {
      pendingState.current[type] = []
    }
    let exists = pendingState.current[type].find(v => v.id === id);
    if (exists)
      return;

    if (pendingState.current.pendingItems.includes(getKey(id, type, size)))
      return;

    pendingState.current[type].push({
      id: id,
      size: size,
    });
    pendingState.current.pendingCount++;
    if (!pendingState.current.pending) {
      pendingState.current.pending = true;
      pendingState.current.pendingTimer = setTimeout(() => {
        fetchThumbnails();
      }, 10);
    }
  }


  return {
    thumbnails,

    getUserThumbnail: (userId, size = '420x420') => {
      if (!['420x420'].includes(size)) {
        throw new Error('Invalid size');
      }
      if (!Number.isSafeInteger(userId))
        throw new Error('Invalid userId');

      const t = thumbnails[getKey(userId, 'userThumbnail', size)];
      if (t === undefined) {
        requestThumbnail(userId, 'userThumbnail', size);
        return '/img/placeholder.png';
      }
      return t;
    },
    getAssetThumbnail: (assetId, size = '420x420') => {
      if (!['420x420'].includes(size)) {
        throw new Error('Invalid size');
      }
      if (!Number.isSafeInteger(assetId))
        throw new Error('Invalid assetId');

      const t = thumbnails[getKey(assetId, 'asset', size)];
      if (t === undefined) {
        requestThumbnail(assetId, 'asset', size);
        return '/img/placeholder.png';
      }
      return t;
    }
  }
});

export default ThumbnailStore;