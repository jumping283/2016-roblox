import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  image: {
    display: 'block',
    margin: '0 auto',
    width: '100%',
    maxWidth: '728px',
    height: 'auto',
  }
})

const AdBanner = props => {
  const s = useStyles();
  return <div className='row'>
    <div className='col-12'>
      <img className={s.image} alt='Advertisment' src='/img/Unofficial/AdBannerPlaceholder.png'></img>
    </div>
  </div>
}

export default AdBanner;