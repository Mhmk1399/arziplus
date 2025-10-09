import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "@/lib/s3";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');
    const expiresIn = searchParams.get('expires') || '31536000'; // Default 1 year

    if (!key) {
      return NextResponse.json(
        { success: false, error: "File key is required" },
        { status: 400 }
      );
    }

    if (!process.env.AWS_S3_BUCKET) {
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Generate a pre-signed URL for the file
    const getObjectCommand = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      ResponseContentDisposition: 'inline',
    });

    const signedUrl = await getSignedUrl(s3, getObjectCommand, { 
      expiresIn: parseInt(expiresIn)
    });

    return NextResponse.json({
      success: true,
      data: {
        key,
        url: signedUrl,
        expiresIn: parseInt(expiresIn),
        expiresAt: new Date(Date.now() + parseInt(expiresIn) * 1000).toISOString()
      }
    });

  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'NoSuchKey') {
        return NextResponse.json(
          { success: false, error: "File not found" },
          { status: 404 }
        );
      }
      
      if (error.name === 'AccessDenied') {
        return NextResponse.json(
          { success: false, error: "Access denied to file" },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: "Failed to generate file URL" },
      { status: 500 }
    );
  }
}

// POST endpoint to get signed URLs for multiple files
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { keys, expiresIn = 31536000 } = body; // Default 1 year

    if (!keys || !Array.isArray(keys)) {
      return NextResponse.json(
        { success: false, error: "Keys array is required" },
        { status: 400 }
      );
    }

    if (!process.env.AWS_S3_BUCKET) {
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    const signedUrls = await Promise.allSettled(
      keys.map(async (key: string) => {
        const getObjectCommand = new GetObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: key,
          ResponseContentDisposition: 'inline',
        });

        const signedUrl = await getSignedUrl(s3, getObjectCommand, { 
          expiresIn: parseInt(expiresIn)
        });

        return {
          key,
          url: signedUrl,
          success: true
        };
      })
    );

    const results = signedUrls.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          key: keys[index],
          url: null,
          success: false,
          error: result.reason.message || 'Failed to generate URL'
        };
      }
    });

    return NextResponse.json({
      success: true,
      data: results,
      expiresIn: parseInt(expiresIn),
      expiresAt: new Date(Date.now() + parseInt(expiresIn) * 1000).toISOString()
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to generate file URLs" },
      { status: 500 }
    );
  }
}