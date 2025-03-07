import { apiClient } from '../api-client';

export async function csPublish(uids: string[]): Promise<void> {
    return; // missing versions!!
    for (const uid of uids) {
        await publishRedirect(uid);
    }
}

async function publishRedirect(uid: string): Promise<void> {
    await apiClient.post(
        `/content_types/settings_redirects/entries/${uid}/publish`,
        {
            "entry": {
                "environments": [
                    "blt5959fd9f1064d0a2",
                    "blt4034d23d942b4e05",
                    "blt5cea3cb74b959639"
                ],
                "locales": [
                    "en-us"
                ]
            },
            "locale": "en-us",
            "version": 2,
            "rules": {
                "approvals": true,
                "publish_all_localized": true
            }
        },
        {
            params: {
                locale: "en-us",
            },
        }
    );
}