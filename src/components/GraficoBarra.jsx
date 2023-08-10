import React from 'react'

import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';

const GraficoBarra = ({data, options}) => {
    console.log(data);
  return <Chart type="bar" data={data} options={options}/>
}

export default GraficoBarra