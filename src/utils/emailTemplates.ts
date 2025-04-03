import { formatDate } from './formatDate';

interface BookingEmailData {
  studentName: string;
  mentorName: string;
  startTime: string;
  meetingLink: string;
  gigTitle: string;
}

export function generateStudentEmail({
  studentName,
  mentorName,
  startTime,
  meetingLink,
  gigTitle,
}: BookingEmailData): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #4F46E5; margin: 0;">SkillXchange</h1>
      </div>
      
      <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #111827;">Your Scheduled Session on SkillXchange</h2>
        
        <p>Dear ${studentName},</p>
        
        <p>We are thrilled to inform you that your learning session on SkillXchange has been successfully scheduled.</p>
        
        <div style="background-color: #F3F4F6; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Details of Your Session:</h3>
          <p><strong>Mentor Name:</strong> ${mentorName}</p>
          <p><strong>Session Topic:</strong> ${gigTitle}</p>
          <p><strong>Scheduled Time:</strong> ${formatDate(startTime)}</p>
          <p><strong>Google Meet Link:</strong> <a href="${meetingLink}" style="color: #4F46E5;">${meetingLink}</a></p>
        </div>
        
        <p>Please ensure you:</p>
        <ul style="margin-bottom: 20px;">
          <li>Are ready at the scheduled time</li>
          <li>Have a stable internet connection</li>
          <li>Test your audio and video before the session</li>
        </ul>
        
        <p>Thank you for choosing SkillXchange. We look forward to your session!</p>
        
        <p>Best regards,<br>The SkillXchange Team</p>
      </div>
    </div>
  `;
}

export function generateMentorEmail({
  studentName,
  mentorName,
  startTime,
  meetingLink,
  gigTitle,
}: BookingEmailData): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #4F46E5; margin: 0;">SkillXchange</h1>
      </div>
      
      <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #111827;">Your Upcoming Mentorship Session on SkillXchange</h2>
        
        <p>Dear ${mentorName},</p>
        
        <p>We are pleased to confirm your upcoming mentorship session on SkillXchange.</p>
        
        <div style="background-color: #F3F4F6; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Details of Your Session:</h3>
          <p><strong>Student Name:</strong> ${studentName}</p>
          <p><strong>Session Topic:</strong> ${gigTitle}</p>
          <p><strong>Scheduled Time:</strong> ${formatDate(startTime)}</p>
          <p><strong>Google Meet Link:</strong> <a href="${meetingLink}" style="color: #4F46E5;">${meetingLink}</a></p>
        </div>
        
        <p>Please ensure you:</p>
        <ul style="margin-bottom: 20px;">
          <li>Join the session on time</li>
          <li>Have your teaching materials ready</li>
          <li>Test your audio and video before the session</li>
        </ul>
        
        <p>Thank you for being an integral part of SkillXchange. We appreciate your commitment to making a difference.</p>
        
        <p>Best regards,<br>The SkillXchange Team</p>
      </div>
    </div>
  `;
}