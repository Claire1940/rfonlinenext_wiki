import type { LucideIcon } from 'lucide-react'
import { BookOpen, Download, Cpu, Users, Rocket } from 'lucide-react'

export interface NavigationItem {
	key: string // 用于翻译键，如 'codes' -> t('nav.codes')
	path: string // URL 路径，如 '/codes'
	icon: LucideIcon // Lucide 图标组件
	isContentType: boolean // 是否对应 content/ 目录
}

// RF Online Next 内容导航配置
// 5 个内容分类：guide / download / requirements / classes / release
// 顺序按用户自然流程：入门 → 下载 → 配置 → 职业 → 上线信息
export const NAVIGATION_CONFIG: NavigationItem[] = [
	{
		key: 'guide',
		path: '/guide',
		icon: BookOpen,
		isContentType: true,
	},
	{
		key: 'download',
		path: '/download',
		icon: Download,
		isContentType: true,
	},
	{
		key: 'requirements',
		path: '/requirements',
		icon: Cpu,
		isContentType: true,
	},
	{
		key: 'classes',
		path: '/classes',
		icon: Users,
		isContentType: true,
	},
	{
		key: 'release',
		path: '/release',
		icon: Rocket,
		isContentType: true,
	},
]

// 从配置派生内容类型列表（用于路由和内容加载）
export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map(
	(item) => item.path.slice(1),
) // 移除开头的 '/' -> ['guide', 'download', 'requirements', 'classes', 'release']

export type ContentType = (typeof CONTENT_TYPES)[number]

// 辅助函数：验证内容类型
export function isValidContentType(type: string): type is ContentType {
	return CONTENT_TYPES.includes(type as ContentType)
}
