import { useRouter } from "next/router";
import UserInventory from "../../../components/userInventory";

const UserInventoryPage = props => {
  const router = useRouter();
  const userId = router.query['userId'];
  return <UserInventory userId={userId}/>
}

export default UserInventoryPage;