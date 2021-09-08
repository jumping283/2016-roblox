import React from "react";
import { createUseStyles } from "react-jss";
import AdBanner from "../../components/ad/adBanner";
import CatalogFilters from "../../components/catalogFilters";
import CatalogLegend from "../../components/catalogLegend";
import CatalogPageInput from "../../components/catalogPageInput";
import CatalogPageNavigation from "../../components/catalogPageNavigation";
import CatalogPageResults from "../../components/catalogPageResults";
import Dropdown from '../../components/dropdown';
import CatalogPageStore from "../../stores/catalogPage";

const useStyles = createUseStyles({
  title: {
    fontWeight: 700,
    fontSize: '32px',
    marginBottom: '12px',
    color: '#343434',
  },
})

const CatalogPage = props => {
  const s = useStyles();
  return (
    <CatalogPageStore.Provider>
      <div className='container mt-4'>
        <AdBanner></AdBanner>
        <div className='row mt-2'>
          <div className='col-12 col-md-4 col-lg-2'>
            <h1 className={s.title}>Catalog</h1>
          </div>
          <div className='col-12 col-md-8 col-lg-10'>
            <CatalogPageInput></CatalogPageInput>
          </div>
        </div>
        <div className='row'>
          <div className='col-12 col-md-4 col-lg-2'>
            <div className='divider-right'>
              <div className='pe-2'>
                <CatalogPageNavigation></CatalogPageNavigation>
                <CatalogFilters></CatalogFilters>
                <CatalogLegend></CatalogLegend>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-8 col-lg-10'>
            <CatalogPageResults></CatalogPageResults>
          </div>
        </div>
      </div>
    </CatalogPageStore.Provider>
  )
}

export const getStaticProps = () => {
  return {
    props: {
      title: 'Catalog - ROBLOX',
    },
  }
}

export default CatalogPage;