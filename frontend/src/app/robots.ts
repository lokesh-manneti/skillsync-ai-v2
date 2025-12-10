import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/', 
        '/chat/', 
        '/resume/', 
        '/upload/', 
        '/roadmap/', 
        '/settings/'
      ],
    },
    sitemap: 'https://skillsync-ai.in/sitemap.xml',
  };
}