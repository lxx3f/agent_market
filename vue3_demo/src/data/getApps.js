import { apps as mock } from '@/mock/apps'

// 默认仍用 mock；联调只需把 .env 中 VITE_USE_MOCK 改为 false
const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? 'true') !== 'false'

export async function getApps() {
    if (USE_MOCK) return mock

    return []
}
