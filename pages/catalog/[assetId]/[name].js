import SharedAssetPage from "../../../components/sharedAssetPage";
import {useRouter} from "next/dist/client/router";
import {useEffect, useState} from "react";

const ItemPage = props => {
  return <SharedAssetPage idParamName='assetId' />
}
export default ItemPage;