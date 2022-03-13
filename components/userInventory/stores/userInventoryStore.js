import { useState } from "react";
import { createContainer } from "unstated-next";
import {getUserInfo} from "../../../services/users";
import {getInventory} from "../../../services/inventory";

const UserInventoryStore = createContainer(() => {
  const limit = 12;
  const [userId, setUserId] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [category, setCategory] = useState({name: 'Hats',
   value: 'Hat'});
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const requestInventory = (userId, category, cursor) => {
    getInventory({userId, limit, cursor, assetTypeId: category}).then(data => {
      setData(data.Data);
    }).catch(e => {
      setError(e);
    })
  }

  return {
    userId,
    setUserId: (id) => {
      setUserId(id);
      setUserInfo(null);
      if (!id) return;
      getUserInfo({userId: id}).then(data => setUserInfo(data));
      requestInventory(id, category.value, '');
    },

    userInfo,
    setUserInfo,

    error,
    setError,

    data,
    limit,

    category,
    setCategory: (newCategory) => {
      setCategory(newCategory);
      setData(null);
      requestInventory(userId, newCategory.value, '');
    },

    loadNextPage: () => {
      requestInventory(userId, category.value, data.nextPageCursor);
    },
    loadPreviousPage: () => {
      requestInventory(userId, category.value, data.previousPageCursor);
    },
    nextPageAvailable: () => {
      return data && data.nextPageCursor !== null;
    },
    previousPageAvailable: () => {
      return data && data.previousPageCursor !== null;
    }
  };
});

export default UserInventoryStore;