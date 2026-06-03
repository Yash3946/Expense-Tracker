# Weekly Expense PDF Email Backend

The React app now calls this authenticated endpoint from `Budget.jsx`:

```txt
POST /report/weekly-email
```

The automatic Monday 8:00 AM email must run in the backend, because frontend code only runs while a user has the browser open.

Install these backend packages if they are not already installed:

```sh
npm install node-cron pdfkit nodemailer
```

Example scheduler:

```js
import cron from "node-cron";
import { sendWeeklyExpenseEmailToAllUsers } from "./services/weeklyExpenseEmail.js";

cron.schedule(
  "0 8 * * 1",
  async () => {
    await sendWeeklyExpenseEmailToAllUsers();
  },
  {
    timezone: "Asia/Kolkata",
  }
);
```

Example route for the frontend "Send Now" button:

```js
router.post("/report/weekly-email", authMiddleware, async (req, res) => {
  await sendWeeklyExpenseEmail(req.user.id);

  res.json({
    message: "Weekly expense PDF mailed successfully",
  });
});
```

The weekly query should filter expenses from the previous Monday 00:00 through the current Monday 00:00, generate the PDF, attach it to a Nodemailer message, and send it to the user's registered email address.
