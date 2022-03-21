import {createUseStyles} from "react-jss";
import assetTypes from "../../characterCustomizerPage/assetTypes";
import configureItemStore from "../stores/configureItemStore";
import {itemNameToEncodedName} from "../../../services/catalog";

const useStyles = createUseStyles({
  header: {
    fontSize: '32px',
    fontWeight: 700,
    marginLeft: '8px',
  },
});

const ConfigureHeader = props => {
  const s = useStyles();
  const store = configureItemStore.useContainer();

  return <>
    <h1 className={s.header}>Configure {assetTypes[store.details.assetType]}</h1>
    <p><a href={`/${itemNameToEncodedName(store.details.name)}-item?id=${store.assetId}`}>Back</a></p>
  </>
}

export default ConfigureHeader;