export const revalidate = 0;

import prisma from "@/db";
import client from "@/mail";
import { NextResponse } from "next/server";

interface SendEmailProps {
  planName: string;
  bondName: string;
  planDate: string;
  recipients: string[];
}

async function formatEmailContent({
  bondName,
  planName,
  planDate,
}: Omit<SendEmailProps, "recipients">): Promise<string> {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Upcoming Plan Reminder</h2>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
        <p>You have an upcoming plan:</p>
        <ul style="list-style-type: none; padding: 0;">
          <li style="margin: 10px 0;">
            <strong>Bond:</strong> ${bondName}
          </li>
          <li style="margin: 10px 0;">
            <strong>Plan:</strong> ${planName}
          </li>
          <li style="margin: 10px 0;">
            <strong>Date:</strong> ${planDate}
          </li>
        </ul>
      </div>
      <p style="color: #333; font-size: 12px; margin-top: 20px;">Don't wish to receive these emails? <a href="https://bingo-bond.vercel.app/profile" style="color: #007bff; text-decoration: none;">Update your notification preferences here</a></p>
    </div>
  `;
}

async function sendEmail({
  recipients,
  planName,
  bondName,
  planDate,
}: SendEmailProps): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.MAIL_USER) {
      throw new Error("MAIL_USER environment variable is not set");
    }

    const html = await formatEmailContent({ bondName, planName, planDate });

    await client.sendMail({
      to: recipients,
      from: process.env.MAIL_USER,
      subject: `Upcoming Plan: ${planName}`,
      html,
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function GET() {
  try {
    // Get current time in UTC
    const now = new Date();

    const startOfNextDay = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    startOfNextDay.setUTCHours(0, 0, 0, 0);

    const endOfNextDay = new Date(startOfNextDay);
    endOfNextDay.setUTCHours(23, 59, 59, 999);

    const plansTomorrow = await prisma.plan.findMany({
      where: {
        planDate: {
          gte: now,
          lt: endOfNextDay,
        },
        completed: false,
        remindersSent: false,
      },
      include: {
        cell: {
          select: {
            activity: true,
          },
        },
        card: {
          include: {
            bond: {
              include: {
                members: {
                  include: {
                    user: {
                      select: {
                        email: true,
                        emailPreferences: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // Process each plan and send emails
    const emailResults = await Promise.all(
      plansTomorrow.map(async (plan) => {
        try {
          // Get recipients who have email preferences enabled
          const recipients = plan.card.bond.members
            .filter((member) => member.user.emailPreferences)
            .map((member) => member.user.email);

          if (recipients.length === 0) {
            return {
              planId: plan.id,
              success: false,
              error: "No recipients with email preferences enabled",
            };
          }

          // Format date for email
          const planDate = new Date(plan.planDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          // Send email using the activity from the cell
          const emailResult = await sendEmail({
            recipients,
            planName: plan.cell.activity,
            bondName: plan.card.bond.name,
            planDate,
          });

          // Update reminder status if email was sent successfully
          if (emailResult.success) {
            await prisma.plan.update({
              where: { id: plan.id },
              data: { remindersSent: true },
            });
          }

          return {
            planId: plan.id,
            ...emailResult,
          };
        } catch (error) {
          console.error(`Error processing plan ${plan.id}:`, error);
          return {
            planId: plan.id,
            success: false,
            error:
              error instanceof Error ? error.message : "Unknown error occurred",
          };
        }
      })
    );

    // Return response with results
    return NextResponse.json({
      success: true,
      message: "Email reminders processed",
      totalProcessed: plansTomorrow.length,
      successfulSends: emailResults.filter((result) => result.success).length,
    });
  } catch (error) {
    console.error("Error in reminder service:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      {
        status: 500,
      }
    );
  }
}
