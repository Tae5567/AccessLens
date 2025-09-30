//src/app/api/generate-alt-text/route.ts
//Alt Text Generation Route

import { NextRequest, NextResponse } from "next/server";
import { AIRemediationEngine } from "@/lib/ai-remediation";

export async function POST(request: NextRequest) {
    try{
        const { imageUrl, context} = await request.json();

        if (!imageUrl) {
            return NextResponse.json(
                { error: "Image URL is required" },
                { status: 400 }
            );
        }

        const aiEngine = new AIRemediationEngine();
        const altText = await aiEngine.generateAltText(imageUrl, context || "");

        return NextResponse.json({
            altText,
        });
    } catch (error) {
        console.error("Error generating alt text:", error);
        return NextResponse.json(
            { error: "Failed to generate alt text" },
            { status: 500 }
        );
    }
}