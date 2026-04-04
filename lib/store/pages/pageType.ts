export interface Page {
_id?: string 
title?: string
slug?: string
content?: string
status?: string
type?: string
template?: string
sections?: any[]
seo?: { metaTitle?: string; metaDescription?: string; }
createdAt?: string
updatedAt?: string
isHomepage?: boolean
}
