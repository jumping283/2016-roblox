import React, { useEffect, useRef, useState } from "react";
import { createUseStyles } from "react-jss";
import { getBaseUrl, getFullUrl } from "../../../../lib/request";
import { getCreatedItems, uploadAsset } from "../../../../services/develop";
import AuthenticationStore from "../../../../stores/authentication";
import ActionButton from "../../../actionButton";
import AssetList from "../assetList";

const detailsMap = {
  2: {
    name: 'T-Shirt',
    namePlural: 'T-Shirts',
    title: 'a T-Shirt',
    templateUrl: '',
  },
  11: {
    name: 'Shirt',
    namePlural: 'Shirts',
    title: 'a Shirt',
    templateUrl: `${getFullUrl('rbxcdn', `/static/images/Template-Shirts-R15_07262019.png`)}`,
  },
  12: {
    name: 'Pants',
    namePlural: 'pants',
    title: 'Pants',
    templateUrl: `${getFullUrl('rbxcdn', `/static/images/Template-Shirts-R15_07262019.png`)}`,
  },
}

const useStyles = createUseStyles({
  subtext: {
    color: '#d2d2d2',
    fontSize: '14px',
    marginLeft: '8px',
  },
  inputItemName: {
    width: 'calc(100% - 200px)',
    marginLeft: '28px',
  },
})

const Clothing = props => {
  const { id } = props;
  const details = detailsMap[id];

  const auth = AuthenticationStore.useContainer();

  const [feedback, setFeedback] = useState(null);
  const [locked, setLocked] = useState(false);
  const [assetList, setAssetList] = useState(null);
  const nameRef = useRef(null);
  /**
   * @type {React.Ref<HTMLInputElement>}
   */
  const fileRef = useRef(null);

  const onSubmit = e => {
    e.preventDefault();
    if (locked) return;
    if (!fileRef.current.files.length) return setFeedback('You must select a file');
    if (!nameRef.current.value) return setFeedback('You must specify a name');
    let image = fileRef.current.files[0];
    if (image.size >= 8e+7) return setFeedback('The file is too large');
    if (image.size === 0) return setFeedback('The file is empty');

    setLocked(true);
    uploadAsset({
      name: nameRef.current.value,
      assetTypeId: id,
      file: image,
    }).then(() => {
      window.location.reload();
    }).catch(e => {
      setFeedback(e.message);
      setLocked(false);
    })
  }

  useEffect(() => {
    setAssetList(null);
    if (!auth.userId) return;
    getCreatedItems({
      limit: 100,
      cursor: '',
      assetType: id,
    }).then(d => {
      setAssetList(d);
    });
  }, [auth.userId, id]);

  const s = useStyles();

  if (!details) return null;
  return <div className='row'>
    <div className='col-12'>
      <h2>Create {details.title} <span className={s.subtext}>Don't know how? <a href='https://developer.roblox.com/articles/How-to-Make-Shirts-and-Pants-for-Roblox-Characters'>Click Here</a></span>
      </h2>
    </div>
    <div className='col-12'>
      <div className='ms-4 me-4 mt-4'>
        {details.templateUrl ? <p>Did you use the template? If not, <a href={details.templateUrl}>download it here</a>.</p> : null}
        <p>Find your image: <input ref={fileRef} type='file'></input> {feedback && <span className='text-danger'>{feedback}</span>}</p>
        <p>{details.name} Name: <input ref={nameRef} type='text' className={s.inputItemName}></input></p>
        <div className='float-left'>
          <ActionButton disabled={locked} label='Upload' onClick={onSubmit}></ActionButton>
        </div>
      </div>
    </div>
    <div className='col-12 mt-4'>
      {assetList ? (
        assetList.data.length === 0 ?
          <p>You haven't created any {details.namePlural.toLowerCase()}.</p>
          : <AssetList assets={assetList.data}></AssetList>
      ) : null}
    </div>
  </div>
}

export default Clothing;