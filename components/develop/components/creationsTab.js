import React from "react";
import VerticalSelector from "../../verticalSelector";
import { developerPages } from "../constants";
import GamesSubPage from "./subPages/games";

const CreationsTab = props => {
  return <div className='row'>
    <div className='col-2'>
      <VerticalSelector selected='Games' options={developerPages.map(v => {
        return {
          name: v.name,
          url: v.url,
          disabled: v.disabled,
        }
      })}></VerticalSelector>
    </div>
    <div className='col-8 mt-4'>
      <GamesSubPage></GamesSubPage>
    </div>
  </div>
}

export default CreationsTab;