import 'server-only';

/**
 * Build SQL WHERE clause and parameters for filtering pg-boss jobs
 * @param {Object} options
 * @param {Object} options.searchParams - URL search parameters
 * @returns {Object} { whereClause, params }
 */
export function filterJobs({ searchParams }) {
  const where = [];
  const params = [];
  
  // Filter by job name/type
  if (searchParams.name && searchParams.name !== '') {
    if (searchParams.name.includes(',')) {
      // Multiple job names
      const names = searchParams.name.split(',').filter(n => n.trim());
      where.push(`name = ANY($${params.length + 1})`);
      params.push(names);
    } else {
      // Single job name
      where.push(`name = $${params.length + 1}`);
      params.push(searchParams.name);
    }
  }
  
  // Filter by job state
  if (searchParams.state && searchParams.state !== '') {
    if (searchParams.state.includes(',')) {
      // Multiple states
      const states = searchParams.state.split(',').filter(s => s.trim());
      where.push(`state = ANY($${params.length + 1})`);
      params.push(states);
    } else {
      // Single state
      where.push(`state = $${params.length + 1}`);
      params.push(searchParams.state);
    }
  }
  
  // Filter by priority range
  if (searchParams.priority_min) {
    where.push(`priority >= $${params.length + 1}`);
    params.push(parseInt(searchParams.priority_min));
  }
  
  if (searchParams.priority_max) {
    where.push(`priority <= $${params.length + 1}`);
    params.push(parseInt(searchParams.priority_max));
  }
  
  // Filter by creation date range
  if (searchParams.created_from) {
    where.push(`created_on >= $${params.length + 1}`);
    params.push(searchParams.created_from);
  }
  
  if (searchParams.created_to) {
    where.push(`created_on <= $${params.length + 1}`);
    params.push(searchParams.created_to + ' 23:59:59');
  }
  
  // Filter by completion date range
  if (searchParams.completed_from) {
    where.push(`completed_on >= $${params.length + 1}`);
    params.push(searchParams.completed_from);
  }
  
  if (searchParams.completed_to) {
    where.push(`completed_on <= $${params.length + 1}`);
    params.push(searchParams.completed_to + ' 23:59:59');
  }
  
  // Filter by retry status
  if (searchParams.has_retries === 'true') {
    where.push('retry_count > 0');
  }
  
  // Search in job data (JSONB search)
  if (searchParams.data_search && searchParams.data_search !== '') {
    where.push(`data::text ILIKE $${params.length + 1}`);
    params.push(`%${searchParams.data_search}%`);
  }
  
  // Search in job output (JSONB search)
  if (searchParams.output_search && searchParams.output_search !== '') {
    where.push(`output::text ILIKE $${params.length + 1}`);
    params.push(`%${searchParams.output_search}%`);
  }
  
  return {
    whereClause: where.length > 0 ? 'WHERE ' + where.join(' AND ') : '',
    params
  };
}