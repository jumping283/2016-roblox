import { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { getUserGames } from "../../../../services/games";
import AuthenticationStore from "../../../../stores/authentication";
import useButtonStyles from "../../../../styles/buttonStyles";
import ActionButton from "../../../actionButton";
import AssetList from "../assetList";

const useStyles = createUseStyles({

});

const GamesSubPage = props => {
  const s = useStyles();
  const buttonStyles = useButtonStyles();
  const [games, setGames] = useState(null);
  const auth = AuthenticationStore.useContainer();
  useEffect(() => {
    if (!auth.userId) return;
    getUserGames({
      userId: auth.userId,
      cursor: '',
    }).then(data => setGames(data));
  }, [auth.userId]);

  return <div className='row'>
    <div className='col-12'>
      <ActionButton className={buttonStyles.buyButton + ' w-auto ms-0'} label='Create New Game'></ActionButton>
      <h2 className='mt-2'>Games</h2>
      {
        games ? (games.length === 0 ? <p className='mt-4'>You haven't created any games.</p> : <AssetList assets={games.data.map(v => {
          return {
            assetId: v.rootPlace.id,
            assetType: 9,
            name: v.name,
            universeId: v.id,

            // todo:
            isPublic: true,

          }
        })}></AssetList>) : null
      }
    </div>
  </div>
}

export default GamesSubPage;