import { getAccessToken } from './firebaseAuth';

/**
 * 1. Google Drive Integration
 * Creates a dedicated "TinPath - Ôn Thi Tin Học" folder and saves notes/exam PDFs
 */
export async function createStudyFileOnDrive(fileName: string, content: string, mimeType = 'text/plain') {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Bạn cần đăng nhập Google để lưu trữ tệp lên Google Drive');
  }

  const metadata = {
    name: fileName,
    description: 'Tài liệu ôn thi Tin học THPT từ nền tảng TinPath',
    mimeType: mimeType,
  };

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', new Blob([content], { type: mimeType }));

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Không thể tạo tệp trên Google Drive');
  }

  const data = await res.json();
  return {
    fileId: data.id,
    webViewLink: `https://drive.google.com/file/d/${data.id}/view`,
  };
}

/**
 * 2. Google Sheets Integration
 * Exports student scores, class gradebook, or exam analytics to a new Google Spreadsheet
 */
export async function exportToGoogleSheets(title: string, headers: string[], rows: (string | number)[][]) {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Bạn cần đăng nhập Google để xuất bảng điểm sang Google Sheets');
  }

  // Create spreadsheet
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: `${title} - TinPath (${new Date().toLocaleDateString('vi-VN')})`,
      },
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Không thể tạo bảng tính Google Sheets');
  }

  const sheetData = await createRes.json();
  const spreadsheetId = sheetData.spreadsheetId;

  // Append data
  const values = [headers, ...rows];
  const appendRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values,
      }),
    }
  );

  if (!appendRes.ok) {
    const err = await appendRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Không thể ghi dữ liệu vào Google Sheets');
  }

  return {
    spreadsheetId,
    spreadsheetUrl: sheetData.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
  };
}

/**
 * 3. Google Docs Integration
 * Creates a study guide or exam review document in Google Docs
 */
export async function createGoogleDocGuide(title: string, markdownContent: string) {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Bạn cần đăng nhập Google để tạo tài liệu Google Docs');
  }

  // 1. Create document
  const createRes = await fetch('https://docs.googleapis.com/v1/documents', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Không thể tạo tài liệu Google Docs');
  }

  const doc = await createRes.json();
  const documentId = doc.documentId;

  // 2. Insert text
  await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [
        {
          insertText: {
            location: { index: 1 },
            text: `${title}\nNền tảng Ôn thi Tin học THPT TinPath\nNgày tạo: ${new Date().toLocaleDateString('vi-VN')}\n\n${markdownContent}`,
          },
        },
      ],
    }),
  });

  return {
    documentId,
    documentUrl: `https://docs.google.com/document/d/${documentId}/edit`,
  };
}

/**
 * 4. Google Slides Integration
 * Creates a presentation review deck
 */
export async function createGoogleSlidesDeck(title: string, slideTopics: { heading: string; points: string[] }[]) {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Bạn cần đăng nhập Google để tạo bài giảng Google Slides');
  }

  const createRes = await fetch('https://slides.googleapis.com/v1/presentations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Không thể tạo bài trình chiếu Google Slides');
  }

  const presentation = await createRes.json();
  return {
    presentationId: presentation.presentationId,
    presentationUrl: `https://docs.google.com/presentation/d/${presentation.presentationId}/edit`,
  };
}

/**
 * 5. Google Calendar Integration
 * Adds exam milestone or study schedule reminders to Google Calendar
 */
export async function addStudyEventToCalendar(summary: string, description: string, startIso: string, endIso: string) {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Bạn cần đăng nhập Google để thêm sự kiện vào Google Calendar');
  }

  const eventPayload = {
    summary: `[TinPath] ${summary}`,
    description: `${description}\n\nĐược đồng bộ tự động từ TinPath - Nền tảng ôn thi Tin học THPT.`,
    start: {
      dateTime: startIso,
      timeZone: 'Asia/Ho_Chi_Minh',
    },
    end: {
      dateTime: endIso,
      timeZone: 'Asia/Ho_Chi_Minh',
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 30 },
        { method: 'email', minutes: 60 },
      ],
    },
  };

  const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventPayload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Không thể tạo sự kiện Google Calendar');
  }

  const event = await res.json();
  return {
    eventId: event.id,
    htmlLink: event.htmlLink,
  };
}

/**
 * 6. Google Tasks Integration
 * Syncs daily 10-question challenge and assignments to Google Tasks
 */
export async function addStudyTaskToGoogleTasks(title: string, notes?: string, dueIso?: string) {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Bạn cần đăng nhập Google để đồng bộ Google Tasks');
  }

  const res = await fetch('https://tasks.googleapis.com/tasks/v1/lists/@default/tasks', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: `[TinPath] ${title}`,
      notes: notes || 'Hoàn thành nhiệm vụ ôn thi Tin học THPT hôm nay',
      due: dueIso,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Không thể tạo tác vụ trên Google Tasks');
  }

  return res.json();
}

/**
 * 7. Gmail Integration
 * Sends test results and performance report card to student email
 */
export async function sendScoreReportEmail(recipientEmail: string, subject: string, bodyText: string) {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Bạn cần đăng nhập Google để gửi email qua Gmail');
  }

  const emailLines = [
    `To: ${recipientEmail}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
    '',
    bodyText,
  ];

  const rawMessage = btoa(unescape(encodeURIComponent(emailLines.join('\r\n'))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: rawMessage }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Không thể gửi email báo cáo qua Gmail');
  }

  return res.json();
}

/**
 * 8. Google Meet Integration
 * Creates instant or scheduled Google Meet link for study group or teacher tutoring
 */
export async function createGoogleMeetRoom() {
  // Can create via calendar event with conferenceData
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Bạn cần đăng nhập Google để tạo phòng Google Meet');
  }

  const now = new Date();
  const later = new Date(now.getTime() + 60 * 60 * 1000);

  const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      summary: 'Phòng học nhóm ôn thi Tin học THPT - TinPath Meet',
      description: 'Phòng học trực tuyến Google Meet do nền tảng TinPath khởi tạo.',
      start: { dateTime: now.toISOString() },
      end: { dateTime: later.toISOString() },
      conferenceData: {
        createRequest: {
          requestId: `tinpath-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Không thể tạo liên kết phòng Google Meet');
  }

  const data = await res.json();
  const meetUri = data.conferenceData?.entryPoints?.find((ep: any) => ep.entryPointType === 'video')?.uri;
  return {
    meetUri: meetUri || 'https://meet.google.com/new',
    eventId: data.id,
  };
}

/**
 * 9. Google Contacts (People API)
 * Loads contacts to invite study group partners
 */
export async function getGoogleContacts() {
  const token = await getAccessToken();
  if (!token) return [];

  const res = await fetch(
    'https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,photos&pageSize=30',
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) return [];
  const data = await res.json();
  return (data.connections || []).map((person: any) => ({
    name: person.names?.[0]?.displayName || 'Người dùng',
    email: person.emailAddresses?.[0]?.value || '',
    photo: person.photos?.[0]?.url || '',
  }));
}
