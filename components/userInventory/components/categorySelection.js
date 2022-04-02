import {createUseStyles} from "react-jss";
import Dropdown2016 from "../../dropdown2016";
import Selector from "../../selector";
import getFlag from "../../../lib/getFlag";
import UserInventoryStore from "../stores/userInventoryStore";
import { useState } from "react";
import { useEffect } from "react";

const useStyles = createUseStyles({
  categoryTitle: {
    fontWeight: 300,
    fontSize: '24px',
  },
  categoryBgDesktop: {
    background: '#fff',
    borderRadius: '4px',
    boxShadow: '0 1px 3px rgba(150,150,150,0.75)',
  },
  selectorOptionSelected: {
    color: 'rgb(0, 162, 255)',
    borderRight: '4px solid rgb(0, 162, 255)',
  },
  selectorOption: {
    cursor: 'pointer',
    marginLeft: '1rem',
    paddingBottom: '0.5rem',
    paddingTop: '0.5rem',
    fontWeight: '300',
    fontSize: '18px',
    '&:hover': {
      color: 'rgb(0, 162, 255)',
      borderRight: '4px solid rgb(0, 162, 255)',
    },
  },
  childSelector: {
    position: 'absolute',
    width: '140px',
    marginTop: '-35px',
    marginLeft: '143px',
    zIndex: 4,
  }
})

const CategorySelection = props => {
  const s = useStyles();
  const store = UserInventoryStore.useContainer();
  const options = [
    {
      name: 'Heads',
      value: 'Head',
    },
    {
      name: 'Faces',
      value: 'Face',
    },
    {
      name: 'Gears',
      value: 'Gear',
    },
    getFlag('accessoriesEnabled', false) ? {
      name: 'Accessories',
      value: 'Accessories',
      children: [
        {
          name: 'Hats',
          value: 'Hat',
        },
        {
          name: 'Hair',
          value: 'HairAccessory',
        },
        {
          name: 'Face',
          value: 'FaceAccessory',
        },
        {
          name: 'Neck',
          value: 'NeckAccessory',
        },
        {
          name: 'Shoulder',
          value: 'ShoulderAccessory',
        },
        {
          name: 'Front',
          value: 'FrontAccessory',
        },
        {
          name: 'Back',
          value: 'BackAccessory',
        },
        {
          name: 'Waist',
          value: 'WaistAccessory',
        },
      ]
    } : {
      name: 'Hats',
      value: 'Hat',
    },
    {
      name: 'T-Shirts',
      value: 'TeeShirt',
    },
    {
      name: 'Shirts',
      value: 'Shirt',
    },
    {
      name: 'Pants',
      value: 'Pants',
    },
    {
      name: 'Decals',
      value: 'Decal',
    },
    {
      name: 'Models',
      value: 'Model',
    },
    {
      name: 'Plugins',
      value: 'Plugin',
    },
    {
      name: 'Animations',
      value: 'Animation',
    },
    {
      name: 'Places',
      value: 'Place',
    },
    {
      name: 'Game Passes',
      value: 'Gamepass',
    },
    {
      name: 'Audio',
      value: 'Audio',
    },
    {
      name: 'Badges',
      value: 'Badge',
    },
    {
      name: 'Torsos',
      value: 'Torso',
    },
    getFlag('packagesEnabled', false) && {
      name: 'Packages',
      value: 'Package',
    },
  ].filter(v => !!v);
  const [selected ,setSelected] = useState(() => {
    // On first load, hide menu if user is on desktop.
    // This is so that the Accessory side menu doesn't show up.
    if (typeof window !== 'undefined' && window.innerWidth >= 992) {
      return null;
    }

    return options.find(v => v.value === (getFlag('accessoriesEnabled', false) ? 'Accessories' : 'Hats'))
  });
  const onChange = v => {
    if (v.children) {
      setSelected(selected === v ? null : v);
      return;
    }
    store.setCategory(v);
  }
  const onChangeSubCategory = v => {
    store.setCategory(v);
  }

  return <div className='col-12 col-lg-2'>
    <div className='d-block d-lg-none'>
      <h2 className={s.categoryTitle}>CATEGORY</h2>
      <Selector options={options} onChange={onChange} value={getFlag('accessoriesEnabled', false) ? 'Accessories' : 'Hat'} />
      {
        selected && getFlag('accessoriesEnabled', false) && selected.children ? <>
          <h2 className={s.categoryTitle}>SUBCATEGORY</h2>
          <Selector options={selected.children} onChange={onChangeSubCategory} value='Hat' /> 
        </> : null
      }
    </div>
    <div className='d-none d-lg-block d-xl-block'>
      <div className={s.categoryBgDesktop}>
        <div className='ps-3 pe-3 pt-4'><h2 className={s.categoryTitle}>CATEGORY</h2></div>
        {options.map(v => {
          const catSelected = store.category.value === v.value;
          return <div onMouseEnter={() => {
            setSelected(v);
          }}>
            <div onClick={e => {
              onChange(v);
            }} key={v.value} className={s.selectorOption + ' ' + (catSelected ? s.selectorOptionSelected : '')}>
              {v.name}
            </div>
            {selected && selected.children && selected.value === v.value ? <div className={s.categoryBgDesktop + ' ' + s.childSelector}>
              {selected.children.map(v => {
                const selected = store.category.value === v.value;
                return <div onMouseLeave={() => {
                }} onClick={e => {
                  onChange(v);
                  setSelected(null);
                }} key={v.value} className={s.selectorOption + ' ' + (selected ? s.selectorOptionSelected : '')}>
                  {v.name}
                </div>
              })}
              </div> : null}
          </div>
        })}
      </div>
    </div>
  </div>
}

export default CategorySelection;