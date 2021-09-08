import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  image: {
    display: 'block',
    margin: '0 auto',
    width: '100%',
    maxWidth: '160px',
    height: 'auto',
  }
})

const AdSkyscraper = props => {
  const s = useStyles();
  return <div className='row'>
    <div className='col-12'>
      <img className={s.image} alt='Advertisment' src='/img/Unofficial/AdSkyscraperPlaceholder.png'></img>
    </div>
  </div>
}

export default AdSkyscraper;