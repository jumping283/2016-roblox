import { createUseStyles } from "react-jss";
import useButtonStyles from "../../../../styles/buttonStyles";
import ActionButton from "../../../actionButton";

const useStyles = createUseStyles({

});

const GamesSubPage = props => {
  const s = useStyles();
  const buttonStyles = useButtonStyles();


  return <div className='row'>
    <div className='col-12'>
      <ActionButton className={buttonStyles.buyButton + ' w-auto ms-0'} label='Create New Game'></ActionButton>
      <h2 className='mt-2'>Games</h2>
      <p className='mt-4'>You haven't created any games.</p>
    </div>
  </div>
}

export default GamesSubPage;