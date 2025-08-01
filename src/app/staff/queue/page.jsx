import "server-only";
import ListJobs from "./ListJobs";
import { getDB } from '@/database';
import { filterJobs } from "@/utils/server/filterJobs";

export const metadata = {
  title: "Queue Management - Staff",
  description: "Manage and monitor pg-boss job queues",
};

export default async function Page({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const db = getDB();
  
  const page = parseInt(resolvedSearchParams.page || '1', 10);
  const pageSize = 100;
  const includeArchive = resolvedSearchParams.archive === 'true';
  
  // Build filter conditions
  const { whereClause, params } = filterJobs({ searchParams: resolvedSearchParams });
  
  try {
    // Determine which table to query
    const tableName = includeArchive ? 'pgboss.archive' : 'pgboss.job';
    const orderColumn = includeArchive ? 'archived_on' : 'created_on';
    
    // Main jobs query with pagination
    const jobsQuery = `
      SELECT 
        id,
        name,
        state,
        priority,
        data,
        retry_count,
        retry_limit,
        created_on,
        started_on,
        completed_on,
        output,
        ${includeArchive ? 'archived_on,' : ''}
        dead_letter
      FROM ${tableName}
      ${whereClause}
      ORDER BY ${orderColumn} DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
    
    // Count query for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM ${tableName}
      ${whereClause}
    `;
    
    // Stats query for dashboard overview
    const statsQuery = `
      SELECT 
        state,
        COUNT(*) as count
      FROM pgboss.job
      GROUP BY state
      ORDER BY count DESC
    `;
    
    // Execute queries
    const [jobsResult] = await db.sequelize.query(jobsQuery, {
      bind: [...params, pageSize, pageSize * (page - 1)]
    });
    
    const [countResult] = await db.sequelize.query(countQuery, {
      bind: params
    });
    
    const [statsResult] = await db.sequelize.query(statsQuery);
    
    // Calculate pagination
    const totalJobs = parseInt(countResult[0]?.total || 0);
    const pageCount = Math.ceil(totalJobs / pageSize);
    
    // Process stats
    const stats = {
      total: totalJobs,
      byState: statsResult.reduce((acc, row) => {
        acc[row.state] = parseInt(row.count);
        return acc;
      }, {}),
      currentPage: page,
      pageSize,
      includeArchive
    };
    
    return (
      <ListJobs
        jobs={jobsResult}
        searchParams={resolvedSearchParams}
        pageCount={pageCount}
        stats={stats}
      />
    );
    
  } catch (error) {
    console.error("Error fetching jobs:", error);
    
    // Return empty state on error
    return (
      <ListJobs
        jobs={[]}
        searchParams={resolvedSearchParams}
        pageCount={0}
        stats={{
          total: 0,
          byState: {},
          currentPage: 1,
          pageSize,
          includeArchive,
          error: error.message
        }}
      />
    );
  }
}