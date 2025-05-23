import React from 'react'
import CategoryList from '../components/CategoryList'
import BannerProduct from '../components/BannerProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'
import VerticalCardProduct from '../components/VerticalCardProduct'


const Home = () => {
  return (
    <div>
      
      <BannerProduct />
      <CategoryList />
      <HorizontalCardProduct category={"Everyday Fruits"} heading={"Top's Everyday Fruits"} />
      <HorizontalCardProduct category={"Berries"} heading={"Popular's Berries"} />

      <VerticalCardProduct category={"Stone Fruits"} heading={"Stone Fruits"} />
      <VerticalCardProduct category={"Melons"} heading={"Melons"} />
      <VerticalCardProduct category={"Citrus Fruits"} heading={"Citrus Fruits"} />
      <VerticalCardProduct category={"Tropical & Exotic Fruits"} heading={"Tropical & Exotic Fruits"} />
      <VerticalCardProduct category={"Specialty Fruits"} heading={"Specialty Fruits"} />
      <VerticalCardProduct category={"Dried Fruits"} heading={"Dried Fruits"} />
    </div>
  )
}

export default Home