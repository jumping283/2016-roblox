import searchUsersStore from "../stores/searchUsersStore";
import {useEffect} from "react";
import InputRow from "./inputRow";
import UsersRow from "./usersRow";

const Container = props => {
  const store = searchUsersStore.useContainer();
  useEffect(() => {
    store.setKeyword(props.keyword);
    store.setData(null);
  }, [props]);

  return <div className='row'>
    <div className='col-12'>
      <InputRow />
      <UsersRow />
    </div>
  </div>
}

export default Container;