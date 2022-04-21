import UserAdvertisement from "../userAdvertisement";
import {createUseStyles} from "react-jss";

const useStyles = createUseStyles({
  forumColumn: {
    minWidth: '800px',
  }
});

const ForumContainer = props => {
  const s = useStyles();
  return <div className='container'>
    <div className={'col-10 ' + s.forumColumn}>
      <UserAdvertisement type={1} />
      <div className='mt-4'>
        <div className='bg-white pt-2 pb-2'>
          {props.children}
        </div>
      </div>
    </div>
    <div className='col-2'>
      <UserAdvertisement type={2} />
    </div>
  </div>
}

export default ForumContainer;