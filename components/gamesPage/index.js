import React, {useEffect} from "react";
import { createUseStyles } from "react-jss";
import getFlag from "../../lib/getFlag";
import AuthenticationStore from "../../stores/authentication";
import GamesPageStore from "../../stores/gamesPage";
import AdBanner from "../ad/adBanner";
import Selector from "../selector";
import GameRow, {useStyles as useGameRowStyles} from "./components/gameRow";
import {useRouter} from "next/dist/client/router";
import SmallGameCard from "../smallGameCard";

const useStyles = createUseStyles({
  authContainer: {
    '@media(min-width: 1300px)': {
      marginLeft: '180px',
    }
  },
  selectorSort: {
    width: '200px',
    float: 'left',
  },
  gamesContainer: {
    backgroundColor: '#e3e3e3',
    paddingTop: '8px',
    marginLeft: '15px',
    marginRight: '15px',
  },
})

const Games = props => {
  const router = useRouter();
  const store = GamesPageStore.useContainer();
  const auth = AuthenticationStore.useContainer();
  const s = useStyles();
  const gameS = useGameRowStyles();
  let existingGames = {}
  const showGenre = getFlag('gameGenreFilterSupported', false) && !store.infiniteGamesGrid;
  const showSortDropdown = getFlag('gameCustomSortDropdown', false) && !store.infiniteGamesGrid;

  useEffect(() => {
    if (router.query.keyword)
      store.setQuery(router.query.keyword);

  }, [router.query]);

  // if (!store.sorts || !store.games || !store.icons) return null;
  return <div className={'row ' + (auth.isAuthenticated ? s.authContainer : '')}>
    <div className='col-12'>
      <AdBanner context='gamesPage'/>
    </div>
    <div className='col-12 ps-0 pb-0'>
      <div className={'row pb-2 ' + s.gamesContainer}>
        <div className='col-12'>
          {showSortDropdown &&
            <div className={s.selectorSort}>
              <Selector
                onChange={(newValue) => {
                  // TODO
                  console.log('[info] use sort', newValue);
                }}
                options={[
                  {
                    name: 'Default',
                    value: 'default',
                  },
                  {
                    name: 'Popular',
                    value: 'popular',
                  },
                  {
                    name: 'Top Earning',
                    value: 'top-earning',
                  },
                  {
                    name: 'Top Rated',
                    value: 'top-rated',
                  },
                  {
                    name: 'Recommended',
                    value: 'recommended',
                  },
                  {
                    name: 'Top Favorite',
                    value: 'top-favorite',
                  },
                  {
                    name: 'Top Paid',
                    value: 'top-paid',
                  },
                  {
                    name: 'Builders Club',
                    value: 'builders-club',
                  },
                ]}/>
            </div>
          }
          {showGenre &&
            <div className={s.selectorSort + ' ms-2'}>
              <Selector
                onChange={(newValue) => {
                  // TODO
                  console.log('[info] use genre', newValue);
                  store.setGenreFilter(newValue.value);
                }}
                options={store.selectorSorts}/>
            </div>
          }
        </div>
        <div className='col-12'>
          <div className='row'>
            {
              store.infiniteGamesGrid ? <>
              {
                store.infiniteGamesGrid.games.map(v => {
                  return <SmallGameCard
                    key={v.universeId}
                    className={gameS.gameCard + ' mb-3'}
                    placeId={v.placeId}
                    creatorId={v.creatorId}
                    creatorType={v.creatorType}
                    creatorName={v.creatorName}
                    iconUrl={store.icons[v.universeId]}
                    likes={v.totalUpVotes}
                    dislikes={v.totalDownVotes}
                    name={v.name}
                    playerCount={v.playerCount}
                  />
                })
              }
              </> : store.sorts ? store.sorts.map(v => {
                  if (existingGames[v.token]) {
                    return null;
                  }
                  existingGames[v.token] = true;
                  let games = store.games && store.games[v.token] || null;
                  return <GameRow ads={true} key={'row ' + v.token} title={v.displayName} games={games} icons={store.icons}/>
                }) : null
            }
          </div>
        </div>
      </div>
    </div>
  </div>
}

export default Games;