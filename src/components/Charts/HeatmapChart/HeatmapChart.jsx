'use client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography"
import ReactECharts from 'echarts-for-react';
import { useState, useEffect } from "react";
import moment from 'moment';
import { getData } from './action';
import { useParams } from 'next/navigation';

function generateSeriesData({data,series}){
  var series_data=[];
  var min =0;
  var max =0;
  data.forEach(function(row,i){
    // let val = row.sum.outflow/1000;
    let val=0;
    if(series=='count_all')
      val = row.count.inflow+row.count.outflow;
    else if(series=='count_inflow')
      val = row.count.inflow;
    else if(series=='count_outflow')
      val = row.count.outflow;
    else if(series=='sum_inflow')
      val = row.sum.inflow/1000;
    else if(series=='sum_outflow')
      val = row.sum.outflow/1000;
    else if(series=='sum_net'){
      val = (row.sum.inflow-row.sum.outflow)/1000;
      if (Math.abs(min) > Math.abs(max)) {
        max = Math.abs(min);
        min = -max;
      } else {
        min = -Math.abs(max);
      }
    }
      // row.sum.inflow-row.sum.outflow,
    if(i==1){
      min=val;
      max=val;
    }
    if(val>max)
      max=val;
    if(val<min)
      min=val;

    if(val!=0)
      series_data.push([row.period,val])
    // if(series.indexOf('count_')>-1 && val==0){
    //   // for count_all, count_inflow, count_outflow
    //   // if value is zero dont show count zero on the graph
    // }else{
    //   series_data.push([
    //     row.period,
    //     val,
    //   ])
    // }
      
      
    
  })
  return {series_data,min,max}
}

function generateOptions({data,compact,series}){
  let {series_data,min,max} = generateSeriesData({data,series});
  const gradient={
    green:['#e5f6e5', '#00b300'],  // Light green to bright green gradient
    red:['#ffe5e5', '#ff0000'],  // Light red to bright red gradient
    blue:['#e5f0ff', '#0066ff'],  // Light blue to bright blue gradient
    // red_green:['#ff0000', '#00b300'],  // bright red to bright green gradient
    red_green:['#ff0000','#EBFAFF', '#00b300'],  // bright red to bright green gradient
  };
  let color = gradient.blue;
  if(series=='count_all'){
    min=0;
    color=gradient.blue;
  }
  else if(series=='count_inflow'){
    min=0;
    color=gradient.green;
  }
  else if(series=='count_outflow'){
    min=0;
    color=gradient.red;
  }
  else if(series=='sum_inflow'){
    min=0;
    color=gradient.green;
  }
  else if(series=='sum_outflow'){
    min=0;
    color=gradient.red;
  }
  else if(series=='sum_net'){
    // min=0;
    color=gradient.red_green;
  }
  let option = {
    tooltip: {
      position: 'top',
      formatter: function (p) {
        const format = moment(p.data[0]).format('YYYY-MM-DD');
        return format + ': ' + p.data[1];
      }
    },
    visualMap: {
      // min: min,
      min: min,
      max: max,
      calculable: true,
      // type: 'piecewise',
      orient: 'horizontal',
      left: 'center',
      top: 0,
      show:compact?false:true,
      inRange: {
        // color: 
        // color: 
        color: color
      }
    },
    calendar: {
      top:compact?16:66,
      left: 20,
      right: 0,
      // cellSize: [5, 5],
      range: moment().year(),
      itemStyle: {
        borderWidth: 3,
        borderColor: '#ffffff',  // White borders
        // color: '#ffffff'        // Grey color for empty cells
        color: '#fbfbfb'        // Grey color for empty cells
      },
      yearLabel: { show: false }
    },
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      // data: getVirtualData('2024')
      data: series_data
    }
  };
  return option;
}


export default function HeatmapChart({filter={},o_id,compact=false}){
  const [chartData, setChartData] = useState(null);
  const [series, setSeries] = useState('count_all');
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const result = await getData({
        filter: filter,
        params: params,
      });
      
      if (result.status === 'success')
        setChartData(result.data);
    };
    fetchData();
  }, [filter]);

  const option = generateOptions({data: chartData||[], compact, series});
  
  return <>
    <Card className="p-4 bg-white">
      {!chartData && <Typography className="absolute top-4 left-4">Loading...</Typography>}
      <ReactECharts 
        notMerge={true} 
        lazyUpdate={false} 
        option={option}
        // style={{ width: '100%', height: '300px' }}
        style={{ width: '100%', height: compact?'160px':'210px' }}
      />
      {/* {!compact && <Select value={series} onValueChange={setSeries}> */}
        {/* <SelectTrigger className="absolute top-4 right-4 w-48 h-8"> */}
          {/* <SelectValue /> */}
        {/* </SelectTrigger> */}
        {/* <SelectContent> */}
          {/* <SelectItem value="count_all">Count of transactions</SelectItem> */}
          {/* <SelectItem value="count_inflow">Count of Inflow</SelectItem> */}
          {/* <SelectItem value="count_outflow">Count of Outflow</SelectItem> */}
          {/* <SelectItem value="sum_inflow">Sum of Inflow</SelectItem> */}
          {/* <SelectItem value="sum_outflow">Sum of Outflow</SelectItem> */}
          {/* <SelectItem value="sum_net">Net Cashflow</SelectItem> */}
        {/* </SelectContent> */}
      {/* </Select>} */}
    </Card>
    {/* <pre>{JSON.stringify(series,null,2)}</pre> */}
  </>
}