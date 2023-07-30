import React from 'react'

import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';

/**Componente que devuelve una gráfica de dona usando la librería Chart-React-JS-2 */
const GraficaDona = ({data, options}) => {
    return <Chart type='doughnut' data={data} options={options} />;
}

export default GraficaDona