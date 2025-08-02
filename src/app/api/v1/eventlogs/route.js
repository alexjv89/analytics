import { NextResponse } from "next/server";
import { getDB } from "@/database";
import { z } from "zod";
import { authenticateAPIRequest } from "@/policies/authenticateAPIRequest";

const EventlogSchema = z.object({
  name: z.string().optional(),
  app_name: z.string().optional(),
  app_env: z.string().optional(),
  log_org: z.string().optional(),
  log_user: z.string().optional(),
  details: z.any().optional(),
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
    const validatedData = EventlogSchema.parse(body);
    
    const db = getDB();
    
    // Create new eventlog entry with project ID from token
    const eventlog = await db.Eventlogs.create({
      ...validatedData,
      project: project.id
    });
    
    return NextResponse.json({
      status: "success",
      data: eventlog
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