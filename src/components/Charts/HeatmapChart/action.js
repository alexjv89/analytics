"use server";
import isMember from "@/policies/isMember";
import moment from "moment";
import async from 'async';
import _ from 'lodash';
import { getDB } from '@/database';
import { Sequelize } from "sequelize";
// used on masterdata tab
export async function getData({filter,params}){
  const {session,org}=await isMember({params});
  const db = getDB();

  const startDate = filter.date_from 
    ? moment(filter.date_from).format('YYYY-MM-DD')
    : moment().startOf('year').format('YYYY-MM-DD');
  const endDate = filter.date_to
    ? moment(filter.date_to).format('YYYY-MM-DD')
    : moment().endOf('month').format('YYYY-MM-DD');

  let where = {
    org: org.id,
  }
  if (filter.particulars && filter.particulars !== '') {
    where.particulars = {
      [Sequelize.Op.iLike]: `%${filter.particulars}%`
    }
  }
  if (filter.comments && filter.comments !== '') {
    where.comments = {
      [Sequelize.Op.iLike]: `%${filter.comments}%`
    }
  }
  if (filter.accounts && filter.accounts !== '') {
    where.account = filter.accounts.split(',');
  }
  if (filter.type && filter.type !== '') {
    where.type = filter.type;
  }

  const workflow = {
    getData: async function(){
      // Define the grouping expression based on filter.group_by
      let dateGrouping;
      switch(filter.group_by) {
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

      const db_data = await db.Transactions.findAll({
        attributes: [
          [dateGrouping, 'period'],
          // 'type',
          [Sequelize.fn('SUM', Sequelize.col('inflow')), 'inflow_sum'],
          [Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN inflow > 0 THEN 1 END')), 'inflow_count'],
          [Sequelize.fn('SUM', Sequelize.col('outflow')), 'outflow_sum'],
          [Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN outflow > 0 THEN 1 END')), 'outflow_count']
        ],
        where: {
          ...where,
          ...{
            date: {
              [Sequelize.Op.between]: [startDate, endDate]
            }
          }
        },
        group: [
          dateGrouping,
          // 'type'
        ],
        order: [
          [dateGrouping, 'ASC'],
          // ['type', 'ASC']
        ],
        raw: true,
      });
      db_data.forEach(function(d){
        if(filter.group_by=='day')
          d.period=d.period;
        else if(filter.group_by=='week')
          d.period=d.period.toISOString();
        else if(filter.group_by=='month')
          d.period=d.period.toISOString();
        else if(filter.group_by=='year')
          d.period=d.period.toISOString();
      })
      const periods = _.uniq(db_data.map(d => d.period));
      // get unique periods
      
      let data = [];
      periods.forEach(function(p){
        var period = {
          period:p,
        };
        var filtered_data=_.filter(db_data,(d)=>{ return d.period==p})
        console.log(filtered_data)
        filtered_data.forEach(function(row){
          period.sum={
            inflow:row.inflow_sum,
            outflow:row.outflow_sum,
          };
          period.count={
            inflow:parseInt(row.inflow_count),
            outflow:parseInt(row.outflow_count),
          };
          
        })
        data.push(period);
      })
      // 
      return data;
    },
  }
  try{
    let results = await async.auto(workflow);
    return {
      status:'success',
      data:results.getData,
    }
  }catch(e){
    return {
      status:'failed',
      error:e.message,
    }
  }
}