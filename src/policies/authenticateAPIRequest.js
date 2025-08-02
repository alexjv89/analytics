import { getDB } from "@/database";
import { NextResponse } from "next/server";

/**
 * Authenticates a request using Bearer token authentication
 * @param {Request} request - The incoming request object
 * @returns {NextResponse|Object} - NextResponse on error, project object on success
 */
export async function authenticateAPIRequest(request) {
  try {
    // Extract Authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json({
        status: "error",
        message: "Missing Authorization header"
      }, { status: 401 });
    }

    // Check if it's a Bearer token
    if (!authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        status: "error",
        message: "Invalid authorization format. Expected Bearer token"
      }, { status: 401 });
    }

    // Extract the token (project:client_secret)
    const token = authHeader.substring(7).trim(); // Remove 'Bearer ' prefix
    
    if (!token) {
      return NextResponse.json({
        status: "error",
        message: "Missing token in Bearer header"
      }, { status: 401 });
    }

    // Parse project:client_secret format
    const tokenParts = token.split(':');
    if (tokenParts.length !== 2) {
      return NextResponse.json({
        status: "error",
        message: "Invalid token format. Expected project:client_secret"
      }, { status: 401 });
    }

    const [projectId, clientSecret] = tokenParts;

    if (!projectId || !clientSecret) {
      return NextResponse.json({
        status: "error",
        message: "Missing project ID or client secret in token"
      }, { status: 401 });
    }

    // Query database for project with both project ID and client_secret
    const db = getDB();
    const project = await db.Projects.findOne({
      where: { 
        id: projectId,
        client_secret: clientSecret 
      },
      attributes: ['id', 'name', 'client_secret'],
      raw: true
    });

    if (!project) {
      return NextResponse.json({
        status: "error",
        message: "Invalid project credentials"
      }, { status: 401 });
    }

    // Return project object on success
    return project;

  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json({
      status: "error",
      message: "Internal authentication error"
    }, { status: 500 });
  }
}