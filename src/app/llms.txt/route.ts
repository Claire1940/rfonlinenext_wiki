import { getAllContent, CONTENT_TYPES, type ContentType } from '@/lib/content'
import { routing } from '@/i18n/routing'

// 构建时静态生成（内容不随请求变化）。OpenNext/Workers 运行时无文件系统，
// 若保持 dynamic 会在请求时调 getAllContent→fs.readdirSync 而 500；force-static
// 让其在 build 阶段生成、运行时按静态资源返回。
export const dynamic = 'force-static'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rfonlinenext.wiki'
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'RF Online Next Wiki'

  const lines: string[] = []
  lines.push(`# ${siteName}`)
  lines.push('')
  lines.push(`> ${siteName} is a comprehensive fan-made resource for RF Online Next, the cross-platform sci-fi MMORPG, providing codes, Biosuit class guides, Sacred Weapon info, world boss strategies, and PvP tactics.`)
  lines.push('')
  lines.push(`Website: ${baseUrl}`)
  lines.push(`Languages: ${routing.locales.join(', ')}`)
  lines.push('')

  for (const contentType of CONTENT_TYPES) {
    try {
      const articles = await getAllContent(contentType as ContentType, 'en')
      if (articles.length === 0) continue

      lines.push(`## ${contentType.charAt(0).toUpperCase() + contentType.slice(1)}`)
      lines.push('')
      for (const article of articles) {
        const url = `${baseUrl}/${contentType}/${article.slug}`
        const title = article.frontmatter.title || article.slug
        const desc = article.frontmatter.description ? `: ${article.frontmatter.description}` : ''
        lines.push(`- [${title}](${url})${desc}`)
      }
      lines.push('')
    } catch {
      // skip content types that fail to load
    }
  }

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
