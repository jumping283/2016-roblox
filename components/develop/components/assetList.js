import React from "react";
import { createUseStyles } from "react-jss"
import { itemNameToEncodedName } from "../../../services/catalog";
import GearDropdown from "../../gearDropdown";
import AssetListGameEntry from "./assetListGameEntry";

const useStyles = createUseStyles({
  image: {
    margin: '0 auto',
    display: 'block',
    height: '70px',
    width: '70px',
    objectFit: 'cover',
  },
  row: {
    borderBottom: '1px solid #f2f2f2',
    paddingBottom: '4px',
  },
});

const AssetEntry = props => {
  const s = useStyles();
  const isPlace = props.assetType === 9;

  const assetUrl = `/${itemNameToEncodedName(props.name)}-${isPlace ? 'game' : 'item'}?id=${props.assetId}`;
  const url = isPlace ? `/universes/configure?id=${props.universeId}` : assetUrl;

  const gearOptions = [
    isPlace && {
      url: '/universes/configure?id=' + props.universeId,
      name: 'Configure Game',
    },
    isPlace && {
      url: '/places/' + props.assetId + '/update',
      name: 'Configure Start Place',
    },
    // localization skipped
    isPlace && {
      name: 'separator',
    },
    isPlace && {
      name: 'Create Badge',
      url: `/develop?selectedPlaceId=${props.assetId}&View=21`,
    },
    isPlace && {
      name: 'Create Pass',
      url: `/develop?selectedplaceId=${props.assetId}&View=34`,
    },
    isPlace && {
      name: 'Developer Stats',
      url: `/creations/games/${props.universeId}/stats`,
    },
    isPlace && {
      name: 'separator',
    },
    {
      name: 'Advertise',
      url: `/user-ads/create?targetId=${props.assetId}&targetType=Asset`,
    },
    isPlace && {
      name: 'separator',
    },
    isPlace && {
      name: 'Shut Down All Servers',
      url: '#',
      onClick: e => {
        e.preventDefault();
        // TODO
      },
    },
  ];

  return <div className={'row ' + s.row}>
    <div className='col-2'>
      <img className={s.image} src={`/Thumbs/Asset.ashx?width=100&height=100&assetId=${props.assetId}`}></img>
    </div>
    <div className='col-4 ps-0'>
      <p className='mb-0'><a href={url}>{props.name}</a></p>
      {props.assetType === 9 ? <AssetListGameEntry url={assetUrl} startPlaceName={props.name}></AssetListGameEntry> : null}
    </div>
    <div className='col-6'>
      <div style={{ float: 'right' }}>
        <GearDropdown boxDropdownRightAmount={0} options={gearOptions.filter(v => !!v)}></GearDropdown>
      </div>
    </div>
  </div>
}

const AssetList = props => {
  return <div className='row'>
    <div className='col-12'>
      {
        props.assets.map(v => {
          return <AssetEntry key={v.assetId} {...v}></AssetEntry>
        })
      }
    </div>
  </div>
}

export default AssetList;