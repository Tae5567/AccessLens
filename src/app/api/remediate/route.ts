// src/app/api/remediate/route.ts
//Remediation API Route 

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { storyId, fix } = await request.json();

        console.log('Remediation request:', { storyId, fix }); // Debug log

        if(!storyId || !fix) {
            return NextResponse.json(
                {error: "Story ID and fix required"},
                { status: 400}
            );
        }

        const managementToken = process.env.STORYBLOK_MANAGEMENT_TOKEN;
        const spaceId = process.env.STORYBLOK_SPACE_ID;

        if(!managementToken || !spaceId) {
             return NextResponse.json(
                {error: "Storyblok Management API credentials not configured. Check STORYBLOK_MANAGEMENT_TOKEN and STORYBLOK_SPACE_ID in .env.local"},
                { status: 500}
            );
        }

        console.log('Fetching story from Management API...'); // Debug log

        // Fetch current story from Management API
        const storyResponse = await fetch(
            `https://mapi.storyblok.com/v1/spaces/${spaceId}/stories/${storyId}`,
            {
                headers: {
                    Authorization: managementToken,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!storyResponse.ok) {
            const errorText = await storyResponse.text();
            console.error('Storyblok Management API error:', storyResponse.status, errorText);
            return NextResponse.json(
                { error: `Failed to fetch story: ${storyResponse.status} ${errorText}` },
                { status: storyResponse.status }
            );
        }

        const storyData = await storyResponse.json();
        console.log('Fetched story:', storyData.story.name); // Debug log

        // For now, just return success without actually modifying
        //Management API requires OAuth so sticking with Content Delivery API for fetch/Read only
        return NextResponse.json({
            success: true,
            message: 'Fix identified but not applied. Management API integration requires additional setup.',
            suggestion: fix,
        });

    } catch (error: any) {
        console.error("Remediation error:", error);
        return NextResponse.json(
            {error: error.message || "Failed to apply fix"},
            {status: 500}
        );
    }
}