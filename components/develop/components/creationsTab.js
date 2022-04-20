import React from "react";
import VerticalSelector from "../../verticalSelector";
import { developerPages } from "../constants";
import GamesSubPage from "./subPages/games";

const CreationsTab = props => {
  const selected = developerPages.find(v => v.id === props.id) || developerPages[0];
  if (!selected)
    return null;

  return <div className='row'>
    <div className='col-2'>
      <VerticalSelector selected={selected.name} options={developerPages.map(v => {
        return {
          name: v.name,
          url: v.url,
          disabled: v.disabled,
        }
      })} />
    </div>
    <div className='col-8 mt-4'>
      {selected.element()}
    </div>
  </div>
}

export default CreationsTab;