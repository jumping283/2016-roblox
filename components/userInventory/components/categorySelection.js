import {createUseStyles} from "react-jss";
import Dropdown2016 from "../../dropdown2016";
import Selector from "../../selector";
import getFlag from "../../../lib/getFlag";
import UserInventoryStore from "../stores/userInventoryStore";

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
    {
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
  const onChange = v => {
    store.setCategory(v);
  }
  return <div className='col-12 col-lg-2'>
    <div className='d-block d-lg-none'>
      <h2 className={s.categoryTitle}>CATEGORY</h2>
      <Selector options={options} onChange={onChange} value='Hat' />
    </div>
    <div className='d-none d-lg-block d-xl-block'>
      <div className={s.categoryBgDesktop}>
        <div className='ps-3 pe-3 pt-4'><h2 className={s.categoryTitle}>CATEGORY</h2></div>
        {options.map(v => {
          const selected = store.category.value === v.value;
          return <div onClick={e => {
            onChange(v);
          }} key={v.value} className={s.selectorOption + ' ' + (selected ? s.selectorOptionSelected : '')}>
            {v.name}
          </div>
        })}
      </div>
    </div>
  </div>
}

export default CategorySelection;