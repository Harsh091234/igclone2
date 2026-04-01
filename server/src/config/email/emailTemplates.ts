export const getVerificationEmailTemplate = (
  name: string,
  verificationUrl: string,
) => {
  return `
     <div
      style="
        max-width: 480px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 10px;
        overflow: hidden;
        border: 1px solid #e5e7eb;
      "
    >
      <!-- Header -->
      <div
        style="padding: 20px; text-align: center; border-bottom: 1px solid #eee"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
          alt="Logo"
          width="40"
          style="opacity: 0.85"
        />
        <h2 style="margin: 10px 0 0; color: #111; font-weight: 600">
          Instagram Clone
        </h2>
      </div>

      <!-- Body -->
      <div style="padding: 28px; color: #333">
        <h3 style="margin-top: 0; font-weight: 500">Hello ${name},</h3>

        <p style="color: #555">
          Welcome to <b>Instagram Clone</b>. Please confirm your email address
          to get started.
        </p>

        <!-- Button -->
        <div style="text-align: center">
          <a
            href="${verificationUrl}"
            style="
              display: inline-block;
              padding: 12px 22px;
              margin: 20px 0;
              background: #3b3b3b;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 500;
              font-size: 14px;
            "
          >
            Verify Email
          </a>
        </div>

        <p style="font-size: 13px; color: #777">
          Or paste this link into your browser:
        </p>

        <p style="word-break: break-all; color: #555; font-size: 13px">
          ${verificationUrl}
        </p>

        <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee" />

        <p style="font-size: 12px; color: #999">
          If you didn’t create an account, you can safely ignore this email.
        </p>

        <p style="margin-top: 20px; font-size: 14px">— Team Instagram Clone</p>
      </div>
    </div>
  `;
};
