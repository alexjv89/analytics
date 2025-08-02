import { NextResponse } from "next/server";
import { getDB } from "@/database";
import { z } from "zod";
import { authenticateAPIRequest } from "@/policies/authenticateAPIRequest";

const LogsOrgSchema = z.object({
  name: z.string(),
  tp_id: z.union([z.string(), z.number()]),
});

export async function POST(request) {
  try {
    // Authenticate the request using Bearer token (first step)
    const authResult = await authenticateAPIRequest(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    const project = authResult;
    const body = await request.json();
    
    // Validate the request body using Zod
    const validatedData = LogsOrgSchema.parse(body);
    
    const db = getDB();
    
    // Prepare data with project ID from token
    const dataWithProject = {
      ...validatedData,
      project: project.id
    };
    
    let logsOrg;
    
    if (validatedData.tp_id) {
      // Use updateOrCreate based on tp_id
      const [record, created] = await db.LogsOrgs.findOrCreate({
        where: { tp_id: validatedData.tp_id.toString() },
        defaults: dataWithProject
      });
      
      if (!created) {
        // Update existing record
        await record.update(dataWithProject);
        await record.reload();
      }
      
      logsOrg = record;
    } else {
      // Create new record if no tp_id provided
      logsOrg = await db.LogsOrgs.create(dataWithProject);
    }
    
    return NextResponse.json({
      status: "success",
      data: logsOrg
    }, { status: 201 });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        status: "error",
        message: "Validation failed",
        errors: error.errors
      }, { status: 400 });
    }
    
    return NextResponse.json({
      status: "error",
      message: "Internal server error"
    }, { status: 500 });
  }
}