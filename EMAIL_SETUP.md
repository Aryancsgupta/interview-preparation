# Email Setup Instructions

## For Production (Gmail)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Copy the 16-character password

3. **Add to .env file**:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
EMAIL_FROM=your-email@gmail.com
ADMIN_EMAIL=aryangupta1467@gmail.com
```

## For Development/Testing

You can use **Ethereal Email** (free test email service):

1. Go to https://ethereal.email/
2. Create a test account
3. Add to .env:
```env
ETHEREAL_USER=your-ethereal-email@ethereal.email
ETHEREAL_PASS=your-ethereal-password
ADMIN_EMAIL=aryangupta1467@gmail.com
```

Note: Ethereal emails are only for testing and won't actually send emails.

## Features

- **Feedback**: Users can submit feedback which is emailed to admin
- **Question Suggestions**: Users can suggest questions which are emailed to admin with full details

## Email Format

Both feedback and question suggestions are sent as HTML emails with:
- User information (name, email)
- Timestamp
- Formatted content
- Professional styling

