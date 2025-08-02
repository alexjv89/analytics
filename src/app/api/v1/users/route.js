import { NextResponse } from "next/server";
import { getDB } from "@/database";
import { z } from "zod";
import { authenticateAPIRequest } from "@/policies/authenticateAPIRequest";

const LogsUserSchema = z.object({
  name: z.string(),
  email: z.string().optional(),
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
    const validatedData = LogsUserSchema.parse(body);
    
    const db = getDB();
    
    // Prepare data with project ID from token
    const dataWithProject = {
      ...validatedData,
      project: project.id
    };
    
    let logsUser;
    
    if (validatedData.tp_id) {
      // Use updateOrCreate based on tp_id
      const [record, created] = await db.LogsUsers.findOrCreate({
        where: { tp_id: validatedData.tp_id.toString() },
        defaults: dataWithProject
      });
      
      if (!created) {
        // Update existing record
        await record.update(dataWithProject);
        await record.reload();
      }
      
      logsUser = record;
    } else {
      // Create new record if no tp_id provided
      logsUser = await db.LogsUsers.create(dataWithProject);
    }
    
    return NextResponse.json({
      status: "success",
      data: logsUser
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