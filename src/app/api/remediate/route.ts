//src/app/api/remediate/route.ts
//Remediation API Route

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try{
        const { storyId, fix } = await request.json();

        if(!storyId || !fix) {
            return NextResponse.json(
                {error: "Story ID and fix required"},
                { status: 400}
            );
        }

        const managementToken = process.env.STORYBLOK_MANAGEMENT_TOKEN;
        const spaceId = process.env.STORYBLOK_SPACE_ID; // Fixed typo

        if(!managementToken || !spaceId) {
             return NextResponse.json(
                {error: "Storyblok credentials not configured. Add STORYBLOK_MANAGEMENT_TOKEN and STORYBLOK_SPACE_ID to .env.local"},
                { status: 500}
            );
        }

        // Fetch current story
        const storyResponse = await fetch(
            `https://mapi.storyblok.com/v1/spaces/${spaceId}/stories/${storyId}`,
            {
                headers: {
                    Authorization: managementToken,
                },
            }
        );

        if (!storyResponse.ok) {
            const errorText = await storyResponse.text();
            console.error('Storyblok fetch error:', errorText);
            throw new Error("Failed to fetch story");
        }

        const storyData = await storyResponse.json();
        const currentStory = storyData.story;

        // Apply fix to the content
        const updatedContent = applyFixToContent(currentStory.content, fix);
        
        // Update story in Storyblok
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
            const errorText = await updateResponse.text();
            console.error('Storyblok update error:', errorText);
            throw new Error("Failed to update story");
        }

        const result = await updateResponse.json();

        return NextResponse.json({
            success: true,
            story: result.story,
        });
    } catch (error: any) {
        console.error("Remediation error:", error);
        return NextResponse.json(
            {error: error.message || "Failed to apply fix"},
            {status: 500}
        );
    }
}

function applyFixToContent(content: any, fix: any): any {
    // Deep clone the content
    const newContent = JSON.parse(JSON.stringify(content));

    switch (fix.type) {
        case "alt-text":
            return applyAltTextFix(newContent, fix);
        case "aria-label":
            return applyAriaLabelFix(newContent, fix);
        case "heading-structure":
            return applyHeadingFix(newContent, fix);
        case "color-contrast":
            return applyColorContrastFix(newContent, fix);
        case "focus-management":
            return applyFocusManagementFix(newContent, fix);
        default:
            console.warn(`Unknown fix type: ${fix.type}`);
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

function applyColorContrastFix(content: any, fix: any): any {
    function updateComponent(component: any): any {
        if (component._uid === fix.componentId) {
            return {
                ...component,
                color: fix.suggestedColor,
                backgroundColor: fix.suggestedBackgroundColor,
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

function applyFocusManagementFix(content: any, fix: any): any {
    function updateComponent(component: any): any {
        if (component._uid === fix.componentId) {
            return {
                ...component,
                tabindex: fix.suggestedTabIndex || "0",
                focusable: true,
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