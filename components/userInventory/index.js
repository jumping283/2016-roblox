import UserInventoryStore from "./stores/userInventoryStore";
import Container from './components/container';
import Theme2016 from "../theme2016";

const UserInventory = props => {
  const {userId} = props;
  return <Theme2016>
    <UserInventoryStore.Provider>
      <Container userId={userId}/>
    </UserInventoryStore.Provider>
  </Theme2016>
}

export default UserInventory;