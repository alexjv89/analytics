import { NextResponse } from "next/server";
import { getDB } from "@/database";
import { z } from "zod";
import { authenticateAPIRequest } from "@/policies/authenticateAPIRequest";
import { log } from "async";

const EventlogSchema = z.object({
  event: z.string().optional(),
  app: z.string().optional(),
  // service: z.string().optional(),
  // module: z.string().optional(),
  object: z.string().optional(),
  action_type: z.string().optional(),
  env: z.string().optional(),
  org: z.union([z.string(), z.number()]).optional(),
  user: z.union([z.string(), z.number()]).optional(),
  created_at: z.string().datetime().optional(),
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
      // event: validatedData.event,
      // org: validatedData.org,
      // user: validatedData.user,
      project: project.id,
      
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