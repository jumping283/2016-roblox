import { useRouter } from "next/dist/client/router";

const UserPage = props => {
  return null;
}


export async function getServerSideProps({ query, res, req }) {
  const userId = query['ID'];
  res.writeHead(302, 'Moved Temporarily', {
    location: `/users/${userId}/profile`,
  });
  res.end();
  return {
    props: {}
  };
}


export default UserPage;