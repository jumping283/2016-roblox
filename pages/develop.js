import Develop from "../components/develop";

const DevelopPage = props => {
  return <Develop></Develop>
}

export default DevelopPage;

export const getStaticProps = () => {
  return {
    props: {
      title: 'Develop - ROBLOX',
    },
  }
}