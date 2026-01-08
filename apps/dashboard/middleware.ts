import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    // Protect admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
        // Exclude login page from protection
        if (req.nextUrl.pathname === '/admin/login') {
            // If already logged in, redirect to admin dashboard
            if (session) {
                return NextResponse.redirect(new URL('/admin', req.url));
            }
            return res;
        }

        // Require session for all other admin routes
        if (!session) {
            const redirectUrl = req.nextUrl.clone();
            redirectUrl.pathname = '/admin/login';
            return NextResponse.redirect(redirectUrl);
        }

        // Check for admin role
        const { data: adminRole } = await supabase
            .from('admin_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .eq('is_active', true)
            .single();

        if (!adminRole) {
            // User is logged in but not an admin
            console.warn(`Unauthorized access attempt by ${session.user.email}`);
            // Log this activity if possible (middleware context is limited for inserts usually, but supabase client works)

            // Redirect to unauthorized page or home
            return NextResponse.redirect(new URL('/', req.url)); // Or /unauthorized
        }
    }

    return res;
}

export const config = {
    matcher: ['/admin/:path*'],
};
