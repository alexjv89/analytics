import { NextResponse } from "next/server";
import { getDB } from "@/database";
import { z } from "zod";
import { authenticateAPIRequest } from "@/policies/authenticateAPIRequest";

const ServerlogSchema = z.object({
  app_env: z.string().optional(),
  app_name: z.string().optional(),
  status: z.string().optional(),
  req_method: z.string().optional(),
  req_url: z.string().optional(),
  req_protocol: z.string().optional(),
  req_host: z.string().optional(),
  req_ip: z.string().optional(),
  req_body: z.any().optional(),
  req_query: z.any().optional(),
  req_headers: z.any().optional(),
  req_route_path: z.string().optional(),
  req_user_id: z.string().optional(),
  req_session_id: z.string().optional(),
  res_status_code: z.string().optional(),
  res_status_message: z.string().optional(),
  res_time: z.number().optional(),
  res_meta: z.any().optional(),
  req_org_id: z.string().optional(),
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
    const validatedData = ServerlogSchema.parse(body);
    
    const db = getDB();
    
    // Create new serverlog entry with project ID from token
    const serverlog = await db.Serverlogs.create({
      ...validatedData,
      project: project.id
    });
    
    return NextResponse.json({
      status: "success",
      data: serverlog
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