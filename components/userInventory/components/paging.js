import UserInventoryStore from "../stores/userInventoryStore";
import {createUseStyles} from "react-jss";

const useStyles = createUseStyles({
  buttonWrapper: {
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'center',
    maxWidth: '300px',
  },
  buttonPaginate: {
    color: '#1a1a1a',
    background: '#fff',
    border: '1px solid #dbdbdb',
    padding: '0px 12px',
    fontSize: '24px',
    fontWeight: 600,
    borderRadius: '4px',
    marginBottom: 0,
    height: '34px',
    cursor: 'pointer',
  },
  textCurrentPage: {
    margin: '8px 16px 0 16px',
    fontWeight: '300',
  },
  buttonPaginateDisabled: {
    color: '#c3c3c3',
    cursor: 'default',
  },
});

const Paging = props => {
  const store = UserInventoryStore.useContainer();
  const s = useStyles();
  if (!store.data) return null;
  const totalDisplay = store.data.TotalItems ? ('of '+ Math.ceil((store.data.TotalItems) / store.limit)) : (store.nextPageAvailable() ? 'of many' : null);

  return <div className='row'>
    <div className='col-12'>
      <div className={s.buttonWrapper}>
        <div className={s.buttonPaginate + ' ' + (!store.previousPageAvailable() ? s.buttonPaginateDisabled : '')} onClick={() => {
          if (store.previousPageAvailable())
            store.loadPreviousPage();
        }}>
          <p>{'<'}</p>
        </div>
        <p className={s.textCurrentPage}>Page {store.data.Page} {totalDisplay}</p>
        <div className={s.buttonPaginate + ' ' + (!store.nextPageAvailable() ? s.buttonPaginateDisabled : '')} onClick={() => {
          if (store.nextPageAvailable())
            store.loadNextPage();
        }}>
          <p>{'>'}</p>
        </div>
      </div>
    </div>
  </div>
}

export default Paging;