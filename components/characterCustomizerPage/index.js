import React, { useEffect } from "react";
import { createUseStyles } from "react-jss";
import MyAvatar from "../../components/characterCustomizerPage/components/avatar";
import AuthenticationStore from "../../stores/authentication";
import CharacterCustomizationStore from "../../stores/characterPage";
import AdBanner from "../ad/adBanner";
import OldVerticalTabs from "../oldVerticalTabs";
import Color from "./components/color";
import CurrentlyWearing from "./components/currentlyWearing";
import Outfits from "./components/outfits";
import Wardrobe from "./components/wardrobe";

const useCharacterPageStyles = createUseStyles({
  header: {
    fontWeight: 700,
    marginBottom: 0,
    marginTop: 0,
    fontSize: '30px',
  },
});

const CharacterPage = props => {
  const auth = AuthenticationStore.useContainer();
  const store = CharacterCustomizationStore.useContainer();
  const s = useCharacterPageStyles();

  useEffect(() => {
    store.setUserId(auth.userId);
  }, [auth.userId]);

  if (!store.userId) {
    return null;
  }
  return <div className='row mt-4'>
    <div className='col-12 col-lg-4'>
      <MyAvatar></MyAvatar>
      <Color></Color>
    </div>
    <div className='col-12 col-lg-8'>
      <div className='row'>
        <div className='col-12'>
          <OldVerticalTabs options={[
            {
              name: 'Wardrobe',
              element: <Wardrobe></Wardrobe>,
            },
            {
              name: 'Outfits',
              element: <Outfits></Outfits>,
            },
          ]}></OldVerticalTabs>
        </div>
      </div>
      <CurrentlyWearing></CurrentlyWearing>
    </div>
  </div>
}

export default CharacterPage;