import { NextRequest, NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validation/contact-schema';
import { checkRateLimit } from '@/lib/rate-limit';
import { env } from '@/lib/env';
import { Resend } from 'resend';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    // 1. Resolve client IP for rate limiting
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    // 2. Check rate limit: 5 submissions per 10 minutes (600s)
    const rateLimit = await checkRateLimit(`contact:${ip}`, 5, 600);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please wait a few minutes before sending another message.',
          reset: rateLimit.reset,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.reset),
            'X-RateLimit-Limit': String(rateLimit.limit),
            'X-RateLimit-Remaining': String(rateLimit.remaining),
          },
        }
      );
    }

    // 3. Parse and validate payload
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Malformed JSON payload.' },
        { status: 400 }
      );
    }

    const validation = contactSchema.safeParse(body);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        const field = err.path.join('.');
        fieldErrors[field] = err.message;
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed. Please review the highlighted fields.',
          fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, subject, message, honeypot } = validation.data;

    // 4. Anti-spam honeypot verification
    if (honeypot && honeypot.length > 0) {
      // Silently return success to discard spam bots without feedback
      return NextResponse.json({ success: true, delivered: true }, { status: 200 });
    }

    // 5. Send message via Resend if API key is configured
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const recipient = env.CONTACT_EMAIL_RECIPIENT || 'rana.prince1806@gmail.com';

        const { data, error } = await resend.emails.send({
          from: 'Prince Rana Portfolio <contact@ranaprince.dev>',
          to: [recipient],
          replyTo: email,
          subject: `[Portfolio Dispatch] ${subject} - from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #05070D; color: #E2E8F0; border-radius: 12px; border: 1px solid rgba(0, 240, 255, 0.2);">
              <div style="border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 16px; margin-bottom: 20px;">
                <h2 style="color: #00F0FF; margin: 0; font-size: 20px;">New Portfolio Dispatch</h2>
                <p style="color: #94A3B8; font-size: 12px; margin: 4px 0 0;">Received via ranaprince.dev contact terminal</p>
              </div>
              <div style="margin-bottom: 16px;">
                <strong style="color: #94A3B8; font-size: 12px; text-transform: uppercase;">From:</strong>
                <p style="margin: 4px 0; font-size: 14px; color: #FFFFFF;">${name} &lt;${email}&gt;</p>
              </div>
              <div style="margin-bottom: 16px;">
                <strong style="color: #94A3B8; font-size: 12px; text-transform: uppercase;">Subject:</strong>
                <p style="margin: 4px 0; font-size: 14px; color: #FFFFFF;">${subject}</p>
              </div>
              <div style="margin-bottom: 24px;">
                <strong style="color: #94A3B8; font-size: 12px; text-transform: uppercase;">Message:</strong>
                <div style="margin-top: 8px; padding: 16px; background: rgba(255, 255, 255, 0.03); border-radius: 8px; border-left: 3px solid #00F0FF; white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #CBD5E1;">${message}</div>
              </div>
              <div style="font-size: 11px; color: #64748B; border-top: 1px solid rgba(255, 255, 255, 0.1); pt: 12px;">
                Prince Rana Portfolio &bull; SDE &bull; AI
              </div>
            </div>
          `,
        });

        if (error) {
          console.error('Resend transmission error:', error);
          return NextResponse.json(
            {
              success: false,
              error: 'Email delivery service encountered an issue. Please reach out directly to rana.prince1806@gmail.com.',
            },
            { status: 502 }
          );
        }

        return NextResponse.json(
          {
            success: true,
            delivered: true,
            id: data?.id,
            message: 'Your message has been successfully transmitted.',
          },
          { status: 200 }
        );
      } catch (err) {
        console.error('Email sending exception:', err);
        return NextResponse.json(
          {
            success: false,
            error: 'Failed to dispatch email. Please use direct email at rana.prince1806@gmail.com.',
          },
          { status: 500 }
        );
      }
    }

    // 6. Graceful local development mode (no RESEND_API_KEY configured)
    console.log('[Contact API Dev Mode] Message received:', {
      name,
      email,
      subject,
      messageLength: message.length,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        delivered: true,
        devMode: true,
        message: 'Message received and logged in development mode.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected contact route error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An internal error occurred while processing your request.',
      },
      { status: 500 }
    );
  }
}
