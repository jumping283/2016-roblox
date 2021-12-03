import React from "react";
import { createUseStyles } from "react-jss";
import getFlag from "../../lib/getFlag";
import AuthenticationStore from "../../stores/authentication";
import GamesPageStore from "../../stores/gamesPage";
import AdBanner from "../ad/adBanner";
import Selector from "../selector";
import GameRow from "./components/gameRow";

const useStyles = createUseStyles({
  container: {
    '@media(min-width: 1300px)': {
      marginLeft: '180px',
    }
  },
  selectorSort: {
    width: '200px',
    float: 'left',
  },
  gamesContainer: {
    backgroundColor: '#f2f2f2',
    paddingTop: '8px',
  }
})

const Games = props => {
  const store = GamesPageStore.useContainer();
  const auth = AuthenticationStore.useContainer();
  const s = useStyles();
  let existingGames = {}
  const showGenre = getFlag('gameGenreFilterSupported', false);
  const showSortDropdown = getFlag('gameCustomSortDropdown', false);

  if (!store.sorts || !store.games || !store.icons) return null;
  return <div className={'row ' + (auth.isAuthenticated ? s.container : '')}>
    <div className='col-12'>
      <AdBanner context='gamesPage'></AdBanner>
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
                ]}></Selector>
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
                options={store.selectorSorts}></Selector>
            </div>
          }
        </div>
        <div className='col-12'>
          <div className='row'>
            {store.sorts.map(v => {
              if (existingGames[v.token]) {
                return null;
              }
              existingGames[v.token] = true;
              let games = store.games && store.games[v.token] || null;
              return <GameRow key={'row ' + v.token} title={v.displayName} games={games} icons={store.icons}></GameRow>
            })}
          </div>
        </div>
      </div>
    </div>
  </div>
}

export default Games;