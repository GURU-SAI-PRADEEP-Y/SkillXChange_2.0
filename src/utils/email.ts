import { supabase } from '../lib/supabase';
import { generateGoogleMeetLink } from './googleMeet';
import { generateStudentEmail, generateMentorEmail } from './emailTemplates';

interface BookingEmailProps {
  student_email: string;
  mentor_email: string;
  start_time: string;
  mentor_name: string;
  student_name: string;
  gig_title: string;
}

export async function sendBookingEmails(booking: BookingEmailProps) {
  try {
    const meetingLink = generateGoogleMeetLink();

    const emailData = {
      studentName: booking.student_name,
      mentorName: booking.mentor_name,
      startTime: booking.start_time,
      meetingLink,
      gigTitle: booking.gig_title,
    };

    // Send email to student
    const { data: studentEmailData, error: studentEmailError } = await supabase.functions.invoke('send-email', {
      body: {
        to: booking.student_email,
        from: 'SkillXchange <notifications@skillxchange.com>',
        subject: 'Your Scheduled Session on SkillXchange',
        html: generateStudentEmail(emailData),
      }
    });

    if (studentEmailError) {
      console.error('Error sending student email:', studentEmailError);
      // Continue with mentor email even if student email fails
    }

    // Send email to mentor
    const { data: mentorEmailData, error: mentorEmailError } = await supabase.functions.invoke('send-email', {
      body: {
        to: booking.mentor_email,
        from: 'SkillXchange <notifications@skillxchange.com>',
        subject: 'Your Upcoming Mentorship Session on SkillXchange',
        html: generateMentorEmail(emailData),
      }
    });

    if (mentorEmailError) {
      console.error('Error sending mentor email:', mentorEmailError);
      // Continue execution even if mentor email fails
    }

    // Return success even if one email succeeds
    return {
      success: true,
      studentEmail: !studentEmailError,
      mentorEmail: !mentorEmailError
    };

  } catch (error) {
    console.error('Error in sendBookingEmails:', error);
    // Don't throw the error, return a status object instead
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send booking emails'
    };
  }
}