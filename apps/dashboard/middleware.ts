import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protect admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Exclude login page
        if (request.nextUrl.pathname === '/admin/login') {
            if (user) {
                return NextResponse.redirect(new URL('/admin', request.url))
            }
            return response
        }

        // Require session
        if (!user) {
            const redirectUrl = request.nextUrl.clone()
            redirectUrl.pathname = '/admin/login'
            return NextResponse.redirect(redirectUrl)
        }

        // Check admin role
        const { data: adminRole } = await supabase
            .from('admin_roles')
            .select('role')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .single()

        if (!adminRole) {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    return response
}

export const config = {
    matcher: ['/admin/:path*'],
}
