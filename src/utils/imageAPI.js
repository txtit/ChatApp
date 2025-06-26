// File API utilities cho tạo hình ảnh và image prompts
// Bạn có thể tích hợp với OpenAI DALL-E, Midjourney, Stable Diffusion, hoặc các API khác

/**
 * Tích hợp với OpenAI DALL-E API
 */
export const generateImageWithDALLE = async (prompt, apiKey) => {
    try {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "dall-e-3",
                prompt: `Create a kid-friendly, educational, colorful cartoon illustration: ${prompt}`,
                n: 1,
                size: "1024x1024"
            })
        });

        if (response.ok) {
            const data = await response.json();
            return {
                success: true,
                imageUrl: data.data[0].url,
                revisedPrompt: data.data[0].revised_prompt
            };
        } else {
            throw new Error(`API Error: ${response.status}`);
        }
    } catch (error) {
        console.error('DALL-E API Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Tích hợp với Stability AI (Stable Diffusion)
 */
export const generateImageWithStabilityAI = async (prompt, apiKey) => {
    try {
        const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                text_prompts: [
                    {
                        text: `${prompt}, cartoon style, educational, colorful, kid-friendly, high quality`,
                        weight: 1
                    }
                ],
                cfg_scale: 7,
                height: 512,
                width: 512,
                steps: 30,
                samples: 1
            })
        });

        if (response.ok) {
            const data = await response.json();
            // Convert base64 to blob URL
            const base64 = data.artifacts[0].base64;
            const blob = base64ToBlob(base64, 'image/png');
            const imageUrl = URL.createObjectURL(blob);

            return {
                success: true,
                imageUrl: imageUrl
            };
        } else {
            throw new Error(`API Error: ${response.status}`);
        }
    } catch (error) {
        console.error('Stability AI API Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Tạo image prompts từ nội dung slide sử dụng OpenAI GPT
 */
export const generateImagePromptsWithGPT = async (slideContent, apiKey) => {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "Bạn là một chuyên gia tạo prompts để tạo hình ảnh minh họa cho trẻ em. Hãy tạo 3-5 prompts ngắn gọn, phù hợp với nội dung bài học, phong cách cartoon, màu sắc tươi sáng, thân thiện với trẻ em."
                    },
                    {
                        role: "user",
                        content: `Tạo image prompts cho nội dung bài học sau: "${slideContent}"`
                    }
                ],
                max_tokens: 200,
                temperature: 0.7
            })
        });

        if (response.ok) {
            const data = await response.json();
            const content = data.choices[0].message.content;

            // Parse prompts từ response
            const prompts = content.split('\n')
                .filter(line => line.trim())
                .map(line => line.replace(/^\d+\.?\s*-?\s*/, '').trim())
                .filter(prompt => prompt.length > 0);

            return {
                success: true,
                prompts: prompts
            };
        } else {
            throw new Error(`API Error: ${response.status}`);
        }
    } catch (error) {
        console.error('GPT API Error:', error);
        return {
            success: false,
            error: error.message,
            prompts: []
        };
    }
};

/**
 * Tích hợp với Gemini API (Google)
 */
export const generateImagePromptsWithGemini = async (slideContent, apiKey) => {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Tạo 3-5 prompts tiếng Anh ngắn gọn để tạo hình ảnh minh họa cho trẻ em về nội dung: "${slideContent}". Mỗi prompt trên một dòng, phong cách cartoon, màu sắc tươi sáng, educational.`
                    }]
                }]
            })
        });

        if (response.ok) {
            const data = await response.json();
            const content = data.candidates[0].content.parts[0].text;

            const prompts = content.split('\n')
                .filter(line => line.trim())
                .map(line => line.replace(/^\d+\.?\s*-?\s*/, '').trim())
                .filter(prompt => prompt.length > 0);

            return {
                success: true,
                prompts: prompts
            };
        } else {
            throw new Error(`API Error: ${response.status}`);
        }
    } catch (error) {
        console.error('Gemini API Error:', error);
        return {
            success: false,
            error: error.message,
            prompts: []
        };
    }
};

/**
 * Helper function: Convert base64 to blob
 */
function base64ToBlob(base64, mimeType) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
}

/**
 * Hàm tổng hợp - tự động thử các API theo thứ tự ưu tiên
 */
export const generateImageSmartly = async (prompt, config = {}) => {
    const { openaiKey, stabilityKey, preferredAPI = 'openai' } = config;

    // Thử API theo thứ tự ưu tiên
    const apis = preferredAPI === 'openai'
        ? [
            { name: 'openai', fn: generateImageWithDALLE, key: openaiKey },
            { name: 'stability', fn: generateImageWithStabilityAI, key: stabilityKey }
        ]
        : [
            { name: 'stability', fn: generateImageWithStabilityAI, key: stabilityKey },
            { name: 'openai', fn: generateImageWithDALLE, key: openaiKey }
        ];

    for (const api of apis) {
        if (api.key) {
            console.log(`Trying ${api.name} API...`);
            const result = await api.fn(prompt, api.key);
            if (result.success) {
                console.log(`${api.name} API succeeded`);
                return result;
            }
        }
    }

    // Nếu tất cả API đều fail, return fallback
    console.log('All APIs failed, using fallback');
    return {
        success: false,
        error: 'All APIs failed',
        fallbackUrl: `https://source.unsplash.com/512x512/?${encodeURIComponent(prompt)}`
    };
};

/**
 * Hàm tổng hợp cho image prompts
 */
export const generatePromptsSmartly = async (slideContent, config = {}) => {
    const { openaiKey, geminiKey, preferredAPI = 'openai' } = config;

    const apis = preferredAPI === 'openai'
        ? [
            { name: 'openai', fn: generateImagePromptsWithGPT, key: openaiKey },
            { name: 'gemini', fn: generateImagePromptsWithGemini, key: geminiKey }
        ]
        : [
            { name: 'gemini', fn: generateImagePromptsWithGemini, key: geminiKey },
            { name: 'openai', fn: generateImagePromptsWithGPT, key: openaiKey }
        ];

    for (const api of apis) {
        if (api.key) {
            console.log(`Trying ${api.name} API for prompts...`);
            const result = await api.fn(slideContent, api.key);
            if (result.success && result.prompts.length > 0) {
                console.log(`${api.name} API succeeded for prompts`);
                return result.prompts;
            }
        }
    }

    // Fallback to local generation
    console.log('All prompt APIs failed, using local generation');
    return [];
};

// Export config mẫu
export const defaultConfig = {
    // Đặt API keys của bạn ở đây hoặc trong environment variables
    openaiKey: process.env.REACT_APP_OPENAI_API_KEY,
    stabilityKey: process.env.REACT_APP_STABILITY_API_KEY,
    geminiKey: process.env.REACT_APP_GEMINI_API_KEY,
    preferredAPI: 'openai' // hoặc 'stability', 'gemini'
};
