import 'server-only';
import formatDate from "@/utils/formatDate";
import { getDB } from '@/database';
import { Sequelize } from 'sequelize';
import _ from 'lodash';

function getDateGrouping(group_by){
  let dateGrouping;
  switch(group_by) {
    case 'week':
      dateGrouping = Sequelize.fn('DATE_TRUNC', 'week', Sequelize.col('date'));
      break;
    case 'month':
      dateGrouping = Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('date'));
      break;
    case 'year':
      dateGrouping = Sequelize.fn('DATE_TRUNC', 'year', Sequelize.col('date'));
      break;
    case 'day':
    default:
      dateGrouping = Sequelize.fn('DATE', Sequelize.col('date'));
  }
  return dateGrouping;
}

export async function getDataByCategory({where,searchParams}){
  const db = getDB();
  let dateGrouping = getDateGrouping(searchParams.group_by);
  const db_data = await db.Transactions.findAll({
    attributes: [
      [dateGrouping, 'period'],
      [Sequelize.fn('COALESCE', Sequelize.col('category'), ''), 'category'], // to combine '' and null into ''
      [Sequelize.fn('SUM', Sequelize.col('inflow')), 'inflow_sum'],
      [Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN inflow > 0 THEN 1 END')), 'inflow_count'],
      [Sequelize.fn('SUM', Sequelize.col('outflow')), 'outflow_sum'],
      [Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN outflow > 0 THEN 1 END')), 'outflow_count']
    ],
    where: where,
    group: [
      dateGrouping,
      Sequelize.fn('COALESCE', Sequelize.col('category'), '')
    ],
    order: [
      [dateGrouping, 'ASC'],
      ['category', 'ASC']
    ],
    raw: true,
  });
  db_data.forEach(function(d){
    if(!d.category || d.category === '')
      d.category = 'empty';
    d.period=formatDate.getPeriodString(d.period,searchParams.group_by);
  })
  // get unique categories
  const categories = _.uniq(db_data.map(d => d.category));
  // console.log(periods);
  let data = [];
  
  categories.forEach(function(c){
    var row = {
      category:c,
    };
    var filtered_data=_.filter(db_data,(d)=>{ return d.category==c})
    // console.log(filtered_data)
    filtered_data.forEach(function(d){
      row[d.period]={
        sum:{
          inflow:d.inflow_sum,
          outflow:d.outflow_sum,
        },
        count:{
          inflow:parseInt(d.inflow_count),
          outflow:parseInt(d.outflow_count),
        }
      }
    })
    data.push(row);
  })
  // 
  return data;
}

export async function getDataByEntity({where,searchParams}){
  const db = getDB();
  let dateGrouping = getDateGrouping(searchParams.group_by);
  const db_data = await db.Transactions.findAll({
    attributes: [
      [dateGrouping, 'period'],
      'entity',
      [Sequelize.fn('SUM', Sequelize.col('inflow')), 'inflow_sum'],
      [Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN inflow > 0 THEN 1 END')), 'inflow_count'],
      [Sequelize.fn('SUM', Sequelize.col('outflow')), 'outflow_sum'],
      [Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN outflow > 0 THEN 1 END')), 'outflow_count']
    ],
    where: where,
    group: [
      dateGrouping,
      'entity'
    ],
    order: [
      [dateGrouping, 'ASC'],
      ['entity', 'ASC']
    ],
    raw: true,
  });
  db_data.forEach(function(d){
    if(!d.entity)
      d.entity='empty';
    d.period=formatDate.getPeriodString(d.period,searchParams.group_by);
  })
  // get unique categories
  const entities = _.uniq(db_data.map(d => d.entity));
  // console.log(periods);
  let data = [];
  
  entities.forEach(function(e){
    var row = {
      entity:e,
    };
    var filtered_data=_.filter(db_data,(d)=>{ return d.entity==e})
    // console.log(filtered_data)
    filtered_data.forEach(function(d){
      row[d.period]={
        sum:{
          inflow:d.inflow_sum,
          outflow:d.outflow_sum,
        },
        count:{
          inflow:parseInt(d.inflow_count),
          outflow:parseInt(d.outflow_count),
        }
      }
    })
    data.push(row);
  })
  // 
  return data;
}