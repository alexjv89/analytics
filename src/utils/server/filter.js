import 'server-only';
import { Sequelize } from 'sequelize';
export function filterTransaction({org,searchParams}){
  let where = {
    org: org.id,
  }
  if (searchParams.particulars && searchParams.particulars !== '') {
    where.particulars = {
      [Sequelize.Op.iLike]: `%${searchParams.particulars}%`
    }
  }
  if (searchParams.comments && searchParams.comments !== '') {
    if (searchParams.comments === 'empty') {
      where.comments = {
        [Sequelize.Op.or]: [null, '']
      };
    } else {
      where.comments = {
        [Sequelize.Op.iLike]: `%${searchParams.comments}%`
      };
    }
  }
  if (searchParams.entity && searchParams.entity !== '') {
    if (searchParams.entity === 'empty') {
      where.entity = {
        [Sequelize.Op.or]: [null,'']
      };
    } else {
      where.entity = {
        [Sequelize.Op.iLike]: `%${searchParams.entity}%`
      }
    }
  }
  if (searchParams.category && searchParams.category !== '') {
    if (searchParams.category === 'empty') {
      where.category = {
        [Sequelize.Op.or]: [null,'']
      };
    } else {
      where.category = {
        [Sequelize.Op.iLike]: `%${searchParams.category}%`
      }
    } 
  }
  if (searchParams.accounts && searchParams.accounts !== '') {
    where.account = searchParams.accounts.split(',');
  }
  if (searchParams.type && searchParams.type !== '') {
    where.type = searchParams.type;
  }
  
  if (searchParams.date_from || searchParams.date_to) {
    where.date = {};
    if (searchParams.date_from) {
      where.date[Sequelize.Op.gte] = searchParams.date_from;
    }
    if (searchParams.date_to) {
      where.date[Sequelize.Op.lte] = searchParams.date_to;
    }
  }
  if (searchParams.amount_from || searchParams.amount_to) {
    const flowType = searchParams.flow_type || 'all';
    
    if (flowType === 'all') {
      where[Sequelize.Op.or] = [];
      
      const condition = {};
      if (searchParams.amount_from) {
        condition[Sequelize.Op.gte] = searchParams.amount_from * 1000;
      }
      if (searchParams.amount_to) {
        condition[Sequelize.Op.lte] = searchParams.amount_to * 1000;
      }
      
      where[Sequelize.Op.or].push(
        { inflow: condition },
        { outflow: condition }
      );
    } else if (flowType === 'inflow') {
      where.inflow = {};
      if (searchParams.amount_from) {
        where.inflow[Sequelize.Op.gte] = searchParams.amount_from * 1000;
      }
      if (searchParams.amount_to) {
        where.inflow[Sequelize.Op.lte] = searchParams.amount_to * 1000;
      }
    } else if (flowType === 'outflow') {
      where.outflow = {};
      if (searchParams.amount_from) {
        where.outflow[Sequelize.Op.gte] = searchParams.amount_from * 1000;
      }
      if (searchParams.amount_to) {
        where.outflow[Sequelize.Op.lte] = searchParams.amount_to * 1000;
      }
    }
  }
  // this is now deprecated. support for inflow_from,inflow_to,outflow_from,outflow_to will be removed soon. 
  if (searchParams.inflow_from || searchParams.inflow_to) {
    where.inflow = {};
    if (searchParams.inflow_from) {
      where.inflow[Sequelize.Op.gte] = searchParams.inflow_from*1000;
    }
    if (searchParams.inflow_to) {
      where.inflow[Sequelize.Op.lte] = searchParams.inflow_to*1000;
    }
  }
  if (searchParams.outflow_from || searchParams.outflow_to) {
    where.outflow = {};
    if (searchParams.outflow_from) {
      where.outflow[Sequelize.Op.gte] = searchParams.outflow_from*1000;
    }
    if (searchParams.outflow_to) {
      where.outflow[Sequelize.Op.lte] = searchParams.outflow_to*1000;
    }
  }
  return where;
}