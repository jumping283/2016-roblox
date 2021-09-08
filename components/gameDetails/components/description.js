import GameDetailsStore from "../stores/gameDetailsStore";

const Description = props => {
  const store = GameDetailsStore.useContainer();
  return <div className='row'>
    <div className='col-12'>
      <p className='mb-0 mt-4'>{store.details.description?.trim() || 'No description available'}</p>
    </div>
  </div>
}

export default Description;