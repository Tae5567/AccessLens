//src/app/api/remediate/route.ts
//Remediation API Route

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try{
        const { storyId, fix} = await request.json();

        if(!storyId || !fix) {
            return NextResponse.json(
                {error: "Story ID and fix required"},
                { status: 400}
            );
        }

        const managementToken = process.env.STORYBLOK_MANAGEMENT_TOKEN;
        const spaceId = process.env.STORYBLOK_SPACE_IS;

        if(!managementToken || !spaceId) {
             return NextResponse.json(
                {error: "Storyblok credentials not configured"},
                { status: 500}
            );
        }

        //fetch current story
        const storyResponse = await fetch(
            `https://mapi.storyblok.com/v1/spaces/${spaceId}/stories/${storyId}`,
            {
                headers: {
                Authorization: managementToken,
                },
            }
        );

        if (!storyResponse.ok) {
            throw new Error("Failed to fetch story");
        }

        const storyData = await storyResponse.json();
        const currentStory = storyData.story;

        //apply fic to the content
        const updatedContent = applyFixToContent(currentStory.content, fix);
        //update story in Storyblok
        const updateResponse = await fetch(
            `https://mapi.storyblok.com/v1/spaces/${spaceId}/stories/${storyId}`,
            {
                method: "PUT",
                headers: {
                Authorization: managementToken,
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                story: {
                    ...currentStory,
                    content: updatedContent,
                },
                }),
            }
        );

        if (!updateResponse.ok) {
            throw new Error("failed to update story");
        }

        const result = await updateResponse.json();

        return NextResponse.json({
            success: true,
            story: result.story,
        });
    } catch (error) {
        console.error("Remediation error:", error);
        return NextResponse.json(
            {error: "Failed to apply fix"},
            {status: 500}
        );
    }
}

function applyFixToContent(content: any, fix: any): any {
    //deep clone the content
    const newContent = JSON.parse(JSON.stringify(content));

    switch (fix.type) {
        case "alt-text":
            return applyAltTextFix(newContent, fix);
        case "aria-label":
            return applyAriaLabelFix(newContent, fix);
        case "heading-structure":
            return applyHeadingFix(newContent, fix);
        default:
            return newContent;
    }
}

function applyAltTextFix(content: any, fix: any): any {
    function updateComponent(component: any): any {
        if (component.component === "image" && component._uid === fix.componentId) {
            return {
                ...component,
                alt: fix.suggestion,
            };
        }

        if (component.body && Array.isArray(component.body)) {
            return {
                ...component,
                body: component.body.map(updateComponent),
            };
        }

        return component;
    }

    return updateComponent(content);
}


function applyAriaLabelFix(content: any, fix: any): any {
    function updatedComponent(component: any): any {
        if (component._uid === fix.componentId) {
            return {
                ...component,
                "aria-label": fix.suggestion,
            };
        }

        if (component.body && Array.isArray(component.body)) {
            return {
                ...component,
                body: component.body.map(updatedComponent),
            };
        }

        return component;
    }

    return updatedComponent(content);
}

function applyHeadingFix(content: any, fix: any): any {
    function updateComponent(component: any): any {
        if (component._uid === fix.componentId && component.component === "heading") {
            return {
                ...component,
                level: fix.suggestedLevel,
            };
        }

        if (component.body && Array.isArray(component.body)) {
            return {
                ...component,
                body: component.body.map(updateComponent),
            };
        }

        return component;
    }
    return updateComponent(content);
}