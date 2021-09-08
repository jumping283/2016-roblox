const Redirect = props => {
  window.location.href = '/catalog'
  return null;
}


export async function getServerSideProps({ query, res, req }) {
  const assetId = query['assetId'];

  res.writeHead(302, 'Moved Temporarily', {
    location: '/unnamed-item?id=' + assetId,
  });
  res.end();
  return {
    props: {}
  };

}


export default Redirect;