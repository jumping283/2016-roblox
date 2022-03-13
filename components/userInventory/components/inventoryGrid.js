import userInventoryStore from "../stores/userInventoryStore";
import {createUseStyles} from "react-jss";
import InventoryItemEntry from "./inventoryItemEntry";
import Paging from "./paging";

const useStyles = createUseStyles({
  categoryValue: {
    fontWeight: 300,
    fontSize: '24px',
  },
  showingLabel: {
    fontWeight: 400,
    color: '#757575',
  },
})

const InventoryGrid = props => {
  const s = useStyles();
  const store = userInventoryStore.useContainer();
  const myPage = store.data ? store.data.Page : null;
  // TODO: is it "Totalitems" or "TotalItems"?

  return <div className='col-12 col-lg-10'>
    <div className='row'>
      <div className='col-12 pe-1 ps-1'>
        <h2 className={s.categoryValue}>{store.category.name.toUpperCase()}</h2>
        <p className={s.showingLabel}>{myPage ? `Showing ${myPage} to ${store.data.Items.length} of ${store.data.TotalItems || store.data.Totalitems}` : null}</p>
      </div>
      <div className='col-12'>
        <div className='row'>
          {store.data ? store.data.Items.map(v => {
              const isLimited = v.AssetRestrictionIcon.CssTag === 'limited';
              const isLimitedUnique = v.AssetRestrictionIcon.CssTag === 'limited-unique';
              const serialNumber = v.Product.SerialNumber;
              return <InventoryItemEntry key={v.Item.AssetId + ' ' + serialNumber} id={v.Item.AssetId} name={v.Item.Name} creatorId={v.Creator.Id} creatorType={v.Creator.Type} creatorName={v.Creator.Name} isLimited={isLimited} isLimitedUnique={isLimitedUnique} serialNumber={serialNumber} />
            })
            : null}
        </div>
        <Paging />
      </div>
    </div>
  </div>
}

export default InventoryGrid;