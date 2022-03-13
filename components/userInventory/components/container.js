import { useEffect } from "react";
import UserInventoryStore from "../stores/userInventoryStore"
import {createUseStyles} from "react-jss";
import CategorySelection from "./categorySelection";
import InventoryGrid from "./inventoryGrid";
import Paging from "./paging";

const useStyles = createUseStyles({
  title: {
    fontSize: '48px',
    fontWeight: 300,
    color: 'rgb(25,25,25)',
  }
})

const Container = props => {
  const store = UserInventoryStore.useContainer();
  const s = useStyles();
  useEffect(() => {
    store.setUserId(props.userId);
  }, [props]);
  return <div className='container'>
    <div className='row'>
      <div className='col-12'>
        <h1 className={s.title}>{store.userInfo?.name}'s Inventory</h1>
      </div>
      <CategorySelection />
      <InventoryGrid />
    </div>
  </div>
}

export default Container;