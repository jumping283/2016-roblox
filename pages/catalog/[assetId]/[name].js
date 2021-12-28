const Redirect = props => {
  window.location.href = '/catalog'
  return null;
}


export async function getServerSideProps({ query, res, req }) {
  const assetId = query['assetId'];

  return {
    redirect: {
      destination: '/unnamed-item?id=' + assetId
    },
    props: {}
  };

}


export default Redirect;